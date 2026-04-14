/**
 * Mount a frmrduplicate page chunk into a frankenstein div.
 *
 * Uses the same runtime (chunk-5swt4qjj) + ReactDOM that the real
 * /frmrduplicate bootstrap uses. The page component is the chunk's
 * default export — for the neoflix and publications pages that's the
 * full Framer page (navbar + backdrop + sidebar + content sections).
 *
 * This is the same "ugly but faithful" pattern we used for the
 * worldmap: no reimplementation, just mount the actual compiled code.
 */
import * as rt from './chunk-5swt4qjj.mjs';
import * as iumf from './chunk-riumfbnj.mjs';

const reactDomPkg = rt.A;
const ReactDOM = 'default' in reactDomPkg ? rt.z : reactDomPkg;
const createRoot = ReactDOM.createRoot;
const createElement = rt.c;

// Mirror the environment setup script_main.mjs does before rendering.
const winLike = iumf.c;
if (winLike) {
  if (!winLike.__framer_importFromPackage) {
    winLike.__framer_importFromPackage = (l, r) => () =>
      createElement('div', { children: `Package component not supported: "${r}" in "${l}"` });
  }
  winLike.process = winLike.process || { env: { NODE_ENV: 'production' } };
  winLike.__framer_events = winLike.__framer_events || [];
}

/**
 * Mount a page chunk's default export into the given node.
 * `pageChunkUrl` is the full URL of the page chunk to import.
 */
export async function mountFrmrPage(node, pageChunkUrl, props = {}) {
  const pageModule = await import(/* @vite-ignore */ pageChunkUrl);
  const PageComponent = pageModule.default;
  if (!PageComponent) {
    throw new Error(`No default export from ${pageChunkUrl}`);
  }
  const element = createElement(PageComponent, props);
  const root = createRoot(node);
  root.render(element);
  return () => {
    try { root.unmount(); } catch {}
  };
}
