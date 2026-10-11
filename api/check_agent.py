"""
Checks every part of the report agent with the real services, and says plainly
what works and what doesn't. Run it after changing api/.env:

    cd api
    python check_agent.py                # uses the newest uploaded photo, or a plain test picture
    python check_agent.py my-photo.jpg   # uses a photo of your choice

On the server:

    cd /opt/avision/api && .venv/bin/python check_agent.py

It prints which settings are present (never their values), then tests Gemini
(the photo, the choice of department, the drafted message), the routing data,
the address lookup, the photo privacy service and Microsoft Foundry in turn.

It uses two AI requests a run (the free allowance is 20 a day), and the
Foundry agent is tested on its own first, so it can be checked even on a day
when Gemini's allowance is used up.
"""

import io
import logging
import os
import sys
import time
from pathlib import Path

from dotenv import load_dotenv

HERE = Path(__file__).parent
load_dotenv(HERE / ".env")
load_dotenv(HERE / "sql" / ".env")
load_dotenv(HERE.parent / ".env")

# Show the agent's own warnings and errors (for example, why Foundry failed).
logging.basicConfig(level=logging.WARNING, format="      %(name)s: %(message)s")

import agent  # noqa: E402  (after the settings are loaded)
import claude  # noqa: E402
import gemini  # noqa: E402
import geocode  # noqa: E402
import photos  # noqa: E402
import routing  # noqa: E402

GSU_LIBRARY = (33.752771, -84.386575)
failures = 0


def report(ok: bool, what: str, detail: str = ""):
    global failures
    failures += 0 if ok else 1
    print(f"  {'PASS' if ok else 'FAIL'}  {what}" + (f"\n        {detail}" if detail else ""))


def test_picture() -> bytes:
    """A plain gray picture. Gemini should say it shows nothing to report."""
    from PIL import Image

    out = io.BytesIO()
    Image.new("RGB", (640, 480), (128, 128, 128)).save(out, "JPEG")
    return out.getvalue()


def choose_photo() -> tuple[bytes, str]:
    if len(sys.argv) > 1:
        return Path(sys.argv[1]).read_bytes(), sys.argv[1]
    uploads = sorted(photos.UPLOAD_DIR.glob("*.jpg"), key=lambda p: p.stat().st_mtime) if photos.UPLOAD_DIR.is_dir() else []
    if uploads:
        return uploads[-1].read_bytes(), f"the newest uploaded photo ({uploads[-1].name})"
    return test_picture(), "a plain gray test picture"


def main():
    print("Settings found in api/.env (values are never shown):")
    for name in (
        "GEMINI_API_KEY",
        "ANTHROPIC_API_KEY",
        "FOUNDRY_PROJECT_ENDPOINT",
        "AZURE_TENANT_ID",
        "AZURE_CLIENT_ID",
        "AZURE_CLIENT_SECRET",
        "FOUNDRY_OPENAI_URL",
        "FOUNDRY_API_KEY",
        "FOUNDRY_REASONING_EFFORT",
        "FOUNDRY_GRACE_SECONDS",
        "PHOTO_PRIVACY_URL",
    ):
        print(f"  {'set    ' if os.getenv(name, '').strip() else 'missing'}  {name}")
    print(f"  Gemini model: {gemini.GEMINI_MODEL}    Claude model: {claude.CLAUDE_MODEL}    Foundry model: {agent.FOUNDRY_MODEL}")
    order = gemini.providers()
    print(
        "  AI asked first: " + (order[0].capitalize() if order else "none set up")
        + (f", with {order[1].capitalize()} as the backup" if len(order) > 1 else "")
        + "   (set AI_PROVIDER=gemini or claude in api/.env to change the order)"
    )

    photo, photo_name = choose_photo()
    print(f"\nUsing {photo_name}.")

    print("\n1. The AI: Gemini or Claude (one request: the photo, the department, the message)")
    seen = None
    if not gemini.is_configured():
        report(
            False,
            "GEMINI_API_KEY and ANTHROPIC_API_KEY are both missing",
            "Add one to api/.env. Without it the map rules and a plain message are used.",
        )
    else:
        try:
            started = time.time()
            seen = agent.work_out(lat=GSU_LIBRARY[0], lng=GSU_LIBRARY[1], photo=photo, must_see_photo=True)
            analysis, chosen = seen["analysis"], seen["routing"]
            report(
                True,
                f"{((gemini.last_cost() or {}).get('ai') or 'the AI').capitalize()} answered in "
                f"{time.time() - started:.1f}s (address lookup included)",
                f"reportable: {analysis['is_reportable']} | {analysis['issue_type']} | {analysis['title']}",
            )
            if analysis["is_reportable"]:
                print(f"        department: {chosen['contact']['name']} ({chosen['decided_by']}): {chosen['reason']}")
                print(f"        subject: {seen['draft']['subject'] if seen['draft'] else '(no message written)'}")
        except gemini.GeminiFailed as problem:
            report(False, "The AI call failed", f"{problem} The exact error is on the line above.")

    if seen is not None:
        # A typed report that only MARTA can fix, at a spot the map rules would also give to MARTA.
        elevator = {
            "title": "Station elevator out of service",
            "issue_type": "broken_elevator",
            "description": "The elevator from the street to the platform is not working.",
        }
        started = time.time()
        typed = agent.work_out(lat=33.75387, lng=-84.39157, typed=elevator, address="Five Points station")
        chosen = typed["routing"]
        report(
            chosen["decided_by"] == "gemini" and chosen["owner"] == "marta" and typed["draft"] is not None,
            f"A typed report (no photo) got its department and message in {time.time() - started:.1f}s",
            f"{chosen['contact']['name']} <{chosen['contact']['email']}>, decided by {chosen['decided_by']}: "
            f"{chosen['reason']}",
        )

    print("\n2. Routing data (no network)")
    library = routing.find_owner(*GSU_LIBRARY)
    five_points = routing.find_owner(33.75387, -84.39157)
    midtown = routing.find_owner(33.7810, -84.3800)
    report(library["owner"] == "gsu_facilities", "GSU library goes to GSU Facilities")
    report(five_points["owner"] == "marta", "Five Points station goes to MARTA")
    report(midtown["owner"] == "city_of_atlanta", "A Midtown street goes to the City of Atlanta")
    report(all(c.get("phone") or c.get("web") for c in routing.CONTACTS.values()), "Every owner has a contact")
    report(
        len(routing.emailable()) >= 2,
        "Departments reports can be emailed to",
        ", ".join(f"{c['short_name']} <{c['email']}>" for c in routing.emailable().values()),
    )

    print("\n3. Address lookup (OpenStreetMap)")
    address = geocode.address_for(*GSU_LIBRARY)
    report(bool(address), "Found an address for the GSU library", address or "No answer. The server may be blocked or offline.")
    road = geocode.nearest_road(33.77312, -84.3655)
    report(
        bool(road and road["routes"]),
        "Recognized Ponce de Leon Ave as a state route",
        f"{road['name']}: {', '.join(road['routes'])}" if road else "No answer.",
    )

    print("\n4. Photo privacy service (blurs faces and license plates)")
    if not photos.PRIVACY_URL:
        print("  SKIP  PHOTO_PRIVACY_URL isn't set, so photos are stored without blurring.")
    else:
        from PIL import Image

        try:
            started = time.time()
            with Image.open(io.BytesIO(test_picture())) as picture:
                _, faces, plates = photos._hide_faces_and_plates(picture.convert("RGB"))
            report(True, f"It answered in {time.time() - started:.1f}s", f"on a plain test picture: {faces} faces, {plates} plates")
        except photos.PrivacyUnavailable:
            report(False, "It did not answer, so photo uploads are being refused", "The exact error is on the line above. Logs: journalctl -u avision-privacy -n 50")

    print("\n5. Microsoft Foundry (the agent)")
    mode = agent.foundry_mode()
    if mode is None:
        print("  SKIP  No Foundry settings, so reports run in direct mode. That works, just without the agent.")
    else:
        print(f"  Mode: {'full agent (Entra sign-in)' if mode == 'foundry_agent' else 'model with an API key'}")
        # First the agent alone, on a made-up report, so this works even when Gemini doesn't.
        try:
            alone = agent.check_foundry()
            report(
                alone["tool_calls"] and sorted(alone["tool_calls"]) == sorted(agent.TOOL_ORDER),
                f"The agent steered a made-up report in {alone['seconds']:.1f}s and {alone['turns']} turns",
                f"tools it called, in order: {', '.join(alone['tool_calls']) or 'none'}",
            )
            print(f"        It said: {alone['said']}")
            if alone["turns"] > 3:
                print("        Three turns is the quickest. More means it called the last three tools one at a time.")
        except Exception as problem:
            alone = None
            report(False, "The Foundry agent failed", f"{type(problem).__name__}: {str(problem)[:700]}")

        # Then a real report, the way the site runs it: the agent has to keep up with the work.
        if alone is None:
            print("  SKIP  The real run, until the agent itself works.")
        elif seen is None:
            print("  SKIP  The real run needs Gemini working first.")
        else:
            started = time.time()
            job = agent.Job(photo=photo, lat=GSU_LIBRARY[0], lng=GSU_LIBRARY[1])
            result = agent.run(job)
            took = time.time() - started
            if result["orchestrator"] == "direct":
                report(False, f"The report came back without the agent after {took:.1f}s", job.agent_problem or "")
                print(f"        To give it longer, set FOUNDRY_GRACE_SECONDS in api/.env (now {agent.FOUNDRY_GRACE_SECONDS:g}).")
            else:
                report(
                    True,
                    f"A real report came back in {took:.1f}s with the agent steering",
                    f"tools it had called: {', '.join(result['tool_calls'])} ({job.turns} turns so far)",
                )

    print("\n" + ("Everything that is set up works." if failures == 0 else f"{failures} check(s) failed. See FAIL lines above."))
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
