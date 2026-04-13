/**
 * Rewrite all external CDN URLs to local paths.
 *
 * Rewrites:
 *  1. framerusercontent.com/assets/  → ./assets/  (lowercased filename)
 *  2. framerusercontent.com/images/  → ./images/  (lowercased filename)
 *  3. app.framerstatic.com/Inter-*   → ./assets/fonts/Inter-*  (readable name)
 *  4. fonts.gstatic.com/s/           → ./assets/fonts/  (readable name)
 *  5. framerusercontent.com/third-party-assets/fontshare/ → ./assets/fonts/fontshare/
 *  6. assets.mixkit.co/...           → ./assets/mixkit-clouds-sky.mp4
 *  7. raw.githubusercontent.com/.../worldmap.svg → ./assets/worldmap.svg
 *  8. framerusercontent.com/sites/.../searchIndex-*.json → ./assets/searchIndex.json
 *
 * Also patches the font source detection in the runtime to recognize local paths.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";

const DEOB_DIR = "sites/neoflix/deobfuscated";

// ── framerstatic.com → local font mapping ──
const FRAMERSTATIC_MAP = {
  "Inter-Bold.cyrillic-6LOMBC2V.woff2":          "Inter-Bold.cyrillic.woff2",
  "Inter-Bold.cyrillic-ext-XOTVL7ZR.woff2":      "Inter-Bold.cyrillic-ext.woff2",
  "Inter-Bold.greek-YRST7ODZ.woff2":             "Inter-Bold.greek.woff2",
  "Inter-Bold.greek-ext-WXWSJXLB.woff2":         "Inter-Bold.greek-ext.woff2",
  "Inter-Bold.latin-UCM45LQF.woff2":             "Inter-Bold.latin.woff2",
  "Inter-Bold.latin-ext-BASA5UL3.woff2":         "Inter-Bold.latin-ext.woff2",
  "Inter-Bold.vietnamese-OEVJMXEP.woff2":        "Inter-Bold.vietnamese.woff2",
  "Inter-BoldItalic.cyrillic-7EIL6JWG.woff2":    "Inter-BoldItalic.cyrillic.woff2",
  "Inter-BoldItalic.cyrillic-ext-PEYDHC3S.woff2": "Inter-BoldItalic.cyrillic-ext.woff2",
  "Inter-BoldItalic.greek-TJBTLTT7.woff2":       "Inter-BoldItalic.greek.woff2",
  "Inter-BoldItalic.greek-ext-3DJOYQMH.woff2":   "Inter-BoldItalic.greek-ext.woff2",
  "Inter-BoldItalic.latin-5ZFQS4XK.woff2":       "Inter-BoldItalic.latin.woff2",
  "Inter-BoldItalic.latin-ext-FVPCPRBJ.woff2":   "Inter-BoldItalic.latin-ext.woff2",
  "Inter-BoldItalic.vietnamese-W2625PGF.woff2":   "Inter-BoldItalic.vietnamese.woff2",
  "Inter-Italic.cyrillic-BFOVMAQB.woff2":        "Inter-Italic.cyrillic.woff2",
  "Inter-Italic.cyrillic-ext-YDGMJOJO.woff2":    "Inter-Italic.cyrillic-ext.woff2",
  "Inter-Italic.greek-OJTBJNE6.woff2":           "Inter-Italic.greek.woff2",
  "Inter-Italic.greek-ext-4KOU3AHC.woff2":       "Inter-Italic.greek-ext.woff2",
  "Inter-Italic.latin-2DWX32EN.woff2":           "Inter-Italic.latin.woff2",
  "Inter-Italic.latin-ext-H4B22QN6.woff2":       "Inter-Italic.latin-ext.woff2",
  "Inter-Italic.vietnamese-TYMT6CKW.woff2":      "Inter-Italic.vietnamese.woff2",
  "Inter-Medium.cyrillic-JVU2PANX.woff2":        "Inter-Medium.cyrillic.woff2",
  "Inter-Medium.cyrillic-ext-M4WHNGTS.woff2":    "Inter-Medium.cyrillic-ext.woff2",
  "Inter-Medium.greek-DPOQGN7L.woff2":           "Inter-Medium.greek.woff2",
  "Inter-Medium.greek-ext-4KCQBEIZ.woff2":       "Inter-Medium.greek-ext.woff2",
  "Inter-Medium.latin-Y3IVPL46.woff2":           "Inter-Medium.latin.woff2",
  "Inter-Medium.latin-ext-J4DBSW7F.woff2":       "Inter-Medium.latin-ext.woff2",
  "Inter-Medium.vietnamese-PJV76O4P.woff2":      "Inter-Medium.vietnamese.woff2",
};

// ── Google Fonts → local mapping ──
const GSTATIC_MAP = {
  // Inter v13
  "UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZ1rib2Bg-4.woff2": "inter-v13-latin-regular.woff2",
  "UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZ1rib2Bg-4.woff2": "inter-v13-latin-medium.woff2",
  "UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuBWYMZ1rib2Bg-4.woff2": "inter-v13-latin-bold.woff2",
  // Inter v18
  "UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZ1rib2Bg-4.woff2": "inter-v18-latin-medium.woff2",
  // Montserrat
  "JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew7Y3tcoqK5.woff2": "montserrat-v26-latin-bold.woff2",
  // DM Sans
  "rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAkJxhS2f3ZGMZpg.woff2": "dmsans-v15-latin-regular.woff2",
};

let totalRewrites = 0;

function rewriteFile(filePath) {
  let code = readFileSync(filePath, "utf-8");
  let original = code;
  let fileRewrites = 0;

  // 1. framerusercontent.com/assets/HASH.ext → ./assets/hash.ext
  code = code.replace(
    /https:\/\/framerusercontent\.com\/assets\/([A-Za-z0-9_-]+\.\w+)/g,
    (match, filename) => {
      fileRewrites++;
      return `./assets/${filename.toLowerCase()}`;
    }
  );

  // 2. framerusercontent.com/images/HASH.ext → ./images/hash.ext
  code = code.replace(
    /https:\/\/framerusercontent\.com\/images\/([A-Za-z0-9_-]+\.\w+)/g,
    (match, filename) => {
      fileRewrites++;
      return `./images/${filename.toLowerCase()}`;
    }
  );

  // 3. app.framerstatic.com/Inter-*.woff2 → ./assets/fonts/Inter-*.woff2
  code = code.replace(
    /https:\/\/app\.framerstatic\.com\/(Inter-[A-Za-z0-9._-]+\.woff2)/g,
    (match, filename) => {
      const local = FRAMERSTATIC_MAP[filename];
      if (local) {
        fileRewrites++;
        return `./assets/fonts/${local}`;
      }
      console.warn(`  Unknown framerstatic file: ${filename}`);
      return match;
    }
  );

  // 4. fonts.gstatic.com/s/FONT/VERSION/HASH.woff2 → ./assets/fonts/NAME.woff2
  code = code.replace(
    /https:\/\/fonts\.gstatic\.com\/s\/[a-z]+\/v\d+\/([A-Za-z0-9_-]+\.woff2)/g,
    (match, hash) => {
      const local = GSTATIC_MAP[hash];
      if (local) {
        fileRewrites++;
        return `./assets/fonts/${local}`;
      }
      console.warn(`  Unknown gstatic font: ${hash}`);
      return match;
    }
  );

  // 5. framerusercontent.com/third-party-assets/fontshare/ → ./assets/fonts/fontshare/
  code = code.replace(
    /https:\/\/framerusercontent\.com\/third-party-assets\/fontshare\//g,
    () => {
      fileRewrites++;
      return `./assets/fonts/fontshare/`;
    }
  );

  // 6. mixkit video
  code = code.replace(
    /https:\/\/assets\.mixkit\.co\/videos\/preview\/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small\.mp4/g,
    () => {
      fileRewrites++;
      return `./assets/mixkit-clouds-sky.mp4`;
    }
  );

  // 7. GitHub raw SVG
  code = code.replace(
    /https:\/\/raw\.githubusercontent\.com\/LennartvdM\/kaart\/main\/worldmap\.svg/g,
    () => {
      fileRewrites++;
      return `./assets/worldmap.svg`;
    }
  );

  // 8. Patch the font source detection to recognize local paths
  //    Original: e.url.startsWith("https://fonts.gstatic.com/s/")
  //    Also:     e.url.startsWith("https://framerusercontent.com/third-party-assets/fontshare/")
  code = code.replace(
    `e.url.startsWith("https://fonts.gstatic.com/s/")`,
    `(e.url.startsWith("https://fonts.gstatic.com/s/") || e.url.startsWith("./assets/fonts/"))`
  );
  code = code.replace(
    `e.url.startsWith(\n            "https://framerusercontent.com/third-party-assets/fontshare/",\n          )`,
    `e.url.startsWith("./assets/fonts/fontshare/")`
  );

  if (code !== original) {
    writeFileSync(filePath, code);
    console.log(`  ${filePath}: ${fileRewrites} URLs rewritten`);
    totalRewrites += fileRewrites;
  }
}

// Process all deobfuscated .mjs files
console.log("Rewriting URLs in deobfuscated files...\n");
const files = readdirSync(DEOB_DIR).filter(f => f.endsWith(".mjs"));
for (const file of files) {
  rewriteFile(join(DEOB_DIR, file));
}

// Also process the original .mjs files in the site directory
console.log("\nRewriting URLs in original site files...\n");
const siteDir = "sites/neoflix";
const siteFiles = readdirSync(siteDir).filter(f => f.endsWith(".mjs"));
for (const file of siteFiles) {
  rewriteFile(join(siteDir, file));
}

console.log(`\nDone! ${totalRewrites} total URL rewrites across all files.`);
