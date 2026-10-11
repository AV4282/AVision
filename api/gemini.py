"""
What Gemini does for a report, in ONE request per report:

  report_from_photo()  photo + what the map says about the spot (+ the person's own
                       words, if any) -> what the issue is, which department it
                       goes to and why, and a message and phone script to send
  report_from_text()   the same without a photo, from the person's words alone

Doing it all in one request is what keeps a report quick (one round trip, not
three) and cheap (the free allowance is counted per request).

Both ask for a fixed JSON shape (a response schema), so the answer can be used
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
# How hard the model thinks before answering. "low" is plenty for this job and
# takes seconds off every report. Set GEMINI_THINKING_LEVEL="" to use the model's default.
THINKING_LEVEL = os.getenv("GEMINI_THINKING_LEVEL", "low").strip().lower()

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


# Each block of rules is used on its own in the text-only request and together in the photo one.
LOOK_RULES = """Looking at the photo. Describe only what is visible.
- Call things "possible" issues or barriers. Never say anything is illegal, a violation, or non-compliant.
- Never describe people: no clothing, age, gender or appearance. Say "a person" only if it matters to the issue.
- Never read out or mention license plates, faces, names or phone numbers that appear in the photo.
- If the photo does not show a reportable problem, set is_reportable to false and say what it shows instead."""

CHOOSE_RULES = """Choosing the department. You are given what the map says about the spot and the departments \
you may choose from, with what each one looks after.
- Use both the problem and the place. The department that owns the spot is the one that fixes it.
- Something that is part of a MARTA station, stop or vehicle goes to MARTA, even where the station sits inside \
the university campus.
- Something in or on a Georgia State University building, or on campus grounds, goes to GSU Facilities.
- A public street, sidewalk, curb ramp, crosswalk or traffic signal goes to the city, even where it runs past a \
station or through the campus.
- Being near a station or inside the campus outline is a clue, not proof. A cracked public sidewalk 60 m from a \
station is still the city's.
- If nothing clearly fits, choose the city.
- Answer with the department's id exactly as listed, and one plain sentence for the person reporting that says \
why, naming the place."""

WRITE_RULES = """Writing the report, which the person will send to that department themselves.
- Stick to the facts you have. Do not invent details.
- Call things "possible" issues or barriers. Never say anything is illegal, a violation, or non-compliant.
- Do NOT include any phone number, email address, web link or staff name, anywhere in your answer. The app adds \
contact details itself.
- Do not name the department you are writing to. The app addresses the message.
- Do not describe people.
- Plain words, short sentences."""

INTRODUCTION = """You work for AVision, a site where people in Atlanta report everyday problems (a blocked curb \
ramp, a broken elevator, a cracked sidewalk, a dead streetlight, a pothole and so on) so the right department \
can fix them."""

PHOTO_INSTRUCTIONS = f"""{INTRODUCTION} For one new report you do three things in a single answer: look at \
its photo, choose the department it goes to, and write the report.

{LOOK_RULES}

{CHOOSE_RULES}

{WRITE_RULES}

If the person reporting it added their own words, treat them as true: use them in the report and when choosing \
the department, along with what the photo shows. is_reportable is still about the photo alone.
If there is nothing to report (the photo shows no problem and the person described none), leave subject, message \
and phone_script empty."""

TEXT_INSTRUCTIONS = f"""{INTRODUCTION} For one new report, described in the person's own words, you do two \
things in a single answer: choose the department it goes to, and write the report.

{CHOOSE_RULES}

{WRITE_RULES}"""


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


_thinking_refused = False  # set if the model turns the thinking setting down, so it isn't sent again


def _ask(contents, instructions: str, shape: type[BaseModel]):
    """One Gemini request that must come back in the given JSON shape."""
    global _thinking_refused

    def send(thinking: str | None):
        return _client().models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=instructions,
                response_mime_type="application/json",
                response_schema=shape,
                temperature=0.2,
                thinking_config=types.ThinkingConfig(thinking_level=thinking) if thinking else None,
            ),
        )

    thinking = THINKING_LEVEL if THINKING_LEVEL and not _thinking_refused else None
    try:
        try:
            reply = send(thinking)
        except Exception as problem:
            # A model that doesn't take this thinking level says so with a 400. Ask again without it.
            if not (thinking and "400" in str(problem) and "think" in str(problem).lower()):
                raise
            log.warning("Gemini refused thinking level %r; using the model's default from now on", thinking)
            _thinking_refused = True
            reply = send(None)
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
    if "PerDay" in text or "free_tier" in text:
        return (
            "The AI has used up today's free allowance from Google, so it can't help until that resets. "
            "Fill in the form yourself for now."
        )
    if "429" in text or "quota" in text.lower():
        return "Photo analysis is over its usage limit right now. Try again in a minute."
    return "Photo analysis didn't work this time. Try again, or fill in the form yourself."


def _answer_shape(departments: dict, with_photo: bool) -> type[BaseModel]:
    """The JSON shape for one report: the findings (photo only), the department, then the message.

    Built per request because the department ids come from data/contacts.json.
    The response schema allows no other id, and any other fails validation.
    The fields are in the order the work is done, since the model fills them in order.
    """
    choice = {
        "owner": (Literal[tuple(departments)], Field(description="The id of the department this report should go to.")),
        "reason": (
            str,
            Field(description="One plain sentence, at most 30 words, on why this department, naming the place."),
        ),
    }
    message = {name: (field.annotation, field) for name, field in Draft.model_fields.items()}
    return create_model("ReportAnswer", __base__=Analysis if with_photo else None, **choice, **message)


def _place_and_departments(location: list[str], departments: dict, suggestion: str | None) -> str:
    listed = "\n".join(
        f"- {owner}: {contact['name']}. Looks after: {contact.get('handles') or 'not stated'}"
        for owner, contact in departments.items()
    )
    return (
        "The place\n" + "\n".join(location)
        + (f"\nMap rules alone would pick: {suggestion}" if suggestion else "")
        + "\n\nDepartments you may choose from\n" + listed
    )


def report_from_photo(
    jpeg: bytes,
    location: list[str],
    departments: dict,
    suggestion: str | None = None,
    typed: dict | None = None,
) -> dict:
    """Everything about a report with a photo, in one request.

    `location` is the lines from routing.location_facts(), `departments` is
    {id: contact} from data/contacts.json, `suggestion` is what the map rules
    alone would pick (a hint), and `typed` is what the person wrote in the form,
    if anything (see _issue_lines).

    Returns {"analysis": <the Analysis fields>, "owner": <id>, "reason": <sentence>,
    "draft": <the Draft fields, or None when there is nothing to report>}.
    """
    asked = "Here is the photo for a new report.\n\n" + _place_and_departments(location, departments, suggestion)
    if typed and typed.get("title"):
        asked += "\n\nWhat the person reporting it wrote\n" + "\n".join(_issue_lines(typed))
    answer = _ask(
        [types.Part.from_bytes(data=jpeg, mime_type="image/jpeg"), asked],
        PHOTO_INSTRUCTIONS,
        _answer_shape(departments, with_photo=True),
    ).model_dump()

    analysis = {key: answer[key] for key in Analysis.model_fields}
    analysis["title"] = _strip_contacts(analysis["title"])[:120]
    analysis["description"] = _strip_contacts(analysis["description"])[:2000]
    analysis["possible_barriers"] = [_strip_contacts(b)[:200] for b in analysis["possible_barriers"][:3]]
    analysis["confidence"] = round(min(1.0, max(0.0, analysis["confidence"])), 2)
    return {"analysis": analysis, **_choice_and_draft(answer)}


def report_from_text(issue: dict, location: list[str], departments: dict, suggestion: str | None = None) -> dict:
    """The department and the message for a report with no photo, in one request.

    `issue` is what the person wrote (see _issue_lines); the rest is as in
    report_from_photo(). Returns {"owner", "reason", "draft"}.
    """
    asked = (
        "A new report, in the person's own words\n" + "\n".join(_issue_lines(issue))
        + "\n\n" + _place_and_departments(location, departments, suggestion)
    )
    return _choice_and_draft(_ask(asked, TEXT_INSTRUCTIONS, _answer_shape(departments, with_photo=False)).model_dump())


def _choice_and_draft(answer: dict) -> dict:
    draft = {key: _strip_contacts(answer[key]) for key in Draft.model_fields}
    return {
        "owner": answer["owner"],
        "reason": _strip_contacts(answer["reason"])[:300],
        # A message with nothing in it is no message (the photo showed nothing to report).
        "draft": draft if draft["subject"] and draft["message"] else None,
    }


def _issue_lines(issue: dict) -> list[str]:
    """An issue as plain lines for a prompt, leaving out whatever isn't known."""
    lines = [f"Issue: {issue['title']}"]
    if issue.get("issue_type") and issue["issue_type"] != "other":
        lines.append(f"Type: {issue['issue_type'].replace('_', ' ')}")
    if issue.get("description"):
        lines.append(f"Details: {issue['description']}")
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
