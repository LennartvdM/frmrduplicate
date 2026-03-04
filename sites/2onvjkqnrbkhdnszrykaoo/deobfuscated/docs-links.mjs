/**
 * Centralized GitBook documentation links for all Toolbox pages.
 *
 * Each key corresponds to a route path from the ROUTE_MAP.
 * Each value is the docs.neoflix.care URL embedded as an iframe on that page.
 *
 * To add a new toolbox page, add its route path and docs URL here.
 * The page components import their URL from this module instead of hardcoding it.
 */

const DOCS_BASE = "https://docs.neoflix.care";

export const DOCS_LINKS = {
  "/Toolbox": `${DOCS_BASE}/`,
  "/Toolbox-Planning_Your_Initiative": `${DOCS_BASE}/level-1-fundamentals/2.-planning-your-initiative`,
  "/Toolbox-Reflect": `${DOCS_BASE}/level-2-in-action/reflect`,
  "/Toolbox-Safe_Simple_Small": `${DOCS_BASE}/level-1-fundamentals/3.-safe-simple-and-small`,
  "/Toolbox_A_Safe_Learning_Environment": `${DOCS_BASE}/level-2-in-action/11.-lets-neoflix/11.2-a-safe-learning-environment`,
  "/Toolbox_After_the_Intervention": `${DOCS_BASE}/level-2-in-action/9.-after-the-intervention`,
  "/Toolbox_Case_selection": `${DOCS_BASE}/level-2-in-action/5.-preparation-and-consent/5.2-case-selection`,
  "/Toolbox_Different_Approach": `${DOCS_BASE}/level-1-fundamentals/1.-preproduction/1.1-beyond-the-procedure#taking-a-different-approach`,
  "/Toolbox_Education_And_Training": `${DOCS_BASE}/level-2-in-action/14.-education-and-training`,
  "/Toolbox_How_it_works": `${DOCS_BASE}/welcome/neoflix/how-it-works`,
  "/Toolbox_Input_for_research": `${DOCS_BASE}/level-2-in-action/13.1-the-neoflix-approach/13.2-input-for-research`,
  "/Toolbox_Learning_From_Variety": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories`,
  "/Toolbox_Learning_from_success_stories": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories`,
  "/Toolbox_Let's_Neoflix": `${DOCS_BASE}/level-2-in-action/11.-lets-neoflix`,
  "/Toolbox_Metadata_and_Archiving": `${DOCS_BASE}/level-2-in-action/9.-after-the-intervention/9.3-metadata-and-archiving`,
  "/Toolbox_Pioneer_Team": `${DOCS_BASE}/level-1-fundamentals/2.-planning-your-initiative/2.1-pioneer-team`,
  "/Toolbox_Preparation_and_Consent": `${DOCS_BASE}/level-2-in-action/5.-preparation-and-consent`,
  "/Toolbox_Questions_to_ask_during_previewing": `${DOCS_BASE}/level-2-in-action/10.-previewing/10.1-questions-to-ask-during-previewing`,
  "/Toolbox_Recordings_for_research": `${DOCS_BASE}/level-2-in-action/15.-recordings-for-research`,
  "/Toolbox_Revolutionize_Reflection_in_medical_care:_join_the_network": `${DOCS_BASE}/level-3-growth/18.-expanding-your-video-program/18.1-revolutionize-reflection-in-medical-care-join-the-network`,
  "/Toolbox_Share_your_experience": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories/4.1-share-your-experience`,
  "/Toolbox_Tasks_of_the_chair": `${DOCS_BASE}/level-2-in-action/11.-lets-neoflix/11.1-tasks-of-the-chair`,
  "/Toolbox_Tool_for_implementing_new_practices": `${DOCS_BASE}/level-2-in-action/16.-tool-for-implementing-new-practices`,
  "/Toolbox_Unburdening_the_process": `${DOCS_BASE}/level-1-fundamentals/1.-preproduction/1.4-unburdening-the-process`,
  "/toolbox_case_leiden": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories/nicu-in-leiden-the-netherlands`,
  "/toolbox_case_philadelphia": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories/nicu-in-philadelphia`,
  "/toolbox_case_vienna": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories/nicu-in-vienna`,
  "/toolbox_case_australia": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories/nicu-in-australia`,
  "/toolbox_case_succcessstories": `${DOCS_BASE}/level-1-fundamentals/4.-learning-from-success-stories`,
};

/**
 * Get the docs URL for a given route path.
 * Returns the full docs.neoflix.care URL or null if no mapping exists.
 */
export function getDocsUrl(routePath) {
  return DOCS_LINKS[routePath] ?? null;
}

/**
 * Get the docs base URL, useful for constructing new paths.
 */
export { DOCS_BASE };
