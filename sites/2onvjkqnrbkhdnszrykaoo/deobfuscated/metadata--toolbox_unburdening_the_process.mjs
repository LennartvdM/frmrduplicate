/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-X8n9MxBBr",
    breakpoints: [
      { hash: "vey6bu", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "1kt2119",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "1if43vz", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(e, a).title || "Toolbox_Unburdening_the_process",
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
export { r as a, s as b, m as c };
