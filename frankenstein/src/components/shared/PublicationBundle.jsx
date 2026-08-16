import React from 'react';
import { assetUrl } from '../../utils/assetUrl';
import '../../styles/publication-bundle.css';

/**
 * PublicationBundle — take every paper at once.
 *
 * The per-section attachments answer "I want this one"; this answers "I
 * want the set", which is the reason someone lands on a publications
 * page in the first place. It renders in three places, all the same
 * object in different materials:
 *
 *   sidebar   a labelled row under the section index, in context
 *   floating  a round glass button parked in the page's right-hand
 *             gutter, following the reader down the page
 *   mobile    a full-width card closing out the phone article stack
 *
 * The floating button only appears above 1360px, which is where the
 * grid's tracks stop short of the viewport and leave real background to
 * sit on; below that it would overlap the article and the sidebar row
 * carries the job alone.
 *
 * Contents, count and size come from src/generated/publications-bundle.json,
 * written by scripts/build-publications-zip.mjs from whatever PDFs are in
 * public/papers/ — so a seventh paper updates the label by itself.
 */
export default function PublicationBundle({ bundle, variant = 'sidebar' }) {
  if (!bundle || !bundle.count || !bundle.file) return null;

  const papers = `${bundle.count} paper${bundle.count === 1 ? '' : 's'}`;
  const action = `Download all ${papers}`;
  const meta = `ZIP archive · ${bundle.size}`;
  // Spelled out for screen readers, since the visible label is split
  // across two lines and the tooltip never reaches them.
  const described = `${action} as one ZIP archive, ${bundle.size}`;
  const href = assetUrl(bundle.file);

  if (variant === 'floating') {
    return (
      <div className="publication-bundle publication-bundle--floating">
        <a
          className="publication-bundle__fab"
          href={href}
          download
          aria-label={described}
        >
          <ArchiveDownload />
        </a>
        <span className="publication-bundle__tip" aria-hidden="true">
          <span className="publication-bundle__tip-title">{action}</span>
          <span className="publication-bundle__tip-meta">{meta}</span>
        </span>
      </div>
    );
  }

  return (
    <a
      className={`publication-bundle publication-bundle--${variant}`}
      href={href}
      download
      aria-label={described}
    >
      <span className="publication-bundle__glyph" aria-hidden="true">
        <ArchiveDownload />
      </span>
      <span className="publication-bundle__text">
        <span className="publication-bundle__title">{action}</span>
        <span className="publication-bundle__meta">{meta}</span>
      </span>
    </a>
  );
}

/* An arrow coming down onto a stack rather than the single tray of the
   per-paper download, so the two actions don't wear the same mark. */
function ArchiveDownload() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 3v9.6m0 0 3.9-3.9M12 12.6l-3.9-3.9"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.6 17h14.8"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
      />
      <path
        d="M7.4 20.6h9.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        opacity="0.5"
      />
    </svg>
  );
}
