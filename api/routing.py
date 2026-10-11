"""
Where a report is, and the map-math backup for who should get it.

The department is chosen by Gemini (see gemini.py), which is given what the
problem is plus the facts this file works out about the spot:

    location_facts()   nearest MARTA station, inside GSU's or Georgia Tech's campus
                       or not, the road and its route numbers, inside the city or not
    emailable()        the departments Gemini may choose from (data/contacts.json)

Gemini can only answer with one of those departments, and the contact details
always come from data/contacts.json, so neither can be made up.

find_owner() is the older, AI-free answer: five fixed rules, checked in order.
It is still used as a hint for Gemini and as the answer when Gemini is not
available, so the app keeps routing either way.

    1. Within 100 m of a MARTA rail station       -> MARTA
    2. Inside the GSU campus outline              -> GSU Facilities
    3. Inside the Georgia Tech campus outline     -> Georgia Tech
    4. On an interstate, US route or state route  -> GDOT
    5. Anywhere else                              -> City of Atlanta (ATL311)

A campus department can only be chosen for a spot on its campus (off_campus()),
whoever is choosing: the person, Gemini or these rules.

MARTA comes before the campuses because Georgia State station sits inside GSU's
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
# Where reports are taken at all (see coverage()).
CITY_EDGE_SLACK_M = 250  # how far past the city limits still counts, to allow for an inexact position
STATION_REACH_M = 300  # a station outside the city, with its entrances, bus bays and parking
ROAD_WIDTH_M = 25  # how close to a road's center line still counts as "on" it

# Route numbers GDOT maintains: interstates, US routes and Georgia state routes.
STATE_ROUTE = re.compile(r"^(I|US|GA|SR)[ -]?\d+", re.IGNORECASE)


def _load(name: str):
    return json.loads((DATA / name).read_text(encoding="utf-8"))


CONTACTS = _load("contacts.json")["owners"]
MARTA_STATIONS = _load("marta_stations.json")["stations"]
GSU_CAMPUS = shape(_load("gsu_campus.geojson")["geometry"])
GEORGIA_TECH_CAMPUS = shape(_load("georgia_tech_campus.geojson")["geometry"])
ATLANTA = shape(_load("atlanta_city_limits.geojson")["geometry"])

# GSU's outline (data/gsu_campus.geojson) is the two campus areas OpenStreetMap has,
# joined with every GSU building and lot and a 35 m margin around each, so the
# housing on Piedmont Ave, the outlying buildings, the Convocation Center and
# Center Parc Stadium are all in it. The file's "source" says exactly how it was made.
#
# A campus department only takes tickets on its own campus: GSU Facilities inside
# GSU's outline, Georgia Tech inside Georgia Tech's. The other departments have
# no such limit (MARTA's stops and GDOT's roads are all over the city).
CAMPUS_EDGE_SLACK_M = 30  # a pin this far past the outline still counts; positions are rarely exact
CAMPUSES = {
    "gsu_facilities": ("Georgia State's campus", GSU_CAMPUS),
    "georgia_tech": ("Georgia Tech's campus", GEORGIA_TECH_CAMPUS),
}


def off_campus(owner: str, lat: float, lng: float) -> str | None:
    """Why `owner` can't take a ticket at this spot, in a sentence, or None when it can."""
    if owner not in CAMPUSES:
        return None
    campus, outline = CAMPUSES[owner]
    if outline.contains(Point(lng, lat)) or geometry.distance_m(lat, lng, outline) <= CAMPUS_EDGE_SLACK_M:
        return None
    return f"This spot is outside {campus}, so it can't go to {CONTACTS[owner]['short_name']}."


def blocked_here(lat: float, lng: float) -> dict:
    """The departments that can't be chosen at this spot, as {owner: why}."""
    reasons = {owner: off_campus(owner, lat, lng) for owner in CAMPUSES}
    return {owner: why for owner, why in reasons.items() if why}


def campus_outlines() -> list[dict]:
    """The campus outlines, for the map in the form to draw."""
    return [
        {"owner": owner, "name": campus, "geometry": outline.__geo_interface__}
        for owner, (campus, outline) in CAMPUSES.items()
        if owner not in UNAVAILABLE
    ]


# Departments this server can't file tickets under yet, so they are never chosen
# or offered. main.py adds one when the database doesn't accept it (see
# db.ensure_schema); normally this stays empty.
UNAVAILABLE: set[str] = set()


def coverage(lat: float, lng: float) -> dict:
    """Whether AVision takes reports at this position: {"covered": bool, "reason": str}.

    Covered means inside the City of Atlanta (with a little slack at the edge,
    because a phone's position is rarely exact), or at a MARTA rail station,
    since several stations AVision routes to MARTA sit just outside the city.
    """
    here = Point(lng, lat)
    if ATLANTA.contains(here) or geometry.distance_m(lat, lng, ATLANTA) <= CITY_EDGE_SLACK_M:
        return {"covered": True, "reason": "This spot is in the City of Atlanta."}
    station, distance = _nearest_station(lat, lng)
    if distance <= STATION_REACH_M:
        return {"covered": True, "reason": f"This spot is at MARTA's {station['name']} station."}
    return {
        "covered": False,
        "reason": "AVision only takes reports in the City of Atlanta and at MARTA rail stations right now. "
        "This spot is outside that area.",
    }


def emailable() -> dict:
    """The departments a report can be emailed to, as {owner: contact}. Gemini picks from these."""
    return {
        owner: contact
        for owner, contact in CONTACTS.items()
        if contact.get("email") and owner not in UNAVAILABLE
    }


def location_facts(lat: float, lng: float, road: dict | None = None, address: str | None = None) -> list[str]:
    """What the map says about a position, one plain line per fact, for Gemini to weigh.

    `road` is the closest road from geocode.nearest_road(), or None when that
    lookup wasn't possible.
    """
    here = Point(lng, lat)
    station, distance = _nearest_station(lat, lng)
    facts = [f"Map position: {lat:.5f}, {lng:.5f}"]
    if address:
        facts.append(f"Nearest address: {address}")
    facts.append(f"Nearest MARTA rail station: {station['name']}, about {_round_m(distance)} m away")
    facts.append(
        "Inside the outline of Georgia State University's Atlanta campus: "
        + ("yes" if GSU_CAMPUS.contains(here) else "no")
    )
    if "georgia_tech" not in UNAVAILABLE:
        facts.append(
            "Inside the outline of Georgia Tech's campus: "
            + ("yes" if GEORGIA_TECH_CAMPUS.contains(here) else "no")
        )
    if road:
        name = road["name"] or "an unnamed road"
        routes = [route for route in road["routes"] if STATE_ROUTE.match(route)]
        kind = f"a state route ({' / '.join(routes)})" if routes else "an ordinary street, not a state route"
        facts.append(f"Nearest road: {name}, about {road['distance_m']} m away, {kind}")
    facts.append("Inside Atlanta city limits: " + ("yes" if ATLANTA.contains(here) else "no"))
    return facts


def _nearest_station(lat: float, lng: float) -> tuple[dict, float]:
    return min(
        ((s, geometry.between_m(lat, lng, s["lat"], s["lng"])) for s in MARTA_STATIONS),
        key=lambda pair: pair[1],
    )


def find_owner(lat: float, lng: float, road: dict | None = None) -> dict:
    """Pick the owner for a position.

    `road` is the closest road from geocode.nearest_road(), or None when it
    wasn't looked up; then rule 3 is skipped.

    Returns {"owner", "rule", "reason", "contact"} where `owner` is one of the
    values the tickets table accepts.
    """
    here = Point(lng, lat)

    station, distance = _nearest_station(lat, lng)
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
            "This spot is on Georgia State's campus, so it goes to GSU Facilities.",
        )

    if "georgia_tech" not in UNAVAILABLE and GEORGIA_TECH_CAMPUS.contains(here):
        return _answer(
            "georgia_tech",
            "georgia_tech_campus",
            "This spot is inside Georgia Tech's campus, so it goes to Georgia Tech's facilities team.",
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

    # The state route check only happens when the caller looked the road up.
    checked = "a MARTA station, a campus or a state route" if road else "a MARTA station or a campus"
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
