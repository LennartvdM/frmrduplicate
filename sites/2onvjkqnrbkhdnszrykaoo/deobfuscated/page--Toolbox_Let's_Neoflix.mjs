/**
 * Toolbox page: Let's Neoflix
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Let's_Neoflix", "Let's Neoflix");

export default page;
export { metadata as __FramerMetadata__ };
