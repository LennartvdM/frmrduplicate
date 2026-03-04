/**
 * Metadata: Metadata and Archiving
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxMetadata } from "./toolbox-page-factory.mjs";

var meta = createToolboxMetadata("/Toolbox_Metadata_and_Archiving", "Metadata and Archiving");

export { meta as a };
export var b = meta.version;
export var c = meta.__FramerMetadata__;
