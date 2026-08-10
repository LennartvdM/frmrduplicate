/**
 * astToHtml.mjs — renders the compiled docs AST to static HTML.
 *
 * This is the build-time twin of src/components/docs/DocsNode.jsx: same node
 * types, same element choices, same class names, so the prerendered markup
 * picks up docs.css and reads as the real page rather than as raw text. React
 * replaces it wholesale on mount (see src/main.jsx), so the two only have to
 * agree closely enough to avoid a jarring swap — not byte for byte.
 *
 * Interactive blocks (tabs, the world map, video embeds) have no static
 * equivalent. They degrade to their text content or to a plain link, which is
 * what a crawler could use anyway.
 */

const VOID_SAFE_ATTR = /["&<>]/g;

export function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function escapeAttr(value = '') {
  return String(value).replace(VOID_SAFE_ATTR, (ch) => ({
    '"': '&quot;',
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  }[ch]));
}

function children(node, ctx) {
  return (node.children || []).map((child) => renderNode(child, ctx)).join('');
}

function renderNode(node, ctx = {}) {
  if (!node) return '';
  if (Array.isArray(node)) return node.map((n) => renderNode(n, ctx)).join('');

  switch (node.type) {
    case 'root':
      return children(node, ctx);

    case 'paragraph':
      return `<p>${children(node, ctx)}</p>`;

    case 'heading': {
      const depth = Math.min(Math.max(node.depth || 2, 1), 6);
      // The page's own <h1> is the docs title, so in-body headings start at h2
      // to keep a single top-level heading per document.
      const level = Math.max(depth, 2);
      const id = node.id ? ` id="${escapeAttr(node.id)}"` : '';
      return `<h${level}${id}>${children(node, ctx)}</h${level}>`;
    }

    case 'text':
      return escapeHtml(node.value);

    case 'strong':
      return `<strong>${children(node, ctx)}</strong>`;
    case 'emphasis':
      return `<em>${children(node, ctx)}</em>`;
    case 'delete':
      return `<del>${children(node, ctx)}</del>`;
    case 'inlineCode':
      return `<code>${escapeHtml(node.value)}</code>`;
    case 'break':
      return '<br/>';
    case 'thematicBreak':
      return '<hr/>';

    case 'link': {
      const href = escapeAttr(node.href || '#');
      const rel = node.internal ? '' : ' rel="noopener noreferrer"';
      const target = node.internal ? '' : ' target="_blank"';
      const flag = node.internal ? ' data-internal="true"' : '';
      return `<a href="${href}"${flag}${target}${rel}>${children(node, ctx)}</a>`;
    }

    case 'image':
      return `<img src="${escapeAttr(node.src)}" alt="${escapeAttr(node.alt || '')}" loading="lazy" decoding="async"/>`;

    case 'list': {
      if (node.ordered) {
        const start = node.start ? ` start="${escapeAttr(node.start)}"` : '';
        return `<ol${start}>${children(node, ctx)}</ol>`;
      }
      return `<ul>${children(node, ctx)}</ul>`;
    }
    case 'listItem':
      return `<li>${children(node, ctx)}</li>`;

    case 'blockquote':
      return `<blockquote>${children(node, ctx)}</blockquote>`;

    case 'code':
      return `<pre><code>${escapeHtml(node.value)}</code></pre>`;

    case 'table':
      return `<table>${children(node, ctx)}</table>`;
    case 'tableRow':
      return `<tr>${children(node, ctx)}</tr>`;
    case 'tableCell':
      return `<td>${children(node, ctx)}</td>`;

    case 'hint':
      return `<aside class="docs-hint docs-hint--${escapeAttr(node.style || 'info')}">${children(node, ctx)}</aside>`;

    case 'tabs':
      // No tab UI without JS; emit every panel so all of the copy is readable.
      return `<div class="docs-tabs">${children(node, ctx)}</div>`;
    case 'tab':
      return `<section class="docs-tab"><h3>${escapeHtml(node.title || '')}</h3>${children(node, ctx)}</section>`;

    case 'embed': {
      // A <div>, not a <p>: 9 of the 10 embeds in the corpus have block-level
      // children (headings, lists, tables), and an HTML parser auto-closes a
      // <p> at the first block child — which would push the rest of the embed
      // out of its own container. The anchor wrapper matches what
      // components/docs/blocks/Embed.jsx renders, so docs.css styles both the
      // same way.
      const url = escapeAttr(node.url || '');
      const caption = children(node, ctx);
      return `<div class="docs-embed"><a href="${url}" target="_blank" rel="noopener noreferrer">${caption || escapeHtml(node.url || '')}</a></div>`;
    }

    case 'file':
      return `<p class="docs-file"><a href="${escapeAttr(node.src || '')}" download>${escapeHtml(node.name || 'Download')}</a></p>`;

    case 'figure': {
      const caption = node.caption
        ? `<figcaption>${escapeHtml(node.caption)}</figcaption>`
        : '';
      return `<figure><img src="${escapeAttr(node.src)}" alt="${escapeAttr(node.alt || '')}" loading="lazy" decoding="async"/>${caption}</figure>`;
    }

    case 'cards': {
      const items = (node.cards || [])
        .map((card) => {
          const href = escapeAttr(card.href || '');
          // Card bodies are HTML fragments lifted straight out of the GitBook
          // table markup, so they are emitted as-is like the React renderer does.
          const body = card.body || '';
          return `<li class="docs-card"><a href="${href}"${/^https?:/i.test(card.href || '') ? ' target="_blank" rel="noopener noreferrer"' : ' data-internal="true"'}>${body}</a></li>`;
        })
        .join('');
      return `<ul class="docs-cards">${items}</ul>`;
    }

    case 'worldmap':
      return '';

    case 'html':
      // Trusted: produced by our own build-docs transform from our own docs repo.
      return node.value || '';

    default:
      return '';
  }
}

export function astToHtml(ast) {
  return renderNode(ast, {});
}

export default astToHtml;
