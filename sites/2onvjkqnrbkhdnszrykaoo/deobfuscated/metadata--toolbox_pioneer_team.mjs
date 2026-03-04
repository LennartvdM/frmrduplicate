/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(t, a) {
  return {
    bodyClassName: "framer-body-KgHIqfucs",
    breakpoints: [
      { hash: "9x61e", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "18l618w",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "2gctam", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(t, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(t, a).title || "Toolbox_Pioneer_Team",
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
