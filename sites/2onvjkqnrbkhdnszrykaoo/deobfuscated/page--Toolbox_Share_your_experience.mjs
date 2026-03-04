/* CSS extracted to: page--Toolbox_Share_your_experience.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as v } from "./chunk-7ZLY6PO3.mjs";
import { a as g, b as w } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub-2.mjs";
import { useLocale,
  cx,
  withFXWrapper,
  DeviceSizeContainer,
  cssSSRMinifiedHelper,
  withCSS,
  registerCursors,
  CursorContext,
  PropertyOverridesProvider,
  forwardRef,
  useId,
  useInsertionEffect,
  useVariantState,
  useRef,
  jsx,
  jsxs,
  motion,
  LayoutGroup,
  loadFonts,
  getFonts } from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var D = withFXWrapper(motion.div),
  J = getFonts(g),
  Q = getFonts(w),
  A = withFXWrapper(cssSSRMinifiedHelper);
var B = {
  b2i3oLVRc: "(min-width: 810px) and (max-width: 1199px)",
  Qsk48RJwf: "(max-width: 809px)",
  wqhWrLrL3: "(min-width: 1200px)",
};
var T = "framer-jR5ry",
  $ = {
    b2i3oLVRc: "framer-v-14oigkf",
    Qsk48RJwf: "framer-v-1fgovn0",
    wqhWrLrL3: "framer-v-unvdhx",
  },
  b = v(),
  O = { Desktop: "wqhWrLrL3", Phone: "Qsk48RJwf", Tablet: "b2i3oLVRc" },
  H = ({ height: R, id: n, width: m, ...i }) => {
    var a, o;
    return {
      ...i,
      variant:
        (o = (a = O[i.variant]) !== null && a !== void 0 ? a : i.variant) !==
          null && o !== void 0
          ? o
          : "wqhWrLrL3",
    };
  },
  G = forwardRef(function (R, n) {
    let { activeLocale: m, setLocale: i } = useLocale(),
      { style: a, className: o, layoutId: d, variant: z, ...E } = H(R);
    useInsertionEffect(() => {
      let t = v(void 0, m);
      if (((document.title = t.title || ""), t.viewport)) {
        var f;
        (f = document.querySelector('meta[name="viewport"]')) === null ||
          f === void 0 ||
          f.setAttribute("content", t.viewport);
      }
      if (t.robots) {
        let e = document.querySelector('meta[name="robots"]');
        e
          ? e.setAttribute("content", t.robots)
          : ((e = document.createElement("meta")),
            e.setAttribute("name", "robots"),
            e.setAttribute("content", t.robots),
            document.head.appendChild(e));
      }
      if (t.bodyClassName)
        return (
          Array.from(document.body.classList)
            .filter((e) => e.startsWith("framer-body-"))
            .map((e) => document.body.classList.remove(e)),
          document.body.classList.add(`${t.bodyClassName}-framer-jR5ry`),
          () => {
            document.body.classList.remove(`${t.bodyClassName}-framer-jR5ry`);
          }
        );
    }, [void 0, m]);
    let [M, U] = useVariantState(z, B, !1),
      Z = void 0,
      S = useRef(null),
      q = useId(),
      _ = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "wqhWrLrL3", variantClassNames: $ },
        children: jsxs(LayoutGroup, {
          id: d ?? q,
          children: [
            jsxs(motion.div, {
              ...E,
              className: cx(T, ..._, "framer-unvdhx", o),
              ref: n ?? S,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: M,
                  overrides: {
                    Qsk48RJwf: {
                      __framer__transformTargets: [
                        {
                          target: {
                            opacity: 1,
                            rotate: 0,
                            rotateX: 0,
                            rotateY: 0,
                            scale: 1,
                            skewX: 0,
                            skewY: 0,
                            getFonts: 0,
                            DeviceSizeContainer: 0,
                          },
                        },
                        {
                          target: {
                            opacity: 1,
                            rotate: 0,
                            rotateX: 0,
                            rotateY: 0,
                            scale: 1,
                            skewX: 0,
                            skewY: 0,
                            getFonts: 0,
                            DeviceSizeContainer: -60,
                          },
                        },
                      ],
                    },
                  },
                  children: jsx(D, {
                    __framer__styleTransformEffectEnabled: !0,
                    __framer__transformTargets: [
                      {
                        target: {
                          opacity: 0.5,
                          rotate: 0,
                          rotateX: 0,
                          rotateY: 0,
                          scale: 1,
                          skewX: 0,
                          skewY: 0,
                          getFonts: 0,
                          DeviceSizeContainer: 0,
                        },
                      },
                      {
                        target: {
                          opacity: 1,
                          rotate: 0,
                          rotateX: 0,
                          rotateY: 0,
                          scale: 1,
                          skewX: 0,
                          skewY: 0,
                          getFonts: 0,
                          DeviceSizeContainer: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-cdaffk",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-17harv4-container",
                    children: jsx(g, {
                      height: "100%",
                      html: "",
                      id: "Bx2tCSwWx",
                      layoutId: "Bx2tCSwWx",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-1-fundamentals/4.-learning-from-success-stories/4.1-share-your-experience" /* → getDocsUrl("/Toolbox_Share_your_experience") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(A, {
                    __framer__styleTransformEffectEnabled: !0,
                    __framer__transformTargets: [
                      {
                        target: {
                          opacity: 1,
                          rotate: 0,
                          rotateX: 0,
                          rotateY: 0,
                          scale: 1,
                          skewX: 0,
                          skewY: 0,
                          getFonts: 0,
                          DeviceSizeContainer: 0,
                        },
                      },
                      {
                        target: {
                          opacity: 1,
                          rotate: 0,
                          rotateX: 0,
                          rotateY: 0,
                          scale: 1,
                          skewX: 0,
                          skewY: 0,
                          getFonts: 0,
                          DeviceSizeContainer: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1jlowvh-container",
                    layoutScroll: !0,
                    children: jsx(w, {
                      height: "100%",
                      id: "pqDP5t_FM",
                      layoutId: "pqDP5t_FM",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(T, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  K = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${b.bodyClassName}-framer-jR5ry { background: white; }`,
    ".framer-jR5ry.framer-7z8kz3, .framer-jR5ry .framer-7z8kz3 { display: block; }",
    ".framer-jR5ry.framer-unvdhx { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-jR5ry .framer-cdaffk { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-jR5ry .framer-17harv4-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-jR5ry .framer-1jlowvh-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-jR5ry.framer-unvdhx, .framer-jR5ry .framer-cdaffk { gap: 0px; } .framer-jR5ry.framer-unvdhx > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-jR5ry.framer-unvdhx > :first-child { margin-top: 0px; } .framer-jR5ry.framer-unvdhx > :last-child { margin-bottom: 0px; } .framer-jR5ry .framer-cdaffk > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-jR5ry .framer-cdaffk > :first-child { margin-left: 0px; } .framer-jR5ry .framer-cdaffk > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-jR5ry .hidden-unvdhx { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-jR5ry .hidden-14oigkf { display: none !important; } .${b.bodyClassName}-framer-jR5ry { background: white; } .framer-jR5ry.framer-unvdhx { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-jR5ry .hidden-1fgovn0 { display: none !important; } .${b.bodyClassName}-framer-jR5ry { background: white; } .framer-jR5ry.framer-unvdhx { width: 390px; } .framer-jR5ry .framer-cdaffk { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-jR5ry .framer-cdaffk { gap: 0px; } .framer-jR5ry .framer-cdaffk > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-jR5ry .framer-cdaffk > :first-child { margin-top: 0px; } .framer-jR5ry .framer-cdaffk > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(G, K, "framer-jR5ry"),
  fr = s;
s.displayName = "Toolbox_Input_for_research";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...J, ...Q], {
  supportsExplicitInterCodegen: !0,
});
var cr = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FramerymL2yz5Md",
      slots: [],
      annotations: {
        framerComponentViewportWidth: "true",
        framerResponsiveScreen: "",
        framerIntrinsicHeight: "1050",
        framerIntrinsicWidth: "1200",
        framerImmutableVariables: "true",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"b2i3oLVRc":{"layout":["fixed","auto"]},"Qsk48RJwf":{"layout":["fixed","auto"]}}}',
        framerDisplayContentsDiv: "false",
        framerContractVersion: "1",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { cr as __FramerMetadata__, fr as default };
