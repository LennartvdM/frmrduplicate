import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';
import BackdropCell from './BackdropCell';
import {
  UNIVERSAL_DECK_SOURCES,
  UNIVERSAL_SECTION_TO_VIDEO,
} from '../../config/videoBackdropRoutes';
import { VARIANTS } from '../sections/medical/MedicalSection.data';
import { getNavIndexForPath } from '../../hooks/useNavIndex';
import { VideoBackdropContext } from '../../context/VideoBackdropContext';

/**
 * One backdrop engine for the whole site.
 *
 * Design contract — the content module and the backdrop share one wire
 * (URL strings + a scroll-container ref) and NO animation timing. The
 * engine decides motion from page identity + scroll position + a small
 * imperative API; the content module never tries to coordinate with it.
 *
 * Two motion primitives, picked per-transition:
 *   - Deck fade — the video → video answer. Within one cell, rule 0
 *     (staircase opacity) drives it. Across pages (e.g. Home parked
 *     on V2 → /neoflix), we apply the same staircase at the PAGE
 *     level: the outgoing page sits above the incoming page and ticks
 *     from opacity 1 → 0, revealing the to-page's video beneath at
 *     full opacity the whole time. Never a 50% crossfade valley.
 *   - Slide — horizontal on route change when either side is non-video,
 *     or vertical on Home's scroll-snap y-stack (scroll-driven).
 *
 * The rule: video only ever fades into other video. If either side of
 * a transition is non-video, it's a slide. The one scroll-snap
 * exception (V2 ↔ V3 on Home) slides vertically because both cells
 * live in the same Home y-stack and translate with scrollProgress.
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
 * Mounted once in AppShell and never unmounts. Opts out of the root
 * View-Transition snapshot so its internal motion runs live while the
 * snapshot foreground slides on route change.
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

const ROUTE_SLIDE_MS = 450; // matches the .45s CSS keyframes in index.css
const ROUTE_FADE_MS = 600;  // matches BackdropCell's default fadeDuration

/**
 * Is `page` currently showing video, given the engine's current state?
 * Home is video iff its current scroll-parked cell is a video cell.
 * Blog pages are video iff a blogTopUrl is published.
 */
function pageIsCurrentlyVideo(page, state) {
  if (page === PAGE_NEOFLIX || page === PAGE_PUBLICATIONS) {
    return state.blogTopUrl !== null && state.blogTopUrl !== undefined;
  }
  if (page === PAGE_HOME) {
    const idx = Math.round(state.homeScrollProgress);
    const safe = Math.max(0, Math.min(HOME_CELLS.length - 1, idx));
    return HOME_CELLS[safe]?.kind === 'video';
  }
  return false;
}

/**
 * For the DESTINATION page of a route transition, state.homeScrollProgress
 * is stale if we're returning to Home (home unmounted while we were
 * elsewhere, so it still holds the last value from the previous visit).
 * Home always remounts at the top (Intro, camo), so the incoming Home
 * is non-video by definition. Blog pages keep blogTopUrl across mounts.
 */
function toPageIsVideo(page, state) {
  if (page === PAGE_HOME) return false;
  return pageIsCurrentlyVideo(page, state);
}

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
  const scrollContainerRef = useRef(null);

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
 */
function BackdropRenderer({ state }) {
  const location = useLocation();
  const currentPage = pageIdForPath(location.pathname);

  // Route transition tracking. When pathname changes, we pick one of
  // two kinds based on whether each side is currently showing video:
  //   - 'fade'  — video ↔ video. Page-level deck-fade (outgoing sits
  //               above incoming at opacity 1→0, no horizontal motion).
  //   - 'slide' — any other pair. Horizontal slide, direction from
  //               navbar-index delta.
  // rAF-driven progress (0..1) so we never CSS-transition out of sync
  // with the content-side slide animation.
  const [transition, setTransition] = useState(null);
  // transition: { kind, fromPage, toPage, direction?, progress }
  const prevPathRef = useRef(location.pathname);
  const rafRef = useRef(null);
  const startRef = useRef(0);
  // Ref mirror of `state` so the pathname effect reads fresh values
  // without re-running every scroll tick.
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const nextPath = location.pathname;
    if (prevPath === nextPath) return undefined;

    const fromPage = pageIdForPath(prevPath);
    const toPage = pageIdForPath(nextPath);
    prevPathRef.current = nextPath;
    if (fromPage === toPage) return undefined;

    const snapshot = stateRef.current;
    const fromIsVideo = pageIsCurrentlyVideo(fromPage, snapshot);
    const toIsVideo = toPageIsVideo(toPage, snapshot);

    const isFade = fromIsVideo && toIsVideo;
    const duration = isFade ? ROUTE_FADE_MS : ROUTE_SLIDE_MS;

    let initial;
    if (isFade) {
      initial = { kind: 'fade', fromPage, toPage, progress: 0 };
    } else {
      const fromIdx = getNavIndexForPath(prevPath);
      const toIdx = getNavIndexForPath(nextPath);
      const direction = toIdx - fromIdx >= 0 ? 'right' : 'left';
      initial = { kind: 'slide', fromPage, toPage, direction, progress: 0 };
    }

    startRef.current = performance.now();
    setTransition(initial);

    const tick = (now) => {
      const t = (now - startRef.current) / duration;
      if (t >= 1) {
        setTransition(null);
        rafRef.current = null;
        return;
      }
      setTransition((prev) => (prev ? { ...prev, progress: t } : prev));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [location.pathname]);

  // Which pages are currently on screen. During a transition, both
  // fromPage and toPage render together; otherwise just current.
  const visiblePages = useMemo(() => {
    if (transition) return [transition.fromPage, transition.toPage];
    return [currentPage];
  }, [transition, currentPage]);

  const getPageStyle = (page) => {
    if (!transition) {
      return { transform: 'translateX(0%)', opacity: 1, zIndex: 0 };
    }
    if (transition.kind === 'fade') {
      // Page-level deck-fade staircase: from-page sits above at opacity
      // 1 → 0, revealing to-page (already opaque from mount) beneath.
      // Never a 50% valley because the layer below is never partial.
      const { fromPage, toPage, progress } = transition;
      if (page === fromPage) {
        return {
          transform: 'translateX(0%)',
          opacity: 1 - progress,
          zIndex: 1,
        };
      }
      if (page === toPage) {
        return { transform: 'translateX(0%)', opacity: 1, zIndex: 0 };
      }
      return { transform: 'translateX(0%)', opacity: 1, zIndex: 0 };
    }
    // kind === 'slide'
    const { fromPage, toPage, direction, progress } = transition;
    const outTo = direction === 'right' ? -100 : 100;
    const inFrom = direction === 'right' ? 100 : -100;
    if (page === fromPage) {
      return {
        transform: `translateX(${outTo * progress}%)`,
        opacity: 1,
        zIndex: 0,
      };
    }
    if (page === toPage) {
      return {
        transform: `translateX(${inFrom * (1 - progress)}%)`,
        opacity: 1,
        zIndex: 0,
      };
    }
    return { transform: 'translateX(0%)', opacity: 1, zIndex: 0 };
  };

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{
        zIndex: 0,
        backgroundColor: '#1c3424',
        // Opt the backdrop out of the root View-Transition snapshot so
        // its internal motion keeps running live while the snapshot
        // foreground slides on route change.
        viewTransitionName: 'none',
      }}
      aria-hidden="true"
    >
      {visiblePages.map((page) => {
        const style = getPageStyle(page);
        return (
          <div
            key={page}
            className="absolute inset-0"
            style={{
              ...style,
              // rAF-driven progress; no CSS transition so we can't drift
              // out of sync with the content-side transition.
              willChange: transition ? 'transform, opacity' : 'auto',
            }}
          >
            <PageBackdrop
              page={page}
              state={state}
              isActivePage={!transition && page === currentPage}
              isTransitioning={!!transition}
            />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Compose the backdrop for one page identity.
 *
 * Decode allowance:
 *   - Parked on a page (!isTransitioning && isActivePage): that page's
 *     current cell plays its 2-video rule-2 budget.
 *   - During a route slide (isTransitioning): both the from-page and
 *     to-page pass through here, and we let them decode so the slide
 *     doesn't land on frozen first frames. Non-video pages render
 *     zero videos; video pages render one cell; so the worst pairing
 *     (video↔non-video) still decodes ≤2 videos.
 */
function PageBackdrop({ page, state, isActivePage, isTransitioning }) {
  const canDecode = isActivePage || isTransitioning;
  if (page === PAGE_HOME) {
    return <HomeBackdrop state={state} canDecode={canDecode} />;
  }
  if (page === PAGE_NEOFLIX || page === PAGE_PUBLICATIONS) {
    return <BlogBackdrop state={state} canDecode={canDecode} />;
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
