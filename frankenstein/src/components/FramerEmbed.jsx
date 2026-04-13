import React, { useRef, useCallback } from 'react';

/**
 * Embeds a frmrduplicate (Framer export) page in an iframe,
 * hiding its built-in navbar so only the Frankenstein navbar shows.
 *
 * Works because both sites are served from the same origin,
 * allowing contentDocument access.
 */
export default function FramerEmbed({ page, title }) {
  const iframeRef = useRef(null);

  const hideFramerNav = useCallback(() => {
    try {
      const doc = iframeRef.current?.contentDocument;
      if (!doc) return;

      // Hide the Framer nav bar and its filler elements
      const nav = doc.querySelector('[data-framer-name="Nav"]');
      if (nav) nav.style.display = 'none';

      doc.querySelectorAll('[data-framer-name="navfiller"]').forEach(el => {
        el.style.display = 'none';
      });
    } catch {
      // Cross-origin or not loaded — ignore
    }
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src={`/frmrduplicate/${page}`}
      title={title}
      onLoad={hideFramerNav}
      style={{
        width: '100%',
        height: 'calc(100vh - 60px)',
        marginTop: 60,
        border: 'none',
        display: 'block',
      }}
    />
  );
}
