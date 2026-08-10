/**
 * siteMeta.js — single source of truth for page metadata.
 *
 * Imported by BOTH the browser bundle (src/seo/Seo.jsx) and the Node
 * post-build script (scripts/prerender-seo.mjs), so it must stay plain
 * ESM with no Vite-only syntax (no import.meta.glob, no JSON imports,
 * no `?url` suffixes).
 *
 * The site is a client-rendered SPA: every URL is served the same
 * index.html shell, so without this the whole site shares one title and
 * one description. prerender-seo.mjs uses these values to stamp a real
 * per-route HTML file into dist/ at build time, and Seo.jsx re-applies
 * them on client-side navigation.
 */

export const SITE_URL = 'https://www.neoflix.care';
export const SITE_NAME = 'Neoflix';
export const TITLE_SUFFIX = ` | ${SITE_NAME}`;
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-preview.png`;
export const DEFAULT_OG_IMAGE_ALT = 'Neoflix: record, reflect, refine — video review for clinical teams';
export const LOCALE = 'en_US';
export const TWITTER_CARD = 'summary_large_image';

export const DEFAULT_TITLE = 'Neoflix: Hospital Video Recording and Medical Training';
export const DEFAULT_DESCRIPTION =
  'Neoflix helps clinical teams record real procedures and reflect on them together — sharpening skills, strengthening teamwork and improving patient safety.';

/** Longest description we will emit. Search engines truncate past ~160. */
export const DESCRIPTION_MAX = 158;

/**
 * Per-route metadata for the hand-authored (non-docs) routes. Docs
 * routes under /toolbox derive theirs from the compiled GitBook
 * manifest instead — see docsRouteMeta() below.
 *
 * `canonical` overrides the self-referencing canonical URL. /contact is
 * the same React page as /neoflix scrolled to a different section, so
 * it points at /neoflix rather than competing with it for the same
 * content.
 */
export const STATIC_ROUTES = {
  '/': {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    heading: 'Neoflix: video reflection for safer clinical care',
    type: 'website',
    priority: '1.0',
    changefreq: 'monthly',
  },
  '/neoflix': {
    title: 'Video Reflection for Clinical Teams',
    description:
      'Emergency procedures are time-sensitive and run like a dance. See how reviewing the recording sharpens skills, strengthens team dynamics and broadens perspectives.',
    heading: 'Video reflection for clinical teams',
    type: 'website',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/publications': {
    title: 'Video Review Research and Publications',
    description:
      "The peer-reviewed research behind Neoflix: a narrative review, providers' perspectives, practical guidance and international collaboration on neonatal video review.",
    heading: 'Research and publications behind Neoflix',
    type: 'website',
    priority: '0.9',
    changefreq: 'monthly',
  },
  '/contact': {
    title: 'Contact the Neoflix Team',
    description:
      'Get in touch with the Neoflix team about starting video review in your unit, research collaboration, or questions about the toolbox.',
    heading: 'Contact the Neoflix team',
    canonical: '/neoflix',
    type: 'website',
    priority: '0.5',
    changefreq: 'yearly',
  },
  '/toolbox': {
    title: 'The Neoflix Toolbox: Start Video Review in Your Unit',
    description:
      'A practical, step-by-step toolbox for setting up video recording and video reflection in healthcare — from consent and equipment to reviewing footage and growing the programme.',
    heading: 'The Neoflix toolbox',
    type: 'website',
    priority: '0.9',
    changefreq: 'weekly',
  },
};

/** Absolute URL for a site-relative path. */
export function absoluteUrl(pathname) {
  const path = String(pathname || '/');
  const withSlash = path.startsWith('/') ? path : `/${path}`;
  // Trailing slash only on the root — everything else is extensionless.
  const trimmed = withSlash.length > 1 ? withSlash.replace(/\/+$/, '') : '/';
  return `${SITE_URL}${trimmed}`;
}

/** Append " | Neoflix" unless the title already carries the brand. */
export function withBrand(title) {
  const value = String(title || '').trim();
  if (!value) return DEFAULT_TITLE;
  if (value.toLowerCase().includes(SITE_NAME.toLowerCase())) return value;
  return `${value}${TITLE_SUFFIX}`;
}

/**
 * Squash whitespace and cut to DESCRIPTION_MAX on a word boundary so we
 * never emit a description that ends mid-word.
 */
export function clampDescription(text, max = DESCRIPTION_MAX) {
  const clean = String(text || '').replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, '')}…`;
}

/** Resolved metadata for a /toolbox docs page. */
export function docsRouteMeta({ slug, title, description }) {
  const path = slug ? `/toolbox/${slug}` : '/toolbox';
  if (!slug) return { path, ...STATIC_ROUTES['/toolbox'] };
  return {
    path,
    title: `${title}${TITLE_SUFFIX} Toolbox`,
    description: clampDescription(
      description ||
        `${title} — part of the Neoflix toolbox for video recording and video reflection in healthcare.`
    ),
    heading: title,
    type: 'article',
    priority: '0.7',
    changefreq: 'monthly',
  };
}

/** Resolved metadata for any non-docs route. Falls back to the home meta. */
export function staticRouteMeta(pathname) {
  const path = pathname === '/' ? '/' : String(pathname || '/').replace(/\/+$/, '');
  const entry = STATIC_ROUTES[path];
  if (!entry) return { path, ...STATIC_ROUTES['/'], noindex: true };
  return { path, ...entry };
}

/**
 * JSON-LD for the organisation behind the site. Emitted once, on the
 * home page, so search engines can attach the brand to a knowledge
 * entity rather than inferring it per page.
 */
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/web-app-manifest-512x512.png`,
    description:
      'Neoflix is an interprofessional video review method for healthcare teams: record clinical procedures, reflect on them together, and refine care.',
  };
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/`,
    inLanguage: 'en',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

/** TechArticle + breadcrumb trail for a single toolbox page. */
export function docsJsonLd({ path, title, description, breadcrumbs = [] }) {
  const url = absoluteUrl(path);
  const article = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    '@id': `${url}#article`,
    headline: title,
    description,
    url,
    inLanguage: 'en',
    isPartOf: { '@id': `${SITE_URL}/#website` },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
  // Google requires `item` on every entry except the last, so nav
  // groupings that aren't pages of their own (a section heading with no
  // slug) are dropped rather than emitted as URL-less middle entries.
  const items = [{ name: 'Toolbox', item: absoluteUrl('/toolbox') }, ...breadcrumbs].filter(
    (crumb, i, all) => crumb.item || i === all.length - 1
  );
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: items.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      ...(crumb.item ? { item: crumb.item } : {}),
    })),
  };
  return [article, breadcrumb];
}
