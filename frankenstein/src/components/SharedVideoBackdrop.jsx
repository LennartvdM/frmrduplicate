import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  UNIVERSAL_DECK_SOURCES,
  UNIVERSAL_SECTION_TO_VIDEO,
} from '../config/videoBackdropRoutes';

/**
 * Full-bleed video backdrop that persists across transitions between
 * any two video-backdrop routes (/neoflix, /publications, /contact).
 *
 * Same deck-of-cards pattern we use inside BlogPage — card visible iff
 * `idx >= targetIndex`, last card glued to the table as a camo fallback —
 * but lifted to AppShell so the foreground can slide horizontally
 * without dragging the backdrop along. When the route changes, only the
 * target video changes; the deck itself stays mounted and crossfades.
 *
 * When routing to a non-video page the whole component unmounts via
 * AppShell's <AnimatePresence>, fading out alongside the horizontal
 * foreground slide.
 */
export default function SharedVideoBackdrop({ activeSection }) {
  const backdropRef = useRef(null);
  const [loadedSources, setLoadedSources] = useState(() => new Set());
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

  const targetVideo = activeSection
    ? UNIVERSAL_SECTION_TO_VIDEO[activeSection]
    : undefined;
  const rawTargetIndex = UNIVERSAL_DECK_SOURCES.indexOf(targetVideo);
  const targetIndex = rawTargetIndex >= 0 ? rawTargetIndex : 0;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0, backgroundColor: '#1c3424' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      // Fast enter/exit (0.15s) so at the video ↔ non-video boundary
      // the backdrop doesn't coexist with the foreground slide long
      // enough to produce a moving-edge "horizontal shift" perception
      // between the cream Home bg and the video camo.
      transition={{ duration: 0.15, ease: 'easeOut' }}
    >
      <div ref={backdropRef} className="absolute inset-0">
        {UNIVERSAL_DECK_SOURCES.map((src, idx) => {
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
                zIndex: UNIVERSAL_DECK_SOURCES.length - idx,
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
      </div>
    </motion.div>
  );
}
