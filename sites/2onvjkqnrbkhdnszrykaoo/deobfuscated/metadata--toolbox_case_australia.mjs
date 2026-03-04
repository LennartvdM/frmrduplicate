/**
 * Metadata: Case Study — Australia
 * Thin wrapper — all logic lives in toolbox-page-factory.mjs
 */
import { createToolboxMetadata } from "./toolbox-page-factory.mjs";

var meta = createToolboxMetadata("/toolbox_case_australia", "Case Study — Australia");

export { meta as a };
export var b = meta.version;
export var c = meta.__FramerMetadata__;
