/**
 * Toolbox page: How It Works
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_How_it_works", "How It Works");

export default page;
export { metadata as __FramerMetadata__ };
