#!/usr/bin/env node
/**
 * prerender.mjs — turns the single-file SPA build into one indexable HTML
 * document per URL.
 *
 * Runs after `vite build`. For every route the app can serve it writes
 * <dist>/<route>/index.html containing:
 *
 *   - that URL's own <title>, description, canonical, Open Graph and Twitter
 *     tags, plus a JSON-LD @graph
 *   - a static, readable copy of the page inside #root
 *
 * Why not server-side render the real components? The app is built around
 * things that only exist in a browser — ResizeObserver-driven type fitting,
 * scroll-snap decks, canvas illustrations, video backdrops, framer-motion
 * route slides. renderToStaticMarkup would have to be fought at every turn and
 * would still produce markup React immediately throws away, because main.jsx
 * mounts with createRoot rather than hydrateRoot. Emitting the same prose from
 * the same data the components read is smaller, has no runtime cost, and
 * cannot desync from the app in a way that breaks it: React clears #root on
 * mount regardless of what is in there.
 *
 * Also writes sitemap.xml, robots.txt and 404.html.
 *
 * Usage: node scripts/prerender.mjs [--out ../dist]
 */
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  DEFAULT_OG_IMAGE,
  NOINDEX_PATHS,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_LOCALE,
  SITE_NAME,
  SITE_ORIGIN,
  STATIC_ROUTES,
  absoluteUrl,
  clampDescription,
  dedupeTrail,
  metaForDocsPage,
  pathForDocsSlug,
} from '../src/seo/siteMeta.js';
import {
  articleNode,
  breadcrumbNode,
  buildGraph,
  faqNode,
  publicationListNode,
  serializeJsonLd,
  webPageNode,
} from '../src/seo/structuredData.js';
import { extractFaqEntries, firstParagraphText, slugifyHeading } from '../src/seo/astText.js';
import { astToHtml, escapeAttr, escapeHtml } from './lib/astToHtml.mjs';
import { sections as neoflixSections } from '../src/data/neoflixPage.js';
import { sections as publicationSections } from '../src/data/publicationsPage.js';
import { MOBILE_PANELS as homePanels } from '../src/components/mobile/mobileHomeCopy.js';
import legacySlugMap from '../src/data/legacySlugMap.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FRANKENSTEIN_ROOT = path.resolve(__dirname, '..');
const GENERATED = path.join(FRANKENSTEIN_ROOT, 'src', 'generated');

const outArgIndex = process.argv.indexOf('--out');
const OUT_DIR = path.resolve(
  FRANKENSTEIN_ROOT,
  outArgIndex > -1 ? process.argv[outArgIndex + 1] : '../dist'
);

const HEAD_OPEN = '<!--seo:head-->';
const HEAD_CLOSE = '<!--/seo:head-->';
const BODY_MARKER = '<!--seo:body-->';

// ---------------------------------------------------------------------------
// Head
// ---------------------------------------------------------------------------

function metaTag(kind, key, value) {
  if (value == null || value === '') return '';
  return `    <meta ${kind}="${key}" content="${escapeAttr(value)}" />`;
}

function buildHead(meta, graph) {
  const description = clampDescription(meta.description);
  const url = meta.canonical || absoluteUrl(meta.path);
  const image = absoluteUrl(meta.image || DEFAULT_OG_IMAGE);

  const lines = [
    `    <title>${escapeHtml(meta.title)}</title>`,
    metaTag('name', 'description', description),
    meta.robots ? metaTag('name', 'robots', meta.robots) : '',
    meta.canonical ? `    <link rel="canonical" href="${escapeAttr(meta.canonical)}" />` : '',
    '',
    metaTag('property', 'og:type', meta.ogType || 'website'),
    metaTag('property', 'og:site_name', SITE_NAME),
    metaTag('property', 'og:url', url),
    metaTag('property', 'og:title', meta.title),
    metaTag('property', 'og:description', description),
    metaTag('property', 'og:image', image),
    metaTag('property', 'og:image:width', String(OG_IMAGE_WIDTH)),
    metaTag('property', 'og:image:height', String(OG_IMAGE_HEIGHT)),
    metaTag('property', 'og:image:alt', OG_IMAGE_ALT),
    metaTag('property', 'og:locale', SITE_LOCALE),
    '',
    metaTag('name', 'twitter:card', 'summary_large_image'),
    metaTag('name', 'twitter:url', url),
    metaTag('name', 'twitter:title', meta.title),
    metaTag('name', 'twitter:description', description),
    metaTag('name', 'twitter:image', image),
    metaTag('name', 'twitter:image:alt', OG_IMAGE_ALT),
  ];

  if (graph) {
    lines.push('', `    <script type="application/ld+json">${serializeJsonLd(graph)}</script>`);
  }

  return lines.filter((line) => line !== '').join('\n');
}

// ---------------------------------------------------------------------------
// Body — the static copy React replaces on mount
// ---------------------------------------------------------------------------

/**
 * Minimal markdown for the marketing pages' `content` strings. These are
 * authored in src/data/*.js in the same restricted dialect that
 * src/utils/renderMarkdown.js accepts at runtime: ##/### headings, - and 1.
 * lists, ---, **bold**, *italic*, [links](url). That renderer imports Vite-only
 * modules, so this is the build-time equivalent rather than a second dialect.
 */
function renderMarkdownStatic(markdown = '') {
  const inline = (str) =>
    escapeHtml(str)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/\*([^*]+)\*/g, '<em>$1</em>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
        const external = /^https?:/i.test(href);
        const attrs = external
          ? ' target="_blank" rel="noopener noreferrer"'
          : ' data-internal="true"';
        return `<a href="${escapeAttr(href)}"${attrs}>${label}</a>`;
      })
      // The section copy embeds a couple of literal <span> wrappers (a signature
      // line, mostly). They survived escapeHtml above; put them back.
      .replace(/&lt;(\/?)span&gt;/g, '<$1span>');

  const out = [];
  let paragraph = [];
  let list = null;

  const flushParagraph = () => {
    if (paragraph.length) {
      out.push(`<p>${paragraph.join(' ')}</p>`);
      paragraph = [];
    }
  };
  const flushList = () => {
    if (list) {
      out.push(`<${list.type}>${list.items.map((i) => `<li>${i}</li>`).join('')}</${list.type}>`);
      list = null;
    }
  };

  for (const raw of markdown.split('\n')) {
    const line = raw.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }
    if (line === '---' || line === '***') {
      flushParagraph();
      flushList();
      out.push('<hr/>');
      continue;
    }
    const heading = line.match(/^(#{2,4})\s+(.+)$/);
    if (heading) {
      flushParagraph();
      flushList();
      // +1 because the page's own <h1> sits above these, so a source `##`
      // becomes an h3 under the section's h2. Ids match what renderMarkdown.js
      // emits at runtime, so a fragment link survives hydration.
      const level = Math.min(heading[1].length + 1, 6);
      const id = escapeAttr(slugifyHeading(heading[2]));
      out.push(`<h${level} id="${id}">${inline(heading[2])}</h${level}>`);
      continue;
    }
    const bullet = line.match(/^[-*]\s+(.+)$/);
    if (bullet) {
      flushParagraph();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(inline(bullet[1]));
      continue;
    }
    const numbered = line.match(/^\d+\.\s+(.+)$/);
    if (numbered) {
      flushParagraph();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(inline(numbered[1]));
      continue;
    }
    flushList();
    paragraph.push(inline(line));
  }
  flushParagraph();
  flushList();
  return out.join('\n');
}

/** Site-wide nav, so every prerendered page exposes the same internal links. */
function siteNavHtml(current) {
  const items = [
    ['/', 'Home'],
    ['/neoflix', 'Neoflix'],
    ['/publications', 'Publications'],
    ['/toolbox', 'Toolbox'],
    ['/contact', 'Contact'],
  ];
  const links = items
    .map(([href, label]) =>
      href === current
        ? `<li><span aria-current="page">${label}</span></li>`
        : `<li><a href="${href}" data-internal="true">${label}</a></li>`
    )
    .join('');
  return `<nav class="seo-nav" aria-label="Main"><ul>${links}</ul></nav>`;
}

function documentShell(meta, inner, current) {
  return [
    '<div class="seo-prerender">',
    siteNavHtml(current),
    inner,
    '</div>',
  ].join('\n');
}

function marketingBody(meta, sections) {
  const blocks = sections
    .map((section) => {
      const title = section.title ? `<h2 id="${escapeAttr(section.id)}">${escapeHtml(section.title)}</h2>` : '';
      const body = renderMarkdownStatic(section.content || '');
      return `<section>${title}${body}</section>`;
    })
    .join('\n');

  return documentShell(
    meta,
    `<article><h1>${escapeHtml(meta.heading || meta.title)}</h1>` +
      `<p class="seo-lede">${escapeHtml(meta.tagline || meta.description)}</p>${blocks}</article>`,
    meta.path
  );
}

function tocHtml(sections) {
  const renderItems = (items) =>
    (items || [])
      .map((item) => {
        const href = pathForDocsSlug(item.slug);
        const children = item.children && item.children.length
          ? `<ul>${renderItems(item.children)}</ul>`
          : '';
        return `<li><a href="${escapeAttr(href)}" data-internal="true">${escapeHtml(item.title)}</a>${children}</li>`;
      })
      .join('');

  return sections
    .map(
      (section) =>
        `<section><h2>${escapeHtml(section.title)}</h2><ul>${renderItems(section.items)}</ul></section>`
    )
    .join('\n');
}

function docsBody(meta, page, { crumbTrail: rawTrail, prev, next, toc }) {
  const crumbTrail = dedupeTrail(rawTrail);
  const crumbs = crumbTrail.length
    ? `<nav class="seo-breadcrumb" aria-label="Breadcrumb"><ol>${crumbTrail
        .map(
          (crumb, i) =>
            `<li>${
              i === crumbTrail.length - 1
                ? `<span aria-current="page">${escapeHtml(crumb.name)}</span>`
                : `<a href="${escapeAttr(crumb.path)}" data-internal="true">${escapeHtml(crumb.name)}</a>`
            }</li>`
        )
        .join('')}</ol></nav>`
    : '';

  const description = page?.frontmatter?.description
    ? `<p class="seo-lede">${escapeHtml(page.frontmatter.description)}</p>`
    : '';

  const pager = [
    prev ? `<a href="${escapeAttr(prev.path)}" data-internal="true" rel="prev">← ${escapeHtml(prev.title)}</a>` : '',
    next ? `<a href="${escapeAttr(next.path)}" data-internal="true" rel="next">${escapeHtml(next.title)} →</a>` : '',
  ]
    .filter(Boolean)
    .join('');

  const inner =
    `<article>${crumbs}<h1>${escapeHtml(meta.heading || meta.title)}</h1>${description}` +
    `<div class="seo-body">${page ? astToHtml(page.ast) : ''}</div>` +
    (toc ? `<div class="seo-toc"><h2>All toolbox pages</h2>${toc}</div>` : '') +
    (pager ? `<nav class="seo-pager" aria-label="Toolbox pages">${pager}</nav>` : '') +
    '</article>';

  return documentShell(meta, inner, '/toolbox');
}

// ---------------------------------------------------------------------------
// Publications: pull the linked papers out of the section copy for ItemList
// ---------------------------------------------------------------------------

function extractPublications(sections) {
  const items = [];
  for (const section of sections) {
    const match = (section.content || '').match(/^\s*\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*\n+\s*\*([^*]+)\*/m);
    if (!match) continue;
    items.push({
      name: match[1].trim(),
      url: match[2].trim(),
      citation: match[3].trim(),
    });
  }
  return items;
}

// ---------------------------------------------------------------------------
// Docs manifest helpers
// ---------------------------------------------------------------------------

function flattenNav(sections) {
  const ordered = [];
  const sectionOf = new Map();
  const trailOf = new Map();

  const walk = (items, section, trail) => {
    for (const item of items || []) {
      const nextTrail = [...trail, { title: item.title, slug: item.slug }];
      if (item.slug != null) {
        ordered.push(item.slug);
        sectionOf.set(item.slug, section.title);
        trailOf.set(item.slug, nextTrail);
      }
      if (item.children?.length) walk(item.children, section, nextTrail);
    }
  };

  for (const section of sections) walk(section.items, section, []);
  return { ordered, sectionOf, trailOf };
}

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------

async function writePage(routePath, html) {
  const target =
    routePath === '/'
      ? path.join(OUT_DIR, 'index.html')
      : path.join(OUT_DIR, routePath.replace(/^\//, ''), 'index.html');
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, html, 'utf8');
}

function renderDocument(template, meta, graph, body) {
  const headStart = template.indexOf(HEAD_OPEN);
  const headEnd = template.indexOf(HEAD_CLOSE);
  if (headStart === -1 || headEnd === -1) {
    throw new Error(
      `dist/index.html is missing the ${HEAD_OPEN} … ${HEAD_CLOSE} markers — did index.html change?`
    );
  }

  const head = buildHead(meta, graph);
  let html =
    template.slice(0, headStart + HEAD_OPEN.length) +
    '\n' +
    head +
    '\n    ' +
    template.slice(headEnd);

  if (!html.includes(BODY_MARKER)) {
    // Almost always this: the script was run twice without a rebuild in
    // between, so the template it read is its own previous output.
    throw new Error(
      `index.html has no ${BODY_MARKER} marker inside #root. If prerendering has ` +
        'already run against this dist/, rebuild first: npx vite build --outDir ../dist'
    );
  }
  html = html.replace(BODY_MARKER, body);
  return html;
}

async function main() {
  const template = await fs.readFile(path.join(OUT_DIR, 'index.html'), 'utf8');

  const manifest = JSON.parse(
    await fs.readFile(path.join(GENERATED, 'docs-manifest.json'), 'utf8')
  );
  const pages = manifest.pages || {};
  const navSections = manifest.sections || [];
  const { ordered, sectionOf, trailOf } = flattenNav(navSections);

  const loadPage = async (slug) => {
    const entry = pages[slug];
    if (!entry) return null;
    const raw = await fs.readFile(path.join(GENERATED, 'docs', entry.file), 'utf8');
    return JSON.parse(raw);
  };

  const sitemap = [];
  let written = 0;

  // --- marketing routes ----------------------------------------------------
  //
  // "/" has no `sections` of its own — the homepage is a scroll-snap deck whose
  // copy lives in component data, not in a content array. MOBILE_PANELS carries
  // the same narrative as complete sentences (the mobile route renders exactly
  // these), so the prerendered "/" says what the site is about instead of
  // stopping at a headline.
  const homeSections = homePanels.map((panel) => ({
    id: panel.id,
    title: null,
    content: panel.label,
  }));

  const sectionsByRoute = {
    '/': homeSections,
    '/neoflix': neoflixSections,
    '/contact': neoflixSections,
    '/publications': publicationSections,
  };

  for (const [routePath, route] of Object.entries(STATIC_ROUTES)) {
    const meta = {
      ...route,
      path: routePath,
      canonical: absoluteUrl(route.canonical || routePath),
    };

    const nodes = [webPageNode(meta)];
    if (routePath === '/publications') {
      const list = publicationListNode(extractPublications(publicationSections), routePath);
      if (list) nodes.push(list);
    }
    const graph = buildGraph(...nodes);

    const sections = sectionsByRoute[routePath];
    const body = sections
      ? marketingBody(meta, sections)
      : documentShell(
          meta,
          `<article><h1>${escapeHtml(meta.heading || meta.title)}</h1>` +
            `<p class="seo-lede">${escapeHtml(meta.tagline || meta.description)}</p>` +
            `<p>${escapeHtml(meta.description)}</p></article>`,
          routePath
        );

    await writePage(routePath, renderDocument(template, meta, graph, body));
    written += 1;
    if (route.sitemap !== false) {
      sitemap.push({
        loc: absoluteUrl(routePath),
        changefreq: route.changefreq,
        priority: route.priority,
      });
    }
  }

  // --- toolbox -------------------------------------------------------------
  for (const slug of Object.keys(pages)) {
    const page = await loadPage(slug);
    const fallback = page ? firstParagraphText(page.ast) : '';
    const meta = metaForDocsPage(slug, pages[slug], fallback);
    meta.canonical = absoluteUrl(meta.path);
    meta.ogType = slug ? 'article' : 'website';

    const trail = [
      { name: SITE_NAME, path: '/' },
      { name: 'Toolbox', path: '/toolbox' },
    ];
    if (slug) {
      const sectionTitle = sectionOf.get(slug);
      if (sectionTitle) trail.push({ name: sectionTitle, path: '/toolbox' });
      for (const crumb of trailOf.get(slug) || []) {
        if (crumb.slug === slug) break;
        if (crumb.slug != null) trail.push({ name: crumb.title, path: pathForDocsSlug(crumb.slug) });
      }
      trail.push({ name: meta.heading, path: meta.path });
    }

    const nodes = [webPageNode(meta)];
    const crumbNode = breadcrumbNode(trail);
    if (crumbNode) nodes.push(crumbNode);
    if (slug) nodes.push(articleNode(meta));
    if (page) {
      const faq = faqNode(extractFaqEntries(page.ast), meta.path);
      if (faq) nodes.push(faq);
    }

    const index = ordered.indexOf(slug);
    const neighbour = (i) => {
      const s = ordered[i];
      if (s == null || !pages[s]) return null;
      return { path: pathForDocsSlug(s), title: pages[s].title || s };
    };

    const body = docsBody(meta, page, {
      crumbTrail: slug ? trail : [],
      prev: index > 0 ? neighbour(index - 1) : null,
      next: index > -1 && index < ordered.length - 1 ? neighbour(index + 1) : null,
      toc: slug ? null : tocHtml(navSections),
    });

    await writePage(meta.path, renderDocument(template, meta, buildGraph(...nodes), body));
    written += 1;
    sitemap.push({
      loc: absoluteUrl(meta.path),
      changefreq: meta.changefreq,
      priority: meta.priority,
    });
  }

  // --- 404 -----------------------------------------------------------------
  // Netlify serves this with a real 404 status for unmatched paths. It still
  // boots the SPA, so a URL the router can rescue client-side (a legacy slug
  // spelled some other way) still lands the visitor on the right page while
  // crawlers get the 404 they should.
  const notFoundMeta = {
    path: '/404',
    title: `Page not found — ${SITE_NAME}`,
    description: 'That page isn’t here. It may have moved, or the link may be out of date.',
    heading: 'Page not found',
    tagline: 'That page isn’t here. It may have moved, or the link may be out of date.',
    canonical: null,
    robots: 'noindex, follow',
  };
  const notFoundBody = documentShell(
    notFoundMeta,
    `<article><h1>Page not found</h1><p>That page isn’t here. It may have moved, or the link may be out of date.</p></article>`,
    null
  );
  await fs.writeFile(
    path.join(OUT_DIR, '404.html'),
    renderDocument(template, notFoundMeta, null, notFoundBody),
    'utf8'
  );

  // --- sitemap.xml ---------------------------------------------------------
  const today = new Date().toISOString().slice(0, 10);
  const urls = sitemap
    .map(
      (entry) =>
        `  <url>\n    <loc>${entry.loc}</loc>\n    <lastmod>${today}</lastmod>` +
        (entry.changefreq ? `\n    <changefreq>${entry.changefreq}</changefreq>` : '') +
        (entry.priority ? `\n    <priority>${entry.priority}</priority>` : '') +
        `\n  </url>`
    )
    .join('\n');
  await fs.writeFile(
    path.join(OUT_DIR, 'sitemap.xml'),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    'utf8'
  );

  // --- robots.txt ----------------------------------------------------------
  const disallow = NOINDEX_PATHS.map((p) => `Disallow: ${p}`).join('\n');
  await fs.writeFile(
    path.join(OUT_DIR, 'robots.txt'),
    [
      'User-agent: *',
      'Allow: /',
      disallow,
      '',
      `Sitemap: ${SITE_ORIGIN}/sitemap.xml`,
      '',
    ].join('\n'),
    'utf8'
  );

  // --- legacy slug redirects ----------------------------------------------
  // resolveSlug() maps these client-side, which means the old and new URLs both
  // answer 200 with identical content — two URLs competing for one page. As
  // 301s the signals consolidate on the canonical URL instead.
  //
  // Deliberately not forced (no `!`): an unforced rule only fires when no file
  // exists at that path, so a legacy key that happens to collide with a real
  // page can never shadow it. The router keeps its client-side fallback for
  // anything not listed here.
  const seen = new Set();
  const redirects = [];
  for (const [legacy, canonical] of Object.entries(legacySlugMap)) {
    if (!legacy || legacy === canonical) continue;
    if (pages[legacy]) continue; // the "legacy" key is itself a live page
    const from = `/toolbox/${legacy}`;
    if (seen.has(from)) continue;
    seen.add(from);
    redirects.push(`${from}  ${pathForDocsSlug(canonical)}  301`);
  }
  await fs.writeFile(
    path.join(OUT_DIR, '_redirects'),
    [
      '# Generated by scripts/prerender.mjs — do not edit by hand.',
      '# Old PascalDashCase toolbox slugs (see src/data/legacySlugMap.js).',
      ...redirects,
      '',
    ].join('\n'),
    'utf8'
  );

  console.log(
    `[prerender] ${written} pages, ${sitemap.length} sitemap URLs, ${redirects.length} legacy redirects → ${path.relative(process.cwd(), OUT_DIR)}/`
  );
}

main().catch((err) => {
  console.error('[prerender] failed:', err);
  process.exit(1);
});
