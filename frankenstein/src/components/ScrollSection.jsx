import React, { useRef, useEffect, useState } from 'react';
import { useViewport } from '../hooks/useViewport';
import { useTransitionState } from '../contexts/TransitionContext';

export default function ScrollSection({ name, children, background }) {
  const ref = useRef();
  // Two inView values. `realInView` is what the IntersectionObserver
  // actually sees right now; `inView` is what we expose to children.
  // While a route slide is in flight (isSliding === true) we freeze the
  // exposed value so downstream animations — medical entrance ceremony,
  // carousel autoplay, backdrop target publishing — don't fire against
  // a page that's mid-translate. Before the refactor the View
  // Transitions API snapshotted the DOM and made this a non-issue;
  // with the live Framer Motion slide we have to gate the flag
  // explicitly.
  const [inView, setInView] = useState(false);
  const realInViewRef = useRef(false);
  const { isTablet } = useViewport();
  const { isSliding } = useTransitionState();
  const isSlidingRef = useRef(isSliding);
  const observerRef = useRef(null);

  // Keep a ref mirror of isSliding so the observer callback (closed
  // over once per effect run) always reads the latest value.
  useEffect(() => {
    isSlidingRef.current = isSliding;
  }, [isSliding]);

  // When a slide ends, flush the real observed value through to
  // children. If the section scrolled into view during the slide, its
  // ceremony fires now — on a settled page — instead of mid-translate.
  useEffect(() => {
    if (!isSliding && inView !== realInViewRef.current) {
      setInView(realInViewRef.current);
    }
  }, [isSliding, inView]);

  // Update IntersectionObserver when viewport state changes
  useEffect(() => {
    if (!ref.current) return;

    // CRITICAL: Don't recreate observer during rotation - causes layout thrashing
    // Defer observer updates until rotation completes
    if (document.documentElement.classList.contains('is-resizing')) {
      // Wait for rotation to complete, then recreate observer
      const checkRotationComplete = setInterval(() => {
        if (!document.documentElement.classList.contains('is-resizing')) {
          clearInterval(checkRotationComplete);
          // Trigger re-run of this effect after rotation completes
          // (This is a bit hacky but prevents observer churn during rotation)
        }
      }, 100);
      return () => clearInterval(checkRotationComplete);
    }

    // Disconnect existing observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer with current viewport settings
    observerRef.current = new window.IntersectionObserver(
      ([entry]) => {
        // For tablets, be more lenient - trigger if any significant portion is visible
        const next = isTablet
          ? (entry.intersectionRatio > 0.3 || entry.isIntersecting)
          : entry.isIntersecting;
        realInViewRef.current = next;
        // Don't propagate during a slide — the effect above will flush
        // the real value once the slide completes.
        if (!isSlidingRef.current) {
          setInView(next);
        }
      },
      {
        threshold: isTablet ? 0.3 : 0.5,
        rootMargin: isTablet ? '-10% 0px -10% 0px' : '0px'
      }
    );

    observerRef.current.observe(ref.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isTablet]); // Recreate observer when tablet state changes

  // CRITICAL: Lock all three height properties to identical values to "defend" section dimensions
  // This prevents layout thrashing during rotation by eliminating conflicting constraints
  // During rotation, use --frozen-viewport-height (set at rotation START, doesn't change)
  // After rotation, use --app-viewport-height (updated to new post-rotation value)
  const lockedHeight = 'var(--frozen-viewport-height, var(--app-viewport-height, 100dvh))';

  return (
    <section
      ref={ref}
      id={name}
      style={{
        minHeight: lockedHeight,
        height: lockedHeight,
        maxHeight: lockedHeight,
        width: '100%',
        position: 'relative',
        backgroundColor: background || 'transparent',
        overflow: 'hidden',
        // NO scrollMarginTop - the container's scrollPaddingTop handles navbar offset
        // Having both would cause double offset
        scrollSnapAlign: 'start', // Enable scroll snapping for this section
        // Performance containment for big sections - prevents layout from affecting siblings
        contain: 'layout paint style',
        // Safe area insets for notched devices
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        paddingLeft: 'env(safe-area-inset-left, 0px)',
        paddingRight: 'env(safe-area-inset-right, 0px)',
        // Prevent any flex/growth during rotation
        flexShrink: 0,
        flexGrow: 0,
      }}
    >
      {children({ inView, ref })}
    </section>
  );
}
