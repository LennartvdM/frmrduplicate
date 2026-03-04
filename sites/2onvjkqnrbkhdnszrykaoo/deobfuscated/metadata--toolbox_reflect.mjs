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
    bodyClassName: "framer-body-cASgO3jWQ",
    breakpoints: [
      { hash: "1mbeqf9", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "10zzggt",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "1vimne8", mediaQuery: "(max-width: 809px)" },
    ],
    description: t(e, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title: t(e, a).title || "Toolbox Reflect",
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
