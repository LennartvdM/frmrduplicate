#!/usr/bin/env node
/**
 * build-route-html.mjs
 *
 * Gives every route a real HTML file with its own head, plus a sitemap
 * and robots.txt.
 *
 * The app is a SPA: Netlify serves index.html for every path, so every
 * URL used to carry the homepage's <title>, description and canonical.
 * Google renders JavaScript and would eventually see the head that
 * hooks/useDocumentMeta.js writes, but a rel=canonical pointing at the
 * homepage in the served markup is a strong signal it may act on first —
 * and social scrapers (LinkedIn, Slack, WhatsApp, Facebook, X) never run
 * JavaScript at all, so a shared link showed the homepage no matter
 * which page was shared.
 *
 * The fix doesn't need SSR. Netlify serves <path>/index.html when it
 * exists and only falls through to the SPA rewrite when it doesn't, so
 * writing one small HTML file per route is enough: same bundle, same
 * client-side rendering, correct head on arrival.
 *
 * Outputs (into the Vite output directory):
 *   <out>/<route>/index.html   one per app route and toolbox page
 *   <out>/sitemap.xml
 *   <out>/robots.txt
 *
 * Run after `vite build` — by `npm run postbuild` and by build.sh, which
 * passes its own --out because it builds to the repo root.
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  SITE_URL,
  SITE_NAME,
  ROUTE_META,
  resolveRouteMeta,
  canonicalUrl,
  staticRoutePaths,
} from '../src/data/routeMeta.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRANKENSTEIN_ROOT = path.resolve(__dirname, '..');
const GENERATED_DIR = path.join(FRANKENSTEIN_ROOT, 'src', 'generated');

function parseOutDir() {
  const i = process.argv.indexOf('--out');
  const raw = i !== -1 ? process.argv[i + 1] : 'dist';
  return path.resolve(FRANKENSTEIN_ROOT, raw);
}

/* ── Head rewriting ─────────────────────────────────────────────────
   Replaces the tags index.html already ships with, rather than
   appending, so a route never ends up with two canonicals. Each helper
   is a no-op when the tag isn't in the template. */

function escapeAttr(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function replaceTitle(html, title) {
  return html.replace(
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeAttr(title).replace(/&quot;/g, '"')}</title>`
  );
}

function replaceMeta(html, attr, key, value) {
  const pattern = new RegExp(
    `<meta\\s+${attr}="${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"[^>]*>`,
    'i'
  );
  const tag = `<meta ${attr}="${key}" content="${escapeAttr(value)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html;
}

function replaceCanonical(html, href) {
  const pattern = /<link\s+rel="canonical"[^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeAttr(href)}" />`;
  return pattern.test(html) ? html.replace(pattern, tag) : html;
}

function applyMeta(template, meta) {
  let html = replaceTitle(template, meta.title);
  html = replaceMeta(html, 'name', 'description', meta.description);
  html = replaceCanonical(html, meta.canonical);

  html = replaceMeta(html, 'property', 'og:url', meta.canonical);
  html = replaceMeta(html, 'property', 'og:title', meta.title);
  html = replaceMeta(html, 'property', 'og:description', meta.description);
  html = replaceMeta(html, 'property', 'og:image', meta.image);
  html = replaceMeta(html, 'property', 'og:image:alt', meta.imageAlt);

  html = replaceMeta(html, 'name', 'twitter:url', meta.canonical);
  html = replaceMeta(html, 'name', 'twitter:title', meta.title);
  html = replaceMeta(html, 'name', 'twitter:description', meta.description);
  html = replaceMeta(html, 'name', 'twitter:image', meta.image);
  html = replaceMeta(html, 'name', 'twitter:image:alt', meta.imageAlt);
  return html;
}

/* ── Toolbox lead paragraphs ────────────────────────────────────────
   Same extraction the client hook does, so a page's description is
   identical whether it was served as HTML or reached by clicking. */

function firstParagraphText(node) {
  if (!node || typeof node !== 'object') return '';
  if (node.type === 'paragraph') {
    const text = collectText(node);
    if (text.trim()) return text;
  }
  for (const child of node.children || []) {
    const found = firstParagraphText(child);
    if (found) return found;
  }
  return '';
}

function collectText(node) {
  if (!node || typeof node !== 'object') return '';
  if (typeof node.value === 'string') return node.value;
  return (node.children || []).map(collectText).join('');
}

async function loadDocs() {
  try {
    const manifest = JSON.parse(
      await fs.readFile(path.join(GENERATED_DIR, 'docs-manifest.json'), 'utf8')
    );
    const pages = manifest.pages || {};
    const leads = {};
    // Extracted for every page, not only the ones missing a description:
    // toolboxRouteMeta also wants the lead paragraph behind a short
    // authored label. The client hook has no equivalent shortcut, so
    // skipping any page here would make the two disagree.
    for (const [slug, page] of Object.entries(pages)) {
      if (!page.file) continue;
      try {
        const compiled = JSON.parse(
          await fs.readFile(path.join(GENERATED_DIR, 'docs', page.file), 'utf8')
        );
        leads[slug] = firstParagraphText(compiled.ast);
      } catch {
        leads[slug] = '';
      }
    }
    return { pages, leads };
  } catch {
    // Docs aren't built — emit the app routes and skip the toolbox
    // rather than failing the whole build over it.
    return { pages: {}, leads: {} };
  }
}

async function writeRoute(outDir, routePath, html) {
  const dir =
    routePath === '/' ? outDir : path.join(outDir, routePath.replace(/^\//, ''));
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'index.html'), html);
}

function sitemap(paths) {
  const urls = paths
    .map((p) => `  <url><loc>${canonicalUrl(p)}</loc></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

async function main() {
  const outDir = parseOutDir();
  const templatePath = path.join(outDir, 'index.html');

  let template;
  try {
    template = await fs.readFile(templatePath, 'utf8');
  } catch {
    console.error(
      `[route-html] no index.html in ${outDir} — run vite build first`
    );
    process.exit(1);
  }

  const { pages, leads } = await loadDocs();

  const routePaths = [
    ...staticRoutePaths(),
    ...Object.keys(pages)
      .filter((slug) => slug !== '')
      .map((slug) => `/toolbox/${slug}`),
  ];

  for (const routePath of routePaths) {
    const meta = resolveRouteMeta(routePath, {
      docsPages: pages,
      leadTextFor: (slug) => leads[slug] || '',
    });
    await writeRoute(outDir, routePath, applyMeta(template, meta));
  }

  await fs.writeFile(path.join(outDir, 'sitemap.xml'), sitemap(routePaths));
  // /papers/ is disallowed for bandwidth, not secrecy. The PDFs already
  // carry X-Robots-Tag: noindex, but a crawler only reads that header
  // after downloading the file — so Google was pulling 24MB of papers,
  // seeing "noindex", discarding them, and coming back later. Disallow
  // stops the fetch instead of wasting it. Readers are unaffected;
  // robots.txt binds crawlers, not browsers.
  await fs.writeFile(
    path.join(outDir, 'robots.txt'),
    `User-agent: *\nAllow: /\nDisallow: /papers/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
  );

  console.log(
    `[route-html] ${routePaths.length} routes (${
      Object.keys(pages).length
    } toolbox pages) + sitemap.xml + robots.txt for ${SITE_NAME}`
  );
}

main().catch((err) => {
  console.error('[route-html] failed:', err);
  process.exit(1);
});
