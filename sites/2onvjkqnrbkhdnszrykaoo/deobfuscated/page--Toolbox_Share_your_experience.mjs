/**
 * Toolbox page: Share Your Experience
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxPage } from "./toolbox-page-factory.mjs";

var { page, metadata } = createToolboxPage("/Toolbox_Share_your_experience", "Share Your Experience");

export default page;
export { metadata as __FramerMetadata__ };
