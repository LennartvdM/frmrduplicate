import { useNavigate } from 'react-router-dom';
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
export default function useViewTransition() {
  const navigate = useNavigate();

  return (to, opts) => {
    const targetPath = typeof to === 'string' ? to.split('#')[0] || '/' : to?.pathname || '/';
    const currentPath =
      typeof window !== 'undefined' ? window.location.pathname : '/';

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
    if (root) {
      if (direction > 0) root.dataset.navDirection = 'right';
      else if (direction < 0) root.dataset.navDirection = 'left';
      else root.dataset.navDirection = 'none';
    }

    if (!document.startViewTransition) {
      navigate(to, opts);
      return;
    }

    const transition = document.startViewTransition(() => {
      flushSync(() => {
        navigate(to, opts);
      });
    });

    // Clear the direction attribute once the transition finishes, so
    // a later `startViewTransition` triggered by code that doesn't
    // route through this hook can't inherit a stale direction.
    // `.finished` rejects if the transition is skipped/aborted — clear
    // in both cases (don't surface the rejection).
    if (transition && transition.finished) {
      const clear = () => {
        if (root) root.removeAttribute('data-nav-direction');
      };
      transition.finished.then(clear, clear);
    }
  };
}
