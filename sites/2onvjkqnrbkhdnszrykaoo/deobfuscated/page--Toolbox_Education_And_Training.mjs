/**
 * Import aliases resolved:
 *   X → useLocale
 *   p → cx
 *   u → withFXWrapper
 *   g → DeviceSizeContainer
 *   x → cssSSRMinifiedHelper
 *   N → withCSS
 *   I → registerCursors
 *   T → CursorContext
 *   L → PropertyOverridesProvider
 *   Y → forwardRef
 *   k → useId
 *   j → useInsertionEffect
 *   P → useVariantState
 *   V → useRef
 *   e → jsx
 *   c → jsxs
 *   f → motion
 *   q → LayoutGroup
 *   A → loadFonts
 *   h → getFonts
 */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as w } from "./chunk-B2TZBTZ4.mjs";
import { a as y, b } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk-42U43NKG.mjs";
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
var B = u(f.div),
  K = h(y),
  D = h(b),
  G = u(x);
var z = {
  iu6qOVbTa: "(max-width: 809px)",
  KqLyWVAwu: "(min-width: 1200px)",
  P3XnBIGA6: "(min-width: 810px) and (max-width: 1199px)",
};
var F = "framer-Cj4Yg",
  M = {
    iu6qOVbTa: "framer-v-1tbvaw4",
    KqLyWVAwu: "framer-v-lqr5ys",
    P3XnBIGA6: "framer-v-yadj0l",
  },
  C = w(),
  $ = { Desktop: "KqLyWVAwu", Phone: "iu6qOVbTa", Tablet: "P3XnBIGA6" },
  H = ({ height: v, id: n, width: m, ...i }) => {
    var a, o;
    return {
      ...i,
      variant:
        (o = (a = $[i.variant]) !== null && a !== void 0 ? a : i.variant) !==
          null && o !== void 0
          ? o
          : "KqLyWVAwu",
    };
  },
  U = Y(function (v, n) {
    let { activeLocale: m, setLocale: i } = X(),
      { style: a, className: o, layoutId: d, variant: W, ...E } = H(v);
    j(() => {
      let t = w(void 0, m);
      if (((document.title = t.title || ""), t.viewport)) {
        var l;
        (l = document.querySelector('meta[name="viewport"]')) === null ||
          l === void 0 ||
          l.setAttribute("content", t.viewport);
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
          document.body.classList.add(`${t.bodyClassName}-framer-Cj4Yg`),
          () => {
            document.body.classList.remove(`${t.bodyClassName}-framer-Cj4Yg`);
          }
        );
    }, [void 0, m]);
    let [O, Q] = P(W, z, !1),
      Z = void 0,
      R = V(null),
      S = k(),
      _ = [];
    return (
      I({}),
      e(T.Provider, {
        value: { primaryVariantId: "KqLyWVAwu", variantClassNames: M },
        children: c(q, {
          id: d ?? S,
          children: [
            c(f.div, {
              ...E,
              className: p(F, ..._, "framer-lqr5ys", o),
              ref: n ?? R,
              style: { ...a },
              children: [
                e(L, {
                  breakpoint: O,
                  overrides: {
                    iu6qOVbTa: {
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
                            x: 0,
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
                            x: 0,
                            y: -60,
                          },
                        },
                      ],
                    },
                  },
                  children: e(B, {
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
                          x: 0,
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
                          x: 0,
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-kuxbnu",
                  }),
                }),
                e(g, {
                  children: e(x, {
                    className: "framer-crms3n-container",
                    children: e(y, {
                      height: "100%",
                      html: "",
                      id: "NzrUgED_k",
                      layoutId: "NzrUgED_k",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/14.-education-and-training" /* → getDocsUrl("/Toolbox_Education_And_Training") */,
                      width: "100%",
                    }),
                  }),
                }),
                e(g, {
                  width: "100vw",
                  children: e(G, {
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
                          x: 0,
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
                          x: 0,
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-11ehwgc-container",
                    layoutScroll: !0,
                    children: e(b, {
                      height: "100%",
                      id: "w0vaggWYp",
                      layoutId: "w0vaggWYp",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: p(F, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  J = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${C.bodyClassName}-framer-Cj4Yg { background: white; }`,
    ".framer-Cj4Yg.framer-qdrkds, .framer-Cj4Yg .framer-qdrkds { display: block; }",
    ".framer-Cj4Yg.framer-lqr5ys { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-Cj4Yg .framer-kuxbnu { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-Cj4Yg .framer-crms3n-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-Cj4Yg .framer-11ehwgc-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-Cj4Yg.framer-lqr5ys, .framer-Cj4Yg .framer-kuxbnu { gap: 0px; } .framer-Cj4Yg.framer-lqr5ys > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-Cj4Yg.framer-lqr5ys > :first-child { margin-top: 0px; } .framer-Cj4Yg.framer-lqr5ys > :last-child { margin-bottom: 0px; } .framer-Cj4Yg .framer-kuxbnu > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-Cj4Yg .framer-kuxbnu > :first-child { margin-left: 0px; } .framer-Cj4Yg .framer-kuxbnu > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-Cj4Yg .hidden-lqr5ys { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-Cj4Yg .hidden-yadj0l { display: none !important; } .${C.bodyClassName}-framer-Cj4Yg { background: white; } .framer-Cj4Yg.framer-lqr5ys { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-Cj4Yg .hidden-1tbvaw4 { display: none !important; } .${C.bodyClassName}-framer-Cj4Yg { background: white; } .framer-Cj4Yg.framer-lqr5ys { width: 390px; } .framer-Cj4Yg .framer-kuxbnu { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-Cj4Yg .framer-kuxbnu { gap: 0px; } .framer-Cj4Yg .framer-kuxbnu > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-Cj4Yg .framer-kuxbnu > :first-child { margin-top: 0px; } .framer-Cj4Yg .framer-kuxbnu > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = N(U, J, "framer-Cj4Yg"),
  le = s;
s.displayName = "Toolbox_Pioneer_Team";
s.defaultProps = { height: 1050, width: 1200 };
A(s, [{ explicitInter: !0, fonts: [] }, ...K, ...D], {
  supportsExplicitInterCodegen: !0,
});
var ce = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerS5cL1K0Pb",
      slots: [],
      annotations: {
        framerImmutableVariables: "true",
        framerIntrinsicWidth: "1200",
        framerContractVersion: "1",
        framerDisplayContentsDiv: "false",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"P3XnBIGA6":{"layout":["fixed","auto"]},"iu6qOVbTa":{"layout":["fixed","auto"]}}}',
        framerComponentViewportWidth: "true",
        framerIntrinsicHeight: "1050",
        framerResponsiveScreen: "",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { ce as __FramerMetadata__, le as default };
