import React from 'react';
import { useLocation } from 'react-router-dom';

/**
 * The browser's View Transitions API (triggered by Navbar's
 * useViewTransition hook) owns the route animation. We publish three
 * independent transition groups so each layer of the page can animate
 * on its own timeline:
 *
 *   - `navbar`   (top strip)          — animation: none (stays put)
 *   - `backdrop` (BackdropEngine div) — deck-fade staircase
 *   - `content`  (this wrapper)       — horizontal slide per direction
 *
 * Why `content` exists as its own name: the catch-all `root` group was
 * the wrong home for the sliding front layer. Two things broke the
 * direction-scoped rules when they targeted `::view-transition-*(root)`:
 *   1. Framer Motion's chunk (loaded with the WorldMap section) injects
 *      `<style id="view-transition-styles">` with rules that set
 *      `animation-name` on `::view-transition-old(root)` /
 *      `::view-transition-new(root)`. Once that style is in the DOM,
 *      it competes with our shorthand `animation` rules.
 *   2. With both `navbar` and `backdrop` pulled out, `root` became the
 *      amorphous leftover group — easy for any third-party style to
 *      accidentally contest.
 *
 * Giving the front content its own unambiguous name means
 * `html[data-nav-direction="right"]::view-transition-old(content)` has
 * exactly one target and nothing is trying to write to it. Slides are
 * driven by index.css keyframes keyed to `html[data-nav-direction]`
 * (set by useViewTransition before `startViewTransition`).
 *
 * Component takes the same `children(location)` signature App.jsx was
 * already using; it just wraps the rendered Routes in a div that
 * carries the view-transition-name.
 */
export default function RouteTransition({ children }) {
  const location = useLocation();
  const rendered = typeof children === 'function' ? children(location) : children;
  return (
    <div style={{ viewTransitionName: 'content' }}>
      {rendered}
    </div>
  );
}
