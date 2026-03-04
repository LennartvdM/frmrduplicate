/**
 * Metadata: A Safe Learning Environment
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxMetadata } from "./toolbox-page-factory.mjs";

var meta = createToolboxMetadata("/Toolbox_A_Safe_Learning_Environment", "A Safe Learning Environment");

export { meta as a };
export var b = meta.version;
export var c = meta.__FramerMetadata__;
