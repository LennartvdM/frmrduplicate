import React, { useEffect, useRef } from 'react';
import { assetUrl } from '../utils/assetUrl';

/**
 * Mounts a frmrduplicate page chunk (neoflix / publications) verbatim.
 *
 * Same pattern as slide 4's worldmap: dynamically import the compiled
 * Framer chunk and render its default export via the bundled React. No
 * reimplementation — the page is literally the same module the user
 * saw running on /frmrduplicate, just mounted inside frankenstein.
 *
 * Props:
 *   chunkFile — filename (not URL) of the page chunk under
 *               /public/frmr-pages/. Resolved via assetUrl so it works
 *               under the /frankenstein/ base path on the combined deploy.
 */
export default function FrmrPageMount({ chunkFile }) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;
    let cancelled = false;

    const bootstrapUrl = assetUrl('/frmr-pages/bootstrap.mjs');
    const pageUrl = assetUrl(`/frmr-pages/${chunkFile}`);

    import(/* @vite-ignore */ bootstrapUrl)
      .then((mod) => {
        if (cancelled || !mountRef.current) return;
        return mod.mountFrmrPage(mountRef.current, pageUrl);
      })
      .then((cleanup) => {
        if (cancelled && cleanup) cleanup();
        else cleanupRef.current = cleanup;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[FrmrPageMount] failed to mount', chunkFile, err);
      });

    return () => {
      cancelled = true;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, [chunkFile]);

  return <div ref={mountRef} style={{ minHeight: '100vh', width: '100%' }} />;
}
