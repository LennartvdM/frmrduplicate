import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useScrollSpy from '../../hooks/useScrollSpy';
import { renderMarkdown } from '../../utils/renderMarkdown';

/**
 * BlogPage — shared layout for /neoflix and /publications.
 *
 * Native React rebuild of frmrduplicate's blog-style page. Content stays
 * in each page's `data/*Page.js` file (unchanged markdown strings); this
 * component auto-detects publications-style metadata (bold link +
 * italic citation + `---`) and renders those as structured cards while
 * falling through to plain markdown for everything else.
 */
export default function BlogPage({ sections, sectionToVideo, deckSources }) {
  const sectionIds = sections.map((s) => s.id);
  const active = useScrollSpy(sectionIds, 120);
  const [hovered, setHovered] = useState(null);
  const backdropRef = useRef(null);
  const [loadedSources, setLoadedSources] = useState(() => new Set());
  // Defer loading non-target videos by 500 ms so initial paint only
  // fetches the top card. Lifted from bashtest's MedicalCarousel.
  const [deckLoaded, setDeckLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDeckLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!backdropRef.current) return;
    backdropRef.current.querySelectorAll('video').forEach((v) => {
      try {
        v.playbackRate = 0.5;
        if (v.paused) v.play().catch(() => {});
      } catch {}
    });
  }, [loadedSources]);

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

  const targetVideo = sectionToVideo?.[active];
  const rawTargetIndex = deckSources?.indexOf(targetVideo) ?? -1;
  const targetIndex = rawTargetIndex >= 0 ? rawTargetIndex : 0;

  const handleSidebarClick = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const navbarOffset = 96;
    const top = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', backgroundColor: '#f5f9fc' }}>
      {/* Fixed video backdrop — stacked "deck of cards", NOT a crossfade.
          Opacity rule: card is visible if idx >= targetIndex. The last
          card is glued to the table (always opaque), so at any moment
          at least one full-opacity layer covers the frame. That's what
          prevents the mid-transition white flash an audio-style 50/50
          crossfade would produce.
          Container fills with a camo color (#1c3424, color-picked from
          the videos) so initial paint and any edge case reads as muted
          greenish brown instead of white. */}
      {deckSources && deckSources.length > 0 && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0, backgroundColor: '#1c3424' }}
        >
          <motion.div
            ref={backdropRef}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            {deckSources.map((src, idx) => {
              const isTarget = idx === targetIndex;
              const isVisible = idx >= targetIndex;
              const videoSrc = isTarget || deckLoaded ? src : undefined;
              return (
                <motion.video
                  key={src}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={videoSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={isTarget ? 'auto' : 'metadata'}
                  initial={{ opacity: isVisible ? 1 : 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{
                    transform: 'scale(1.06)',
                    // Higher idx = lower in the deck (glued to the table).
                    zIndex: deckSources.length - idx,
                  }}
                  onLoadedData={(e) => {
                    e.target.playbackRate = 0.5;
                    if (isTarget) e.target.play().catch(() => {});
                    setLoadedSources((prev) => new Set(prev).add(src));
                  }}
                />
              );
            })}
            <div className="absolute inset-0 bg-slate-900/20" />
          </motion.div>
        </div>
      )}

      {/* Foreground layout */}
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
        {/* Sticky sidebar */}
        <aside
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
        </aside>

        {/* Content column */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
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
                  />
                )}
              </section>
            );
          })}
        </article>
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
