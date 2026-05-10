import React, { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
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
              style={{ overflow: 'hidden', paddingLeft: '4%' }}
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
  const [layout, setLayout] = useState(null);
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

  // Measure the card's box AND the heading / last-row positions in
  // one shot so the active outline knows how tall its top and bottom
  // extensions should be — the top extension wraps the heading, the
  // bottom extension wraps the last visible row, and the recessed
  // body in between matches whatever space remains.
  const measure = useCallback(() => {
    const card = cardRef.current;
    if (!card) return null;
    const w = card.offsetWidth;
    const h = card.offsetHeight;
    const cardRect = card.getBoundingClientRect();
    const heading = card.querySelector('.docs-sidebar-heading');
    const rows = card.querySelectorAll('.docs-nav-row');
    const lastRow = rows.length ? rows[rows.length - 1] : null;
    let topExt = null;
    let botExt = null;
    if (heading) {
      const r = heading.getBoundingClientRect();
      topExt = Math.max(0, r.bottom - cardRect.top);
    }
    if (lastRow) {
      const r = lastRow.getBoundingClientRect();
      botExt = Math.max(0, cardRect.bottom - r.top);
    }
    return { width: w, height: h, topExt, botExt };
  }, []);

  // Re-measure when activeSlug changes. The CSS `:has(.docs-nav-row.is-active)`
  // selector drives width changes that ResizeObserver alone proved
  // unreliable for (some sections wouldn't fire the callback when the
  // box shrank from focus-state width back to inactive width). Running
  // this only on activeSlug change avoids a re-render loop during
  // framer-motion height animations: a no-deps useLayoutEffect would
  // re-measure on every commit, and the height oscillates between
  // commits while a foldout is animating, so the equality guard would
  // fail and setLayout would queue another render until React bails
  // with error #185.
  useLayoutEffect(() => {
    const next = measure();
    if (!next) return;
    setLayout((prev) => (sameLayout(prev, next) ? prev : next));
  }, [activeSlug, measure]);

  // ResizeObserver handles all the *non-render-triggered* size changes:
  // foldout-open animations, font load, image load. These happen
  // outside of React's render cycle so they don't risk looping.
  useLayoutEffect(() => {
    if (!cardRef.current) return;
    const el = cardRef.current;
    const observer = new ResizeObserver(() => {
      const next = measure();
      if (!next) return;
      setLayout((prev) => (sameLayout(prev, next) ? prev : next));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [measure]);

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
      {layout && (
        <SectionOutline
          width={layout.width}
          height={layout.height}
          topExt={layout.topExt}
          botExt={layout.botExt}
          skipTopOuter={isFirstSection}
          skipBottomOuter={isLastSection}
        />
      )}
    </div>
  );
}

function sameLayout(a, b) {
  if (!a || !b) return false;
  return (
    a.width === b.width &&
    a.height === b.height &&
    a.topExt === b.topExt &&
    a.botExt === b.botExt
  );
}

/**
 * SectionOutline — renders the section card's outline AND fill as
 * SVG paths.
 *
 * Two SVGs rendered per card; CSS picks which is visible by focus-
 * group state via `:has(.docs-nav-row.is-active)`. (The CSS toggle
 * is existing infrastructure; this component never edits CSS.)
 *
 * Inactive sections are a plain rounded rectangle at the box's
 * natural width.
 *
 * Active sections paint a tangent-continuous "L" or barbell:
 *   - The TOP extension (height = topExt, wraps the heading)
 *     reaches the box's full width on the right so the section
 *     meets the article's left edge.
 *   - The BOTTOM extension (height = botExt, wraps the last row)
 *     does the same at the bottom.
 *   - In between, the body recesses by BODY_INSET, with concave
 *     fillet corners at each step (no sharp turns).
 *   - First section: only TOP extension (no bottom extension).
 *   - Last section: only BOTTOM extension.
 *   - Middle: both extensions, recessed band in the middle.
 *
 * All corners — outer convex and inner concave — use the same
 * RADIUS so the rounded language reads consistently.
 */
function SectionOutline({ width, height, topExt, botExt, skipTopOuter, skipBottomOuter }) {
  const RADIUS = 18;
  const STROKE_WIDTH = 2;
  // SVG strokes are centered on the path by default — half the
  // stroke sits outside the path's geometric bounds, half inside.
  // Inset every path coordinate by STROKE_WIDTH / 2 so the stroke's
  // OUTER edge lands flush with the section box (an "inner" stroke
  // simulation), instead of bleeding 1 px past the top/left/bottom
  // edges where the cream + article were already painted.
  const STROKE_INSET = STROKE_WIDTH / 2;

  // Active section is a SINGLE closed path — a sideways T (⊣) where
  // the body↔strip junctions use S-curve transitions instead of
  // straight 90° corners. Each S-curve is two back-to-back 90° arcs
  // with opposite curvature: the path enters the junction along the
  // body's top edge going RIGHT, curves UP for 90°, reverses
  // curvature to curve back into the RIGHT direction at a higher y,
  // and continues along the strip's top edge. Same logic mirrored
  // at every other junction. No segment ends in a curvature
  // discontinuity ("harsh cut"); every 90° arc is followed by
  // either another 90° arc (forming an S back to neutral) or, at
  // the body's outer corners, a tangent-continuous straight edge.
  // All arcs use the same radius RADIUS.
  //
  // Geometry:
  //   - body  occupies x ∈ [0, W_box], y ∈ [0, H]
  //   - strip occupies x ∈ [W_box, W_box + W_strip],
  //                   y ∈ [-2R, H + 2R]   (or [0, H+2R] / [-2R, H]
  //                   when first/last)
  //   - W_strip = 2*RADIUS so the strip's caps are exact semicircles
  const W_STRIP = 2 * RADIUS;

  // First section: top is flat (body+strip share a continuous top
  // edge at y=0, no S-curve at the top junction). Last section:
  // mirror at the bottom.
  const flatTop = skipTopOuter;
  const flatBottom = skipBottomOuter;

  const inactivePath = roundedRectPath(width, height, RADIUS, STROKE_INSET);
  const activePath = sCurveTPath(width, height, RADIUS, W_STRIP, flatTop, flatBottom, STROKE_INSET);

  // SVG element is positioned by CSS at `top: -RADIUS` (existing
  // infrastructure for older bump geometries that needed headroom
  // above the section box). The viewBox here cancels that offset so
  // user-space y=0 maps back to parent y=0 — without this, the
  // outline renders RADIUS pixels too high and the top stroke
  // appears clipped by the sidebar's scroll container.
  // SVG sized to hold body + offset strip. Strip's left edge sits
  // RADIUS past the section box (so the S-curve's second half is
  // hidden behind the card), and strip width is W_STRIP, so total
  // horizontal extension past the box is RADIUS + W_STRIP. Vertical
  // extension is 2*RADIUS above and below for the S-curve / strip
  // overhang. viewBox y-min cancels the existing CSS top:-RADIUS.
  const svgWidth = width + RADIUS + W_STRIP;
  const svgHeight = height + 4 * RADIUS;

  const INACTIVE_FILL = 'rgba(255, 255, 255, 0.08)';
  const FOCUS_FILL = 'rgba(255, 255, 255, 0.16)';
  const INACTIVE_STROKE = 'rgba(255, 255, 255, 0.95)';
  const FOCUS_STROKE = 'rgba(255, 255, 255, 1)';

  const svgProps = {
    width: svgWidth,
    height: svgHeight,
    viewBox: `0 ${-RADIUS} ${svgWidth} ${svgHeight}`,
    'aria-hidden': true,
  };

  return (
    <>
      <svg className="docs-section-outline docs-section-outline-inactive" {...svgProps}>
        <path
          d={inactivePath}
          fill={INACTIVE_FILL}
          stroke={INACTIVE_FILL}
          strokeWidth={STROKE_WIDTH}
        />
        <path
          d={inactivePath}
          stroke={INACTIVE_STROKE}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
      </svg>
      <svg className="docs-section-outline docs-section-outline-focus" {...svgProps}>
        <path
          d={activePath}
          fill={FOCUS_FILL}
          stroke={FOCUS_FILL}
          strokeWidth={STROKE_WIDTH}
        />
        <path
          d={activePath}
          stroke={FOCUS_STROKE}
          strokeWidth={STROKE_WIDTH}
          fill="none"
        />
      </svg>
    </>
  );
}

// Plain rounded rectangle — used by inactive sections. The path is
// inset by `inset` on every side so a centered stroke renders flush
// with the section box instead of bleeding past it.
function roundedRectPath(w, h, r, inset = 0) {
  const i = inset;
  return [
    `M ${r + i} ${i}`,
    `L ${w - r - i} ${i}`,
    `A ${r} ${r} 0 0 1 ${w - i} ${r + i}`,
    `L ${w - i} ${h - r - i}`,
    `A ${r} ${r} 0 0 1 ${w - r - i} ${h - i}`,
    `L ${r + i} ${h - i}`,
    `A ${r} ${r} 0 0 1 ${i} ${h - r - i}`,
    `L ${i} ${r + i}`,
    `A ${r} ${r} 0 0 1 ${r + i} ${i}`,
    'Z',
  ].join(' ');
}

// Sideways-T outline (⊣) drawn as a SINGLE continuous path. Each
// body↔strip junction is an S-curve made of two 90° arcs back-to-
// back with opposite curvature, but the S-curve is positioned so
// only its FIRST half stays in front of the card; the second half
// + the entire strip live behind the card. So at each visible
// junction you see exactly ONE outward curve before the path tucks
// under the card. All arcs share radius r; same as the inactive
// sidebar groups.
//
// Top S-curve (junction shifted right by r vs a centered S):
//   body top edge → arc-1 (CCW, RIGHT→UP) ends at (W_box, -r),
//   right at the card's left edge — this is the only visible
//   curve. Then arc-2 (CW, UP→RIGHT) ends at (W_box+r, -2r), which
//   sits inside the cream/article and is masked. The strip's left
//   edge starts another r further right, so the entire strip sits
//   behind the card.
function sCurveTPath(W_box, H, r, W_strip, flatTop, flatBottom, inset = 0) {
  const i = inset;
  // Strip starts r past W_box (shifted so arc-2 is hidden).
  const stripLeft = W_box + r;
  const stripRight = stripLeft + W_strip;
  const segments = [`M ${r + i} ${i}`];

  if (flatTop) {
    segments.push(`L ${stripRight - r} ${i}`);
    segments.push(`A ${r} ${r} 0 0 1 ${stripRight - i} ${r + i}`);
  } else {
    segments.push(`L ${W_box - r} ${i}`);
    segments.push(`A ${r} ${r} 0 0 0 ${W_box} ${-r + i}`);
    segments.push(`A ${r} ${r} 0 0 1 ${W_box + r} ${-2 * r + i}`);
    segments.push(`L ${stripRight - r} ${-2 * r + i}`);
    segments.push(`A ${r} ${r} 0 0 1 ${stripRight - i} ${-r + i}`);
  }

  // Strip right edge (down) — right edge inset so its (hidden) stroke is consistent.
  const stripBotY = flatBottom ? H - r - i : H + r - i;
  segments.push(`L ${stripRight - i} ${stripBotY}`);

  if (flatBottom) {
    segments.push(`A ${r} ${r} 0 0 1 ${stripRight - r} ${H - i}`);
    segments.push(`L ${r + i} ${H - i}`);
  } else {
    segments.push(`A ${r} ${r} 0 0 1 ${stripRight - r} ${H + 2 * r - i}`);
    segments.push(`L ${stripLeft} ${H + 2 * r - i}`);
    segments.push(`A ${r} ${r} 0 0 1 ${W_box} ${H + r - i}`);
    segments.push(`A ${r} ${r} 0 0 0 ${W_box - r} ${H - i}`);
    segments.push(`L ${r + i} ${H - i}`);
  }

  segments.push(`A ${r} ${r} 0 0 1 ${i} ${H - r - i}`);
  segments.push(`L ${i} ${r + i}`);
  segments.push(`A ${r} ${r} 0 0 1 ${r + i} ${i}`);
  segments.push('Z');

  return segments.join(' ');
}

// Walk every section's items and collect the slugs of foldouts whose
// subtree contains the active slug. Includes the active slug itself
// if it's a foldout (some pages are both a navigable destination AND
// a foldout — without this, clicking such a row would navigate and
// open the foldout in one render, then the activeAncestors reset
// effect would immediately close it again, requiring a second click
// to re-open). Returns slugs in root-to-leaf order so passing them
// to setUserToggle in iteration order is harmless.
function collectActiveAncestors(sections, activeSlug) {
  const out = [];
  if (!activeSlug) return out;
  const visit = (items, trail) => {
    for (const item of items) {
      if (item.slug === activeSlug) {
        for (const slug of trail) out.push(slug);
        if (item.children && item.children.length > 0) {
          out.push(item.slug);
        }
        return true;
      }
      if (item.children && item.children.length > 0) {
        if (visit(item.children, [...trail, item.slug])) return true;
      }
    }
    return false;
  };
  for (const section of sections) {
    // Mirror the regrouping that render does. RECORD / REFLECT /
    // REFINE are flat siblings in the data, but `regroupPhaseMarkers`
    // turns them into foldouts that bucket the modules that follow
    // them. Without this, RECORD looks childless to the walker — its
    // own slug never enters the auto-open set, and clicking it
    // navigates + opens but the reset effect immediately collapses
    // it (the LEVEL 2 double-click case).
    const items = regroupPhaseMarkers(section.items);
    visit(items, []);
  }
  return out;
}
