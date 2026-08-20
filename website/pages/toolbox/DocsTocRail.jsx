import React, { useEffect, useMemo, useState } from 'react';

// In-page TOC rail. Walks the page AST, collects H2 + H3 headings, and
// tracks the active one via IntersectionObserver on the rendered headings.
export default function DocsTocRail({ ast, scrollContainerRef }) {
  const headings = useMemo(() => collectHeadings(ast, 2, 3), [ast]);
  const [active, setActive] = useState(headings[0]?.id || null);

  useEffect(() => {
    if (!headings.length) return;
    const root = scrollContainerRef?.current || null;
    const els = headings
      .map((h) => document.getElementById(h.id))
      .filter(Boolean);
    if (!els.length) return;

    // Track which headings are above the viewport top; the last such heading
    // is "active". IntersectionObserver with rootMargin gives us the
    // "crossed the top fold" signal.
    const visible = new Set();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        // Pick the first-visible heading, or the last one scrolled past.
        const firstVisible = headings.find((h) => visible.has(h.id));
        if (firstVisible) { setActive(firstVisible.id); return; }
        // No heading visible: fall back to the one most recently above the top.
        let lastAbove = null;
        for (const h of headings) {
          const el = document.getElementById(h.id);
          if (!el) continue;
          const rect = el.getBoundingClientRect();
          const top = root ? rect.top - root.getBoundingClientRect().top : rect.top;
          if (top < 120) lastAbove = h.id;
        }
        if (lastAbove) setActive(lastAbove);
      },
      { root, rootMargin: '-100px 0px -60% 0px', threshold: 0 },
    );
    for (const el of els) io.observe(el);
    return () => io.disconnect();
  }, [headings, scrollContainerRef]);

  if (!headings.length) return null;

  const handleClick = (e, id) => {
    e.preventDefault();
    const container = scrollContainerRef?.current;
    const el = document.getElementById(id);
    if (!container || !el) return;
    const navbarOffset = 96;
    const containerTop = container.getBoundingClientRect().top;
    const elTop = el.getBoundingClientRect().top;
    const top = elTop - containerTop + container.scrollTop - navbarOffset;
    container.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <nav className="docs-toc" aria-label="On this page">
      <ul>
        {headings.map((h) => (
          <li key={h.id} className={`docs-toc-d${h.depth} ${active === h.id ? 'is-active' : ''}`}>
            <a href={`#${h.id}`} onClick={(e) => handleClick(e, h.id)}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function collectHeadings(node, minDepth, maxDepth, out = []) {
  if (!node) return out;
  if (node.type === 'heading' && node.depth >= minDepth && node.depth <= maxDepth && node.id) {
    out.push({ id: node.id, depth: node.depth, text: headingText(node) });
  }
  for (const c of node.children || []) collectHeadings(c, minDepth, maxDepth, out);
  return out;
}

function headingText(node) {
  if (!node) return '';
  if (typeof node.value === 'string') return node.value;
  return (node.children || []).map(headingText).join('');
}
