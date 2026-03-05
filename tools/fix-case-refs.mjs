/**
 * Fix case mismatches between file references and actual filenames on disk.
 *
 * The webcopy tool preserved the original mixed-case Framer filenames in HTML
 * src/href attributes, but the files on disk were lowercased. This script:
 *
 *   1. Lowercases the sites directory path in HTML files
 *      (2onVJKQnRbkHDnsZRykAoO → neoflix)
 *   2. Lowercases .mjs filenames in HTML references
 *   3. Lowercases import() paths inside .mjs files
 *   4. Fixes the worldmap SVG image path in HTML files
 *      (LennartvdM/kaart/main/worldmap.svg → lennartvdm/kaart/main/worldmap.svg)
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const SITE_DIR = "sites/neoflix";

let totalFixes = 0;

// ── Fix HTML files ──────────────────────────────────────────
const HTML_FILES = [
  "index.htm",
  "neoflix.html",
  "publications.html",
  "toolbox.html",
  "formatted/index.htm",
  "formatted/neoflix.html",
  "formatted/publications.html",
  "formatted/toolbox.html",
];

console.log("Fixing case mismatches in HTML files...\n");

for (const file of HTML_FILES) {
  let html;
  try {
    html = readFileSync(file, "utf-8");
  } catch {
    continue; // skip missing files
  }
  const original = html;
  let fixes = 0;

  // Fix directory name: 2onVJKQnRbkHDnsZRykAoO → neoflix
  html = html.replace(/2onVJKQnRbkHDnsZRykAoO/g, () => {
    fixes++;
    return "neoflix";
  });

  // Fix .mjs filenames in src/href attributes (lowercase the filename part)
  // Matches patterns like: sites/neoflix/SomeMixedCase.HASH.mjs
  html = html.replace(
    /(sites\/neoflix\/)([A-Za-z0-9_-]+\.[A-Za-z0-9_]+\.mjs)/g,
    (match, prefix, filename) => {
      const lower = filename.toLowerCase();
      if (lower !== filename) {
        fixes++;
        return prefix + lower;
      }
      return match;
    }
  );

  // Also fix chunk references (chunk-HASH.mjs pattern)
  html = html.replace(
    /(sites\/neoflix\/)(chunk-[A-Za-z0-9]+\.mjs)/g,
    (match, prefix, filename) => {
      const lower = filename.toLowerCase();
      if (lower !== filename) {
        fixes++;
        return prefix + lower;
      }
      return match;
    }
  );

  // Fix script_main reference
  html = html.replace(
    /(sites\/neoflix\/)(script_main\.[A-Za-z0-9]+\.mjs)/g,
    (match, prefix, filename) => {
      const lower = filename.toLowerCase();
      if (lower !== filename) {
        fixes++;
        return prefix + lower;
      }
      return match;
    }
  );

  // Fix worldmap SVG path: LennartvdM/kaart/main/worldmap.svg → lennartvdm/kaart/main/worldmap.svg
  html = html.replace(
    /LennartvdM\/kaart\/main\/worldmap\.svg/g,
    () => {
      fixes++;
      return "lennartvdm/kaart/main/worldmap.svg";
    }
  );

  if (html !== original) {
    writeFileSync(file, html);
    console.log(`  ${file}: ${fixes} fixes`);
    totalFixes += fixes;
  }
}

// ── Fix .mjs import paths ───────────────────────────────────
console.log("\nFixing import paths in .mjs files...\n");

const mjsFiles = readdirSync(SITE_DIR).filter((f) => f.endsWith(".mjs"));

for (const file of mjsFiles) {
  const filePath = join(SITE_DIR, file);
  let code = readFileSync(filePath, "utf-8");
  const original = code;
  let fixes = 0;

  // Fix dynamic imports: import("./MixedCase.HASH.mjs") → import("./lowercase.hash.mjs")
  code = code.replace(
    /import\("\.\/([A-Za-z0-9_-]+\.[A-Za-z0-9_]+\.mjs)"\)/g,
    (match, filename) => {
      const lower = filename.toLowerCase();
      if (lower !== filename) {
        fixes++;
        return `import("./${lower}")`;
      }
      return match;
    }
  );

  // Fix chunk dynamic imports: import("./chunk-HASH.mjs")
  code = code.replace(
    /import\("\.\/chunk-([A-Za-z0-9]+)\.mjs"\)/g,
    (match, hash) => {
      const lower = hash.toLowerCase();
      if (lower !== hash) {
        fixes++;
        return `import("./chunk-${lower}.mjs")`;
      }
      return match;
    }
  );

  // Fix static imports: from"./MixedCase.mjs" or from "./MixedCase.mjs"
  code = code.replace(
    /from\s*"\.\/([A-Za-z0-9_-]+\.[A-Za-z0-9_]+\.mjs)"/g,
    (match, filename) => {
      const lower = filename.toLowerCase();
      if (lower !== filename) {
        fixes++;
        return `from"./${lower}"`;
      }
      return match;
    }
  );

  // Fix chunk static imports: from"./chunk-HASH.mjs"
  code = code.replace(
    /from\s*"\.\/chunk-([A-Za-z0-9]+)\.mjs"/g,
    (match, hash) => {
      const lower = hash.toLowerCase();
      if (lower !== hash) {
        fixes++;
        return `from"./chunk-${lower}.mjs"`;
      }
      return match;
    }
  );

  if (code !== original) {
    writeFileSync(filePath, code);
    console.log(`  ${filePath}: ${fixes} fixes`);
    totalFixes += fixes;
  }
}

console.log(`\nDone! ${totalFixes} total case fixes across all files.`);
