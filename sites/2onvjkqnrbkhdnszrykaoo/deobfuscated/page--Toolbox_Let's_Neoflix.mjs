/* CSS extracted to: page--Toolbox_Let's_Neoflix.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as v } from "./chunk-73I4LY3P.mjs";
import { a as b, b as y } from "./chunk--embed-component.mjs";
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
var j = withFXWrapper(motion.div),
  Q = getFonts(b),
  B = getFonts(y),
  W = withFXWrapper(cssSSRMinifiedHelper);
var $ = {
  MDmRPe603: "(min-width: 810px) and (max-width: 1199px)",
  NiOXSdbRA: "(max-width: 809px)",
  voht41TQ5: "(min-width: 1200px)",
};
var I = "framer-Y76EM",
  q = {
    MDmRPe603: "framer-v-1edoao6",
    NiOXSdbRA: "framer-v-n4uyhk",
    voht41TQ5: "framer-v-969sk0",
  },
  w = v(),
  H = { Desktop: "voht41TQ5", Phone: "NiOXSdbRA", Tablet: "MDmRPe603" },
  G = ({ height: _, id: n, width: m, ...i }) => {
    var a, o;
    return {
      ...i,
      variant:
        (o = (a = H[i.variant]) !== null && a !== void 0 ? a : i.variant) !==
          null && o !== void 0
          ? o
          : "voht41TQ5",
    };
  },
  U = forwardRef(function (_, n) {
    let { activeLocale: m, setLocale: i } = useLocale(),
      { style: a, className: o, layoutId: d, variant: S, ...D } = G(_);
    useInsertionEffect(() => {
      let r = v(void 0, m);
      if (((document.title = r.title || ""), r.viewport)) {
        var l;
        (l = document.querySelector('meta[name="viewport"]')) === null ||
          l === void 0 ||
          l.setAttribute("content", r.viewport);
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
          document.body.classList.add(`${r.bodyClassName}-framer-Y76EM`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-Y76EM`);
          }
        );
    }, [void 0, m]);
    let [O, K] = useVariantState(S, $, !1),
      Z = void 0,
      A = useRef(null),
      L = useId(),
      Y = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "voht41TQ5", variantClassNames: q },
        children: jsxs(LayoutGroup, {
          id: d ?? L,
          children: [
            jsxs(motion.div, {
              ...D,
              className: cx(I, ...Y, "framer-969sk0", o),
              ref: n ?? A,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: O,
                  overrides: {
                    NiOXSdbRA: {
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
                  children: jsx(j, {
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
                    className: "framer-1n81bz0",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-575ijg-container",
                    children: jsx(b, {
                      height: "100%",
                      html: "",
                      id: "ccsrc1zVB",
                      layoutId: "ccsrc1zVB",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/11.-lets-neoflix" /* → getDocsUrl("/Toolbox_Let's_Neoflix") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(W, {
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
                    className: "framer-10qeana-container",
                    layoutScroll: !0,
                    children: jsx(y, {
                      height: "100%",
                      id: "i5UC1Tsq5",
                      layoutId: "i5UC1Tsq5",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(I, ...Y), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  J = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${w.bodyClassName}-framer-Y76EM { background: white; }`,
    ".framer-Y76EM.framer-1br4gd5, .framer-Y76EM .framer-1br4gd5 { display: block; }",
    ".framer-Y76EM.framer-969sk0 { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-Y76EM .framer-1n81bz0 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-Y76EM .framer-575ijg-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-Y76EM .framer-10qeana-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-Y76EM.framer-969sk0, .framer-Y76EM .framer-1n81bz0 { gap: 0px; } .framer-Y76EM.framer-969sk0 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-Y76EM.framer-969sk0 > :first-child { margin-top: 0px; } .framer-Y76EM.framer-969sk0 > :last-child { margin-bottom: 0px; } .framer-Y76EM .framer-1n81bz0 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-Y76EM .framer-1n81bz0 > :first-child { margin-left: 0px; } .framer-Y76EM .framer-1n81bz0 > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-Y76EM .hidden-969sk0 { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-Y76EM .hidden-1edoao6 { display: none !important; } .${w.bodyClassName}-framer-Y76EM { background: white; } .framer-Y76EM.framer-969sk0 { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-Y76EM .hidden-n4uyhk { display: none !important; } .${w.bodyClassName}-framer-Y76EM { background: white; } .framer-Y76EM.framer-969sk0 { width: 390px; } .framer-Y76EM .framer-1n81bz0 { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-Y76EM .framer-1n81bz0 { gap: 0px; } .framer-Y76EM .framer-1n81bz0 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-Y76EM .framer-1n81bz0 > :first-child { margin-top: 0px; } .framer-Y76EM .framer-1n81bz0 > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(U, J, "framer-Y76EM"),
  le = s;
s.displayName = "Toolbox_Tool_for_implementing_new_practices";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...Q, ...B], {
  supportsExplicitInterCodegen: !0,
});
var fe = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FramernzfaDOFRY",
      slots: [],
      annotations: {
        framerComponentViewportWidth: "true",
        framerDisplayContentsDiv: "false",
        framerImmutableVariables: "true",
        framerContractVersion: "1",
        framerIntrinsicWidth: "1200",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"MDmRPe603":{"layout":["fixed","auto"]},"NiOXSdbRA":{"layout":["fixed","auto"]}}}',
        framerResponsiveScreen: "",
        framerIntrinsicHeight: "1050",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { fe as __FramerMetadata__, le as default };
