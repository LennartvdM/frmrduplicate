/**
 * Centralized GitBook documentation URLs for all toolbox pages.
 *
 * Each key is a route path from ROUTE_MAP. Each value is the
 * docs.neoflix.care URL embedded as an iframe on that page.
 *
 * This module is the single source of truth — the deobfuscator
 * generates it automatically, and deobfuscated page components
 * import from it instead of hardcoding the URL.
 */

export const DOCS_BASE = "https://docs.neoflix.care";

export const DOCS_LINKS = {
  "/Toolbox": "/",
  "/Toolbox-Planning_Your_Initiative": "/level-1-fundamentals/2.-planning-your-initiative",
  "/Toolbox-Reflect": "/level-2-in-action/reflect",
  "/Toolbox-Safe_Simple_Small": "/level-1-fundamentals/3.-safe-simple-and-small",
  "/Toolbox_A_Safe_Learning_Environment": "/level-2-in-action/11.-lets-neoflix/11.2-a-safe-learning-environment",
  "/Toolbox_After_the_Intervention": "/level-2-in-action/9.-after-the-intervention",
  "/Toolbox_Case_selection": "/level-2-in-action/5.-preparation-and-consent/5.2-case-selection",
  "/Toolbox_Different_Approach": "/level-1-fundamentals/1.-preproduction/1.1-beyond-the-procedure#taking-a-different-approach",
  "/Toolbox_Education_And_Training": "/level-2-in-action/14.-education-and-training",
  "/Toolbox_How_it_works": "/welcome/neoflix/how-it-works",
  "/Toolbox_Input_for_research": "/level-2-in-action/13.1-the-neoflix-approach/13.2-input-for-research",
  "/Toolbox_Learning_From_Variety": "/level-1-fundamentals/4.-learning-from-success-stories",
  "/Toolbox_Learning_from_success_stories": "/level-1-fundamentals/4.-learning-from-success-stories",
  "/Toolbox_Let's_Neoflix": "/level-2-in-action/11.-lets-neoflix",
  "/Toolbox_Metadata_and_Archiving": "/level-2-in-action/9.-after-the-intervention/9.3-metadata-and-archiving",
  "/Toolbox_Pioneer_Team": "/level-1-fundamentals/2.-planning-your-initiative/2.1-pioneer-team",
  "/Toolbox_Preparation_and_Consent": "/level-2-in-action/5.-preparation-and-consent",
  "/Toolbox_Questions_to_ask_during_previewing": "/level-2-in-action/10.-previewing/10.1-questions-to-ask-during-previewing",
  "/Toolbox_Recordings_for_research": "/level-2-in-action/15.-recordings-for-research",
  "/Toolbox_Revolutionize_Reflection_in_medical_care:_join_the_network": "/level-3-growth/18.-expanding-your-video-program/18.1-revolutionize-reflection-in-medical-care-join-the-network",
  "/Toolbox_Share_your_experience": "/level-1-fundamentals/4.-learning-from-success-stories/4.1-share-your-experience",
  "/Toolbox_Tool_for_implementing_new_practices": "/level-2-in-action/16.-tool-for-implementing-new-practices",
  "/Toolbox_Unburdening_the_process": "/level-1-fundamentals/1.-preproduction/1.4-unburdening-the-process",
  "/toolbox_case_leiden": "/level-1-fundamentals/4.-learning-from-success-stories/nicu-in-leiden-the-netherlands",
  "/toolbox_case_succcessstories": "/level-1-fundamentals/4.-learning-from-success-stories",
};

/**
 * Get the full docs URL for a given route path.
 * @param {string} routePath - Route path from ROUTE_MAP (e.g. "/Toolbox_Pioneer_Team")
 * @returns {string|null} Full URL or null if no docs link exists for this route
 */
export function getDocsUrl(routePath) {
  const docPath = DOCS_LINKS[routePath];
  if (!docPath) return null;
  return `${DOCS_BASE}${docPath}`;
}
