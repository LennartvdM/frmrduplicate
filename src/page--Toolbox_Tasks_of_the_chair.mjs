/**
 * Toolbox page: Tasks of the Chair
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Tasks_of_the_chair", "Tasks of the Chair");

export default page;
export { metadata as __FramerMetadata__ };
