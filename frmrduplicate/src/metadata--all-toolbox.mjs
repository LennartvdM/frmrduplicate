/**
 * Consolidated toolbox metadata — all 29 toolbox routes in one file.
 *
 * Replaces the 29 individual metadata--toolbox*.mjs wrapper files.
 * Each was an 11-line file calling createToolboxMetadata() with a route + title.
 *
 * These metadata modules are part of Framer's build-time metadata system.
 * They are NOT imported at runtime by the router or any page component.
 */

import { createToolboxMetadata } from "./toolbox-page-factory.mjs";

// ═══════════════════════════════════════════════════════════════
// Route → display name mapping (matches toolbox-pages.mjs)
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

// Build all metadata objects
var allMetadata = {};
for (var [route, title] of Object.entries(TOOLBOX_ROUTES)) {
  allMetadata[route] = createToolboxMetadata(route, title);
}

/**
 * Get metadata for a specific toolbox route.
 * Returns { getMetadata, version, __FramerMetadata__ }.
 */
export function getMetadata(route) {
  return allMetadata[route];
}

export { TOOLBOX_ROUTES };
