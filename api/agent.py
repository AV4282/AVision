"""
The report agent: turns one photo and a map position into a ready-to-review report.

The work itself is quick and happens once per report (see work_out):

    - the nearest street address                                   (geocode.py)
    - what the map says about the spot: nearest MARTA station,
      inside GSU's campus or not, inside the city or not           (routing.py)
    - ONE Gemini request that looks at the photo, picks the
      department and writes the message and phone script           (gemini.py)

Gemini can only pick a department listed in data/contacts.json, and the contact
details always come from that file. If Gemini can't be asked, fixed map rules
pick instead (routing.find_owner), so a report always has somewhere to go.

A Microsoft Foundry agent steers each report through four tools:

    1. analyze_photo     what the photo shows
    2. find_owner        which department it goes to, and why
    3. look_up_address   the street address of the spot
    4. draft_report      the message for that department

The agent decides which tool to call next and when to stop (it stops after
step 1 if the photo shows nothing to report). The tools hand it short summaries
of the work above. They take no input, so the agent cannot pass in or change a
department, a contact or an address: nothing it says can put a made-up phone
number in front of a user.

To keep a report quick, the work starts the moment the request arrives, at the
same time as the agent, and the agent's tools simply wait for it. If the agent
is slow, fails, or isn't set up, the finished work is returned without it
("direct" mode) rather than making the person wait. The result says which way
it went. After a failure the agent is left out for a minute, so one bad
spell doesn't slow every report.

draft_for_ticket() is the same work for a ticket that is being posted: it uses
what the person typed (plus the photo, when there is one), so every posted
ticket comes with a message to send. It doesn't involve the Foundry agent.

Settings (api/.env), all optional. With none, reports run in direct mode.

    Foundry agent (Microsoft Entra sign-in; the full Agent Service):
        FOUNDRY_PROJECT_ENDPOINT   https://<resource>.services.ai.azure.com/api/projects/<project>
        AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET   the server's login

    Foundry model with a key (backup when a server login can't be created):
        FOUNDRY_OPENAI_URL         https://<resource>.openai.azure.com/openai/v1/
        FOUNDRY_API_KEY

    Both:
        FOUNDRY_MODEL              deployment name, default gpt-5-mini
        FOUNDRY_REASONING_EFFORT   e.g. "low" for gpt-5 models (faster); leave unset for others
        FOUNDRY_AGENT_NAME         default avision-report-agent
        FOUNDRY_GRACE_SECONDS      how long to wait for the agent once the report is ready, default 12
"""

import hashlib
import json
import logging
import os
import threading
import time
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field

import gemini
import geocode
import routing

log = logging.getLogger("avision.agent")
_server_log = logging.getLogger("uvicorn.error")  # the one logger whose routine lines reach journalctl

FOUNDRY_MODEL = os.getenv("FOUNDRY_MODEL", "gpt-5-mini")
FOUNDRY_AGENT_NAME = os.getenv("FOUNDRY_AGENT_NAME", "avision-report-agent")
FOUNDRY_TIMEOUT_SECONDS = 30  # per model turn
MAX_TURNS = 6  # a report needs three turns (or five, one tool at a time); one spare
# Once the report itself is ready, how long the agent gets to finish steering it
# before the report is returned without it.
FOUNDRY_GRACE_SECONDS = float(os.getenv("FOUNDRY_GRACE_SECONDS", "12"))
FOUNDRY_PAUSE_SECONDS = 60  # after the agent fails or is too slow, leave it out for this long

INSTRUCTIONS = """You are the report agent for AVision, a site where people in Atlanta report everyday \
problems to the department that can fix them. Each message you get is one new report: a photo (already on the \
server) and a map position.

Work through your tools like this:
1. Call analyze_photo first, on its own, to find out what the photo shows.
2. If it says the photo is not reportable, stop there. Do not call the other tools.
3. Otherwise call find_owner, look_up_address and draft_report together, all three in the same step.

The tools already know the photo and the position, so they take no input. You never choose the department, a \
contact detail or an address yourself, and you never state a phone number, email or link.

When you are done, reply with one or two plain sentences for the person who took the photo: what was found \
and which department it is going to, or why there is nothing to report. Call findings "possible" issues or \
barriers. Never call anything illegal or a violation."""

# What the model is told about each tool. None of them take input (see the module notes).
TOOL_DESCRIPTIONS = {
    "analyze_photo": "Look at this report's photo. Returns whether it shows a reportable problem, the issue "
    "type, a short title, how serious it is and how sure the analysis is. Always call this first, on its own.",
    "find_owner": "Find out which department this report goes to (GSU Facilities, Georgia Tech, the City of "
    "Atlanta or MARTA), chosen from what the photo shows and what the map says about the spot, and why.",
    "look_up_address": "Get the nearest street address for this report's map position.",
    "draft_report": "Get the report message and phone script written for the department.",
}
TOOL_ORDER = list(TOOL_DESCRIPTIONS)
NO_INPUT = {"type": "object", "properties": {}, "required": [], "additionalProperties": False}

# The work and the agent each get their own few threads, so a slow agent can
# never hold up the work, or the other way round.
_work_pool = ThreadPoolExecutor(max_workers=4, thread_name_prefix="avision-work")
_agent_pool = ThreadPoolExecutor(max_workers=4, thread_name_prefix="avision-agent")


@dataclass
class Job:
    """One report being worked on: what came in, what was found, and how the agent got on."""

    photo: bytes
    lat: float
    lng: float
    photo_links: list[str] = field(default_factory=list)  # public links to the ticket's photos, for the message
    # Filled in by _prepare(), once, for everyone to read.
    analysis: dict | None = None
    routing: dict | None = None
    address: str | None = None
    draft: dict | None = None
    screening: dict | None = None  # what was flagged as not a real report, if anything
    failed: bool = False
    timings: dict = field(default_factory=dict)  # where the time went (see work_out)
    ready: threading.Event = field(default_factory=threading.Event)  # set when the work is done or has failed
    # The agent's side.
    tool_calls: list[str] = field(default_factory=list)  # the order the agent called them in
    turns: int = 0  # how many times the agent's model was asked
    steered: threading.Event = field(default_factory=threading.Event)  # set when the agent needs nothing more
    agent_problem: str | None = None  # why the agent wasn't used, when it wasn't


# ---------- the work ----------

# A Gemini request is the slow, costly part, and the same one is often wanted
# twice (the agent test and the real run, or a form posted again unchanged), so
# recent answers are kept.
_answers: OrderedDict[str, dict] = OrderedDict()
_answers_lock = threading.Lock()
ANSWERS_KEPT = 200


def _ask_gemini(photo: bytes | None, typed: dict | None, facts: list[str], options: dict, hint: str | None) -> dict:
    """The one Gemini request for a report (see gemini.py). Repeats of the same question come from memory."""
    asked = hashlib.sha256()
    asked.update(photo or b"")
    asked.update(json.dumps([typed, facts, list(options), hint], sort_keys=True).encode())
    key = asked.hexdigest()
    with _answers_lock:
        if key in _answers:
            _answers.move_to_end(key)
            return _answers[key]
    if photo:
        answer = gemini.report_from_photo(photo, facts, options, hint, typed)
    else:
        answer = gemini.report_from_text(typed, facts, options, hint)
    answer = {**answer, "cost": gemini.last_cost()}
    with _answers_lock:
        _answers[key] = answer
        while len(_answers) > ANSWERS_KEPT:
            _answers.popitem(last=False)
    return answer


def work_out(
    *,
    lat: float,
    lng: float,
    photo: bytes | None = None,
    typed: dict | None = None,
    address: str | None = None,
    owner: str | None = None,
    use_ai: bool = True,
    must_see_photo: bool = False,
) -> dict:
    """Everything about one report: {"analysis", "routing", "address", "draft"}.

    `photo` and `typed` (what the person wrote: title, issue_type, description)
    say what the problem is; at least one is needed for Gemini to help. `owner`
    is the department the person picked by hand; leave it out to have it chosen.

    "timings" is added too: where the time went.

    "analysis" is None without a photo. "routing" is {"owner", "rule", "reason",
    "contact", "decided_by"}, where `decided_by` is "gemini", "rules" or
    "person". "draft" is None when Gemini wasn't asked, failed, or found nothing
    to report.

    With `must_see_photo`, a report Gemini can't look at raises (gemini.NotConfigured
    or gemini.GeminiFailed) instead of falling back, because the caller has
    nothing to show without the findings.
    """
    started = time.monotonic()
    place = address or geocode.address_for(lat, lng)
    options = {owner: routing.CONTACTS[owner]} if owner else routing.emailable()
    if not owner:
        # A campus department is only on offer for a spot on its campus.
        blocked = routing.blocked_here(lat, lng)
        options = {name: contact for name, contact in options.items() if name not in blocked}
    # The road only matters for telling a state route from a city street, which
    # only matters while GDOT can be chosen. Skipping the lookup otherwise saves a second.
    road = geocode.nearest_road(lat, lng) if "gdot" in options and not owner else None
    by_rules = routing.find_owner(lat, lng, road)
    looked_up = time.monotonic()

    found = None
    if use_ai and gemini.is_configured() and (photo or typed):
        hint = by_rules["contact"]["short_name"] if by_rules["owner"] in options and not owner else None
        try:
            found = _ask_gemini(photo, typed, routing.location_facts(lat, lng, road, place), options, hint)
        except gemini.GeminiFailed:
            if must_see_photo:
                raise
            log.warning("Gemini couldn't help with this report; using the map rules and a plain message")
    elif must_see_photo:
        raise gemini.NotConfigured

    if owner:
        chosen = {
            "owner": owner,
            "rule": "chosen_by_person",
            "reason": "You chose this department in the form.",
            "contact": routing.CONTACTS[owner],
            "decided_by": "person",
        }
    elif found:
        chosen = {
            "owner": found["owner"],
            "rule": "ai_choice",
            "reason": found["reason"] or by_rules["reason"],
            "contact": options[found["owner"]],
            "decided_by": "gemini",
        }
    else:
        chosen = {**_emailable(by_rules, options), "decided_by": "rules"}
    # Where the time went, for the log and for anyone wondering why a report was slow.
    # `gemini` is this request's wait; the request's own figures say how long Google took.
    timings = {
        "map_lookups": round(looked_up - started, 1),
        "gemini": round(time.monotonic() - looked_up, 1),
        "gemini_request": found.get("cost") if found else None,
    }
    return {
        "analysis": found.get("analysis") if found else None,
        "routing": chosen,
        "address": place,
        "draft": found["draft"] if found else None,
        # What Gemini flagged as plainly not a real report, if it was asked: see
        # gemini.SCREEN_RULES. None when it wasn't (no AI), so nothing is refused.
        "screening": found.get("screening") if found else None,
        "timings": timings,
    }


def _emailable(by_rules: dict, options: dict) -> dict:
    """The map rules' answer, moved to a department that can be emailed if theirs can't.

    The rules can pick a department with no email on file (GDOT, at the time of
    writing). Reports go out by email, so those go to the general one instead.
    """
    if not options or by_rules["owner"] in options:
        return by_rules
    fallback = "city_of_atlanta" if "city_of_atlanta" in options else next(iter(options))
    return {
        "owner": fallback,
        "rule": by_rules["rule"],
        "reason": f"{by_rules['contact']['short_name']} looks after this spot but has no email address "
        f"on file, so this goes to {options[fallback]['short_name']} instead.",
        "contact": options[fallback],
    }


def _prepare(job: Job):
    """Do the work for a job and store it on the job. Always sets `job.ready`, even on failure."""
    try:
        found = work_out(lat=job.lat, lng=job.lng, photo=job.photo, must_see_photo=True)
        job.timings = found["timings"]
        job.screening = found["screening"]
        job.analysis = found["analysis"]
        job.address = found["address"]
        if job.analysis["is_reportable"]:
            job.routing = found["routing"]
            job.draft = found["draft"]
    except BaseException:
        job.failed = True
        raise
    finally:
        job.ready.set()


# ---------- the agent's four tools ----------
# Each waits for the work, then hands the agent a short summary of one part of it.


def _tool_answer(job: Job, name: str) -> dict:
    job.ready.wait()
    if job.failed:
        return {"error": "This report could not be prepared. Stop here."}
    found = job.analysis
    if name == "analyze_photo":
        return {key: found[key] for key in ("is_reportable", "issue_type", "title", "severity", "confidence")}
    if not found["is_reportable"]:
        return {"error": "The photo is not reportable, so there is nothing more to do."}
    if name == "find_owner":
        return {"department": job.routing["contact"]["short_name"], "why": job.routing["reason"]}
    if name == "look_up_address":
        return {"address": job.address or "No street address found for this spot."}
    if name == "draft_report":
        if job.draft is None:
            return {"error": "The report could not be drafted right now."}
        return {"drafted": True, "subject": job.draft["subject"]}
    return {"error": f"There is no tool called {name}."}


def _call_tool(job: Job, name: str) -> dict:
    answer = _tool_answer(job, name)
    if name in TOOL_DESCRIPTIONS:
        job.tool_calls.append(name)
    # Once the agent has been through every tool this report needs, nothing it
    # does next changes the result, so whoever is waiting can go ahead.
    needed = TOOL_ORDER if job.analysis and job.analysis["is_reportable"] else TOOL_ORDER[:1]
    if job.failed or all(tool in job.tool_calls for tool in needed):
        job.steered.set()
    return answer


# ---------- running a job ----------

_foundry_paused_until = 0.0


def run(job: Job) -> dict:
    """Work one report out, with the Foundry agent steering if it keeps up, and return it for the web app.

    Raises gemini.NotConfigured or gemini.GeminiFailed if the photo can't be
    analyzed; nothing useful can be returned without that.
    """
    global _foundry_paused_until
    started = time.monotonic()
    work = _work_pool.submit(_prepare, job)
    mode = foundry_mode()
    steering = mode is not None and time.monotonic() >= _foundry_paused_until
    if steering:
        _agent_pool.submit(_steer, job, mode)

    work.result()  # the report itself; raises if it couldn't be made
    ready = time.monotonic()

    orchestrator = "direct"
    if steering:
        if not job.steered.wait(FOUNDRY_GRACE_SECONDS):
            job.agent_problem = (
                f"The Foundry agent was still going {FOUNDRY_GRACE_SECONDS:g} seconds after the report was ready, "
                f"having called {len(job.tool_calls)} of its tools in {job.turns} turn(s)."
            )
            log.warning("%s Returning the report without it", job.agent_problem)
        if job.agent_problem is None:
            orchestrator = mode
        else:
            _foundry_paused_until = time.monotonic() + FOUNDRY_PAUSE_SECONDS
    elif mode:
        job.agent_problem = "The Foundry agent is being left out for a minute after an earlier problem."
    job.timings = {
        **job.timings,
        "waiting_for_agent": round(time.monotonic() - ready, 1),
        "total": round(time.monotonic() - started, 1),
        "agent_turns": job.turns,
    }
    # The agent's problem, if any, stays in the server log; it can name internal details.
    _server_log.info(
        "Report worked out (%s): %s%s",
        orchestrator,
        json.dumps(job.timings),
        f" | agent: {job.agent_problem}" if job.agent_problem else "",
    )
    return _result(job, orchestrator)


def _steer(job: Job, mode: str):
    """The agent's side of a job, on its own thread. Never raises; problems go on the job and in the log."""
    try:
        _run_with_foundry(job, mode)
    except Exception as problem:
        log.exception("Foundry run failed; this report is finished without it")
        job.agent_problem = f"{type(problem).__name__}: {problem}"[:600]
    finally:
        job.steered.set()


def _result(job: Job, orchestrator: str) -> dict:
    analysis = job.analysis
    # Only what the agent had called by now; it may still be finishing its last turn.
    tool_calls = list(job.tool_calls) if orchestrator != "direct" else []
    if not analysis["is_reportable"]:
        return {
            "screening": job.screening,
            "analysis": analysis,
            "owner": None,
            "contact": None,
            "address": None,
            "report": None,
            "summary": f"This doesn't look like a problem to report. {analysis['description']}".strip(),
            "orchestrator": orchestrator,
            "tool_calls": tool_calls,
            "timings": job.timings,
        }

    report = _with_facts(job.draft, job.address, job.lat, job.lng, job.photo_links) if job.draft else None
    return {
        "screening": job.screening,
        "analysis": analysis,
        "owner": _owner_for_app(job.routing),
        "contact": _contact_for_app(job.routing["contact"]),
        "address": job.address,
        "report": report,
        "summary": f"Possible issue found: {analysis['title']}. {job.routing['reason']}",
        "orchestrator": orchestrator,
        "tool_calls": tool_calls,
        "timings": job.timings,
    }


def _owner_for_app(chosen: dict) -> dict:
    return {
        "id": chosen["owner"],
        "name": chosen["contact"]["short_name"],
        "rule": chosen["rule"],
        "reason": chosen["reason"],
        "decided_by": chosen.get("decided_by", "rules"),
    }


def _contact_for_app(contact: dict) -> dict:
    return {key: contact[key] for key in ("name", "phone", "phone_note", "email", "web", "web_label", "hours")}


def _with_facts(draft: dict, address: str | None, lat: float, lng: float, photo_links: list[str] | None) -> dict:
    """The drafted report with the plain facts added under the message.

    The facts are added here, not written by Gemini, so they are always right.
    """
    place = f"{address} ({lat:.5f}, {lng:.5f})" if address else f"{lat:.5f}, {lng:.5f}"
    facts = [f"Location: {place}"]
    if photo_links and len(photo_links) == 1:
        facts.append(f"Photo: {photo_links[0]}")
    elif photo_links:
        facts.append("Photos:")
        facts.extend(photo_links)
    facts.append("Sent with AVision, a community reporting site for Atlanta.")
    return {
        "subject": draft["subject"],
        "message": draft["message"] + "\n\n" + "\n".join(facts),
        "phone_script": draft["phone_script"],
    }


# ---------- a draft for a ticket that is being posted ----------


def draft_for_ticket(
    *,
    title: str,
    issue_type: str,
    description: str | None,
    address: str | None,
    lat: float,
    lng: float,
    photo: bytes | None = None,
    photo_links: list[str] | None = None,
    owner: str | None = None,
    use_ai: bool = True,
) -> dict:
    """The department and a ready-to-edit message for a ticket, from what the person typed.

    The person's own words (and their photo, when there is one) go to Gemini in
    one request, which picks the department and writes the message. `owner` is
    the department the person picked by hand; leave it out to have it chosen.

    This never fails for want of AI: with `use_ai` off, or when Gemini is down or
    not set up, the map rules pick the department and the message is a plain
    fill-in-the-blanks one. The result says which happened.
    """
    typed = {"title": title, "issue_type": issue_type, "description": description or ""}
    found = work_out(lat=lat, lng=lng, photo=photo, typed=typed, address=address, owner=owner, use_ai=use_ai)
    draft = found["draft"]
    if draft is None:
        seen = found["analysis"] if found["analysis"] and found["analysis"]["is_reportable"] else None
        details = description or (seen["description"] if seen else "")
        draft = _plain_draft(title, details, found["address"], lat, lng)
    return {
        "owner": _owner_for_app(found["routing"]),
        "contact": _contact_for_app(found["routing"]["contact"]),
        "address": found["address"],
        "report": _with_facts(draft, found["address"], lat, lng, photo_links),
        "screening": found["screening"],
        "written_by": "gemini" if found["draft"] else "template",
        "timings": found["timings"],
    }


def follow_up_for_ticket(ticket: dict, photo_links: list[str] | None = None, use_ai: bool = True) -> dict:
    """A follow-up message about a ticket that is still there, for its department.

    `ticket` is a row from db.get_ticket(). The department is the ticket's own;
    nothing is chosen here. Gemini writes the message from the ticket's words;
    without Gemini a plain one is used. Same shape as draft_for_ticket().
    """
    started = time.monotonic()
    contact = routing.CONTACTS[ticket["owner"]]
    lat, lng = ticket["lat"], ticket["lng"]
    place = ticket["address"] or geocode.address_for(lat, lng)
    where = place or f"map position {lat:.5f}, {lng:.5f}"
    created = ticket["created_at"]
    first_reported = f"{created:%B} {created.day}, {created.year}"  # e.g. "October 9, 2026"
    confirmations = int(ticket["still_there"] or 0)
    title = ticket["title"].rstrip(". ")
    details = (ticket["description"] or "").strip()

    draft = None
    if use_ai and gemini.is_configured():
        issue = {"title": title, "issue_type": ticket["issue_type"], "description": details}
        try:
            draft = gemini.follow_up_message(issue, where, first_reported, confirmations)
            if not draft["subject"].lower().startswith("follow"):
                draft["subject"] = f"Follow-up: {draft['subject']}"  # so the department sees at once what it is
        except gemini.GeminiFailed:
            log.warning("Gemini couldn't write the follow-up; using the plain message instead")
    written_by = "gemini" if draft else "template"
    if draft is None:
        if details and details[-1] not in ".!?":
            details += "."
        others = ""
        if confirmations > 1:
            others = f" {confirmations} people have confirmed it through AVision."
        lines = [
            "Hello,",
            f"I am following up on a possible issue that was reported on {first_reported}: {title}."
            + (f" {details}" if details else ""),
            f"It is at {where}, and it is still there.{others}",
            "Could you let me know what is planned and when? Thank you for looking into it.",
        ]
        draft = {
            "subject": f"Follow-up: {title} at {where.split(',')[0]}"[:120],
            "message": "\n\n".join(lines),
            "phone_script": f"Hi, I'm following up on a possible issue at {where}: {title}. "
            f"It was reported on {first_reported} and it is still there.",
        }

    report = _with_facts(draft, place, lat, lng, photo_links)
    # One more fact for a follow-up, above the "Sent with AVision" line.
    body = report["message"].rsplit("\n", 1)
    report["message"] = f"{body[0]}\nFirst reported: {first_reported}\n{body[1]}"
    return {
        "owner": _owner_for_app(
            {
                "owner": ticket["owner"],
                "rule": "ticket_owner",
                "reason": "This is the department the ticket is filed under.",
                "contact": contact,
                "decided_by": "ticket",
            }
        ),
        "contact": _contact_for_app(contact),
        "address": place,
        "report": report,
        "written_by": written_by,
        "timings": {"total": round(time.monotonic() - started, 1), "gemini_request": gemini.last_cost() if written_by == "gemini" else None},
    }


def _plain_draft(title: str, details: str, place: str | None, lat: float, lng: float) -> dict:
    """A message with no AI in it, for when Gemini can't be asked. Same shape as Gemini's draft."""
    title = title.rstrip(". ")
    where = place or f"map position {lat:.5f}, {lng:.5f}"
    details = details.strip()
    if details and details[-1] not in ".!?":
        details += "."
    lines = [
        "Hello,",
        f"I would like to report a possible issue: {title}." + (f" {details}" if details else ""),
        f"It is at {where}.",
        "Please let me know if you need anything more from me. Thank you for looking into it.",
    ]
    return {
        "subject": f"{title} at {where.split(',')[0]}"[:120],
        "message": "\n\n".join(lines),
        "phone_script": f"Hi, I'd like to report a possible issue at {where}: {title}.",
    }


# ---------- Microsoft Foundry ----------

_setup_lock = threading.Lock()
_foundry: dict = {}  # filled on first use: the client, and for agent mode the agent's name


def foundry_mode() -> str | None:
    """Which Foundry setup the settings describe: "foundry_agent", "foundry_model" or None."""
    if os.getenv("FOUNDRY_PROJECT_ENDPOINT", "").strip():
        return "foundry_agent"
    if os.getenv("FOUNDRY_API_KEY", "").strip() and os.getenv("FOUNDRY_OPENAI_URL", "").strip():
        return "foundry_model"
    return None


def _reasoning() -> dict | None:
    effort = os.getenv("FOUNDRY_REASONING_EFFORT", "").strip()
    return {"effort": effort} if effort else None


def _connect(mode: str) -> dict:
    """Create the Foundry client once per process. In agent mode, also publish the agent's definition."""
    with _setup_lock:
        if _foundry.get("mode") == mode:
            return _foundry

        if mode == "foundry_agent":
            # Imported here so the API still starts if these packages are missing or unused.
            from azure.ai.projects import AIProjectClient
            from azure.ai.projects.models import FunctionTool, PromptAgentDefinition
            from azure.identity import ClientSecretCredential, DefaultAzureCredential

            login = [os.getenv(name, "").strip() for name in ("AZURE_TENANT_ID", "AZURE_CLIENT_ID", "AZURE_CLIENT_SECRET")]
            project = AIProjectClient(
                endpoint=os.environ["FOUNDRY_PROJECT_ENDPOINT"].strip(),
                # On the server: the login made for it (the three AZURE_ settings).
                # On a laptop without them: whoever is signed in with `az login`.
                credential=ClientSecretCredential(*login) if all(login) else DefaultAzureCredential(),
            )
            definition = PromptAgentDefinition(
                model=FOUNDRY_MODEL,
                instructions=INSTRUCTIONS,
                tools=[
                    FunctionTool(name=name, description=text, parameters=NO_INPUT, strict=True)
                    for name, text in TOOL_DESCRIPTIONS.items()
                ],
                **({"reasoning": _reasoning()} if _reasoning() else {}),
            )
            # Each start publishes the current definition as a new version of the same agent,
            # so the agent in the Foundry portal always matches this file.
            agent = project.agents.create_version(agent_name=FOUNDRY_AGENT_NAME, definition=definition)
            client = project.get_openai_client(timeout=FOUNDRY_TIMEOUT_SECONDS, max_retries=0)
            _foundry.update(mode=mode, client=client, agent=agent.name)
            log.info("Foundry agent %s version %s is ready", agent.name, agent.version)
        else:
            from openai import OpenAI

            client = OpenAI(
                base_url=os.environ["FOUNDRY_OPENAI_URL"].strip(),
                api_key=os.environ["FOUNDRY_API_KEY"].strip(),
                timeout=FOUNDRY_TIMEOUT_SECONDS,
                max_retries=0,
            )
            _foundry.update(mode=mode, client=client, agent=None)
        return _foundry


def _run_with_foundry(job: Job, mode: str) -> str:
    """Let the Foundry agent drive the tools. Returns its closing sentences."""
    foundry = _connect(mode)
    client = foundry["client"]
    first = f"New report. The photo is on the server. Map position: {job.lat:.5f}, {job.lng:.5f}."

    if mode == "foundry_agent":
        conversation = client.conversations.create()
        agent = {"agent_reference": {"name": foundry["agent"], "type": "agent_reference"}}

        def ask(message):
            job.turns += 1
            return client.responses.create(input=message, conversation=conversation.id, extra_body=agent)

    else:
        # No stored agent in this mode: the same instructions and tools are sent with each turn.
        conversation = None
        previous: list[str | None] = [None]
        tools = [
            {"type": "function", "name": name, "description": text, "parameters": NO_INPUT, "strict": True}
            for name, text in TOOL_DESCRIPTIONS.items()
        ]

        def ask(message):
            job.turns += 1
            extra = {"reasoning": _reasoning()} if _reasoning() else {}
            reply = client.responses.create(
                model=FOUNDRY_MODEL,
                instructions=INSTRUCTIONS,
                tools=tools,
                input=message,
                previous_response_id=previous[0],
                **extra,
            )
            previous[0] = reply.id
            return reply

    try:
        reply = ask(first)
        for _ in range(MAX_TURNS):
            calls = [item for item in reply.output if item.type == "function_call"]
            if not calls:
                return reply.output_text
            results = [
                {
                    "type": "function_call_output",
                    "call_id": call.call_id,
                    "output": json.dumps(_call_tool(job, call.name)),
                }
                for call in calls
            ]
            reply = ask(results)
        raise RuntimeError(f"The agent was still calling tools after {MAX_TURNS} turns")
    finally:
        if conversation is not None:
            try:
                client.conversations.delete(conversation_id=conversation.id)
            except Exception:  # tidying up; never worth failing a report over
                log.debug("Could not delete Foundry conversation %s", conversation.id)


def check_foundry() -> dict:
    """Try the Foundry agent on a made-up report, without Gemini or a photo. For check_agent.py.

    Returns {"seconds", "turns", "tool_calls", "said"}. Raises whatever Foundry
    raised, so the caller can show the real error.
    """
    mode = foundry_mode()
    if mode is None:
        raise RuntimeError("No Foundry settings found.")
    job = Job(photo=b"", lat=33.75387, lng=-84.39157)
    job.analysis = {
        "is_reportable": True,
        "issue_type": "broken_elevator",
        "title": "Station elevator out of service",
        "description": "The elevator from the street to the platform is not working.",
        "possible_barriers": ["People using wheelchairs cannot reach the platform"],
        "severity": "high",
        "confidence": 0.9,
    }
    job.routing = {**routing.find_owner(job.lat, job.lng), "decided_by": "rules"}
    job.address = "Five Points station, Atlanta"
    job.draft = {"subject": "Station elevator out of service", "message": "(test)", "phone_script": "(test)"}
    job.ready.set()
    started = time.monotonic()
    said = _run_with_foundry(job, mode)
    return {
        "seconds": time.monotonic() - started,
        "turns": job.turns,
        "tool_calls": job.tool_calls,
        "said": gemini._strip_contacts(said or "")[:400],
    }
