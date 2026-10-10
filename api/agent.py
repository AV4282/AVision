"""
The report agent: turns one photo and a map position into a ready-to-review report.

It has four tools, each a plain Python function in this file:

    1. analyze_photo     Gemini looks at the photo                  (gemini.py)
    2. find_owner        map math picks the agency and its contacts (routing.py)
    3. look_up_address   nearest street address                     (geocode.py)
    4. draft_report      Gemini writes the message and phone script (gemini.py)

A Microsoft Foundry agent decides which tool to call next and when to stop (for
example, it stops after step 1 if the photo shows nothing to report). The agent
only ever sees short summaries of what the tools found. It cannot pass in or
change an owner, a contact or an address: the tools read those from this
report's own data, never from the model. So nothing the agent says can put a
made-up phone number in front of a user.

If Foundry isn't set up, is slow, or fails, the same four tools run in the same
order without it ("direct" mode), so the feature keeps working. The result says
which way it ran.

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

import json
import logging
import os
import threading
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
2. find_owner: find the agency responsible for that spot.
3. look_up_address: get the street address of the spot.
4. draft_report: write the report for that agency.

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
    "find_owner": "Find the agency responsible for this report's map position (GSU Facilities, City of "
    "Atlanta, MARTA or GDOT) and why. Call after analyze_photo.",
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


def analyze_photo(job: Job) -> dict:
    if job.analysis is None:
        job.analysis = gemini.analyze_photo(job.photo)
    found = job.analysis
    return {key: found[key] for key in ("is_reportable", "issue_type", "title", "severity", "confidence")}


def find_owner(job: Job) -> dict:
    if job.routing is None:
        job.routing = routing.find_owner(job.lat, job.lng, geocode.nearest_road(job.lat, job.lng))
    return {"agency": job.routing["contact"]["short_name"], "why": job.routing["reason"]}


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
            job.draft = gemini.draft_report(
                job.analysis, job.routing["contact"]["name"], job.address, job.lat, job.lng
            )
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

    contact = job.routing["contact"]
    report = None
    if job.draft:
        # The facts under the message are added here, not written by Gemini, so they are always right.
        place = f"{job.address} ({job.lat:.5f}, {job.lng:.5f})" if job.address else f"{job.lat:.5f}, {job.lng:.5f}"
        facts = [f"Location: {place}"]
        if job.photo_url:
            facts.append(f"Photo: {job.photo_url}")
        facts.append("Sent with AVision, a community reporting site for Atlanta.")
        report = {
            "subject": job.draft["subject"],
            "message": job.draft["message"] + "\n\n" + "\n".join(facts),
            "phone_script": job.draft["phone_script"],
        }
    return {
        "analysis": analysis,
        "owner": {
            "id": job.routing["owner"],
            "name": contact["short_name"],
            "rule": job.routing["rule"],
            "reason": job.routing["reason"],
        },
        "contact": {key: contact[key] for key in ("name", "phone", "phone_note", "email", "web", "web_label", "hours")},
        "address": job.address,
        "report": report,
        "summary": _clean(summary)
        or f"Possible issue found: {analysis['title']}. {job.routing['reason']}",
        "orchestrator": orchestrator,
        "tool_calls": job.tool_calls,
    }


def _clean(text: str | None) -> str | None:
    """The agent's closing sentences, with any contact details it shouldn't have written removed."""
    return gemini._strip_contacts(text)[:600] if text else None


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
