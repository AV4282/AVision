# Application themes

The sun/moon button in the application header and welcome screen switches
between Light and Dark. It is available in the mobile header, too.

- `src/index.css` defines semantic surface, text, border, focus and status tokens.
  The light values preserve the existing palette. Dark values are scoped to
  `:root[data-theme="dark"]`.
- `src/theme.tsx` owns the preference and the accessible toggle. The
  `avision.theme` localStorage key accepts only `light` or `dark`. Without a valid
  stored preference, the theme follows the system, including subsequent changes.
  Preferences also synchronize across browser tabs.
- `index.html` sets the root attribute before styles and React load. Keep its
  storage key and preference rules aligned with `theme.tsx`.
- If browser storage is blocked, switching still works for the current page;
  the choice cannot persist through a reload.

Use the shared tokens for new application surfaces. Use `--accent` and
`--green-text` for readable accent text, `--blue` and `--green` for brand fills,
and `--control-line` for interactive control edges. Keep agency swatches separate
from status badges. Agency swatches retain their original palette; status badges
also retain text and symbols so meaning does not depend on color alone.

`src/components/avision-map/AvisionMap.css` themes the map toolbar, search,
layer menu, legend labels, zoom controls and sources dialog. Tiles, geographic
overlays, agency/status markers, map labels and attribution keep their original
appearance. The existing Soft/Street map setting remains independent of the UI
theme. Do not add theme filters to the map canvas or its tiles.

## Quick verification

Run `npm run typecheck` and `npm run build` from `web/`. Review welcome, map,
ticket panel/modal, issues, report form and profile at desktop and 390px widths.
Also check address suggestions, photo viewing, photo-analysis findings and the
drafted report confirmation when those states are available.
Check the toggle with Tab, Space and Enter; reload both preferences; clear
`avision.theme` to test the system default. Check input focus, placeholders,
selected filters, agency/status labels, loading, empty and error states.

Compare light mode against the existing appearance, and confirm that switching
the UI theme changes neither map geometry nor tile/marker colors. Browser review
can use intercepted API fixtures without submitting reports or votes.
