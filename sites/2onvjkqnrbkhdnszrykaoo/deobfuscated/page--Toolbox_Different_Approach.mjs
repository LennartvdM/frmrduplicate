/**
 * Toolbox page: Different Approach
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Different_Approach", "Different Approach");

export default page;
export { metadata as __FramerMetadata__ };
