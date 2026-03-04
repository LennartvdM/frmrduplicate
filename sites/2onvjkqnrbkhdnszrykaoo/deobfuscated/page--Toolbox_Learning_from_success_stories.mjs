/**
 * Toolbox page: Learning from Success Stories
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Learning_from_success_stories", "Learning from Success Stories");

export default page;
export { metadata as __FramerMetadata__ };
