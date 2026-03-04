/* CSS extracted to: page--Toolbox-Reflect.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as v, b as y } from "./chunk--embed-component.mjs";
import { a as w } from "./chunk-NGBS3FJG.mjs";
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
var q = getFonts(v),
  M = withFXWrapper(motion.div),
  z = getFonts(y),
  D = withFXWrapper(cssSSRMinifiedHelper);
var W = {
  k2URuaQvJ: "(max-width: 809px)",
  MBE_VSAGn: "(min-width: 810px) and (max-width: 1199px)",
  nABLPwkoF: "(min-width: 1200px)",
};
var E = "framer-RVGcQ",
  J = {
    k2URuaQvJ: "framer-v-1vimne8",
    MBE_VSAGn: "framer-v-10zzggt",
    nABLPwkoF: "framer-v-1mbeqf9",
  },
  b = w(),
  O = { Desktop: "nABLPwkoF", Phone: "k2URuaQvJ", Tablet: "MBE_VSAGn" },
  U = ({ height: _, id: o, width: m, ...i }) => {
    var a, n;
    return {
      ...i,
      variant:
        (n = (a = O[i.variant]) !== null && a !== void 0 ? a : i.variant) !==
          null && n !== void 0
          ? n
          : "nABLPwkoF",
    };
  },
  $ = forwardRef(function (_, o) {
    let { activeLocale: m, setLocale: i } = useLocale(),
      { style: a, className: n, layoutId: c, variant: I, ...S } = U(_);
    useInsertionEffect(() => {
      let r = w(void 0, m);
      if (((document.title = r.title || ""), r.viewport)) {
        var d;
        (d = document.querySelector('meta[name="viewport"]')) === null ||
          d === void 0 ||
          d.setAttribute("content", r.viewport);
      }
      if (r.robots) {
        let t = document.querySelector('meta[name="robots"]');
        t
          ? t.setAttribute("content", r.robots)
          : ((t = document.createElement("meta")),
            t.setAttribute("name", "robots"),
            t.setAttribute("content", r.robots),
            document.head.appendChild(t));
      }
      if (r.bodyClassName)
        return (
          Array.from(document.body.classList)
            .filter((t) => t.startsWith("framer-body-"))
            .map((t) => document.body.classList.remove(t)),
          document.body.classList.add(`${r.bodyClassName}-framer-RVGcQ`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-RVGcQ`);
          }
        );
    }, [void 0, m]);
    let [Y, K] = useVariantState(I, W, !1),
      Z = void 0,
      j = useRef(null),
      T = useId(),
      V = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "nABLPwkoF", variantClassNames: J },
        children: jsxs(LayoutGroup, {
          id: c ?? T,
          children: [
            jsxs(motion.div, {
              ...S,
              className: cx(E, ...V, "framer-1mbeqf9", n),
              ref: o ?? j,
              style: { ...a },
              children: [
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-1t6n5jm-container",
                    children: jsx(v, {
                      height: "100%",
                      html: "",
                      id: "N4hgVPbyv",
                      layoutId: "N4hgVPbyv",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/reflect" /* → getDocsUrl("/Toolbox-Reflect") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(PropertyOverridesProvider, {
                  breakpoint: Y,
                  overrides: {
                    k2URuaQvJ: {
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
                            y: 0,
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
                            y: -60,
                          },
                        },
                      ],
                    },
                  },
                  children: jsx(M, {
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
                          y: 0,
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
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1ne0v1k",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(D, {
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
                          y: 0,
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
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1rxnhej-container",
                    layoutScroll: !0,
                    children: jsx(y, {
                      height: "100%",
                      id: "h_5pDGgkX",
                      layoutId: "h_5pDGgkX",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(E, ...V), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  H = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${b.bodyClassName}-framer-RVGcQ { background: white; }`,
    ".framer-RVGcQ.framer-5tgwn6, .framer-RVGcQ .framer-5tgwn6 { display: block; }",
    ".framer-RVGcQ.framer-1mbeqf9 { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-RVGcQ .framer-1t6n5jm-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-RVGcQ .framer-1ne0v1k { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-RVGcQ .framer-1rxnhej-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-RVGcQ.framer-1mbeqf9, .framer-RVGcQ .framer-1ne0v1k { gap: 0px; } .framer-RVGcQ.framer-1mbeqf9 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-RVGcQ.framer-1mbeqf9 > :first-child { margin-top: 0px; } .framer-RVGcQ.framer-1mbeqf9 > :last-child { margin-bottom: 0px; } .framer-RVGcQ .framer-1ne0v1k > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-RVGcQ .framer-1ne0v1k > :first-child { margin-left: 0px; } .framer-RVGcQ .framer-1ne0v1k > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-RVGcQ .hidden-1mbeqf9 { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-RVGcQ .hidden-10zzggt { display: none !important; } .${b.bodyClassName}-framer-RVGcQ { background: white; } .framer-RVGcQ.framer-1mbeqf9 { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-RVGcQ .hidden-1vimne8 { display: none !important; } .${b.bodyClassName}-framer-RVGcQ { background: white; } .framer-RVGcQ.framer-1mbeqf9 { width: 390px; } .framer-RVGcQ .framer-1ne0v1k { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-RVGcQ .framer-1ne0v1k { gap: 0px; } .framer-RVGcQ .framer-1ne0v1k > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-RVGcQ .framer-1ne0v1k > :first-child { margin-top: 0px; } .framer-RVGcQ .framer-1ne0v1k > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS($, H, "framer-RVGcQ"),
  de = s;
s.displayName = "Toolbox Planning_Your_Initiative";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...q, ...z], {
  supportsExplicitInterCodegen: !0,
});
var fe = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FramercASgO3jWQ",
      slots: [],
      annotations: {
        framerImmutableVariables: "true",
        framerResponsiveScreen: "",
        framerContractVersion: "1",
        framerIntrinsicHeight: "1050",
        framerDisplayContentsDiv: "false",
        framerComponentViewportWidth: "true",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"MBE_VSAGn":{"layout":["fixed","auto"]},"k2URuaQvJ":{"layout":["fixed","auto"]}}}',
        framerIntrinsicWidth: "1200",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { fe as __FramerMetadata__, de as default };
