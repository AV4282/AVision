"""
Claude (Anthropic) as the AI for reports. It does the same job as Gemini, with
the same instructions and the same fixed answer shape: see gemini.py, which
decides which of the two is asked and falls back to the other.

Set it up with one line in api/.env:

    ANTHROPIC_API_KEY=...

Optional:
    CLAUDE_MODEL             default claude-haiku-4-5-20251001 (fast). A larger
                             model, e.g. claude-sonnet-5-5, is slower and costs more.
    CLAUDE_TIMEOUT_SECONDS   how long one answer may take, default 30

The answer comes back through a "tool" Claude is made to call, whose inputs are
the answer's fields. That is how Claude is held to the shape, including the
list of departments it may choose from; the caller checks the answer again.
"""

import base64
import json
import logging
import os
import time
import urllib.error
import urllib.request

from pydantic import BaseModel

log = logging.getLogger("avision.claude")

CLAUDE_MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-4-5-20251001").strip()
TIMEOUT_SECONDS = float(os.getenv("CLAUDE_TIMEOUT_SECONDS", "30"))
# A normal answer is a few hundred tokens; this stops one that has gone wrong.
MAX_TOKENS = 2048
# ANTHROPIC_BASE_URL is only for tests, to point at a stand-in for Claude.
API_URL = (os.getenv("ANTHROPIC_BASE_URL") or "https://api.anthropic.com").rstrip("/")
TOOL = "give_answer"


class ClaudeFailed(Exception):
    """Claude didn't give a usable answer. The message is safe to show the user."""

    def __init__(self, message: str, timed_out: bool = False):
        super().__init__(message)
        self.timed_out = timed_out


def is_configured() -> bool:
    return bool(os.getenv("ANTHROPIC_API_KEY", "").strip())


def ask(parts: list, instructions: str, shape: type[BaseModel]) -> tuple[BaseModel, dict]:
    """One Claude request that must come back in the given shape.

    `parts` is what to show it, in order: text as str, a photo as (bytes, mime type).
    Returns the answer and what it took: {"seconds", "thinking_tokens", "answer_tokens"}.
    Raises ClaudeFailed.
    """
    content = []
    for part in parts:
        if isinstance(part, str):
            content.append({"type": "text", "text": part})
        else:
            data, mime = part
            content.append(
                {
                    "type": "image",
                    "source": {"type": "base64", "media_type": mime, "data": base64.b64encode(data).decode()},
                }
            )
    body = {
        "model": CLAUDE_MODEL,
        "max_tokens": MAX_TOKENS,
        "system": instructions,
        "messages": [{"role": "user", "content": content}],
        "tools": [
            {
                "name": TOOL,
                "description": "Give your answer. Fill in every field.",
                "input_schema": shape.model_json_schema(),
            }
        ],
        "tool_choice": {"type": "tool", "name": TOOL},
    }
    started = time.monotonic()
    try:
        try:
            reply = _post(body)
        except urllib.error.HTTPError as problem:
            if problem.code in (500, 503, 529) and time.monotonic() - started < 5:
                # "Busy, try again" that came back at once: one more try costs the person little.
                log.warning("Claude was busy (%s); trying once more", problem.code)
                reply = _post(body)
            else:
                raise
        given = next((block["input"] for block in reply.get("content", []) if block.get("type") == "tool_use"), None)
        if given is None:
            raise ValueError(f"no answer in the reply (stop reason: {reply.get('stop_reason')})")
        answer = shape.model_validate(given)
    except urllib.error.HTTPError as problem:
        said = _error_text(problem)
        # The real cause goes to the server log (journalctl -u avision-api); the user gets plain words.
        log.warning("Claude call failed: HTTP %s: %s", problem.code, said)
        raise ClaudeFailed(_plain_reason(problem.code, said)) from problem
    except Exception as problem:  # network, a timeout, or an answer that doesn't fit the shape
        log.warning("Claude call failed: %s: %s", type(problem).__name__, problem)
        slow = isinstance(problem, TimeoutError) or "timed out" in str(problem).lower()
        raise ClaudeFailed(
            "The AI took too long to answer. Try again, or fill in the form yourself."
            if slow
            else "Photo analysis didn't work this time. Try again, or fill in the form yourself.",
            timed_out=slow,
        ) from problem
    used = reply.get("usage") or {}
    return answer, {
        "seconds": round(time.monotonic() - started, 1),
        "thinking_tokens": None,
        "answer_tokens": used.get("output_tokens"),
    }


def _post(body: dict) -> dict:
    request = urllib.request.Request(
        API_URL + "/v1/messages",
        data=json.dumps(body).encode(),
        headers={
            "x-api-key": os.getenv("ANTHROPIC_API_KEY", "").strip(),
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as response:
        return json.loads(response.read())


def _error_text(problem: urllib.error.HTTPError) -> str:
    """What Anthropic said was wrong, e.g. "Your credit balance is too low ..."."""
    try:
        return str(json.loads(problem.read())["error"]["message"])[:300]
    except Exception:
        return str(problem.reason)


def _plain_reason(status: int, said: str) -> str:
    if status in (401, 403):
        return "The photo analysis key was rejected. Check ANTHROPIC_API_KEY on the server."
    if "credit balance" in said.lower() or "billing" in said.lower():
        return "The AI account is out of credit, so it can't help right now. Fill in the form yourself for now."
    if status == 404:
        return "The AI model set on the server wasn't found. Check CLAUDE_MODEL on the server."
    if status == 429:
        return "Photo analysis is over its usage limit right now. Try again in a minute."
    return "Photo analysis didn't work this time. Try again, or fill in the form yourself."
