/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { a as t } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-uQs2bgVcT",
    breakpoints: [
      { hash: "1britxi", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "yiuxz5",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "19ox8u4", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(e, a).title || "Toolbox_Recordings_for_research",
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
