/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(t, a) {
  return {
    bodyClassName: "framer-body-ymL2yz5Md",
    breakpoints: [
      { hash: "unvdhx", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "14oigkf",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "1fgovn0", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(t, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(t, a).title || "Toolbox_Share_your_experience",
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
