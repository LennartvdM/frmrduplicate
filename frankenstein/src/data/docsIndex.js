// docsIndex.js
// Single entry point for the compiled docs (written by build-docs.mjs).
// Exposes nav tree, per-slug metadata, page loader, and legacy-slug
// compatibility for PascalDashCase slugs from legacy content links.
import manifest from '../generated/docs-manifest.json';
import legacySlugMap from './legacySlugMap';

export const navSections = manifest.sections || [];
export const pageMeta = manifest.pages || {};

// Vite glob: lazy import map of every compiled page AST. The ~75 page
// chunks used to be eager-bundled into the main chunk, which shipped
// the entire toolbox to every visitor on every route; lazily each page
// is a small JSON chunk fetched on first visit and cached below.
const pageLoaders = import.meta.glob('../generated/docs/*.json');

const fileToLoader = new Map();
for (const [path, loader] of Object.entries(pageLoaders)) {
  fileToLoader.set(path.split('/').pop(), loader);
}

// file -> parsed module, filled by loadPage. getPage stays synchronous
// against this cache so callers that run before a page is fetched just
// see null and try again after awaiting loadPage.
const loadedPages = new Map();

export function getPage(slug) {
  const normalized = normalizeSlug(slug);
  const meta = pageMeta[normalized];
  if (!meta) return null;
  const mod = loadedPages.get(meta.file);
  if (!mod) return null;
  return { ...mod, meta, slug: normalized };
}

export async function loadPage(slug) {
  const normalized = normalizeSlug(slug);
  const meta = pageMeta[normalized];
  if (!meta) return null;
  if (!loadedPages.has(meta.file)) {
    const loader = fileToLoader.get(meta.file);
    if (!loader) return null;
    const mod = await loader();
    loadedPages.set(meta.file, mod.default || mod);
  }
  return getPage(normalized);
}

/** True when the slug names a real page (loaded or not). */
export function hasPage(slug) {
  return Boolean(pageMeta[normalizeSlug(slug)]);
}

export function resolveSlug(input) {
  if (!input) return '';
  // Accept leading/trailing slashes, URL-encoded, and legacy PascalDash slugs.
  let s = decodeURIComponent(input).trim().replace(/^\/+|\/+$/g, '');
  if (s === '') return '';
  if (pageMeta[s]) return s;
  const legacy = legacySlugMap[s] ?? legacySlugMap[s.toLowerCase()];
  if (legacy != null) return legacy;
  // Case-insensitive full-path match (handles /Toolbox/welcome vs /toolbox/welcome)
  const lower = s.toLowerCase();
  const ciHit = Object.keys(pageMeta).find((k) => k.toLowerCase() === lower);
  if (ciHit) return ciHit;
  return s; // unchanged — lookup will fail and surface a 404
}

export function normalizeSlug(slug) {
  if (slug == null) return '';
  return String(slug).replace(/^\/+|\/+$/g, '');
}

// Flat ordered list of slugs from nav, used for prev/next and breadcrumbs.
export const orderedSlugs = (() => {
  const out = [];
  const walk = (items) => {
    for (const item of items || []) {
      if (item.slug != null) out.push(item.slug);
      if (item.children && item.children.length) walk(item.children);
    }
  };
  for (const section of navSections) walk(section.items);
  return out;
})();

export function neighbors(slug) {
  const i = orderedSlugs.indexOf(slug);
  if (i === -1) return { prev: null, next: null };
  return {
    prev: i > 0 ? orderedSlugs[i - 1] : null,
    next: i < orderedSlugs.length - 1 ? orderedSlugs[i + 1] : null,
  };
}

export function breadcrumbFor(slug) {
  // Walk the nav tree DFS and capture the title chain for the match.
  for (const section of navSections) {
    const path = findInTree(section.items, slug);
    if (path) return [{ title: section.title, slug: null }, ...path];
  }
  return [];
}

function findInTree(items, slug, trail = []) {
  for (const item of items || []) {
    const here = [...trail, { title: item.title, slug: item.slug }];
    if (item.slug === slug) return here;
    if (item.children && item.children.length) {
      const hit = findInTree(item.children, slug, here);
      if (hit) return hit;
    }
  }
  return null;
}
