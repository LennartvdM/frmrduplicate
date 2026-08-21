# website/framer-map/

The interactive world map, exported from Framer as compiled JavaScript. It
appears on the homepage and inside Toolbox pages that use `{% worldmap %}`.

**Don't edit the `chunk-*.mjs` files.** They're machine-generated, minified,
and they'd be replaced wholesale by any future export. The two safe ways to
change the map's behaviour:

- **Appearance** — CSS overrides in `../index.css`, scoped to
  `.worldmap-mount` or `.docs-worldmap-embed`. There are already several.
- **Interaction** — `../shared/worldmap/WorldMap.jsx`, which
  mounts the map and intercepts clicks on the city markers.

The map injects its own stylesheet at runtime, which can collide with the
Toolbox's typography. That collision and its fix are `CLAUDE.md` rule 10 —
read it before adding CSS that might reach in here.

**The city markers' pin is painted by `../index.css`, not by the export.**
Framer draws it with its Material-icons component, which ships no artwork —
it fetches the glyph when the map mounts:

```js
import("https://framer.com/m/material-icons/PinDropRounded.js@0.0.32")
```

Our CSP is `script-src 'self'` (netlify.toml), so that import is refused and
the component swallows the failure, rendering an empty box. That is what left
the map showing a "NICU <city>" tag with a hole where its pin belongs. The CSS
paints the same glyph — Material Icons `pin_drop`, rounded — in the
component's own orange.

It does **not** paint it in that empty box. A marker is a flex row (an
invisible duplicate of the label, the pin's box, then the visible tag) centred
in the map, and the camera centres the map on the city's own coordinates — so
the row's centre is the city, and the box is wherever the row's widths leave
it. Painting in the box put the tip 29px low and up to 35px sideways: fixed
pixel offsets, which cover more ground the smaller the map is drawn, and in the
toolbox embed that put Leiden's pin on Liege. The pin is therefore anchored to
the row — tip at 50%/50%, the way map pins are always anchored — which lands
every city within 2-35 km, the map camera's own precision. The box is left
alone: it still holds the tag's placement.

`bootstrap.mjs` is ours: it mounts the export and patches it to share the
app's single React instance.
