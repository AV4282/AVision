// Offline display preparation; this never assigns ticket ownership.
import { readFileSync, writeFileSync } from "node:fs"

const [input, output] = process.argv.slice(2)
if (!input || !output)
  throw new Error("Usage: node prepare-gdot.mjs source.geojson output.geojson")
const source = JSON.parse(readFileSync(input, "utf8"))
if (source.type !== "FeatureCollection" || source.exceededTransferLimit) {
  throw new Error("Expected a complete official GeoJSON response")
}
// A display crop around the Perimeter, not a municipal or ownership boundary.
const crop = [-84.59, 33.6, -84.2, 33.96]
const routes = {
  "00040100": "I-75",
  "00040200": "I-20",
  "00040300": "I-85",
  "00040700": "I-285",
  "00040000": "GA-400",
  "00000300": "SR 3",
  "00001000": "SR 10",
  "00001400": "SR 14",
  "00015400": "SR 154",
}
const round = (point) =>
  point.slice(0, 2).map((value) => Number(value.toFixed(6)))
const pointKey = (point) => point.join(",")

// Liang–Barsky clips each original line segment without drawing invented roads.
function clip(a, b) {
  if (![...a.slice(0, 2), ...b.slice(0, 2)].every(Number.isFinite))
    throw new Error("Invalid coordinate")
  let lo = 0,
    hi = 1
  const dx = b[0] - a[0],
    dy = b[1] - a[1]
  const p = [-dx, dx, -dy, dy]
  const q = [a[0] - crop[0], crop[2] - a[0], a[1] - crop[1], crop[3] - a[1]]
  for (let i = 0; i < 4; i++) {
    if (p[i] === 0) {
      if (q[i] < 0) return null
      continue
    }
    const t = q[i] / p[i]
    if (p[i] < 0) lo = Math.max(lo, t)
    else hi = Math.min(hi, t)
    if (lo > hi) return null
  }
  return [
    round([a[0] + lo * dx, a[1] + lo * dy]),
    round([a[0] + hi * dx, a[1] + hi * dy]),
  ]
}

const edges = new Map()
let duplicateSegments = 0
for (const feature of source.features) {
  const code = feature.properties.ROUTE_CODE
  if (!routes[code]) throw new Error(`Unexpected route: ${code}`)
  const lines =
    feature.geometry.type === "LineString"
      ? [feature.geometry.coordinates]
      : feature.geometry.type === "MultiLineString"
        ? feature.geometry.coordinates
        : null
  if (!lines) throw new Error("Expected official line geometry")
  for (const line of lines)
    for (let i = 1; i < line.length; i++) {
      const segment = clip(line[i - 1], line[i])
      if (!segment || pointKey(segment[0]) === pointKey(segment[1])) continue
      const key = segment.map(pointKey).sort().join("|")
      if (edges.has(key)) duplicateSegments++
      const edge = edges.get(key) ?? {
        points: segment,
        codes: new Set(),
        sourceIds: new Set(),
      }
      edge.codes.add(code)
      edge.sourceIds.add(feature.properties.ROUTE_ID)
      edges.set(key, edge)
    }
}

// Concurrent numbered routes share one stroke. Rejoin connected original edges.
const groups = new Map()
for (const edge of edges.values()) {
  const codes = [...edge.codes].sort(),
    key = codes.join("|")
  const group = groups.get(key) ?? { codes, edges: [], sourceIds: new Set() }
  group.edges.push(edge.points)
  edge.sourceIds.forEach((id) => group.sourceIds.add(id))
  groups.set(key, group)
}
function chains(segments) {
  const adjacency = new Map(),
    remaining = new Set(segments.map((_, i) => i))
  segments.forEach((segment, i) =>
    segment.forEach((point) => {
      const key = pointKey(point),
        entry = adjacency.get(key) ?? []
      entry.push(i)
      adjacency.set(key, entry)
    }),
  )
  const lines = []
  function walk(index, start) {
    const line = [start]
    let at = start
    while (remaining.has(index)) {
      remaining.delete(index)
      const segment = segments[index]
      at = pointKey(segment[0]) === pointKey(at) ? segment[1] : segment[0]
      line.push(at)
      const next = adjacency.get(pointKey(at))
      if (next.length !== 2) break
      index = next.find((id) => remaining.has(id))
    }
    lines.push(line)
  }
  for (const [key, incident] of adjacency)
    if (incident.length !== 2) {
      for (const index of incident)
        if (remaining.has(index)) {
          walk(
            index,
            segments[index].find((point) => pointKey(point) === key),
          )
        }
    }
  while (remaining.size) {
    const index = remaining.values().next().value
    walk(index, segments[index][0])
  }
  return lines
}
const features = [...groups.values()]
  .map((group) => ({
    type: "Feature",
    properties: {
      name: group.codes.map((code) => routes[code]).join(" / "),
      kind: group.codes.every((code) => code === "00040700")
        ? "context"
        : group.codes.some((code) => Number(code.slice(0, 6)) >= 400)
          ? "highway"
          : "state-route",
      routeCodes: group.codes,
      sourceRouteIds: [...group.sourceIds].sort(),
    },
    geometry: { type: "MultiLineString", coordinates: chains(group.edges) },
  }))
  .sort((a, b) => a.properties.name.localeCompare(b.properties.name))
const found = new Set(
  features.flatMap((feature) => feature.properties.routeCodes),
)
if (Object.keys(routes).some((code) => !found.has(code)))
  throw new Error("A requested route is missing")
const result = { type: "FeatureCollection", bbox: crop, features }
writeFileSync(output, JSON.stringify(result) + "\n")
console.log(
  JSON.stringify({
    sourceFeatures: source.features.length,
    displayFeatures: features.length,
    uniqueSegments: edges.size,
    duplicateSegmentsRemoved: duplicateSegments,
    vertices: features.reduce(
      (n, f) =>
        n + f.geometry.coordinates.reduce((s, line) => s + line.length, 0),
      0,
    ),
    bytes: Buffer.byteLength(JSON.stringify(result)),
    routes: features.map((f) => f.properties.name),
  }),
)
