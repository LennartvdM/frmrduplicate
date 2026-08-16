#!/usr/bin/env node
/**
 * build-publications-zip.mjs
 *
 * Bundles every PDF in public/papers/ into a single archive so the
 * publications page can offer "take all the papers" as one download.
 *
 * Outputs:
 *   public/papers/neoflix-publications.zip   the archive
 *   src/generated/publications-bundle.json   what the UI needs to describe
 *                                            it (count, size, entry list)
 *
 * The directory is the source of truth, not the per-section registry in
 * data/publicationsPage.js: dropping a seventh paper into the folder
 * puts it in the bundle on the next build with nothing else to edit.
 *
 * Run by `npm run prebuild` / `predev` and by the top-level build.sh, so
 * the archive can never drift from the files beside it. Both outputs are
 * gitignored for the same reason.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import JSZip from 'jszip';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRANKENSTEIN_ROOT = path.resolve(__dirname, '..');
const PDF_DIR = path.join(FRANKENSTEIN_ROOT, 'public', 'papers');
const GENERATED_DIR = path.join(FRANKENSTEIN_ROOT, 'src', 'generated');
const ZIP_NAME = 'neoflix-publications.zip';
const ZIP_OUT = path.join(PDF_DIR, ZIP_NAME);
const MANIFEST_OUT = path.join(GENERATED_DIR, 'publications-bundle.json');
// Fixed entry timestamp so a rebuild of unchanged PDFs produces a
// byte-identical archive. ZIP stores DOS time, which has no room for
// anything before 1980 — the epoch silently wraps to 2098.
const ENTRY_DATE = new Date(Date.UTC(2024, 0, 1));

// Matches the meta line on the individual attachments: one decimal below
// 10 MB ("1.8 MB"), none above it ("12 MB"), where a stray decimal would
// only be noise.
function humanSize(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb >= 10) return `${Math.round(mb)} MB`;
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

async function main() {
  let names = [];
  try {
    names = (await fs.readdir(PDF_DIR))
      .filter((n) => n.toLowerCase().endsWith('.pdf'))
      .sort();
  } catch {
    // No folder yet — emit an empty manifest so the UI hides the button
    // rather than the build failing over an optional extra.
  }

  await fs.mkdir(GENERATED_DIR, { recursive: true });

  if (!names.length) {
    await fs.rm(ZIP_OUT, { force: true });
    await fs.writeFile(MANIFEST_OUT, `${JSON.stringify({ count: 0 }, null, 2)}\n`);
    console.log('[publications-zip] no PDFs found — bundle skipped');
    return;
  }

  const zip = new JSZip();
  const entries = [];
  let bytes = 0;

  for (const name of names) {
    const buf = await fs.readFile(path.join(PDF_DIR, name));
    // STORE, not DEFLATE: a PDF's streams are already compressed, so
    // deflating 12MB again buys under a percent for real build seconds.
    zip.file(name, buf, { compression: 'STORE', date: ENTRY_DATE });
    entries.push({ name, bytes: buf.length });
    bytes += buf.length;
  }

  const archive = await zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' });
  await fs.writeFile(ZIP_OUT, archive);

  const manifest = {
    file: `/papers/${ZIP_NAME}`,
    count: entries.length,
    bytes: archive.length,
    size: humanSize(archive.length),
    entries,
  };
  await fs.writeFile(MANIFEST_OUT, `${JSON.stringify(manifest, null, 2)}\n`);

  console.log(
    `[publications-zip] ${entries.length} PDFs → ${ZIP_NAME} (${manifest.size})`
  );
}

main().catch((err) => {
  console.error('[publications-zip] failed:', err);
  process.exit(1);
});
