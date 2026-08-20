import React from 'react';
import { assetUrl } from '../../lib/utils/assetUrl';
import useDownloadGuard from '../../lib/hooks/useDownloadGuard';
import './publication-attachment.css';

/**
 * PublicationAttachment — the paper itself, attached to its section.
 *
 * The publications lead is a stack of offset plates: the navy title card
 * on top, the citation tucked under its left edge. This adds the third
 * plate — the PDF — tucked under the right edge, so the composition
 * reads as one document set rather than a card with labels.
 *
 * The metaphor is literal: a sheet sliding out from behind the title
 * card. `--sheet-tuck` is how far the sheet hides behind it; hovering
 * pulls it a little further out. Two stacked page edges peek from the
 * right so a multi-page article looks like one.
 *
 * Two targets, because "read it now" and "keep a copy" are different
 * intentions: the body opens the PDF in a new tab (browser viewer), the
 * trailing button downloads it. They are siblings rather than nested —
 * an <a> inside an <a> is invalid and breaks keyboard traversal.
 *
 * Data comes from each section's `pdf` field in data/publicationsPage.js.
 * A section without one renders nothing, which is how a section behaves
 * until its file lands.
 *
 * The `gutter` variant is the same paper in a different place: a round
 * glass button out on the dark background beside the article, hitting
 * the same file the card's download button does. It carries the single
 * down-arrow the card uses, where the bundle's sidebar button carries an
 * arrow onto a stack — one mark for this paper, another for all of them.
 */
export default function PublicationAttachment({ pdf, variant = 'blog', accentLabel, title }) {
  // Keyed by file, so this paper's card button and its gutter button
  // share one brake. Called before the early return because hooks must
  // run unconditionally; a missing key makes it inert.
  const guard = useDownloadGuard(pdf?.src);

  if (!pdf || !pdf.src) return null;

  const href = assetUrl(pdf.src);
  const meta = formatAttachmentMeta(pdf);
  const label = pdf.label || 'Read the full paper';
  const downloadLabel = `Download the PDF${pdf.size ? ` (${pdf.size})` : ''}`;

  if (variant === 'gutter') {
    // Named by its paper rather than "download this paper", because six
    // of these sit on the page and a screen reader would otherwise read
    // the same label six times with nothing to tell them apart.
    const described = title
      ? `Download “${title}” — ${meta.replace(/ · /g, ', ')}`
      : `Download this paper — ${meta.replace(/ · /g, ', ')}`;

    return (
      <div
        className={`publication-attachment publication-attachment--gutter${
          guard.cooling ? ' is-cooling' : ''
        }`}
      >
        <a
          className="publication-attachment__fab"
          href={href}
          download
          aria-disabled={guard.cooling || undefined}
          aria-label={guard.cooling ? waitLabel(guard.secondsLeft) : described}
          onClick={guard.onClick}
        >
          <DownloadArrow />
        </a>
        {/* Pinned open while cooling: a click that does nothing needs to
            say why, or it just reads as a broken button. */}
        <span className="publication-attachment__tip" aria-hidden="true">
          <span className="publication-attachment__tip-title">
            {guard.cooling ? 'Just a moment' : 'Download this paper'}
          </span>
          <span className="publication-attachment__tip-meta">
            {guard.cooling ? `Ready again in ${guard.secondsLeft}s` : meta}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className={`publication-attachment publication-attachment--${variant}`}>
      <span className="publication-attachment__stack" aria-hidden="true">
        <span className="publication-attachment__page publication-attachment__page--back" />
        <span className="publication-attachment__page publication-attachment__page--mid" />
      </span>

      <div className="publication-attachment__face">
        <a
          className="publication-attachment__open"
          href={href}
          type="application/pdf"
          target="_blank"
          rel="noopener noreferrer"
          title="Opens the PDF in a new tab"
        >
          <span className="publication-attachment__glyph" aria-hidden="true">
            <PdfSheet />
          </span>
          <span className="publication-attachment__text">
            <span className="publication-attachment__label">{label}</span>
            <span className="publication-attachment__meta">
              {accentLabel ? `${accentLabel} · ${meta}` : meta}
            </span>
          </span>
        </a>

        <a
          className={`publication-attachment__download${guard.cooling ? ' is-cooling' : ''}`}
          href={href}
          download
          aria-disabled={guard.cooling || undefined}
          aria-label={guard.cooling ? waitLabel(guard.secondsLeft) : downloadLabel}
          title={guard.cooling ? waitLabel(guard.secondsLeft) : downloadLabel}
          onClick={guard.onClick}
        >
          <DownloadArrow />
        </a>
      </div>
    </div>
  );
}

/**
 * Never "you already downloaded this" — the visitor may not have, and
 * being told otherwise about a file you haven't got is worse than the
 * extra request the message was trying to save.
 */
function waitLabel(seconds) {
  return `Download ready again in ${seconds} second${seconds === 1 ? '' : 's'}`;
}

/**
 * "PDF · 9 pages · 1.8 MB" — but only the parts we actually know, so a
 * publication added without a page count still reads as a sentence.
 */
export function formatAttachmentMeta(pdf = {}) {
  const parts = ['PDF'];
  if (Number.isFinite(pdf.pages) && pdf.pages > 0) {
    parts.push(`${pdf.pages} page${pdf.pages === 1 ? '' : 's'}`);
  }
  if (pdf.size) parts.push(pdf.size);
  return parts.join(' · ');
}

/* The glyph is a page with a turned corner and three text rules — drawn
   rather than lettered so it stays legible at 34px and doesn't repeat
   the word "PDF" that already sits in the meta line. */
function PdfSheet() {
  return (
    <svg viewBox="0 0 24 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M2 3.2A2.2 2.2 0 0 1 4.2 1h9.4L22 9.3v17.5a2.2 2.2 0 0 1-2.2 2.2H4.2A2.2 2.2 0 0 1 2 26.8V3.2Z"
        fill="currentColor"
        fillOpacity="0.14"
      />
      <path
        d="M13.6 1 22 9.3h-6.2a2.2 2.2 0 0 1-2.2-2.2V1Z"
        fill="currentColor"
        fillOpacity="0.38"
      />
      <path
        d="M2 3.2A2.2 2.2 0 0 1 4.2 1h9.4L22 9.3v17.5a2.2 2.2 0 0 1-2.2 2.2H4.2A2.2 2.2 0 0 1 2 26.8V3.2Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M7 15.5h10M7 19.5h10M7 23.5h6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DownloadArrow() {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M12 4v11m0 0 4.2-4.2M12 15l-4.2-4.2M5 19h14"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
