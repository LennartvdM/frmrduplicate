import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { breadcrumbFor, getPage, navSections, neighbors, pageMeta, resolveSlug } from '../data/docsIndex';
import DocsNode from '../components/docs/DocsNode';
import DocsLink from '../components/docs/DocsLink';
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsTocRail from '../components/docs/DocsTocRail';
import useTransitionNavigate from '../hooks/useTransitionNavigate';
import '../components/docs/docs.css';

export default function DocsPage() {
  const params = useParams();
  const location = useLocation();
  const raw = params['*'] ?? params.slug ?? '';
  const slug = resolveSlug(raw);
  const page = getPage(slug);

  const scrollRef = useRef(null);
  const transitionNavigate = useTransitionNavigate();

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
    html.style.backgroundColor = '#ffffff';
    body.style.backgroundColor = '#ffffff';
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
  const sectionCrumb = trail[0]?.title || null;

  if (!page) return <NotFound slug={raw} />;

  const sourcePath = page.meta?.source;

  return (
    <div ref={scrollRef} className="docs-scroll">
      <div className="docs-shell">
        <DocsSidebar sections={navSections} activeSlug={slug} />

        <main className="docs-main">
          <article className="docs-article">
            {sectionCrumb && (
              <div className="docs-section-crumb">{sectionCrumb.toUpperCase()}</div>
            )}
            <h1 className="docs-title">{page.title}</h1>
            {page.frontmatter?.description && (
              <p className="docs-description">{page.frontmatter.description}</p>
            )}

            <div className="docs-body" onClick={handleBodyClick}>
              <DocsNode node={page.ast} />
            </div>

            <footer className="docs-footer">
              <div className="docs-prev-next">
                <div>
                  {prev != null && (
                    <DocsLink href={`/toolbox/${prev}`} internal>
                      <span className="docs-pn-arrow">←</span>
                      <span className="docs-pn-label">Previous</span>
                      <span className="docs-pn-title">{pageMeta[prev]?.title || ''}</span>
                    </DocsLink>
                  )}
                </div>
                <div className="docs-pn-right">
                  {next != null && (
                    <DocsLink href={`/toolbox/${next}`} internal>
                      <span className="docs-pn-arrow">→</span>
                      <span className="docs-pn-label">Next</span>
                      <span className="docs-pn-title">{pageMeta[next]?.title || ''}</span>
                    </DocsLink>
                  )}
                </div>
              </div>
              {sourcePath && (
                <div className="docs-edit-link">
                  <a
                    href={`https://github.com/LennartvdM/NFLX-nieuwe-structuur/blob/main/${sourcePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Edit this page on GitHub
                  </a>
                </div>
              )}
            </footer>
          </article>

          <aside className="docs-rail">
            <DocsTocRail ast={page.ast} scrollContainerRef={scrollRef} />
          </aside>
        </main>
      </div>
    </div>
  );
}

function NotFound({ slug }) {
  const transitionNavigate = useTransitionNavigate();
  return (
    <div className="docs-not-found">
      <h1>Page not found</h1>
      <p>&ldquo;{slug}&rdquo; isn't part of the toolbox.</p>
      <a
        href="/toolbox"
        onClick={(e) => { e.preventDefault(); transitionNavigate('/toolbox'); }}
      >
        Back to the toolbox
      </a>
    </div>
  );
}
