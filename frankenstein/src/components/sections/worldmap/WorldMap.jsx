import React, { useEffect, useRef } from 'react';
import { renderMapInto } from '../../../frmr-map/bootstrap.mjs';
import useTransitionNavigate from '../../../hooks/useTransitionNavigate';

/**
 * Shared worldmap mount used by both the home slide (full-bleed) and the
 * docs `{% worldmap %}` embed (bounded). Mounts the original frmrduplicate
 * MapComponent and intercepts city-marker clicks.
 *
 * The Framer chunks in src/frmr-map/ are patched to externalize React and
 * ReactDOM — their internal `x` and `un` vars redirect to npm copies via
 * Vite's build graph. One React instance, one fiber tree.
 *
 * City markers are tagged by the compiled Framer output with
 * `data-framer-name="<City>"` + `data-highlight="true"`. We catch
 * pointerdown/up/click in the capture phase on the wrapper, swallow the
 * gesture before Framer Motion's onTap zoom fires, and slide-route into
 * the matching toolbox page via useTransitionNavigate.
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

function findCityFromEvent(event) {
  const el = event.target?.closest?.(
    '[data-framer-name][data-highlight="true"]'
  );
  if (!el) return null;
  const name = el.getAttribute('data-framer-name');
  return CITY_SLUGS[name] ? name : null;
}

export default function WorldMap({ className = '', style }) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);
  const transitionNavigate = useTransitionNavigate();
  const navigateRef = useRef(transitionNavigate);
  navigateRef.current = transitionNavigate;

  useEffect(() => {
    if (!mountRef.current) return undefined;
    cleanupRef.current = renderMapInto(mountRef.current);
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

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
      if (!city) return;
      event.preventDefault();
      event.stopPropagation();
      navigateRef.current(`/toolbox/${CITY_SLUGS[city]}`);
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
