"""
Address lookups for the report agent, from OpenStreetMap's free Nominatim service.

  address_for()    position -> nearest street address, for the ticket and the report
  nearest_road()   position -> the closest road and its route numbers, so routing can
                   tell a state route (GDOT's) from a city street

Nominatim asks for at most one request a second and a User-Agent that says who is
calling, so every request here goes through _get(), which does both.
https://operations.osmfoundation.org/policies/nominatim/
"""

import json
import threading
import time
import urllib.parse
import urllib.request

from shapely.geometry import shape

import geometry

NOMINATIM_URL = "https://nominatim.openstreetmap.org/reverse"
USER_AGENT = "AVision/1.0 (https://atlantamamdani.photo; GSU Hacklanta 2026)"
TIMEOUT_SECONDS = 6

_one_at_a_time = threading.Lock()
_last_request = 0.0


def _get(params: dict) -> dict | None:
    """One polite request to Nominatim. Returns None if it fails or finds nothing."""
    global _last_request
    url = NOMINATIM_URL + "?" + urllib.parse.urlencode({"format": "jsonv2", "accept-language": "en", **params})
    request = urllib.request.Request(url, headers={"User-Agent": USER_AGENT})
    with _one_at_a_time:
        wait = 1.0 - (time.monotonic() - _last_request)
        if wait > 0:
            time.sleep(wait)
        try:
            with urllib.request.urlopen(request, timeout=TIMEOUT_SECONDS) as reply:
                data = json.load(reply)
        except Exception:  # offline, slow, blocked or not JSON: the caller copes without it
            return None
        finally:
            _last_request = time.monotonic()
    return data if isinstance(data, dict) and "error" not in data else None


def address_for(lat: float, lng: float) -> str | None:
    """The nearest address, e.g. "Library North, 100 Decatur Street Southeast, Atlanta"."""
    place = _get({"lat": lat, "lon": lng, "zoom": 18, "addressdetails": 1})
    if not place:
        return None
    address = place.get("address") or {}
    road = address.get("road") or address.get("pedestrian")
    street = " ".join(part for part in (address.get("house_number"), road) if part)
    area = address.get("city") or address.get("town") or address.get("village")
    name = place.get("name")
    parts = [name if name != road else "", street or address.get("neighbourhood"), area]
    seen = list(dict.fromkeys(part for part in parts if part))  # drops repeats, keeps order
    return ", ".join(seen)[:200] or None


def nearest_road(lat: float, lng: float) -> dict | None:
    """The closest road: {"name", "routes", "distance_m"}.

    `routes` are its route numbers as signed, e.g. ["US 278", "GA 8"], and is empty
    for an ordinary street. `distance_m` is how far the position is from the road's
    center line, so the caller can ignore a road that is merely nearby.
    """
    road = _get({"lat": lat, "lon": lng, "zoom": 17, "namedetails": 1, "polygon_geojson": 1})
    if not road or road.get("category") != "highway":
        return None
    names = road.get("namedetails") or {}
    routes = [ref.strip() for ref in (names.get("ref") or "").split(";") if ref.strip()]
    try:
        distance = geometry.distance_m(lat, lng, shape(road["geojson"]))
    except Exception:  # no usable line came back
        return None
    return {"name": road.get("name") or names.get("name") or "", "routes": routes, "distance_m": round(distance)}
