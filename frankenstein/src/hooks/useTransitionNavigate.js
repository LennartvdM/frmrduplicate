import { useLocation, useNavigate } from 'react-router-dom';
import { getNavIndexForPath } from './useNavIndex';
import { useTransitionState } from '../contexts/TransitionContext';

/**
 * Direction-aware route navigator.
 *
 * Replaces the old useViewTransition hook. Same signature — callers get
 * a function `(to, opts) => void` they invoke from link onClick handlers.
 *
 * Difference from the predecessor: this hook does NOT trigger the View
 * Transitions API. It only publishes the slide `direction` (via
 * TransitionContext) then calls `navigate`. RouteSlider handles the
 * actual animation via Framer Motion AnimatePresence — a scoped,
 * subtree-local effect that leaves the navbar and backdrop free to
 * re-render live.
 *
 * Same-slot / same-path navigations short-circuit to a plain navigate
 * with direction 0, so intra-toolbox and hash-only clicks stay snappy.
 */
export default function useTransitionNavigate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setDirection } = useTransitionState();

  return (to, opts) => {
    const targetPath =
      typeof to === 'string' ? to.split('#')[0] || '/' : to?.pathname || '/';
    const currentPath = location.pathname || '/';

    if (targetPath === currentPath) {
      navigate(to, opts);
      return;
    }

    const fromIndex = getNavIndexForPath(currentPath);
    const toIndex = getNavIndexForPath(targetPath);
    const direction = toIndex - fromIndex;

    // Same navbar slot (e.g. /toolbox/a → /toolbox/b): no slide, and
    // clear any stale direction the context may still hold from the
    // last cross-slot nav so downstream consumers don't animate.
    if (direction === 0) {
      setDirection(0);
      navigate(to, opts);
      return;
    }

    setDirection(direction);
    navigate(to, opts);
  };
}
