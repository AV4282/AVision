# AVision map geography

The website uses one map implementation in `web/src/components/avision-map/`. Geographic layers visualize published data; they never assign ticket ownership, change API owner values, or validate report eligibility.

## Snapshots and dates

| Asset | Official source | Retrieved | Available source date |
| --- | --- | --- | --- |
| `gdot-roads.geojson` | [GDOT production LRS state routes, layer 0](https://rnhp.dot.ga.gov/hosting/rest/services/GDOT_Network_LRSN_SR/MapServer/0) | October 10, 2026 | Geometry update date not published. LRS establishment dates are retained in metadata but are not update dates. |
| `atlanta-city-limits.geojson` | [City of Atlanta city limits, layer 1](https://gis.atlantaga.gov/dpcd/rest/services/OpenDataService1/FeatureServer/1) | October 10, 2026 | Published feature last edited July 21, 2026. |
| `gsu-references.geojson` | [GSU building list](https://facilities.gsu.edu/building-list/) matched to [City address points, layer 0](https://gis.atlantaga.gov/dpcd/rest/services/OpenDataService1/FeatureServer/0) | October 10, 2026 | The six base-address features were last edited February 3, 2026. The building-list update date is not published. |
| Existing neighborhoods and MARTA station points | [City OpenDataService1 MapServer](https://gis.atlantaga.gov/dpcd/rest/services/OpenDataService1/MapServer), layers 3 and 28 | October 9, 2026 | Individual update dates were not captured in the earlier snapshot. Assets are preserved byte for byte. |

Full queries, source IDs, CRS information, and dates are in `web/public/avision-map/sources.json`. Retrieval dates describe the snapshot, not legal or maintenance authority. The Data sources dialog displays this distinction.

## GDOT display preparation

The suggested `egisp.dot.ga.gov/.../ARCWEBSVCMAP/MapServer/1` and `/3` endpoints timed out on October 10. The official `rnhp.dot.ga.gov` production network responded with actual line geometry and route attributes. It uses ESRI:102604 internally; the query explicitly requests EPSG:4326 longitude/latitude coordinates.

The snapshot selects active, increasing-direction, mainline state-highway routes: `SYSTEM_CODE='1'`, `FUNCTION_TYPE='1'`, `DIRECTION='INC'`, `LRS_RETIRE_DATE IS NULL`. It excludes ramps, projected alignments, and retired records. Included routes are I-20, I-75, I-85, I-285, GA-400, SR 3, SR 10, SR 14, and SR 154. These cover all six corridors named in Nic's routing JSON. Interstate-to-state-route codes are verified against [GDOT's conversion table](https://www.dot.ga.gov/DriveSmart/MapsData/Documents/Statewide/InterstateSRNumbers.pdf).

`web/scripts/prepare-gdot.mjs` crops the source to `[-84.59, 33.60, -84.20, 33.96]` using segment clipping. This rectangle surrounds the Perimeter and nearby context; it is not an official ITP or municipal boundary. Original vertices are retained within the crop, with six decimal places (less than roughly 0.1 m rounding). Z/M ordinates are removed. No manual road paths or broad filled road polygons are introduced.

Shared undirected segments are joined into one stroke with all corresponding route labels. The current snapshot has 9 source route features, 11 display groups, and 8,325 unique line segments; 657 duplicate segments were removed. This includes the Downtown Connector and the SR 14/SR 154 concurrency. The local road asset is about 192 KB rather than the statewide query response.

To regenerate, issue the query recorded in `sources.json` to the source layer's `/query` endpoint, preserving `f=geojson`, `outSR=4326`, and the spatial/route filters. Save the full response outside public assets, verify no transfer limit was exceeded, then run from the repository root:

```sh
node web/scripts/prepare-gdot.mjs source.geojson web/public/avision-map/gdot-roads.geojson
```

Review route coverage and update retrieval metadata after every regeneration. The script checks required routes and geometry types. Do not reinterpret LRS establishment dates as geometry freshness.

## City and GSU accuracy

The city polygon retains the complete published MultiPolygon, including its separate component. Coordinates are unchanged from the official EPSG:4326 response. The blue outline and minimal fill describe the published municipal boundary; they do not assign all enclosed issues to ATL311.

Six GSU buildings use exact City GIS base-address coordinates: 25 Park Place, 55 Park Place, 40 Pryor, 75 Piedmont, Aderhold Learning Center, and the Andrew Young School of Policy Studies. Each name/address appears on GSU's official building list. The chosen City record uniquely matches the standardized base address with `STATUS='Current'`; suite records are excluded. Source object IDs and edit dates remain in each feature. These points do not establish ownership extents or locate accessible entrances. No geocoded guesses or invented campus polygon are used.

MARTA's proposed university service layer 1 identifies rail stations, not property polygons, and its direct connection was refused. The existing five accurate City GIS corridor station points remain yellow with dark outlines. The illustrative pilot outline is unchanged and disabled by default.

## Demonstration and validation

Start in the GSU + MARTA view. Stations are enabled; use Layers to enable thin orange GDOT roads, the blue city boundary, or square light-blue GSU reference markers. Issue markers remain larger, independently encode owner/status, and sit above the reference layers. The Atlanta button includes I-285 and GA-400 context. Search finds Five Points, neighborhoods, and the six GSU references.

Stage A was built and typechecked before Stage B. Its browser checks verified all priority routes, segment deduplication, layer toggling, marker interaction above roads, ticket/list/modal/voting flows, mobile controls, keyboard access, and attribution. Desktop and mobile screenshots were inspected after all visible OSM tiles loaded. Local QA uses seed-coordinate fixtures and mocked API writes; it does not exercise the live backend.

Final QA artifacts live in the ignored `output/playwright/` directory. OSM tiles require internet. GIS assets are local and load independently for the new reference layers; missing or malformed assets show a warning and a retry action without removing tickets.

Final production build and TypeScript checks passed. Playwright passed at desktop and 390 px: exact ticket/GSU coordinates, all geographic layers, search and area navigation, marker keyboard/pointer selection, list/modal/profile navigation, voting, photo preview/removal, nearest-address behavior, attribution, and touch-target/overflow checks. Missing/malformed GIS, blocked tiles, empty tickets, API errors, and retry recovery were exercised. Final desktop/mobile screenshots have fully loaded tiles and were visually inspected. Backend writes and reverse-geocoding responses were mocked; live submission and deployment were not tested.

Deferred: GSU/MARTA property polygons, nearest-road ownership inference or selected-road matching, and extra GIS features. Verified reference points are sufficient for this demonstration. Nic can supply future authoritative property geometry; Vince/Amari remain responsible for backend routing and report-location validation.

## Upstream coordination

The team repository was checked at `b812115df361caf1d43301757bfe8c1a3d4fa8d2` before editing. Vince's nearest-address `ReportForm.tsx` and `geocode.ts` were incorporated unchanged into the working tree. No upstream merge commit is created in this pass. The feature branch retains the earlier Leaflet integration and modal/photo-upload merge checkpoint.

The final upstream recheck found `6c87b5e652fdeb9dc97ae3276462ecb289e4a7fc`, adding only `Avision_Pedestrian_Perspective/` photos and source credits. That folder was incorporated unchanged, without wiring reference photos into tickets or changing their credits. There were no new map conflicts. Auth, Gemini, photo privacy, database, API owner contracts, and deployment files remain untouched.

Before publishing, fetch the team's latest main again, reconcile any newer frontend edits, then obtain approval to commit/push the feature branch and open a PR targeting `VincePaul723/Hacklanta2026-Grex-Aureus:main`. Include the website integration, dependencies, styles, and all GIS assets. Do not push directly to team main or deploy during this task.
