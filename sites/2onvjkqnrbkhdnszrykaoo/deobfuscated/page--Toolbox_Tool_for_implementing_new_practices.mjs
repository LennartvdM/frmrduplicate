/* CSS extracted to: page--Toolbox_Tool_for_implementing_new_practices.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as w } from "./chunk-MKJHVUWN.mjs";
import { a as y, DeviceSizeContainer as g } from "./chunk--embed-component.mjs";
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
var M = withFXWrapper(motion.div),
  S = getFonts(y),
  K = getFonts(g),
  D = withFXWrapper(cssSSRMinifiedHelper);
var $ = {
  chKWABIN2: "(max-width: 809px)",
  dy3CT8xV5: "(min-width: 1200px)",
  opwm_lHIs: "(min-width: 810px) and (max-width: 1199px)",
};
var H = "framer-ob5l4",
  O = {
    chKWABIN2: "framer-v-1o0j81x",
    dy3CT8xV5: "framer-v-15ezkr5",
    opwm_lHIs: "framer-v-r6basb",
  },
  v = w(),
  q = { Desktop: "dy3CT8xV5", Phone: "chKWABIN2", Tablet: "opwm_lHIs" },
  G = ({ height: _, id: i, width: m, ...n }) => {
    var a, o;
    return {
      ...n,
      variant:
        (o = (a = q[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && o !== void 0
          ? o
          : "dy3CT8xV5",
    };
  },
  Z = forwardRef(function (_, i) {
    let { activeLocale: m, setLocale: n } = useLocale(),
      { style: a, className: o, layoutId: l, variant: P, ...R } = G(_);
    useInsertionEffect(() => {
      let t = w(void 0, m);
      if (((document.title = t.title || ""), t.viewport)) {
        var d;
        (d = document.querySelector('meta[name="viewport"]')) === null ||
          d === void 0 ||
          d.setAttribute("content", t.viewport);
      }
      if (t.robots) {
        let r = document.querySelector('meta[name="robots"]');
        r
          ? r.setAttribute("content", t.robots)
          : ((r = document.createElement("meta")),
            r.setAttribute("name", "robots"),
            r.setAttribute("content", t.robots),
            document.head.appendChild(r));
      }
      if (t.bodyClassName)
        return (
          Array.from(document.body.classList)
            .filter((r) => r.startsWith("framer-body-"))
            .map((r) => document.body.classList.remove(r)),
          document.body.classList.add(`${t.bodyClassName}-framer-ob5l4`),
          () => {
            document.body.classList.remove(`${t.bodyClassName}-framer-ob5l4`);
          }
        );
    }, [void 0, m]);
    let [B, Q] = useVariantState(P, $, !1),
      U = void 0,
      L = useRef(null),
      j = useId(),
      k = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "dy3CT8xV5", variantClassNames: O },
        children: jsxs(LayoutGroup, {
          id: l ?? j,
          children: [
            jsxs(motion.div, {
              ...R,
              className: cx(H, ...k, "framer-15ezkr5", o),
              ref: i ?? L,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: B,
                  overrides: {
                    chKWABIN2: {
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
                            cssSSRMinifiedHelper: 0,
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
                            cssSSRMinifiedHelper: 0,
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
                          cssSSRMinifiedHelper: 0,
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
                          cssSSRMinifiedHelper: 0,
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1p13vza",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-52qwma-container",
                    children: jsx(y, {
                      height: "100%",
                      html: "",
                      id: "EcbA1he5d",
                      layoutId: "EcbA1he5d",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/16.-tool-for-implementing-new-practices" /* → getDocsUrl("/Toolbox_Tool_for_implementing_new_practices") */,
                      width: "100%",
                    }),
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
                          cssSSRMinifiedHelper: 0,
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
                          cssSSRMinifiedHelper: 0,
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-13ck1ri-container",
                    layoutScroll: !0,
                    children: jsx(g, {
                      height: "100%",
                      id: "AFYsNZ7cf",
                      layoutId: "AFYsNZ7cf",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(H, ...k), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  J = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${v.bodyClassName}-framer-ob5l4 { background: white; }`,
    ".framer-ob5l4.framer-1utwym3, .framer-ob5l4 .framer-1utwym3 { display: block; }",
    ".framer-ob5l4.framer-15ezkr5 { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-ob5l4 .framer-1p13vza { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-ob5l4 .framer-52qwma-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-ob5l4 .framer-13ck1ri-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-ob5l4.framer-15ezkr5, .framer-ob5l4 .framer-1p13vza { gap: 0px; } .framer-ob5l4.framer-15ezkr5 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-ob5l4.framer-15ezkr5 > :first-child { margin-top: 0px; } .framer-ob5l4.framer-15ezkr5 > :last-child { margin-bottom: 0px; } .framer-ob5l4 .framer-1p13vza > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-ob5l4 .framer-1p13vza > :first-child { margin-left: 0px; } .framer-ob5l4 .framer-1p13vza > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-ob5l4 .hidden-15ezkr5 { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-ob5l4 .hidden-r6basb { display: none !important; } .${v.bodyClassName}-framer-ob5l4 { background: white; } .framer-ob5l4.framer-15ezkr5 { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-ob5l4 .hidden-1o0j81x { display: none !important; } .${v.bodyClassName}-framer-ob5l4 { background: white; } .framer-ob5l4.framer-15ezkr5 { width: 390px; } .framer-ob5l4 .framer-1p13vza { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-ob5l4 .framer-1p13vza { gap: 0px; } .framer-ob5l4 .framer-1p13vza > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-ob5l4 .framer-1p13vza > :first-child { margin-top: 0px; } .framer-ob5l4 .framer-1p13vza > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(Z, J, "framer-ob5l4"),
  de = s;
s.displayName = "Toolbox_Preparation_and_Consent";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...S, ...K], {
  supportsExplicitInterCodegen: !0,
});
var ce = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FramerrC8gH4Mco",
      slots: [],
      annotations: {
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"opwm_lHIs":{"layout":["fixed","auto"]},"chKWABIN2":{"layout":["fixed","auto"]}}}',
        framerDisplayContentsDiv: "false",
        framerComponentViewportWidth: "true",
        framerResponsiveScreen: "",
        framerIntrinsicWidth: "1200",
        framerImmutableVariables: "true",
        framerIntrinsicHeight: "1050",
        framerContractVersion: "1",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { ce as __FramerMetadata__, de as default };
