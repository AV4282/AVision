# Map

AVision uses geography in two separate places, with separate data:

| | Web map | API routing |
|---|---|---|
| Job | Shows tickets and reference layers | Works out facts about a spot, to choose the department |
| Code | `web/src/components/avision-map/` | `api/routing.py`, `api/geocode.py` |
| Data | `web/public/avision-map/` | `api/data/` |

The web map never decides who owns an issue. It only displays the owner and status the API sends.

## Web map

A React Leaflet map (Leaflet 1.x, react-leaflet 5) with OpenStreetMap tiles. `App.tsx` loads it on demand and passes tickets through `web/src/ticket-map.ts`, which converts each ticket into a marker.

**What it shows:**

- **Ticket pins** at their stored coordinates, colored and lettered by owner, with a separate status badge. Selecting one opens the ticket details and voting.
- **Ticket filters:** use Filters to choose which departments and ticket
  statuses appear. Show all restores tickets hidden by those filters.
  Layers controls reference data such as stations and roads.
- **Reference layers**, each toggled from the Layers menu: MARTA corridor stations (on by default), GDOT roads, the Atlanta city boundary, six GSU buildings, neighborhoods and an illustrative pilot outline.
- **Search** across neighborhoods, the five corridor stations and the GSU buildings. It doesn't geocode arbitrary addresses.
- **Area views:** Atlanta, GSU + MARTA, GSU and Georgia Tech.
- **Map styles:** Soft, Street and Dark.
- **More information:** opened from the sidebar, with map data sources
  and welcome-photo credits. OpenStreetMap attribution remains on the map.

**Owner colors:**

| Owner | Color | Letter |
|---|---|---|
| City of Atlanta / ATL311 | `#0039A6` | C |
| GSU Facilities | `#97CAEB` | G |
| Georgia Tech | `#8F713D` | T |
| MARTA | `#FDBE43` | M |
| GDOT | `#F4A261` | D |
| Unknown | `#334155` | ? |

Status badges: open `!`, likely fixed (clock) and fixed (check). Each color also has a text label.

**Using the component:**

```tsx
<AvisionMap
  height={600}
  dataUrl={import.meta.env.BASE_URL + "avision-map"}
  initialArea="corridor"          // atlanta | corridor | gsu
  markers={markers}               // { id, label, latitude, longitude, owner?, status? }
  selectedMarkerId={selectedId}
  focusPoint={focusRequest}       // { latitude, longitude }; a new object zooms there
  onMarkerSelect={(m) => setSelectedId(m.id)}
/>
```

Markers with invalid coordinates are skipped, never moved to a default spot. Markers work with Enter or Space, the map pans with arrow keys, and Escape closes the Layers menu.

**Failures:** tiles need internet. If a GIS layer is missing or malformed, the map shows a warning with a retry button and the ticket pins keep working.

## Web map data

All snapshots were taken October 9–10, 2026. Full queries, source IDs and dates are in `web/public/avision-map/sources.json`.

| File | Source |
|---|---|
| `gdot-roads.geojson` | GDOT state-route network: I-20, I-75, I-85, I-285, GA-400, SR 3, SR 10, SR 14, SR 154, cropped around the Perimeter |
| `atlanta-city-limits.geojson` | City of Atlanta GIS city limits |
| `gsu-references.geojson` | Six buildings from GSU's building list, placed at City GIS address points |
| `neighborhoods.geojson`, `stations.geojson` | City of Atlanta GIS (layers 3 and 28) |

GDOT roads are regenerated with `web/scripts/prepare-gdot.mjs`. [map-geography.md](map-geography.md) has the full sources and processing steps.

GSU points are building addresses, not property lines or accessible entrances. The pilot outline is a team-drawn demo area, not a jurisdiction.

## API routing data

Used by the [report agent](report-agent.md) to describe a spot and, as a backup, to pick its department.

| File | What | Source |
|---|---|---|
| `marta_stations.json` | All MARTA rail stations | MARTA GTFS feed, fetched 2026-10-10 |
| `gsu_campus.geojson` | GSU downtown campus outline | OpenStreetMap way 586614408 |
| `atlanta_city_limits.geojson` | City limits, simplified to about 30 m | OpenStreetMap relation 119557 |
| `contacts.json` | Each department's contacts and what it handles | Each department's website, checked 2026-10-10 |

Street addresses come live from OpenStreetMap's Nominatim service (`api/geocode.py`), at most one request a second, as its usage policy asks. It can also find the nearest road and its route numbers to spot state routes, but that lookup only runs while GDOT can be chosen automatically.

**Known limit:** the OpenStreetMap campus outline is generous. It includes Woodruff Park and the city streets between campus buildings, so "inside the campus" is a clue for Gemini, not proof.

## Rules for OpenStreetMap tiles

Keep the "© OpenStreetMap contributors" credit visible, use the HTTPS tile URL, and don't add offline downloads or tile preloading ([tile usage policy](https://operations.osmfoundation.org/policies/tiles/)).
