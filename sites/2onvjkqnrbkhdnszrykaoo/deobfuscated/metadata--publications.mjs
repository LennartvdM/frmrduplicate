/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { a as e } from "./chunk--site-metadata.mjs";
function r(t, a) {
  return {
    bodyClassName: "framer-body-aLuYbVoBY",
    breakpoints: [
      { hash: "1t32e7q", mediaQuery: "(min-width: 1200px)" },
      { hash: "1byrpbb", mediaQuery: "(max-width: 1199px)" },
    ],
    description: e(t, a).description,
    elements: {
      DSPosq1GU: "narrative",
      Y8dEgTIYh: "recordfelectrefine",
      zQbFj9_vB: "providers",
    },
    robots: "max-image-preview:large",
    serializationId: "framer-9Y9Hr",
    title: e(t, a).title || "Publications",
    viewport: "width=device-width",
  };
}
var s = 1,
  m = {
    exports: {
      metadataVersion: {
        type: "variable",
        annotations: { framerContractVersion: "1" },
      },
      default: {
        type: "function",
        annotations: { framerContractVersion: "1" },
      },
      __FramerMetadata__: { type: "variable" },
    },
  };
export { r as a, s as b, m as c };
