/**
 * Toolbox page generator
 *
 * Generates all toolbox HTML pages from:
 *   1. toolbox.html — the shared template (head boilerplate, body scripts)
 *   2. toolbox-page-data.json — per-page SSR data (head metadata/CSS, #main div)
 *   3. docs-links.mjs — the centralized GitBook URL mapping
 *
 * Usage: node generate-toolbox-pages.mjs
 *
 * CMS integration:
 *   - To change a docs URL: edit docs-links.mjs, run this script
 *   - To add a new page: add entry to docs-links.mjs + toolbox-page-data.json, run this script
 *   - The generator patches the iframe src in the SSR content to match docs-links.mjs
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import { DOCS_LINKS, DOCS_BASE } from "./docs-links.mjs";

// ═══════════════════════════════════════════════════════════════
// Template + data files
// ═══════════════════════════════════════════════════════════════

const TEMPLATE_FILE = "toolbox.html";
const PAGE_DATA_FILE = "toolbox-page-data.json";

// Split markers — stable across all pages
const HEAD_SPLIT = '<meta name="robots"';
const MAIN_START = '<div id="main"';
const MAIN_END_MARKER = '\n    <script data-framer-appear';

function routePathToFilename(routePath) {
  return routePath.replace(/^\//, "").toLowerCase().replace(/:_/g, "_").replace(/:/g, "_") + ".html";
}

function generate() {
  if (!existsSync(TEMPLATE_FILE)) {
    console.error(`Template ${TEMPLATE_FILE} not found. Cannot generate without template.`);
    process.exit(1);
  }
  if (!existsSync(PAGE_DATA_FILE)) {
    console.error(`${PAGE_DATA_FILE} not found. Run the extract script first.`);
    process.exit(1);
  }

  const template = readFileSync(TEMPLATE_FILE, "utf-8");
  const pageData = JSON.parse(readFileSync(PAGE_DATA_FILE, "utf-8"));

  // Split the template into shared parts
  const headSplitIdx = template.indexOf(HEAD_SPLIT);
  const headEndIdx = template.indexOf("</head>");
  const mainStartIdx = template.indexOf(MAIN_START);
  const mainEndIdx = template.indexOf(MAIN_END_MARKER);

  if (headSplitIdx === -1 || mainStartIdx === -1 || mainEndIdx === -1) {
    console.error("Could not find split markers in template");
    process.exit(1);
  }

  // Shared parts of every page
  const sharedHeadBefore = template.substring(0, headSplitIdx);  // doctype through fonts preconnect
  const sharedBodyFromHead = template.substring(headEndIdx + "</head>".length, mainStartIdx); // </head>...<body>...bodyStart up to #main
  const sharedBodyAfterMain = template.substring(mainEndIdx);    // scripts after #main

  let generated = 0;

  for (const [routePath, data] of Object.entries(pageData)) {
    const docsPath = DOCS_LINKS[routePath];
    const filename = routePathToFilename(routePath);

    // Reassemble: shared head + page-specific head + </head> + shared body + page main + shared scripts
    let html = sharedHeadBefore + data.headSpecific + "</head>" + sharedBodyFromHead + data.mainDiv + sharedBodyAfterMain;

    // Patch the body class (template has /Toolbox's class, each page has its own)
    if (data.bodyClass) {
      html = html.replace("framer-body-x05wlhCdy", data.bodyClass);
    }

    // If the docs URL in docs-links.mjs differs from what's baked in the SSR,
    // patch the iframe src. This is the key CMS feature — change the URL in
    // docs-links.mjs and the generated page picks it up.
    if (docsPath) {
      const newDocsUrl = DOCS_BASE + docsPath;
      // Find any docs.neoflix.care URL in the main div and replace
      html = html.replace(
        /iframe src="https:\/\/docs\.neoflix\.care[^"]*"/,
        `iframe src="${newDocsUrl}"`
      );
    }

    writeFileSync(filename, html);
    generated++;
    console.log(`  ✓ ${filename}`);
  }

  console.log(`\n✓ Generated ${generated} toolbox pages from template + page data`);
  console.log(`  Template: ${TEMPLATE_FILE}`);
  console.log(`  Page data: ${PAGE_DATA_FILE}`);
  console.log(`  Docs URLs: docs-links.mjs`);
}

generate();
