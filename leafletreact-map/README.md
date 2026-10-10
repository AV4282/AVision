# React Leaflet map for Avision

Our React Leaflet map with search, zoom, area buttons, and layer controls. Photo/GPS checks and database connections stay in our existing app.

It uses `react-leaflet` components and hooks. The `leaflet` package is still required as the map engine. [React Leaflet docs](https://react-leaflet.js.org/docs/start-introduction/)

## Files to copy

```text
component/
  AvisionMap.tsx
  AvisionMap.css
  map-config.ts
  types.ts
public/avision-map/
  neighborhoods.geojson
  stations.geojson
  sources.json
README.md
```

## Setup

1. Copy the four files inside `component/` into our frontend's `src/components/avision-map/` folder. Keep them together.

2. Copy `public/avision-map/` into our frontend's `public/` folder, so the files end up at `public/avision-map/neighborhoods.geojson`, etc.

3. Open a terminal in our frontend folder (where its `package.json` is). Check our React version with `npm ls react`. For React 19, install:

   ```sh
   npm install leaflet@^1.9.4 react-leaflet@^5.0.0
   npm install -D @types/leaflet @types/geojson
   ```

   This setup was tested with React 19 and React Leaflet 5. Keep our React version; if we're on React 18, choose a compatible React Leaflet version first.

4. Import and render the map in our map screen. Adjust the import path to match that file's location:

   ```tsx
   import AvisionMap from './components/avision-map/AvisionMap'

   export default function MapScreen() {
     return <AvisionMap height="70vh" />
   }
   ```

5. Start our frontend with its usual command (such as `npm run dev`). Open the URL shown in the terminal and go to our map screen. Try zooming, searching, and switching views.

CSS loads automatically. `height={600}` also works; percentage heights need a parent with a set height. No backend changes are needed, and our photo/GPS flow stays as it is.

Adding this folder to the repo alone won't display the map; finish the setup steps above to use it in our app.

## What it includes

- Pan and zoom, including mouse, touch, and zoom buttons.
- Neighborhood/station search and Atlanta, GSU, and GSU + MARTA views.
- Pilot outline, stations, and neighborhood layers.
- Soft/Street colors, source info, and a phone layout.

Search uses our included City GIS snapshot from October 9, 2026, rather than general address search. The five stations are Five Points, Georgia State, Peachtree Center, King Memorial, and Garnett.

Edit the view bounds and our pilot outline in `map-config.ts`. The outline is for display, and people can browse outside it. Report eligibility stays with our backend.

If our public assets use a different URL path, pass `dataUrl`, like `<AvisionMap dataUrl="/my-app/avision-map" />`. For server-rendered React, load the map only in the browser.

## Connect reports later

Hidden `data-avision-placeholder` labels give each control and location a named slot, like `control:view-gsu` or `location:station:Five Points`. Search results and passed-in markers get their own labels too. They don't display anything or run actions, so our map works the same. Use the React props below when connecting reports.

Pass a `markers` array with `{ id, label, latitude, longitude }` for each marker. Map our API fields to that format in the parent screen.

Markers can also include optional `owner` and `status` fields:

```tsx
{ id: 'ticket-1', label: 'Blocked curb ramp', latitude: 33.7537, longitude: -84.3859,
  owner: 'gsu', status: 'open' }
```

Owner values are `gsu`, `city`, `marta`, `gdot`, or `unknown`. The parent screen maps backend ownership to these values; the map does not determine responsibility. Missing or unrecognized owners use neutral gray. A compact owner legend appears when valid issue markers are supplied. Station markers keep their existing appearance.

Status values are `open`, `likely_fixed`, `fixed`, or `merged`. Supplied status appears in the tooltip and marker's accessible name. Only `fixed` markers fade and show a check mark; the map does not calculate or change ticket status. Existing markers without these optional fields still work.

`onMarkerSelect` returns the clicked marker. `onMapClick` returns `{ latitude, longitude }` without saving or checking eligibility. Both are optional, so the map works on its own for now.

Issue markers also activate with Enter or Space when focused using the keyboard.

## Checks

The exact files passed installation and a TypeScript/production build in a separate React frontend. Desktop and phone checks covered search, controls, layers, callbacks, and data loading failures. No backend changes, commits, or pushes.
