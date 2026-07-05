import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useScrollSpy from '../../hooks/useScrollSpy';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';
import { useTransitionState } from '../../contexts/TransitionContext';
import { renderMarkdown } from '../../utils/renderMarkdown';
import { useBackdropTarget } from '../../backdrop/useBackdrop';
import { BLOG_DECK, blogIdxForSection } from '../../backdrop/decks';

/**
 * BlogPage — shared layout for /neoflix and /publications.
 *
 * Native React rebuild of frmrduplicate's blog-style page. Content stays
 * in each page's `data/*Page.js` file (unchanged markdown strings); this
 * component auto-detects publications-style metadata (bold link +
 * italic citation + `---`) and renders those as structured cards while
 * falling through to plain markdown for everything else.
 *
 * The backdrop isn't rendered here — it lives at BackdropProvider level
 * so it persists across transitions between the two blog routes and
 * only the foreground slides horizontally. This component publishes a
 * single target ('blog') whose topIdx tracks the active scroll-spy
 * section. When no section is resolved the target is null and the
 * backdrop's BlogBackdrop fades the cell out.
 */
// Two-column blog stagger. The outer RouteSlider already slides the
// whole page; this adds an internal translateX on just one of the two
// columns so they arrive at different times. Matches the old VT-era
// choreography:
//   direction > 0 (new from right) → sidebar leads, article trails
//   direction < 0 (new from left)  → article leads, sidebar trails
// The leader rides the outer slide without extra motion; the trailer
// gets an additional inner slide from STAGGER_OFFSET → 0, delayed so
// it lands after the outer slide settles.
const STAGGER_OFFSET = '40%';
const STAGGER_DELAY = 0.25;
const STAGGER_DURATION = 0.5;
const STAGGER_EASE = [0.4, 0, 0.2, 1];

export default function BlogPage({ sections, scrollTo }) {
  // Internal scroll container. BlogPage renders inside RouteSlider,
  // which is `position: fixed; inset: 0` — window never scrolls under
  // that layout, so the page scrolls on this inner element instead.
  const scrollRef = useRef(null);

  // Capture the slide direction at mount. BlogPage is keyed by
  // pathname in AnimatePresence, so a fresh mount = a fresh arrival;
  // the direction at that instant is the one that staged this entry.
  // Reading directly from context on every render would let a later
  // navigation (which mutates context direction before the next
  // transition starts) retroactively change our stagger half-way.
  const { direction } = useTransitionState();
  const [entryDir] = useState(direction);
  const sidebarTrails = entryDir < 0;
  const articleTrails = entryDir > 0;

  // Synchronously place the internal scroll container at the right spot
  // on mount and whenever the route's `scrollTo` changes. useLayoutEffect
  // fires before paint so the page renders already at the target — no
  // retained scroll from the previous page bleeding through.
  //
  // Target resolution:
  //   1. `scrollTo` prop (route-configured, e.g. /contact → "contact")
  //   2. URL hash on mount (direct visits like /neoflix#collab)
  //   3. Otherwise top of page
  //
  // Defaulting to 0 (rather than leaving scroll alone) is the fix for
  // "/publications' midway scroll leaking into /neoflix": each blog
  // route mounts fresh at its intended anchor.
  //
  // behavior: 'instant' is explicit; 'auto' defers to CSS scroll-behavior
  // and can silently smooth-animate, which is the exact diagonal motion
  // this effect exists to prevent. Placed before useScrollSpy so the
  // spy's initial calc() reads the post-scroll rects and picks the
  // correct active section first try.
  //
  // Intentionally not depending on `location.hash`: the sidebar updates
  // the hash via history.replaceState as the user scrolls, and we don't
  // want that to yank the viewport back to the anchor.
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const hashId = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    const targetId = scrollTo || hashId;
    let top = 0;
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        const navbarOffset = 96;
        const containerTop = container.getBoundingClientRect().top;
        const elTop = el.getBoundingClientRect().top;
        top = elTop - containerTop + container.scrollTop - navbarOffset;
      }
    }
    container.scrollTo({ top, behavior: 'instant' });
  }, [scrollTo]);

  const sectionIds = sections.map((s) => s.id);
  const active = useScrollSpy(sectionIds, 120, scrollRef);
  const [hovered, setHovered] = useState(null);

  const activeIdx = blogIdxForSection(active);
  useBackdropTarget(
    'blog',
    activeIdx >= 0 ? { kind: 'video', deck: BLOG_DECK, topIdx: activeIdx } : null
  );

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevH = html.style.backgroundColor;
    const prevB = body.style.backgroundColor;
    html.style.backgroundColor = 'var(--cool-page)';
    body.style.backgroundColor = 'var(--cool-page)';
    return () => {
      html.style.backgroundColor = prevH;
      body.style.backgroundColor = prevB;
    };
  }, []);

  // Intercept clicks on internal toolbox/article links inside the
  // markdown body so they route through the direction-aware slide
  // instead of triggering a full page reload. renderMarkdown tags
  // every internal `/toolbox/...` and `/neoflix/...` anchor with
  // `data-internal="true"` for exactly this handler.
  const transitionNavigate = useTransitionNavigate();
  const handleBodyClick = useCallback((e) => {
    const link = e.target.closest('a[data-internal]');
    if (!link) return;
    e.preventDefault();
    transitionNavigate(link.getAttribute('href'));
  }, [transitionNavigate]);

  const handleSidebarClick = (id) => {
    const container = scrollRef.current;
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
    <div
      ref={scrollRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: 1480,
          margin: '0 auto',
          padding: '104px 24px 120px',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 284px) minmax(0, 900px)',
          columnGap: 46,
          alignItems: 'start',
        }}
        className="blog-grid"
      >
        {/* Sticky sidebar. Tagged with data-blog-sidebar for styling
            hooks; slides as part of the page's RouteSlider wrapper,
            plus an optional inner translate when it trails. */}
        <motion.aside
          data-blog-sidebar="true"
          initial={sidebarTrails ? { x: `-${STAGGER_OFFSET}` } : false}
          animate={sidebarTrails ? { x: 0 } : undefined}
          transition={sidebarTrails ? { duration: STAGGER_DURATION, delay: STAGGER_DELAY, ease: STAGGER_EASE } : undefined}
          style={{
            position: 'sticky',
            top: 104,
            backgroundColor: '#0e1c31',
            border: '1px solid var(--edge-1d)',
            borderRadius: 12,
            padding: '56px 22px',
            color: '#f5f9fc',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 'min(620px, calc(100vh - 148px))',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            {sections.map((s, idx) => {
              const isActive = s.id === active;
              const isHovered = hovered === s.id;
              const markerWidth = isActive ? 26 : isHovered ? 14 : 4;
              const markerColor = isActive
                ? '#ffffff'
                : isHovered
                ? '#c4ccd6'
                : '#666f7c';
              const textColor = isActive
                ? '#ffffff'
                : isHovered
                ? '#c4ccd6'
                : '#666f7c';
              // Intro divider: render below the first item only when
              // it's unnumbered and the next item IS numbered (e.g.
              // "Preface" → "1. Narrative Review"). The /neoflix index
              // has no numbering, so it doesn't get this divider.
              const { numberPart: myNumber } = splitHeading(s.title);
              const nextNumber = sections[idx + 1]
                ? splitHeading(sections[idx + 1].title).numberPart
                : '';
              const isIntro =
                idx === 0 && !myNumber && sections.length > 1 && !!nextNumber;
              // Divider above the Contact pin in the /neoflix index.
              const dividerAbove = s.id === 'contact' && idx > 0;
              return (
                <React.Fragment key={s.id}>
                  {dividerAbove && (
                    <li aria-hidden="true" style={{ listStyle: 'none', padding: '10px 0' }}>
                      <div
                        style={{
                          height: 1,
                          background: 'rgba(255, 255, 255, 0.1)',
                          margin: '0 8px',
                        }}
                      />
                    </li>
                  )}
                  <li>
                    <motion.button
                      type="button"
                      onClick={() => handleSidebarClick(s.id)}
                      onMouseEnter={() => setHovered(s.id)}
                      onMouseLeave={() => setHovered((h) => (h === s.id ? null : h))}
                      animate={{ color: textColor }}
                      transition={{ color: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 8px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: 14,
                        lineHeight: 1.4,
                        fontWeight: isActive ? 700 : isHovered ? 600 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        transition: 'font-weight 0.25s ease',
                      }}
                    >
                      <motion.span
                        aria-hidden="true"
                        animate={{ width: markerWidth, backgroundColor: markerColor }}
                        transition={{
                          width: { type: 'spring', stiffness: 320, damping: 26 },
                          backgroundColor: { duration: 0.3 },
                        }}
                        style={{
                          display: 'inline-block',
                          height: 2,
                          borderRadius: 1,
                          flexShrink: 0,
                        }}
                      />
                      <span>{s.title}</span>
                    </motion.button>
                  </li>
                  {isIntro && (
                    <li aria-hidden="true" style={{ listStyle: 'none', padding: '10px 0' }}>
                      <div
                        style={{
                          height: 1,
                          background: 'rgba(255, 255, 255, 0.1)',
                          margin: '0 8px',
                        }}
                      />
                    </li>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </motion.aside>

        {/* Content column */}
        <motion.article
          initial={articleTrails ? { x: STAGGER_OFFSET } : false}
          animate={articleTrails ? { x: 0 } : undefined}
          transition={articleTrails ? { duration: STAGGER_DURATION, delay: STAGGER_DELAY, ease: STAGGER_EASE } : undefined}
          style={{ display: 'flex', flexDirection: 'column', gap: 40 }}
        >
          {sections.map((section) => {
            const parsed = parseSectionContent(section.content || '', {
              video: section.video,
              videoAfterParagraph: section.videoAfterParagraph,
            });
            const { numberPart, titlePart } = splitHeading(section.title);
            const hasPublicationLead = Boolean(parsed.titleCard || parsed.citation);
            return (
              <section
                key={section.id}
                id={section.id}
                className={`blog-section${hasPublicationLead ? ' blog-section--with-publication' : ' blog-section--plain'}`}
                style={{
                  position: 'relative',
                  borderRadius: 0,
                  padding: 0,
                  scrollMarginTop: 96,
                  opacity: 1,
                  isolation: 'isolate',
                  overflow: 'visible',
                }}
              >
                <div className={`blog-section__lead${hasPublicationLead ? ' blog-section__lead--publication' : ' blog-section__lead--plain'}`}>
                  {hasPublicationLead && (
                    <div aria-hidden="true" className="blog-section__glass" />
                  )}
                  <div className="blog-section__header">
                    <h2
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: 14,
                        flexWrap: 'wrap',
                        color: '#f8fbff',
                        letterSpacing: 0,
                        lineHeight: 1.08,
                        textShadow: '0 2px 14px rgba(8, 17, 24, 0.24)',
                      }}
                    >
                      {numberPart && (
                        <span
                          style={{
                            fontWeight: 300,
                            fontSize: 42,
                            color: 'rgba(248, 251, 255, 0.72)',
                            fontVariantNumeric: 'tabular-nums',
                          }}
                        >
                          {numberPart}
                        </span>
                      )}
                      <span style={{ fontWeight: 740, fontSize: 38 }}>
                        {titlePart}
                      </span>
                    </h2>
                  </div>

                  {hasPublicationLead && (
                    <PublicationLead card={parsed.titleCard} citation={parsed.citation} />
                  )}
                </div>

                <div className="blog-section__content">
                  <div aria-hidden="true" className="blog-section__content-wash" />

                {parsed.bodyHtmlBefore && (
                  <div
                    className="blog-body"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: 1.8,
                      color: '#383437',
                      maxWidth: 620,
                      marginTop: hasPublicationLead ? 4 : 0,
                    }}
                    dangerouslySetInnerHTML={{ __html: parsed.bodyHtmlBefore }}
                    onClick={handleBodyClick}
                  />
                )}
                {section.video && (
                  <InlineVideo src={section.video} />
                )}
                {parsed.bodyHtmlAfter && (
                  <div
                    className="blog-body"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: 1.8,
                      color: '#383437',
                      maxWidth: 620,
                      marginTop: section.video ? 24 : (hasPublicationLead ? 12 : 0),
                    }}
                    dangerouslySetInnerHTML={{ __html: parsed.bodyHtmlAfter }}
                    onClick={handleBodyClick}
                  />
                )}
                </div>
              </section>
            );
          })}
          {/* Bottom scroll spacer: lets the last (possibly short) post
              scroll up far enough to align with the sticky sidebar top
              instead of getting pinned at the end of the scroll range. */}
          <div aria-hidden="true" style={{ minHeight: 'calc(100vh - 200px)' }} />
        </motion.article>
      </div>

      <style>{`
        .blog-section {
          z-index: 0;
        }
        .blog-section__lead {
          position: relative;
          z-index: 1;
          isolation: isolate;
          margin-bottom: 2px;
        }
        .blog-section__lead--publication {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-auto-rows: auto;
          align-items: start;
          padding-bottom: 64px;
        }
        .blog-section__glass {
          position: absolute;
          z-index: 0;
          top: -24px;
          right: 0;
          bottom: 18px;
          left: 0;
          pointer-events: none;
          background:
            linear-gradient(135deg, rgba(255, 255, 255, 0.34), rgba(245, 249, 252, 0.24) 48%, rgba(232, 244, 246, 0.2));
          border: 0;
          border-radius: 12px;
          box-shadow: 0 20px 54px rgba(17, 34, 65, 0.08);
          backdrop-filter: blur(20px) saturate(1.05);
          -webkit-backdrop-filter: blur(20px) saturate(1.05);
        }
        .blog-section__header {
          position: relative;
          z-index: 3;
          margin: 0 72px -1px 0;
          padding: 42px 54px 34px;
          background: transparent;
          border: 0;
          border-radius: 0;
          backdrop-filter: none;
          -webkit-backdrop-filter: none;
        }
        .blog-section--with-publication .blog-section__header {
          grid-column: 1 / 13;
          margin: 0;
          padding: 42px 54px 18px;
        }
        .blog-section--plain .blog-section__header {
          background:
            linear-gradient(to bottom, rgba(255, 255, 255, 0.22), rgba(255, 255, 255, 0.08));
          border: 1px solid rgba(255, 255, 255, 0.24);
          border-bottom-color: rgba(255, 255, 255, 0.14);
          border-radius: 8px 8px 0 0;
          backdrop-filter: blur(18px) saturate(1.08);
          -webkit-backdrop-filter: blur(18px) saturate(1.08);
        }
        .blog-section__content {
          position: relative;
          z-index: 2;
          padding: 44px 54px 88px;
          isolation: isolate;
          border-radius: 8px;
          overflow: hidden;
        }
        .blog-section--plain .blog-section__content {
          border-radius: 0 0 8px 8px;
        }
        .blog-section__content-wash {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          background: rgba(245, 249, 252, 0.9);
          mix-blend-mode: screen;
          border-radius: 8px;
        }
        .blog-section--plain .blog-section__content-wash {
          border-radius: 0 0 8px 8px;
        }
        .publication-lead {
          position: relative;
          z-index: 1;
          grid-column: 1 / -1;
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          max-width: none;
          margin: 6px 0 0;
          font-family: Inter, sans-serif;
        }
        .publication-lead__title {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto;
          align-items: end;
          gap: 22px;
          grid-column: 2 / 13;
          margin: 0;
          min-height: 126px;
          padding: 28px 32px 30px;
          max-width: none;
          color: #ffffff;
          background: #1d3767;
          border: 0;
          border-radius: 8px;
          box-shadow: 0 22px 44px rgba(17, 34, 65, 0.18);
          text-decoration: none;
        }
        .publication-lead__title:hover {
          color: #ffffff;
          background: #244575;
        }
        .publication-lead__title-text {
          display: block;
          font-size: 19px;
          font-weight: 760;
          line-height: 1.28;
          letter-spacing: 0;
        }
        .publication-lead__title svg {
          color: rgba(255, 255, 255, 0.82);
          margin-left: 0 !important;
        }
        .publication-lead__citation {
          display: block;
          grid-column: 2 / 8;
          margin: -18px 0 0;
          max-width: none;
          padding: 24px 28px 22px;
          background: rgba(245, 249, 252, 0.76);
          border: 0;
          border-radius: 8px;
          box-shadow: 0 16px 34px rgba(17, 34, 65, 0.09);
          color: rgba(56, 52, 55, 0.72);
          font-size: 14px;
          font-style: italic;
          font-weight: 500;
          line-height: 1.62;
        }
        @media (max-width: 900px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
            padding: 96px 16px 80px !important;
          }
          .blog-grid aside {
            position: static !important;
          }
          .blog-grid section.blog-section {
            padding: 0 !important;
          }
          .blog-section__glass {
            top: -14px;
            right: 0;
            bottom: -16px;
            left: 0;
            border-radius: 8px;
          }
          .blog-section__lead--publication {
            grid-template-columns: 1fr;
            padding-bottom: 28px;
          }
          .blog-section__header {
            margin: 0 20px -1px 0;
            padding: 32px 24px 28px;
          }
          .blog-section--with-publication .blog-section__header {
            grid-column: 1;
            margin: 0;
          }
          .blog-section__content {
            padding: 32px 24px 40px;
          }
          .publication-lead {
            grid-column: 1;
            grid-template-columns: 1fr;
            margin: 30px 20px 34px;
          }
          .publication-lead__title {
            grid-column: 1;
            min-height: 104px;
            padding: 22px 22px 26px;
          }
          .publication-lead__citation {
            grid-column: 1;
            margin-top: -10px;
            padding: 20px 20px 18px;
          }
        }
        .blog-body {
          position: relative;
          z-index: 1;
        }
        .blog-body p { margin: 0 0 1.35em 0; }
        .blog-body p:last-child { margin-bottom: 0; }
        .blog-body a { color: #529c9c; text-decoration: underline; text-underline-offset: 2px; transition: color 0.2s; }
        .blog-body a:hover { color: #48c1c4; }
        .blog-body strong { font-weight: 700; color: #383437; }
        .blog-body em { font-style: italic; }
        .blog-body h2 {
          font-weight: 700; color: #383437; font-size: 24px;
          letter-spacing: 0; line-height: 1.32;
          margin: 44px 0 18px;
        }
        .blog-body h3 {
          font-weight: 700; color: #383437; font-size: 20px;
          line-height: 1.4; margin: 36px 0 16px;
        }
        .blog-body ul, .blog-body ol { padding-left: 1.4em; margin: 0 0 1.35em; }
        .blog-body ul li { margin-bottom: 12px; }
        .blog-body ol li { margin-bottom: 12px; }
        .blog-body ul li::marker { color: #48c1c4; }
        .blog-body hr {
          border: 0; border-top: 1px solid rgba(56, 52, 55, 0.12);
          margin: 32px 0;
        }
      `}</style>
    </div>
  );
}

/* ── Publication lead ───────────────────────────────────────────────── */
function PublicationLead({ card, citation }) {
  return (
    <div className="publication-lead">
      {card && (
        <a
          className="publication-lead__title"
          href={card.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="publication-lead__title-text">
            {card.title}
          </span>
          <ExternalArrow />
        </a>
      )}
      {citation && (
        <cite className="publication-lead__citation">
          {citation}
        </cite>
      )}
    </div>
  );
}

function ExternalArrow() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        verticalAlign: '-1px',
        marginLeft: 8,
        opacity: 0.75,
      }}
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ── Heading split ──────────────────────────────────────────────────── */
function splitHeading(title) {
  if (!title) return { numberPart: '', titlePart: '' };
  const m = title.match(/^(\d+\.)\s+(.+)$/);
  if (m) return { numberPart: m[1], titlePart: m[2] };
  return { numberPart: '', titlePart: title };
}

/* ── Content parsing ────────────────────────────────────────────────── */
// Pattern at the top of a publications section:
//   **[Title](URL)**
//
//   *Citation line*
//
//   ---
//
//   Body markdown...
//
// If the pattern matches, pull the title + citation out as structured
// cards and render the body as markdown. Otherwise everything is body.
function parseSectionContent(content, opts = {}) {
  const { video, videoAfterParagraph } = opts;
  const match = content.match(
    /^\s*\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*\n+\*([^*][^\n]*?)\*\s*\n+---\s*\n+([\s\S]*)$/
  );
  let titleCard = null;
  let citation = null;
  let body = content;
  if (match) {
    const [, title, href, cite, b] = match;
    titleCard = { title: title.trim().replace(/\.$/, ''), href };
    citation = cite.trim();
    body = b;
  }

  if (video && Number.isFinite(videoAfterParagraph) && videoAfterParagraph > 0) {
    const paragraphs = body.split(/\n\s*\n+/);
    const split = Math.min(videoAfterParagraph, paragraphs.length);
    const before = paragraphs.slice(0, split).join('\n\n');
    const after = paragraphs.slice(split).join('\n\n');
    return {
      titleCard,
      citation,
      bodyHtmlBefore: renderMarkdown(before),
      bodyHtmlAfter: renderMarkdown(after),
    };
  }

  return {
    titleCard,
    citation,
    bodyHtmlBefore: renderMarkdown(body),
    bodyHtmlAfter: '',
  };
}

/* ── Inline illustrative video ──────────────────────────────────────── */
function InlineVideo({ src }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        });
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div style={{ maxWidth: 620, margin: '26px 0', borderRadius: 8, overflow: 'hidden', boxShadow: '0 4px 16px rgba(28,54,100,0.1)' }}>
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{ display: 'block', width: '100%', height: 'auto', aspectRatio: '3 / 2', objectFit: 'cover', background: '#000' }}
      />
    </div>
  );
}
