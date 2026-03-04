/**
 * Metadata: Let's Neoflix
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxMetadata } from "./toolbox-page-factory.mjs";

var meta = createToolboxMetadata("/Toolbox_Let's_Neoflix", "Let's Neoflix");

export { meta as a };
export var b = meta.version;
export var c = meta.__FramerMetadata__;
