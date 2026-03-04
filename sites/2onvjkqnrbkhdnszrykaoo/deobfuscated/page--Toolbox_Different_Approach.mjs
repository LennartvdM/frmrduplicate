/* CSS extracted to: page--Toolbox_Different_Approach.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as w } from "./chunk-MKICQTGL.mjs";
import { a as y, b as k } from "./chunk--embed-component.mjs";
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
var B = withFXWrapper(motion.div),
  K = getFonts(y),
  S = getFonts(k),
  A = withFXWrapper(cssSSRMinifiedHelper);
var W = {
  vjbCKc2u1: "(min-width: 1200px)",
  yqQnoB02h: "(min-width: 810px) and (max-width: 1199px)",
  zwpIMaXCq: "(max-width: 809px)",
};
var T = "framer-QEIkD",
  $ = {
    vjbCKc2u1: "framer-v-1ot7ppf",
    yqQnoB02h: "framer-v-10dqtwf",
    zwpIMaXCq: "framer-v-p97cug",
  },
  v = w(),
  O = { Desktop: "vjbCKc2u1", Phone: "zwpIMaXCq", Tablet: "yqQnoB02h" },
  Z = ({ height: b, id: n, width: m, ...i }) => {
    var a, o;
    return {
      ...i,
      variant:
        (o = (a = O[i.variant]) !== null && a !== void 0 ? a : i.variant) !==
          null && o !== void 0
          ? o
          : "vjbCKc2u1",
    };
  },
  H = forwardRef(function (b, n) {
    let { activeLocale: m, setLocale: i } = useLocale(),
      { style: a, className: o, layoutId: d, variant: V, ...L } = Z(b);
    useInsertionEffect(() => {
      let r = w(void 0, m);
      if (((document.title = r.title || ""), r.viewport)) {
        var f;
        (f = document.querySelector('meta[name="viewport"]')) === null ||
          f === void 0 ||
          f.setAttribute("content", r.viewport);
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
          document.body.classList.add(`${r.bodyClassName}-framer-QEIkD`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-QEIkD`);
          }
        );
    }, [void 0, m]);
    let [Y, U] = useVariantState(V, W, !1),
      J = void 0,
      P = useRef(null),
      R = useId(),
      I = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "vjbCKc2u1", variantClassNames: $ },
        children: jsxs(LayoutGroup, {
          id: d ?? R,
          children: [
            jsxs(motion.div, {
              ...L,
              className: cx(T, ...I, "framer-1ot7ppf", o),
              ref: n ?? P,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: Y,
                  overrides: {
                    zwpIMaXCq: {
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
                  children: jsx(B, {
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
                    className: "framer-kzng5d",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-1a9mf1k-container",
                    children: jsx(y, {
                      height: "100%",
                      html: "",
                      id: "Qo0L4KhuZ",
                      layoutId: "Qo0L4KhuZ",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-1-fundamentals/1.-preproduction/1.1-beyond-the-procedure#taking-a-different-approach" /* → getDocsUrl("/Toolbox_Different_Approach") */,
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
                    className: "framer-j3rg0j-container",
                    layoutScroll: !0,
                    children: jsx(k, {
                      height: "100%",
                      id: "EZUw2Tag1",
                      layoutId: "EZUw2Tag1",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(T, ...I), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  G = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${v.bodyClassName}-framer-QEIkD { background: white; }`,
    ".framer-QEIkD.framer-1e39nto, .framer-QEIkD .framer-1e39nto { display: block; }",
    ".framer-QEIkD.framer-1ot7ppf { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-QEIkD .framer-kzng5d { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-QEIkD .framer-1a9mf1k-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-QEIkD .framer-j3rg0j-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-QEIkD.framer-1ot7ppf, .framer-QEIkD .framer-kzng5d { gap: 0px; } .framer-QEIkD.framer-1ot7ppf > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-QEIkD.framer-1ot7ppf > :first-child { margin-top: 0px; } .framer-QEIkD.framer-1ot7ppf > :last-child { margin-bottom: 0px; } .framer-QEIkD .framer-kzng5d > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-QEIkD .framer-kzng5d > :first-child { margin-left: 0px; } .framer-QEIkD .framer-kzng5d > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-QEIkD .hidden-1ot7ppf { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-QEIkD .hidden-10dqtwf { display: none !important; } .${v.bodyClassName}-framer-QEIkD { background: white; } .framer-QEIkD.framer-1ot7ppf { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-QEIkD .hidden-p97cug { display: none !important; } .${v.bodyClassName}-framer-QEIkD { background: white; } .framer-QEIkD.framer-1ot7ppf { width: 390px; } .framer-QEIkD .framer-kzng5d { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-QEIkD .framer-kzng5d { gap: 0px; } .framer-QEIkD .framer-kzng5d > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-QEIkD .framer-kzng5d > :first-child { margin-top: 0px; } .framer-QEIkD .framer-kzng5d > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(H, G, "framer-QEIkD"),
  fe = s;
s.displayName = "Toolbox_A_Safe_Learning_Environment";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...K, ...S], {
  supportsExplicitInterCodegen: !0,
});
var pe = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerMrFemP8j0",
      slots: [],
      annotations: {
        framerIntrinsicWidth: "1200",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"yqQnoB02h":{"layout":["fixed","auto"]},"zwpIMaXCq":{"layout":["fixed","auto"]}}}',
        framerIntrinsicHeight: "1050",
        framerComponentViewportWidth: "true",
        framerDisplayContentsDiv: "false",
        framerImmutableVariables: "true",
        framerResponsiveScreen: "",
        framerContractVersion: "1",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { pe as __FramerMetadata__, fe as default };
