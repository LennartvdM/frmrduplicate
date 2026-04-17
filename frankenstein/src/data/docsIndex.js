// docsIndex.js
// Single entry point for the compiled docs (written by build-docs.mjs).
// Exposes nav tree, per-slug metadata, page loader, and legacy-slug
// compatibility for the PascalDashCase slugs the old publications.js uses.
import manifest from '../generated/docs-manifest.json';
import legacySlugMap from './legacySlugMap';

export const navSections = manifest.sections || [];
export const pageMeta = manifest.pages || {};

// Vite glob: eager-evaluated import map of every compiled page AST. We
// eager-import because there are only ~75 pages and the combined JSON is
// small; swapping to lazy `import.meta.glob` with `eager:false` is a
// one-line change if the bundle ever gets heavy.
const pageModules = import.meta.glob('../generated/docs/*.json', { eager: true });

const slugToModule = new Map();
for (const [path, mod] of Object.entries(pageModules)) {
  const file = path.split('/').pop();
  slugToModule.set(file, mod.default || mod);
}

export function getPage(slug) {
  const normalized = normalizeSlug(slug);
  const meta = pageMeta[normalized];
  if (!meta) return null;
  const mod = slugToModule.get(meta.file);
  if (!mod) return null;
  return { ...mod, meta, slug: normalized };
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
