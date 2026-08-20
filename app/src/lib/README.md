# app/src/lib/

Shared helpers. Nothing here is specific to one page, and nothing here renders
anything — if you're looking for something a visitor sees, it's in `../pages/`.

- **`hooks/`** — viewport size, scroll position, section lifecycle,
  direction-aware navigation, document titles.
- **`utils/`** — asset URLs, the reduced-motion still-image swap
  (`reducedMedia.js`), markdown rendering, video element props.

Two of these are worth knowing about:

- `utils/reducedMedia.js` swaps backdrop videos for stills when the browser
  reports `prefers-reduced-motion`, Save-Data, or low device memory. It builds
  the still's path from the clip's filename at runtime, which is why those
  files look unreferenced to a plain text search.
- `hooks/useTabletLayout.js` is the one every component uses to decide whether
  it's on a phone. Despite the name it mostly answers "is this under 600px".
  `hooks/useViewport.js` overlaps it and should eventually be merged in.
