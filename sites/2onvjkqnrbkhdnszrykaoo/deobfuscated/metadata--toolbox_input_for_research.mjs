/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
/**
 * Import aliases resolved:
 *   t → getSiteMetadata
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-mRVtT24DH",
    breakpoints: [
      { hash: "1pw2z21", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "10nl6ek",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "139oww4", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(e, a).title || "Toolbox_Input_for_research",
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
