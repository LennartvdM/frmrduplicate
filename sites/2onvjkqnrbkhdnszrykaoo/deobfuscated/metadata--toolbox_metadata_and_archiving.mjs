/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(a, e) {
  return {
    bodyClassName: "framer-body-zI2CbZmPJ",
    breakpoints: [
      { hash: "43j6u0", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "2qdt5u",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "1pxop0j", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(a, e).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(a, e).title || "Toolbox_Metadata_and_Archiving",
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
