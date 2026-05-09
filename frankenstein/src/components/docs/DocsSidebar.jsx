import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DocsLink from './DocsLink';

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
  // user clicks layer over it.
  const [userToggle, setUserToggle] = useState(() => {
    const map = new Map();
    for (const slug of activeAncestors) map.set(slug, true);
    return map;
  });

  // Re-open ancestors whenever the active page changes (route nav).
  useEffect(() => {
    setUserToggle((prev) => {
      const next = new Map(prev);
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
            <div key={i} className="docs-sidebar-section">
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
                subListVariants={subList}
                itemVariants={item}
              />
              <BridgeCorners />
            </div>
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
 * Outward curves at the bridge's right corners, rendered as real SVG
 * paths instead of CSS pseudo-elements with inline-SVG backgrounds.
 *
 * Hidden by default. CSS in `docs.css` shows the SVGs only when the
 * parent section is the focus group (`:has(.docs-nav-row.is-active)`).
 *
 * The geometry is computed in JS so all dimensions live in one place
 * and the path strings are derived from named constants — easier to
 * tweak than hand-rolled inline SVG paths.
 *
 * Coordinate system (per-corner SVG, top corner shown — bottom mirrors):
 *   - SVG box: RADIUS × RADIUS, positioned at right: 0, top: -RADIUS
 *     so its right edge aligns with the section's right edge (x=314)
 *     and it extends RADIUS px above the section into the moat space.
 *   - In SVG coords (origin top-left, y-down):
 *       (0, RADIUS)     = bridge top stroke at x=section_right - RADIUS
 *       (RADIUS, 0)     = above the section, at section's right edge
 *       (RADIUS, RADIUS)= the corner intersection point — arc center
 *   - Path: 90° quarter-arc from (0, RADIUS) → (RADIUS, 0), centered
 *     at (RADIUS, RADIUS), bulging through (RADIUS - RADIUS/√2,
 *     RADIUS - RADIUS/√2) ≈ (5.3, 5.3) — into the moat above the
 *     bridge, never past the section's right edge.
 *   - sweep-flag = 1 picks that arc (CCW math = visually CW in
 *     y-down). The opposite flag bulges through (12.7, 12.7) which
 *     would be the inward / "concave" arc.
 */
function BridgeCorners() {
  const RADIUS = 18;
  const STROKE_WIDTH = 2;
  const SVG_SIZE = RADIUS;

  return (
    <>
      <svg
        className="docs-bridge-corner docs-bridge-corner-top"
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        aria-hidden="true"
      >
        <path
          d={`M 0 ${RADIUS} A ${RADIUS} ${RADIUS} 0 0 1 ${RADIUS} 0`}
          stroke="white"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
        />
      </svg>
      <svg
        className="docs-bridge-corner docs-bridge-corner-bottom"
        width={SVG_SIZE}
        height={SVG_SIZE}
        viewBox={`0 0 ${SVG_SIZE} ${SVG_SIZE}`}
        aria-hidden="true"
      >
        <path
          d={`M 0 0 A ${RADIUS} ${RADIUS} 0 0 0 ${RADIUS} ${RADIUS}`}
          stroke="white"
          strokeWidth={STROKE_WIDTH}
          fill="none"
          strokeLinecap="round"
        />
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
