# World Map Editor

Click-to-place editor for city coordinates on the world map. Mounted on
slide 4 of the home page and at the standalone `/map-editor` route.

## One-way design

The editor is safe by construction: it **never writes to the server or
the repo**. Everything it produces is local — state in `localStorage`,
JSON on the clipboard, or a JSON file download. You copy the result and
commit it to the repo yourself. Anyone who reaches the editor can
tinker with their own local state and walk away. The deployed site is
untouchable.

There is no access code, no login, no API.

## Workflow

1. Open slide 4 (scroll-snap section on `/`) or `/map-editor` directly.
2. **Pan / zoom** to the region you want to work in — mouse wheel zooms
   around the cursor, drag on empty space pans. The editor view is
   purely for your cursor convenience; it's never persisted and doesn't
   affect the runtime animation.
3. **Click the map** to drop a city marker at the cursor. The sidebar
   gets a new row with editable name + optional `lat` / `lon` fields.
4. **Drag a marker** to nudge its position; the sidebar trash button
   removes it.
5. **Copy JSON** or **Download** to get the data. Paste / save into the
   repo and import where it's needed.

Editor state auto-saves to `localStorage` (keys
`worldMapEditor.cities.v2` and `worldMapEditor.zoomLevels.v2`) so
refresh is safe. "Import" reads a JSON export back from the clipboard
to resume work.

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

A single JSON document with three fields:

```json
{
  "cities":       [ { "id": "...", "name": "...", "x": 0, "y": 0, "lat": null, "lon": null } ],
  "zoomLevels":   { "out": 1, "in": 5 },
  "locationPairs":[ { "id": 1, "name": "...", "out": { "x": 0, "y": 0, "zoom": 1 }, "in": { "x": 0, "y": 0, "zoom": 5 } } ]
}
```

- `cities` — the raw array for future calibration work.
- `zoomLevels` — the current `{ in, out }` pair.
- `locationPairs` — drop-in for
  `sections/worldmap/WorldMapSection.jsx`'s existing shape (same
  `(x, y)` for both `in` and `out`, zooms taken from `zoomLevels`).

## File structure

```
src/components/WorldMapEditor/
├── index.jsx          # Editor component (single file)
├── mapLocations.js    # Seed cities + zoom levels (empty by default)
└── README.md          # This file
```
