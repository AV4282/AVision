"""
The three jobs Gemini does for the report agent.

  analyze_photo()  photo -> what the issue is, how serious, how sure
  choose_owner()   the issue + what the map says about the spot -> which department
  draft_report()   the issue + the place -> a message and a phone script

All three ask for a fixed JSON shape (a response schema), so the answer can be used
directly instead of being picked out of free text.

Three rules are built into the prompts and checked again in code:
  - Findings are "possible" issues or barriers, never legal violations.
  - Gemini can only choose a department from the list it is given
    (data/contacts.json). Any other answer is refused.
  - Gemini writes no contact details. Phone numbers, emails and links come only
    from data/contacts.json, added by the app. Anything that looks like one in
    Gemini's text is removed (see _strip_contacts).
"""

import logging
import os
import re
import threading
from typing import Literal

from google import genai
from google.genai import types
from pydantic import BaseModel, Field, create_model

log = logging.getLogger("avision.gemini")

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
TIMEOUT_MS = 40_000

# Same values as the "What's the issue?" list in the web app's report form.
IssueType = Literal[
    "blocked_curb_ramp",
    "missing_curb_cut",
    "damaged_sidewalk",
    "broken_elevator",
    "broken_escalator",
    "damaged_tactile_paving",
    "missing_crosswalk_signal",
    "other",
]


class NotConfigured(Exception):
    """GEMINI_API_KEY isn't set."""


class GeminiFailed(Exception):
    """Gemini didn't give a usable answer. The message is safe to show the user."""


class Analysis(BaseModel):
    is_reportable: bool = Field(
        description="True if the photo shows a problem with a street, sidewalk, building or transit "
        "facility that someone could report to its owner. False for anything else."
    )
    issue_type: IssueType = Field(description="The closest match. Use 'other' when none fits.")
    title: str = Field(description="Short name for the issue, at most 60 characters, e.g. 'Scooter blocking curb ramp'.")
    description: str = Field(
        description="One to three plain sentences on what is wrong and where in the photo. Do not describe people."
    )
    possible_barriers: list[str] = Field(
        description="Up to three short phrases on who this may get in the way of, e.g. "
        "'People using wheelchairs cannot reach the ramp'. Empty if none."
    )
    severity: Literal["low", "medium", "high"] = Field(
        description="high: blocks the way or is a safety risk. medium: gets in the way. low: minor or cosmetic."
    )
    confidence: float = Field(description="How sure you are of the issue type, from 0 to 1.")


class Draft(BaseModel):
    subject: str = Field(description="Subject line for the report, at most 80 characters.")
    message: str = Field(
        description="The report itself: 60 to 120 words, polite and factual, in the first person, "
        "ready to send as an email or paste into a web form. No greeting line with a name, no signature."
    )
    phone_script: str = Field(description="What to say when calling instead: two or three short spoken sentences.")


ANALYZE_INSTRUCTIONS = """You look at one photo for AVision, a site where people in Atlanta report everyday problems \
(a blocked curb ramp, a broken elevator, a cracked sidewalk, a dead streetlight, a pothole and so on) so the \
right agency can fix them.

Describe only what is visible. Rules:
- Call things "possible" issues or barriers. Never say anything is illegal, a violation, or non-compliant.
- Never describe people: no clothing, age, gender or appearance. Say "a person" only if it matters to the issue.
- Never read out or mention license plates, faces, names or phone numbers that appear in the photo.
- If the photo does not show a reportable problem, set is_reportable to false and say what it shows instead."""

CHOOSE_INSTRUCTIONS = """You decide which department a report on AVision should be sent to. AVision is a site \
where people in Atlanta report everyday problems so the right department can fix them.

You are given what the problem is, what the map says about the spot, and the departments you may choose from \
with what each one looks after.

How to decide:
- Use both the problem and the place. The department that owns the spot is the one that fixes it.
- Something that is part of a MARTA station, stop or vehicle goes to MARTA, even where the station sits inside \
the university campus.
- Something in or on a Georgia State University building, or on campus grounds, goes to GSU Facilities.
- A public street, sidewalk, curb ramp, crosswalk or traffic signal goes to the city, even where it runs past a \
station or through the campus.
- Being near a station or inside the campus outline is a clue, not proof. A cracked public sidewalk 60 m from a \
station is still the city's.
- If nothing clearly fits, choose the city.

Answer with the department's id exactly as listed, and one plain sentence for the person reporting that says \
why, naming the place. Do not include any phone number, email address or web link."""

DRAFT_INSTRUCTIONS = """You write a short report that a member of the public will send to the department \
responsible for fixing a problem. You are given the issue and the place.

Rules:
- Stick to the facts you are given. Do not invent details.
- Call things "possible" issues or barriers. Never say anything is illegal, a violation, or non-compliant.
- Do NOT include any phone number, email address, web link or staff name. The app adds contact details itself.
- Do not name the department you are writing to. The app addresses the message.
- Do not describe people.
- Plain words, short sentences."""


_shared_client: genai.Client | None = None
_client_lock = threading.Lock()


def _client() -> genai.Client:
    """One client for the whole process. (A client that is created and dropped closes its connection.)"""
    global _shared_client
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key:
        raise NotConfigured
    # Two requests can arrive at once; the lock makes sure they end up sharing one client.
    with _client_lock:
        if _shared_client is None:
            # GEMINI_BASE_URL is only for tests, to point at a stand-in for Gemini.
            options = types.HttpOptions(timeout=TIMEOUT_MS, base_url=os.getenv("GEMINI_BASE_URL") or None)
            _shared_client = genai.Client(api_key=key, http_options=options)
        return _shared_client


def is_configured() -> bool:
    return bool(os.getenv("GEMINI_API_KEY", "").strip())


def _ask(contents, instructions: str, shape: type[BaseModel]):
    """One Gemini call that must come back in the given JSON shape."""
    try:
        reply = _client().models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=instructions,
                response_mime_type="application/json",
                response_schema=shape,
                temperature=0.2,
            ),
        )
        return shape.model_validate_json(reply.text or "")
    except NotConfigured:
        raise
    except Exception as problem:  # network, quota, bad key, blocked photo, or JSON that doesn't fit
        # The real cause goes to the server log (journalctl -u avision-api); the user gets plain words.
        log.warning("Gemini call failed: %s: %s", type(problem).__name__, problem)
        raise GeminiFailed(_plain_reason(problem)) from problem


def _plain_reason(problem: Exception) -> str:
    text = str(problem)
    if "API key" in text or "API_KEY" in text or "401" in text or "403" in text:
        return "The photo analysis key was rejected. Check GEMINI_API_KEY on the server."
    if "429" in text or "quota" in text.lower():
        return "Photo analysis is over its usage limit right now. Try again in a minute."
    return "Photo analysis didn't work this time. Try again, or fill in the form yourself."


def analyze_photo(jpeg: bytes) -> dict:
    """What the photo shows, as a dict with the Analysis fields."""
    found = _ask(
        [types.Part.from_bytes(data=jpeg, mime_type="image/jpeg"), "Analyze this photo."],
        ANALYZE_INSTRUCTIONS,
        Analysis,
    )
    result = found.model_dump()
    result["title"] = _strip_contacts(result["title"])[:120]
    result["description"] = _strip_contacts(result["description"])[:2000]
    result["possible_barriers"] = [_strip_contacts(b)[:200] for b in result["possible_barriers"][:3]]
    result["confidence"] = round(min(1.0, max(0.0, result["confidence"])), 2)
    return result


def choose_owner(issue: dict, location: list[str], departments: dict, suggestion: str | None = None) -> dict:
    """Which department this report goes to: {"owner": <id>, "reason": <one sentence>}.

    `issue` is what the problem is (see _issue_lines), `location` is the lines from
    routing.location_facts(), and `departments` is {id: contact} from
    data/contacts.json. The answer is always one of those ids: the response
    schema allows nothing else, and anything else fails validation.
    `suggestion` is what the map rules alone would pick, as a hint.
    """
    ids = tuple(departments)
    Choice = create_model(
        "Choice",
        owner=(Literal[ids], Field(description="The id of the department this report should go to.")),
        reason=(
            str,
            Field(description="One plain sentence, at most 30 words, on why this department, naming the place."),
        ),
    )
    listed = "\n".join(
        f"- {owner}: {contact['name']}. Looks after: {contact.get('handles') or 'not stated'}"
        for owner, contact in departments.items()
    )
    asked = (
        "The problem\n" + "\n".join(_issue_lines(issue))
        + "\n\nThe place\n" + "\n".join(location)
        + (f"\nMap rules alone would pick: {suggestion}" if suggestion else "")
        + "\n\nDepartments you may choose from\n" + listed
    )
    choice = _ask(f"Choose the department for this report.\n\n{asked}", CHOOSE_INSTRUCTIONS, Choice)
    return {"owner": choice.owner, "reason": _strip_contacts(choice.reason)[:300]}


def draft_report(issue: dict, address: str | None, lat: float, lng: float) -> dict:
    """A message and phone script about the issue, as a dict with the Draft fields.

    `issue` needs a "title"; "description", "possible_barriers" and "severity" are
    used when present (a photo analysis has them all, a typed ticket may not).
    The draft names no department, so it stays right whoever it is sent to.
    """
    facts = "\n".join(
        _issue_lines(issue)
        + [f"Place: {address or 'no street address found'} (map position {lat:.5f}, {lng:.5f})"]
    )
    draft = _ask(f"Write the report from these facts.\n\n{facts}", DRAFT_INSTRUCTIONS, Draft).model_dump()
    return {key: _strip_contacts(text) for key, text in draft.items()}


def _issue_lines(issue: dict) -> list[str]:
    """The issue as plain lines for a prompt, leaving out whatever isn't known."""
    lines = [f"Issue: {issue['title']}"]
    if issue.get("issue_type") and issue["issue_type"] != "other":
        lines.append(f"Type: {issue['issue_type'].replace('_', ' ')}")
    if issue.get("description"):
        lines.append(f"What was seen: {issue['description']}")
    if issue.get("possible_barriers"):
        lines.append(f"Who it may affect: {'; '.join(issue['possible_barriers'])}")
    if issue.get("severity"):
        lines.append(f"Seriousness: {issue['severity']}")
    return lines


# Anything shaped like a phone number, email address or link.
_CONTACT_LIKE = re.compile(
    r"""(?ix)
      [\w.+-]+@[\w-]+\.[\w.-]+                      # email
    | (?:https?://|www\.)\S+                        # link
    | (?<!\d)(?:\+?1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}(?!\d)   # phone
    """
)


def _strip_contacts(text: str) -> str:
    """Remove contact details Gemini wrote despite being told not to.

    A sentence that contains one is dropped whole, since what is left of it
    ("Please call or email .") reads worse than nothing. If that would leave
    no text at all, only the details themselves are cut out.
    """
    if not _CONTACT_LIKE.search(text):
        return text.strip()
    sentences = re.split(r"(?<=[.!?])\s+", text)
    kept = " ".join(s for s in sentences if not _CONTACT_LIKE.search(s)).strip()
    if kept:
        return kept
    return re.sub(r"[ \t]{2,}", " ", _CONTACT_LIKE.sub("", text)).strip()
