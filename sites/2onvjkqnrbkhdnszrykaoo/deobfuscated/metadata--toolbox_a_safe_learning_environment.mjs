/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-sEYnG8vfd",
    breakpoints: [
      { hash: "1o8137r", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "69v6g2",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "j6nyvl", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: getSiteMetadata(e, a).title || "Toolbox_A_Safe_Learning_Environment",
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
