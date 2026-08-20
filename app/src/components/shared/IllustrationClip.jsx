import React, { useCallback, useEffect, useRef, useState } from 'react';
import { prefersReducedMedia, stillFor } from '../../utils/reducedMedia';

/**
 * A looping decorative clip, rendered as a real <video>.
 *
 * History — until 2026-08 this component (then "IllustrationCanvas")
 * decoded each clip in an off-DOM video element and blitted frames into
 * a <canvas>, to keep Chromium/Edge from hanging media UI (the in-frame
 * picture-in-picture button, Edge's address-bar "Enhance video" prompt)
 * on artwork that has no controls. The blit worked, but it moved video
 * presentation onto the main thread: every playing clip ran its own
 * requestAnimationFrame loop doing a texture copy per decoded frame —
 * with the home backdrop and both medical carousels mounted, up to
 * eight concurrent loops. A plain <video> composites on the GPU with
 * zero main-thread work per frame, which is why this went back.
 *
 * What still suppresses the media UI:
 * - `disablePictureInPicture` + `disableRemotePlayback` + controlslist
 *   remove the PiP button, casting, and download affordances
 *   (standards-based, works in Chromium/Firefox).
 * - `pointerEvents: none` means the element is never hovered, so
 *   hover-triggered overlays don't appear; callers re-enable pointer
 *   events on a wrapper when they need clicks.
 * - The one thing with no opt-out is Edge's address-bar "Enhance
 *   video" prompt for sub-720p clips. That is browser chrome outside
 *   the page; we accept it as the price of not blitting.
 *
 * Playback is deliberately relentless. Scripted play() on muted inline
 * video is allowed by every default policy, but stricter environments
 * (Safari in Low Power Mode, Brave's autoplay shield, "Auto-Play:
 * Never" site settings) reject it, and React never writes the `muted`
 * ATTRIBUTE some engines' heuristics look for. So this component:
 * writes muted/playsinline as real attributes, toggles the native
 * `autoplay` attribute with the `play` prop (the most privileged start
 * path), retries on canplay/loadeddata, and — if a policy still says
 * no — retries once on the visitor's first pointer/key/touch input,
 * which for a below-the-fold deck has effectively always happened.
 *
 * Contract (unchanged from the canvas version):
 * - `src` may be undefined to render the styled box without loading.
 * - `play` is owned by the caller (decode budget); a paused clip keeps
 *   showing its current frame, and a clip that never played is primed
 *   to show its first frame instead of a blank box.
 * - `onReady` fires once per src when a frame is showing or the clip
 *   failed — callers gate reveals on it either way.
 */

// Artwork, not media: the surface shouldn't select with a swipe, drag out
// of the page, long-press into a save sheet, or flash a tap highlight.
// Callers can still override any of it through `style`.
const SURFACE_STYLE = {
  userSelect: 'none',
  WebkitUserSelect: 'none',
  WebkitTouchCallout: 'none',
  WebkitUserDrag: 'none',
  WebkitTapHighlightColor: 'transparent',
  pointerEvents: 'none',
};

// Clips whose play() was policy-blocked, waiting for the first user
// gesture to try again. One shared document listener serves them all.
const pendingUnlocks = new Set();
let unlockArmed = false;
function armUnlockListener() {
  if (unlockArmed || typeof document === 'undefined') return;
  unlockArmed = true;
  const fire = () => {
    for (const retry of [...pendingUnlocks]) retry();
  };
  for (const type of ['pointerdown', 'keydown', 'touchend']) {
    document.addEventListener(type, fire, { capture: true, passive: true });
  }
}

export default function IllustrationClip({
  src,                     // clip URL, or undefined to load nothing yet
  play = false,            // caller owns the decode budget
  playbackRate = 1,
  preload = 'metadata',
  onReady,                 // first frame is up (or the clip failed) — once per src
  className,
  style,
  ...rest                  // spread onto the video (draggable, data-*)
}) {
  const videoRef = useRef(null);
  const playRef = useRef(play);
  const rateRef = useRef(playbackRate);
  const readyFiredRef = useRef(false);
  const onReadyRef = useRef(onReady);
  const unlockRef = useRef(null);
  onReadyRef.current = onReady;
  playRef.current = play;
  rateRef.current = playbackRate;

  const attemptPlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !playRef.current) return;
    // Assert the muted state right before asking — it is what every
    // autoplay policy checks, and belt-and-braces costs nothing.
    video.muted = true;
    try {
      video.playbackRate = rateRef.current;
    } catch {}
    const started = video.play();
    if (started && typeof started.catch === 'function') {
      started.catch(() => {
        if (playRef.current) pendingUnlocks.add(unlockRef.current);
      });
    }
  }, []);

  if (!unlockRef.current) {
    unlockRef.current = () => {
      pendingUnlocks.delete(unlockRef.current);
      attemptPlay();
    };
  }

  // The ref callback writes the attributes React won't: `muted` is
  // property-only in React DOM, and some engines' autoplay heuristics
  // read the attribute.
  const attachVideo = useCallback((el) => {
    videoRef.current = el;
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.setAttribute('muted', '');
  }, []);

  useEffect(() => {
    armUnlockListener();
    return () => {
      pendingUnlocks.delete(unlockRef.current);
    };
  }, []);

  // onReady is once-per-src; a new src starts a new wait.
  useEffect(() => {
    readyFiredRef.current = false;
  }, [src]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.playbackRate = playbackRate;
    } catch {}
  }, [playbackRate, src]);

  // Playback follows the `play` prop. The native `autoplay` attribute
  // is toggled with it so a clip whose data hasn't arrived yet starts
  // through the engine's own (most permissive) path the moment it can.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (play) {
      video.autoplay = true;
      attemptPlay();
    } else {
      video.autoplay = false;
      pendingUnlocks.delete(unlockRef.current);
      if (!video.paused) {
        try {
          video.pause();
        } catch {}
      }
    }
  }, [play, src, attemptPlay]);

  const fireReady = () => {
    if (readyFiredRef.current) return;
    readyFiredRef.current = true;
    onReadyRef.current?.();
  };

  // Reduced-media mode (prefers-reduced-motion / Save-Data / low-memory
  // device): stand a high-quality still in for the loop. Same box, same
  // styling, none of the decoders. Evaluated once per mount — these
  // signals don't change mid-visit in practice.
  const [reduced] = useState(prefersReducedMedia);
  const still = reduced ? stillFor(src) : null;
  if (still) {
    return (
      <img
        src={still}
        alt=""
        className={className}
        style={{ ...SURFACE_STYLE, ...style }}
        aria-hidden="true"
        draggable={false}
        // A cached image can be complete before onLoad binds.
        ref={(el) => {
          if (el && el.complete) fireReady();
        }}
        onLoad={fireReady}
        onError={fireReady}
        {...rest}
      />
    );
  }

  return (
    <video
      ref={attachVideo}
      className={className}
      style={{ ...SURFACE_STYLE, ...style }}
      src={src}
      muted
      loop
      playsInline
      preload={preload}
      controls={false}
      disablePictureInPicture
      disableRemotePlayback
      controlsList="nodownload nofullscreen noplaybackrate noremoteplayback"
      x-webkit-airplay="deny"
      aria-hidden="true"
      tabIndex={-1}
      draggable={false}
      onLoadedMetadata={(e) => {
        const video = e.currentTarget;
        // A clip that isn't playing has no frame to show until one is
        // decoded. Nudging the playhead off zero forces exactly one
        // decode, so a loaded-but-paused card shows artwork, not a hole.
        if (!playRef.current && video.currentTime === 0) {
          try {
            video.currentTime = Math.min(0.04, (video.duration || 1) / 4);
          } catch {}
        }
      }}
      onCanPlay={(e) => {
        if (playRef.current && e.currentTarget.paused) attemptPlay();
      }}
      onLoadedData={(e) => {
        if (playRef.current && e.currentTarget.paused) attemptPlay();
        fireReady();
      }}
      onError={fireReady}
      {...rest}
    />
  );
}
