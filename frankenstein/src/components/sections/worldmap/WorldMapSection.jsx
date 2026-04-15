import React, { useContext, useEffect, useRef } from 'react';
import { assetUrl } from '../../../utils/assetUrl';
import { VideoBackdropContext } from '../../../context/VideoBackdropContext';

/**
 * Slide 4 mounts the ORIGINAL frmrduplicate MapComponent verbatim.
 *
 * Instead of reimplementing, this component dynamically imports the
 * bundled Framer chunks (copied into public/frmr-map/) and lets them
 * render MapComponent with their own bundled React 18 + Framer SDK.
 *
 * This is "ugly but faithful" by design (two React instances in the page,
 * ~790KB of extra runtime) — we accept the architectural weirdness so
 * the map behaves identically to /frmrduplicate/. A cleaner ground-up
 * rebuild lives in bashtest as future work.
 */
export default function WorldMapSection({ inView }) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  // World map has its own SVG-based background, so we clear the shared
  // video backdrop's target when this section is in view. Prevents the
  // previous medical section's blur video from lingering behind the map.
  const { setActiveVideoUrl } = useContext(VideoBackdropContext);
  useEffect(() => {
    if (inView) setActiveVideoUrl(null);
  }, [inView, setActiveVideoUrl]);

  useEffect(() => {
    if (!mountRef.current) return undefined;
    let cancelled = false;

    const bootstrapUrl = assetUrl('/frmr-map/bootstrap.mjs');
    import(/* @vite-ignore */ bootstrapUrl)
      .then((mod) => {
        if (cancelled || !mountRef.current) return;
        cleanupRef.current = mod.renderMapInto(mountRef.current);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[WorldMapSection] failed to boot frmrduplicate chunks', err);
      });

    return () => {
      cancelled = true;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{
        // Fallback background matches frmrduplicate while chunks are loading.
        background:
          'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
      }}
    />
  );
}
