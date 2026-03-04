/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { a as t } from "./chunk--site-metadata.mjs";
function i(e, a) {
  return {
    bodyClassName: "framer-body-ut1mnZVW1",
    breakpoints: [
      { hash: "1pcffxn", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "1ccw4b4",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "b200ne", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(e, a).title || "Toolbox_Questions_to_ask_during_previewing",
    viewport: "width=device-width",
  };
}
var s = 1,
  m = {
    exports: {
      default: {
        type: "function",
        annotations: { framerContractVersion: "1" },
      },
      metadataVersion: {
        type: "variable",
        annotations: { framerContractVersion: "1" },
      },
      __FramerMetadata__: { type: "variable" },
    },
  };
export { i as a, s as b, m as c };
