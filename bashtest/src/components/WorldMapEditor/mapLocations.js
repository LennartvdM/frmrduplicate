/**
 * City coordinate store for the click-to-place editor (`/map-editor`).
 *
 * Shape:
 *   { id, name, x, y, lat, lon }
 *     - x, y are in SVG viewBox units (0..1440, 0..700 for the world map)
 *     - lat, lon are optional (only filled for calibration anchors)
 *
 * The editor persists to localStorage and exports in two formats on demand:
 * the raw city array (what lives here) and the `locationPairs` shape that
 * `sections/worldmap/WorldMapSection.jsx` consumes — zoom-out and zoom-in
 * viewports share the same (x, y) center, only zoom differs.
 */
export const cities = [];

export const zoomLevels = {
  out: 1,
  in: 5,
};
