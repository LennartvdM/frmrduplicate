import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import DocsLink from './DocsLink';

/**
 * Vragenlijst-style sidebar: a glassy "highlighter" pill slides behind
 * the active nav row with smooth top/height transitions, mirroring the
 * questionnaire's `.mobile-highlighter` treatment.
 *
 * Implementation: the highlighter is absolutely positioned inside the
 * sidebar's scroll container and its top/height are driven by an effect
 * keyed on `activeSlug`. The first position is applied without a
 * transition (so it lands on the active row on mount without sliding in
 * from 0); subsequent position changes animate via CSS.
 */
export default function DocsSidebar({ sections, activeSlug }) {
  const initiallyOpen = useMemo(() => {
    const set = new Set();
    for (const section of sections) collectAncestors(section.items, activeSlug, set);
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
      for (const section of sections) collectAncestors(section.items, activeSlug, next);
      return next;
    });
  }, [activeSlug, sections]);

  const sidebarRef = useRef(null);
  const highlighterRef = useRef(null);
  const hasPositioned = useRef(false);

  useLayoutEffect(() => {
    const sidebar = sidebarRef.current;
    const highlighter = highlighterRef.current;
    if (!sidebar || !highlighter) return;

    const activeRow = sidebar.querySelector('.docs-nav-row.is-active');
    if (!activeRow) {
      highlighter.classList.remove('is-visible');
      return;
    }

    // Position in the sidebar's scroll-coordinate space: offsetTop walks
    // up to .docs-sidebar without adding scrollTop, which is what we
    // want — the highlighter lives inside the scroll container and
    // scrolls with the content, so its position is relative to the
    // scrolled content, not the viewport.
    const top = offsetWithin(activeRow, sidebar);
    const height = activeRow.offsetHeight;

    if (!hasPositioned.current) {
      // First paint: land without a transition so the pill appears on
      // the active row instead of sliding in from top: 0.
      highlighter.style.transition = 'none';
      highlighter.style.top = `${top}px`;
      highlighter.style.height = `${height}px`;
      // Force a reflow before re-enabling transitions.
      void highlighter.offsetHeight;
      highlighter.style.transition = '';
      hasPositioned.current = true;
    } else {
      highlighter.style.top = `${top}px`;
      highlighter.style.height = `${height}px`;
    }
    highlighter.classList.add('is-visible');
  }, [activeSlug, open]);

  return (
    <aside className="docs-sidebar" ref={sidebarRef}>
      <div className="docs-sidebar-highlighter" ref={highlighterRef} aria-hidden="true" />
      {sections.map((section, i) => (
        <div key={i} className="docs-sidebar-section">
          <div className="docs-sidebar-heading">{section.title.toUpperCase()}</div>
          <NavList items={section.items} activeSlug={activeSlug} depth={0} open={open} toggle={toggle} />
        </div>
      ))}
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

// Walk offsetParents up to (but not past) the given ancestor so the
// returned top is in the ancestor's internal coordinate space.
function offsetWithin(el, ancestor) {
  let y = 0;
  let node = el;
  while (node && node !== ancestor) {
    y += node.offsetTop;
    node = node.offsetParent;
  }
  return y;
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
