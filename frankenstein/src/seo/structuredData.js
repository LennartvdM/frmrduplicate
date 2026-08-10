/**
 * structuredData.js — JSON-LD builders.
 *
 * Same constraint as siteMeta.js: plain ESM, no browser globals, because the
 * Node prerenderer imports this to bake <script type="application/ld+json">
 * into the static HTML.
 *
 * Every node here is populated from content that actually exists on the page.
 * Nothing is asserted that the site cannot back up — no invented ratings,
 * authors, or dates.
 */

import {
  SITE_NAME,
  SITE_ORIGIN,
  CONTACT_EMAIL,
  absoluteUrl,
  dedupeTrail,
} from './siteMeta.js';

const ORG_ID = `${SITE_ORIGIN}/#organization`;
const SITE_ID = `${SITE_ORIGIN}/#website`;

/**
 * Serialise a JSON-LD payload for embedding in HTML.
 *
 * The `<` escape matters: a literal "</script>" inside any string value would
 * otherwise close the script element early and inject markup into the page.
 */
export function serializeJsonLd(data) {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

export function organizationNode() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    email: CONTACT_EMAIL,
    description:
      'Neoflix is a video review method for medical teams: record procedures, reflect on them together, and refine how care is delivered.',
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/web-app-manifest-512x512.png'),
      width: 512,
      height: 512,
    },
  };
}

export function webSiteNode() {
  return {
    '@type': 'WebSite',
    '@id': SITE_ID,
    name: SITE_NAME,
    url: `${SITE_ORIGIN}/`,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

export function webPageNode(meta) {
  return {
    '@type': 'WebPage',
    '@id': `${absoluteUrl(meta.path)}#webpage`,
    url: absoluteUrl(meta.path),
    name: meta.title,
    description: meta.description,
    isPartOf: { '@id': SITE_ID },
    inLanguage: 'en',
  };
}

/**
 * @param {Array<{name: string, path: string}>} trail  ordered, root first
 */
export function breadcrumbNode(trail) {
  const deduped = dedupeTrail(trail || []);
  if (deduped.length < 2) return null;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${absoluteUrl(deduped[deduped.length - 1].path)}#breadcrumb`,
    itemListElement: deduped.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.path),
    })),
  };
}

/**
 * A toolbox page. Modelled as Article rather than TechArticle: these are
 * clinical practice guides, not software documentation.
 */
export function articleNode(meta) {
  return {
    '@type': 'Article',
    '@id': `${absoluteUrl(meta.path)}#article`,
    headline: meta.heading || meta.title,
    description: meta.description,
    inLanguage: 'en',
    isPartOf: { '@id': SITE_ID },
    mainEntityOfPage: { '@id': `${absoluteUrl(meta.path)}#webpage` },
    author: { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    ...(meta.image ? { image: absoluteUrl(meta.image) } : {}),
  };
}

/**
 * @param {Array<{question: string, answer: string}>} entries
 */
export function faqNode(entries, path) {
  if (!entries || !entries.length) return null;
  return {
    '@type': 'FAQPage',
    '@id': `${absoluteUrl(path)}#faq`,
    mainEntity: entries.map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: { '@type': 'Answer', text: entry.answer },
    })),
  };
}

/**
 * The /publications page is a curated list of peer-reviewed work. Each entry
 * links out to the journal, so ScholarlyArticle with a url is accurate.
 *
 * @param {Array<{name: string, url: string, citation?: string}>} items
 */
export function publicationListNode(items, path) {
  if (!items || !items.length) return null;
  return {
    '@type': 'ItemList',
    '@id': `${absoluteUrl(path)}#publications`,
    name: 'Neoflix publications',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'ScholarlyArticle',
        name: item.name,
        url: item.url,
        ...(item.citation ? { description: item.citation } : {}),
      },
    })),
  };
}

/**
 * Assemble the page's @graph. Site-wide nodes first, then page-specific ones;
 * nulls are dropped so callers can pass optional builders inline.
 */
export function buildGraph(...nodes) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationNode(), webSiteNode(), ...nodes.filter(Boolean)],
  };
}
