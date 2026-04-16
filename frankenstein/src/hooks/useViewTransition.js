import { useLocation, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { getNavIndexForPath } from './useNavIndex';

/**
 * Route navigation wrapped in the View Transition API.
 *
 * Why this exists: Framer Motion on the foreground + per-component
 * fade-ins inside each page (IntroSlide, medical sections, etc.)
 * meant that during a route transition internal opacity animations
 * fired at the same time as the slide — reading as "fades out
 * instead of slides out".
 *
 * View Transitions solve this by snapshotting the DOM at transition
 * start and animating the snapshots. Internal state changes still
 * happen (IntersectionObserver, inView, etc.) but they're invisible
 * because the live DOM is hidden behind the frozen snapshot until
 * the transition ends. Slide is pure translate, no fade, matches the
 * design spec.
 *
 * Direction: we write the navbar-index delta to
 * `html[data-nav-direction]` right before starting the transition so
 * CSS can pick the right slide keyframes.
 *
 * Falls back to a plain navigate when startViewTransition isn't
 * available.
 */
// Module-scoped owner of `html[data-nav-direction]`. A brand-new Symbol is
// minted for each `transitionNavigate` call; the cleanup only wipes the
// attribute if the current owner still matches. Prevents an interrupted
// transition's cleanup from wiping a freshly-set direction on the next one.
let currentDirectionOwner = null;

// Routes that render BlogPage's two-column sticky-sidebar + scrolling-
// article layout. When the NEXT route is one of these, we set
// html[data-next-has-sidebar="true"] so the CSS can stagger the sidebar
// vs article arrival (see the blog-sidebar rules in index.css). Toolbox
// and home don't render a sidebar and keep their unified slide timing.
const BLOG_TARGETS = new Set(['/neoflix', '/publications', '/contact']);

export default function useViewTransition() {
  const navigate = useNavigate();
  // React Router's useLocation() returns the pathname with the Router's
  // basename already stripped. Must not use window.location.pathname —
  // the production build is deployed under /frankenstein/ (see build.sh),
  // so window.location.pathname looks like `/frankenstein/neoflix` and
  // never matches NAV_ORDER entries (`/neoflix`, `/publications`, ...).
  // That falls through to the 0 fallback in getNavIndexForPath, which
  // made fromIndex permanently 0 and every delta non-negative —
  // data-nav-direction was always 'right' (or 'none' when returning to
  // home), so the left-direction CSS rules had no way to ever match.
  const location = useLocation();

  return (to, opts) => {
    const targetPath = typeof to === 'string' ? to.split('#')[0] || '/' : to?.pathname || '/';
    const currentPath = location.pathname || '/';

    // Same-page nav (e.g. /neoflix#collab clicked from /neoflix): just
    // navigate, no transition. Otherwise callers that aren't the
    // Navbar (Footer, markdown internal links) would flash a snapshot
    // for zero visible payoff.
    if (targetPath === currentPath) {
      navigate(to, opts);
      return;
    }

    const fromIndex = getNavIndexForPath(currentPath);
    const toIndex = getNavIndexForPath(targetPath);
    const direction = toIndex - fromIndex;

    const root = typeof document !== 'undefined' ? document.documentElement : null;
    // Each invocation gets its own token. Cleanup only clears the attribute
    // if this invocation is still the one that owns it — critical for rapid
    // clicks: when a second navigation starts before the first finishes, the
    // first's `.finished` rejects and its cleanup would otherwise wipe the
    // direction the second one just set, leaving the second transition with
    // no direction → baseline `animation: none` → no visible slide. That
    // would manifest as "only the first direction ever animates".
    const token = Symbol('nav-direction');
    const nextHasSidebar = BLOG_TARGETS.has(targetPath);
    if (root) {
      if (direction > 0) root.dataset.navDirection = 'right';
      else if (direction < 0) root.dataset.navDirection = 'left';
      else root.dataset.navDirection = 'none';
      if (nextHasSidebar) root.dataset.nextHasSidebar = 'true';
      else delete root.dataset.nextHasSidebar;
      // Reset vt-sidebar-named on every nav start. A rapid second click
      // could otherwise inherit the class from a still-running first
      // transition and have its OLD capture pull the sidebar into its
      // own group — breaking the conjoined slide-out. The class gets
      // re-added inside the transition callback (after OLD is captured)
      // only when the destination has a sidebar.
      root.classList.remove('vt-sidebar-named');
      currentDirectionOwner = token;
    }

    if (!document.startViewTransition) {
      navigate(to, opts);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        navigate(to, opts);
      });
      // Pull the blog sidebar into its own view-transition group for the
      // NEW capture only. OLD was captured before this callback ran, so
      // on the OLD page the sidebar is still part of the `content`
      // group — slide-out stays conjoined with the rest of the page
      // (that's what the user asked for: "the transition out needs to
      // be 'normal' conjoined, otherwise the stage doesn't clear out
      // fast enough"). The NEW capture runs after this callback, with
      // the class applied, so the destination sidebar is its own group
      // and can slide in staggered against the article column.
      if (root && nextHasSidebar) {
        root.classList.add('vt-sidebar-named');
      }
    });

    // Clear the direction attribute once the transition finishes, so
    // a later `startViewTransition` triggered by code that doesn't
    // route through this hook can't inherit a stale direction.
    // `.finished` rejects if the transition is skipped/aborted — clear
    // in both cases (don't surface the rejection), but only if we still
    // own the attribute (see token comment above).
    if (transition && transition.finished) {
      const clear = () => {
        if (root && currentDirectionOwner === token) {
          root.removeAttribute('data-nav-direction');
          root.removeAttribute('data-next-has-sidebar');
          root.classList.remove('vt-sidebar-named');
          currentDirectionOwner = null;
        }
      };
      transition.finished.then(clear, clear);
    }
  };
}
