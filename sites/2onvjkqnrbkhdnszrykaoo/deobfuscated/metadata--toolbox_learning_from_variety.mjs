/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-HtIN1t6ER",
    breakpoints: [
      { hash: "1kh1fjx", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "194pul6",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "16sp69q", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(e, a).title || "Toolbox_Learning_From_Variety",
    viewport: "width=device-width",
  };
}
var m = 1,
  s = {
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
export { r as a, m as b, s as c };
