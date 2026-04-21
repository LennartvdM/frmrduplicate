/**
 * Runtime bootstrap for mounting the original frmrduplicate MapComponent.
 *
 * The Framer chunks are patched to externalize React/ReactDOM: their
 * internal `x` (React) and `un` (ReactDOM) vars point at Frankenstein's
 * npm copies, so there is a single React instance on the page and the
 * SDK shares context/fiber state with the host app. See chunk-5swt4qjj.mjs
 * for the three-point patch (imports + two redirects).
 *
 * Export resolution:
 *   chunk-yswte6p7 export `b` → MapComponent (withCSS-wrapped, "Map")
 */
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { b as MapComponent } from './chunk-yswte6p7.mjs';

export function renderMapInto(node, props = {}) {
  const element = createElement(MapComponent, {
    variant: 'JxNX4Rz95',
    style: { width: '100%', height: '100%' },
    ...props,
  });
  const root = createRoot(node);
  root.render(element);
  return () => {
    try { root.unmount(); } catch {}
  };
}
