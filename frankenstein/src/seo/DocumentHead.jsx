/**
 * DocumentHead — keeps <head> honest across client-side navigations.
 *
 * scripts/prerender.mjs bakes the correct tags into the HTML that ships for
 * each URL, which is what crawlers and social unfurlers read. Once React takes
 * over, react-router swaps routes without a document load, so nothing would
 * update <head> again. This component closes that gap: on every location
 * change it rewrites title, description, canonical, robots, the Open Graph and
 * Twitter blocks, and the JSON-LD graph.
 *
 * It renders nothing.
 */
import { useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  DEFAULT_OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  SITE_NAME,
  absoluteUrl,
  clampDescription,
  docsSlugForPath,
  metaForPath,
  normalizePath,
  pathForDocsSlug,
} from './siteMeta';
import {
  articleNode,
  breadcrumbNode,
  buildGraph,
  faqNode,
  serializeJsonLd,
  webPageNode,
} from './structuredData';
import { extractFaqEntries, firstParagraphText } from './astText';
import { breadcrumbFor, getPage, pageMeta, resolveSlug } from '../data/docsIndex';

const JSON_LD_ID = 'ld-json';

function upsertTag(selector, create, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  for (const [key, value] of Object.entries(attrs)) {
    if (value == null) el.removeAttribute(key);
    else el.setAttribute(key, value);
  }
  return el;
}

function setMetaByName(name, content) {
  if (content == null) {
    document.head.querySelector(`meta[name="${name}"]`)?.remove();
    return;
  }
  upsertTag(`meta[name="${name}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('name', name);
    return el;
  }, { content });
}

function setMetaByProperty(property, content) {
  if (content == null) {
    document.head.querySelector(`meta[property="${property}"]`)?.remove();
    return;
  }
  upsertTag(`meta[property="${property}"]`, () => {
    const el = document.createElement('meta');
    el.setAttribute('property', property);
    return el;
  }, { content });
}

function setCanonical(href) {
  if (!href) {
    document.head.querySelector('link[rel="canonical"]')?.remove();
    return;
  }
  upsertTag('link[rel="canonical"]', () => {
    const el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    return el;
  }, { href });
}

function setJsonLd(graph) {
  const existing = document.getElementById(JSON_LD_ID);
  if (!graph) {
    existing?.remove();
    return;
  }
  const script = existing || document.createElement('script');
  script.id = JSON_LD_ID;
  script.type = 'application/ld+json';
  script.textContent = serializeJsonLd(graph);
  if (!existing) document.head.appendChild(script);
}

/**
 * Resolve a toolbox slug the same way DocsPage does, so legacy and
 * differently-cased URLs report the canonical page's metadata — and point their
 * canonical link at the canonical URL rather than duplicating it.
 */
function docsLookup(rawSlug) {
  const slug = resolveSlug(rawSlug);
  const meta = pageMeta[slug];
  if (!meta) return null;
  const page = getPage(slug);
  return {
    slug,
    meta,
    fallback: page ? firstParagraphText(page.ast) : '',
  };
}

function graphFor(meta, pathname) {
  const nodes = [webPageNode(meta)];
  const rawSlug = docsSlugForPath(pathname);

  if (rawSlug !== null) {
    const slug = resolveSlug(rawSlug);
    if (pageMeta[slug]) {
      const trail = [
        { name: SITE_NAME, path: '/' },
        { name: 'Toolbox', path: '/toolbox' },
        ...breadcrumbFor(slug)
          .filter((crumb) => crumb.title)
          .map((crumb) => ({
            name: crumb.title,
            path: crumb.slug != null ? pathForDocsSlug(crumb.slug) : '/toolbox',
          })),
      ];
      const crumbs = breadcrumbNode(trail);
      if (crumbs) nodes.push(crumbs);
      if (slug) nodes.push(articleNode(meta));

      const page = getPage(slug);
      if (page) {
        const faq = faqNode(extractFaqEntries(page.ast), meta.path);
        if (faq) nodes.push(faq);
      }
    }
  }

  return buildGraph(...nodes);
}

export default function DocumentHead() {
  const location = useLocation();
  const pathname = normalizePath(location.pathname);

  // useLayoutEffect so the title changes in the same frame as the route,
  // rather than a beat behind it in the tab strip.
  useLayoutEffect(() => {
    const rawSlug = docsSlugForPath(pathname);
    const meta = metaForPath(pathname, docsLookup);

    // A legacy or oddly-cased toolbox URL resolves to a canonical slug; point
    // the canonical link at that URL so the duplicate does not compete.
    let canonical = meta.canonical;
    if (rawSlug) {
      const resolved = resolveSlug(rawSlug);
      if (pageMeta[resolved]) canonical = absoluteUrl(pathForDocsSlug(resolved));
    }

    const description = clampDescription(meta.description);
    const url = canonical || absoluteUrl(pathname);
    const image = absoluteUrl(meta.image || DEFAULT_OG_IMAGE);

    document.title = meta.title;
    setMetaByName('description', description);
    setMetaByName('robots', meta.robots || null);
    setCanonical(canonical);

    setMetaByProperty('og:type', rawSlug ? 'article' : 'website');
    setMetaByProperty('og:site_name', SITE_NAME);
    setMetaByProperty('og:url', url);
    setMetaByProperty('og:title', meta.title);
    setMetaByProperty('og:description', description);
    setMetaByProperty('og:image', image);
    setMetaByProperty('og:image:width', String(OG_IMAGE_WIDTH));
    setMetaByProperty('og:image:height', String(OG_IMAGE_HEIGHT));
    setMetaByProperty('og:image:alt', OG_IMAGE_ALT);

    setMetaByName('twitter:card', 'summary_large_image');
    setMetaByName('twitter:url', url);
    setMetaByName('twitter:title', meta.title);
    setMetaByName('twitter:description', description);
    setMetaByName('twitter:image', image);
    setMetaByName('twitter:image:alt', OG_IMAGE_ALT);

    setJsonLd(meta.robots ? null : graphFor({ ...meta, description }, pathname));
  }, [pathname]);

  return null;
}
