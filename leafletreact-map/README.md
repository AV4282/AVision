# AVision map integration

The authoritative map is now in `web/src/components/avision-map/`, with unchanged GIS snapshots in `web/public/avision-map/`. This folder retains the handoff documentation; do not copy the component back here or maintain another version.

## Run and verify

From `web/`:

```sh
npm ci
npm run dev
npm run typecheck
npm run build
```

The existing ticket API is still required for real tickets and voting. `web/src/ticket-map.ts` adapts API-backed tickets to map props without determining agency ownership or ticket status. `App.tsx` loads the map on demand, opens the existing detail/voting panel on marker selection, and focuses issues selected from the list or just created through the existing form.

## Reuse the component

```tsx
import AvisionMap from './components/avision-map/AvisionMap'

<AvisionMap
  height={600}
  dataUrl={import.meta.env.BASE_URL + 'avision-map'}
  initialArea="corridor"
  markers={markers}
  selectedMarkerId={selectedId}
  focusPoint={focusRequest}
  onMarkerSelect={(marker) => setSelectedId(marker.id)}
/>
```

- `markers`: `{ id, label, latitude, longitude, owner?, status? }` using supplied coordinates. Invalid/non-finite coordinates are omitted; no fallback location is invented.
- `owner`: `gsu`, `city`, `marta`, `gdot`, `unknown`. The caller maps the API's owner; this component never assigns responsibility.
- `status`: `open`, `likely_fixed`, `fixed`, `merged`. Status is supplied, never calculated.
- `selectedMarkerId`: controlled highlight, independently of map focus. The selected marker has an accessible pressed state.
- `focusPoint`: `{ latitude, longitude }`. A new object requests focus at zoom 17; keep it stable across votes/renders to let people continue panning and searching. `null` leaves the current view alone.
- `initialArea`: `atlanta` (default), `corridor`, or `gsu`; sets the initial view only.
- `onMapClick`: optional `{ latitude, longitude }` callback; does not save a report or validate eligibility. The existing report form is unchanged by this integration.

## Geography and accessibility

Search covers the included City GIS snapshot: neighborhoods, GSU area, and five corridor stations. It does not geocode arbitrary addresses. Area views, pan/zoom, Soft/Street, layer controls, source dialog, and OpenStreetMap attribution remain available. Issue markers activate with Enter or Space, and the map supports arrow-key navigation.

Agency identity uses fills and letters: City/ATL311 `#0039A6` / C, GSU `#97CAEB` / G with a slate outline, MARTA `#FDBE43` / M, GDOT `#F4A261` / D. Stations use a train symbol and a square shape. Status is a separate badge: open `#C2410C` / !, likely fixed `#DDD6FE` / clock, fixed `#DDD6FE` / check. Labels and status text accompany colors.

The existing pilot outline is a team-defined demonstration area, not campus property lines or agency jurisdiction. No new boundaries, property overlays, or road geometry were added. Keep routing and eligibility on the backend.

Tiles use `https://tile.openstreetmap.org/{z}/{x}/{y}.png`; internet access is required. GIS/tile failures display a warning, and issue selection remains usable. Do not hide attribution or add offline tile preloading.

Desktop and 390 px browser verification uses fixtures from the repository's seed coordinates and mocked voting responses; no live writes. Local QA scripts/screenshots are under `output/playwright/` in the isolated checkout.
