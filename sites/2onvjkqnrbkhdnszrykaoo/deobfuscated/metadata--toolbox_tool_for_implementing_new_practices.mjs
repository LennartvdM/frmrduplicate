/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(t, a) {
  return {
    bodyClassName: "framer-body-rC8gH4Mco",
    breakpoints: [
      { hash: "15ezkr5", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "r6basb",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "1o0j81x", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(t, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(t, a).title || "Toolbox_Tool_for_implementing_new_practices",
    viewport: "width=device-width",
  };
}
var m = 1,
  s = {
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
export { r as a, m as b, s as c };
