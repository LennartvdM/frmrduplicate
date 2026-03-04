/**
 * Generates thin wrapper files for all toolbox pages + metadata.
 *
 * Replaces the 25 nearly-identical page--Toolbox*.mjs files and
 * 24 metadata--toolbox*.mjs files with ~5-line wrappers that delegate
 * to the shared toolbox-page-factory.mjs.
 *
 * Also deletes the individual CSS files (replaced by shared CSS in the factory).
 *
 * Usage: node generate-toolbox-wrappers.mjs
 */

import { writeFileSync, unlinkSync, existsSync, readdirSync } from "fs";
import path from "path";

// ═══════════════════════════════════════════════════════════════
// Route → display name mapping (extracted from original files)
// ═══════════════════════════════════════════════════════════════

const TOOLBOX_PAGES = {
  // Main toolbox
  "/Toolbox": "Toolbox",
  // Uppercase toolbox pages (hyphen or underscore)
  "/Toolbox-Planning_Your_Initiative": "Planning Your Initiative",
  "/Toolbox-Reflect": "Reflect",
  "/Toolbox-Safe_Simple_Small": "Safe Simple Small",
  "/Toolbox_A_Safe_Learning_Environment": "A Safe Learning Environment",
  "/Toolbox_After_the_Intervention": "After the Intervention",
  "/Toolbox_Case_selection": "Case Selection",
  "/Toolbox_Different_Approach": "Different Approach",
  "/Toolbox_Education_And_Training": "Education and Training",
  "/Toolbox_How_it_works": "How It Works",
  "/Toolbox_Input_for_research": "Input for Research",
  "/Toolbox_Learning_From_Variety": "Learning from Variety",
  "/Toolbox_Learning_from_success_stories": "Learning from Success Stories",
  "/Toolbox_Let's_Neoflix": "Let's Neoflix",
  "/Toolbox_Metadata_and_Archiving": "Metadata and Archiving",
  "/Toolbox_Pioneer_Team": "Pioneer Team",
  "/Toolbox_Preparation_and_Consent": "Preparation and Consent",
  "/Toolbox_Questions_to_ask_during_previewing": "Questions to Ask During Previewing",
  "/Toolbox_Recordings_for_research": "Recordings for Research",
  "/Toolbox_Revolutionize_Reflection_in_medical_care:_join_the_network": "Revolutionize Reflection — Join the Network",
  "/Toolbox_Share_your_experience": "Share Your Experience",
  "/Toolbox_Tool_for_implementing_new_practices": "Tool for Implementing New Practices",
  "/Toolbox_Tasks_of_the_chair": "Tasks of the Chair",
  "/Toolbox_Unburdening_the_process": "Unburdening the Process",
  // Lowercase case study pages
  "/toolbox_case_leiden": "Case Study — Leiden",
  "/toolbox_case_succcessstories": "Success Stories",
};

// Routes that exist in the router but have no deobfuscated page file yet
const MISSING_PAGES = {
  "/toolbox_case_philadelphia": "Case Study — Philadelphia",
  "/toolbox_case_vienna": "Case Study — Vienna",
  "/toolbox_case_australia": "Case Study — Australia",
};

// ═══════════════════════════════════════════════════════════════
// File name helpers
// ═══════════════════════════════════════════════════════════════

function routeToPageFilename(routePath) {
  // "/Toolbox_Pioneer_Team" → "page--Toolbox_Pioneer_Team.mjs"
  // "/Toolbox_Revolutionize_Reflection_in_medical_care:_join_the_network"
  //   → "page--Toolbox_Revolutionize_Reflection_in_medical_care__join_the_network.mjs"
  const name = routePath.slice(1).replace(/:/g, "_");
  return `page--${name}.mjs`;
}

function routeToMetadataFilename(routePath) {
  // "/Toolbox_Pioneer_Team" → "metadata--toolbox_pioneer_team.mjs"
  const name = routePath.slice(1).toLowerCase().replace(/-/g, "_").replace(/:/g, "_").replace(/'/g, "_");
  return `metadata--${name}.mjs`;
}

function routeToCssFilename(routePath) {
  const name = routePath.slice(1).replace(/:/g, "_");
  return `page--${name}.css`;
}

// ═══════════════════════════════════════════════════════════════
// Template generators
// ═══════════════════════════════════════════════════════════════

function generatePageWrapper(routePath, displayName) {
  return `/**
 * Toolbox page: ${displayName}
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("${routePath}", "${displayName}");

export default page;
export { metadata as __FramerMetadata__ };
`;
}

function generateMetadataWrapper(routePath, displayName) {
  return `/**
 * Metadata: ${displayName}
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxMetadata } from "./toolbox-page-factory.mjs";

var meta = createToolboxMetadata("${routePath}", "${displayName}");

export { meta as a };
export var b = meta.version;
export var c = meta.__FramerMetadata__;
`;
}

// ═══════════════════════════════════════════════════════════════
// Main
// ═══════════════════════════════════════════════════════════════

const dir = path.dirname(new URL(import.meta.url).pathname);
let pagesWritten = 0;
let metadataWritten = 0;
let cssDeleted = 0;
let missingPagesCreated = 0;

// Generate page wrappers
for (const [routePath, displayName] of Object.entries(TOOLBOX_PAGES)) {
  const filename = routeToPageFilename(routePath);
  const filepath = path.join(dir, filename);
  writeFileSync(filepath, generatePageWrapper(routePath, displayName));
  pagesWritten++;
  console.log(`  page  ${filename}`);
}

// Generate page wrappers for missing case study pages
for (const [routePath, displayName] of Object.entries(MISSING_PAGES)) {
  const filename = routeToPageFilename(routePath);
  const filepath = path.join(dir, filename);
  writeFileSync(filepath, generatePageWrapper(routePath, displayName));
  missingPagesCreated++;
  console.log(`  page  ${filename} (new — was missing)`);
}

// Generate metadata wrappers
for (const [routePath, displayName] of Object.entries({ ...TOOLBOX_PAGES, ...MISSING_PAGES })) {
  const filename = routeToMetadataFilename(routePath);
  const filepath = path.join(dir, filename);
  writeFileSync(filepath, generateMetadataWrapper(routePath, displayName));
  metadataWritten++;
  console.log(`  meta  ${filename}`);
}

// Delete individual CSS files
const cssDir = path.join(dir, "css");
for (const [routePath] of Object.entries(TOOLBOX_PAGES)) {
  const filename = routeToCssFilename(routePath);
  const filepath = path.join(cssDir, filename);
  if (existsSync(filepath)) {
    unlinkSync(filepath);
    cssDeleted++;
    console.log(`  del   css/${filename}`);
  }
}

console.log(`
Done:
  ${pagesWritten} page wrappers written
  ${missingPagesCreated} missing page wrappers created
  ${metadataWritten} metadata wrappers written
  ${cssDeleted} individual CSS files deleted
`);
