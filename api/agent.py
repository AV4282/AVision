"""
The report agent: turns one photo and a map position into a ready-to-review report.

It has four tools, each a plain Python function in this file:

    1. analyze_photo     Gemini looks at the photo                    (gemini.py)
    2. find_owner        Gemini picks the department from the findings
                         and what the map says about the spot         (gemini.py, routing.py)
    3. look_up_address   nearest street address                       (geocode.py)
    4. draft_report      Gemini writes the message and phone script   (gemini.py)

Step 2 can only answer with a department listed in data/contacts.json, and the
contact details always come from that file. If Gemini can't be asked, fixed map
rules pick instead (routing.find_owner), so a report always has somewhere to go.

A Microsoft Foundry agent decides which tool to call next and when to stop (for
example, it stops after step 1 if the photo shows nothing to report). The agent
only ever sees short summaries of what the tools found. It cannot pass in or
change an owner, a contact or an address: the tools read those from this
report's own data, never from the model. So nothing the agent says can put a
made-up phone number in front of a user.

If Foundry isn't set up, is slow, or fails, the same four tools run in the same
order without it ("direct" mode), so the feature keeps working. The result says
which way it ran.

draft_for_ticket() is the same work for a ticket that is being posted: it uses
what the person typed (plus the photo, when there is one) to pick the department
and write the message, so every posted ticket comes with a draft to send. It
runs the steps itself, without Foundry, to keep posting quick.

Settings (api/.env), all optional. With none, the agent runs in direct mode.

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
"""

import hashlib
import json
import logging
import os
import threading
from collections import OrderedDict
from concurrent.futures import ThreadPoolExecutor
from dataclasses import dataclass, field

import gemini
import geocode
import routing

log = logging.getLogger("avision.agent")

FOUNDRY_MODEL = os.getenv("FOUNDRY_MODEL", "gpt-5-mini")
FOUNDRY_AGENT_NAME = os.getenv("FOUNDRY_AGENT_NAME", "avision-report-agent")
FOUNDRY_TIMEOUT_SECONDS = 45  # per model turn
MAX_TURNS = 8  # four tools need five turns; a few spare for a repeated call

INSTRUCTIONS = """You are the report agent for AVision, a site where people in Atlanta report everyday \
problems to the agency that can fix them. Each message you get is one new report: a photo (already on the \
server) and a map position.

Work through your tools in this order, one at a time:
1. analyze_photo: find out what the photo shows.
2. find_owner: find the department responsible, from the findings and the spot.
3. look_up_address: get the street address of the spot.
4. draft_report: write the report for that department.

If analyze_photo says the photo is not reportable, stop there. Do not call the other tools.

The tools already know the photo and the position, so they take no input. You never choose the agency, a \
contact detail or an address yourself, and you never state a phone number, email or link.

When you are done, reply with one or two plain sentences for the person who took the photo: what was found \
and which agency it is going to, or why there is nothing to report. Call findings "possible" issues or \
barriers. Never call anything illegal or a violation."""

# What the model is told about each tool. None of them take input (see the module notes).
TOOL_DESCRIPTIONS = {
    "analyze_photo": "Look at this report's photo. Returns whether it shows a reportable problem, the issue "
    "type, a short title, how serious it is and how sure the analysis is. Always call this first.",
    "find_owner": "Decide which department this report goes to (GSU Facilities, the City of Atlanta or "
    "MARTA) from what the photo shows and what the map says about the spot, and why. Call after analyze_photo.",
    "look_up_address": "Get the nearest street address for this report's map position. Call after find_owner.",
    "draft_report": "Write the report message and phone script for the agency, from what the other tools "
    "found. Call last.",
}
TOOL_ORDER = list(TOOL_DESCRIPTIONS)
NO_INPUT = {"type": "object", "properties": {}, "required": [], "additionalProperties": False}


@dataclass
class Job:
    """One report being worked on: what came in, and what each tool has found so far."""

    photo: bytes
    lat: float
    lng: float
    photo_url: str | None = None
    analysis: dict | None = None
    routing: dict | None = None
    address: str | None = None
    address_looked_up: bool = False
    draft: dict | None = None
    draft_failed: bool = False
    tool_calls: list[str] = field(default_factory=list)  # the order the agent called them in


# ---------- the four tools ----------
# Each stores its full result on the job and returns a short summary for the model.

# Looking at a photo costs the most time and money, and the same photo is often
# asked about twice (once to fill in the form, once when the ticket is posted),
# so recent answers are kept, keyed by the photo's contents.
_analyses: OrderedDict[str, dict] = OrderedDict()
_analyses_lock = threading.Lock()
ANALYSES_KEPT = 200


def analysis_of(photo: bytes) -> dict:
    """What Gemini sees in the photo. Asked once per photo; repeats come from memory."""
    key = hashlib.sha256(photo).hexdigest()
    with _analyses_lock:
        if key in _analyses:
            _analyses.move_to_end(key)
            return dict(_analyses[key])
    found = gemini.analyze_photo(photo)
    with _analyses_lock:
        _analyses[key] = found
        while len(_analyses) > ANALYSES_KEPT:
            _analyses.popitem(last=False)
    return dict(found)


def decide_owner(
    issue: dict, lat: float, lng: float, address: str | None, road: dict | None, use_ai: bool = True
) -> dict:
    """Pick the department for an issue at a position.

    Gemini chooses, from the departments that can be emailed, using what the
    issue is and what the map says about the spot. If Gemini can't be asked
    or fails, the fixed map rules choose instead.

    Returns {"owner", "rule", "reason", "contact", "decided_by"}; `decided_by`
    is "gemini" or "rules".
    """
    options = routing.emailable()
    by_rules = routing.find_owner(lat, lng, road)
    if use_ai and len(options) > 1 and gemini.is_configured():
        hint = by_rules["contact"]["short_name"] if by_rules["owner"] in options else None
        try:
            choice = gemini.choose_owner(issue, routing.location_facts(lat, lng, road, address), options, hint)
            return {
                "owner": choice["owner"],
                "rule": "ai_choice",
                "reason": choice["reason"] or by_rules["reason"],
                "contact": options[choice["owner"]],
                "decided_by": "gemini",
            }
        except (gemini.GeminiFailed, gemini.NotConfigured):
            log.warning("Gemini could not choose the department; the map rules chose instead")

    if options and by_rules["owner"] not in options:
        # The rules picked a department with no email on file (GDOT, at the time of
        # writing). Reports go out by email, so send it to the general one instead.
        fallback = "city_of_atlanta" if "city_of_atlanta" in options else next(iter(options))
        by_rules = {
            "owner": fallback,
            "rule": by_rules["rule"],
            "reason": f"{by_rules['contact']['short_name']} looks after this spot but has no email address "
            f"on file, so this goes to {options[fallback]['short_name']} instead.",
            "contact": options[fallback],
        }
    return {**by_rules, "decided_by": "rules"}


def analyze_photo(job: Job) -> dict:
    if job.analysis is None:
        job.analysis = analysis_of(job.photo)
    found = job.analysis
    return {key: found[key] for key in ("is_reportable", "issue_type", "title", "severity", "confidence")}


def find_owner(job: Job) -> dict:
    if job.routing is None:
        analyze_photo(job)  # the choice needs the findings; a no-op when the agent already did it
        look_up_address(job)
        job.routing = decide_owner(
            job.analysis, job.lat, job.lng, job.address, geocode.nearest_road(job.lat, job.lng)
        )
    return {"department": job.routing["contact"]["short_name"], "why": job.routing["reason"]}


def look_up_address(job: Job) -> dict:
    if not job.address_looked_up:
        job.address = geocode.address_for(job.lat, job.lng)
        job.address_looked_up = True
    return {"address": job.address or "No street address found for this spot."}


def draft_report(job: Job) -> dict:
    if job.analysis is None or job.routing is None:
        return {"error": "Call analyze_photo and find_owner first."}
    if not job.analysis["is_reportable"]:
        return {"error": "The photo is not reportable, so there is nothing to draft."}
    if job.draft is None and not job.draft_failed:
        look_up_address(job)  # a no-op when the agent already did it
        try:
            job.draft = gemini.draft_report(job.analysis, job.address, job.lat, job.lng)
        except gemini.GeminiFailed:
            # The findings and the owner are still worth returning without a drafted message.
            job.draft_failed = True
            log.warning("Report drafting failed; returning the analysis without a draft")
    if job.draft is None:
        return {"error": "The report could not be drafted right now."}
    return {"drafted": True, "subject": job.draft["subject"]}


TOOLS = {
    "analyze_photo": analyze_photo,
    "find_owner": find_owner,
    "look_up_address": look_up_address,
    "draft_report": draft_report,
}


def _call_tool(job: Job, name: str) -> dict:
    tool = TOOLS.get(name)
    if tool is None:
        return {"error": f"There is no tool called {name}."}
    job.tool_calls.append(name)
    return tool(job)


# ---------- running a job ----------


def run(job: Job) -> dict:
    """Work one report through the tools and return everything the web app needs.

    Raises gemini.NotConfigured or gemini.GeminiFailed if the photo can't be
    analyzed at all; nothing useful can be returned without that step. If only
    the last step (drafting) fails, the result comes back with "report": null.
    """
    orchestrator, summary = "direct", None
    mode = foundry_mode()
    if mode:
        try:
            summary = _run_with_foundry(job, mode)
            orchestrator = mode
        except (gemini.NotConfigured, gemini.GeminiFailed):
            raise  # a tool failed, not Foundry; direct mode would fail the same way
        except Exception:
            log.exception("Foundry run failed; finishing this report in direct mode")
            job.tool_calls.clear()  # the result reports direct mode, so no agent calls to show

    _finish_directly(job)
    return _result(job, orchestrator, summary)


def _finish_directly(job: Job):
    """Run, in order, whatever the agent left undone. All of it, when there was no agent."""
    analyze_photo(job)
    if not job.analysis["is_reportable"]:
        return
    find_owner(job)
    look_up_address(job)
    draft_report(job)


def _result(job: Job, orchestrator: str, summary: str | None) -> dict:
    analysis = job.analysis
    if not analysis["is_reportable"]:
        return {
            "analysis": analysis,
            "owner": None,
            "contact": None,
            "address": None,
            "report": None,
            "summary": _clean(summary) or "This photo doesn't seem to show a problem to report.",
            "orchestrator": orchestrator,
            "tool_calls": job.tool_calls,
        }

    report = _with_facts(job.draft, job.address, job.lat, job.lng, job.photo_url) if job.draft else None
    return {
        "analysis": analysis,
        "owner": _owner_for_app(job.routing),
        "contact": _contact_for_app(job.routing["contact"]),
        "address": job.address,
        "report": report,
        "summary": _clean(summary)
        or f"Possible issue found: {analysis['title']}. {job.routing['reason']}",
        "orchestrator": orchestrator,
        "tool_calls": job.tool_calls,
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


def _with_facts(draft: dict, address: str | None, lat: float, lng: float, photo_url: str | None) -> dict:
    """The drafted report with the plain facts added under the message.

    The facts are added here, not written by Gemini, so they are always right.
    """
    place = f"{address} ({lat:.5f}, {lng:.5f})" if address else f"{lat:.5f}, {lng:.5f}"
    facts = [f"Location: {place}"]
    if photo_url:
        facts.append(f"Photo: {photo_url}")
    facts.append("Sent with AVision, a community reporting site for Atlanta.")
    return {
        "subject": draft["subject"],
        "message": draft["message"] + "\n\n" + "\n".join(facts),
        "phone_script": draft["phone_script"],
    }


def _clean(text: str | None) -> str | None:
    """The agent's closing sentences, with any contact details it shouldn't have written removed."""
    return gemini._strip_contacts(text)[:600] if text else None


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
    photo_url: str | None = None,
    owner: str | None = None,
    use_ai: bool = True,
) -> dict:
    """The department and a ready-to-edit message for a ticket, from what the person typed.

    The person's own words come first: their title, their details, their address.
    When the ticket has a photo, what Gemini sees in it fills the gaps (who it may
    affect, how serious). `owner` is the department the person picked by hand;
    leave it out to have the department chosen here (see decide_owner).

    This never fails for want of AI: with `use_ai` off, or when Gemini is down or
    not set up, the map rules pick the department and the message is a plain
    fill-in-the-blanks one. The result says which happened.
    """
    use_ai = use_ai and gemini.is_configured()
    with ThreadPoolExecutor(max_workers=2) as pool:
        # The photo and the map lookups don't depend on each other, so they run side by side.
        looking = pool.submit(_analysis_or_none, photo) if photo and use_ai else None
        road = geocode.nearest_road(lat, lng) if owner is None else None  # only needed to choose
        place = address or geocode.address_for(lat, lng)
        seen = looking.result() if looking else None
        if seen and not seen["is_reportable"]:
            seen = None  # the photo doesn't show the problem; go by the person's words alone

        issue = {
            "title": title,
            "issue_type": issue_type,
            "description": description or (seen["description"] if seen else ""),
            "possible_barriers": seen["possible_barriers"] if seen else [],
            "severity": seen["severity"] if seen else None,
        }

        # Likewise the choice of department and the wording of the message.
        writing = pool.submit(_draft_or_none, issue, place, lat, lng) if use_ai else None
        if owner is not None:
            chosen = {
                "owner": owner,
                "rule": "chosen_by_person",
                "reason": "You chose this department in the form.",
                "contact": routing.CONTACTS[owner],
                "decided_by": "person",
            }
        else:
            chosen = decide_owner(issue, lat, lng, place, road, use_ai)
        draft = writing.result() if writing else None

    return {
        "owner": _owner_for_app(chosen),
        "contact": _contact_for_app(chosen["contact"]),
        "address": place,
        "report": _with_facts(draft or _plain_draft(issue, place, lat, lng), place, lat, lng, photo_url),
        "written_by": "gemini" if draft else "template",
    }


def _analysis_or_none(photo: bytes) -> dict | None:
    try:
        return analysis_of(photo)
    except (gemini.GeminiFailed, gemini.NotConfigured):
        return None


def _draft_or_none(issue: dict, place: str | None, lat: float, lng: float) -> dict | None:
    try:
        return gemini.draft_report(issue, place, lat, lng)
    except (gemini.GeminiFailed, gemini.NotConfigured):
        log.warning("Report drafting failed; using the plain message instead")
        return None


def _plain_draft(issue: dict, place: str | None, lat: float, lng: float) -> dict:
    """A message with no AI in it, for when Gemini can't be asked. Same shape as gemini.draft_report()."""
    title = issue["title"].rstrip(". ")
    where = place or f"map position {lat:.5f}, {lng:.5f}"
    details = (issue.get("description") or "").strip()
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
            client = project.get_openai_client(timeout=FOUNDRY_TIMEOUT_SECONDS, max_retries=1)
            _foundry.update(mode=mode, client=client, agent=agent.name)
            log.info("Foundry agent %s version %s is ready", agent.name, agent.version)
        else:
            from openai import OpenAI

            client = OpenAI(
                base_url=os.environ["FOUNDRY_OPENAI_URL"].strip(),
                api_key=os.environ["FOUNDRY_API_KEY"].strip(),
                timeout=FOUNDRY_TIMEOUT_SECONDS,
                max_retries=1,
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
