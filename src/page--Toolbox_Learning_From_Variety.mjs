/**
 * Toolbox page: Learning from Variety
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Learning_From_Variety", "Learning from Variety");

export default page;
export { metadata as __FramerMetadata__ };
