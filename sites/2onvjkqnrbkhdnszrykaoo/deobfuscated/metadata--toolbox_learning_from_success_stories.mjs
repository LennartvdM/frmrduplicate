/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-N3WZmbqwm",
    breakpoints: [
      { hash: "wya8or", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "1vx2iul",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "3ttsx", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(e, a).title || "Toolbox_Learning_from_success_stories",
    viewport: "width=device-width",
  };
}
var d = 1,
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
export { r as a, d as b, m as c };
