/**
 * Toolbox page: Tool for Implementing New Practices
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Tool_for_implementing_new_practices", "Tool for Implementing New Practices");

export default page;
export { metadata as __FramerMetadata__ };
