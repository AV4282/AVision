import type { Feature, MultiPolygon, Polygon, Position } from "geojson"

import type { AvisionMapOwner, AvisionMapStatus } from "./types"

export const ISSUE_OWNERS: readonly {
  id: AvisionMapOwner

  label: string

  color: string

  symbol: string
}[] = [
  { id: "gsu", label: "GSU Facilities", color: "#97CAEB", symbol: "G" },

  { id: "gt", label: "Georgia Tech", color: "#8F713D", symbol: "T" },

  {
    id: "city",

    label: "City of Atlanta / ATL311",

    color: "#0039A6",

    symbol: "C",
  },

  { id: "marta", label: "MARTA", color: "#FDBE43", symbol: "M" },

  { id: "gdot", label: "GDOT", color: "#F4A261", symbol: "D" },

  { id: "unknown", label: "Owner unknown", color: "#334155", symbol: "?" },
]

export const ISSUE_STATUS_LABELS: Record<AvisionMapStatus, string> = {
  open: "Open",

  likely_fixed: "Likely fixed",

  fixed: "Fixed",

  merged: "Merged",
}

export type MapBounds = [[number, number], [number, number]]

export const ATLANTA_VIEW: MapBounds = [
  [33.6, -84.59],

  [33.96, -84.2],
]

export const CORRIDOR_VIEW: MapBounds = [
  [33.7445, -84.4],

  [33.7645, -84.3695],
]

export const GSU_VIEW: MapBounds = [
  [33.7475, -84.393],

  [33.762, -84.378],
]

export const GEORGIA_TECH_VIEW: MapBounds = [
  [33.7685, -84.4075],

  [33.7835, -84.3858],
]

export const CORRIDOR_STATIONS = [
  "Five Points",

  "Georgia State",

  "Peachtree Center",

  "King Memorial",

  "Garnett",
]

// Team-defined pilot outline for display. Eligibility and ownership belong to the backend.

export const PILOT_OUTLINE: Feature<Polygon> = {
  type: "Feature",

  properties: { name: "GSU + nearby MARTA corridor", version: "pilot-v1" },

  geometry: {
    type: "Polygon",

    coordinates: [
      [
        [-84.3983, 33.7587],

        [-84.3909, 33.7634],

        [-84.3806, 33.7634],

        [-84.3753, 33.7578],

        [-84.3718, 33.751],

        [-84.3729, 33.7455],

        [-84.3909, 33.7455],

        [-84.3983, 33.7504],

        [-84.3983, 33.7587],
      ],
    ],
  },
}

export function geometryBounds(geometry: Polygon | MultiPolygon): MapBounds {
  const positions: Position[] =
    geometry.type === "Polygon"
      ? geometry.coordinates.flat()
      : geometry.coordinates.flat(2)

  return [
    [
      Math.min(...positions.map((p) => p[1])),

      Math.min(...positions.map((p) => p[0])),
    ],

    [
      Math.max(...positions.map((p) => p[1])),

      Math.max(...positions.map((p) => p[0])),
    ],
  ]
}

export function boundsOverlap(a: MapBounds, b: MapBounds) {
  return (
    a[0][0] <= b[1][0] &&
    a[1][0] >= b[0][0] &&
    a[0][1] <= b[1][1] &&
    a[1][1] >= b[0][1]
  )
}
