import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { breadcrumbFor, getPage, navSections, neighbors, pageMeta, resolveSlug } from '../data/docsIndex';
import DocsNode from '../components/docs/DocsNode';
import DocsLink from '../components/docs/DocsLink';
import useViewTransition from '../hooks/useViewTransition';

const GITBOOK_EDIT_BASE = 'https://app.gitbook.com/s/';

export default function DocsPage() {
  const params = useParams();
  const location = useLocation();
  // React Router 6: the splat match lives at params['*']
  const raw = params['*'] ?? params.slug ?? '';
  const slug = resolveSlug(raw);
  const page = getPage(slug);

  const scrollRef = useRef(null);
  const transitionNavigate = useViewTransition();

  // Mount-time scroll: hash anchor → heading id, otherwise top.
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const hash = location.hash.slice(1);
    let top = 0;
    if (hash) {
      const el = container.querySelector(`#${CSS.escape(hash)}`);
      if (el) {
        const navbarOffset = 96;
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        top = elTop - containerTop + container.scrollTop - navbarOffset;
      }
    }
    container.scrollTo({ top, behavior: 'instant' });
  }, [slug, location.hash]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevH = html.style.backgroundColor;
    const prevB = body.style.backgroundColor;
    html.style.backgroundColor = '#f5f9fc';
    body.style.backgroundColor = '#f5f9fc';
    return () => {
      html.style.backgroundColor = prevH;
      body.style.backgroundColor = prevB;
    };
  }, []);

  const handleBodyClick = useCallback((e) => {
    const link = e.target.closest('a[data-internal]');
    if (!link) return;
    e.preventDefault();
    transitionNavigate(link.getAttribute('href'));
  }, [transitionNavigate]);

  const { prev, next } = useMemo(() => neighbors(slug), [slug]);
  const trail = useMemo(() => breadcrumbFor(slug), [slug]);

  if (!page) {
    return <NotFound slug={raw} />;
  }

  const sourcePath = page.meta?.source;

  return (
    <div
      ref={scrollRef}
      style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', background: '#f5f9fc' }}
    >
      <div
        style={{
          maxWidth: 1540,
          margin: '0 auto',
          padding: '96px 24px 120px',
          display: 'grid',
          gridTemplateColumns: 'minmax(240px, 300px) minmax(0, 880px)',
          columnGap: 40,
          alignItems: 'start',
        }}
      >
        <DocsSidebar activeSlug={slug} />

        <article className="docs-article" style={{ minWidth: 0 }}>
          {trail.length > 0 && (
            <nav aria-label="Breadcrumb" style={{ marginBottom: 18, fontSize: 13, color: '#5a6674' }}>
              {trail.map((step, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <span style={{ margin: '0 8px', color: '#aab3bd' }}>›</span>}
                  {step.slug != null && step.slug !== slug ? (
                    <DocsLink href={`/toolbox/${step.slug}`} internal>{step.title}</DocsLink>
                  ) : (
                    <span>{step.title}</span>
                  )}
                </React.Fragment>
              ))}
            </nav>
          )}

          <header style={{ marginBottom: 28 }}>
            <h1 style={{ margin: 0, fontSize: 36, fontWeight: 700, color: '#0e1c31', letterSpacing: '-0.5px' }}>
              {page.title}
            </h1>
            {page.frontmatter?.description && (
              <p style={{ marginTop: 8, fontSize: 16, color: '#5a6674' }}>{page.frontmatter.description}</p>
            )}
          </header>

          <div className="docs-body" onClick={handleBodyClick}>
            <DocsNode node={page.ast} />
          </div>

          <footer style={{ marginTop: 60, paddingTop: 28, borderTop: '1px solid #e4e8ee' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
              <div>
                {prev != null && (
                  <DocsLink href={`/toolbox/${prev}`} internal>
                    ← {pageMeta[prev]?.title || 'Previous'}
                  </DocsLink>
                )}
              </div>
              <div style={{ textAlign: 'right' }}>
                {next != null && (
                  <DocsLink href={`/toolbox/${next}`} internal>
                    {pageMeta[next]?.title || 'Next'} →
                  </DocsLink>
                )}
              </div>
            </div>
            {sourcePath && (
              <div style={{ marginTop: 20, fontSize: 12, color: '#8892a0' }}>
                <a
                  href={`https://github.com/LennartvdM/NFLX-nieuwe-structuur/blob/main/${sourcePath}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: '#5a6674' }}
                >
                  Edit this page on GitHub
                </a>
              </div>
            )}
          </footer>
        </article>
      </div>
    </div>
  );
}

function DocsSidebar({ activeSlug }) {
  return (
    <aside
      style={{
        position: 'sticky',
        top: 112,
        maxHeight: 'calc(100vh - 140px)',
        overflowY: 'auto',
        background: '#0e1c31',
        borderRadius: 15,
        padding: '28px 18px',
        color: '#f5f9fc',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {navSections.map((section, i) => (
        <div key={i} style={{ marginBottom: 20 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#8892a0',
              margin: '10px 6px 8px',
            }}
          >
            {section.title}
          </div>
          <NavList items={section.items} activeSlug={activeSlug} depth={0} />
        </div>
      ))}
    </aside>
  );
}

function NavList({ items, activeSlug, depth }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
      {items.map((item, i) => {
        const isActive = item.slug === activeSlug;
        return (
          <li key={i}>
            <DocsLink href={`/toolbox/${item.slug}`} internal>
              <span
                style={{
                  display: 'block',
                  padding: `6px ${6 + depth * 12}px`,
                  borderRadius: 6,
                  fontSize: depth === 0 ? 14 : 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#ffffff' : '#c4ccd6',
                  background: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                  textDecoration: 'none',
                  lineHeight: 1.4,
                }}
              >
                {item.title}
              </span>
            </DocsLink>
            {item.children && item.children.length > 0 && (
              <NavList items={item.children} activeSlug={activeSlug} depth={depth + 1} />
            )}
          </li>
        );
      })}
    </ul>
  );
}

function NotFound({ slug }) {
  const transitionNavigate = useViewTransition();
  return (
    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f9fc' }}>
      <div style={{ textAlign: 'center', padding: 32 }}>
        <h1 style={{ fontSize: 28, color: '#0e1c31', marginBottom: 12 }}>Page not found</h1>
        <p style={{ color: '#5a6674', marginBottom: 20 }}>
          &ldquo;{slug}&rdquo; isn't part of the toolbox.
        </p>
        <a
          href="/toolbox"
          onClick={(e) => { e.preventDefault(); transitionNavigate('/toolbox'); }}
          style={{ padding: '10px 18px', background: '#0e1c31', color: 'white', borderRadius: 8, textDecoration: 'none' }}
        >
          Back to the toolbox
        </a>
      </div>
    </div>
  );
}
