import React, { useEffect, useRef } from 'react';
import { renderMapInto } from '../../../frmr-map/bootstrap.mjs';
import useTransitionNavigate from '../../../hooks/useTransitionNavigate';

/**
 * Shared worldmap mount used by both the home slide (full-bleed,
 * autocycling) and the docs `{% worldmap %}` embed (bounded, can start
 * paused on a chosen city). Mounts the original frmrduplicate
 * MapComponent and intercepts city-marker clicks.
 *
 * The Framer chunks in src/frmr-map/ are patched to externalize React
 * and ReactDOM (one React instance, one fiber tree) and to gate the
 * variant-cycle delay behind `globalThis.__FRMR_AUTOCYCLE_PAUSED__` —
 * see chunk-5swt4qjj.mjs. When the flag is true, scheduled variant
 * advances no-op, freezing the map on its current variant.
 *
 * City markers are tagged by the compiled Framer output with
 * `data-framer-name="<City>"` + `data-highlight="true"`. We catch
 * pointerdown/up/click in the capture phase on the wrapper, swallow the
 * gesture before Framer Motion's onTap zoom fires, and slide-route into
 * the matching toolbox page via useTransitionNavigate. A click on the
 * map's "own" city (currentCity) or on background fires onActivate
 * instead of navigating — used by the embed to start autocycling.
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

function findCityFromEvent(event) {
  const el = event.target?.closest?.(
    '[data-framer-name][data-highlight="true"]'
  );
  if (!el) return null;
  const name = el.getAttribute('data-framer-name');
  return CITY_SLUGS[name] ? name : null;
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

    const swallow = (event) => {
      if (findCityFromEvent(event)) {
        event.stopPropagation();
      }
    };

    const handleClick = (event) => {
      const city = findCityFromEvent(event);
      if (city && city !== currentCityRef.current) {
        event.preventDefault();
        event.stopPropagation();
        navigateRef.current(`/toolbox/${CITY_SLUGS[city]}`);
        return;
      }
      // Same-city marker click or background click while paused →
      // hand off to the embed so it can resume autocycling.
      if (pausedRef.current && onActivateRef.current) {
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
