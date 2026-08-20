# app/src/framer-map/

The interactive world map, exported from Framer as compiled JavaScript. It
appears on the homepage and inside Toolbox pages that use `{% worldmap %}`.

**Don't edit the `chunk-*.mjs` files.** They're machine-generated, minified,
and they'd be replaced wholesale by any future export. The two safe ways to
change the map's behaviour:

- **Appearance** — CSS overrides in `../index.css`, scoped to
  `.worldmap-mount` or `.docs-worldmap-embed`. There are already several.
- **Interaction** — `../site/worldmap/WorldMap.jsx`, which
  mounts the map and intercepts clicks on the city markers.

The map injects its own stylesheet at runtime, which can collide with the
Toolbox's typography. That collision and its fix are `CLAUDE.md` rule 10 —
read it before adding CSS that might reach in here.

`bootstrap.mjs` is ours: it mounts the export and patches it to share the
app's single React instance.
