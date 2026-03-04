/**
 * Deobfuscation script for Framer-exported site.
 *
 * What it does:
 * 1. Prettifies all .mjs files with Prettier
 * 2. Adds semantic comments to imports/exports
 * 3. Renames files from hashes to meaningful names based on route mapping
 * 4. Extracts GitBook docs URLs into a centralized docs-links.mjs module
 * 5. Generates a route map
 */

import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "fs";
import { execSync } from "child_process";
import { join, basename } from "path";

const SITE_DIR = "sites/2onvjkqnrbkhdnszrykaoo";
const OUT_DIR = join(SITE_DIR, "deobfuscated");

// ── Route mapping extracted from script_main ──
const ROUTE_MAP = {
  augiA20Il: { path: "/", file: "QRxJHAljpr6E1E44QbXRfoGPxB4r7yPt9fVmJ1X87NM.VPODV3IV.mjs" },
  wbG3mjw6l: { path: "/worldmapgit", file: "i1d8vDCJeXOlKeXql1qmQ4kZhYVqCYE_MVAAWEKBIbo.GCKBB5TD.mjs" },
  bzydBB85Y: { path: "/neoflix", file: "r-i-LvuSp0UPuYEn_-NOeDe9lQuWyi4IvHTa2kyTIUs.3X4MI74Y.mjs", elements: { dbtg_NZW8: "dance1", DXqsCYt4L: "perspectives1", mRVhqybMB: "skills1", NYP2seWhD: "team1", tftSCv8zZ: "cost1", WjO84y3BZ: "time1" } },
  aLuYbVoBY: { path: "/Publications", file: "WIpGqG_RrnB9Vnxe9-SX-yOPNjd6W2Fz2buc9b-ZRv8.MG5IZP6C.mjs", elements: { DSPosq1GU: "narrative", Y8dEgTIYh: "recordfelectrefine", zQbFj9_vB: "providers" } },
  x05wlhCdy: { path: "/Toolbox", file: "iaoE9CeJ_XeHglWhWR905ggsCdZP7iFaGs0k2l_nRww.TQZATBXR.mjs" },
  IDh2dRb_U: { path: "/Toolbox-Planning_Your_Initiative", file: "ODG_UYMbze5l6oW80ZgwPbAvuTYtO5dAdv0S4Lz13hE.ROMEUPJN.mjs" },
  cASgO3jWQ: { path: "/Toolbox-Reflect", file: "caLfKrMY1Vus0oco4AsLUHEapLu1t384CzllkSYJMdE.OFSPHDOB.mjs" },
  pcYRXVdRv: { path: "/Toolbox-Safe_Simple_Small", file: "dUTGcwEqe7PPhuoenHWboSjD_IQZmKxWmjZjN9M_GB8.VKGGTD5K.mjs" },
  HtIN1t6ER: { path: "/Toolbox_Learning_From_Variety", file: "59n1I0g1VXv8kXwOebfSQwYqipIfROnc1VS7XTl2SRk.3F3CALNV.mjs" },
  KgHIqfucs: { path: "/Toolbox_Pioneer_Team", file: "kMNdpQhAp0r5zopxQOLX-tKX2BMZuUBc37IrAQ_pwV4.EFRHWXZM.mjs" },
  S5cL1K0Pb: { path: "/Toolbox_Education_And_Training", file: "pICBDkQclVhlfSxeAaKZNZlnRrN7ekh3Kje5I2R5zaA.LVBMW5VJ.mjs" },
  zI2CbZmPJ: { path: "/Toolbox_Metadata_and_Archiving", file: "5pB8i7JryIN72uAehR-29znLbIhGbg7nAJ0Gp2TQh-w.7Z7QX2AD.mjs" },
  uQs2bgVcT: { path: "/Toolbox_Recordings_for_research", file: "2y5CPnQdDHjXSU14Gp44iHIpiCxuI92rZrcDz3P2YIE.IAMMBRPR.mjs" },
  fN3izV_im: { path: "/Toolbox_Revolutionize_Reflection_in_medical_care:_join_the_network", file: "lnB3OZ5qoO0qn_7HQFVJDnLuEt2VLwgnx_Id73eOCl0.ZWDLSF2E.mjs" },
  IiCllyrxA: { path: "/Toolbox_Tasks_of_the_chair", file: "tFMiDOAEfChKEC5KnL8qKMw17xnIVjNvfJJgCCaQ4NA.ATCSMFI2.mjs" },
  sEYnG8vfd: { path: "/Toolbox_A_Safe_Learning_Environment", file: "lFkXH09edVLNYedhzaORm1GVQY2b0wMzW9kPZzUF6z8.73JFIULG.mjs" },
  MrFemP8j0: { path: "/Toolbox_Different_Approach", file: "QTsgPodqQWt3lU96rvplM7qWIKeQxe1cnr6rURWtrTE.FO33IOIZ.mjs" },
  EY4hH_Y7j: { path: "/Toolbox_How_it_works", file: "T4GKfSlKAeiYwxkbxyhNTTWfoLWBEU9FfKek80tJWns.R64F5YEM.mjs" },
  X8n9MxBBr: { path: "/Toolbox_Unburdening_the_process", file: "z5_mRGa-xANlewVLzbE_A865O-Bmw4RNA1VhK1RVMCc.CEKJVLNW.mjs" },
  N3WZmbqwm: { path: "/Toolbox_Learning_from_success_stories", file: "8wIS7dMIR6l6d8BpIS53RBg1OdaDD9ivI06ZOGIsjt8.DBCBPCRK.mjs" },
  ut1mnZVW1: { path: "/Toolbox_Questions_to_ask_during_previewing", file: "-bfPsqjKz3YJqBrpUwypoKKnxlRxioyzxxxGvvnZObw.TS7IWHRM.mjs" },
  t97unZiTK: { path: "/Toolbox_Preparation_and_Consent", file: "fTAyYLm0YzGPpelrq0MBUBpBgHJ4ilqynEWGIAzRuFQ.DDFFSMB6.mjs" },
  rC8gH4Mco: { path: "/Toolbox_Tool_for_implementing_new_practices", file: "glwdfuCqV1HUakR5AVOA4rk9XTVvfIUbUBuupGDYHkk.IQPJOXRU.mjs" },
  nzfaDOFRY: { path: "/Toolbox_Let's_Neoflix", file: "pge6lLM7PJC-iGmnZov4z25xYCTROLQhRNATNEoccNs.PHZMIDEU.mjs" },
  mRVtT24DH: { path: "/Toolbox_Input_for_research", file: "asvtYd9BvyPPveMHLcdSQDTf6gF-BrWTVD23em1Cmmo.ZEO7QIDL.mjs" },
  ymL2yz5Md: { path: "/Toolbox_Share_your_experience", file: "BzO1c0AYyZ5EkGc6eny-TQH02US8B8MFcEgZ5k_A8i0.YIJ2KQRN.mjs" },
  NM8YGpOE1: { path: "/Toolbox_After_the_Intervention", file: "8AMmeXj9-wG5fs84Mr62ktcD-C4c-8ZEcsteqgRmelc.67CDMGQV.mjs" },
  H5snp07v4: { path: "/Toolbox_Case_selection", file: "uzciTPtykMnmf-8a33jp1mkpAYCE6PFvLy1HOJMvNWU.M3MXRASY.mjs" },
  KeW3JpTIh: { path: "/toolbox_case_leiden", file: "w7hQgy7Fg5FpGD03hkm3vGvjR6XW1gidgPm-HgIiVIk.FUBNWK3F.mjs" },
  lwdo_bYrZ: { path: "/toolbox_case_philadelphia", file: "VYafsMfjZFFxoW1rvRS8kU-NIy3oVCfFrkVMtj9us_4.QOE4O22U.mjs" },
  unjEzXKKB: { path: "/toolbox_case_vienna", file: "nCUl1BrbN8Dof_DVVRD9vUvfpK0nrV5jJ9DZYGcZKO4.A45S6W6D.mjs" },
  xRLjTQZCl: { path: "/toolbox_case_australia", file: "h-jerXPXutFh_5Paz8kmQ1oJhWtEDbYUg7HtO8m0I1Y.4KILXBSG.mjs" },
  f7Ah01sPh: { path: "/toolbox_case_succcessstories", file: "y9-YKlJ16SyjLst51ZGi4TxP-3FXFIG-IxbqUT0nBZU.NDBVOKUX.mjs" },
};

// Base URL for GitBook documentation
const DOCS_BASE = "https://docs.neoflix.care";

// Build hash-to-meaningful-name file mapping
const FILE_RENAME_MAP = {};
for (const [routeId, info] of Object.entries(ROUTE_MAP)) {
  const pageName = info.path.replace(/^\//, "").replace(/[/:]/g, "_") || "home";
  FILE_RENAME_MAP[info.file.toLowerCase()] = `page--${pageName}.mjs`;
}

// Known chunk purposes (from analysis)
const CHUNK_NAMES = {
  "chunk-5swt4qjj.mjs": "chunk--react-and-framer-runtime.mjs",
  "chunk-riumfbnj.mjs": "chunk--browser-polyfills.mjs",
  "chunk-ezmxfukt.mjs": "chunk--site-metadata.mjs",
  "chunk-oypszrmx.mjs": "chunk--framer-components.mjs",
  "chunk-yswte6p7.mjs": "chunk--framer-motion.mjs",
  "chunk-t6gii47u.mjs": "chunk--shared-components.mjs",
  "chunk-nfm7h27b.mjs": "chunk--embed-component.mjs",
  "script_main.wb5gsumg.mjs": "script_main--router.mjs",
  "sitesnotfoundpage.js@1.1-b76n3trr.mjs": "page--404-not-found.mjs",
};

// Known React/Framer API names from chunk-5SWT4QJJ exports
const REACT_EXPORTS = {
  Children: "Children", Component: "Component", Fragment: "Fragment",
  createElement: "createElement", createContext: "createContext",
  createRef: "createRef", forwardRef: "forwardRef",
  isValidElement: "isValidElement", lazy: "lazy", memo: "memo",
  useCallback: "useCallback", useContext: "useContext",
  useEffect: "useEffect", useId: "useId", useLayoutEffect: "useLayoutEffect",
  useMemo: "useMemo", useReducer: "useReducer", useRef: "useRef",
  useState: "useState", useSyncExternalStore: "useSyncExternalStore",
  startTransition: "startTransition", Suspense: "Suspense",
};

function pathToName(path) {
  return path.replace(/^\//, "").replace(/[/:]/g, "_") || "home";
}

// Build import alias comments for known modules
function addImportComments(code) {
  // Add a banner comment identifying the file's route if it's a page component
  for (const [routeId, info] of Object.entries(ROUTE_MAP)) {
    if (code.includes(routeId)) {
      // Don't add route comments to the main script (it has all routes)
      break;
    }
  }
  return code;
}

// Add readable annotations to Framer property controls
function annotateFramerProps(code) {
  return code
    .replace(/ControlType\.Enum/g, "ControlType.Enum /* dropdown */")
    .replace(/ControlType\.Boolean/g, "ControlType.Boolean /* toggle */")
    .replace(/ControlType\.String/g, "ControlType.String /* text input */")
    .replace(/ControlType\.Number/g, "ControlType.Number /* number input */")
    .replace(/ControlType\.Color/g, "ControlType.Color /* color picker */")
    .replace(/ControlType\.Image/g, "ControlType.Image /* image upload */")
    .replace(/ControlType\.File/g, "ControlType.File /* file upload */")
    .replace(/ControlType\.ComponentInstance/g, "ControlType.ComponentInstance /* component slot */")
    .replace(/ControlType\.Link/g, "ControlType.Link /* URL link */");
}

// Identify and label metadata chunk patterns
function annotateMetadata(code) {
  if (code.includes("breakpoints") && code.includes("bodyClassName") && code.includes("mediaQuery")) {
    return `/**\n * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.\n * breakpoints define responsive behavior at different screen widths.\n */\n` + code;
  }
  if (code.includes("socialImage") && code.includes("favicon")) {
    return `/**\n * Site-wide metadata - favicon, social sharing image, and default page title/description.\n */\n` + code;
  }
  return code;
}

// Annotate animation/transition configs
function annotateAnimations(code) {
  return code
    .replace(
      /type:\s*"tween"/g,
      'type: "tween" /* CSS-like easing animation */'
    )
    .replace(
      /type:\s*"spring"/g,
      'type: "spring" /* physics-based spring animation */'
    );
}

async function processFile(filePath) {
  const fileName = basename(filePath).toLowerCase();
  let code = readFileSync(filePath, "utf-8");

  // Remove sourcemap references
  code = code.replace(/\/\/# sourceMappingURL=.*$/gm, "");

  // Prettify with prettier
  try {
    writeFileSync("/tmp/deob_temp.mjs", code);
    code = execSync("prettier --parser babel /tmp/deob_temp.mjs", {
      encoding: "utf-8",
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (e) {
    // If prettier fails (some files have edge cases), try with meriyah parser
    try {
      code = execSync("prettier --parser meriyah /tmp/deob_temp.mjs", {
        encoding: "utf-8",
        maxBuffer: 10 * 1024 * 1024,
      });
    } catch (e2) {
      console.warn(`  ⚠ Prettier failed for ${fileName}, using raw formatted output`);
      // Basic formatting: add newlines after semicolons and braces
      code = code.replace(/;/g, ";\n").replace(/\{/g, "{\n").replace(/\}/g, "\n}\n");
    }
  }

  // Add semantic annotations
  code = annotateMetadata(code);
  code = annotateAnimations(code);

  // Extract docs.neoflix.care URL if present (for centralized docs-links module)
  let docsUrl = null;
  const docsMatch = code.match(/https:\/\/docs\.neoflix\.care(\/[^"]*)?/);
  if (docsMatch) {
    docsUrl = docsMatch[0];
  }

  // Determine output filename
  let outName = CHUNK_NAMES[fileName] || FILE_RENAME_MAP[fileName] || fileName;

  // For remaining unnamed files, check if they're metadata chunks
  if (outName === fileName && code.includes("breakpoints") && code.includes("bodyClassName")) {
    // Try to extract the title to name it
    const titleMatch = code.match(/title:.*?\|\|\s*"([^"]+)"/);
    if (titleMatch) {
      const slug = titleMatch[1].replace(/[^a-zA-Z0-9]+/g, "_").toLowerCase();
      outName = `metadata--${slug}.mjs`;
    }
  }

  // For page component files, try to extract the route path
  if (outName === fileName) {
    // Check if this file is imported by a known route
    for (const [routeId, info] of Object.entries(ROUTE_MAP)) {
      if (info.file.toLowerCase() === fileName) {
        const pageName = pathToName(info.path);
        outName = `page--${pageName}.mjs`;
        // Add route comment at top
        code = `/**\n * Page component for route: ${info.path}\n * Route ID: ${routeId}\n${info.elements ? ` * Named elements: ${JSON.stringify(info.elements, null, 2).replace(/\n/g, "\n * ")}\n` : ""} */\n` + code;
        break;
      }
    }
  }

  // Add chunk purpose comment for known chunks
  if (CHUNK_NAMES[fileName]) {
    const purpose = CHUNK_NAMES[fileName].replace("chunk--", "").replace(".mjs", "").replace(/-/g, " ");
    if (!code.startsWith("/**")) {
      code = `/**\n * ${purpose}\n */\n` + code;
    }
  }

  return { outName, code, docsUrl };
}

async function main() {
  if (!existsSync(OUT_DIR)) {
    mkdirSync(OUT_DIR, { recursive: true });
  }

  const files = readdirSync(SITE_DIR).filter((f) => f.endsWith(".mjs"));
  console.log(`Found ${files.length} .mjs files to deobfuscate\n`);

  // First pass: process all files
  const results = [];
  for (const file of files) {
    const filePath = join(SITE_DIR, file);
    process.stdout.write(`Processing: ${file}...`);
    try {
      const result = await processFile(filePath);
      results.push(result);
      console.log(` → ${result.outName}`);
    } catch (e) {
      console.error(` ✗ Error: ${e.message}`);
    }
  }

  // Second pass: update import references in deobfuscated files
  // Build a mapping from old filenames to new filenames
  const nameMap = {};
  for (const { outName } of results) {
    // We need old name -> new name
  }
  // Build from our known maps
  const allRenames = { ...CHUNK_NAMES };
  for (const [oldName, newName] of Object.entries(FILE_RENAME_MAP)) {
    allRenames[oldName] = newName;
  }

  for (const result of results) {
    let code = result.code;

    // Replace import references to use new filenames
    for (const [oldName, newName] of Object.entries(allRenames)) {
      // Match both ./oldName and ./OLDNAME (case-insensitive file references)
      const escapedOld = oldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\./${escapedOld.replace(/\\\./g, "\\.")}`, "gi");
      code = code.replace(regex, `./${newName}`);
    }

    // Also handle the original casing variants from the actual import statements
    // Framer uses mixed case in imports but lowercase filenames on disk
    for (const [routeId, info] of Object.entries(ROUTE_MAP)) {
      const newName = FILE_RENAME_MAP[info.file.toLowerCase()];
      if (newName) {
        const escaped = info.file.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        code = code.replace(new RegExp(`\\./${escaped}`, "g"), `./${newName}`);
      }
    }

    // Update chunk references
    for (const [oldChunk, newChunk] of Object.entries(CHUNK_NAMES)) {
      // Handle case variations (e.g., chunk-5SWT4QJJ vs chunk-5swt4qjj)
      const escaped = oldChunk.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(`\\./${escaped}`, "gi");
      code = code.replace(regex, `./${newChunk}`);

      // Also handle the uppercase variant that appears in actual import statements
      const upperVariant = oldChunk.replace(/chunk-/, "chunk-").toUpperCase();
      if (upperVariant !== oldChunk) {
        const escapedUpper = upperVariant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        code = code.replace(new RegExp(`\\./${escapedUpper}`, "gi"), `./${newChunk}`);
      }
    }

    result.code = code;
  }

  // ── Build centralized docs-links mapping ──
  const docsLinksMap = {};
  for (const result of results) {
    if (!result.docsUrl) continue;
    // Find the route path for this file
    for (const [routeId, info] of Object.entries(ROUTE_MAP)) {
      const expectedOutName = `page--${pathToName(info.path)}.mjs`;
      if (result.outName === expectedOutName) {
        const docPath = result.docsUrl.replace(DOCS_BASE, "") || "/";
        docsLinksMap[info.path] = docPath;

        // Add import and annotate the hardcoded URL with its docs-links key
        result.code = `import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";\n` + result.code;
        // Annotate the URL line: url: "https://..." → url: "https://..." /* docs-links key */
        const escapedUrl = result.docsUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        result.code = result.code.replace(
          new RegExp(`(url:\\s*"${escapedUrl}")`),
          `$1 /* → getDocsUrl("${info.path}") */`
        );
        break;
      }
    }
  }

  // Generate docs-links.mjs in the output directory
  if (Object.keys(docsLinksMap).length > 0) {
    let docsLinksCode = `/**\n * Centralized GitBook documentation URLs for all toolbox pages.\n *\n * Auto-generated by deobfuscate.mjs — do not edit manually.\n * Each key is a route path, each value is the docs.neoflix.care sub-path.\n */\n\n`;
    docsLinksCode += `export const DOCS_BASE = "${DOCS_BASE}";\n\n`;
    docsLinksCode += `export const DOCS_LINKS = {\n`;
    for (const [routePath, docPath] of Object.entries(docsLinksMap).sort()) {
      docsLinksCode += `  "${routePath}": "${docPath}",\n`;
    }
    docsLinksCode += `};\n\n`;
    docsLinksCode += `/**\n * Get the full docs URL for a given route path.\n * @param {string} routePath - e.g. "/Toolbox_Pioneer_Team"\n * @returns {string|null}\n */\n`;
    docsLinksCode += `export function getDocsUrl(routePath) {\n`;
    docsLinksCode += `  const docPath = DOCS_LINKS[routePath];\n`;
    docsLinksCode += `  if (!docPath) return null;\n`;
    docsLinksCode += `  return \`\${DOCS_BASE}\${docPath}\`;\n`;
    docsLinksCode += `}\n`;
    writeFileSync(join(OUT_DIR, "docs-links.mjs"), docsLinksCode);
  }

  // Write all files
  for (const { outName, code } of results) {
    writeFileSync(join(OUT_DIR, outName), code);
  }

  // Generate route map
  let routeMapContent = `# Route Map\n\n`;
  routeMapContent += `This maps URL paths to their deobfuscated page component files.\n\n`;
  routeMapContent += `| URL Path | Page Component File | Route ID | Named Elements |\n`;
  routeMapContent += `|----------|-------------------|----------|----------------|\n`;

  for (const [routeId, info] of Object.entries(ROUTE_MAP)) {
    const pageName = pathToName(info.path);
    const elements = info.elements ? Object.entries(info.elements).map(([k, v]) => `${k}=${v}`).join(", ") : "";
    routeMapContent += `| \`${info.path}\` | \`page--${pageName}.mjs\` | \`${routeId}\` | ${elements} |\n`;
  }

  routeMapContent += `\n## Shared Chunks\n\n`;
  routeMapContent += `| Original File | Deobfuscated Name | Purpose |\n`;
  routeMapContent += `|--------------|-------------------|----------|\n`;
  for (const [oldName, newName] of Object.entries(CHUNK_NAMES)) {
    const purpose = newName.replace("chunk--", "").replace("script_main--", "").replace("page--", "").replace(".mjs", "").replace(/-/g, " ");
    routeMapContent += `| \`${oldName}\` | \`${newName}\` | ${purpose} |\n`;
  }

  routeMapContent += `\n## Responsive Breakpoints\n\n`;
  routeMapContent += `All pages use these breakpoints:\n`;
  routeMapContent += `- **Desktop**: \`min-width: 1200px\`\n`;
  routeMapContent += `- **Tablet**: \`min-width: 810px and max-width: 1199px\`\n`;
  routeMapContent += `- **Mobile**: \`max-width: 809px\`\n`;

  routeMapContent += `\n## Page Transition Animation\n\n`;
  routeMapContent += `All toolbox pages use the same enter transition when navigating from home:\n`;
  routeMapContent += `\`\`\`js\n`;
  routeMapContent += `{\n  opacity: 0 → 1,\n  scale: 1,\n  duration: 0.2s,\n  easing: cubic-bezier(0.27, 0, 0.51, 1),\n  type: "tween"\n}\n`;
  routeMapContent += `\`\`\`\n`;

  writeFileSync(join(OUT_DIR, "ROUTE_MAP.md"), routeMapContent);

  console.log(`\n✓ Deobfuscated ${results.length} files to ${OUT_DIR}/`);
  console.log(`✓ Generated ROUTE_MAP.md`);
  console.log(`✓ Generated docs-links.mjs (${Object.keys(docsLinksMap).length} GitBook URLs centralized)`);
}

main().catch(console.error);
