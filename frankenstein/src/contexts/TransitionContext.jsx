import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * TransitionContext — shared source of truth for route slide direction
 * and "is a slide currently in flight" status.
 *
 * Why this exists: we deliberately do NOT use the View Transitions API
 * for route changes. That API is document-scoped — it snapshots every
 * on-screen element, including the navbar — which caused dead-click
 * windows and navbar-vanish bugs no amount of pseudo-element tuning
 * could fix. Instead the route slide is a scoped Framer Motion
 * animation on a single wrapper, and the rest of the chrome (navbar,
 * backdrop) stays live.
 *
 * Consumers:
 *   - useTransitionNavigate    writes `direction` before navigating.
 *   - RouteSlider               reads `direction`, drives AnimatePresence,
 *                               flips `isSliding` on/off.
 *   - Page-level internal fades (optional) read `isSliding` to skip
 *                               their mount animations while the slide
 *                               is playing, so internal fade-ins don't
 *                               fire against the outgoing slide.
 */
const TransitionContext = createContext({
  direction: 0,
  isSliding: false,
  setDirection: () => {},
  setIsSliding: () => {},
});

export function TransitionProvider({ children }) {
  // `direction` is the navbar-index delta of the pending nav:
  //   +1/+2/... → user moving right in the navbar (new page enters from right)
  //   −1/−2/... → user moving left
  //    0        → same slot (no slide; handled as plain navigate)
  const [direction, setDirection] = useState(0);
  const [isSliding, setIsSlidingState] = useState(false);

  // Mirror into a ref so consumers that need to read the latest value
  // inside callbacks don't have to thread it through deps.
  const slidingRef = useRef(false);
  const setIsSliding = useCallback((next) => {
    slidingRef.current = next;
    setIsSlidingState(next);
  }, []);

  const value = useMemo(
    () => ({ direction, isSliding, setDirection, setIsSliding }),
    [direction, isSliding, setIsSliding]
  );

  return (
    <TransitionContext.Provider value={value}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransitionState() {
  return useContext(TransitionContext);
}

export default TransitionContext;
