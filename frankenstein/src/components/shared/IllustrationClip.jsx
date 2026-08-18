import React, { useEffect, useRef } from 'react';

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
  onReadyRef.current = onReady;
  playRef.current = play;
  rateRef.current = playbackRate;

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

  // Playback follows the `play` prop. The play() promise rejects when a
  // src is still loading or was swapped mid-call — harmless, so it is
  // swallowed; the loadeddata handler below starts playback late.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !src) return;
    if (play) {
      try {
        video.playbackRate = rateRef.current;
      } catch {}
      const started = video.play();
      if (started && typeof started.catch === 'function') started.catch(() => {});
    } else if (!video.paused) {
      try {
        video.pause();
      } catch {}
    }
  }, [play, src]);

  const fireReady = () => {
    if (readyFiredRef.current) return;
    readyFiredRef.current = true;
    onReadyRef.current?.();
  };

  return (
    <video
      ref={videoRef}
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
        video.defaultMuted = true;
        // A clip that isn't playing has no frame to show until one is
        // decoded. Nudging the playhead off zero forces exactly one
        // decode, so a loaded-but-paused card shows artwork, not a hole.
        if (!playRef.current && video.currentTime === 0) {
          try {
            video.currentTime = Math.min(0.04, (video.duration || 1) / 4);
          } catch {}
        }
      }}
      onLoadedData={(e) => {
        // Data arrived after the play effect ran (src was still loading
        // then) — start playback now if the caller wants it.
        if (playRef.current && e.currentTarget.paused) {
          const started = e.currentTarget.play();
          if (started && typeof started.catch === 'function') started.catch(() => {});
        }
        fireReady();
      }}
      onError={fireReady}
      {...rest}
    />
  );
}
