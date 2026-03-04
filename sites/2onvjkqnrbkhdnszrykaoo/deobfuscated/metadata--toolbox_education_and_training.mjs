/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { a as t } from "./chunk--site-metadata.mjs";
function r(a, e) {
  return {
    bodyClassName: "framer-body-S5cL1K0Pb",
    breakpoints: [
      { hash: "lqr5ys", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "yadj0l",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "1tbvaw4", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(a, e).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(a, e).title || "Toolbox_Education_And_Training",
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
