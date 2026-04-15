import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import useNavIndex from '../hooks/useNavIndex';

/**
 * Direction-aware horizontal page transition.
 *
 * Uses the navbar slot position (see useNavIndex) as a 1-D axis. Moving
 * to a slot further right slides the current page out to the left and
 * the next one in from the right; moving left does the mirror.
 *
 * Keyed by nav slot index rather than pathname so that Neoflix (slot 1)
 * and Contact (slot 3) — which both render NeoflixPage — still transition
 * like separate pages. The target page re-mounts at its correct scroll
 * target, so visually it reads as two distinct horizontal positions even
 * though the underlying route handler is the same.
 *
 * mode="wait" keeps the layout simple: one page exists at a time, so we
 * don't have to juggle overlapping position:absolute wrappers or scroll
 * containers. Trade-off is a brief empty moment at the centre of the
 * slide, which is fine for the short duration we use.
 */
export default function RouteTransition({ children }) {
  const location = useLocation();
  const navIndex = useNavIndex();
  const prevIndexRef = useRef(navIndex);
  const direction = navIndex - prevIndexRef.current;
  // Update after computing direction so the next transition gets the
  // right delta.
  prevIndexRef.current = navIndex;

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={navIndex}
        custom={direction}
        variants={slideVariants}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        // Pure translateX (no opacity fade) so we don't compete with
        // the shared backdrop's own crossfade. Explicit position +
        // z-index so the foreground sits ABOVE the fixed-position
        // SharedVideoBackdrop (z:0), which otherwise would paint over
        // the content because fixed elements with z-index participate
        // in the root stacking context.
        style={{ willChange: 'transform', position: 'relative', zIndex: 1 }}
      >
        {/* Explicit location so React Router doesn't mid-transition
            re-render the exiting tree with the new pathname. */}
        {typeof children === 'function' ? children(location) : children}
      </motion.div>
    </AnimatePresence>
  );
}

// direction > 0 → user went right → new page enters from the right,
// current page exits to the left.
// direction < 0 → mirror.
// direction === 0 → no translation (e.g. clicking the same slot).
// No opacity on any state: the slide has to be entirely spatial so it
// doesn't compete with the backdrop's separate crossfade.
const slideVariants = {
  enter: (direction) => ({
    x: direction === 0 ? 0 : direction > 0 ? '100%' : '-100%',
  }),
  center: {
    x: 0,
  },
  exit: (direction) => ({
    x: direction === 0 ? 0 : direction > 0 ? '-100%' : '100%',
  }),
};
