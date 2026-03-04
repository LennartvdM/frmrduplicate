/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-MrFemP8j0",
    breakpoints: [
      { hash: "1ot7ppf", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "10dqtwf",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "p97cug", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(e, a).title || "Toolbox_Different_Approach",
    viewport: "width=device-width",
  };
}
var m = 1,
  p = {
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
export { r as a, m as b, p as c };
