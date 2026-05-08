import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DocsLink from './DocsLink';

/**
 * Vragenlijst-style sidebar: a glassy "highlighter" pill slides behind
 * the active nav row with smooth top/height transitions, mirroring the
 * questionnaire's `.mobile-highlighter` treatment.
 *
 * Layout (two-container split):
 *   .docs-sidebar          sticky, overflow: visible — hosts the
 *                           highlighter so its left outcrop can bleed
 *                           past the card's edge into the video gutter.
 *   .docs-sidebar-scroll   overflow-y: auto — the actual scrollable
 *                           viewport that holds the nav sections.
 *
 * The highlighter is a sibling of the scroll container. Its position is
 * measured in viewport coords (getBoundingClientRect) relative to the
 * outer sidebar, which naturally absorbs both inner scroll and outer
 * page scroll without dedicated math.
 */
/**
 * Level 2 has three flat phase markers (RECORD, REFLECT, REFINE) sitting
 * inline among the numbered modules. The data has them as siblings, not
 * parents — but visually they're meant to gate the items that follow,
 * matching how "3. Safe, Simple & Small" foldout-groups its sub-pages.
 *
 * Walk the items in order: each phase marker absorbs subsequent
 * non-marker siblings as its children, until the next marker or the
 * end of the list. Items appearing before any marker are passed through
 * untouched. Markers' own pre-existing `children` (currently always
 * empty for record/reflect/refine, but kept for safety) are preserved.
 */
const PHASE_MARKER_RE = /\/(record|reflect|refine)$/i;

function regroupPhaseMarkers(items) {
  const out = [];
  let bucket = null;
  for (const item of items) {
    if (PHASE_MARKER_RE.test(item.slug || '')) {
      bucket = { ...item, children: [...(item.children || [])] };
      out.push(bucket);
    } else if (bucket) {
      bucket.children.push(item);
    } else {
      out.push(item);
    }
  }
  return out;
}

// M3 emphasized easing for the open (decelerates → lands soft), and
// the gentler standard easing for the close. The close intentionally
// runs *longer* than the open: this is a hover-driven menu, and when
// the cursor wanders briefly between siblings the close shouldn't slam
// shut — a slow, soft retract gives the user time to course-correct
// instead of snapping back into a "constant cascade collapse" loop.
const EASE_DECEL = [0.05, 0.7, 0.1, 1];
const EASE_STANDARD = [0.4, 0, 0.2, 1];

const HOVER_OPEN_DELAY_MS = 60;
// Hover-close grace. Doubled to give the user a generous window to
// come back (e.g. brief drift to read something, then return). The
// outer-leave cleanup (clearing click-opened foldouts that aren't on
// the active path) is gated on the same window.
const HOVER_CLOSE_DELAY_MS = 700;
// The intent gate. A `mouseenter` is treated as user intent only if a
// real `mousemove` was seen within this window. A stationary cursor
// receiving `mouseenter` purely because the row drifted into it —
// during an open/close transition — gets rejected.
const FRESH_MOVE_MS = 100;

const subListVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.38, ease: EASE_DECEL },
      opacity: { duration: 0.28, ease: EASE_DECEL },
      staggerChildren: 0.045,
      delayChildren: 0.05,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      // Both the separation beat (delay) and the actual collapse have
      // been doubled. Items continue to lift + fade during the delay
      // so the foldout visibly disconnects from the focused tab below
      // before the container itself rolls up.
      height: { duration: 1.1, ease: EASE_STANDARD, delay: 0.24 },
      opacity: { duration: 0.9, ease: EASE_STANDARD },
      staggerChildren: 0.13,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.36, ease: EASE_DECEL },
  },
  closed: {
    opacity: 0,
    y: -36,
    transition: { duration: 1.0, ease: EASE_STANDARD },
  },
};

// Reduced-motion variants: skip the y-offset and stagger; leave a tiny
// fade so the appear/disappear is still legible without motion.
const subListVariantsReduced = {
  open: { height: 'auto', opacity: 1, transition: { duration: 0.12 } },
  closed: { height: 0, opacity: 0, transition: { duration: 0.1 } },
};
const itemVariantsReduced = {
  open: { opacity: 1, y: 0, transition: { duration: 0.1 } },
  closed: { opacity: 1, y: 0, transition: { duration: 0 } },
};

export default function DocsSidebar({ sections, activeSlug }) {
  const reducedMotion = useReducedMotion();

  // Foldouts that lie on the active page's path are auto-open. Computed
  // fresh from activeSlug + sections — no state to keep in sync.
  const autoOpen = useMemo(() => {
    const set = new Set();
    for (const section of sections) {
      collectAncestors(regroupPhaseMarkers(section.items), activeSlug, set);
    }
    return set;
  }, [sections, activeSlug]);

  // userToggle lets a user explicitly override autoOpen — true forces
  // open, false forces closed. Without this, clicking a foldout's own
  // row to close it would race the auto-open recompute (the row's slug
  // becomes the new active slug, autoOpen re-adds it). Storing the
  // explicit choice means the close sticks.
  const [userToggle, setUserToggle] = useState(() => new Map());

  // Hover state lives separately from the click-toggled state so a click-
  // to-close collapses a foldout even while the cursor still rests on
  // its row, and so leaving a hovered foldout doesn't collapse one the
  // user explicitly clicked open.
  const [hovered, setHovered] = useState(() => new Set());
  const hoverTimers = useRef(new Map());

  const isOpen = useCallback((slug) => {
    if (userToggle.has(slug)) return userToggle.get(slug);
    return autoOpen.has(slug) || hovered.has(slug);
  }, [userToggle, autoOpen, hovered]);

  // ── Layout-shift loop fix ───────────────────────────────────────────
  // mouseenter fires whenever an element's box crosses the cursor — and
  // that happens both when the cursor moves AND when the element moves
  // around a stationary cursor. Opening one foldout slides every sibling
  // below it through the cursor's static position, firing fresh enters
  // on rows the user never aimed at. Without a guard, those phantom
  // enters cascade.
  //
  // Two refs collaborate to filter them out:
  //
  //   animationCountRef — incremented on each foldout's animation start
  //     and decremented on complete. While > 0, the sidebar is layout-
  //     shifting. We treat enters during this window as suspect.
  //
  //   lastMoveAtRef — stamped on every `mousemove` over the sidebar.
  //     A genuine hover always has a recent stamp. A layout-shift-
  //     induced enter does not (the cursor never moved).
  //
  // The rule: reject an enter only when BOTH (a) a transition is in
  // flight AND (b) the cursor hasn't moved within FRESH_MOVE_MS. Either
  // condition alone is fine — animations without movement still allow
  // user-driven hover, and movement during animation still allows
  // intentional traversal.
  const animationCountRef = useRef(0);
  const lastMoveAtRef = useRef(0);

  // ── Curtain-rail anchor ─────────────────────────────────────────────
  // While transitions are in flight, the deepest currently-hovered
  // foldout's row is "the ring on the rail" — it should stay pinned at
  // its viewport position while siblings expand/contract around it.
  // The technique is straightforward: read the anchor row's top each
  // frame, see how much it's drifted, and add the drift to the
  // sidebar scroll so the row visually stays put.
  //
  // hoveredRef mirrors the state so the rAF closure can read the
  // latest set without re-instantiating per render.
  const hoveredRef = useRef(hovered);
  useEffect(() => { hoveredRef.current = hovered; }, [hovered]);

  const anchorRowRef = useRef(null);
  const anchorTargetTopRef = useRef(null);
  const anchorRafIdRef = useRef(0);

  const resolveAnchorDOM = useCallback(() => {
    const hov = hoveredRef.current;
    if (!hov || hov.size === 0) return null;
    // Deepest = longest slug — gives nested foldouts priority over
    // their parents when both are technically "hovered".
    let deepest = null;
    let maxLen = -1;
    for (const slug of hov) {
      const len = (slug || '').length;
      if (len > maxLen) { maxLen = len; deepest = slug; }
    }
    if (!deepest) return null;
    const safe = (typeof CSS !== 'undefined' && CSS.escape)
      ? CSS.escape(deepest)
      : deepest.replace(/"/g, '\\"');
    return scrollRef.current?.querySelector(`[data-slug="${safe}"]`) || null;
  }, []);

  const captureAnchor = useCallback(() => {
    const anchor = anchorRowRef.current;
    const scroller = scrollRef.current;
    if (!anchor || !scroller) {
      anchorTargetTopRef.current = null;
      return;
    }
    const scrollerRect = scroller.getBoundingClientRect();
    const anchorRect = anchor.getBoundingClientRect();
    anchorTargetTopRef.current = anchorRect.top - scrollerRect.top;
  }, []);

  const tickAnchor = useCallback(() => {
    if (animationCountRef.current === 0) {
      anchorRafIdRef.current = 0;
      return;
    }
    // Re-resolve each frame so a hover swap mid-animation lands cleanly.
    const fresh = resolveAnchorDOM();
    if (fresh && fresh !== anchorRowRef.current) {
      anchorRowRef.current = fresh;
      captureAnchor();
    }
    const anchor = anchorRowRef.current;
    const scroller = scrollRef.current;
    const target = anchorTargetTopRef.current;
    if (anchor && scroller && target !== null) {
      const scrollerRect = scroller.getBoundingClientRect();
      const anchorRect = anchor.getBoundingClientRect();
      const current = anchorRect.top - scrollerRect.top;
      const drift = current - target;
      if (Math.abs(drift) > 0.5) {
        scroller.scrollTop += drift;
      }
    }
    anchorRafIdRef.current = requestAnimationFrame(tickAnchor);
  }, [resolveAnchorDOM, captureAnchor]);

  const startAnchorRaf = useCallback(() => {
    if (anchorRafIdRef.current) return;
    anchorRowRef.current = resolveAnchorDOM();
    captureAnchor();
    if (anchorTargetTopRef.current === null) return; // no anchor → no-op
    anchorRafIdRef.current = requestAnimationFrame(tickAnchor);
  }, [resolveAnchorDOM, captureAnchor, tickAnchor]);

  // ── Cleanup phase ───────────────────────────────────────────────────
  // The anchor compensation can leave scrollTop in an unusual place by
  // the time a session ends — sometimes pushed past the natural top of
  // the sidebar so the upper section labels are scrolled out of view.
  // When the cursor leaves the entire sidebar, gently animate scrollTop
  // back to wherever the user "started" the session. Manual scrolls
  // during a quiet moment (no transitions, no hovered foldouts) update
  // the home target so we don't yank the user back from a position they
  // deliberately scrolled to.
  const sessionHomeRef = useRef(null);
  const restoreTimerRef = useRef(null);
  const restoreRafIdRef = useRef(0);
  const restoringRef = useRef(false);

  const restoreScrollHome = useCallback(() => {
    const scroller = scrollRef.current;
    const target = sessionHomeRef.current;
    if (!scroller || target == null) return;
    const start = scroller.scrollTop;
    if (Math.abs(start - target) < 1) return;

    // Match the close animation's tone: 550ms with a soft-out curve.
    const duration = 550;
    const t0 = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

    restoringRef.current = true;
    const tick = () => {
      const elapsed = performance.now() - t0;
      const t = Math.min(1, elapsed / duration);
      const eased = easeOutCubic(t);
      const cur = start + (target - start) * eased;
      if (scrollRef.current) scrollRef.current.scrollTop = cur;
      if (t < 1) {
        restoreRafIdRef.current = requestAnimationFrame(tick);
      } else {
        restoreRafIdRef.current = 0;
        restoringRef.current = false;
      }
    };
    restoreRafIdRef.current = requestAnimationFrame(tick);
  }, []);

  // When the cursor leaves the sidebar, clear click-opened foldouts
  // that aren't part of the active page's group. The active group
  // stays open via autoOpen, so the user can keep reading the page
  // they're on while the rest of the tree settles back to a clean
  // state. Entries explicitly closed by the user (`false`) are kept
  // — those represent a deliberate choice that shouldn't be undone
  // by a cursor exit.
  const cleanupUserToggle = useCallback(() => {
    setUserToggle((prev) => {
      if (prev.size === 0) return prev;
      const activePath = new Set();
      for (const section of sections) {
        collectAncestors(regroupPhaseMarkers(section.items), activeSlug, activePath);
      }
      let changed = false;
      const next = new Map();
      for (const [slug, val] of prev) {
        if (val === true && !activePath.has(slug)) {
          changed = true; // drop this open-override
        } else {
          next.set(slug, val);
        }
      }
      return changed ? next : prev;
    });
  }, [activeSlug, sections]);

  // Poll until everything's settled, then restore.
  const tryRestore = useCallback(() => {
    if (animationCountRef.current > 0 || hoveredRef.current.size > 0) {
      restoreTimerRef.current = setTimeout(tryRestore, 80);
      return;
    }
    restoreTimerRef.current = null;
    restoreScrollHome();
  }, [restoreScrollHome]);

  const onOuterEnter = useCallback(() => {
    // Cancel any pending or in-flight restore.
    if (restoreTimerRef.current) {
      clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }
    if (restoreRafIdRef.current) {
      cancelAnimationFrame(restoreRafIdRef.current);
      restoreRafIdRef.current = 0;
      restoringRef.current = false;
    }
    // Capture this entry's home scroll if we're starting fresh.
    if (animationCountRef.current === 0 && hoveredRef.current.size === 0) {
      sessionHomeRef.current = scrollRef.current?.scrollTop ?? 0;
    }
  }, []);

  const onOuterLeave = useCallback(() => {
    if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
    // After the close grace, sweep any click-opened foldouts that
    // aren't part of the active group, then poll for a quiet state
    // before easing the scroll back. Both run on the same timer so
    // hover-induced and click-induced closes share one grace window —
    // returning to the sidebar inside that window cancels both.
    restoreTimerRef.current = setTimeout(() => {
      cleanupUserToggle();
      tryRestore();
    }, HOVER_CLOSE_DELAY_MS + 40);
  }, [cleanupUserToggle, tryRestore]);

  // Manual user scroll while quiet → that's the new home.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const onScroll = () => {
      if (
        animationCountRef.current === 0 &&
        hoveredRef.current.size === 0 &&
        !restoringRef.current
      ) {
        sessionHomeRef.current = scroller.scrollTop;
      }
    };
    scroller.addEventListener('scroll', onScroll, { passive: true });
    return () => scroller.removeEventListener('scroll', onScroll);
  }, []);

  // Drain timers + RAFs on unmount.
  useEffect(() => () => {
    if (restoreTimerRef.current) clearTimeout(restoreTimerRef.current);
    if (restoreRafIdRef.current) cancelAnimationFrame(restoreRafIdRef.current);
  }, []);

  const stopAnchorRaf = useCallback(() => {
    if (anchorRafIdRef.current) {
      cancelAnimationFrame(anchorRafIdRef.current);
      anchorRafIdRef.current = 0;
    }
    anchorTargetTopRef.current = null;
    anchorRowRef.current = null;
  }, []);

  const onAnimStart = useCallback(() => {
    animationCountRef.current += 1;
    if (animationCountRef.current === 1) startAnchorRaf();
  }, [startAnchorRaf]);
  const onAnimComplete = useCallback(() => {
    animationCountRef.current = Math.max(0, animationCountRef.current - 1);
    if (animationCountRef.current === 0) stopAnchorRaf();
  }, [stopAnchorRaf]);

  const toggle = useCallback((slug) => {
    setUserToggle((prev) => {
      // Read current effective-open from prev + fresh autoOpen + hovered.
      // Using prev here (rather than the closure-captured userToggle) is
      // safe even when toggle fires twice in the same React batch.
      const next = new Map(prev);
      const currentlyOpen = prev.has(slug)
        ? prev.get(slug)
        : (autoOpen.has(slug) || hovered.has(slug));
      next.set(slug, !currentlyOpen);
      return next;
    });
    setHovered((prev) => {
      if (!prev.has(slug)) return prev;
      const next = new Set(prev);
      next.delete(slug);
      return next;
    });
  }, [autoOpen, hovered]);

  const onHover = useCallback((slug, isEntering) => {
    const timers = hoverTimers.current;
    const existing = timers.get(slug);
    if (existing) {
      clearTimeout(existing);
      timers.delete(slug);
    }
    if (isEntering) {
      // Intent gate (see comment near animationCountRef): drop enters
      // that happen mid-transition without a recent real cursor move.
      const stationary = performance.now() - lastMoveAtRef.current > FRESH_MOVE_MS;
      if (animationCountRef.current > 0 && stationary) return;

      const id = setTimeout(() => {
        setHovered((prev) => {
          if (prev.has(slug)) return prev;
          const next = new Set(prev);
          next.add(slug);
          return next;
        });
        timers.delete(slug);
      }, HOVER_OPEN_DELAY_MS);
      timers.set(slug, id);
    } else {
      const id = setTimeout(() => {
        setHovered((prev) => {
          if (!prev.has(slug)) return prev;
          const next = new Set(prev);
          next.delete(slug);
          return next;
        });
        timers.delete(slug);
      }, HOVER_CLOSE_DELAY_MS);
      timers.set(slug, id);
    }
  }, []);

  // Drain pending timers on unmount so we don't leak setState into a
  // stale tree if the user navigates away mid-animation.
  useEffect(() => () => {
    for (const id of hoverTimers.current.values()) clearTimeout(id);
    hoverTimers.current.clear();
  }, []);

  // When activeSlug changes, clear userToggle entries for STRICT ancestors
  // of the new active slug (i.e. ancestors not including the slug itself).
  // This keeps an explicit "closed" sticky on the foldout the user just
  // clicked (its slug is the new activeSlug — strict ancestors don't
  // include it, so the close persists), while letting an in-page link to
  // a deep child still auto-open the chain leading to it (those parents
  // get cleared from userToggle, so autoOpen takes over).
  useEffect(() => {
    setUserToggle((prev) => {
      if (prev.size === 0) return prev;
      const path = new Set();
      for (const section of sections) {
        collectAncestors(regroupPhaseMarkers(section.items), activeSlug, path);
      }
      path.delete(activeSlug); // strict ancestors only
      if (path.size === 0) return prev;
      let changed = false;
      const next = new Map(prev);
      for (const slug of path) {
        if (next.has(slug)) { next.delete(slug); changed = true; }
      }
      return changed ? next : prev;
    });
  }, [activeSlug, sections]);

  const sidebarRef = useRef(null);
  const scrollRef = useRef(null);
  const highlighterRef = useRef(null);
  const hasPositioned = useRef(false);

  const updateHighlighter = useCallback((animate = true) => {
    const sidebar = sidebarRef.current;
    const scroller = scrollRef.current;
    const highlighter = highlighterRef.current;
    if (!sidebar || !scroller || !highlighter) return;

    const activeRow = scroller.querySelector('.docs-nav-row.is-active');
    if (!activeRow) {
      highlighter.classList.remove('is-visible');
      return;
    }

    // Viewport-relative measurement naturally accounts for both inner
    // (.docs-sidebar-scroll) scroll and outer (.docs-scroll) page scroll
    // — the pill ends up exactly under the active row on screen.
    const sidebarRect = sidebar.getBoundingClientRect();
    const rowRect = activeRow.getBoundingClientRect();
    const top = rowRect.top - sidebarRect.top;
    const height = rowRect.height;

    if (!animate || !hasPositioned.current) {
      // First paint / post-scroll updates: land without a transition so
      // the pill doesn't lag the scroll (which would read as a drift).
      highlighter.style.transition = 'none';
      highlighter.style.top = `${top}px`;
      highlighter.style.height = `${height}px`;
      void highlighter.offsetHeight; // flush so the next frame can animate
      highlighter.style.transition = '';
      hasPositioned.current = true;
    } else {
      highlighter.style.top = `${top}px`;
      highlighter.style.height = `${height}px`;
    }
    highlighter.classList.add('is-visible');
  }, []);

  // Smooth glide when the active row itself changes (page nav).
  useLayoutEffect(() => {
    updateHighlighter(true);
  }, [activeSlug, updateHighlighter]);

  // Foldouts opening/closing don't change which row is active, but they
  // shift the active row's on-screen position as the list expands or
  // collapses around it. Sample-and-snap on rAF for the duration of the
  // foldout animation so the pill rides the row instead of waiting for
  // its own CSS transition (which would lag and drift).
  useEffect(() => {
    let rafId;
    const start = performance.now();
    const tick = () => {
      updateHighlighter(false);
      // Cover the doubled close window: ~240 ms separation beat +
      // ~1100 ms container collapse + the staggered items finishing
      // (1000 ms each at 130 ms reverse stagger).
      if (performance.now() - start < 1900) {
        rafId = requestAnimationFrame(tick);
      }
    };
    rafId = requestAnimationFrame(tick);
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [userToggle, autoOpen, hovered, updateHighlighter]);

  // Non-animated updates when either scroll container moves. The inner
  // scroll is the sidebar's own nav scroll; the outer is the page scroll
  // that drags the sticky sidebar along — both shift the active row's
  // viewport position and need the pill to follow without drift.
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const onScroll = () => updateHighlighter(false);
    scroller.addEventListener('scroll', onScroll, { passive: true });
    // Outer page scroll container — closest ancestor with overflow-y auto.
    let outer = scroller.parentElement;
    while (outer && outer !== document.body) {
      const cs = getComputedStyle(outer);
      if (/(auto|scroll)/.test(cs.overflowY)) break;
      outer = outer.parentElement;
    }
    if (outer && outer !== document.body) {
      outer.addEventListener('scroll', onScroll, { passive: true });
    }
    return () => {
      scroller.removeEventListener('scroll', onScroll);
      if (outer && outer !== document.body) {
        outer.removeEventListener('scroll', onScroll);
      }
    };
  }, [updateHighlighter]);

  // Stamp the timestamp on every real cursor movement over the sidebar.
  // Used by the intent gate in onHover to tell user-initiated enters
  // from layout-shift artifacts (see comment near animationCountRef).
  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;
    const onMove = () => { lastMoveAtRef.current = performance.now(); };
    scroller.addEventListener('mousemove', onMove);
    return () => scroller.removeEventListener('mousemove', onMove);
  }, []);

  const subList = reducedMotion ? subListVariantsReduced : subListVariants;
  const item = reducedMotion ? itemVariantsReduced : itemVariants;

  return (
    <aside
      className="docs-sidebar"
      ref={sidebarRef}
      onMouseEnter={onOuterEnter}
      onMouseLeave={onOuterLeave}
    >
      <div className="docs-sidebar-highlighter" ref={highlighterRef} aria-hidden="true" />
      <div className="docs-sidebar-scroll" ref={scrollRef}>
        {sections.map((section, i) => {
          // Each section's first item is its index page (e.g. "Welcome" → "",
          // "LEVEL 1: Fundamentals" → "level-1-fundamentals/level-1-fundamentals").
          // Promote it onto the section heading itself so the heading is a
          // live link instead of dead text sitting above a duplicate row.
          const indexItem = section.items[0];
          const indexMatchesSection =
            indexItem &&
            indexItem.title.trim().toLowerCase() === section.title.trim().toLowerCase();
          const headingItem = indexMatchesSection ? indexItem : null;
          const baseItems = headingItem ? section.items.slice(1) : section.items;
          const remainingItems = regroupPhaseMarkers(baseItems);
          const isHeadingActive = headingItem && headingItem.slug === activeSlug;

          return (
            <div key={i} className="docs-sidebar-section">
              {headingItem ? (
                <div
                  className={`docs-nav-row is-section-heading${isHeadingActive ? ' is-active' : ''}`}
                >
                  <DocsLink href={`/toolbox/${headingItem.slug}`} internal>
                    <span className="docs-nav-label">{section.title.toUpperCase()}</span>
                  </DocsLink>
                </div>
              ) : (
                <div className="docs-sidebar-heading">{section.title.toUpperCase()}</div>
              )}
              <NavList
                items={remainingItems}
                activeSlug={activeSlug}
                depth={0}
                isOpen={isOpen}
                toggle={toggle}
                hovered={hovered}
                onHover={onHover}
                onAnimStart={onAnimStart}
                onAnimComplete={onAnimComplete}
                subListVariants={subList}
                itemVariants={item}
              />
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function NavList({ items, activeSlug, depth, isOpen, toggle, hovered, onHover, onAnimStart, onAnimComplete, subListVariants, itemVariants }) {
  return (
    <ul className={`docs-nav-list docs-nav-depth-${depth}`}>
      {items.map((item, i) => (
        <NavItem
          key={item.slug || i}
          item={item}
          activeSlug={activeSlug}
          depth={depth}
          isOpen={isOpen}
          toggle={toggle}
          hovered={hovered}
          onHover={onHover}
          onAnimStart={onAnimStart}
          onAnimComplete={onAnimComplete}
          subListVariants={subListVariants}
          itemVariants={itemVariants}
        />
      ))}
    </ul>
  );
}

function NavItem({ item, activeSlug, depth, isOpen, toggle, hovered, onHover, onAnimStart, onAnimComplete, subListVariants, itemVariants }) {
  const isActive = item.slug === activeSlug;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = hasChildren && isOpen(item.slug);

  // Clicking anywhere on a foldout's row toggles it. The DocsLink inside
  // already calls preventDefault and runs the SPA navigate; we don't
  // stopPropagation there, so click events bubble to this onClick and
  // both fire as part of the same React event. Clicking the chevron
  // routes through its own handler below (which stopsPropagation, so
  // it doesn't double-toggle here).
  const onRowClick = hasChildren ? () => toggle(item.slug) : undefined;

  // motion.li picks up `itemVariants` only when it's inside a parent
  // motion.div with `animate="open"|"closed"` that propagates the
  // variant context. Top-level items have no such parent, so rendering
  // them with motion.li + variants is a no-op visually — they just sit
  // there. Inside a foldout, they animate as a stagger.
  return (
    <motion.li
      className="docs-nav-item"
      variants={itemVariants}
      onMouseEnter={hasChildren ? () => onHover(item.slug, true) : undefined}
      onMouseLeave={hasChildren ? () => onHover(item.slug, false) : undefined}
    >
      <div
        data-slug={item.slug}
        className={`docs-nav-row${hasChildren ? ' is-foldout' : ''}${isActive ? ' is-active' : ''}`}
        onClick={onRowClick}
      >
        <DocsLink href={`/toolbox/${item.slug}`} internal>
          <span className="docs-nav-label">{item.title}</span>
        </DocsLink>
        {hasChildren && (
          <button
            type="button"
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
            aria-expanded={isExpanded}
            className={`docs-nav-chevron${isExpanded ? ' is-open' : ''}`}
            onClick={(e) => { e.stopPropagation(); toggle(item.slug); }}
          >
            <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
              <path d="M3 1 L7 5 L3 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && (
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="children"
              variants={subListVariants}
              initial="closed"
              animate="open"
              exit="closed"
              onAnimationStart={onAnimStart}
              onAnimationComplete={onAnimComplete}
              style={{ overflow: 'hidden' }}
            >
              <NavList
                items={item.children}
                activeSlug={activeSlug}
                depth={depth + 1}
                isOpen={isOpen}
                toggle={toggle}
                hovered={hovered}
                onHover={onHover}
                onAnimStart={onAnimStart}
                onAnimComplete={onAnimComplete}
                subListVariants={subListVariants}
                itemVariants={itemVariants}
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.li>
  );
}

function collectAncestors(items, activeSlug, outSet, trail = []) {
  for (const item of items) {
    const here = [...trail, item.slug];
    if (item.slug === activeSlug) {
      for (const s of here) outSet.add(s);
      return true;
    }
    if (item.children && collectAncestors(item.children, activeSlug, outSet, here)) return true;
  }
  return false;
}
