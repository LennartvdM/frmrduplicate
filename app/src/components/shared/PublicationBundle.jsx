import React from 'react';
import { assetUrl } from '../../utils/assetUrl';
import useDownloadGuard from '../../hooks/useDownloadGuard';
import '../../styles/publication-bundle.css';

/**
 * PublicationBundle — take every paper at once.
 *
 * The per-section attachments answer "I want this one"; this answers "I
 * want the set", which is the reason someone lands on a publications
 * page in the first place. It renders in two places, the same object in
 * two materials:
 *
 *   sidebar  a labelled row under the section index, in context
 *   mobile   a full-width card closing out the phone article stack
 *
 * The round button out in the gutter belongs to PublicationAttachment,
 * not here — it hands over the one paper it sits beside. Its arrow is a
 * single stroke where the glyph below is an arrow onto a stack, so the
 * two marks say "this paper" and "all of them".
 *
 * Contents, count and size come from src/generated/publications-bundle.json,
 * written by scripts/build-publications-zip.mjs from whatever PDFs are in
 * public/papers/ — so a seventh paper updates the label by itself.
 */
export default function PublicationBundle({ bundle, variant = 'sidebar' }) {
  // The archive is the heaviest thing on the site at 12MB, so it gets
  // the same soft brake the individual papers do. Hook first: it must
  // run unconditionally, and a missing key makes it inert.
  const guard = useDownloadGuard(bundle?.file);

  if (!bundle || !bundle.count || !bundle.file) return null;

  const papers = `${bundle.count} paper${bundle.count === 1 ? '' : 's'}`;
  const action = `Download all ${papers}`;
  const meta = `ZIP archive · ${bundle.size}`;
  // Spelled out for screen readers, since the visible label is split
  // across two lines and the tooltip never reaches them.
  const described = `${action} as one ZIP archive, ${bundle.size}`;
  const waiting = `Download ready again in ${guard.secondsLeft} second${
    guard.secondsLeft === 1 ? '' : 's'
  }`;
  const href = assetUrl(bundle.file);

  return (
    <a
      className={`publication-bundle publication-bundle--${variant}${
        guard.cooling ? ' is-cooling' : ''
      }`}
      href={href}
      download
      aria-disabled={guard.cooling || undefined}
      aria-label={guard.cooling ? waiting : described}
      onClick={guard.onClick}
    >
      <span className="publication-bundle__glyph" aria-hidden="true">
        <ArchiveDownload />
      </span>
      <span className="publication-bundle__text">
        <span className="publication-bundle__title">
          {guard.cooling ? 'Just a moment' : action}
        </span>
        <span className="publication-bundle__meta">
          {guard.cooling ? `Ready again in ${guard.secondsLeft}s` : meta}
        </span>
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
