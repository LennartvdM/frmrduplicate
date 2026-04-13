/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(a, e) {
  return {
    bodyClassName: "framer-body-augiA20Il",
    breakpoints: [
      { hash: "72rtr7", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "1uu5wld",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "1jamxon", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(a, e).description,
    elements: {},
    robots: "max-image-preview:large",
    serializationId: "framer-qO1UX",
    title: getSiteMetadata(a, e).title || "Home",
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
