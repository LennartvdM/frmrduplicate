/**
 * Toolbox page: Planning Your Initiative
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox-Planning_Your_Initiative", "Planning Your Initiative");

export default page;
export { metadata as __FramerMetadata__ };
