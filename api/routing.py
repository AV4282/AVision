"""
Owner routing: which agency a report goes to, and how to reach it.

Plain map math, no AI. The answer comes from four fixed rules, checked in order,
and the contact details come from data/contacts.json. So an owner or a phone
number can never be made up; a wrong one can only come from wrong data, which
is easy to find and fix.

    1. Within 100 m of a MARTA rail station       -> MARTA
    2. Inside the GSU downtown campus outline     -> GSU Facilities
    3. On an interstate, US route or state route  -> GDOT
    4. Anywhere else                              -> City of Atlanta (ATL311)

MARTA comes before GSU because Georgia State station sits inside the campus
outline, and a broken station elevator is MARTA's to fix.

Every answer carries a `reason` in plain words, which the app shows to the
person so they can see why and correct it if it's wrong.
"""

import json
import re
from pathlib import Path

from shapely.geometry import Point, shape

import geometry

DATA = Path(__file__).parent / "data"

MARTA_RADIUS_M = 100  # stations are long; entrances can be this far from the middle
ROAD_WIDTH_M = 25  # how close to a road's center line still counts as "on" it

# Route numbers GDOT maintains: interstates, US routes and Georgia state routes.
STATE_ROUTE = re.compile(r"^(I|US|GA|SR)[ -]?\d+", re.IGNORECASE)


def _load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


CONTACTS = _load("contacts.json")["owners"]
MARTA_STATIONS = _load("marta_stations.json")["stations"]
GSU_CAMPUS = shape(_load("gsu_campus.geojson")["geometry"])
ATLANTA = shape(_load("atlanta_city_limits.geojson")["geometry"])


def find_owner(lat: float, lng: float, road: dict | None = None) -> dict:
    """Pick the owner for a position.

    `road` is the closest road from geocode.nearest_road(), or None when that
    lookup wasn't possible; then rule 3 is skipped and the reason says so.

    Returns {"owner", "rule", "reason", "contact"} where `owner` is one of the
    four values the tickets table accepts.
    """
    here = Point(lng, lat)

    station, distance = min(
        ((s, geometry.between_m(lat, lng, s["lat"], s["lng"])) for s in MARTA_STATIONS),
        key=lambda pair: pair[1],
    )
    if distance <= MARTA_RADIUS_M:
        return _answer(
            "marta",
            "marta_station",
            f"This spot is about {_round_m(distance)} m from MARTA's {station['name']} station, "
            f"so it goes to MARTA.",
        )

    if GSU_CAMPUS.contains(here):
        return _answer(
            "gsu_facilities",
            "gsu_campus",
            "This spot is inside Georgia State's downtown campus, so it goes to GSU Facilities.",
        )

    if road and road["distance_m"] <= ROAD_WIDTH_M:
        routes = [route for route in road["routes"] if STATE_ROUTE.match(route)]
        if routes:
            street = f"{road['name']} ({' / '.join(routes)})" if road["name"] else " / ".join(routes)
            return _answer(
                "gdot",
                "state_route",
                f"This spot is on {street}, a state-maintained route, so it goes to GDOT.",
            )

    checked = "a MARTA station, GSU's campus or a state route"
    if road is None:
        checked = "a MARTA station or GSU's campus (the state route check wasn't available)"
    if ATLANTA.contains(here):
        return _answer(
            "city_of_atlanta",
            "city_default",
            f"This spot is in the City of Atlanta and not at {checked}, so it goes to the city's ATL311.",
        )
    return _answer(
        "city_of_atlanta",
        "outside_atlanta",
        "This spot looks outside the City of Atlanta, which AVision doesn't cover yet. "
        "It is set to ATL311 for now; please check who owns it.",
    )


def _answer(owner: str, rule: str, reason: str) -> dict:
    return {"owner": owner, "rule": rule, "reason": reason, "contact": CONTACTS[owner]}


def _round_m(meters: float) -> int:
    """Rounded to the nearest 5 m, since the position itself is only that exact."""
    return max(5, int(round(meters / 5) * 5))
