/* CSS extracted to: page--Toolbox_After_the_Intervention.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as w } from "./chunk-IPH6AA6U.mjs";
import { a as g, b as v } from "./chunk--embed-component.mjs";
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
var P = withFXWrapper(motion.div),
  j = getFonts(g),
  J = getFonts(v),
  S = withFXWrapper(cssSSRMinifiedHelper);
var M = {
  a3gmAA0fN: "(min-width: 810px) and (max-width: 1199px)",
  vO94zyX4a: "(max-width: 809px)",
  yVaYlJDRW: "(min-width: 1200px)",
};
var z = "framer-ahKFB",
  $ = {
    a3gmAA0fN: "framer-v-y38g2e",
    vO94zyX4a: "framer-v-sfpcfu",
    yVaYlJDRW: "framer-v-1mp5enu",
  },
  b = w(),
  G = { Desktop: "yVaYlJDRW", Phone: "vO94zyX4a", Tablet: "a3gmAA0fN" },
  Z = ({ height: _, id: n, width: s, ...i }) => {
    var r, o;
    return {
      ...i,
      variant:
        (o = (r = G[i.variant]) !== null && r !== void 0 ? r : i.variant) !==
          null && o !== void 0
          ? o
          : "yVaYlJDRW",
    };
  },
  H = forwardRef(function (_, n) {
    let { activeLocale: s, setLocale: i } = useLocale(),
      { style: r, className: o, layoutId: l, variant: D, ...E } = Z(_);
    useInsertionEffect(() => {
      let t = w(void 0, s);
      if (((document.title = t.title || ""), t.viewport)) {
        var d;
        (d = document.querySelector('meta[name="viewport"]')) === null ||
          d === void 0 ||
          d.setAttribute("content", t.viewport);
      }
      if (t.robots) {
        let a = document.querySelector('meta[name="robots"]');
        a
          ? a.setAttribute("content", t.robots)
          : ((a = document.createElement("meta")),
            a.setAttribute("name", "robots"),
            a.setAttribute("content", t.robots),
            document.head.appendChild(a));
      }
      if (t.bodyClassName)
        return (
          Array.from(document.body.classList)
            .filter((a) => a.startsWith("framer-body-"))
            .map((a) => document.body.classList.remove(a)),
          document.body.classList.add(`${t.bodyClassName}-framer-ahKFB`),
          () => {
            document.body.classList.remove(`${t.bodyClassName}-framer-ahKFB`);
          }
        );
    }, [void 0, s]);
    let [L, Q] = useVariantState(D, M, !1),
      U = void 0,
      T = useRef(null),
      W = useId(),
      F = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "yVaYlJDRW", variantClassNames: $ },
        children: jsxs(LayoutGroup, {
          id: l ?? W,
          children: [
            jsxs(motion.div, {
              ...E,
              className: cx(z, ...F, "framer-1mp5enu", o),
              ref: n ?? T,
              style: { ...r },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: L,
                  overrides: {
                    vO94zyX4a: {
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
                            cssSSRMinifiedHelper: 0,
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
                            cssSSRMinifiedHelper: -60,
                          },
                        },
                      ],
                    },
                  },
                  children: jsx(P, {
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
                          cssSSRMinifiedHelper: 0,
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
                          cssSSRMinifiedHelper: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1h7v2kl",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-q2m92i-container",
                    children: jsx(g, {
                      height: "100%",
                      html: "",
                      id: "gdm7LJ2Ok",
                      layoutId: "gdm7LJ2Ok",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/9.-after-the-intervention" /* → getDocsUrl("/Toolbox_After_the_Intervention") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(S, {
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
                          cssSSRMinifiedHelper: 0,
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
                          cssSSRMinifiedHelper: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-11cdumv-container",
                    layoutScroll: !0,
                    children: jsx(v, {
                      height: "100%",
                      id: "Zhz9ZpcOe",
                      layoutId: "Zhz9ZpcOe",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(z, ...F), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  q = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${b.bodyClassName}-framer-ahKFB { background: white; }`,
    ".framer-ahKFB.framer-ngj57w, .framer-ahKFB .framer-ngj57w { display: block; }",
    ".framer-ahKFB.framer-1mp5enu { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-ahKFB .framer-1h7v2kl { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-ahKFB .framer-q2m92i-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-ahKFB .framer-11cdumv-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-ahKFB.framer-1mp5enu, .framer-ahKFB .framer-1h7v2kl { gap: 0px; } .framer-ahKFB.framer-1mp5enu > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-ahKFB.framer-1mp5enu > :first-child { margin-top: 0px; } .framer-ahKFB.framer-1mp5enu > :last-child { margin-bottom: 0px; } .framer-ahKFB .framer-1h7v2kl > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-ahKFB .framer-1h7v2kl > :first-child { margin-left: 0px; } .framer-ahKFB .framer-1h7v2kl > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-ahKFB .hidden-1mp5enu { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-ahKFB .hidden-y38g2e { display: none !important; } .${b.bodyClassName}-framer-ahKFB { background: white; } .framer-ahKFB.framer-1mp5enu { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-ahKFB .hidden-sfpcfu { display: none !important; } .${b.bodyClassName}-framer-ahKFB { background: white; } .framer-ahKFB.framer-1mp5enu { width: 390px; } .framer-ahKFB .framer-1h7v2kl { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-ahKFB .framer-1h7v2kl { gap: 0px; } .framer-ahKFB .framer-1h7v2kl > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-ahKFB .framer-1h7v2kl > :first-child { margin-top: 0px; } .framer-ahKFB .framer-1h7v2kl > :last-child { margin-bottom: 0px; } }}`,
  ],
  m = withCSS(H, q, "framer-ahKFB"),
  de = m;
m.displayName = "Toolbox_Share_your_experience";
m.defaultProps = { height: 1050, width: 1200 };
loadFonts(m, [{ explicitInter: !0, fonts: [] }, ...j, ...J], {
  supportsExplicitInterCodegen: !0,
});
var fe = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerNM8YGpOE1",
      slots: [],
      annotations: {
        framerComponentViewportWidth: "true",
        framerResponsiveScreen: "",
        framerContractVersion: "1",
        framerDisplayContentsDiv: "false",
        framerIntrinsicHeight: "1050",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"a3gmAA0fN":{"layout":["fixed","auto"]},"vO94zyX4a":{"layout":["fixed","auto"]}}}',
        framerIntrinsicWidth: "1200",
        framerImmutableVariables: "true",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { fe as __FramerMetadata__, de as default };
