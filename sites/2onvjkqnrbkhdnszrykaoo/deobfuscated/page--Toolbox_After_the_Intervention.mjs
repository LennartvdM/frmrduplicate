/**
 * Toolbox page: After the Intervention
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_After_the_Intervention", "After the Intervention");

export default page;
export { metadata as __FramerMetadata__ };
