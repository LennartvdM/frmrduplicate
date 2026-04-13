/**
 * HTML Cleanup Script
 *
 * Formats the Framer-exported HTML files:
 * 1. Breaks mega-lines into properly indented HTML
 * 2. Extracts inline <style> blocks into separate CSS files
 * 3. Extracts inline <script> blocks into separate JS files
 * 4. Formats the HTML with proper indentation
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename } from "path";

const HTML_FILES = [
  "index.htm",
  "neoflix.html",
  "publications.html",
  "toolbox.html",
];

const EXTRACTED_DIR = "extracted";

if (!existsSync(EXTRACTED_DIR)) {
  mkdirSync(EXTRACTED_DIR, { recursive: true });
}

for (const file of HTML_FILES) {
  console.log(`\nProcessing ${file}...`);
  const raw = readFileSync(file, "utf-8");

  // Remove BOM if present
  let html = raw.replace(/^\uFEFF/, "");

  const pageName = basename(file, file.endsWith(".htm") ? ".htm" : ".html");

  // ── Step 1: Split concatenated tags on line 30 ──
  // The huge lines have multiple tags concatenated without newlines.
  // Insert newlines between consecutive tags: >< → >\n<
  html = html.replace(/>\s*</g, ">\n<");

  // ── Step 2: Extract <style> blocks ──
  let styleCount = 0;
  html = html.replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, (match, content) => {
    styleCount++;
    const cssFileName = `${pageName}.style${styleCount > 1 ? styleCount : ""}.css`;
    const cssPath = join(EXTRACTED_DIR, cssFileName);

    // Format the CSS: split rules onto separate lines
    let css = content.trim();
    // Add newlines after } (but not within nested rules)
    css = css.replace(/\}/g, "}\n");
    // Add newlines after ; inside rules (basic formatting)
    css = css.replace(/;(?!\s*\n)/g, ";\n  ");
    // Break up at rule boundaries
    css = css.replace(/([^{])\{/g, "$1 {\n  ");

    writeFileSync(cssPath, css.trim() + "\n");
    console.log(`  → extracted ${cssFileName} (${(css.length / 1024).toFixed(1)}KB)`);
    return `<link rel="stylesheet" href="${EXTRACTED_DIR}/${cssFileName}">`;
  });

  // ── Step 3: Extract inline <script> blocks (not external src scripts) ──
  let scriptCount = 0;
  html = html.replace(/<script(?![^>]*\bsrc\b)(?![^>]*type="framer)[^>]*>([\s\S]*?)<\/script>/gi, (match, content) => {
    if (!content.trim()) return match; // Skip empty scripts
    scriptCount++;
    const jsFileName = `${pageName}.script${scriptCount > 1 ? scriptCount : ""}.js`;
    const jsPath = join(EXTRACTED_DIR, jsFileName);

    writeFileSync(jsPath, content.trim() + "\n");
    console.log(`  → extracted ${jsFileName} (${(content.length / 1024).toFixed(1)}KB)`);
    return `<script src="${EXTRACTED_DIR}/${jsFileName}"></script>`;
  });

  // ── Step 4: Format the #main div ──
  // The #main div contains SSR content as a massive blob.
  // We'll keep it but add line breaks between top-level elements.
  html = html.replace(/(<div id="main"[^>]*>)([\s\S]*?)(<\/div>\s*(?:<script|$))/i, (match, openTag, content, after) => {
    // Don't try to deeply format SSR content — just add some structure
    let formatted = content;
    // Break at major element boundaries
    formatted = formatted.replace(/(<\/div>)(<div\s)/g, "$1\n$2");
    formatted = formatted.replace(/(<\/section>)(<section\s)/g, "$1\n$2");
    formatted = formatted.replace(/(<\/nav>)(<div\s)/g, "$1\n$2");
    return openTag + "\n" + formatted + "\n" + after;
  });

  // ── Step 5: Basic HTML indentation ──
  // Split into lines and add proper indentation
  const lines = html.split("\n");
  const formatted = [];
  let indent = 0;

  for (let line of lines) {
    line = line.trim();
    if (!line) continue;

    // Decrease indent for closing tags
    if (/^<\/(html|head|body)>/i.test(line)) {
      indent = Math.max(0, indent - 1);
    }

    // Add indentation
    const prefix = "    ".repeat(indent);

    // Don't indent very long lines (SSR content) — keep them flat
    if (line.length > 500) {
      formatted.push(line);
    } else {
      formatted.push(prefix + line);
    }

    // Increase indent after opening tags (simplified)
    if (/^<(html|head|body)\b/i.test(line) && !line.includes("</")) {
      indent++;
    }
  }

  // ── Step 6: Write formatted HTML ──
  const formattedDir = "formatted";
  if (!existsSync(formattedDir)) {
    mkdirSync(formattedDir, { recursive: true });
  }

  const outPath = join(formattedDir, file);
  writeFileSync(outPath, formatted.join("\n") + "\n");
  console.log(`  ✓ Written formatted ${outPath}`);
  console.log(`    ${lines.length} lines → ${formatted.length} lines`);
}

console.log("\n✓ HTML cleanup complete");
console.log("  Formatted HTML in: formatted/");
console.log("  Extracted assets in: extracted/");
