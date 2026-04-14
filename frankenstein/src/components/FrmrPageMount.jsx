import React, { useEffect, useRef } from 'react';
import { assetUrl } from '../utils/assetUrl';

/**
 * Mounts a frmrduplicate page via its internal Framer routeId.
 *
 * Same "ugly but faithful" pattern as the worldmap: dynamically import
 * the Framer bootstrap and let it render the page using the same
 * getPageRoot machinery the real /frmrduplicate site uses — so the
 * page receives all three context providers (Site / Router /
 * PageTransitions) it expects, and internal hooks like useRoute /
 * useBreakpoint return real values.
 *
 * Props:
 *   routeId — the internal Framer route ID for the page to mount.
 *             'bzydBB85Y' → /neoflix
 *             'aLuYbVoBY' → /Publications
 *   cssFile — filename (under /public/frmr-pages/) of the page's SSR
 *             stylesheet. Framer's SSR HTML inlines this ~120 KB block
 *             and it isn't bundled in the .mjs chunks; without it the
 *             flex grid collapses. Loaded as a <link> while mounted
 *             and removed on unmount so the global resets inside don't
 *             bleed into other routes.
 */
export default function FrmrPageMount({ routeId, cssFile }) {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;
    let cancelled = false;
    let styleLink = null;

    const bootstrapUrl = assetUrl('/frmr-pages/bootstrap.mjs');

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
      styleLink.onerror = () => resolve();
      document.head.appendChild(styleLink);
    });

    ensureCss()
      .then(() => import(/* @vite-ignore */ bootstrapUrl))
      .then((mod) => {
        if (cancelled || !mountRef.current) return;
        return mod.mountFrmrPage(mountRef.current, routeId);
      })
      .then((cleanup) => {
        if (cancelled && cleanup) cleanup();
        else cleanupRef.current = cleanup;
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('[FrmrPageMount] failed to mount', routeId, err);
      });

    return () => {
      cancelled = true;
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
      if (styleLink && styleLink.parentNode) {
        styleLink.parentNode.removeChild(styleLink);
      }
    };
  }, [routeId, cssFile]);

  return <div ref={mountRef} className="frmr-mount" style={{ minHeight: '100vh', width: '100%' }} />;
}
