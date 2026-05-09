import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import DocsLink from './DocsLink';

/**
 * Docs sidebar — closed-card edition.
 *
 * Each top-level section renders as its own glassy, fully-rounded card
 * floating on the videodeck (see `.docs-sidebar-section` in docs.css).
 * Inside the card sits the section heading and a flat list of nav rows.
 *
 * Foldouts are click-only and start closed. There is no auto-open from
 * the active path: arriving on a deep page does NOT expand its parents.
 * The active leaf is identified by a per-row treatment (inside whatever
 * card it lives in); there is no sliding pill, no moat outcrop, and no
 * scroll-position math. If a parent is collapsed, the active leaf simply
 * isn't in the DOM — the in-article breadcrumb carries that orientation
 * (see DocsPage's `.docs-section-crumb`).
 *
 * Accordion: opening a foldout closes its same-level siblings. Closing
 * a foldout doesn't affect siblings.
 *
 * Click semantics:
 *   - Foldout row → toggle this foldout (with accordion).
 *   - Active leaf row → close its containing foldout (only when nested
 *     under one). "I've made my choice, panel can go."
 *   - Click outside the sidebar → close every open foldout.
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

  // Single source of truth for foldout state: `userToggle.get(slug) === true`
  // means open, anything else (missing or `false`) means closed. Default
  // closed — no auto-open from active path.
  const [userToggle, setUserToggle] = useState(() => new Map());

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

  // Click-outside-sidebar → close every open foldout.
  useEffect(() => {
    const onDocClick = (e) => {
      const sidebar = sidebarRef.current;
      if (!sidebar) return;
      if (sidebar.contains(e.target)) return;
      setUserToggle((prev) => {
        if (prev.size === 0) return prev;
        let changed = false;
        const next = new Map(prev);
        for (const [slug, val] of prev) {
          if (val === true) {
            next.set(slug, false);
            changed = true;
          }
        }
        return changed ? next : prev;
      });
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

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
  //   - Active leaf row → close the containing foldout. "I've made my
  //     choice, panel can go." Leaves at depth-0 (no parentSlug) skip.
  //   - Non-active leaf row → no toggle behavior; DocsLink handles
  //     navigation.
  let onRowClick;
  if (hasChildren) {
    onRowClick = () => toggle(item.slug, siblingSlugs);
  } else if (isActive && parentSlug) {
    onRowClick = () => toggle(parentSlug);
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
