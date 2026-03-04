/**
 * Toolbox page: Recordings for Research
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Recordings_for_research", "Recordings for Research");

export default page;
export { metadata as __FramerMetadata__ };
