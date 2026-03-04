/**
 * Toolbox page: Case Selection
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Case_selection", "Case Selection");

export default page;
export { metadata as __FramerMetadata__ };
