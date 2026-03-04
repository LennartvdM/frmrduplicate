/**
 * Toolbox page: Metadata and Archiving
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Metadata_and_Archiving", "Metadata and Archiving");

export default page;
export { metadata as __FramerMetadata__ };
