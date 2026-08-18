import React, { useCallback, useEffect, useLayoutEffect, useMemo, useReducer, useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { breadcrumbFor, getPage, hasPage, loadPage, navSections, neighbors, pageMeta, resolveSlug } from '../data/docsIndex';
import DocsNode from '../components/docs/DocsNode';
import DocsLink from '../components/docs/DocsLink';
import DocsSidebar from '../components/docs/DocsSidebar';
import DocsTocRail from '../components/docs/DocsTocRail';
import useTransitionNavigate from '../hooks/useTransitionNavigate';
import { useTabletLayout } from '../hooks/useTabletLayout';
import { useBackdropTarget } from '../backdrop/useBackdrop';
import { TOOLBOX_DECK, toolboxIdxForSlug } from '../backdrop/decks';
import '../components/docs/docs.css';

export default function DocsPage() {
  const params = useParams();
  const location = useLocation();
  const raw = params['*'] ?? params.slug ?? '';
  const slug = resolveSlug(raw);
  // Page ASTs are lazy chunks (see docsIndex.js). getPage reads the
  // cache; the effect below fetches on first visit and re-renders.
  const page = getPage(slug);
  const known = hasPage(slug);
  const [, rerender] = useReducer((n) => n + 1, 0);
  useEffect(() => {
    if (page || !known) return undefined;
    let live = true;
    loadPage(slug).then(() => {
      if (live) rerender();
    });
    return () => {
      live = false;
    };
  }, [slug, page, known]);

  const scrollRef = useRef(null);
  const transitionNavigate = useTransitionNavigate();

  // Map the current docs slug to a fixed index in the toolbox video
  // deck (slug-hash mod 6). Deterministic: same page, same video, every
  // visit — so the change-video cue reads as "you moved" and not as
  // random flicker between reloads.
  //
  // Phones skip the deck entirely: the docs layout covers the viewport
  // below 600px, so the six decoding videos behind it were pure cost.
  const { width } = useTabletLayout();
  const isPhone = width > 0 && width < 600;
  const toolboxTarget = useMemo(
    () =>
      isPhone
        ? null
        : {
            kind: 'video',
            deck: TOOLBOX_DECK,
            topIdx: toolboxIdxForSlug(slug),
          },
    [slug, isPhone]
  );
  useBackdropTarget('toolbox', toolboxTarget);

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

  const handleBodyClick = useCallback((e) => {
    const link = e.target.closest('a[data-internal]');
    if (!link) return;
    e.preventDefault();
    transitionNavigate(link.getAttribute('href'));
  }, [transitionNavigate]);

  const { prev, next } = useMemo(() => neighbors(slug), [slug]);
  const trail = useMemo(() => breadcrumbFor(slug), [slug]);
  const sectionCrumb = trail[0]?.title || null;

  if (!known) return <NotFound slug={raw} />;
  // Known page, chunk still in flight: hold the frame briefly rather
  // than flashing the not-found view. The docs shell (sidebar, rail)
  // needs the AST, so there is nothing partial worth painting yet.
  if (!page) return null;

  const sourcePath = page.meta?.source;
  const hrefForSection = (section) => {
    const slug = section.items?.[0]?.slug;
    return slug ? `/toolbox/${slug}` : '/toolbox';
  };

  return (
    <div ref={scrollRef} className="docs-scroll">
      <div className="docs-shell">
        <DocsSidebar sections={navSections} activeSlug={slug} />

        <nav className="docs-mobile-sections" aria-label="Toolbox sections">
          {navSections.map((section) => (
            <DocsLink key={section.title} href={hrefForSection(section)} internal>
              <span
                className={section.title === sectionCrumb ? 'is-active' : undefined}
              >
                {section.title}
              </span>
            </DocsLink>
          ))}
        </nav>

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
