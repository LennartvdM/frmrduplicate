import React, { useEffect, useRef } from 'react';
import { assetUrl } from '../../../utils/assetUrl';

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
export default function WorldMapSection() {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

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
