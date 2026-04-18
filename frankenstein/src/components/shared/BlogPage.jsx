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
    html.style.backgroundColor = '#f5f9fc';
    body.style.backgroundColor = '#f5f9fc';
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
          maxWidth: 1540,
          margin: '0 auto',
          padding: '96px 24px 120px',
          display: 'grid',
          gridTemplateColumns: 'minmax(220px, 300px) minmax(0, 960px)',
          columnGap: 40,
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
            top: 112,
            backgroundColor: '#0e1c31',
            borderRadius: 15,
            padding: '64px 22px',
            color: '#f5f9fc',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 'min(640px, calc(100vh - 160px))',
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
              // First item with no number (e.g. "Preface") is an intro —
              // give it a thin divider below so it's visually separated
              // from the numbered index that follows.
              const { numberPart: myNumber } = splitHeading(s.title);
              const isIntro = idx === 0 && !myNumber && sections.length > 1;
              return (
                <React.Fragment key={s.id}>
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
                        padding: '13px 6px',
                        border: 'none',
                        background: 'transparent',
                        fontSize: 15,
                        lineHeight: 1.45,
                        fontWeight: isActive ? 700 : isHovered ? 600 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
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
            const parsed = parseSectionContent(section.content || '');
            const { numberPart, titlePart } = splitHeading(section.title);
            return (
              <section
                key={section.id}
                id={section.id}
                style={{
                  position: 'relative',
                  borderRadius: 10,
                  padding: '96px 56px',
                  scrollMarginTop: 96,
                  opacity: 1,
                  isolation: 'isolate',
                }}
              >
                {/* Screen-blended backdrop — F5F9FC at 90%, blends with the
                    video deck below to a soft washed cream. Separate layer
                    so it doesn't affect text rendering on top. */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(245, 249, 252, 0.9)',
                    mixBlendMode: 'screen',
                    borderRadius: 10,
                    pointerEvents: 'none',
                    zIndex: -1,
                  }}
                />
                <h2
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    margin: 0,
                    marginBottom: 28,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 18,
                    flexWrap: 'wrap',
                    color: '#383437',
                    letterSpacing: '-1.5px',
                    lineHeight: 1.1,
                  }}
                >
                  {numberPart && (
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: 44,
                        color: 'rgba(56, 52, 55, 0.55)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {numberPart}
                    </span>
                  )}
                  <span style={{ fontWeight: 800, fontSize: 40 }}>
                    {titlePart}
                  </span>
                </h2>

                {parsed.titleCard && <TitleCard card={parsed.titleCard} />}
                {parsed.citation && <CitationCard text={parsed.citation} />}
                {parsed.bodyHtml && (
                  <div
                    className="blog-body"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: 1.9,
                      color: '#383437',
                      maxWidth: 600,
                      marginTop: parsed.titleCard || parsed.citation ? 12 : 0,
                    }}
                    dangerouslySetInnerHTML={{ __html: parsed.bodyHtml }}
                    onClick={handleBodyClick}
                  />
                )}
              </section>
            );
          })}
        </motion.article>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
            padding: 96px 16px 80px !important;
          }
          .blog-grid aside {
            position: static !important;
          }
          .blog-grid section {
            padding: 40px 24px !important;
          }
        }
        .blog-body p { margin: 0 0 1.35em 0; }
        .blog-body p:last-child { margin-bottom: 0; }
        .blog-body a { color: #529c9c; text-decoration: underline; text-underline-offset: 2px; transition: color 0.2s; }
        .blog-body a:hover { color: #72c2c2; }
        .blog-body strong { font-weight: 700; color: #383437; }
        .blog-body em { font-style: italic; }
        .blog-body h2 {
          font-weight: 700; color: #383437; font-size: 24px;
          letter-spacing: -0.5px; line-height: 1.35;
          margin: 44px 0 18px;
        }
        .blog-body h3 {
          font-weight: 700; color: #383437; font-size: 20px;
          line-height: 1.4; margin: 36px 0 16px;
        }
        .blog-body ul, .blog-body ol { padding-left: 1.4em; margin: 0 0 1.35em; }
        .blog-body ul li { margin-bottom: 12px; }
        .blog-body ol li { margin-bottom: 12px; }
        .blog-body ul li::marker { color: #72c2c2; }
        .blog-body hr {
          border: 0; border-top: 1px solid rgba(56, 52, 55, 0.12);
          margin: 32px 0;
        }
      `}</style>
    </div>
  );
}

/* ── Title card ─────────────────────────────────────────────────────── */
function TitleCard({ card }) {
  return (
    <a
      href={card.href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: 'block',
        backgroundColor: '#1c3664',
        borderRadius: 14,
        padding: '22px 26px',
        color: '#ffffff',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 18,
        maxWidth: 600,
        boxShadow: '0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow =
          '0 4px 12px rgba(28, 54, 100, 0.25), inset 0 0 0 1px rgba(255,255,255,0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 1px 2px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(255,255,255,0.04)';
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -36,
          top: -36,
          width: 140,
          height: 140,
          borderRadius: '50%',
          border: '1px solid rgba(114, 194, 194, 0.18)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: -8,
          bottom: -8,
          width: 70,
          height: 70,
          borderRadius: '50%',
          border: '1px solid rgba(114, 194, 194, 0.12)',
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          position: 'relative',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 600,
          fontSize: 15,
          lineHeight: 1.5,
          letterSpacing: '-0.1px',
          display: 'inline-block',
          paddingRight: 18,
        }}
      >
        {card.title}
        <ExternalArrow />
      </span>
    </a>
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

/* ── Citation card ──────────────────────────────────────────────────── */
function CitationCard({ text }) {
  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(245, 249, 252, 0.7)',
        borderRadius: 8,
        padding: '14px 18px 14px 22px',
        marginBottom: 18,
        maxWidth: 600,
        borderLeft: '3px solid #72c2c2',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontStyle: 'italic',
        fontSize: 14,
        lineHeight: 1.7,
        color: 'rgba(56, 52, 55, 0.75)',
      }}
    >
      {text}
    </div>
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
function parseSectionContent(content) {
  const match = content.match(
    /^\s*\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*\n+\*([^*][^\n]*?)\*\s*\n+---\s*\n+([\s\S]*)$/
  );
  if (match) {
    const [, title, href, citation, body] = match;
    return {
      titleCard: { title: title.trim().replace(/\.$/, ''), href },
      citation: citation.trim(),
      bodyHtml: renderMarkdown(body),
    };
  }
  return {
    titleCard: null,
    citation: null,
    bodyHtml: renderMarkdown(content),
  };
}
