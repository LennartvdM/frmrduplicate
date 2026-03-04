/**
 * Toolbox page: Input for Research
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Input_for_research", "Input for Research");

export default page;
export { metadata as __FramerMetadata__ };
