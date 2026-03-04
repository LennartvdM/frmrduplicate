/**
 * Toolbox page: Case Study — Philadelphia
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/toolbox_case_philadelphia", "Case Study — Philadelphia");

export default page;
export { metadata as __FramerMetadata__ };
