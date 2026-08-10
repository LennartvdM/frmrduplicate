/**
 * prerender-seo.mjs — post-build SEO pass over the Vite output.
 *
 * The site is a client-rendered SPA behind a `/* -> /index.html`
 * rewrite, which means every URL used to serve one identical document:
 * one title, one description, one canonical, one OpenGraph card. Search
 * engines that render JavaScript could eventually work out the real
 * content; crawlers that don't (Bing's fallback path, Slack/LinkedIn/X
 * unfurlers, most AI crawlers) saw the home page for all 79 URLs.
 *
 * This script runs after `vite build` and, for every route:
 *   1. writes dist/<route>/index.html — the built shell with that
 *      route's title/description/canonical/OG/JSON-LD stamped in, plus
 *      the page's real text in a <noscript> block;
 *   2. adds the route to dist/sitemap.xml;
 *   3. emits dist/robots.txt and dist/_redirects (legacy-slug 301s
 *      followed by the SPA fallback, in that order).
 *
 * Netlify serves a matching static file in preference to a non-forced
 * redirect, so these files take over from the catch-all automatically.
 *
 * Usage: node scripts/prerender-seo.mjs [distDir]
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  LOCALE,
  SITE_NAME,
  SITE_URL,
  STATIC_ROUTES,
  TWITTER_CARD,
  absoluteUrl,
  clampDescription,
  docsJsonLd,
  docsRouteMeta,
  organizationJsonLd,
  websiteJsonLd,
  withBrand,
} from '../src/seo/siteMeta.js';
import { describePage } from '../src/seo/astText.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const DIST = path.resolve(ROOT, process.argv[2] || 'dist');
const GENERATED = path.join(ROOT, 'src/generated');

const SEO_START = '<!-- seo:start -->';
const SEO_END = '<!-- seo:end -->';
const NOSCRIPT_MARKER = '<!-- seo:noscript -->';

const esc = (value) =>
  String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/* ------------------------------------------------------------------ *
 * Compiled-docs helpers
 * ------------------------------------------------------------------ */

const readJson = async (file) => JSON.parse(await readFile(file, 'utf8'));

/** Title chain from nav root down to `slug`, for BreadcrumbList. */
function breadcrumbTrail(sections, slug) {
  const walk = (items, trail) => {
    for (const item of items || []) {
      const next = [...trail, item];
      if (item.slug === slug) return next;
      const hit = walk(item.children, next);
      if (hit) return hit;
    }
    return null;
  };
  for (const section of sections) {
    const hit = walk(section.items, [{ title: section.title, slug: null }]);
    if (hit) return hit;
  }
  return [];
}

/* ------------------------------------------------------------------ *
 * AST -> HTML (for the <noscript> fallback)
 * ------------------------------------------------------------------ */

const inlineJoin = (nodes) => (nodes || []).map(toHtml).join('');

/**
 * Minimal mdast -> HTML serializer. This output is never styled and
 * never shown to a user with JavaScript enabled; it exists so that
 * crawlers which do not execute scripts still read the same words a
 * human does. Unknown/interactive node types collapse to their text.
 */
function toHtml(node) {
  if (!node || typeof node !== 'object') return '';
  switch (node.type) {
    case 'root':
      return inlineJoin(node.children);
    case 'text':
      return esc(node.value);
    case 'paragraph':
      return `<p>${inlineJoin(node.children)}</p>`;
    case 'heading': {
      // Same clamp as DocsNode.jsx so the fallback outline matches the
      // rendered one. Floor of 2 keeps the doc title the only <h1>.
      const level = Math.min(6, Math.max(2, node.depth || 2));
      return `<h${level}>${inlineJoin(node.children)}</h${level}>`;
    }
    case 'strong':
      return `<strong>${inlineJoin(node.children)}</strong>`;
    case 'emphasis':
      return `<em>${inlineJoin(node.children)}</em>`;
    case 'delete':
      return `<del>${inlineJoin(node.children)}</del>`;
    case 'inlineCode':
      return `<code>${esc(node.value)}</code>`;
    case 'code':
      return `<pre><code>${esc(node.value)}</code></pre>`;
    case 'break':
      return '<br />';
    case 'thematicBreak':
      return '<hr />';
    case 'link': {
      const href = esc(node.url || node.href || '');
      return href ? `<a href="${href}">${inlineJoin(node.children)}</a>` : inlineJoin(node.children);
    }
    case 'image': {
      const src = esc(node.url || node.src || '');
      return src ? `<img src="${src}" alt="${esc(node.alt || '')}" />` : '';
    }
    case 'figure':
      return `<figure>${inlineJoin(node.children)}${
        node.caption ? `<figcaption>${esc(node.caption)}</figcaption>` : ''
      }</figure>`;
    case 'list': {
      const tag = node.ordered ? 'ol' : 'ul';
      return `<${tag}>${inlineJoin(node.children)}</${tag}>`;
    }
    case 'listItem':
      return `<li>${inlineJoin(node.children)}</li>`;
    case 'blockquote':
    case 'hint':
      return `<blockquote>${inlineJoin(node.children)}</blockquote>`;
    case 'table':
      return `<table>${inlineJoin(node.children)}</table>`;
    case 'tableRow':
      return `<tr>${inlineJoin(node.children)}</tr>`;
    case 'tableCell':
      return `<td>${inlineJoin(node.children)}</td>`;
    case 'tabs':
      return inlineJoin(node.children);
    case 'tab':
      return `<section>${node.title ? `<h3>${esc(node.title)}</h3>` : ''}${inlineJoin(
        node.children
      )}</section>`;
    case 'cards':
      return `<ul>${(node.cards || [])
        .map((card) => {
          const label = esc(card.title || card.name || '');
          return card.href ? `<li><a href="${esc(card.href)}">${label}</a></li>` : `<li>${label}</li>`;
        })
        .join('')}</ul>`;
    case 'file':
      return node.src ? `<p><a href="${esc(node.src)}">${esc(node.name || 'Download')}</a></p>` : '';
    case 'embed':
      return node.url ? `<p><a href="${esc(node.url)}">${esc(node.url)}</a></p>` : '';
    case 'html':
    case 'worldmap':
      return '';
    default:
      return inlineJoin(node.children);
  }
}

/* ------------------------------------------------------------------ *
 * Head + document assembly
 * ------------------------------------------------------------------ */

function headTags({ title, description, canonical, type, noindex, jsonLd }) {
  const lines = [
    `<title>${esc(title)}</title>`,
    `<meta name="description" content="${esc(description)}" />`,
    `<meta name="robots" content="${
      noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'
    }" />`,
    `<link rel="canonical" href="${esc(canonical)}" />`,
    '',
    `<meta property="og:type" content="${esc(type)}" />`,
    `<meta property="og:site_name" content="${esc(SITE_NAME)}" />`,
    `<meta property="og:url" content="${esc(canonical)}" />`,
    `<meta property="og:title" content="${esc(title)}" />`,
    `<meta property="og:description" content="${esc(description)}" />`,
    `<meta property="og:image" content="${esc(DEFAULT_OG_IMAGE)}" />`,
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    `<meta property="og:image:alt" content="${esc(DEFAULT_OG_IMAGE_ALT)}" />`,
    `<meta property="og:locale" content="${esc(LOCALE)}" />`,
    '',
    `<meta name="twitter:card" content="${esc(TWITTER_CARD)}" />`,
    `<meta name="twitter:url" content="${esc(canonical)}" />`,
    `<meta name="twitter:title" content="${esc(title)}" />`,
    `<meta name="twitter:description" content="${esc(description)}" />`,
    `<meta name="twitter:image" content="${esc(DEFAULT_OG_IMAGE)}" />`,
    `<meta name="twitter:image:alt" content="${esc(DEFAULT_OG_IMAGE_ALT)}" />`,
  ];
  for (const block of jsonLd || []) {
    lines.push(
      `<script type="application/ld+json">${JSON.stringify(block).replace(/<\//g, '<\\/')}</script>`
    );
  }
  return lines.join('\n    ');
}

/**
 * Content shown only to clients that do not run JavaScript. Rendering
 * the same words the app renders keeps this an accessibility/crawler
 * fallback rather than a separate story told to search engines.
 */
function noscriptBlock({ heading, description, body, links }) {
  const linkList = links?.length
    ? `<nav aria-label="Site"><ul>${links
        .map((link) => `<li><a href="${esc(link.href)}">${esc(link.label)}</a></li>`)
        .join('')}</ul></nav>`
    : '';
  return [
    '<noscript>',
    '      <div id="seo-fallback">',
    `        <h1>${esc(heading)}</h1>`,
    // The description is drawn from the opening paragraph, so printing
    // it above the body would just say the same thing twice.
    body ? '' : `        <p>${esc(description)}</p>`,
    body ? `        ${body}` : '',
    linkList ? `        ${linkList}` : '',
    '      </div>',
    '    </noscript>',
  ]
    .filter(Boolean)
    .join('\n');
}

function renderDocument(shell, route) {
  const start = shell.indexOf(SEO_START);
  const end = shell.indexOf(SEO_END);
  if (start === -1 || end === -1) {
    throw new Error(
      `index.html is missing the ${SEO_START} / ${SEO_END} markers — prerender cannot place per-route tags.`
    );
  }
  if (!shell.includes(NOSCRIPT_MARKER)) {
    throw new Error(
      `index.html is missing the ${NOSCRIPT_MARKER} marker — prerender cannot place the no-JavaScript fallback.`
    );
  }
  const head = headTags(route);
  let html = `${shell.slice(0, start)}${SEO_START}\n    ${head}\n    ${shell.slice(end)}`;
  html = html.replace(NOSCRIPT_MARKER, noscriptBlock(route));

  // Asset URLs in the shell are root-absolute (Vite `base: '/'`), so a
  // document written to a nested directory still resolves them.
  return html;
}

async function writeRoute(route, shell) {
  const rel = route.path === '/' ? 'index.html' : `${route.path.replace(/^\//, '')}/index.html`;
  const dest = path.join(DIST, rel);
  await mkdir(path.dirname(dest), { recursive: true });
  await writeFile(dest, renderDocument(shell, route), 'utf8');
}

/* ------------------------------------------------------------------ *
 * Main
 * ------------------------------------------------------------------ */

async function main() {
  const shellPath = path.join(DIST, 'index.html');
  const shell = await readFile(shellPath, 'utf8');

  const manifest = await readJson(path.join(GENERATED, 'docs-manifest.json'));
  const sections = manifest.sections || [];
  const pages = manifest.pages || {};

  const routes = [];

  /* ---- hand-authored routes ---- */
  for (const [routePath, meta] of Object.entries(STATIC_ROUTES)) {
    const title = withBrand(meta.title);
    const description = clampDescription(meta.description);
    const jsonLd = routePath === '/' ? [organizationJsonLd(), websiteJsonLd()] : [];
    routes.push({
      path: routePath,
      title,
      description,
      heading: meta.heading,
      canonical: absoluteUrl(meta.canonical || routePath),
      type: meta.type || 'website',
      priority: meta.priority,
      changefreq: meta.changefreq,
      // /contact is /neoflix scrolled to a section — it points its
      // canonical there, so keep it out of the sitemap too.
      inSitemap: !meta.canonical,
      jsonLd,
      body: '',
      links:
        routePath === '/'
          ? [
              { href: '/neoflix', label: 'What Neoflix is' },
              { href: '/publications', label: 'Research and publications' },
              { href: '/toolbox', label: 'The toolbox' },
              { href: '/contact', label: 'Contact' },
            ]
          : null,
    });
  }

  /* ---- compiled toolbox pages ---- */
  const docsFiles = new Set(await readdir(path.join(GENERATED, 'docs')));
  const toolboxLinks = [];

  for (const [slug, meta] of Object.entries(pages)) {
    if (!slug) continue; // the docs root is the /toolbox static route
    if (!docsFiles.has(meta.file)) {
      console.warn(`[prerender-seo] missing compiled page for "${slug}" (${meta.file}) — skipped`);
      continue;
    }
    const page = await readJson(path.join(GENERATED, 'docs', meta.file));
    const description = clampDescription(
      describePage({ ...page, meta }) ||
        `${meta.title} — part of the Neoflix toolbox for video recording and video reflection in healthcare.`
    );
    const routeMeta = docsRouteMeta({ slug, title: meta.title, description });
    const trail = breadcrumbTrail(sections, slug);
    const breadcrumbs = trail.map((crumb) => ({
      name: crumb.title,
      ...(crumb.slug ? { item: absoluteUrl(`/toolbox/${crumb.slug}`) } : {}),
    }));

    toolboxLinks.push({ href: routeMeta.path, label: meta.title });
    routes.push({
      path: routeMeta.path,
      title: routeMeta.title,
      description,
      heading: meta.title,
      canonical: absoluteUrl(routeMeta.path),
      type: 'article',
      priority: routeMeta.priority,
      changefreq: routeMeta.changefreq,
      inSitemap: true,
      jsonLd: docsJsonLd({
        path: routeMeta.path,
        title: meta.title,
        description,
        breadcrumbs,
      }),
      body: toHtml(page.ast),
      links: null,
    });
  }

  // The toolbox index carries a link to every page so a non-rendering
  // crawler can walk the whole tree without relying on the sitemap.
  const toolboxRoute = routes.find((route) => route.path === '/toolbox');
  if (toolboxRoute) toolboxRoute.links = toolboxLinks;

  for (const route of routes) await writeRoute(route, shell);

  /* ---- sitemap ---- */
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...routes
      .filter((route) => route.inSitemap)
      .map((route) =>
        [
          '  <url>',
          `    <loc>${esc(route.canonical)}</loc>`,
          route.changefreq ? `    <changefreq>${route.changefreq}</changefreq>` : '',
          route.priority ? `    <priority>${route.priority}</priority>` : '',
          '  </url>',
        ]
          .filter(Boolean)
          .join('\n')
      ),
    '</urlset>',
    '',
  ].join('\n');
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap, 'utf8');

  /* ---- robots.txt ---- */
  const robots = [
    '# https://www.neoflix.care',
    'User-agent: *',
    'Allow: /',
    '',
    '# Internal tooling and endpoints — not content.',
    'Disallow: /og-upload',
    'Disallow: /og-upload.html',
    'Disallow: /analytics.html',
    'Disallow: /api/',
    'Disallow: /.netlify/',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');
  await writeFile(path.join(DIST, 'robots.txt'), robots, 'utf8');

  /* ---- redirects ---- */
  // Order matters and Netlify applies netlify.toml rules before
  // _redirects, so the SPA fallback lives here at the bottom rather
  // than in the toml where it would shadow every 301 below it.
  const { default: legacySlugMap } = await import('../src/data/legacySlugMap.js');
  const legacyLines = Object.entries(legacySlugMap)
    .filter(([from, to]) => from && `/toolbox/${from}` !== (to ? `/toolbox/${to}` : '/toolbox'))
    .map(([from, to]) => `/toolbox/${from}  ${to ? `/toolbox/${to}` : '/toolbox'}  301!`);

  const redirects = [
    '# Generated by scripts/prerender-seo.mjs — do not edit by hand.',
    '',
    '# Legacy PascalDashCase toolbox slugs -> their path-based equivalents.',
    '# Forced (301!) because the SPA would otherwise answer 200 at both',
    '# URLs and split the ranking signals between them.',
    ...legacyLines,
    '',
    '# SPA fallback. Prerendered files above take precedence: Netlify only',
    '# reaches a non-forced rewrite when no static file matches the path.',
    '/*  /index.html  200',
    '',
  ].join('\n');
  await writeFile(path.join(DIST, '_redirects'), redirects, 'utf8');

  console.log(
    `[prerender-seo] ${routes.length} routes, ${
      routes.filter((r) => r.inSitemap).length
    } in sitemap, ${legacyLines.length} legacy redirects`
  );
}

main().catch((error) => {
  console.error('[prerender-seo] failed:', error);
  process.exit(1);
});
