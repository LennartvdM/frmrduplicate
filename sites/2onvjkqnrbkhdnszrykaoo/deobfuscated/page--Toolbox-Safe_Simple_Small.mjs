/**
 * Toolbox page: Safe Simple Small
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox-Safe_Simple_Small", "Safe Simple Small");

export default page;
export { metadata as __FramerMetadata__ };
