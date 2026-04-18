import React, {
  useCallback,
  useMemo,
  useReducer,
} from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import BackdropCell from './BackdropCell';
import { BackdropContext } from './context';

/**
 * BackdropProvider — the one backdrop for the whole site.
 *
 * Design contract — one wire, no shared animation state. Consumers
 * publish what they want shown through two stable setters
 * (setTarget / setHomeScrollProgress, exposed via the useBackdrop
 * hooks). The provider decides how to render from route identity +
 * whatever targets are currently published; callers never coordinate
 * timing with it.
 *
 * Route transitions crossfade this backdrop via Framer Motion's
 * AnimatePresence — no browser-level view-transition snapshot. Each
 * render mode is a separate child keyed by its page id; AnimatePresence
 * fades the outgoing one out and the incoming one in on its own
 * timeline, fully independent of the route slide happening in
 * RouteSlider.
 *
 * Three render modes keyed by pathname:
 *   1. Home  — 3-cell y-stack, translated by homeScrollProgress.
 *              Intro is camo; medical V2/V3 read their topIdx from
 *              targets['medical-v2'] / targets['medical-v3'].
 *   2. Blog  — one cell backed by the union blog deck; topIdx from
 *              targets['blog'].
 *   3. Other — single camo cell (toolbox, unknown routes).
 *
 * Mounted once in App.jsx and never unmounts.
 */

// Route identity. All non-Home, non-Blog pages get the camo renderer.
const PAGE_HOME = 'home';
const PAGE_BLOG = 'blog';
const PAGE_CAMO = 'camo';

function pageIdForPath(pathname) {
  if (!pathname || pathname === '/') return PAGE_HOME;
  if (pathname === '/neoflix' || pathname === '/publications' || pathname === '/contact') {
    return PAGE_BLOG;
  }
  return PAGE_CAMO;
}

// Home y-stack layout — must match Home.jsx's sections array order.
// WorldMap is parked, so Home is 3 sections: intro + two medical variants.
// Cell 0 is the intro (camo), cells 1-2 are medical variants that read
// their topIdx from targets['medical-v{variant}'].
const HOME_CELLS = [
  { kind: 'camo' },
  { kind: 'video', targetKey: 'medical-v2' },
  { kind: 'video', targetKey: 'medical-v3' },
];

const initialState = {
  homeScrollProgress: 0,
  targets: {},
};

function reducer(state, action) {
  switch (action.type) {
    case 'set-scroll':
      if (state.homeScrollProgress === action.progress) return state;
      return { ...state, homeScrollProgress: action.progress };
    case 'set-target': {
      const { id, target } = action;
      const prev = state.targets[id] || null;
      if (target === null && prev === null) return state;
      if (target && prev && targetsEqual(target, prev)) return state;
      const nextTargets = { ...state.targets };
      if (target === null) delete nextTargets[id];
      else nextTargets[id] = target;
      return { ...state, targets: nextTargets };
    }
    default:
      return state;
  }
}

function targetsEqual(a, b) {
  if (a === b) return true;
  if (a.kind !== b.kind) return false;
  if (a.topIdx !== b.topIdx) return false;
  if (a.deck === b.deck) return true;
  if (a.deck.length !== b.deck.length) return false;
  for (let i = 0; i < a.deck.length; i++) {
    if (a.deck[i] !== b.deck[i]) return false;
  }
  return true;
}

export default function BackdropProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setTarget = useCallback((id, target) => {
    dispatch({ type: 'set-target', id, target });
  }, []);
  const setHomeScrollProgress = useCallback((progress) => {
    dispatch({ type: 'set-scroll', progress });
  }, []);

  // Stable context value — setter identities never change, so children
  // that depend on the context don't re-render from this alone.
  const api = useMemo(
    () => ({ setTarget, setHomeScrollProgress }),
    [setTarget, setHomeScrollProgress]
  );

  return (
    <>
      <BackdropRenderer state={state} />
      <BackdropContext.Provider value={api}>
        {children}
      </BackdropContext.Provider>
    </>
  );
}

/**
 * Renders the backdrop DOM. Split from the provider so scroll-driven
 * state changes don't bounce the context value.
 *
 * The backdrop root is a live, persistent element — it never enters a
 * view-transition snapshot. When the route changes, AnimatePresence
 * crossfades the outgoing page's render mode (home / blog / camo) out
 * while the incoming one fades in. This happens concurrently with the
 * route slide in RouteSlider but is completely decoupled from it.
 */
// Long crossfade (2s) outlasts the route slide (~0.45s) on purpose:
// fade tolerance is much higher than spatial-motion tolerance, so a
// slow cross-fade reads as a smooth environment change behind crisp
// slides. Matches the old VT deck-fade duration.
const BACKDROP_FADE = { duration: 2, ease: [0, -0.02, 0.2, 1] };

function BackdropRenderer({ state }) {
  const location = useLocation();
  const page = pageIdForPath(location.pathname);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        backgroundColor: '#1c3424',
      }}
      aria-hidden="true"
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={page}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: BACKDROP_FADE }}
          exit={{ opacity: 0, transition: BACKDROP_FADE }}
        >
          {page === PAGE_HOME && <HomeBackdrop state={state} />}
          {page === PAGE_BLOG && <BlogBackdrop state={state} />}
          {page === PAGE_CAMO && (
            <BackdropCell kind="camo" decodeState="idle" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/**
 * Home: 3-cell y-stack. Translates with the Home scroll-snap
 * container's progress (published by ScrollSnap through
 * useHomeScrollProgress). Intro is camo; the two medical variants
 * read their topIdx from published targets.
 *
 * Decode budget during a vertical slide: floor(progress) and
 * ceil(progress) are both "on-screen" and allowed to decode — that
 * covers V2↔V3 where both videos must be live during the translate.
 * When parked on a cell, only that cell decodes.
 */
function HomeBackdrop({ state }) {
  const { homeScrollProgress, targets } = state;
  const floor = Math.floor(homeScrollProgress);
  const ceil = Math.min(HOME_CELLS.length - 1, Math.ceil(homeScrollProgress));

  return (
    <>
      {HOME_CELLS.map((cell, idx) => {
        // Stack cells on y: cell N's natural position is +N * 100%;
        // shift the whole stack by -progress so the current cell sits
        // at 0. Effective translateY = (idx - progress) * 100.
        const offset = (idx - homeScrollProgress) * 100;
        const onScreen = idx === floor || idx === ceil;

        if (cell.kind === 'camo') {
          return (
            <div
              key={idx}
              className="absolute inset-0"
              style={{ transform: `translateY(${offset}%)` }}
            >
              <BackdropCell kind="camo" decodeState="idle" />
            </div>
          );
        }

        const target = targets[cell.targetKey];
        // No publish yet → render the deck at idx 0 (fresh mount state).
        // Whichever medical section owns this cell publishes as soon as
        // it's inView, so this fallback is only hit for a single frame
        // on first paint.
        const deck = target?.deck || [];
        const topIdx = target?.topIdx ?? 0;
        return (
          <div
            key={idx}
            className="absolute inset-0"
            style={{ transform: `translateY(${offset}%)` }}
          >
            <BackdropCell
              kind="video"
              deck={deck}
              topIdx={topIdx}
              decodeState={onScreen ? 'active' : 'idle'}
            />
          </div>
        );
      })}
    </>
  );
}

/**
 * Blog-style pages: one cell rendering the union blog deck. topIdx
 * comes from targets['blog'] (published by BlogPage's scroll-spy).
 * When nothing is published the cell fades out and the engine's
 * #1c3424 fill shows through.
 */
function BlogBackdrop({ state }) {
  const target = state.targets.blog;
  const hasTarget = Boolean(target);
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: hasTarget ? 1 : 0,
        transition: 'opacity 0.35s ease-out',
      }}
    >
      <BackdropCell
        kind="video"
        deck={target?.deck || []}
        topIdx={target?.topIdx ?? 0}
        decodeState={hasTarget ? 'active' : 'idle'}
      />
    </div>
  );
}
