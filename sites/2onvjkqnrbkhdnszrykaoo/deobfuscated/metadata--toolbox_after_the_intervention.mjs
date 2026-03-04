/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { a as t } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-NM8YGpOE1",
    breakpoints: [
      { hash: "1mp5enu", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "y38g2e",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "sfpcfu", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(e, a).title || "Toolbox_After_the_Intervention",
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
