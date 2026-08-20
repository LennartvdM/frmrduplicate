import toolboxPages from '../data/toolboxPages';
import legacySlugMap from '../data/legacySlugMap';
import { pageMeta } from '../data/docsIndex';

/**
 * Render markdown text to HTML.
 *
 * Block-level support (line-based):
 * - `### heading` → <h3>
 * - `## heading`  → <h2>
 * - `---`         → <hr/>
 * - `- item` or `* item` (consecutive) → <ul><li>…</li>…</ul>
 * - `1. item` (consecutive)            → <ol><li>…</li>…</ol>
 * - Blank line separates <p> blocks; single newline within a paragraph
 *   becomes a soft break (no <br/> — browsers wrap naturally).
 *
 * Inline support:
 * - **bold**, *italic*
 * - [label](url) with toolbox link resolution (see below).
 *
 * Toolbox link patterns (all resolve to internal /toolbox/{slug} routes):
 * - [label](/Toolbox-{slug})               — legacy
 * - [label](./Toolbox-{slug})              — legacy relative
 * - [label](/toolbox/{slug})                — canonical
 * - [label](https://docs.neoflix.care/...)  — resolved via registry
 * Other links (mailto:, http(s):) pass through with external treatment.
 */
export function renderMarkdown(text) {
  if (!text) return '';

  const lines = text.split('\n');
  const blocks = [];
  let paragraph = [];
  let list = null; // { type: 'ul' | 'ol', items: string[] }

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push(`<p>${paragraph.join(' ')}</p>`);
      paragraph = [];
    }
  };

  const flushList = () => {
    if (list) {
      const li = list.items.map((i) => `<li>${renderInline(i)}</li>`).join('');
      blocks.push(`<${list.type}>${li}</${list.type}>`);
      list = null;
    }
  };

  for (const raw of lines) {
    const line = raw.trim();

    if (line === '') {
      flushParagraph();
      flushList();
      continue;
    }

    if (line === '---' || line === '***') {
      flushParagraph();
      flushList();
      blocks.push('<hr/>');
      continue;
    }

    const h3 = line.match(/^###\s+(.+)$/);
    if (h3) {
      flushParagraph();
      flushList();
      blocks.push(`<h3>${renderInline(h3[1])}</h3>`);
      continue;
    }

    const h2 = line.match(/^##\s+(.+)$/);
    if (h2) {
      flushParagraph();
      flushList();
      blocks.push(`<h2>${renderInline(h2[1])}</h2>`);
      continue;
    }

    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) {
      flushParagraph();
      if (!list || list.type !== 'ul') {
        flushList();
        list = { type: 'ul', items: [] };
      }
      list.items.push(ul[1]);
      continue;
    }

    const ol = line.match(/^(\d+)\.\s+(.+)$/);
    if (ol) {
      flushParagraph();
      if (!list || list.type !== 'ol') {
        flushList();
        list = { type: 'ol', items: [] };
      }
      list.items.push(ol[2]);
      continue;
    }

    // Plain text — part of a paragraph. Flush any open list first.
    flushList();
    paragraph.push(renderInline(line));
  }
  flushParagraph();
  flushList();

  return blocks.join('\n');
}

function renderInline(str) {
  return str
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, url) => {
      // Legacy /Toolbox-SlugName → look up new path-based slug
      const legacy = url.match(/^\.?\/Toolbox[-_](.+)$/);
      if (legacy) {
        const legacySlug = legacy[1].replace(/_/g, '-');
        const mapped = legacySlugMap[legacySlug] ?? legacySlugMap[legacySlug.toLowerCase()];
        const target = mapped != null ? mapped : legacySlug;
        return `<a href="/toolbox/${target}" data-internal="true">${label}</a>`;
      }
      const canonical = url.match(/^\/toolbox\/(.*)$/);
      if (canonical) {
        // Canonical may still use a legacy slug — translate if known
        const rest = canonical[1];
        const mapped = legacySlugMap[rest] ?? legacySlugMap[rest.toLowerCase()];
        const target = mapped != null ? mapped : rest;
        return `<a href="/toolbox/${target}" data-internal="true">${label}</a>`;
      }
      if (/docs\.neoflix\.care/i.test(url)) {
        const matched = findSlugFromGitBookUrl(url);
        if (matched) {
          const mapped = legacySlugMap[matched.slug] ?? legacySlugMap[matched.slug.toLowerCase()];
          const target = mapped != null ? mapped : matched.slug;
          return `<a href="/toolbox/${target}" data-internal="true">${label}</a>`;
        }
        // Try full-path match against the new slug space
        const pathMatch = url.match(/docs\.neoflix\.care\/?(.*)$/i);
        if (pathMatch) {
          const path = pathMatch[1].replace(/\/+$/, '');
          if (pageMeta[path]) {
            return `<a href="/toolbox/${path}" data-internal="true">${label}</a>`;
          }
        }
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
      }
      if (url.startsWith('mailto:')) {
        return `<a href="${url}">${label}</a>`;
      }
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${label}</a>`;
    });
}

/**
 * Try to find a matching slug in the toolboxPages registry from a GitBook URL.
 */
function findSlugFromGitBookUrl(url) {
  const normalized = url.replace(/\/+$/, '').toLowerCase();
  for (const page of toolboxPages) {
    const pageUrl = page.url.replace(/\/+$/, '').toLowerCase();
    if (normalized === pageUrl) return page;
    const pagePath = pageUrl.replace('https://docs.neoflix.care', '');
    if (pagePath && normalized.endsWith(pagePath)) return page;
  }
  return null;
}
