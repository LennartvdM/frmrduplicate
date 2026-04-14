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
 *   chunkFile — filename of the page chunk under /public/frmr-pages/.
 *   cssFile   — filename of the page's SSR stylesheet under
 *               /public/frmr-pages/. This CSS normally lives inline in
 *               Framer's SSR HTML (~120 KB per page) and is NOT bundled
 *               into the .mjs chunks, so without it the layout
 *               collapses (sidebar + content stack on top of each other).
 *               We load it as a regular <link> while the mount is
 *               active and remove it on unmount so the global resets
 *               don't leak to other routes.
 */
export default function FrmrPageMount({ chunkFile, cssFile }) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;
    let cancelled = false;
    let styleLink = null;

    const bootstrapUrl = assetUrl('/frmr-pages/bootstrap.mjs');
    const pageUrl = assetUrl(`/frmr-pages/${chunkFile}`);

    const ensureCss = () => new Promise((resolve) => {
      if (!cssFile) return resolve();
      const cssUrl = assetUrl(`/frmr-pages/${cssFile}`);
      const existing = document.querySelector(`link[data-frmr-page="${cssFile}"]`);
      if (existing) { styleLink = existing; return resolve(); }
      styleLink = document.createElement('link');
      styleLink.rel = 'stylesheet';
      styleLink.href = cssUrl;
      styleLink.dataset.frmrPage = cssFile;
      styleLink.onload = () => resolve();
      styleLink.onerror = () => resolve(); // proceed even on failure
      document.head.appendChild(styleLink);
    });

    ensureCss()
      .then(() => import(/* @vite-ignore */ bootstrapUrl))
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
      // Remove the stylesheet so the Framer SSR resets don't bleed into
      // other routes (they target html/body/* globally).
      if (styleLink && styleLink.parentNode) {
        styleLink.parentNode.removeChild(styleLink);
      }
    };
  }, [chunkFile, cssFile]);

  // `.frmr-mount` is the hook for the CSS that hides the Framer navbar
  // shipped inside the chunk (see index.css). Frankenstein's own Navbar
  // stays visible on these routes.
  return <div ref={mountRef} className="frmr-mount" style={{ minHeight: '100vh', width: '100%' }} />;
}
