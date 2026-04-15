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
 * Two motion primitives:
 *   - Deck fade (rule 0, implemented inside BackdropCell).
 *   - Slide — vertical on Home (scroll-snap y) or horizontal on route
 *     change (both sides non-video, or one video + one non-video).
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
 * Route transitions:
 *   - video↔video (neoflix↔publications↔/contact): just a blog-top
 *     change; BackdropCell deck-fades through its staircase opacity
 *     rule. No slide.
 *   - any other pair: horizontal slide of the whole page composition.
 *     Direction matches the navbar-index delta (same source the
 *     content-side View-Transitions read from data-nav-direction), so
 *     backdrop and content move together.
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

function pageIsVideo(page) {
  return page === PAGE_NEOFLIX || page === PAGE_PUBLICATIONS;
}

// Home cell layout — must match Home.jsx's sections array order.
const HOME_CELLS = [
  { kind: 'camo',  variant: null }, // 0 Intro
  { kind: 'video', variant: 'v2' }, // 1 MedicalSectionV2
  { kind: 'video', variant: 'v3' }, // 2 MedicalSectionV3
  { kind: 'camo',  variant: null }, // 3 WorldMap
];

const ROUTE_SLIDE_MS = 450; // matches the .45s CSS keyframes in index.css

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

  // Route-slide tracking. When pathname changes, detect whether the
  // old↔new pair should slide (one side non-video) or just deck-fade
  // (both video) and run a 450ms animation on the page compositions.
  const [slide, setSlide] = useState(null);
  // slide: { fromPage, toPage, direction: 'left'|'right', progress: 0..1 }
  const prevPathRef = useRef(location.pathname);
  const slideRafRef = useRef(null);
  const slideStartRef = useRef(0);

  useEffect(() => {
    const prevPath = prevPathRef.current;
    const nextPath = location.pathname;
    if (prevPath === nextPath) return undefined;

    const fromPage = pageIdForPath(prevPath);
    const toPage = pageIdForPath(nextPath);
    prevPathRef.current = nextPath;
    if (fromPage === toPage) return undefined;

    // Both sides video → no slide, deck-fade only. BackdropCell
    // handles that naturally when blogTopUrl changes underneath.
    if (pageIsVideo(fromPage) && pageIsVideo(toPage)) return undefined;

    const fromIdx = getNavIndexForPath(prevPath);
    const toIdx = getNavIndexForPath(nextPath);
    const direction = toIdx - fromIdx >= 0 ? 'right' : 'left';

    slideStartRef.current = performance.now();
    setSlide({ fromPage, toPage, direction, progress: 0 });

    const tick = (now) => {
      const t = (now - slideStartRef.current) / ROUTE_SLIDE_MS;
      if (t >= 1) {
        setSlide(null);
        slideRafRef.current = null;
        return;
      }
      setSlide((prev) => (prev ? { ...prev, progress: t } : prev));
      slideRafRef.current = requestAnimationFrame(tick);
    };
    slideRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (slideRafRef.current) {
        cancelAnimationFrame(slideRafRef.current);
        slideRafRef.current = null;
      }
    };
  }, [location.pathname]);

  // Which pages are currently on screen. During a route slide, both
  // fromPage and toPage render side-by-side; otherwise just current.
  const visiblePages = useMemo(() => {
    if (slide) return [slide.fromPage, slide.toPage];
    return [currentPage];
  }, [slide, currentPage]);

  const getPageTransform = (page) => {
    if (!slide) return 'translateX(0%)';
    const { fromPage, toPage, direction, progress } = slide;
    // Moving right: outgoing → -100%, incoming starts at +100%.
    // Moving left:  outgoing → +100%, incoming starts at -100%.
    const outTo = direction === 'right' ? -100 : 100;
    const inFrom = direction === 'right' ? 100 : -100;
    if (page === fromPage) return `translateX(${outTo * progress}%)`;
    if (page === toPage) return `translateX(${inFrom * (1 - progress)}%)`;
    return 'translateX(0%)';
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
      {visiblePages.map((page) => (
        <div
          key={page}
          className="absolute inset-0"
          style={{
            transform: getPageTransform(page),
            // rAF-driven progress; no CSS transition so we can't drift
            // out of sync with the 450ms keyframe animation on content.
            willChange: slide ? 'transform' : 'auto',
          }}
        >
          <PageBackdrop
            page={page}
            state={state}
            isActivePage={!slide && page === currentPage}
            isTransitioning={!!slide}
          />
        </div>
      ))}
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
