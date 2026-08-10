import React, { useCallback, useEffect, useRef } from 'react';

/**
 * A looping clip painted into a <canvas> instead of mounted as a <video>.
 *
 * Why this exists — the moving illustrations on this site (the blur
 * backdrops, the inline clips inside the product sections) are artwork,
 * not media. Chromium-based browsers disagree: any <video> big enough to
 * look like content gets a media UI bolted on. Edge is the loudest about
 * it — hovering a clip pops the in-frame picture-in-picture button, and
 * a sub-720p clip also lights up "Enhance video" (video super
 * resolution) in the address bar. Both offer the reader controls for a
 * thing that has no controls: no sound, no timeline, 6 seconds long, on
 * a loop. That reads as broken, so we don't hand the browser a video
 * element at all.
 *
 * How — the clip is decoded by an HTMLVideoElement that is created in
 * JS and never inserted into the document, and each new frame is blitted
 * into a <canvas> that takes its place in the layout. A canvas is
 * pixels: no picture-in-picture, no enhance, no media context menu, no
 * cast target, nothing for a browser to attach an affordance to. There
 * is a standards-based opt-out for some of this
 * (`disablePictureInPicture`, `disableRemotePlayback`) and it is applied
 * to every clip that is still a real <video> elsewhere in the app — but
 * there is no opt-out at all for Edge's enhance prompt, so anywhere the
 * reader can actually reach a clip, this component is the answer.
 *
 * Cost — the canvas backing store is the clip's intrinsic size (the blur
 * loops are 720x426), so drawing is a 1:1 blit of ~0.3 MPix and CSS
 * object-fit does the scaling, exactly as the compositor did when this
 * was a <video>. Frames are pulled on requestAnimationFrame but only
 * painted when currentTime has moved, so a 30fps clip at 0.5x costs ~15
 * draws a second, not 60. The canvas keeps its last frame when playback
 * stops, which is what a paused <video> used to show.
 *
 * WebKit caveat — iOS/iPadOS refuse inline playback for a media element
 * outside the render tree. If nothing has painted shortly after playback
 * was asked for (and the clip hasn't simply failed to load), the source
 * element is parked in a 1x1 clipped host and retried; see
 * renderTreeHost below. Chromium and Firefox never take that path, so on
 * the browsers that impose the unwanted UI the page really does contain
 * zero video elements.
 */

// Grace periods before we assume the engine won't play outside the render
// tree. Once the clip reports it can play, a frame should follow almost
// at once, so that wait is short; the longer one is the backstop for an
// engine that won't even load off-DOM. Both are long enough that a slow
// first byte isn't mistaken for WebKit's restriction.
const READY_FALLBACK_MS = 800;
const RENDER_TREE_FALLBACK_MS = 2500;

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

let sourceHost = null;

/**
 * Shared 1x1 clipped host for the WebKit fallback above. Kept in the
 * render tree (WebKit ignores display:none / visibility:hidden media)
 * but pinned to a single near-transparent pixel, out of the tab order
 * and out of the hit-test, and still carrying every media-UI opt-out.
 */
function renderTreeHost() {
  if (sourceHost && sourceHost.isConnected) return sourceHost;
  sourceHost = document.createElement('div');
  sourceHost.setAttribute('aria-hidden', 'true');
  sourceHost.dataset.illustrationSources = '';
  Object.assign(sourceHost.style, {
    position: 'fixed',
    left: '0',
    top: '0',
    width: '1px',
    height: '1px',
    overflow: 'hidden',
    opacity: '0.01',
    pointerEvents: 'none',
    zIndex: '-1',
  });
  document.body.appendChild(sourceHost);
  return sourceHost;
}

export default function IllustrationCanvas({
  src,                     // clip URL, or undefined to load nothing yet
  play = false,            // caller owns the decode budget
  playbackRate = 1,
  preload = 'metadata',
  onReady,                 // first frame is up (or the clip failed) — once per src
  className,
  style,
  ...rest                  // spread onto the canvas (draggable, data-*)
}) {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const preloadRef = useRef(preload);
  const rateRef = useRef(playbackRate);
  const playRef = useRef(play);
  const onReadyRef = useRef(onReady);
  const jobRef = useRef({ raf: 0, watchdog: 0, lastPainted: -1, painted: false, attached: false, readyFired: false });

  onReadyRef.current = onReady;

  // Settled: something is on screen, or nothing ever will be. Callers gate
  // interaction on this, so it has to fire either way — and only once.
  const fireReady = useCallback(() => {
    const job = jobRef.current;
    if (job.readyFired) return;
    job.readyFired = true;
    onReadyRef.current?.();
  }, []);

  // Blit the currently decoded frame. Sizing the backing store to the
  // clip keeps this a straight copy; the element's CSS box does the rest.
  const paint = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return false;
    const w = video.videoWidth;
    const h = video.videoHeight;
    if (!w || !h || video.readyState < 2) return false;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;
    ctx.drawImage(video, 0, 0, w, h);
    const job = jobRef.current;
    job.lastPainted = video.currentTime;
    if (!job.painted) {
      // Chromium hands out an empty frame for a clip that has never
      // presented one, so the blit above can land nothing at all. A real
      // frame is opaque, so one alpha sample says whether pixels arrived.
      // Only read back until the first real frame — never per frame.
      try {
        job.painted = ctx.getImageData(0, 0, 1, 1).data[3] > 0;
      } catch {
        job.painted = true;
      }
      if (job.painted) fireReady();
    }
    return job.painted;
  }, [fireReady]);

  // Keep the live element in step with props that must not restart it.
  useEffect(() => {
    preloadRef.current = preload;
    if (videoRef.current) videoRef.current.preload = preload;
  }, [preload]);

  useEffect(() => {
    rateRef.current = playbackRate;
    if (videoRef.current) {
      try {
        videoRef.current.playbackRate = playbackRate;
      } catch {}
    }
  }, [playbackRate]);

  // The decoder. Created off-DOM, torn down with the src.
  useEffect(() => {
    if (!src) return undefined;

    const video = document.createElement('video');
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.autoplay = false;
    video.controls = false;
    video.playsInline = true;
    video.setAttribute('playsinline', '');
    video.setAttribute('aria-hidden', 'true');
    video.tabIndex = -1;
    // Only reachable on the WebKit fallback path, where this element does
    // land in the DOM — opt out of every media affordance anyway.
    video.disablePictureInPicture = true;
    video.disableRemotePlayback = true;
    video.setAttribute('controlslist', 'nodownload nofullscreen noplaybackrate noremoteplayback');
    video.setAttribute('x-webkit-airplay', 'deny');
    video.style.width = '1px';
    video.style.height = '1px';
    video.preload = preloadRef.current;
    video.src = src;
    videoRef.current = video;
    jobRef.current = { raf: 0, watchdog: 0, lastPainted: -1, painted: false, attached: false, readyFired: false };

    // A clip that has never played has no frame to hand out, so the blit
    // lands nothing. Nudging the playhead off zero forces exactly one
    // decode; the 'seeked' that follows paints it. Playing cards don't
    // need this — their frames arrive on their own.
    const primeStillFrame = () => {
      if (playRef.current || jobRef.current.painted) return;
      if (video.currentTime !== 0) return;
      try {
        video.currentTime = Math.min(0.04, (video.duration || 1) / 4);
      } catch {}
    };
    // Paint one frame as soon as there is one, so a card that is loaded
    // but not playing shows artwork rather than a hole — the same thing
    // a paused <video> did.
    const onFrame = () => {
      try {
        video.playbackRate = rateRef.current;
      } catch {}
      paint();
      primeStillFrame();
    };
    video.addEventListener('loadedmetadata', primeStillFrame);
    video.addEventListener('loadeddata', onFrame);
    video.addEventListener('seeked', onFrame);
    // A clip that can't load still has to release whatever the caller is
    // gating on it.
    video.addEventListener('error', fireReady);

    return () => {
      const job = jobRef.current;
      cancelAnimationFrame(job.raf);
      clearTimeout(job.watchdog);
      video.removeEventListener('loadedmetadata', primeStillFrame);
      video.removeEventListener('loadeddata', onFrame);
      video.removeEventListener('seeked', onFrame);
      video.removeEventListener('error', fireReady);
      try {
        video.pause();
      } catch {}
      if (video.parentNode) video.parentNode.removeChild(video);
      // Drop the source so the decoder and its buffers go away.
      video.removeAttribute('src');
      try {
        video.load();
      } catch {}
      videoRef.current = null;
    };
  }, [src, paint, fireReady]);

  // Playback + the paint loop.
  useEffect(() => {
    playRef.current = play;
    const video = videoRef.current;
    if (!video) return undefined;
    const job = jobRef.current;

    if (!play) {
      cancelAnimationFrame(job.raf);
      job.raf = 0;
      clearTimeout(job.watchdog);
      job.watchdog = 0;
      if (!video.paused) {
        try {
          video.pause();
        } catch {}
      }
      return undefined;
    }

    const tick = () => {
      job.raf = requestAnimationFrame(tick);
      const live = videoRef.current;
      // Nothing new decoded since the last blit — skip the copy.
      if (!live || live.currentTime === job.lastPainted) return;
      paint();
    };

    // Nothing has painted and we asked for playback a while ago: assume
    // this engine won't play a media element outside the render tree, park
    // the source in the 1x1 host and try again.
    const useRenderTree = () => {
      const live = videoRef.current;
      if (!live || job.painted || job.attached) return;
      // A load failure is not WebKit's render-tree rule — moving the
      // element into the DOM would not fix an unsupported codec.
      if (live.error) return;
      job.attached = true;
      renderTreeHost().appendChild(live);
      const retried = live.play();
      if (retried && typeof retried.catch === 'function') retried.catch(() => {});
    };
    // Data has arrived, so a frame is due; give it a beat, then fall back.
    const onCanPlay = () => {
      if (job.painted || job.attached) return;
      clearTimeout(job.watchdog);
      job.watchdog = setTimeout(useRenderTree, READY_FALLBACK_MS);
    };

    try {
      video.playbackRate = rateRef.current;
    } catch {}
    const started = video.play();
    if (started && typeof started.catch === 'function') started.catch(() => {});
    job.raf = requestAnimationFrame(tick);
    video.addEventListener('canplay', onCanPlay);
    job.watchdog = setTimeout(useRenderTree, RENDER_TREE_FALLBACK_MS);

    return () => {
      cancelAnimationFrame(job.raf);
      job.raf = 0;
      clearTimeout(job.watchdog);
      job.watchdog = 0;
      video.removeEventListener('canplay', onCanPlay);
    };
  }, [play, src, paint]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ ...SURFACE_STYLE, ...style }}
      aria-hidden="true"
      draggable={false}
      {...rest}
    />
  );
}
