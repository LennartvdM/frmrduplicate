/**
 * astText.js — plain-text extraction from the compiled docs AST.
 *
 * 60 of the 74 toolbox pages carry no frontmatter description, so their meta
 * description is derived from the opening prose instead. Shared by the browser
 * head manager and the Node prerenderer, hence plain ESM.
 *
 * Node shapes come from scripts/build-docs.mjs. Text lives in `value` on leaf
 * nodes; everything else nests through `children`.
 */

/** Block types that carry no readable prose and must not seed a description. */
const OPAQUE = new Set(['figure', 'embed', 'file', 'worldmap', 'cards', 'html', 'image']);

/**
 * Heading id, for deep links into a page.
 *
 * Character-for-character identical to slugifyHeading in
 * scripts/build-docs.mjs, which stamps ids onto the compiled docs AST. Lives
 * here so the two markdown paths that do *not* go through that compiler —
 * src/utils/renderMarkdown.js at runtime and the static renderer in
 * scripts/prerender.mjs — agree with it and with each other. A fragment must
 * mean the same thing regardless of which pipeline produced the page.
 *
 * Inline markers are stripped first; these callers see raw source lines that
 * still carry **bold** and [label](url) syntax.
 */
export function slugifyHeading(text) {
  return String(text)
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_`]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export function astToPlainText(node) {
  if (!node) return '';
  if (Array.isArray(node)) return node.map(astToPlainText).join(' ');
  if (OPAQUE.has(node.type)) return '';
  if (typeof node.value === 'string') return node.value;
  if (Array.isArray(node.children)) {
    const joiner = node.type === 'paragraph' || node.type === 'heading' ? '' : ' ';
    return node.children.map(astToPlainText).join(joiner);
  }
  return '';
}

const MIN_PARAGRAPH = 40;
const MIN_HEADING = 25;
/** Below this, a lead sentence gets topped up with the list that follows it. */
const ENRICH_BELOW = 90;

const clean = (node) => astToPlainText(node).replace(/\s+/g, ' ').trim();

/**
 * A page's own words, for use as its meta description.
 *
 * Prose first — but a good number of toolbox pages open with a descriptive
 * sub-heading and go straight into a checklist, with no paragraph anywhere
 * ("File Transfer and Backup: Secure storage and redundancy for protecting
 * recordings.", then four bullets). Reading only paragraphs left those pages
 * falling back to the generic toolbox blurb, so five URLs shared one
 * description. Headings and list items are real page content; they are worth
 * strictly more than boilerplate.
 */
export function firstParagraphText(ast) {
  const children = ast?.children || [];

  const lead =
    children.filter((n) => n.type === 'paragraph').map(clean).find((t) => t.length >= MIN_PARAGRAPH) ||
    children
      .filter((n) => n.type === 'heading' && (n.depth || 2) >= 2)
      .map(clean)
      .find((t) => t.length >= MIN_HEADING) ||
    '';

  if (lead.length >= ENRICH_BELOW) return lead;

  // Top up from the lists that follow, which on these pages carry the substance
  // the heading only announces. Walk successive lists rather than just the
  // first: a page can open with a one-line ordered item ("Opening
  // Observation:") whose actual content sits in the list beneath it.
  const parts = lead ? [lead] : [];
  let length = lead.length;
  for (const node of children) {
    if (length >= ENRICH_BELOW) break;
    if (node.type !== 'list') continue;
    for (const item of node.children || []) {
      const text = clean(item);
      if (!text) continue;
      parts.push(text);
      length += text.length + 1;
      if (length >= ENRICH_BELOW) break;
    }
  }
  if (parts.length) {
    const joined = parts.join(' ').replace(/\s+/g, ' ').trim();
    if (joined.length >= MIN_HEADING) return joined;
  }
  if (lead) return lead;

  // Last resort: any non-empty paragraph, however short.
  return children.filter((n) => n.type === 'paragraph').map(clean).find(Boolean) || '';
}

/**
 * Question/answer pairs from a GitBook <details> FAQ page.
 *
 * The source pattern (docs-content/welcome/quick-start/faqs.md) is a paragraph
 * whose only content is bold text ending in "?", followed by a list whose first
 * item holds the answer. Anything that does not match that shape is skipped, so
 * a rewrite upstream degrades to "no FAQ schema" rather than to wrong schema.
 */
export function extractFaqEntries(ast) {
  const children = ast?.children || [];
  const entries = [];

  for (let i = 0; i < children.length; i += 1) {
    const node = children[i];
    if (node.type !== 'paragraph') continue;
    const only = (node.children || []).filter((c) => c.type !== 'text' || c.value.trim());
    if (only.length !== 1 || only[0].type !== 'strong') continue;

    const question = astToPlainText(only[0]).replace(/\s+/g, ' ').trim();
    if (!question.endsWith('?')) continue;

    const next = children[i + 1];
    if (!next || next.type !== 'list') continue;
    const items = (next.children || []).map((item) =>
      astToPlainText(item).replace(/\s+/g, ' ').trim()
    );
    if (!items.length) continue;

    // Several entries lead with a "Considerations:" caveat and put the real
    // reply in a second bullet, so prefer the item that is labelled as the
    // answer and only fall back to the first bullet when none is.
    const labelled = items.find((text) => /^Answer\s*:/i.test(text));
    const answer = (labelled || items[0])
      .replace(/^(Answer|Considerations)\s*:\s*/i, '')
      .trim();
    if (answer.length < 20) continue;

    entries.push({ question, answer });
  }

  return entries;
}
