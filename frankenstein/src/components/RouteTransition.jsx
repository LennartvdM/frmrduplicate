import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Previously this wrapped <Routes> in a Framer Motion AnimatePresence
 * that drove a horizontal slide. That fought with every page's
 * internal fade-in animations (IntroSlide's own mount animation, the
 * medical sections' visibility-based fades, etc.) — during a slide,
 * internal state changes kept firing opacity animations against the
 * live DOM, producing "fades out instead of slides out".
 *
 * The browser's View Transitions API (triggered by Navbar's
 * useViewTransition hook) now owns the animation. The browser
 * snapshots the whole viewport root, slides the snapshot horizontally
 * via CSS keyframes (direction from html[data-nav-direction]) while
 * the live DOM is hidden. Internal animations still fire, but they
 * fire against the hidden DOM — the user only sees the frozen
 * snapshot sliding. Top layers slide; nothing fades.
 *
 * SharedVideoBackdrop opts out of the root snapshot via
 * viewTransitionName: 'none' so its deck-of-cards crossfade keeps
 * running live behind the sliding snapshot.
 *
 * Component kept as a thin passthrough so the existing Route → page
 * render tree (with the `children(location)` signature used by
 * App.jsx) doesn't change.
 */
export default function RouteTransition({ children }) {
  const location = useLocation();
  return typeof children === 'function' ? children(location) : children;
}
