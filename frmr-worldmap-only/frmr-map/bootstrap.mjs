/**
 * Runtime bootstrap for loading frmrduplicate's original MapComponent.
 *
 * Dynamically imports the deployed Framer chunks and renders MapComponent
 * with its own bundled React into a target DOM node — no reimplementation,
 * no npm framer-motion, no deviations. This is the same compiled code
 * running on /frmrduplicate/, just mounted inside a different host.
 *
 * Export resolution verified against site/sites/neoflix/script_main.mjs:
 *   chunk-5swt4qjj export `c` → JSX factory (createElement)
 *   chunk-5swt4qjj export `A` → ReactDOM (or its default wrapper via `z`)
 *   chunk-yswte6p7 export `b` → MapComponent (withCSS-wrapped, displayName "Map")
 */
import * as rt from './chunk-5swt4qjj.mjs';
import * as mapChunk from './chunk-yswte6p7.mjs';

// Same default-export dance the real bootstrap does.
const reactDomPkg = rt.A;
const ReactDOM = 'default' in reactDomPkg ? rt.z : reactDomPkg;
const createRoot = ReactDOM.createRoot;
const createElement = rt.c;
const MapComponent = mapChunk.b;

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
