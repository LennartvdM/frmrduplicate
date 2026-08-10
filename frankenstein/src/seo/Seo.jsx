/**
 * Seo.jsx — per-route <head> management for the SPA.
 *
 * scripts/prerender-seo.mjs stamps the correct tags into each route's
 * HTML file at build time, so a cold load already arrives with the right
 * title, description and canonical. This component keeps them correct
 * across *client-side* navigations, where no new document is fetched.
 *
 * It mutates the tags the prerenderer emitted rather than appending new
 * ones, so the head never accumulates duplicates while routing around.
 */
import { useEffect } from 'react';
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  DEFAULT_OG_IMAGE_ALT,
  DEFAULT_TITLE,
  LOCALE,
  SITE_NAME,
  TWITTER_CARD,
  absoluteUrl,
  clampDescription,
} from './siteMeta';

const MANAGED = 'data-seo-managed';

function upsert(selector, create, apply) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    el.setAttribute(MANAGED, '');
    document.head.appendChild(el);
  }
  apply(el);
  return el;
}

function setMetaName(name, content) {
  if (content == null) {
    document.head.querySelector(`meta[name="${name}"]`)?.remove();
    return;
  }
  upsert(
    `meta[name="${name}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute('name', name);
      return el;
    },
    (el) => el.setAttribute('content', content)
  );
}

function setMetaProperty(property, content) {
  if (content == null) {
    document.head.querySelector(`meta[property="${property}"]`)?.remove();
    return;
  }
  upsert(
    `meta[property="${property}"]`,
    () => {
      const el = document.createElement('meta');
      el.setAttribute('property', property);
      return el;
    },
    (el) => el.setAttribute('content', content)
  );
}

function setLink(rel, href) {
  upsert(
    `link[rel="${rel}"]`,
    () => {
      const el = document.createElement('link');
      el.setAttribute('rel', rel);
      return el;
    },
    (el) => el.setAttribute('href', href)
  );
}

function setJsonLd(blocks) {
  const existing = document.head.querySelectorAll('script[type="application/ld+json"]');
  existing.forEach((node) => node.remove());
  if (!blocks || !blocks.length) return;
  for (const block of blocks) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute(MANAGED, '');
    // JSON.stringify already escapes quotes; the only sequence that can
    // break out of a <script> block is a literal "</", so neutralise it.
    script.textContent = JSON.stringify(block).replace(/<\//g, '<\\/');
    document.head.appendChild(script);
  }
}

/**
 * @param {string}  title       Full document title (brand suffix included).
 * @param {string}  description Meta description; clamped to ~158 chars.
 * @param {string}  path        Site-relative path used for the canonical URL.
 * @param {string}  [type]      OpenGraph type. Defaults to "website".
 * @param {boolean} [noindex]   Emit robots noindex (404s, internal tools).
 * @param {object[]}[jsonLd]    Structured-data blocks for this route.
 */
export default function Seo({
  title,
  description,
  path,
  type = 'website',
  noindex = false,
  jsonLd = null,
}) {
  const resolvedTitle = title || DEFAULT_TITLE;
  const resolvedDescription = clampDescription(description || DEFAULT_DESCRIPTION);
  const canonical = absoluteUrl(path || '/');
  const serializedJsonLd = jsonLd ? JSON.stringify(jsonLd) : '';

  useEffect(() => {
    document.title = resolvedTitle;

    setMetaName('description', resolvedDescription);
    setMetaName('robots', noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large');
    setLink('canonical', canonical);

    setMetaProperty('og:type', type);
    setMetaProperty('og:site_name', SITE_NAME);
    setMetaProperty('og:url', canonical);
    setMetaProperty('og:title', resolvedTitle);
    setMetaProperty('og:description', resolvedDescription);
    setMetaProperty('og:image', DEFAULT_OG_IMAGE);
    setMetaProperty('og:image:alt', DEFAULT_OG_IMAGE_ALT);
    setMetaProperty('og:locale', LOCALE);

    setMetaName('twitter:card', TWITTER_CARD);
    setMetaName('twitter:title', resolvedTitle);
    setMetaName('twitter:description', resolvedDescription);
    setMetaName('twitter:image', DEFAULT_OG_IMAGE);
    setMetaName('twitter:image:alt', DEFAULT_OG_IMAGE_ALT);

    setJsonLd(serializedJsonLd ? JSON.parse(serializedJsonLd) : null);
  }, [resolvedTitle, resolvedDescription, canonical, type, noindex, serializedJsonLd]);

  return null;
}
