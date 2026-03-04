/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function i(t, a) {
  return {
    bodyClassName: "framer-body-fN3izV_im",
    breakpoints: [
      { hash: "1tciqdj", mediaQuery: "(min-width: 1200px)" },
      {
        hash: "1xvy3mp",
        mediaQuery: "(min-width: 810px) and (max-width: 1199px)",
      },
      { hash: "401nlj", mediaQuery: "(max-width: 809px)" },
    ],
    description: getSiteMetadata(t, a).description,
    elements: {},
    robots: "max-image-preview:large",
    title:
      getSiteMetadata(t, a).title ||
      "Toolbox_Revolutionize_Reflection_in_medical_care:_join_the_network",
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
