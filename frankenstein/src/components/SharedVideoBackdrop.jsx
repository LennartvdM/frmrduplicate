import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { UNIVERSAL_DECK_SOURCES } from '../config/videoBackdropRoutes';

/**
 * Full-bleed video backdrop — one single deck for the whole site.
 *
 * Always mounted at AppShell level; never unmounts on route change.
 * Every page that wants a video in its backdrop publishes the video's
 * URL via VideoBackdropContext. The deck-of-cards rule
 * (`visible iff idx >= targetIndex`, last card glued) crossfades
 * between targets; when no page publishes a URL the video layer fades
 * to 0 and only the #1c3424 camo fill is visible.
 *
 * Previously Home's medical sections and the blog routes each rendered
 * their own blur-video deck — during a route transition the viewport
 * would show both decks sliding side-by-side. Unifying here means
 * every video on the site flows through this single persistent layer,
 * so transitions are one continuous backdrop regardless of the route
 * pair involved.
 */
export default function SharedVideoBackdrop({ targetVideoUrl }) {
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

  const rawTargetIndex = targetVideoUrl
    ? UNIVERSAL_DECK_SOURCES.indexOf(targetVideoUrl)
    : -1;
  const hasTarget = rawTargetIndex >= 0;
  const targetIndex = hasTarget ? rawTargetIndex : 0;

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -1, backgroundColor: '#1c3424' }}
    >
      {/* Video layer — fades in when a page publishes a target, fades
          out when nothing is publishing (intro slide, toolbox). Only
          the #1c3424 camo fill on the parent shows when inactive. */}
      <motion.div
        ref={backdropRef}
        className="absolute inset-0"
        animate={{ opacity: hasTarget ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
      >
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
      </motion.div>
    </div>
  );
}
