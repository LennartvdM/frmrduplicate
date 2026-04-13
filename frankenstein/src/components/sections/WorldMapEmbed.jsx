import React, { useRef, useCallback } from 'react';

/**
 * World map section — iframes frmrduplicate's home page scrolled to
 * the map section. Uses the deobfuscated Framer version which has
 * working animations (auto-cycling city zooms with spring physics).
 *
 * The frmrduplicate home page's map section is section #4 (0-indexed).
 * We hide everything except the map by targeting the scroll position
 * and hiding the nav.
 */
export default function WorldMapEmbed() {
  const iframeRef = useRef(null);

  const onLoad = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      // Hide the Framer nav
      const nav = doc.querySelector('[data-framer-name="Nav"]');
      if (nav) nav.style.display = 'none';
      doc.querySelectorAll('[data-framer-name="navfiller"]').forEach(el => {
        el.style.display = 'none';
      });
    } catch {
      // Cross-origin — ignore
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="/neoflixexporttest/worldmapgit/"
      title="World Map"
      onLoad={onLoad}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block',
        background: '#1c3424',
      }}
    />
  );
}
