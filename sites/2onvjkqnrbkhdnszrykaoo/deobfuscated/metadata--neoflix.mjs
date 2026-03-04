/**
 * Page metadata chunk - contains responsive breakpoints, SEO metadata, and page title.
 * breakpoints define responsive behavior at different screen widths.
 */
import { getSiteMetadata } from "./chunk--site-metadata.mjs";
function r(e, a) {
  return {
    bodyClassName: "framer-body-bzydBB85Y",
    breakpoints: [
      { hash: "18oda3j", mediaQuery: "(min-width: 1200px)" },
      { hash: "p363ye", mediaQuery: "(max-width: 1199px)" },
    ],
    description: getSiteMetadata(e, a).description,
    elements: {
      dbtg_NZW8: "dance1",
      DXqsCYt4L: "perspectives1",
      mRVhqybMB: "skills1",
      NYP2seWhD: "team1",
      tftSCv8zZ: "cost1",
      WjO84y3BZ: "time1",
    },
    robots: "max-image-preview:large",
    serializationId: "framer-CacIk",
    title: getSiteMetadata(e, a).title || "Neoflix",
    viewport: "width=device-width",
  };
}
var d = 1,
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
export { r as a, d as b, m as c };
