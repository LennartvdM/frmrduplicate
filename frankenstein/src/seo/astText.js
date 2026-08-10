/**
 * astText.js — plain-text extraction from the compiled docs AST.
 *
 * Most GitBook pages carry no frontmatter description (only 14 of 74 do),
 * so meta descriptions are derived from the page's own opening prose.
 * Shared by the runtime <Seo> component and scripts/prerender-seo.mjs so
 * a page's description is identical in the prerendered HTML and after a
 * client-side navigation.
 */

/** Nodes whose text is chrome, not prose — never fold them into a description. */
const SKIP_TYPES = new Set(['code', 'html', 'file', 'worldmap', 'embed', 'image']);

/** Concatenate the text content of a node and its descendants. */
export function nodeText(node) {
  if (!node || typeof node !== 'object') return '';
  if (SKIP_TYPES.has(node.type)) return '';
  if (typeof node.value === 'string') return node.value;
  if (!Array.isArray(node.children)) return '';
  return node.children.map(nodeText).join('');
}

/**
 * First real paragraph of a page, used as its meta description.
 *
 * Walks into hints/tabs/blockquotes because several toolbox pages open
 * with a callout rather than a bare paragraph. Skips anything shorter
 * than `minLength` so one-word lead-ins ("Note:") don't win.
 */
export function leadParagraph(ast, minLength = 40) {
  let best = '';
  const visit = (node) => {
    if (!node || typeof node !== 'object' || best) return;
    if (node.type === 'paragraph') {
      const text = nodeText(node).replace(/\s+/g, ' ').trim();
      if (text.length >= minLength) {
        best = text;
        return;
      }
    }
    for (const child of node.children || []) {
      visit(child);
      if (best) return;
    }
  };
  visit(ast);
  return best;
}

/**
 * Page description with fallbacks: explicit frontmatter first, then the
 * page's opening prose. Returns '' when neither exists — callers supply
 * their own generic fallback.
 */
export function describePage(page) {
  if (!page) return '';
  const explicit = page.frontmatter?.description || page.meta?.description;
  if (explicit) return String(explicit).replace(/\s+/g, ' ').trim();
  return leadParagraph(page.ast);
}
