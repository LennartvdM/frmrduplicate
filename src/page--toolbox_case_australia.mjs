/**
 * Toolbox page: Case Study — Australia
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/toolbox_case_australia", "Case Study — Australia");

export default page;
export { metadata as __FramerMetadata__ };
