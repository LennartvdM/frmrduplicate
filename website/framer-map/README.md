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
the map showing a "NICU <city>" tag with a hole where its pin belongs. The
CSS fills the box with the same glyph — Material Icons `pin_drop`, rounded —
in the component's own orange, and only while the box is empty, so an export
that ever inlines the glyph takes over on its own.

`bootstrap.mjs` is ours: it mounts the export and patches it to share the
app's single React instance.
