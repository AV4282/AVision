"""
What Gemini does for a report, in ONE request per report:

  report_from_photo()  photo + what the map says about the spot (+ the person's own
                       words, if any) -> what the issue is, which department it
                       goes to and why, and a message and phone script to send
  report_from_text()   the same without a photo, from the person's words alone
  follow_up_message()  a follow-up about a ticket that is still there

Doing it all in one request is what keeps a report quick (one round trip, not
three) and cheap (the free allowance is counted per request).

Both ask for a fixed JSON shape (a response schema), so the answer can be used
directly instead of being picked out of free text.

Claude can do the same job (claude.py): same instructions, same answer shape.
Which one is asked is decided in _ask(): Claude first when ANTHROPIC_API_KEY is
set, otherwise Gemini, and whichever is left is the backup if the first fails.
Set AI_PROVIDER=gemini (or claude) in api/.env to choose the first one yourself.
Where an answer says "gemini" (decided_by, written_by), read it as "the AI".

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
import time
from typing import Literal

from google import genai
from google.genai import types
from pydantic import BaseModel, Field, create_model

import claude

log = logging.getLogger("avision.gemini")

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-3.8-flash")
# A normal answer takes 5 to 12 seconds. This is how long a slow one is given
# before giving up; set GEMINI_TIMEOUT_SECONDS to change it.
TIMEOUT_MS = int(float(os.getenv("GEMINI_TIMEOUT_SECONDS", "45")) * 1000)
# A normal answer is a few hundred tokens, so this leaves plenty of room. The cap
# stops an answer that has gone wrong (the model repeating itself) from running
# on for ever. It also covers the model's thinking.
MAX_OUTPUT_TOKENS = 8192
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
    """No AI is set up: neither GEMINI_API_KEY nor ANTHROPIC_API_KEY is set."""


class GeminiFailed(Exception):
    """The AI (Gemini or Claude) didn't give a usable answer. The message is safe to show the user."""

    timed_out = False  # set on one that failed by taking too long


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

SCREEN_RULES = """Screening comes first. AVision sends real reports to real departments, so decide whether \
this is a sincere attempt to report a real problem.
- Look at every photo, not only the first. Flag a photo when it plainly is not a photo of a real place or \
thing that could be reported: a cartoon, drawing or meme, a screenshot, a video game, a selfie or portrait of a \
person, food, a pet, a blank or black image. A real photo of a street, sidewalk, building, station or vehicle is \
fine, even when no problem can be seen in it. Put the number of each flagged photo in flagged_photos (the photos \
are numbered in the order given, 1 first); leave it empty when no photo is flagged.
- Flag the words when the title or details plainly are not a report: a joke, random letters or nonsense, an \
insult, threat or slur, sexual content, advertising, or something that has nothing to do with a street, \
building or transit problem. Short, clumsy or misspelled but sincere words are fine.
- Flag only what is obvious. When unsure, do not flag.
- flagged says what was flagged, or "none". flag_reason is one plain sentence for the person saying what was \
wrong with it, without repeating anything offensive. Leave flag_reason empty when nothing is flagged.
- When something is flagged, still fill in the other fields, briefly."""

CHOOSE_RULES = """Choosing the department. You are given what the map says about the spot and the departments \
you may choose from, with what each one looks after.
- Use both the problem and the place. The department that owns the spot is the one that fixes it.
- Something that is part of a MARTA station, stop or vehicle goes to MARTA, even where the station sits inside \
a university campus.
- Something in or on a Georgia State University building, or on its campus grounds, goes to GSU Facilities.
- Something in or on a Georgia Tech building, or on its campus grounds, goes to Georgia Tech, when Georgia Tech \
is one of the departments listed.
- A public street, sidewalk, curb ramp, crosswalk or traffic signal goes to the city, even where it runs past a \
station or through a campus.
- Being near a station or inside a campus outline is a clue, not proof. A cracked public sidewalk 60 m from a \
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

PHOTO_INSTRUCTIONS = f"""{INTRODUCTION} For one new report you do four things in a single answer: screen it, \
look at its photos, choose the department it goes to, and write the report. A report has one to five photos; \
the first is the main one.

{SCREEN_RULES}

{LOOK_RULES}

{CHOOSE_RULES}

{WRITE_RULES}

If the person reporting it added their own words, treat them as true: use them in the report and when choosing \
the department, along with what the photos show. is_reportable is still about the photos alone.
If there is nothing to report (the photo shows no problem and the person described none), leave subject, message \
and phone_script empty."""

FOLLOW_UP_INSTRUCTIONS = f"""{INTRODUCTION} A problem that was reported earlier is still there, and someone \
wants to follow up with the department about it. You write that follow-up for them to send.

{WRITE_RULES}
- Say plainly that this is a follow-up: the problem was reported before, when, and that it is still there.
- If other people have confirmed it is still there, say how many.
- Ask what is planned and when, politely. Do not complain or blame.
- Start the subject with "Follow-up:"."""

TEXT_INSTRUCTIONS = f"""{INTRODUCTION} For one new report, described in the person's own words, you do three \
things in a single answer: screen it, choose the department it goes to, and write the report.

{SCREEN_RULES}

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


def _gemini_configured() -> bool:
    return bool(os.getenv("GEMINI_API_KEY", "").strip())


# After an AI times out it is left out for this long, so the next reports don't each wait on it too.
PAUSE_AFTER_TIMEOUT_SECONDS = 60
_paused_until = {"claude": 0.0, "gemini": 0.0}


def providers() -> list[str]:
    """The AIs that are set up, in the order they are asked: the first, then the backup."""
    ready = [name for name, there in (("claude", claude.is_configured()), ("gemini", _gemini_configured())) if there]
    first = os.getenv("AI_PROVIDER", "").strip().lower()
    return sorted(ready, key=lambda name: name != first) if first in ready else ready


def is_configured() -> bool:
    """Whether any AI is set up (Gemini or Claude)."""
    return bool(providers())


def model_name() -> str:
    """The model that answers first, for status pages. Empty when no AI is set up."""
    first = (providers() or [""])[0]
    return {"claude": claude.CLAUDE_MODEL, "gemini": GEMINI_MODEL}.get(first, "")


_thinking_refused = False  # set if the model turns the thinking setting down, so it isn't sent again

# How long this thread's latest request took and what it used, so a slow report
# can be explained: {"seconds", "thinking_tokens", "answer_tokens"}. See last_cost().
_latest = threading.local()


def _note_cost(reply, seconds: float):
    used = getattr(reply, "usage_metadata", None)
    _latest.cost = {
        "seconds": round(seconds, 1),
        "thinking_tokens": getattr(used, "thoughts_token_count", None),
        "answer_tokens": getattr(used, "candidates_token_count", None),
        "ai": "gemini",
        "model": GEMINI_MODEL,
    }


def last_cost() -> dict | None:
    """What the latest AI request made from this thread took, or None if there wasn't one."""
    return getattr(_latest, "cost", None)


def _ask(contents, instructions: str, shape: type[BaseModel]):
    """One AI request that must come back in the given JSON shape.

    `contents` is what to show it: text, or a list of text and photos (as
    (bytes, mime type)). The first AI that is set up is asked; if it fails and
    another is set up, that one is asked instead, so one being down or out of
    allowance doesn't stop reports.
    """
    order = providers()
    if not order:
        raise NotConfigured
    # One that just timed out sits this one out, unless it is all there is.
    awake = [name for name in order if time.monotonic() >= _paused_until[name]] or order
    failed = None
    for name in awake:
        try:
            return _ask_claude(contents, instructions, shape) if name == "claude" else _ask_gemini(contents, instructions, shape)
        except GeminiFailed as problem:
            failed = problem
            if getattr(problem, "timed_out", False):
                _paused_until[name] = time.monotonic() + PAUSE_AFTER_TIMEOUT_SECONDS
            if name != awake[-1]:
                log.warning("%s couldn't answer (%s); asking the backup AI", name.capitalize(), problem)
    raise failed


def _ask_claude(contents, instructions: str, shape: type[BaseModel]):
    try:
        answer, cost = claude.ask(contents if isinstance(contents, list) else [contents], instructions, shape)
    except claude.ClaudeFailed as problem:
        failed = GeminiFailed(str(problem))
        failed.timed_out = problem.timed_out
        raise failed from problem
    _latest.cost = {**cost, "ai": "claude", "model": claude.CLAUDE_MODEL}
    return answer


def _ask_gemini(contents, instructions: str, shape: type[BaseModel]):
    """One Gemini request that must come back in the given JSON shape."""
    global _thinking_refused
    if isinstance(contents, list):
        contents = [
            part if isinstance(part, str) else types.Part.from_bytes(data=part[0], mime_type=part[1])
            for part in contents
        ]

    def send(thinking: str | None):
        return _client().models.generate_content(
            model=GEMINI_MODEL,
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=instructions,
                response_mime_type="application/json",
                response_schema=shape,
                # No temperature on purpose. Google's guide for Gemini 3 models says to leave it at
                # the default: lowering it can make the model loop, which shows up here as a
                # request that never finishes (504 DEADLINE_EXCEEDED).
                max_output_tokens=MAX_OUTPUT_TOKENS,
                thinking_config=types.ThinkingConfig(thinking_level=thinking) if thinking else None,
            ),
        )

    thinking = THINKING_LEVEL if THINKING_LEVEL and not _thinking_refused else None
    started = time.monotonic()
    try:
        try:
            reply = send(thinking)
        except Exception as problem:
            said = str(problem)
            if thinking and "400" in said and "think" in said.lower():
                # A model that doesn't take this thinking level says so with a 400. Ask again without it.
                log.warning("Gemini refused thinking level %r; using the model's default from now on", thinking)
                _thinking_refused = True
                reply = send(None)
            elif ("503" in said or "500" in said) and time.monotonic() - started < 5:
                # "Busy, try again" that came back at once: one more try costs the person little.
                log.warning("Gemini was busy (%s); trying once more", said[:80])
                reply = send(thinking)
            else:
                raise
        _note_cost(reply, time.monotonic() - started)
        return shape.model_validate_json(reply.text or "")
    except NotConfigured:
        raise
    except Exception as problem:  # network, quota, bad key, blocked photo, or JSON that doesn't fit
        # The real cause goes to the server log (journalctl -u avision-api); the user gets plain words.
        log.warning("Gemini call failed: %s: %s", type(problem).__name__, problem)
        failed = GeminiFailed(_plain_reason(problem))
        failed.timed_out = "took too long" in str(failed)
        raise failed from problem


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
    if "504" in text or "DEADLINE" in text or "timed out" in text.lower() or "Timeout" in type(problem).__name__:
        return "The AI took too long to answer. Try again, or fill in the form yourself."
    return "Photo analysis didn't work this time. Try again, or fill in the form yourself."


def _answer_shape(departments: dict, with_photo: bool) -> type[BaseModel]:
    """The JSON shape for one report: screening, the findings (photo only), the department, then the message.

    Built per request because the department ids come from data/contacts.json.
    The response schema allows no other id, and any other fails validation.
    The fields are in the order the work is done, since the model fills them in order.
    """
    kinds = ("none", "photo", "text", "both") if with_photo else ("none", "text")
    screening = {
        "flagged": (
            Literal[kinds],
            Field(description="What plainly is not a sincere report, if anything. Usually 'none'."),
        ),
        "flag_reason": (
            str,
            Field(description="One plain sentence for the person on what was wrong. Empty when flagged is 'none'."),
        ),
    }
    if with_photo:
        screening["flagged_photos"] = (
            list[int],
            Field(description="The numbers of the photos that were flagged, 1 being the first. Empty when none."),
        )
    seen = {name: (field.annotation, field) for name, field in Analysis.model_fields.items()} if with_photo else {}
    choice = {
        "owner": (Literal[tuple(departments)], Field(description="The id of the department this report should go to.")),
        "reason": (
            str,
            Field(description="One plain sentence, at most 30 words, on why this department, naming the place."),
        ),
    }
    message = {name: (field.annotation, field) for name, field in Draft.model_fields.items()}
    return create_model("ReportAnswer", **screening, **seen, **choice, **message)


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
    more: list[bytes] | None = None,
) -> dict:
    """Everything about a report with a photo, in one request.

    `location` is the lines from routing.location_facts(), `departments` is
    {id: contact} from data/contacts.json, `suggestion` is what the map rules
    alone would pick (a hint), `typed` is what the person wrote in the form,
    if anything (see _issue_lines), and `more` is the report's other photos,
    after the main one, which are screened as well.

    Returns {"analysis": <the Analysis fields>, "owner": <id>, "reason": <sentence>,
    "draft": <the Draft fields, or None when there is nothing to report>,
    "screening": {"flagged": "none" | "photo" | "text" | "both", "reason": <sentence>,
    "photos": [<numbers of the flagged photos, 1 being the main one>]}}.
    """
    photos = [jpeg, *(more or [])]
    shown: list = []
    if len(photos) == 1:
        shown = ["Here is the photo for a new report.", (jpeg, "image/jpeg")]
    else:
        shown.append(f"Here are the {len(photos)} photos for a new report. Photo 1 is the main one.")
        for number, picture in enumerate(photos, 1):
            shown += [f"Photo {number}:", (picture, "image/jpeg")]
    asked = _place_and_departments(location, departments, suggestion)
    if typed and typed.get("title"):
        asked += "\n\nWhat the person reporting it wrote\n" + "\n".join(_issue_lines(typed))
    answer = _ask(
        [*shown, asked],
        PHOTO_INSTRUCTIONS,
        _answer_shape(departments, with_photo=True),
    ).model_dump()
    answer["flagged_photos"] = sorted({n for n in answer.get("flagged_photos") or [] if 1 <= n <= len(photos)})
    if answer["flagged_photos"] and answer.get("flagged") in (None, "none", "text"):
        answer["flagged"] = "both" if answer.get("flagged") == "text" else "photo"

    analysis = {key: answer[key] for key in Analysis.model_fields}
    analysis["title"] = _strip_contacts(analysis["title"])[:120]
    analysis["description"] = _strip_contacts(analysis["description"])[:2000]
    analysis["possible_barriers"] = [_strip_contacts(b)[:200] for b in analysis["possible_barriers"][:3]]
    analysis["confidence"] = round(min(1.0, max(0.0, analysis["confidence"])), 2)
    return {"analysis": analysis, **_choice_and_draft(answer)}


def report_from_text(issue: dict, location: list[str], departments: dict, suggestion: str | None = None) -> dict:
    """The department and the message for a report with no photo, in one request.

    `issue` is what the person wrote (see _issue_lines); the rest is as in
    report_from_photo(). Returns {"owner", "reason", "draft", "screening"}.
    """
    asked = (
        "A new report, in the person's own words\n" + "\n".join(_issue_lines(issue))
        + "\n\n" + _place_and_departments(location, departments, suggestion)
    )
    return _choice_and_draft(_ask(asked, TEXT_INSTRUCTIONS, _answer_shape(departments, with_photo=False)).model_dump())


def follow_up_message(issue: dict, place: str, first_reported: str, confirmations: int) -> dict:
    """A follow-up about a ticket that is still there, as a dict with the Draft fields.

    `issue` is the ticket in words (see _issue_lines), `first_reported` is the
    date it was posted, written out, and `confirmations` is how many people
    have said it is still there.
    """
    asked = (
        "The ticket\n" + "\n".join(_issue_lines(issue))
        + f"\nPlace: {place}"
        + f"\nFirst reported through AVision: {first_reported}"
        + f"\nPeople who have confirmed it is still there: {confirmations}"
    )
    draft = _ask(f"Write the follow-up for this ticket.\n\n{asked}", FOLLOW_UP_INSTRUCTIONS, Draft).model_dump()
    return {key: _strip_contacts(text) for key, text in draft.items()}


def _choice_and_draft(answer: dict) -> dict:
    draft = {key: _strip_contacts(answer[key]) for key in Draft.model_fields}
    flagged = answer.get("flagged") or "none"
    photos = list(answer.get("flagged_photos") or [])
    if flagged in ("photo", "both") and not photos:
        photos = [1]
    return {
        "screening": {
            "flagged": flagged,
            "reason": _strip_contacts(answer.get("flag_reason") or "")[:240] if flagged != "none" else "",
            "photos": photos if flagged in ("photo", "both") else [],
        },
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
