/**
 * Shared "blog layout" used by /neoflix and /publications.
 *
 * Visual design ports frmrduplicate's Publications page:
 *   - Dark-teal page background (#00333b)
 *   - Ambient video backdrop deck with 0.5x playback + crossfade
 *   - SidebarLayout with scroll-spy (left sidebar + outcropped section cards)
 *   - Inter 800 / 40px section headings, Inter 500 / 16px body
 *
 * Both pages pass their own `sections` + `sectionToVideo` + `deckSources`.
 * Styling is identical across the two routes — the only difference is
 * content, per the user's direction: "we're only taking the module".
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import SidebarLayout from './SidebarLayout';
import { renderMarkdown } from '../../utils/renderMarkdown';

export const BLOG_PAGE_STYLE = {
  backgroundColor: '#00333b',
  sidebarClassName: 'bg-[#1c3664]',
  sectionStyle: {
    background: 'rgba(245,249,252,0.8)',
  },
};

export default function BlogPage({
  sections,
  sectionToVideo,
  deckSources,
  autoScrollDelay = 3500,
  contentMaxWidth = '42rem',
}) {
  const [activeSection, setActiveSection] = useState(sections[0]?.id);
  const backdropRef = useRef(null);
  const [loadedSources, setLoadedSources] = useState(new Set());

  // Slow the video backdrop — ambient effect
  useEffect(() => {
    if (!backdropRef.current) return;
    backdropRef.current.querySelectorAll('video').forEach((vid) => {
      try {
        vid.playbackRate = 0.5;
        if (vid.paused) vid.play().catch(() => {});
      } catch {}
    });
  }, [loadedSources]);

  // Lock the html/body background while on this page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    html.style.backgroundColor = BLOG_PAGE_STYLE.backgroundColor;
    body.style.backgroundColor = BLOG_PAGE_STYLE.backgroundColor;
    return () => {
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  // Which video card is on top for the current active section
  const targetVideo = sectionToVideo?.[activeSection];
  const targetIndex = deckSources?.indexOf(targetVideo) ?? -1;

  // Soften text opacity briefly during video crossfade
  const [bgTransitioning, setBgTransitioning] = useState(false);
  const prevTargetIndex = useRef(targetIndex);
  useLayoutEffect(() => {
    if (targetIndex !== prevTargetIndex.current) {
      prevTargetIndex.current = targetIndex;
      setBgTransitioning(true);
      const timer = setTimeout(() => setBgTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [targetIndex]);

  const videoDeck = deckSources && deckSources.length > 0 ? (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, backgroundColor: BLOG_PAGE_STYLE.backgroundColor }}
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
  ) : null;

  const renderSection = (section) => {
    const displayContent = renderMarkdown(section.rawContent || section.content || '');
    return (
      <section
        key={section.id}
        id={section.id}
        className="sb-section-card"
        style={BLOG_PAGE_STYLE.sectionStyle}
      >
        <div
          style={
            bgTransitioning
              ? { opacity: 0.65, transition: 'opacity 0.15s ease-in' }
              : { opacity: 1, transition: 'opacity 0.12s ease-out' }
          }
        >
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 800,
              fontSize: '40px',
              color: '#383437',
              letterSpacing: '-1.5px',
              lineHeight: 1.2,
              marginBottom: '1.5rem',
            }}
          >
            {section.title}
          </h2>
          {displayContent && (
            <div
              className="publications-content"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                lineHeight: '2em',
                color: '#666666',
                maxWidth: contentMaxWidth,
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          )}
        </div>
      </section>
    );
  };

  const sectionsWithContent = sections.map((s) => ({ ...s, rawContent: s.content }));

  return (
    <SidebarLayout
      sections={sectionsWithContent}
      backgroundLayer={videoDeck}
      renderSection={renderSection}
      onActiveChange={setActiveSection}
      autoScrollDelay={autoScrollDelay}
      sidebarClassName={BLOG_PAGE_STYLE.sidebarClassName}
    />
  );
}
