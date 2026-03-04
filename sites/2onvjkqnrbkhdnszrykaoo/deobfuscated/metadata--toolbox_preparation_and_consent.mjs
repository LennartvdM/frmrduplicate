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
    bodyClassName: "framer-body-t97unZiTK",
    breakpoints: [
      { hash: "10h0inf", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "1uxufpz",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "zvgozg", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(e, a).title || "Toolbox_Preparation_and_Consent",
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
