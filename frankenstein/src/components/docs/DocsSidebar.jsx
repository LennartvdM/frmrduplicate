import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
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

export default function DocsSidebar({ sections, activeSlug }) {
  const initiallyOpen = useMemo(() => {
    const set = new Set();
    for (const section of sections) {
      collectAncestors(regroupPhaseMarkers(section.items), activeSlug, set);
    }
    return set;
  }, [sections, activeSlug]);

  const [open, setOpen] = useState(initiallyOpen);
  const toggle = (slug) => setOpen((prev) => {
    const next = new Set(prev);
    if (next.has(slug)) next.delete(slug); else next.add(slug);
    return next;
  });

  // Keep the sidebar open for the new active slug when it changes via nav click.
  useEffect(() => {
    setOpen((prev) => {
      const next = new Set(prev);
      for (const section of sections) {
        collectAncestors(regroupPhaseMarkers(section.items), activeSlug, next);
      }
      return next;
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

  // Animated update on active-slug / expand-collapse changes.
  useLayoutEffect(() => {
    updateHighlighter(true);
  }, [activeSlug, open, updateHighlighter]);

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

  return (
    <aside className="docs-sidebar" ref={sidebarRef}>
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
              <NavList items={remainingItems} activeSlug={activeSlug} depth={0} open={open} toggle={toggle} />
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function NavList({ items, activeSlug, depth, open, toggle }) {
  return (
    <ul className={`docs-nav-list docs-nav-depth-${depth}`}>
      {items.map((item, i) => {
        const isActive = item.slug === activeSlug;
        const hasChildren = item.children && item.children.length > 0;
        const isOpen = open.has(item.slug);
        return (
          <li key={i} className="docs-nav-item">
            <div className={`docs-nav-row${isActive ? ' is-active' : ''}`}>
              <DocsLink href={`/toolbox/${item.slug}`} internal>
                <span className="docs-nav-label">{item.title}</span>
              </DocsLink>
              {hasChildren && (
                <button
                  type="button"
                  aria-label={isOpen ? 'Collapse' : 'Expand'}
                  aria-expanded={isOpen}
                  className={`docs-nav-chevron${isOpen ? ' is-open' : ''}`}
                  onClick={() => toggle(item.slug)}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                    <path d="M3 1 L7 5 L3 9" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              )}
            </div>
            {hasChildren && isOpen && (
              <NavList items={item.children} activeSlug={activeSlug} depth={depth + 1} open={open} toggle={toggle} />
            )}
          </li>
        );
      })}
    </ul>
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
