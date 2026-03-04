/**
 * Deep deobfuscation script - Phase 2
 *
 * Renames single-letter import aliases to their actual API names
 * across all deobfuscated files. This traces exports from the core chunks
 * and replaces the aliases wherever they're imported and used.
 */

import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join, basename } from "path";

const OUT_DIR = "sites/2onvjkqnrbkhdnszrykaoo/deobfuscated";

// ════════════════════════════════════════════════════════════════════
// EXPORT MAPS: chunk export alias → actual name
// ════════════════════════════════════════════════════════════════════

// chunk--react-and-framer-runtime.mjs exports
const RUNTIME_EXPORTS = {
  // ── React Core ──
  a: "React",                        // x - the React module
  b: "ReactFragment",               // vr = x.Fragment
  c: "createElement",               // dl = x.createElement
  d: "forwardRef",                   // Ae = x.forwardRef
  e: "memo",                        // xE = x.memo
  f: "startTransition",             // br = x.startTransition
  g: "useCallback",                 // se = x.useCallback
  h: "useContext",                   // A = x.useContext
  i: "useEffect",                   // $ = x.useEffect
  j: "useId",                       // Ti = x.useId
  k: "useInsertionEffect",          // ut = x.useInsertionEffect (useLayoutEffect variant)
  l: "useMemo",                     // ae = x.useMemo
  m: "useRef",                      // V = x.useRef
  n: "useState",                    // Ze = x.useState
  o: "ReactModule",                 // Tt - the full React module object
  p: "MotionFragment",              // We = uo.Fragment (motion Fragment)

  // ── React Internal / JSX ──
  q: "jsx",                          // k - jsx/createElement shorthand
  r: "jsxs",                         // he - jsxs (JSX with multiple children)
  s: "MotionContext",               // Sr - MotionContext (createContext)
  t: "isMotionValue",               // Ve - checks if value is a MotionValue
  u: "motion",                      // yn - motion component factory (motion.div, etc)

  // ── ReactDOM / Framer Motion ──
  v: "LayoutGroup",                 // ub - LayoutGroup component
  w: "useTransform",                // Dt - transforms MotionValues
  x: "useSpring",                   // eh - spring-based MotionValue animation
  y: "useInView",                   // _I - IntersectionObserver visibility hook
  z: "ReactDOMDefault",             // NS - ReactDOM default export

  // ── Framer SDK ──
  A: "ReactDOMExports",             // pL - ReactDOM exports container
  B: "lazyLoadPage",                // kH - lazy page loader with preload
  C: "RoutingContext",              // RH - routing context provider
  D: "markHydrationStart",          // _H - marks hydration perf start
  E: "enableEventHandling",         // OH - enables DOM event handling
  F: "setReducedMotion",            // MH - sets reduced motion flag
  G: "useRoute",                     // ds - useContext(routerContext)
  H: "useLocale",                    // Nk - useContext for locale info
  I: "matchRoute",                  // Hk - matches URL to route
  J: "resolveLinks",                // KH - resolves link hrefs with locale
  K: "RenderTarget",                // pe - RenderTarget (.canvas, .export, .preview)
  L: "ComponentErrorBoundary",      // ij - error display component
  M: "ControlType",                 // RD - property control types enum
  N: "initSiteScrollBehavior",      // cj - initializes scroll behavior CSS
  O: "NavigationTargetType",        // EA - navigation target types
  P: "addPropertyControls",         // uj - adds property controls to component
  Q: "useIsOnFramerCanvas",         // Jj - returns whether on canvas
  R: "cx",                           // $u - classNames joiner (cx(...args))
  S: "withFXWrapper",               // X8 - wraps component with FX support
  T: "useDeviceSize",               // eW - useContext for device viewport size
  U: "DeviceSizeContainer",         // tW - provides device size context
  V: "cssSSRMinifiedHelper",        // aW - SSR CSS minification
  W: "DATA_FRAMER_CSS_SSR",         // Az - "data-framer-css-ssr" attribute name
  X: "withCSS",                     // zC - attaches CSS to component
  Y: "registerCursors",             // hW - registers custom cursors
  Z: "CursorContext",               // BC - cursor context
  _: "CursorContextProvider",       // bW - cursor context provider

  // ── Framer Layout / Components ──
  $: "NavigationLink",              // kW - <a> link component with routing
  aa: "FramerRouter",               // FW - main router component
  ba: "PropertyOverridesProvider",  // LW - property overrides CSS
  ca: "withScrollSection",          // DW - wraps component as scroll section
  da: "AppearAnimationStore",       // AW - class for appear animation store
  ea: "appearAnimationStoreInstance", // PT - singleton instance
  fa: "scheduleAppearAnimation",    // BW - schedules appear animation
  ga: "setAppearAnimationValues",   // $W - sets appear animation values
  ha: "APPEAR_ANIM_TRANSFORM_KEY",  // vB - "__Appear_Animation_Transform__"
  ia: "DATA_FRAMER_APPEAR_ID",      // yB - "data-framer-appear-id"
  ja: "DATA_FRAMER_APPEAR_ANIMATION", // NW - "data-framer-appear-animation"
  ka: "useVariantAnimationCallbacks", // jW - manages animation callbacks
  la: "useVariantState",            // GW - manages variant state with hydration
  ma: "cleanupSSRVariants",         // qW - removes SSR variant elements from DOM
  na: "useOnVariantChange",         // JW - calls callbacks on variant changes
  oa: "CycleSymbol",                // FB - Symbol("cycle")

  // ── Framer Component Variants ──
  pa: "useVariantState",            // oU - manages component variant state
  qa: "withScrollAnimation",         // cU - wraps component with scroll-triggered animation

  // ── Framer Font Loading ──
  ra: "fontLoader",                 // Du - font loading instance
  sa: "FrameComponent",             // _U - Frame component (div with background)
  ta: "RichTextComponent",          // AU - RichText component
  ua: "SVGStore",                    // rs - SVG deduplication/subscription manager

  // ── Framer Frame ──
  va: "SVGComponent",               // $U - SVG element with layout
  wa: "loadFonts",                  // KU - load fonts helper
  xa: "getFonts",                   // QU - get fonts from config
  ya: "normalizeFontConfig",        // ZU - normalize font config array
  za: "withPerformanceMark",        // JU - wraps function with perf marks
};

// chunk--browser-polyfills.mjs exports
const POLYFILL_EXPORTS = {
  a: "defineExports",     // bulk property definer
  b: "navigator",         // globalThis.navigator
  c: "window",            // globalThis.window
};

// chunk--framer-components.mjs exports
const FRAMER_COMP_EXPORTS = {
  a: "containerStyle",         // base container flex style
  b: "placeholderStyle",       // placeholder purple dashed border
  c: "mouseEventControls",     // onClick/onMouseEnter/onMouseLeave controls
  d: "useOnAppear",            // callback on component appear
  e: "useOnDisappear",         // callback on component disappear
  f: "useIsSafari",            // Safari detection hook
  g: "useIsOnCanvas",          // RenderTarget.canvas check hook
  h: "useBorderRadius",        // computes border-radius CSS
  i: "borderRadiusControls",   // FusedNumber control for border radius
  j: "fontConfig",             // [{explicitInter: true, fonts: []}]
  k: "linkPresetStyles",       // CSS for link styling presets
  l: "cssClassScope",          // "framer-VnG2h" scope class
};

// chunk--framer-motion.mjs exports (actually site-specific scroll/map components)
const MOTION_EXPORTS = {
  a: "withScrollSnapContainer",    // HOC: scrollSnapType: "y mandatory"
  b: "MapComponent",               // "Map" component (desktop)
  c: "MapMobile2Component",        // "Map mobile 2" component
  d: "withScrollSnapChild",        // HOC: scrollSnapAlign: "start"
  e: "withScrollSnapContainerAlt", // duplicate of a
};

// chunk--shared-components.mjs exports
const SHARED_COMP_EXPORTS = {
  a: "SmoothScrollComponent",         // Lenis-based smooth scroll
  b: "NoiseOverlayComponent",         // texture/noise background overlay
  c: "NavItemComponent",              // "Item Copy 2" navigation item
  d: "interMediumFontDefs",           // [] empty font defs
  e: "interMediumPresetCSS",          // Inter-Medium CSS preset
  f: "interMediumCSSScope",           // "framer-9T5XM"
  g: "interExtraBoldFontDefs",        // [] empty font defs
  h: "interExtraBoldPresetCSS",       // Inter-ExtraBold CSS preset
  i: "interExtraBoldCSSScope",        // "framer-3fk2D"
};

// chunk--embed-component.mjs - not separately imported by page files

// chunk--site-metadata.mjs exports
const SITE_META_EXPORTS = {
  a: "getSiteMetadata",    // returns {description, favicon, socialImage, title}
};

// chunk--video-player-component.mjs exports
const VIDEO_EXPORTS = {
  a: "VideoComponent",    // full video player component
};

// chunk--inter-bold-font-styles.mjs exports
const INTER_BOLD_EXPORTS = {
  a: "interBoldFontDefs",       // font definition objects for Inter Bold
  b: "interBoldPresetCSS",      // CSS for Inter Bold h2 preset
  c: "interBoldCSSScope",       // "framer-symo8"
};

// ════════════════════════════════════════════════════════════════════
// Map of import source file → export map
// ════════════════════════════════════════════════════════════════════
const CHUNK_EXPORT_MAPS = {
  "chunk--react-and-framer-runtime.mjs": RUNTIME_EXPORTS,
  "chunk--browser-polyfills.mjs": POLYFILL_EXPORTS,
  "chunk--framer-components.mjs": FRAMER_COMP_EXPORTS,
  "chunk--framer-motion.mjs": MOTION_EXPORTS,
  "chunk--shared-components.mjs": SHARED_COMP_EXPORTS,
  "chunk--site-metadata.mjs": SITE_META_EXPORTS,
  "chunk--video-player-component.mjs": VIDEO_EXPORTS,
  "chunk--inter-bold-font-styles.mjs": INTER_BOLD_EXPORTS,
};

// ════════════════════════════════════════════════════════════════════
// Processing logic
// ════════════════════════════════════════════════════════════════════

/**
 * Parse import statements and return rename info.
 * Handles: import { X as localName, Y as other } from "./chunk-foo.mjs"
 */
function parseImports(code) {
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*["']\.\/([^"']+)["']/g;
  const renames = []; // array of {localName, newName, oldAlias}

  let match;
  while ((match = importRegex.exec(code)) !== null) {
    const specifiers = match[1];
    const sourceFile = match[2];

    const exportMap = CHUNK_EXPORT_MAPS[sourceFile];
    if (!exportMap) continue;

    // Parse each import specifier: "X as localName" or just "X"
    const specParts = specifiers.split(",").map((s) => s.trim()).filter(Boolean);
    for (const spec of specParts) {
      const asMatch = spec.match(/^(\w+)\s+as\s+(\w+)$/);
      if (asMatch) {
        const exportAlias = asMatch[1]; // the export name (e.g., "q")
        const localName = asMatch[2];   // the local alias (e.g., "e")
        const realName = exportMap[exportAlias];
        if (realName && localName !== realName) {
          renames.push({ localName, newName: realName, exportAlias });
        }
      } else {
        // Direct import without "as"
        const directName = spec.trim();
        const realName = exportMap[directName];
        if (realName && directName !== realName) {
          renames.push({ localName: directName, newName: realName, exportAlias: directName });
        }
      }
    }
  }

  return renames;
}

/**
 * Rewrite import statements to use real names.
 * Changes: import { q as e } from "./chunk--react-and-framer-runtime.mjs"
 * To:      import { jsx } from "./chunk--react-and-framer-runtime.mjs"
 */
function rewriteImports(code) {
  const importRegex = /import\s*\{([^}]+)\}\s*from\s*["'](\.\/[^"']+)["']/g;

  return code.replace(importRegex, (fullMatch, specifiers, source) => {
    const sourceFile = source.replace("./", "");
    const exportMap = CHUNK_EXPORT_MAPS[sourceFile];
    if (!exportMap) return fullMatch;

    const specParts = specifiers.split(",").map((s) => s.trim()).filter(Boolean);
    const newSpecs = specParts.map((spec) => {
      const asMatch = spec.match(/^(\w+)\s+as\s+(\w+)$/);
      if (asMatch) {
        const exportAlias = asMatch[1];
        const realName = exportMap[exportAlias];
        if (realName) {
          return realName; // import { jsx } instead of { q as e }
        }
      } else {
        const realName = exportMap[spec.trim()];
        if (realName) return realName;
      }
      return spec;
    });

    return `import { ${newSpecs.join(",\n  ")} } from "${source}"`;
  });
}

/**
 * Replace local variable references throughout the code.
 * Only replaces whole-word matches to avoid false positives.
 */
function renameLocals(code, renames) {
  // Sort by longest local name first to avoid partial replacements
  const sorted = [...renames].sort((a, b) => b.localName.length - a.localName.length);

  // Build a set of all new names to avoid conflicts
  const newNames = new Set(sorted.map((r) => r.newName));

  for (const { localName, newName } of sorted) {
    // Skip if localName is too short (1 char) AND is a common JS token
    // that would cause too many false positives
    if (localName.length === 1 && /^[a-z]$/.test(localName)) {
      // For single lowercase letters, we need to be very careful
      // Only rename if the name appears in contexts that suggest it's from the import
      // We'll use a word-boundary approach but skip certain patterns
      const regex = new RegExp(`(?<![a-zA-Z0-9_$.])${escapeRegex(localName)}(?![a-zA-Z0-9_:])`, "g");

      // Count occurrences to decide if it's safe
      const occurrences = (code.match(regex) || []).length;
      if (occurrences > 500) {
        // Too many - likely a very common letter, skip for safety
        // But still rename the import statement
        continue;
      }

      code = code.replace(regex, (match, offset) => {
        // Don't rename inside strings
        const before = code.substring(Math.max(0, offset - 50), offset);
        if (isInsideString(before)) return match;
        // Don't rename inside comments
        if (isInsideComment(before)) return match;
        // Don't rename property access like .e or obj.e
        if (code[offset - 1] === ".") return match;
        // Don't rename in object keys like { e: ... }
        const after = code.substring(offset, offset + 3);
        if (/^[a-zA-Z]:\s/.test(after)) return match;
        return newName;
      });
    } else if (localName.length <= 2) {
      // For 2-char names, use word boundary but be cautious
      const regex = new RegExp(`(?<![a-zA-Z0-9_$])${escapeRegex(localName)}(?![a-zA-Z0-9_])`, "g");
      code = code.replace(regex, (match, offset) => {
        if (code[offset - 1] === ".") return match;
        const before = code.substring(Math.max(0, offset - 30), offset);
        if (isInsideString(before)) return match;
        return newName;
      });
    } else {
      // For longer names, simple word-boundary replacement is safe
      const regex = new RegExp(`\\b${escapeRegex(localName)}\\b`, "g");
      code = code.replace(regex, newName);
    }
  }

  return code;
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isInsideString(before) {
  // Crude check - count unescaped quotes
  const singles = (before.match(/(?<!\\)'/g) || []).length;
  const doubles = (before.match(/(?<!\\)"/g) || []).length;
  const backticks = (before.match(/(?<!\\)`/g) || []).length;
  return singles % 2 === 1 || doubles % 2 === 1 || backticks % 2 === 1;
}

function isInsideComment(before) {
  return before.includes("//") || before.includes("/*");
}

/**
 * Add a header comment explaining what imports were renamed.
 */
function addRenameHeader(code, renames) {
  if (renames.length === 0) return code;

  const lines = renames
    .filter((r) => r.localName.length <= 3) // Only document the non-obvious ones
    .map((r) => ` *   ${r.localName} → ${r.newName}`)
    .join("\n");

  if (!lines) return code;

  // Find existing header comment or add before first import
  const header = `/**\n * Import aliases resolved:\n${lines}\n */\n`;

  // If file starts with /**, replace it; otherwise prepend
  if (code.startsWith("/**")) {
    // Append to existing comment
    const endIdx = code.indexOf("*/");
    if (endIdx !== -1) {
      const existingComment = code.substring(0, endIdx + 2);
      const rest = code.substring(endIdx + 2);
      return existingComment + `\n/**\n * Import aliases resolved:\n${lines}\n */` + rest;
    }
  }

  return header + code;
}

function processFile(filePath) {
  let code = readFileSync(filePath, "utf-8");
  const fileName = basename(filePath);

  // Skip the core chunks themselves - we don't rename inside them
  if (
    fileName === "chunk--react-and-framer-runtime.mjs" ||
    fileName === "ROUTE_MAP.md"
  ) {
    return { code, changed: false };
  }

  // 1. Parse imports to find what needs renaming
  const renames = parseImports(code);

  if (renames.length === 0) {
    return { code, changed: false };
  }

  // 2. Rewrite import statements
  code = rewriteImports(code);

  // 3. Rename local variable references (only for multi-char aliases)
  // For single-char, it's too risky for automated replacement in the body
  const safeRenames = renames.filter((r) => r.localName.length >= 2);
  code = renameLocals(code, safeRenames);

  // 4. Add header comment
  code = addRenameHeader(code, renames);

  return { code, changed: true };
}

function main() {
  const files = readdirSync(OUT_DIR).filter((f) => f.endsWith(".mjs"));
  console.log(`Processing ${files.length} files for deep deobfuscation...\n`);

  let changedCount = 0;

  for (const file of files) {
    const filePath = join(OUT_DIR, file);
    const { code, changed } = processFile(filePath);

    if (changed) {
      writeFileSync(filePath, code);
      changedCount++;
      console.log(`  ✓ ${file}`);
    } else {
      console.log(`  - ${file} (no imports to rename)`);
    }
  }

  console.log(`\n✓ Deep deobfuscation complete: ${changedCount}/${files.length} files updated`);
}

main();
