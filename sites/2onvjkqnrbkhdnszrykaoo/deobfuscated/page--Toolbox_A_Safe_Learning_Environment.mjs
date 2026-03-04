/**
 * Toolbox page: A Safe Learning Environment
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_A_Safe_Learning_Environment", "A Safe Learning Environment");

export default page;
export { metadata as __FramerMetadata__ };
