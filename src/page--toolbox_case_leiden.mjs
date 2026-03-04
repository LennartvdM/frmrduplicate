/**
 * Toolbox page: Case Study — Leiden
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/toolbox_case_leiden", "Case Study — Leiden");

export default page;
export { metadata as __FramerMetadata__ };
