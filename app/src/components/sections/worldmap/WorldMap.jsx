import React, { useEffect, useRef } from 'react';
import { renderMapInto } from '../../../framer-map/bootstrap.mjs';
import useTransitionNavigate from '../../../hooks/useTransitionNavigate';

/**
 * Shared worldmap mount used by both the home slide (full-bleed,
 * autocycling) and the docs `{% worldmap %}` embed (bounded, can start
 * paused on a chosen city). Mounts the original Framer
 * MapComponent and intercepts city-marker clicks.
 *
 * The Framer chunks in src/framer-map/ are patched to externalize React
 * and ReactDOM (one React instance, one fiber tree) and to gate the
 * variant-cycle delay behind `globalThis.__FRMR_AUTOCYCLE_PAUSED__` —
 * see chunk-5swt4qjj.mjs. When the flag is true, scheduled variant
 * advances no-op, freezing the map on its current variant.
 *
 * The map drives a two-step interaction. Tapping a legend entry
 * ("NICU <City>", tagged `data-framer-name="<City>"`) is left untouched
 * so Framer Motion's own onTap pans the camera to that city — a "slide"
 * in the autocycle rotation, all baked into the map component. The on-map
 * pin that surfaces there (`data-framer-name="Marker<City>"`) is the
 * actual toolbox link: we catch its pointerdown/up/click in the capture
 * phase on the wrapper, swallow the gesture before Framer reacts, and
 * slide-route into the matching toolbox page via useTransitionNavigate.
 * A non-legend tap on the embed's own marker or on the map background
 * fires onActivate instead of navigating — used by the embed to resume
 * autocycling.
 */

export const CITY_SLUGS = {
  Leiden:
    'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-leiden-the-netherlands',
  Philadelphia:
    'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-philadelphia-pennsylvania-usa',
  Vienna:
    'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-vienna-austria',
  Melbourne:
    'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-melbourne-australia',
};

// Framer variant IDs for the world-view focused on each city. These are
// stops on the autocycle (Leiden → Philadelphia Zoomed → ... → Australia
// Zoomed → Leiden) — when the map is paused the variant stays here.
export const CITY_VARIANTS = {
  Leiden: 'JxNX4Rz95',
  Philadelphia: 'EvvqCP6nV',
  Vienna: 'jnA617SP9',
  Melbourne: 'MVG35Wb9S',
};

// All the data-framer-name flavors Framer uses for each city: legend
// button ("Leiden"), zoomed wrapper ("Leiden Zoomed"), click variants
// ("Clickedzoomleiden", "ClickzoomPhiladelphia", "Clickzoomvienna",
// "ClickzoomAustralia"), on-map pins ("Markerleiden",
// "MarkerPhiladelphia", "MarkerVienna", "MarkerMelbourne") and the
// floating label ("NICU Vienna" etc). Substring match keeps this robust
// across every variant the autocycle can land on. "Australia" (Framer's
// region label) maps to Melbourne.
const NAME_SUBSTRINGS = [
  ['leiden', 'Leiden'],
  ['philadelphia', 'Philadelphia'],
  ['vienna', 'Vienna'],
  ['melbourne', 'Melbourne'],
  ['australia', 'Melbourne'],
];

function cityFromName(name) {
  if (!name) return null;
  if (CITY_SLUGS[name]) return name;
  const lower = name.toLowerCase();
  for (const [needle, city] of NAME_SUBSTRINGS) {
    if (lower.includes(needle)) return city;
  }
  return null;
}

function findCityFromEvent(event) {
  let el = event.target?.closest?.('[data-framer-name]');
  while (el) {
    const city = cityFromName(el.getAttribute('data-framer-name') || '');
    if (city) return city;
    const parent = el.parentElement;
    el = parent ? parent.closest('[data-framer-name]') : null;
  }
  return null;
}

// Like findCityFromEvent but only matches the on-map pins
// ("Marker<City>"), walking the full ancestor chain so a tap on the pin's
// inner label still resolves to its marker. Legend buttons, floating
// labels and the map background all return null — those are left for
// Framer's native onTap (which pans the camera) to handle.
function findMarkerCityFromEvent(event) {
  let el = event.target?.closest?.('[data-framer-name]');
  while (el) {
    const name = el.getAttribute('data-framer-name') || '';
    if (/^marker/i.test(name)) return cityFromName(name);
    const parent = el.parentElement;
    el = parent ? parent.closest('[data-framer-name]') : null;
  }
  return null;
}

export default function WorldMap({
  className = '',
  style,
  variant,
  paused = false,
  currentCity = null,
  onActivate,
}) {
  // Set the autocycle flag synchronously during render so it is in
  // place before Framer's first activeVariantCallback can schedule its
  // delay timer. (useLayoutEffect would also be early enough in normal
  // ordering, but the inner createRoot pass that mounts MapComponent
  // can race depending on React's scheduler — doing it in render is the
  // simplest guarantee.) The patched `delay` in chunk-5swt4qjj.mjs
  // polls this flag after each setTimeout, so any state we publish here
  // takes effect on the next tick.
  if (typeof globalThis !== 'undefined') {
    globalThis.__FRMR_AUTOCYCLE_PAUSED__ = paused;
  }

  const mountRef = useRef(null);
  const cleanupRef = useRef(null);
  const transitionNavigate = useTransitionNavigate();
  const navigateRef = useRef(transitionNavigate);
  navigateRef.current = transitionNavigate;
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;
  const currentCityRef = useRef(currentCity);
  currentCityRef.current = currentCity;
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  // Always clear the flag on unmount so the next page (e.g. slide 4)
  // doesn't inherit a stale paused state.
  useEffect(() => {
    return () => {
      if (typeof globalThis !== 'undefined') {
        globalThis.__FRMR_AUTOCYCLE_PAUSED__ = false;
      }
    };
  }, []);

  useEffect(() => {
    if (!mountRef.current) return undefined;
    cleanupRef.current = renderMapInto(mountRef.current, variant ? { variant } : {});
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [variant]);

  useEffect(() => {
    const node = mountRef.current;
    if (!node) return undefined;

    // Only swallow gestures on the on-map markers. Legend taps must reach
    // Framer Motion's native onTap so it pans the camera to that city —
    // the "slide" transition baked into the map component.
    const swallow = (event) => {
      if (findMarkerCityFromEvent(event)) {
        event.stopPropagation();
      }
    };

    const handleClick = (event) => {
      // The on-map marker is the toolbox link.
      const markerCity = findMarkerCityFromEvent(event);
      if (markerCity && markerCity !== currentCityRef.current) {
        event.preventDefault();
        event.stopPropagation();
        navigateRef.current(`/toolbox/${CITY_SLUGS[markerCity]}`);
        return;
      }
      // A legend tap falls through untouched so Framer pans the camera.
      // The embed resumes autocycling on any non-legend tap: its own
      // marker (markerCity === currentCity) or the map background.
      const isLegendTap = !markerCity && Boolean(findCityFromEvent(event));
      if (!isLegendTap && pausedRef.current && onActivateRef.current) {
        event.preventDefault();
        event.stopPropagation();
        onActivateRef.current();
      }
    };

    node.addEventListener('pointerdown', swallow, true);
    node.addEventListener('pointerup', swallow, true);
    node.addEventListener('click', handleClick, true);
    return () => {
      node.removeEventListener('pointerdown', swallow, true);
      node.removeEventListener('pointerup', swallow, true);
      node.removeEventListener('click', handleClick, true);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`worldmap-mount ${className}`.trim()}
      style={{
        background:
          'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
        ...style,
      }}
    />
  );
}
