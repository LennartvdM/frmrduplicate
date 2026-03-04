/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { a as t } from "./chunk--site-metadata.mjs";
function i(e, a) {
  return {
    bodyClassName: "framer-body-H5snp07v4",
    breakpoints: [
      { hash: "ei83m9", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "8y62k",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "toq88q", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(e, a).title || "Toolbox_Case_selection",
    viewport: "width=device-width",
  };
}
var s = 1,
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
export { i as a, s as b, m as c };
