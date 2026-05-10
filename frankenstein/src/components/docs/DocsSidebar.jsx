import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DocsLink from './DocsLink';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';

/**
 * Docs sidebar — open-on-active-path edition.
 *
 * Each top-level section renders as its own glassy, fully-rounded card
 * floating on the videodeck (see `.docs-sidebar-section` in docs.css).
 * Inside the card sits the section heading and a flat list of nav rows.
 *
 * Foldouts auto-expand on the ancestor path of the active page: arriving
 * on a deep leaf opens every foldout above it so the active row is
 * visible inside its section card. The active foldout's own row gets a
 * navy inline outline (see `.docs-nav-row.is-foldout.is-active` in
 * docs.css) and its children paint their own per-depth pills directly
 * inside the section card — no separate "envelope" lift.
 *
 * Accordion: opening a foldout closes its same-level siblings. Closing
 * a foldout doesn't affect siblings.
 *
 * Click semantics:
 *   - Foldout row → toggle this foldout (with accordion).
 *   - Leaf row → DocsLink handles navigation.
 *   - Click outside the sidebar → close every open foldout *not* on the
 *     active ancestor path (so the user's choice stays visible).
 */

/**
 * Level 2 has three flat phase markers (RECORD, REFLECT, REFINE) sitting
 * inline among the numbered modules. The data has them as siblings, not
 * parents — but visually they're meant to gate the items that follow,
 * matching how "3. Safe, Simple & Small" foldout-groups its sub-pages.
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

// M3 emphasized easing — decelerated for entering (lands soft),
// standard for exiting (gentle taper).
const EASE_DECEL = [0.05, 0.7, 0.1, 1];
const EASE_STANDARD = [0.4, 0, 0.2, 1];

const subListVariants = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.32, ease: EASE_DECEL },
      opacity: { duration: 0.22, ease: EASE_DECEL },
      staggerChildren: 0.035,
      delayChildren: 0.04,
    },
  },
  closed: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.28, ease: EASE_STANDARD },
      opacity: { duration: 0.18, ease: EASE_STANDARD },
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: EASE_DECEL },
  },
  closed: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.2, ease: EASE_STANDARD },
  },
};

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

  // Slugs of every foldout that is an ancestor of the active page.
  // These auto-open on mount and re-open whenever activeSlug changes,
  // and stay open through click-outside-sidebar (so the active row
  // stays visible after the user dismisses other foldouts).
  const activeAncestors = useMemo(
    () => collectActiveAncestors(sections, activeSlug),
    [sections, activeSlug]
  );

  // Foldout open state: `userToggle.get(slug) === true` means open. The
  // initial map opens every ancestor of the active page; subsequent
  // user clicks within the active section layer over it.
  const [userToggle, setUserToggle] = useState(() => {
    const map = new Map();
    for (const slug of activeAncestors) map.set(slug, true);
    return map;
  });

  // Reset to the freshly-loaded state on every route change: only the
  // active ancestors stay open. Foldouts the user manually opened in
  // OTHER sections (or in this section before navigating away) collapse
  // — there are only three group states (first / middle / last), and
  // each section should look identical to a cold load of the current
  // page. Without this reset, sections would carry stale "third state"
  // expansion across navigation.
  useEffect(() => {
    setUserToggle(() => {
      const next = new Map();
      for (const slug of activeAncestors) next.set(slug, true);
      return next;
    });
  }, [activeAncestors]);

  const isOpen = useCallback(
    (slug) => userToggle.get(slug) === true,
    [userToggle]
  );

  // Accordion-aware toggle. Opening a foldout closes its same-level
  // siblings. Closing a foldout doesn't affect siblings.
  const toggle = useCallback((slug, siblingSlugs) => {
    setUserToggle((prev) => {
      const wasOpen = prev.get(slug) === true;
      const next = new Map(prev);
      if (wasOpen) {
        next.set(slug, false);
      } else {
        if (siblingSlugs && siblingSlugs.length > 0) {
          for (const sib of siblingSlugs) {
            if (sib !== slug && prev.get(sib) === true) {
              next.set(sib, false);
            }
          }
        }
        next.set(slug, true);
      }
      return next;
    });
  }, []);

  const sidebarRef = useRef(null);

  // Click-outside-sidebar → close every open foldout *except* those on
  // the active ancestor path, so the user's current page stays visible
  // in its open section.
  useEffect(() => {
    const onDocClick = (e) => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;
      if (sidebar.contains(e.target)) return;
      const keep = new Set(activeAncestors);
      setUserToggle((prev) => {
        if (prev.size === 0) return prev;
        let changed = false;
        const next = new Map(prev);
        for (const [slug, val] of prev) {
          if (val === true && !keep.has(slug)) {
            next.set(slug, false);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [activeAncestors]);

  const subList = reducedMotion ? subListVariantsReduced : subListVariants;
  const item = reducedMotion ? itemVariantsReduced : itemVariants;

  return (
    <aside className="docs-sidebar" ref={sidebarRef}>
      <div className="docs-sidebar-scroll">
        {sections.map((section, i) => {
          const indexItem = section.items[0];
          const indexMatchesSection =
            indexItem &&
            indexItem.title.trim().toLowerCase() === section.title.trim().toLowerCase();
          const headingItem = indexMatchesSection ? indexItem : null;
          const baseItems = headingItem ? section.items.slice(1) : section.items;
          const remainingItems = regroupPhaseMarkers(baseItems);
          const isHeadingActive = headingItem && headingItem.slug === activeSlug;

          return (
            <SectionCard
              key={i}
              section={section}
              headingItem={headingItem}
              remainingItems={remainingItems}
              isHeadingActive={isHeadingActive}
              activeSlug={activeSlug}
              isOpen={isOpen}
              toggle={toggle}
              subListVariants={subList}
              itemVariants={item}
              isFirstSection={i === 0}
              isLastSection={i === sections.length - 1}
            />
          );
        })}
      </div>
    </aside>
  );
}

function NavList({ items, activeSlug, depth, parentSlug, isOpen, toggle, subListVariants, itemVariants }) {
  // Accordion siblings = the slugs of the foldouts at this level.
  // Leaves don't contribute (they don't open/close), so we only
  // collect items with children.
  const siblingSlugs = useMemo(
    () => items.filter((it) => it.children && it.children.length > 0).map((it) => it.slug),
    [items]
  );

  return (
    <ul className={`docs-nav-list docs-nav-depth-${depth}`}>
      {items.map((item, i) => (
        <NavItem
          key={item.slug || i}
          item={item}
          activeSlug={activeSlug}
          depth={depth}
          parentSlug={parentSlug}
          isOpen={isOpen}
          toggle={toggle}
          siblingSlugs={siblingSlugs}
          subListVariants={subListVariants}
          itemVariants={itemVariants}
        />
      ))}
    </ul>
  );
}

function NavItem({ item, activeSlug, depth, parentSlug, isOpen, toggle, siblingSlugs, subListVariants, itemVariants }) {
  const isActive = item.slug === activeSlug;
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = hasChildren && isOpen(item.slug);

  // Click semantics on the row:
  //   - Foldout row → toggle this foldout (with accordion).
  //   - Leaf row → no toggle behavior; DocsLink handles navigation.
  //     (The previous "active leaf closes parent" behavior was removed
  //     so the foldout stays open showing siblings of the active page.)
  let onRowClick;
  if (hasChildren) {
    onRowClick = () => toggle(item.slug, siblingSlugs);
  }

  return (
    <motion.li
      className="docs-nav-item"
      variants={itemVariants}
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
            onClick={(e) => { e.stopPropagation(); toggle(item.slug, siblingSlugs); }}
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
              style={{ overflow: 'hidden' }}
            >
              <NavList
                items={item.children}
                activeSlug={activeSlug}
                depth={depth + 1}
                parentSlug={item.slug}
                isOpen={isOpen}
                toggle={toggle}
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

/**
 * SectionCard — one section card in the sidebar. Owns its DOM ref,
 * tracks its own rendered dimensions via ResizeObserver, and renders
 * its entire outline as a single SVG path (`SectionOutline` below)
 * computed from those dimensions. The CSS still handles fill /
 * background-blur / shadows / focus-group highlight, but the
 * *visible outline* is drawn by the SVG, not by `border` properties.
 *
 * Why the refactor: when the outline was a CSS border, attaching
 * outward curves to the right corners required bolting an extra
 * SVG on top, and the SVG arc and the CSS border ended up as two
 * separate strokes that didn't share endpoints (the "fork"). With
 * the entire outline as one SVG path, the rounded-left and
 * outward-right corners are part of the same shape, sharing
 * endpoints exactly.
 */
function SectionCard({
  section,
  headingItem,
  remainingItems,
  isHeadingActive,
  activeSlug,
  isOpen,
  toggle,
  subListVariants,
  itemVariants,
  isFirstSection,
  isLastSection,
}) {
  const cardRef = useRef(null);
  const [dims, setDims] = useState(null);
  const transitionNavigate = useTransitionNavigate();

  // Whole-card hitbox: clicking anywhere on the section card that
  // isn't a row / link / button navigates to the section's heading
  // page. A small UX courtesy so a stray click in the padding lands
  // on something sensible rather than feeling like dead space. No-op
  // if the section has no heading link (no index page to land on).
  const onCardClick = useCallback((e) => {
    if (!headingItem) return;
    if (e.target.closest('a, button, .docs-nav-row')) return;
    transitionNavigate(`/toolbox/${headingItem.slug}`);
  }, [headingItem, transitionNavigate]);

  // Measure on every render (no deps) so we pick up width changes that
  // come from CSS-driven `:has(.docs-nav-row.is-active)` toggles during
  // SPA navigation. ResizeObserver alone proved unreliable for these
  // — Chromium would skip the callback for some sections when the box
  // shrank from focus-state width back to inactive width, leaving the
  // SVG outline stuck at the focus-state width (the "third state" the
  // section appeared to settle into after losing focus).
  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    setDims((prev) => (prev && prev.width === w && prev.height === h ? prev : { width: w, height: h }));
  });

  // ResizeObserver still handles content-driven height changes that
  // happen *outside* a React render (e.g., font load, image load).
  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const observer = new ResizeObserver(() => {
      const w = el.offsetWidth;
      const h = el.offsetHeight;
      setDims((prev) => (prev && prev.width === w && prev.height === h ? prev : { width: w, height: h }));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className={`docs-sidebar-section${headingItem ? ' is-clickable' : ''}`}
      onClick={onCardClick}
    >
      {headingItem ? (
        <div
          className={`docs-sidebar-heading is-link${isHeadingActive ? ' is-active' : ''}`}
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
        parentSlug={null}
        isOpen={isOpen}
        toggle={toggle}
        subListVariants={subListVariants}
        itemVariants={itemVariants}
      />
      {dims && (
        <SectionOutline
          width={dims.width}
          height={dims.height}
          skipTopOuter={isFirstSection}
          skipBottomOuter={isLastSection}
        />
      )}
    </div>
  );
}

/**
 * SectionOutline — renders the section card's outline AND fill as
 * SVG paths so they share the same shape exactly (no fork between
 * a CSS border and a bolted-on overlay).
 *
 * Two SVGs rendered per card; CSS picks which is visible by focus-
 * group state via `:has(.docs-nav-row.is-active)`.
 *
 * The `skipTopOuter` / `skipBottomOuter` props ONLY affect the focus
 * state. In the inactive state every section renders the same
 * rounded rectangle regardless of position — first / middle / last
 * blocks all look identical when untapped. The "push into the
 * article corner" treatment (straight stroke + extension) is part
 * of how the focus group connects to the article card and is not a
 * property the inactive state should carry.
 *
 * Skip flags handle the article-card-corner clash in the focus state:
 *   - First section's TOP-RIGHT outward corner would clash with the
 *     article card's rounded top-left corner (two opposite roundings
 *     meeting in the same area). With `skipTopOuter`, the top stroke
 *     runs straight to (width, 0) with no outward curve — visually
 *     reading as the section's top extending straight up into the
 *     article's corner space without a competing roundness.
 *   - Last section's BOTTOM-RIGHT outward corner mirrors via
 *     `skipBottomOuter`.
 *
 * Path geometry (focus state, written clockwise from top-left):
 *
 *   Top-right:
 *     - skipped: top stroke runs L (width, 0); no arc
 *     - outward: top stroke runs to (width - R, 0), then arc to
 *       (width, -R) — bulges up into the moat above
 *
 *   Open right side: stroke uses `M` (move) to jump from the top
 *   piece's end to the bottom piece's start — no vertical stroke
 *   connects them. The fill path uses `L` (straight line) instead
 *   so the closed shape includes a virtual right edge for filling.
 *
 *   Bottom-right (mirror of top-right):
 *     - skipped: bottom piece starts at (width, height); no arc
 *     - outward: bottom piece starts at (width, height + R), arc
 *       to (width - R, height)
 *
 *   The bottom-left and top-left corners always round inward at
 *   RADIUS — they sit far from the article card's corners and have
 *   no clash to resolve.
 */
function SectionOutline({ width, height, skipTopOuter, skipBottomOuter }) {
  const RADIUS = 18;
  const STROKE_WIDTH = 2;
  // For the first / last section's "into the corner top" extension:
  // the article card has border-radius: 16 plus a 6 px box-shadow ring
  // around it, so its visible top-left corner's *topmost point* sits
  // at x = section_right + 22. Pushing the straight stroke that far
  // ends it right at the article's rounded-corner apex — past the
  // sidebar column, into the moat space above the article's curve.
  const ARTICLE_CORNER_OFFSET = 22;

  // Where the top piece of the focus path ends (= where the right
  // side starts).
  const topRightY = skipTopOuter ? 0 : -RADIUS;
  // Where the bottom piece of the focus path starts.
  const bottomRightY = skipBottomOuter ? height : height + RADIUS;

  // Top half of the focus path (left rounded corner + top stroke +
  // top-right outward-or-skipped corner). Ends at (width, topRightY).
  const focusTop = skipTopOuter
    ? [
        `M ${RADIUS} 0`,
        `L ${width} 0`,
      ]
    : [
        `M ${RADIUS} 0`,
        `L ${width - RADIUS} 0`,
        `A ${RADIUS} ${RADIUS} 0 0 0 ${width} ${-RADIUS}`,
      ];

  // Bottom half of the focus path: starts at (width, bottomRightY),
  // bottom-right outward-or-skipped corner, bottom stroke, rounded
  // bottom-left, left stroke, rounded top-left back to (RADIUS, 0).
  const focusBottomFromRight = skipBottomOuter
    ? [
        // Already at (width, height) thanks to the prior subpath jump.
        `L ${RADIUS} ${height}`,
      ]
    : [
        // Already at (width, height + RADIUS); arc back into the
        // section's right edge at (width - RADIUS, height).
        `A ${RADIUS} ${RADIUS} 0 0 0 ${width - RADIUS} ${height}`,
        `L ${RADIUS} ${height}`,
      ];

  const focusBottomTail = [
    `A ${RADIUS} ${RADIUS} 0 0 1 0 ${height - RADIUS}`,
    `L 0 ${RADIUS}`,
    `A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0`,
  ];

  // Stroke path: open right side via `M` jump.
  const focusStrokePath = [
    ...focusTop,
    `M ${width} ${bottomRightY}`,
    ...focusBottomFromRight,
    ...focusBottomTail,
  ].join(' ');

  // Fill path: same geometry but the right side is a straight line
  // instead of an `M` jump, so the shape is closed and fillable.
  const focusFillPath = [
    ...focusTop,
    `L ${width} ${bottomRightY}`,
    ...focusBottomFromRight,
    ...focusBottomTail,
    'Z',
  ].join(' ');

  // Inactive: identical for every section regardless of position.
  // First / middle / last all render the same rounded rectangle when
  // they're not the active focus group — there are only two visual
  // states (inactive rounded-rect, active focus-shape), and the
  // first/last "push into the article corner" treatment belongs only
  // to the active state.
  const inactivePath = [
    `M ${RADIUS} 0`,
    `L ${width - RADIUS} 0`,
    `A ${RADIUS} ${RADIUS} 0 0 1 ${width} ${RADIUS}`,
    `L ${width} ${height - RADIUS}`,
    `A ${RADIUS} ${RADIUS} 0 0 1 ${width - RADIUS} ${height}`,
    `L ${RADIUS} ${height}`,
    `A ${RADIUS} ${RADIUS} 0 0 1 0 ${height - RADIUS}`,
    `L 0 ${RADIUS}`,
    `A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0`,
    'Z',
  ].join(' ');

  // The SVG box covers the section + RADIUS px above and below so
  // outward corners have room to render. Width is also extended by
  // ARTICLE_CORNER_OFFSET on the right so the first/last section's
  // "into the corner top" extension is INSIDE the SVG's viewport
  // (not relying on overflow: visible to escape it). The empty area
  // on the right when no extension applies is harmless — the SVG is
  // pointer-events: none and renders nothing there.
  const svgHeight = height + 2 * RADIUS;
  const svgWidth = width + ARTICLE_CORNER_OFFSET;

  // Extension stroke for the first/last section: a small horizontal
  // segment from (width, 0) to (width + ARTICLE_CORNER_OFFSET, 0) at
  // the top, mirrored at the bottom. Pushes the straight stroke past
  // the section's right edge, into the moat space that sits above
  // (or below) the article card's rounded corner — terminating at
  // the article's corner apex. Renders inside the SVG via overflow:
  // visible; the parent scroll container's clip box has been widened
  // to accommodate it.
  const extensionSegments = [];
  if (skipTopOuter) {
    extensionSegments.push(`M ${width} 0 L ${width + ARTICLE_CORNER_OFFSET} 0`);
  }
  if (skipBottomOuter) {
    extensionSegments.push(`M ${width} ${height} L ${width + ARTICLE_CORNER_OFFSET} ${height}`);
  }
  const extensionPath = extensionSegments.length > 0 ? extensionSegments.join(' ') : null;

  // Focus fill matches the active section's CSS background so the
  // SVG-filled outward-corner regions read as the same surface as
  // the CSS-filled (and backdrop-blurred) rectangular body.
  // Inactive sections don't get an SVG fill — the CSS background
  // already covers their full rectangular shape and adding SVG fill
  // would double-render it.
  const FOCUS_FILL = 'rgba(255, 255, 255, 0.16)';

  return (
    <>
      <svg
        className="docs-section-outline docs-section-outline-inactive"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 ${-RADIUS} ${svgWidth} ${svgHeight}`}
        aria-hidden="true"
      >
        <path
          d={inactivePath}
          stroke="rgba(255, 255, 255, 0.95)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
      </svg>
      <svg
        className="docs-section-outline docs-section-outline-focus"
        width={svgWidth}
        height={svgHeight}
        viewBox={`0 ${-RADIUS} ${svgWidth} ${svgHeight}`}
        aria-hidden="true"
      >
        {/* Fill goes first so the stroke renders on top. */}
        <path d={focusFillPath} fill={FOCUS_FILL} stroke="none" />
        <path
          d={focusStrokePath}
          stroke="rgba(255, 255, 255, 1)"
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
        {extensionPath && (
          <path
            d={extensionPath}
            stroke="rgba(255, 255, 255, 1)"
            strokeWidth={STROKE_WIDTH}
            fill="none"
          />
        )}
      </svg>
    </>
  );
}

// Walk every section's items and collect the slugs of foldouts whose
// subtree contains the active slug. Returns slugs in root-to-leaf order
// so passing them to setUserToggle in iteration order is harmless.
function collectActiveAncestors(sections, activeSlug) {
  const out = [];
  if (!activeSlug) return out;
  const visit = (items, trail) => {
    for (const item of items) {
      if (item.slug === activeSlug) {
        for (const slug of trail) out.push(slug);
        return true;
      }
      if (item.children && item.children.length > 0) {
        if (visit(item.children, [...trail, item.slug])) return true;
      }
    }
    return false;
  };
  for (const section of sections) visit(section.items, []);
  return out;
}
