/**
 * siteMeta.js — single source of truth for per-URL SEO metadata.
 *
 * Imported by BOTH sides of the pipeline:
 *   - the browser bundle, via seo/DocumentHead.jsx, which rewrites <head>
 *     on every client-side navigation
 *   - the Node prerenderer, via scripts/prerender.mjs, which bakes the same
 *     values into one static HTML file per URL
 *
 * Because Node imports this file directly, it must stay free of browser
 * globals and of Vite-only syntax (`import.meta.env`, `import.meta.glob`).
 * Plain ESM and plain data only.
 */

/**
 * The apex, not www. Netlify has neoflix.care set as the site's primary domain
 * and redirects www.neoflix.care to it, so this is the host that is actually
 * served — and the one that has been live and indexed. Canonicals, og:url, the
 * sitemap and every JSON-LD @id derive from here, so a mismatch would point all
 * of them at a redirect.
 */
export const SITE_ORIGIN = 'https://neoflix.care';
export const SITE_NAME = 'Neoflix';
export const SITE_LOCALE = 'en_US';
export const SITE_LANG = 'en';

export const DEFAULT_OG_IMAGE = '/og-preview.png';
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_ALT = 'Neoflix — record, reflect, refine';

export const CONTACT_EMAIL = 'info@neoflix.care';

/** Docs pages get a consistent brand tail so SERP entries are self-locating. */
export const TOOLBOX_SUFFIX = 'Neoflix Toolbox';

/**
 * Descriptions longer than this get clipped on a word boundary. Google renders
 * roughly 155-160 characters on desktop; past that the tail is wasted.
 */
export const DESCRIPTION_MAX = 155;

/**
 * The four hand-authored routes. Docs URLs are derived at build time from the
 * generated manifest instead — see metaForDocsPage below.
 *
 * `canonical` is only set where it differs from the URL itself. /contact
 * renders the exact same component tree and copy as /neoflix (App.jsx passes
 * scrollTo="contact"), so it points its canonical there rather than competing
 * with it as a near-duplicate.
 */
export const STATIC_ROUTES = {
  '/': {
    title: 'Neoflix: Video Recording and Review for Medical Teams',
    description:
      'Record, reflect, refine. Neoflix helps hospital teams use video review to sharpen skills, strengthen teamwork and improve patient care.',
    heading: 'Record, Reflect, Refine.',
    tagline: 'Improve patient care through video reflection.',
    changefreq: 'monthly',
    priority: '1.0',
  },
  '/neoflix': {
    title: 'How Neoflix Works: Video Reflection in Clinical Practice',
    description:
      'Why medical teams record and review their work — from time-critical procedures to shared reflection that turns everyday care into a learning opportunity.',
    heading: 'Record. Reflect. Refine.',
    tagline: 'The thinking behind Neoflix, section by section.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  '/publications': {
    title: 'Publications: Peer-Reviewed Research on Video Review',
    description:
      'The peer-reviewed studies behind Neoflix, covering video recording of neonatal care, providers’ perspectives, and the record-reflect-refine method.',
    heading: 'Articles',
    tagline: 'Peer-reviewed research behind the Neoflix approach.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  '/contact': {
    title: 'Contact Neoflix',
    description:
      'Get in touch with the Neoflix team about bringing video review to your department, or about joining the international network.',
    heading: 'Contact',
    tagline: 'Get in touch about video review in your department.',
    canonical: '/neoflix',
    // Canonicalised to /neoflix, so it stays out of the sitemap.
    sitemap: false,
  },
};

/** The docs root (manifest slug "") is titled "Welcome", too thin to rank on. */
export const TOOLBOX_ROOT = {
  title: 'Neoflix Toolbox: A Practical Guide to Video Review',
  description:
    'A step-by-step guide for healthcare teams implementing video review: preparation and consent, recording, reflection sessions, and growing a programme.',
  changefreq: 'weekly',
  priority: '0.9',
};

/** Paths that exist in the deploy but must never enter the index. */
export const NOINDEX_PATHS = ['/og-upload.html', '/.netlify/', '/stats', '/api/'];

/**
 * A frontmatter description this short is a GitBook subtitle stub ("LUMC
 * example", "Practical guidance"), not a description — several are duplicated
 * across pages. Below this length the page's own opening paragraph wins.
 * Matches the threshold astText.js uses when picking that paragraph.
 */
const MIN_USEFUL_DESCRIPTION = 40;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Join a site-relative path onto the canonical origin. */
export function absoluteUrl(pathname = '/') {
  if (/^https?:\/\//i.test(pathname)) return pathname;
  const path = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `${SITE_ORIGIN}${path === '/' ? '/' : path.replace(/\/+$/, '')}`;
}

/** Collapse whitespace and strip markdown noise from prose used as a description. */
export function flattenText(input = '') {
  return String(input)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[*_`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Clip to DESCRIPTION_MAX on a word boundary, with an ellipsis when clipped. */
export function clampDescription(input = '', max = DESCRIPTION_MAX) {
  const text = flattenText(input);
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,;:.\s]+$/, '')}…`;
}

/** Normalise "/toolbox/foo/" and "toolbox/foo" to a single comparable form. */
export function normalizePath(pathname = '/') {
  if (!pathname) return '/';
  const [pathOnly] = String(pathname).split(/[?#]/);
  const withSlash = pathOnly.startsWith('/') ? pathOnly : `/${pathOnly}`;
  const trimmed = withSlash.replace(/\/+$/, '');
  return trimmed === '' ? '/' : trimmed;
}

/** Toolbox slug ("welcome/quick-start") for a pathname, or null if off-toolbox. */
export function docsSlugForPath(pathname) {
  const path = normalizePath(pathname);
  if (path === '/toolbox') return '';
  if (path.startsWith('/toolbox/')) return path.slice('/toolbox/'.length);
  return null;
}

/** Toolbox URL path for a manifest slug (the root slug is the empty string). */
export function pathForDocsSlug(slug) {
  return slug ? `/toolbox/${slug}` : '/toolbox';
}

/**
 * Drop breadcrumb rungs that repeat a URL already in the trail.
 *
 * Nav sections ("Welcome", "LEVEL 2: In Action") are grouping labels with no
 * page of their own, so they resolve to /toolbox — the same URL as the rung
 * above them. Two rungs on one URL is a malformed trail for schema.org and
 * reads as a stutter in the visible breadcrumb. First occurrence wins.
 */
export function dedupeTrail(trail = []) {
  const seen = new Set();
  return trail.filter((crumb) => {
    if (!crumb || seen.has(crumb.path)) return false;
    seen.add(crumb.path);
    return true;
  });
}

/**
 * Metadata for a docs page.
 *
 * @param {string} slug       manifest slug, "" for the toolbox root
 * @param {object} meta       manifest entry: { title, description }
 * @param {string} [fallback] first paragraph of the page, used when the page
 *                            carries no frontmatter description (60 of 74 do not)
 */
export function metaForDocsPage(slug, meta = {}, fallback = '') {
  if (!slug) {
    return {
      path: '/toolbox',
      title: TOOLBOX_ROOT.title,
      description: TOOLBOX_ROOT.description,
      heading: 'Neoflix Toolbox',
      changefreq: TOOLBOX_ROOT.changefreq,
      priority: TOOLBOX_ROOT.priority,
    };
  }
  const title = meta.title || slug.split('/').pop();

  // Prefer the page's own opening paragraph over a too-short frontmatter stub.
  // 12 of the 14 pages that declare a description declare one of 9-34 chars,
  // and six of those are byte-identical across pages — as meta descriptions
  // they would be worse than the prose they were beating.
  const declared = (meta.description || '').trim();
  const description = clampDescription(
    declared.length >= MIN_USEFUL_DESCRIPTION
      ? declared
      : fallback || declared || TOOLBOX_ROOT.description
  );
  return {
    path: pathForDocsSlug(slug),
    title: `${title} — ${TOOLBOX_SUFFIX}`,
    description,
    heading: title,
    changefreq: 'monthly',
    priority: '0.7',
  };
}

/**
 * Metadata for any pathname. `docsLookup` is optional and only consulted for
 * /toolbox URLs; the browser passes a function backed by the compiled manifest,
 * the prerenderer passes one backed by the manifest JSON on disk.
 */
export function metaForPath(pathname, docsLookup) {
  const path = normalizePath(pathname);
  const slug = docsSlugForPath(path);

  if (slug !== null) {
    const entry = typeof docsLookup === 'function' ? docsLookup(slug) : null;
    if (!entry && slug) {
      // Unknown toolbox slug — DocsPage renders its not-found state, so keep
      // the URL out of the index rather than let a soft 404 accumulate.
      return {
        path,
        title: `Page not found — ${TOOLBOX_SUFFIX}`,
        description: TOOLBOX_ROOT.description,
        canonical: null,
        robots: 'noindex, follow',
      };
    }
    const meta = metaForDocsPage(slug, entry?.meta || entry || {}, entry?.fallback);
    return { ...meta, path, canonical: absoluteUrl(path) };
  }

  const route = STATIC_ROUTES[path];
  if (!route) {
    return {
      path,
      title: `Page not found — ${SITE_NAME}`,
      description: STATIC_ROUTES['/'].description,
      canonical: null,
      robots: 'noindex, follow',
    };
  }

  return {
    ...route,
    path,
    canonical: absoluteUrl(route.canonical || path),
  };
}
