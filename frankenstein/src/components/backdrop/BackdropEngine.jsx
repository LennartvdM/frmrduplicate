import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import BackdropCell from './BackdropCell';
import {
  UNIVERSAL_DECK_SOURCES,
  UNIVERSAL_SECTION_TO_VIDEO,
} from '../../config/videoBackdropRoutes';
import { VARIANTS } from '../sections/medical/MedicalSection.data';
import { VideoBackdropContext } from '../../context/VideoBackdropContext';

/**
 * One backdrop engine for the whole site.
 *
 * Design contract — the content module and the backdrop share one wire
 * (URL strings + a scroll-container ref) and NO animation timing. The
 * engine decides motion from page identity + scroll position + a small
 * imperative API; the content module never tries to coordinate with it.
 *
 * Route transitions are handled by the browser's View Transitions API,
 * not this engine. The backdrop's root div carries
 * `view-transition-name: backdrop` so it's captured as an independent
 * group (NOT part of the catch-all root group). CSS in index.css
 * drives it with a deck-fade staircase — old snapshot above new,
 * ticking 1 → 0 — while the foreground (captured as `content` via a
 * wrapper div in RouteTransition) slides horizontally per
 * `html[data-nav-direction]`. Never a 50% crossfade valley, never a
 * horizontal slide of the backdrop itself.
 *
 * (Historical note: this engine used to run its own rAF-driven page-
 * level deck-fade, and set `view-transition-name: none` on its root
 * div expecting to opt the backdrop out of the root snapshot. That
 * was wrong — `none` is the default state of every element and simply
 * means "don't create a separate named transition group". An element
 * with `none` is still captured as part of root, so the backdrop
 * sliding WITH root was the observed bug. Giving it a real name
 * (`backdrop`) is what actually makes it an independent group. For
 * symmetry, the front content was later pulled out of `root` too —
 * see RouteTransition.jsx — because Framer Motion's chunk injects
 * styles that contest `::view-transition-*(root)`.)
 *
 * Three scroll-aware contexts resolve the current target per-page:
 *   1. Home:  four cells stacked on y, translated by scrollProgress.
 *             (Intro=camo, V2=video deck, V3=video deck, WorldMap=camo.)
 *             V2/V3 deck tops come from each medical section's carousel
 *             — published imperatively via setMedicalCarouselTop.
 *   2. Blog:  one cell backed by UNIVERSAL_DECK_SOURCES; top URL set by
 *             the blog page's scroll-spy via setBlogTopUrl.
 *   3. Other: single camo cell (toolbox, etc.).
 *
 * V2 ↔ V3 on Home still slides vertically via the scroll-snap y-stack
 * (translates with scrollProgress). That's the only slide the engine
 * itself produces; route-change slides belong to the foreground.
 *
 * Mounted once in AppShell and never unmounts.
 */

// Page identities. All non-Home pages are a single cell.
const PAGE_HOME = 'home';
const PAGE_NEOFLIX = 'neoflix';
const PAGE_PUBLICATIONS = 'publications';
const PAGE_TOOLBOX = 'toolbox';

function pageIdForPath(pathname) {
  if (!pathname || pathname === '/') return PAGE_HOME;
  if (pathname === '/neoflix') return PAGE_NEOFLIX;
  if (pathname === '/publications') return PAGE_PUBLICATIONS;
  if (pathname === '/contact') return PAGE_NEOFLIX; // /contact is neoflix
  if (pathname === '/toolbox' || pathname.startsWith('/toolbox/')) {
    return PAGE_TOOLBOX;
  }
  return PAGE_HOME;
}

// Home cell layout — must match Home.jsx's sections array order.
const HOME_CELLS = [
  { kind: 'camo',  variant: null }, // 0 Intro
  { kind: 'video', variant: 'v2' }, // 1 MedicalSectionV2
  { kind: 'video', variant: 'v3' }, // 2 MedicalSectionV3
  { kind: 'camo',  variant: null }, // 3 WorldMap
];

const initialState = {
  homeScrollProgress: 0,
  medicalTops: { v2: null, v3: null },
  blogTopUrl: null,
};

function reducer(state, action) {
  switch (action.type) {
    case 'set-home-progress':
      if (state.homeScrollProgress === action.progress) return state;
      return { ...state, homeScrollProgress: action.progress };
    case 'set-medical-top': {
      const { variant, url } = action;
      if (!variant || state.medicalTops[variant] === url) return state;
      return {
        ...state,
        medicalTops: { ...state.medicalTops, [variant]: url },
      };
    }
    case 'set-blog-top':
      if (state.blogTopUrl === action.url) return state;
      return { ...state, blogTopUrl: action.url };
    default:
      return state;
  }
}

/**
 * BackdropEngine — provider + renderer. Wrap the app's Routes with
 * this; it hosts the backdrop render (fixed inset-0, z-0) and exposes
 * the engine API through VideoBackdropContext.
 */
export default function BackdropEngine({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Scroll subscription — ScrollSnap calls registerHomeScrollContainer
  // with its scroll container element on mount. Engine reads scrollTop
  // on every scroll (passive) and dispatches progress. This bypasses
  // React state for the scroll trigger itself — dispatch reduces to a
  // no-op when progress equals the existing value.
  const [container, setContainer] = useState(null);
  const registerHomeScrollContainer = useCallback((node) => {
    setContainer(node || null);
  }, []);

  useEffect(() => {
    if (!container) return undefined;
    let raf = 0;
    const read = () => {
      const h = container.clientHeight;
      if (!h) return;
      const progress = container.scrollTop / h;
      dispatch({ type: 'set-home-progress', progress });
      raf = 0;
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(read);
    };
    read();
    container.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [container]);

  // API surface for content components. Stable references — context
  // value never changes except when the setter identities do (never).
  const api = useMemo(
    () => ({
      setMedicalCarouselTop: (variant, url) =>
        dispatch({ type: 'set-medical-top', variant, url }),
      setBlogTopUrl: (url) => dispatch({ type: 'set-blog-top', url }),
      // Legacy bridges — kept so the migration is incremental. Intro
      // and WorldMap call setActiveVideoUrl(null), but on Home that
      // signal is no longer needed (Home's camo cells render when
      // scrollProgress parks on them), so these are no-ops when
      // called with null. BlogPage uses setActiveSection(id) — we
      // route it to setBlogTopUrl via the universal section map.
      setActiveSection: (id) =>
        dispatch({
          type: 'set-blog-top',
          url: id ? UNIVERSAL_SECTION_TO_VIDEO[id] || null : null,
        }),
      setActiveVideoUrl: () => {
        /* no-op under new architecture; Home cells don't publish
           via this channel anymore. See MedicalSection + Intro. */
      },
      registerHomeScrollContainer,
    }),
    [registerHomeScrollContainer]
  );

  return (
    <>
      <BackdropRenderer state={state} />
      <VideoBackdropContext.Provider value={api}>
        {children}
      </VideoBackdropContext.Provider>
    </>
  );
}

/**
 * Renders the backdrop DOM. Split out so scroll-driven re-renders of
 * state don't bounce the provider value.
 *
 * Route transitions are delegated entirely to the browser's View
 * Transitions API. The root div's `view-transition-name: backdrop`
 * captures this subtree as its own group (independent of `content`),
 * and index.css runs the deck-fade keyframes on the old snapshot while
 * the `content` group slides horizontally. We render only the *current*
 * page here — the browser's snapshot pair supplies the cross-page
 * transition imagery.
 */
function BackdropRenderer({ state }) {
  const location = useLocation();
  const currentPage = pageIdForPath(location.pathname);

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        backgroundColor: '#1c3424',
        // Independent view-transition group. `none` here would *not*
        // opt out (that's the default for every element) — it would
        // leave the backdrop inside the root capture and make it slide
        // along with the foreground. A real name gives it its own
        // old/new snapshots that index.css animates with a deck-fade.
        // The front content wears its own name (`content`) via
        // RouteTransition, so the two layers never share a group.
        viewTransitionName: 'backdrop',
      }}
      aria-hidden="true"
    >
      <PageBackdrop page={currentPage} state={state} />
    </div>
  );
}

/**
 * Compose the backdrop for one page identity.
 *
 * The route-change transition is owned by the browser (view transitions),
 * so at any given commit this component only renders the *current* page
 * — we always let its videos decode. The old-page imagery during a
 * route transition is the browser's snapshot, not a concurrently-
 * rendered sibling.
 */
function PageBackdrop({ page, state }) {
  if (page === PAGE_HOME) {
    return <HomeBackdrop state={state} canDecode />;
  }
  if (page === PAGE_NEOFLIX || page === PAGE_PUBLICATIONS) {
    return <BlogBackdrop state={state} canDecode />;
  }
  return <BackdropCell kind="camo" decodeState="idle" />;
}

/**
 * Home: 4-cell vertical stack. Translates with the Home scroll-snap
 * container's scrollProgress. Intro and WorldMap are camo cells;
 * V2 and V3 are video decks whose `topIdx` comes from each medical
 * section's carousel state (published imperatively).
 *
 * Decode budget during a vertical slide: floor(scrollProgress) and
 * ceil(scrollProgress) are both "on-screen" and allowed to decode —
 * that covers the V2↔V3 case where both videos must be live during
 * the translate. When parked on a cell, only that cell decodes.
 */
function HomeBackdrop({ state, canDecode }) {
  const { homeScrollProgress, medicalTops } = state;
  const floor = Math.floor(homeScrollProgress);
  const ceil = Math.min(HOME_CELLS.length - 1, Math.ceil(homeScrollProgress));

  return (
    <>
      {HOME_CELLS.map((cell, idx) => {
        // Stack cells on y so cell N's natural position is +N * 100%;
        // shift the whole stack by -scrollProgress so the current cell
        // sits at 0. Effective translateY = (idx - scrollProgress) * 100.
        const offset = (idx - homeScrollProgress) * 100;
        const onScreen = idx === floor || idx === ceil;
        const shouldDecode = canDecode && onScreen && cell.kind === 'video';

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

        const variantCfg = VARIANTS[cell.variant];
        const deck = variantCfg.blurVideos.map((b) => b.video);
        const publishedUrl = medicalTops[cell.variant];
        // Resolve topIdx from the URL the medical section published.
        // No publish yet → default to 0 (first blur video in this cell's
        // deck). Medical section publishes its current carousel state
        // as soon as it becomes active.
        const resolvedIdx = publishedUrl
          ? Math.max(0, deck.indexOf(publishedUrl))
          : 0;
        return (
          <div
            key={idx}
            className="absolute inset-0"
            style={{ transform: `translateY(${offset}%)` }}
          >
            <BackdropCell
              kind="video"
              deck={deck}
              topIdx={resolvedIdx}
              decodeState={shouldDecode ? 'active' : 'idle'}
            />
          </div>
        );
      })}
    </>
  );
}

/**
 * Blog-style pages: one cell rendering UNIVERSAL_DECK_SOURCES. topIdx
 * comes from blogTopUrl (set by the blog page's scroll-spy via context).
 * When nothing is published the video layer fades out and the engine's
 * #1c3424 fill shows through.
 */
function BlogBackdrop({ state, canDecode }) {
  const { blogTopUrl } = state;
  const resolvedIdx = blogTopUrl
    ? Math.max(0, UNIVERSAL_DECK_SOURCES.indexOf(blogTopUrl))
    : -1;
  const hasTarget = resolvedIdx >= 0;
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
        deck={UNIVERSAL_DECK_SOURCES}
        topIdx={hasTarget ? resolvedIdx : 0}
        decodeState={canDecode && hasTarget ? 'active' : 'idle'}
      />
    </div>
  );
}
