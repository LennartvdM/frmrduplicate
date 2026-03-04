/**
 * Toolbox page: Pioneer Team
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Pioneer_Team", "Pioneer Team");

export default page;
export { metadata as __FramerMetadata__ };
