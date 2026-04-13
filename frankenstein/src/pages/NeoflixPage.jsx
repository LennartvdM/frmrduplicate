/**
 * Neoflix product page — native React component.
 * Uses SidebarLayout with video backdrop and scroll-spy.
 * Content from neoflixexporttest, styling from frmrduplicate.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

import { SidebarLayout } from '../components/shared';
import { renderMarkdown } from '../utils/renderMarkdown';
import {
  sections as SECTIONS,
  sectionToVideo as SECTION_TO_VIDEO,
  deckSources as DECK_SOURCES,
  pageStyle,
} from '../data/neoflixPage';

const sectionsWithContent = SECTIONS.map((s) => ({
  ...s,
  rawContent: s.content,
}));

export default function NeoflixPage() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0]?.id);
  const backdropRef = useRef(null);
  const [loadedSources, setLoadedSources] = useState(new Set());

  // Slow down videos for ambient background
  useEffect(() => {
    if (!backdropRef.current) return;
    backdropRef.current.querySelectorAll('video').forEach((vid) => {
      try {
        vid.playbackRate = 0.5;
        if (vid.paused) vid.play().catch(() => {});
      } catch {}
    });
  }, [loadedSources]);

  // Set page background while on Neoflix
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlBg = html.style.backgroundColor;
    const prevBodyBg = body.style.backgroundColor;
    html.style.backgroundColor = pageStyle.backgroundColor;
    body.style.backgroundColor = pageStyle.backgroundColor;
    return () => {
      html.style.backgroundColor = prevHtmlBg;
      body.style.backgroundColor = prevBodyBg;
    };
  }, []);

  // Video deck: which card is on top based on active section
  const targetVideo = SECTION_TO_VIDEO[activeSection];
  const targetIndex = DECK_SOURCES.indexOf(targetVideo);

  // Soften text during video crossfade
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

  // Video deck backdrop
  const videoDeck = (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, backgroundColor: pageStyle.backgroundColor }}
    >
      <motion.div
        ref={backdropRef}
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.3 }}
      >
        {DECK_SOURCES.map((src, idx) => {
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
  );

  // Section renderer — frmrduplicate styling
  const renderSection = (section) => {
    const displayContent = renderMarkdown(section.rawContent || section.content || '');
    return (
      <section
        key={section.id}
        id={section.id}
        className="sb-section-card"
        style={pageStyle.sectionStyle}
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
              fontWeight: 900,
              fontSize: '40px',
              color: '#383437',
              letterSpacing: '-0.01em',
              marginBottom: '1.5rem',
            }}
          >
            {section.title}
          </h2>
          {displayContent && (
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 500,
                fontSize: '16px',
                color: '#666666',
                maxWidth: '28rem',
                whiteSpace: 'pre-wrap',
              }}
              dangerouslySetInnerHTML={{ __html: displayContent }}
            />
          )}
        </div>
      </section>
    );
  };

  return (
    <SidebarLayout
      sections={sectionsWithContent}
      backgroundLayer={videoDeck}
      renderSection={renderSection}
      onActiveChange={setActiveSection}
      autoScrollDelay={3500}
    />
  );
}
