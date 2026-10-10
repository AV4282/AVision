"""Small map-math helpers. Distances are in meters and accurate to well under a meter across Atlanta."""

import math

from shapely.geometry import Point
from shapely.ops import transform

# One degree is a different number of meters north-south than east-west.
# These are right for Atlanta's latitude and close enough for the whole metro area.
ATLANTA_LAT = 33.75
METERS_PER_DEGREE_LAT = 110_950
METERS_PER_DEGREE_LNG = 111_320 * math.cos(math.radians(ATLANTA_LAT))


def to_meters(lng: float, lat: float, *_) -> tuple[float, float]:
    """Longitude/latitude -> flat x/y in meters."""
    return lng * METERS_PER_DEGREE_LNG, lat * METERS_PER_DEGREE_LAT


def in_meters(shape):
    """A copy of a longitude/latitude shape with its coordinates in meters."""
    return transform(lambda x, y, z=None: to_meters(x, y), shape)


def point_m(lat: float, lng: float) -> Point:
    return Point(to_meters(lng, lat))


def distance_m(lat: float, lng: float, shape) -> float:
    """Meters from a position to the nearest part of a longitude/latitude shape (0 if inside)."""
    return point_m(lat, lng).distance(in_meters(shape))


def between_m(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    """Meters between two positions."""
    return point_m(lat1, lng1).distance(point_m(lat2, lng2))
