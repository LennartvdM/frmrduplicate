import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { pageMeta, resolveSlug, getPage } from '../data/docsIndex';
import { resolveRouteMeta } from '../data/routeMeta';
import { recordForSlug } from '../data/publicationRecords';

/**
 * Keeps <title> and the head's meta tags in step with the current route.
 *
 * The build writes a correct head into each route's HTML file, which is
 * what crawlers and link-preview scrapers read. This handles the other
 * half: once the app is running, navigation is client-side and the
 * document keeps whichever head it was served with. Without this, moving
 * from /publications to /toolbox leaves the publications title in the
 * tab and the publications URL in the canonical.
 *
 * Tags are rewritten in place rather than replaced, so the ones already
 * in index.html stay put and no duplicates accumulate across navigations.
 */
export default function useDocumentMeta() {
  const { pathname } = useLocation();

  useEffect(() => {
    const meta = resolveRouteMeta(pathname, {
      docsPages: pageMeta,
      resolveSlug,
      leadTextFor: leadParagraphFor,
      // Same resolver the build uses, so a paper reached by clicking
      // ends up with the head it would have had on a direct visit.
      paperFor: (slug) => recordForSlug(slug)?.record || null,
    });

    document.title = meta.title;
    setMeta('name', 'description', meta.description);
    setLink('canonical', meta.canonical);

    setMeta('property', 'og:url', meta.canonical);
    setMeta('property', 'og:title', meta.title);
    setMeta('property', 'og:description', meta.description);
    setMeta('property', 'og:image', meta.image);
    setMeta('property', 'og:image:alt', meta.imageAlt);

    setMeta('name', 'twitter:url', meta.canonical);
    setMeta('name', 'twitter:title', meta.title);
    setMeta('name', 'twitter:description', meta.description);
    setMeta('name', 'twitter:image', meta.image);
    setMeta('name', 'twitter:image:alt', meta.imageAlt);
  }, [pathname]);
}

/**
 * Opening paragraph of a toolbox page, for the 60 of 74 that carry no
 * description in their front matter. Mirrors the extraction the build
 * script does, so a page reads the same whether it was server-rendered
 * into HTML or reached by clicking through the app.
 */
function leadParagraphFor(slug) {
  const page = getPage(slug);
  return page?.ast ? firstParagraphText(page.ast) : '';
}

export function firstParagraphText(node) {
  if (!node || typeof node !== 'object') return '';
  if (node.type === 'paragraph') {
    const text = collectText(node);
    if (text.trim()) return text;
  }
  for (const child of node.children || []) {
    const found = firstParagraphText(child);
    if (found) return found;
  }
  return '';
}

function collectText(node) {
  if (!node || typeof node !== 'object') return '';
  if (typeof node.value === 'string') return node.value;
  return (node.children || []).map(collectText).join('');
}

function setMeta(attr, key, value) {
  if (!value) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function setLink(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
