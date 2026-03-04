/**
 * Toolbox page: Unburdening the Process
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Unburdening_the_process", "Unburdening the Process");

export default page;
export { metadata as __FramerMetadata__ };
