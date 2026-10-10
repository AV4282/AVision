"""
Checks every part of the report agent with the real services, and says plainly
what works and what doesn't. Run it after changing api/.env:

    cd api
    python check_agent.py                # uses the newest uploaded photo, or a plain test picture
    python check_agent.py my-photo.jpg   # uses a photo of your choice

On the server:

    cd /opt/avision/api && .venv/bin/python check_agent.py

It prints which settings are present (never their values), then tests Gemini,
the routing data, the address lookup and Microsoft Foundry in turn.
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

# Show the agent's own warnings and errors (for example, why Foundry failed).
logging.basicConfig(level=logging.WARNING, format="      %(name)s: %(message)s")

import agent  # noqa: E402  (after the settings are loaded)
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
        "FOUNDRY_PROJECT_ENDPOINT",
        "AZURE_TENANT_ID",
        "AZURE_CLIENT_ID",
        "AZURE_CLIENT_SECRET",
        "FOUNDRY_OPENAI_URL",
        "FOUNDRY_API_KEY",
        "FOUNDRY_REASONING_EFFORT",
    ):
        print(f"  {'set    ' if os.getenv(name, '').strip() else 'missing'}  {name}")
    print(f"  Gemini model: {gemini.GEMINI_MODEL}    Foundry model: {agent.FOUNDRY_MODEL}")

    photo, photo_name = choose_photo()
    print(f"\nUsing {photo_name}.")

    print("\n1. Gemini (photo analysis)")
    analysis = None
    if not gemini.is_configured():
        report(False, "GEMINI_API_KEY is missing", "Add it to api/.env. Nothing else can run without it.")
    else:
        try:
            started = time.time()
            analysis = gemini.analyze_photo(photo)
            report(
                True,
                f"Gemini answered in {time.time() - started:.1f}s",
                f"reportable: {analysis['is_reportable']} | {analysis['issue_type']} | {analysis['title']}",
            )
        except gemini.GeminiFailed as problem:
            report(False, "Gemini call failed", f"{problem} The exact error is on the line above.")

    print("\n2. Routing data (no network)")
    library = routing.find_owner(*GSU_LIBRARY)
    five_points = routing.find_owner(33.75387, -84.39157)
    midtown = routing.find_owner(33.7810, -84.3800)
    report(library["owner"] == "gsu_facilities", "GSU library goes to GSU Facilities")
    report(five_points["owner"] == "marta", "Five Points station goes to MARTA")
    report(midtown["owner"] == "city_of_atlanta", "A Midtown street goes to the City of Atlanta")
    report(all(c.get("phone") or c.get("web") for c in routing.CONTACTS.values()), "Every owner has a contact")

    print("\n3. Address lookup (OpenStreetMap)")
    address = geocode.address_for(*GSU_LIBRARY)
    report(bool(address), "Found an address for the GSU library", address or "No answer. The server may be blocked or offline.")
    road = geocode.nearest_road(33.77312, -84.3655)
    report(
        bool(road and road["routes"]),
        "Recognized Ponce de Leon Ave as a state route",
        f"{road['name']}: {', '.join(road['routes'])}" if road else "No answer.",
    )

    print("\n4. Microsoft Foundry (the agent)")
    mode = agent.foundry_mode()
    if mode is None:
        print("  SKIP  No Foundry settings, so the tools run in direct mode. That works, just without the agent.")
    elif analysis is None:
        print("  SKIP  Needs Gemini working first.")
    else:
        print(f"  Mode: {'full agent (Entra sign-in)' if mode == 'foundry_agent' else 'model with an API key'}")
        started = time.time()
        result = agent.run(agent.Job(photo=photo, lat=GSU_LIBRARY[0], lng=GSU_LIBRARY[1]))
        took = time.time() - started
        if result["orchestrator"] == "direct":
            report(False, "Foundry did not complete the run; direct mode took over", "The exact error is printed above this line.")
        else:
            report(True, f"The agent ran the report in {took:.1f}s", f"tools it called, in order: {', '.join(result['tool_calls'])}")
            expected = agent.TOOL_ORDER if result["analysis"]["is_reportable"] else agent.TOOL_ORDER[:1]
            report(result["tool_calls"] == expected, "It called the right tools in the right order")
            print(f"        It said: {result['summary']}")
            if took > 30:
                print("        That is slow for a demo. For gpt-5 models, set FOUNDRY_REASONING_EFFORT=low in api/.env.")

    print("\n" + ("Everything that is set up works." if failures == 0 else f"{failures} check(s) failed. See FAIL lines above."))
    sys.exit(1 if failures else 0)


if __name__ == "__main__":
    main()
