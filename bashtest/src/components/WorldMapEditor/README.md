# World Map Editor

Click-to-place editor for city coordinates on the world map. Lives at
`/map-editor`.

## Access

- Localhost: unrestricted.
- Live site: append `?editor=true` or enter access code `map2024`.

## Workflow

1. Navigate to `/map-editor`.
2. **Pan / zoom** the editor view to the region you want to work in —
   mouse wheel zooms, drag on empty space pans. This view is purely for
   your cursor convenience; it's never persisted and doesn't affect the
   runtime animation.
3. **Click the map** to drop a city marker at the cursor. The sidebar
   gets a new row with editable name + optional `lat` / `lon` fields.
4. **Drag a marker** to nudge its position; right-click or the sidebar
   trash button removes it.
5. **Copy export** to push the city array + `locationPairs` drop-in code
   to your clipboard.

State is auto-saved to `localStorage` (keys `worldMapEditor.cities.v2`
and `worldMapEditor.zoomLevels.v2`), so refresh won't lose work. "Import"
reads an export string back from the clipboard.

## Data shape

```js
{ id, name, x, y, lat, lon }
```

- `x`, `y` — SVG viewBox units (the map is 1440 × 700).
- `lat`, `lon` — optional; fill these for the anchor points you know
  geographically. Once enough are filled (~8–15 globally distributed),
  a calibration pass can fit a `lat/lon → (x, y)` transform and
  auto-place additional cities.

## Export format

"Copy export" writes three artefacts at once:

- `cities` — the raw array (paste into `mapLocations.js`).
- `zoomLevels` — the current `{ in, out }` pair.
- `locationPairs` — drop-in for
  `sections/worldmap/WorldMapSection.jsx`'s existing shape (same `(x, y)`
  for both `in` and `out`, zooms taken from `zoomLevels`).

## File structure

```
src/components/WorldMapEditor/
├── index.jsx          # Editor component (single file)
├── mapLocations.js    # Seed cities + zoom levels (empty by default)
└── README.md          # This file
```
