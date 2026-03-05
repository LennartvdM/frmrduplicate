/**
 * Consolidated toolbox pages — all 29 toolbox routes in one file.
 *
 * Replaces the 29 individual page--Toolbox*.mjs wrapper files.
 * Each was a 10-line file calling createToolboxPage() with a route + title.
 * Now they're all created here in a single lookup table.
 *
 * The router lazy-loads this module and uses getModule(route) to get
 * the correct { default, __FramerMetadata__ } shape for each route.
 */

import { createToolboxPage } from "./toolbox-page-factory.mjs";

// ═══════════════════════════════════════════════════════════════
// Route → display name mapping (all 29 toolbox routes)
// ═══════════════════════════════════════════════════════════════

var TOOLBOX_ROUTES = {
  "/Toolbox": "Toolbox",
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
  "/Toolbox_Tasks_of_the_chair": "Tasks of the Chair",
  "/Toolbox_Tool_for_implementing_new_practices": "Tool for Implementing New Practices",
  "/Toolbox_Unburdening_the_process": "Unburdening the Process",
  "/toolbox_case_australia": "Case Study — Australia",
  "/toolbox_case_leiden": "Case Study — Leiden",
  "/toolbox_case_philadelphia": "Case Study — Philadelphia",
  "/toolbox_case_succcessstories": "Success Stories",
  "/toolbox_case_vienna": "Case Study — Vienna",
};

// ═══════════════════════════════════════════════════════════════
// Build all pages once, store in lookup
// ═══════════════════════════════════════════════════════════════

var pages = {};
for (var [route, title] of Object.entries(TOOLBOX_ROUTES)) {
  var { page, metadata } = createToolboxPage(route, title);
  pages[route] = { default: page, __FramerMetadata__: metadata };
}

/**
 * Returns a module-shaped object { default, __FramerMetadata__ } for the given route.
 * Used by the router: lazyLoadPage(() => import("./toolbox-pages.mjs").then(m => m.getModule("/Toolbox")))
 */
export function getModule(route) {
  return pages[route];
}

export { TOOLBOX_ROUTES };
