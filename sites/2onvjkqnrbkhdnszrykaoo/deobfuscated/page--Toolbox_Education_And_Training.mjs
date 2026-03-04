/**
 * Toolbox page: Education and Training
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Education_And_Training", "Education and Training");

export default page;
export { metadata as __FramerMetadata__ };
