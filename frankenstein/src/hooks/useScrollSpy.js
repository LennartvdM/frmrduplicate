import { useLayoutEffect, useState } from 'react';

/**
 * Scroll-spy hook that tracks which section is currently in view
 * @param {string[]} ids - Array of section IDs to track
 * @param {number} offset - Pixel offset from top of viewport (default: 100)
 * @param {object|null} scrollerRef - Optional ref whose .current is the
 *   scrollable container. Falls back to window when null/undefined — used
 *   by legacy consumers (SidebarLayout) that still scroll the document.
 *   Pages inside the fixed RouteTransition wrapper must pass a ref to
 *   their own internal scroll container, because `window` never scrolls
 *   in the new layout.
 * @returns {string} - ID of the currently active section
 */
export default function useScrollSpy(ids, offset = 100, scrollerRef = null) {
  const [active, setActive] = useState(ids[0]);

  useLayoutEffect(() => {
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean);
    if (!els.length) return;

    const scroller = scrollerRef?.current || window;

    let ticking = false;

    const calc = () => {
      ticking = false;
      const tops = els.map(el => el.getBoundingClientRect().top);
      let idx = 0;
      for (let i = 0; i < tops.length; i++) {
        if (tops[i] - offset <= 0) {
          idx = i;
        }
      }
      const newId = els[idx].id;
      setActive(prev => prev === newId ? prev : newId);
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(calc);
      }
    };

    scroller.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', calc);
    calc();

    return () => {
      scroller.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', calc);
    };
  }, [ids, offset, scrollerRef]);

  // Listen for programmatic nav-activate events
  useLayoutEffect(() => {
    const handler = (e) => setActive(e.detail);
    window.addEventListener('nav-activate', handler);
    return () => window.removeEventListener('nav-activate', handler);
  }, []);

  return active;
}
