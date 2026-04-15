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

  // Hide videos for 0.5 s after mount. Rationale:
  //
  // On a video ↔ non-video transition (e.g. /neoflix ↔ Home), the
  // viewport splits vertically for the duration of the slide: on one
  // side Home's medical sections paint a solid #1c3424 camo bg, on the
  // other the SharedVideoBackdrop is rendering actual videos. A solid
  // colour next to a blurry video looks like "two different video
  // backdrops side-by-side" even though one is just a fill.
  //
  // This delay makes the backdrop show only its #1c3424 container fill
  // during the slide — matching the #1c3424 Home paints — so both sides
  // of the viewport read as the same solid camo. Once the slide has
  // settled (500 ms ≈ slide's 450 ms + a tick) the videos fade in on
  // top of the already-visible camo.
  //
  // For /neoflix ↔ /publications ↔ /contact the component stays mounted
  // (same key in AnimatePresence, no remount), so this hook never
  // re-fires and the deck-of-cards crossfade keeps working unchanged.
  const [videosReady, setVideosReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVideosReady(true), 500);
    return () => clearTimeout(t);
  }, []);

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
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {/* Inner layer holds only the <video> elements — opacity controlled
          by `videosReady` so during the foreground slide (video ↔ non-
          video), only the #1c3424 camo fill on the parent is visible,
          matching what Home's medical sections paint on their half. */}
      <motion.div
        ref={backdropRef}
        className="absolute inset-0"
        animate={{ opacity: videosReady ? 1 : 0 }}
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
    </motion.div>
  );
}
