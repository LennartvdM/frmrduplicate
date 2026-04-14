/**
 * Mount a frmrduplicate page chunk into a frankenstein div.
 *
 * Reproduces the real /frmrduplicate bootstrap (script_main.wb5gsumg.mjs)
 * rather than rendering the page chunk's default export directly. The
 * default export is just the page component; without the three context
 * providers (Site / Router / PageTransitions) that script_main wraps
 * around it, internal hooks like useRoute / useLocale / useBreakpoint
 * return defaults and the Framer flex grid collapses — sidebar and
 * content stack on top of each other.
 *
 * This file mirrors script_main's setup + getPageRoot (N) function
 * verbatim, using the same chunk-5swt4qjj exports it imports (aa/T,
 * _/A, C/y, c/m, B/e, N/z, A/g, z/f). Route map is trimmed to just
 * the two routes we mount here.
 */
import * as rt from './chunk-5swt4qjj.mjs';
import * as iumf from './chunk-riumfbnj.mjs';

const T = rt.aa;  // Site context provider
const _A = rt._;  // Router config context provider (underscore export)
const y = rt.C;   // Page transitions context provider
const m = rt.c;   // jsx factory (React.createElement)
const e = rt.B;   // React.lazy / suspense wrapper for chunk imports
const z = rt.N;   // init function (script_main calls z() before render)

// ReactDOM resolution — matches script_main's `"default" in g ? f : g`
const reactDomPkg = rt.A;
const ReactDOM = 'default' in reactDomPkg ? rt.z : reactDomPkg;
const createRoot = ReactDOM.createRoot;

// Route map — trimmed from script_main.u to just the routes we mount.
// Keys are the internal Framer route IDs; `page` is wrapped in `e` to
// turn the import promise into a suspense-friendly lazy value.
const ROUTES = {
  bzydBB85Y: {
    elements: {
      dbtg_NZW8: 'dance1',
      DXqsCYt4L: 'perspectives1',
      mRVhqybMB: 'skills1',
      NYP2seWhD: 'team1',
      tftSCv8zZ: 'cost1',
      WjO84y3BZ: 'time1',
    },
    page: e(() => import('./r-i-lvusp0upuyen_-noede9lquwyi4ivhta2kytius.3x4mi74y.mjs')),
    path: '/neoflix',
  },
  aLuYbVoBY: {
    elements: {
      DSPosq1GU: 'narrative',
      Y8dEgTIYh: 'recordfelectrefine',
      zQbFj9_vB: 'providers',
    },
    page: e(() => import('./wipgqg_rrnb9vnxe9-sx-yopnjd6w2fz2buc9b-zrv8.mg5izp6c.mjs')),
    path: '/Publications',
  },
};

const LOCALES = [{ code: 'en-US', id: 'default', name: 'English', slug: '' }];

// Page transition config (copied from script_main)
const PAGE_TRANSITION = {
  enter: {
    opacity: 0,
    rotate: 0,
    rotate3d: false,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    transition: {
      damping: 30,
      delay: 0,
      duration: 0.2,
      ease: [0.27, 0, 0.51, 1],
      mass: 1,
      stiffness: 400,
      type: 'tween',
    },
    x: '0px',
    y: '0px',
  },
};

/**
 * Re-implementation of script_main's `N` (getPageRoot) — wraps the page
 * component in the three context providers Framer expects.
 */
async function getPageRoot({ routeId, localeId, pathVariables }) {
  await ROUTES[routeId].page.preload();

  const siteEl = m(T, {
    isWebsite: true,
    routeId,
    pathVariables,
    routes: ROUTES,
    collectionUtils: {},
    framerSiteId: '1f896049bc80eeaf847daeda1d5b19e3b628f61340b15f6395e0420ec7a18a50',
    notFoundPage: e(() => import('./SitesNotFoundPage.js@1.1-B76N3TRR.mjs')),
    isReducedMotion: true,
    localeId,
    locales: LOCALES,
    preserveQueryParams: undefined,
  });

  const routerEl = m(_A, {
    children: siteEl,
    value: { enableAsyncURLUpdates: false, useGranularSuspense: false },
  });

  // Route transition map — every route uses the same PAGE_TRANSITION.
  const routeTransitions = {};
  for (const id of Object.keys(ROUTES)) {
    routeTransitions[id] = { augiA20Il: PAGE_TRANSITION };
  }

  return m(y, { children: routerEl, value: { routes: routeTransitions } });
}

// Set up the globals script_main installs on window before rendering.
const winLike = iumf.c;
let globalsInstalled = false;
function installGlobalsOnce() {
  if (globalsInstalled || !winLike) return;
  globalsInstalled = true;
  if (!winLike.__framer_importFromPackage) {
    winLike.__framer_importFromPackage = (l, r) => () =>
      m('div', { children: `Package component not supported: "${r}" in "${l}"` });
  }
  winLike.process = winLike.process || { env: { NODE_ENV: 'production' } };
  winLike.__framer_events = winLike.__framer_events || [];
  try { z(); } catch {} // script_main calls this — run it once for init side effects
}

/**
 * Mount the frmrduplicate page identified by `routeId` into `node`.
 * Supported routeIds: 'bzydBB85Y' (/neoflix), 'aLuYbVoBY' (/Publications).
 */
export async function mountFrmrPage(node, routeId) {
  installGlobalsOnce();
  const pageRoot = await getPageRoot({
    routeId,
    localeId: 'default',
    pathVariables: {},
  });
  const root = createRoot(node);
  root.render(pageRoot);
  return () => { try { root.unmount(); } catch {} };
}
