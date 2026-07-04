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

const SECTION_ACCENTS = [
  '#62c8c9',
  '#f3b45b',
  '#8ac6ff',
  '#79d39d',
  '#e6a1a8',
  '#c5bcff',
  '#f0d66a',
];

function sectionAccent(index) {
  return SECTION_ACCENTS[index % SECTION_ACCENTS.length];
}

function sectionIndexLabel(section, index) {
  const { numberPart } = splitHeading(section.title);
  if (numberPart) return numberPart.replace('.', '').padStart(2, '0');
  return String(index + 1).padStart(2, '0');
}

function pageLabelForSections(sections) {
  return sections.some((section) => splitHeading(section.title).numberPart)
    ? 'Articles'
    : 'Guide';
}

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
  const activeSectionIndex = Math.max(0, sections.findIndex((section) => section.id === active));
  const activeProgress = sections.length > 1
    ? (activeSectionIndex / (sections.length - 1)) * 100
    : 0;
  const pageLabel = pageLabelForSections(sections);
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
      className="blog-shell"
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
          maxWidth: 1660,
          margin: '0 auto',
          padding: '108px 28px 128px',
          display: 'grid',
          gridTemplateColumns: 'minmax(260px, 340px) minmax(0, 980px)',
          columnGap: 56,
          alignItems: 'start',
        }}
        className="blog-grid"
      >
        {/* Sticky sidebar. Tagged with data-blog-sidebar for styling
            hooks; slides as part of the page's RouteSlider wrapper,
            plus an optional inner translate when it trails. */}
        <motion.aside
          data-blog-sidebar="true"
          className="blog-sidebar"
          initial={sidebarTrails ? { x: `-${STAGGER_OFFSET}` } : false}
          animate={sidebarTrails ? { x: 0 } : undefined}
          transition={sidebarTrails ? { duration: STAGGER_DURATION, delay: STAGGER_DELAY, ease: STAGGER_EASE } : undefined}
          style={{
            position: 'sticky',
            top: 96,
            borderRadius: 8,
            padding: 22,
            color: '#f5f9fc',
            fontFamily: 'Inter, sans-serif',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            minHeight: 'min(680px, calc(100vh - 132px))',
            '--blog-active-progress': `${activeProgress}%`,
          }}
        >
          <div className="blog-sidebar__meta">
            <span>Neoflix</span>
            <strong>{pageLabel}</strong>
            <em>{String(activeSectionIndex + 1).padStart(2, '0')} / {String(sections.length).padStart(2, '0')}</em>
          </div>
          <div className="blog-sidebar__meter" aria-hidden="true">
            <motion.span
              animate={{ height: `${activeProgress}%`, backgroundColor: sectionAccent(activeSectionIndex) }}
              transition={{ height: { type: 'spring', stiffness: 240, damping: 30 }, backgroundColor: { duration: 0.25 } }}
            />
          </div>
          <ul className="blog-sidebar__list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {sections.map((s, idx) => {
              const isActive = s.id === active;
              const isHovered = hovered === s.id;
              const itemAccent = sectionAccent(idx);
              const { titlePart } = splitHeading(s.title);
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
                    <li aria-hidden="true" className="blog-sidebar__divider">
                      <div />
                    </li>
                  )}
                  <li>
                    <motion.button
                      type="button"
                      className={`blog-sidebar__button${isActive ? ' is-active' : ''}`}
                      onClick={() => handleSidebarClick(s.id)}
                      onMouseEnter={() => setHovered(s.id)}
                      onMouseLeave={() => setHovered((h) => (h === s.id ? null : h))}
                      animate={{ opacity: isActive ? 1 : isHovered ? 0.92 : 0.62 }}
                      transition={{ opacity: { duration: 0.26, ease: [0.4, 0, 0.2, 1] } }}
                      style={{
                        '--section-accent': itemAccent,
                      }}
                    >
                      <span className="blog-sidebar__index">{sectionIndexLabel(s, idx)}</span>
                      <span className="blog-sidebar__title">{titlePart}</span>
                    </motion.button>
                  </li>
                  {isIntro && (
                    <li aria-hidden="true" className="blog-sidebar__divider">
                      <div />
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
          {sections.map((section, sectionIndex) => {
            const parsed = parseSectionContent(section.content || '', {
              video: section.video,
              videoAfterParagraph: section.videoAfterParagraph,
            });
            const { numberPart, titlePart } = splitHeading(section.title);
            return (
              <section
                key={section.id}
                id={section.id}
                className="blog-section"
                style={{
                  '--section-accent': sectionAccent(sectionIndex),
                  position: 'relative',
                  borderRadius: 0,
                  padding: '96px 64px',
                  scrollMarginTop: 96,
                  opacity: 1,
                  isolation: 'isolate',
                }}
              >
                <div
                  aria-hidden="true"
                  className="blog-section__wash"
                  style={{
                    position: 'absolute',
                    inset: 0,
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
                    color: '#ffffff',
                    letterSpacing: 0,
                    lineHeight: 1.1,
                  }}
                >
                  {numberPart && (
                    <span
                      style={{
                        fontWeight: 300,
                        fontSize: 44,
                        color: 'var(--section-accent)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {numberPart}
                    </span>
                  )}
                  <span style={{ fontWeight: 700, fontSize: 40 }}>
                    {titlePart}
                  </span>
                </h2>

                {parsed.titleCard && <TitleCard card={parsed.titleCard} />}
                {parsed.citation && <CitationCard text={parsed.citation} />}
                {parsed.bodyHtmlBefore && (
                  <div
                    className="blog-body"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: 1.9,
                      color: 'rgba(247, 250, 248, 0.86)',
                      maxWidth: 690,
                      marginTop: parsed.titleCard || parsed.citation ? 12 : 0,
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
                      lineHeight: 1.9,
                      color: 'rgba(247, 250, 248, 0.86)',
                      maxWidth: 690,
                      marginTop: section.video ? 24 : (parsed.titleCard || parsed.citation ? 12 : 0),
                    }}
                    dangerouslySetInnerHTML={{ __html: parsed.bodyHtmlAfter }}
                    onClick={handleBodyClick}
                  />
                )}
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
        .blog-shell {
          background:
            radial-gradient(circle at 16% 12%, rgba(98, 200, 201, 0.16), transparent 32%),
            radial-gradient(circle at 90% 18%, rgba(197, 188, 255, 0.12), transparent 30%),
            #07110f;
        }

        .blog-sidebar {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background:
            linear-gradient(145deg, rgba(7, 17, 15, 0.74), rgba(14, 35, 42, 0.64)),
            rgba(7, 17, 15, 0.74);
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.26),
            inset 0 1px 0 rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(22px) saturate(1.18);
          -webkit-backdrop-filter: blur(22px) saturate(1.18);
        }

        .blog-sidebar::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 16% 10%, rgba(98, 200, 201, 0.22), transparent 32%),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.05), transparent 35%);
          pointer-events: none;
        }

        .blog-sidebar__meta {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 6px 12px;
          padding: 4px 4px 22px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.12);
        }

        .blog-sidebar__meta span {
          grid-column: 1 / -1;
          color: #62c8c9;
          font-size: 11px;
          font-weight: 820;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .blog-sidebar__meta strong {
          color: #ffffff;
          font-size: 24px;
          font-weight: 820;
          line-height: 1;
        }

        .blog-sidebar__meta em {
          align-self: end;
          color: rgba(247, 250, 248, 0.62);
          font-size: 12px;
          font-style: normal;
          font-weight: 720;
          font-variant-numeric: tabular-nums;
        }

        .blog-sidebar__meter {
          position: absolute;
          left: 22px;
          top: 116px;
          bottom: 24px;
          width: 2px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }

        .blog-sidebar__meter span {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          min-height: 16px;
          border-radius: inherit;
          box-shadow: 0 0 18px currentColor;
        }

        .blog-sidebar__list {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 22px 0 0 18px !important;
        }

        .blog-sidebar__button {
          position: relative;
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          width: 100%;
          min-height: 54px;
          padding: 9px 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: rgba(247, 250, 248, 0.82);
          cursor: pointer;
          text-align: left;
          transition: background 180ms ease, color 180ms ease;
        }

        .blog-sidebar__button::before {
          content: "";
          position: absolute;
          left: -18px;
          top: 50%;
          width: 10px;
          height: 10px;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          background: #07110f;
          transform: translate(-50%, -50%);
          transition: background 180ms ease, border-color 180ms ease, box-shadow 180ms ease;
        }

        .blog-sidebar__button:hover,
        .blog-sidebar__button.is-active {
          background:
            linear-gradient(135deg, color-mix(in srgb, var(--section-accent) 16%, transparent), transparent 55%),
            rgba(255, 255, 255, 0.07);
          color: #ffffff;
        }

        .blog-sidebar__button.is-active::before {
          border-color: var(--section-accent);
          background: var(--section-accent);
          box-shadow: 0 0 18px var(--section-accent);
        }

        .blog-sidebar__index {
          color: var(--section-accent);
          font-size: 12px;
          font-weight: 840;
          letter-spacing: 0.08em;
          font-variant-numeric: tabular-nums;
        }

        .blog-sidebar__title {
          min-width: 0;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.25;
        }

        .blog-sidebar__divider {
          padding: 9px 10px;
        }

        .blog-sidebar__divider div {
          height: 1px;
          background: rgba(255, 255, 255, 0.12);
        }

        .blog-section {
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.12);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .blog-section__wash {
          background:
            linear-gradient(to bottom, rgba(7, 17, 15, 0.5), rgba(16, 36, 43, 0.74) 42%, rgba(7, 17, 15, 0.88)),
            linear-gradient(135deg, color-mix(in srgb, var(--section-accent) 17%, transparent), rgba(17, 32, 56, 0.22));
          backdrop-filter: blur(20px) saturate(1.12);
          -webkit-backdrop-filter: blur(20px) saturate(1.12);
        }

        @media (max-width: 900px) {
          .blog-grid {
            grid-template-columns: 1fr !important;
            padding: 96px 16px 96px !important;
          }
          .blog-grid aside {
            position: static !important;
            min-height: auto !important;
          }
          .blog-grid section {
            padding: 40px 24px !important;
          }
        }
        .blog-body p { margin: 0 0 1.35em 0; }
        .blog-body p:last-child { margin-bottom: 0; }
        .blog-body a {
          color: var(--section-accent, #62c8c9);
          font-weight: 720;
          text-decoration: underline;
          text-underline-offset: 3px;
          transition: color 0.2s;
        }
        .blog-body a:hover { color: #ffffff; }
        .blog-body strong { font-weight: 760; color: #ffffff; }
        .blog-body em { color: rgba(247, 250, 248, 0.72); font-style: italic; }
        .blog-body h2 {
          font-weight: 800; color: #ffffff; font-size: 24px;
          letter-spacing: 0; line-height: 1.35;
          margin: 44px 0 18px;
        }
        .blog-body h3 {
          font-weight: 800; color: #ffffff; font-size: 20px;
          line-height: 1.4; margin: 36px 0 16px;
        }
        .blog-body ul, .blog-body ol { padding-left: 1.4em; margin: 0 0 1.35em; }
        .blog-body ul li { margin-bottom: 12px; }
        .blog-body ol li { margin-bottom: 12px; }
        .blog-body ul li::marker,
        .blog-body ol li::marker { color: var(--section-accent, #62c8c9); }
        .blog-body hr {
          border: 0; border-top: 1px solid rgba(255, 255, 255, 0.14);
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
        background:
          'linear-gradient(135deg, rgba(98, 200, 201, 0.14), rgba(255, 255, 255, 0.06))',
        border: '1px solid rgba(255, 255, 255, 0.16)',
        borderRadius: 8,
        padding: '24px 24px',
        color: '#ffffff',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 18,
        maxWidth: 690,
        boxShadow: '0 18px 42px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow =
          '0 22px 54px rgba(0,0,0,0.26), inset 0 1px 0 rgba(255,255,255,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow =
          '0 18px 42px rgba(0,0,0,0.18), inset 0 1px 0 rgba(255,255,255,0.08)';
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
          border: '1px solid rgba(72, 193, 196, 0.18)',
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
          border: '1px solid rgba(72, 193, 196, 0.12)',
          pointerEvents: 'none',
        }}
      />
      <span
        style={{
          position: 'relative',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 720,
          fontSize: 16,
          lineHeight: 1.5,
          letterSpacing: 0,
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
        background: 'rgba(255, 255, 255, 0.07)',
        borderRadius: 8,
        padding: '14px 18px 14px 22px',
        marginBottom: 18,
        maxWidth: 690,
        borderLeft: '3px solid #48c1c4',
        fontFamily: 'Inter, sans-serif',
        fontWeight: 500,
        fontStyle: 'italic',
        fontSize: 14,
        lineHeight: 1.7,
        color: 'rgba(247, 250, 248, 0.7)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
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
    <div
      style={{
        maxWidth: 690,
        margin: '28px 0',
        borderRadius: 8,
        overflow: 'hidden',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 18px 46px rgba(0,0,0,0.24)',
      }}
    >
      <video
        ref={ref}
        src={src}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        style={{
          display: 'block',
          width: '100%',
          height: 'auto',
          aspectRatio: '16 / 9',
          objectFit: 'cover',
          background: '#000',
          filter: 'saturate(0.92) contrast(1.03)',
        }}
      />
    </div>
  );
}
