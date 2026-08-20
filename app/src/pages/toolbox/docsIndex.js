// docsIndex.js
// Single entry point for the compiled docs (written by build-docs.mjs).
// Exposes nav tree, per-slug metadata, page loader, and legacy-slug
// compatibility for PascalDashCase slugs from legacy content links.
import manifest from '../../generated/docs-manifest.json';
import legacySlugMap from './legacySlugMap';

export const navSections = manifest.sections || [];
export const pageMeta = manifest.pages || {};

// The compiled page ASTs, as ONE lazily-imported bundle (built by
// scripts/build-docs.mjs). Two failure modes to avoid, and this sits
// between them:
//   - eager-importing them put the entire toolbox in the main chunk, so
//     every visitor on every route downloaded all 74 pages;
//   - splitting them per page put a network round trip in front of every
//     click inside the toolbox, which made the docs visibly reload.
// One bundle, fetched when a visitor actually enters /toolbox, then
// every page is in memory and navigation is instant.
let pagesPromise = null;
let pagesByFile = null;

export function loadPages() {
  if (pagesByFile) return Promise.resolve(pagesByFile);
  if (!pagesPromise) {
    pagesPromise = import('../../generated/docs-pages.json')
      .then((mod) => {
        pagesByFile = mod.default || mod;
        return pagesByFile;
      })
      .catch((err) => {
        // Let a later attempt retry rather than caching the failure.
        pagesPromise = null;
        throw err;
      });
  }
  return pagesPromise;
}

/** True once the page bundle is in memory (so getPage can resolve). */
export function pagesReady() {
  return pagesByFile != null;
}

export function getPage(slug) {
  const normalized = normalizeSlug(slug);
  const meta = pageMeta[normalized];
  if (!meta || !pagesByFile) return null;
  const compiled = pagesByFile[meta.file];
  if (!compiled) return null;
  return { ...compiled, meta, slug: normalized };
}

/** Await the bundle, then resolve one page. */
export async function loadPage(slug) {
  await loadPages();
  return getPage(slug);
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
