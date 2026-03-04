/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function i(t, a) {
  return {
    bodyClassName: "framer-body-KeW3JpTIh",
    breakpoints: [
      { hash: "wr5ha4", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "6oymji",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "p7zdm1", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(t, a).description,
    elements: {},
    robots: "max-image-preview:large",
    serializationId: "framer-vWnxi",
    title: getSiteMetadata(t, a).title || "Toolbox_case_leiden",
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
export { i as a, m as b, s as c };
