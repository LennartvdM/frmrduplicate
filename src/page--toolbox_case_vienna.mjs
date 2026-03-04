/**
 * Toolbox page: Case Study — Vienna
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/toolbox_case_vienna", "Case Study — Vienna");

export default page;
export { metadata as __FramerMetadata__ };
