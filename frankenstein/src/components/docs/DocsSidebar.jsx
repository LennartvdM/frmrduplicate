import React, { useMemo, useState } from 'react';
import DocsLink from './DocsLink';

// GitBook-style light sidebar. Items with children are collapsible via a
// chevron toggle; clicking the title navigates. Parents of the active slug
// are auto-expanded on load.
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
  React.useEffect(() => {
    setOpen((prev) => {
      const next = new Set(prev);
      for (const section of sections) collectAncestors(section.items, activeSlug, next);
      return next;
    });
  }, [activeSlug, sections]);

  return (
    <aside className="docs-sidebar">
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
