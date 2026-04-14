import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import useScrollSpy from '../../hooks/useScrollSpy';
import { renderMarkdown } from '../../utils/renderMarkdown';

/**
 * BlogPage — shared layout for /neoflix and /publications.
 *
 * Native React rebuild of frmrduplicate's blog-style page. Content is
 * passed in as props so each route keeps its own `data/*Page.js` sections.
 *
 * Layout:
 *   - Fixed full-bleed video backdrop (0.5x playback, crossfades per
 *     active section) behind everything at z-index 0.
 *   - Centered 2-column grid: sticky sidebar (navy, 15 px radius) on the
 *     left, content column (cream translucent cards, 10 px radius) on
 *     the right. 1540 px max-width overall.
 *   - Scroll-spy drives the sidebar active state + the backdrop video.
 *
 * Visual tokens taken from frmrduplicate's neoflix.page.css:
 *   #f5f9fc   page background
 *   #1c3664   sidebar background
 *   #72c2c2   sidebar active accent (teal)
 *   #383437   heading text
 *   #111111   body text
 *   rgba(245,249,252,0.8)  content-card background
 */
export default function BlogPage({ sections, sectionToVideo, deckSources }) {
  const sectionIds = sections.map((s) => s.id);
  const active = useScrollSpy(sectionIds, 120);
  const [hovered, setHovered] = useState(null);
  const backdropRef = useRef(null);
  const [loadedSources, setLoadedSources] = useState(() => new Set());

  // Ambient 0.5x playback on every <video> in the backdrop.
  useEffect(() => {
    if (!backdropRef.current) return;
    backdropRef.current.querySelectorAll('video').forEach((v) => {
      try {
        v.playbackRate = 0.5;
        if (v.paused) v.play().catch(() => {});
      } catch {}
    });
  }, [loadedSources]);

  // Lock the html/body background while this page is mounted.
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

  // Which backdrop video matches the current active section.
  const targetVideo = sectionToVideo?.[active];
  const targetIndex = deckSources?.indexOf(targetVideo) ?? -1;

  // Soften content opacity briefly during video crossfade.
  const [bgTransitioning, setBgTransitioning] = useState(false);
  const prevTargetIndex = useRef(targetIndex);
  useLayoutEffect(() => {
    if (targetIndex !== prevTargetIndex.current) {
      prevTargetIndex.current = targetIndex;
      setBgTransitioning(true);
      const t = setTimeout(() => setBgTransitioning(false), 300);
      return () => clearTimeout(t);
    }
  }, [targetIndex]);

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
      {/* Fixed video backdrop */}
      {deckSources && deckSources.length > 0 && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 0, backgroundColor: '#f5f9fc' }}
        >
          <motion.div
            ref={backdropRef}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            {deckSources.map((src, idx) => {
              const isVisible = idx === targetIndex;
              return (
                <motion.video
                  key={src}
                  className="absolute inset-0 w-full h-full object-cover"
                  src={src}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload={isVisible ? 'auto' : 'metadata'}
                  initial={{ opacity: isVisible ? 1 : 0 }}
                  animate={{ opacity: isVisible ? 1 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                  style={{ transform: 'scale(1.06)', zIndex: idx }}
                  onLoadedData={(e) => {
                    e.target.playbackRate = 0.5;
                    if (isVisible) e.target.play().catch(() => {});
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
            backgroundColor: '#1c3664',
            borderRadius: 15,
            padding: '24px 18px',
            color: '#f5f9fc',
            fontFamily: 'Inter, sans-serif',
          }}
        >
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' }}>
            {sections.map((s, idx) => {
              const isActive = s.id === active;
              const isHovered = hovered === s.id;
              // Three states — marker grows from dot → mid-dash → long-dash.
              const markerWidth = isActive ? 26 : isHovered ? 14 : 4;
              const markerColor = isActive
                ? '#ffffff'
                : isHovered
                ? 'rgba(255, 255, 255, 0.8)'
                : 'rgba(255, 255, 255, 0.4)';
              const textColor = isActive
                ? '#ffffff'
                : isHovered
                ? 'rgba(255, 255, 255, 0.9)'
                : 'rgba(255, 255, 255, 0.55)';
              return (
                <li key={s.id}>
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
                      padding: '10px 6px',
                      border: 'none',
                      background: 'transparent',
                      fontSize: 15,
                      lineHeight: 1.4,
                      fontWeight: isActive ? 700 : isHovered ? 600 : 500,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                      transition: 'font-weight 0.25s ease',
                    }}
                  >
                    {/* Marker: 4 px dot → 14 px mid-dash → 26 px long-dash.
                        Spring physics means mid-transition states are visible
                        while multiple items animate through scroll. */}
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
                    <span>{idx === 0 ? s.title : `${idx}. ${s.title}`}</span>
                  </motion.button>
                </li>
              );
            })}
          </ul>
        </aside>

        {/* Content column */}
        <article style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
          {sections.map((section) => {
            const html = renderMarkdown(section.content || '');
            return (
              <section
                key={section.id}
                id={section.id}
                style={{
                  backgroundColor: 'rgba(245, 249, 252, 0.82)',
                  backdropFilter: 'blur(2px)',
                  WebkitBackdropFilter: 'blur(2px)',
                  borderRadius: 10,
                  padding: '80px 56px',
                  scrollMarginTop: 96,
                  opacity: bgTransitioning ? 0.7 : 1,
                  transition: 'opacity 0.25s ease',
                }}
              >
                <h2
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: 800,
                    fontSize: 40,
                    lineHeight: 1.15,
                    letterSpacing: '-1.5px',
                    color: '#383437',
                    margin: 0,
                    marginBottom: 24,
                  }}
                >
                  {section.title}
                </h2>
                {html && (
                  <div
                    className="blog-body"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: 500,
                      fontSize: 16,
                      lineHeight: 1.75,
                      color: '#111',
                      maxWidth: 600,
                    }}
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                )}
              </section>
            );
          })}
        </article>
      </div>

      {/* Mobile: stack sidebar above content */}
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
        .blog-body p { margin: 0 0 1em 0; }
        .blog-body p:last-child { margin-bottom: 0; }
        .blog-body a { color: #529c9c; text-decoration: underline; text-underline-offset: 2px; transition: color 0.2s; }
        .blog-body a:hover { color: #72c2c2; }
        .blog-body strong { font-weight: 700; color: #383437; }
        .blog-body em { font-style: italic; }
        .blog-body h2 {
          font-weight: 700; color: #383437; font-size: 24px;
          letter-spacing: -0.5px; line-height: 1.3;
          margin: 32px 0 14px;
        }
        .blog-body h3 {
          font-weight: 700; color: #383437; font-size: 20px;
          line-height: 1.35; margin: 28px 0 12px;
        }
        .blog-body ul, .blog-body ol { padding-left: 1.4em; margin: 0 0 1em; }
        .blog-body ul li { margin-bottom: 8px; }
        .blog-body ol li { margin-bottom: 8px; }
        .blog-body ul li::marker { color: #72c2c2; }
        .blog-body hr {
          border: 0; border-top: 1px solid rgba(0,0,0,0.1);
          margin: 24px 0;
        }
      `}</style>
    </div>
  );
}
