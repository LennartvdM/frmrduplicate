/**
 * Toolbox page: Preparation and Consent
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Preparation_and_Consent", "Preparation and Consent");

export default page;
export { metadata as __FramerMetadata__ };
