/**
 * Import aliases resolved:
 *   N → useLocale
 *   f → cx
 *   u → withFXWrapper
 *   h → DeviceSizeContainer
 *   x → cssSSRMinifiedHelper
 *   X → withCSS
 *   I → registerCursors
 *   T → CursorContext
 *   Y → PropertyOverridesProvider
 *   k → forwardRef
 *   E → useId
 *   j → useInsertionEffect
 *   q → useVariantState
 *   C → useRef
 *   e → jsx
 *   l → jsxs
 *   c → motion
 *   V → LayoutGroup
 *   D → loadFonts
 *   g → getFonts
 */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as v } from "./chunk-VWDC27UW.mjs";
import { a as b, b as y } from "./chunk--embed-component.mjs";
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
var S = u(c.div),
  Q = g(b),
  $ = g(y),
  G = u(x);
var O = {
  acs96VpxC: "(min-width: 810px) and (max-width: 1199px)",
  bxWFQk3Vv: "(max-width: 809px)",
  Dmsnp4m5_: "(min-width: 1200px)",
};
var W = "framer-EFuj8",
  z = {
    acs96VpxC: "framer-v-nb8wd6",
    bxWFQk3Vv: "framer-v-valxep",
    Dmsnp4m5_: "framer-v-ipkpbh",
  },
  w = v(),
  B = { Desktop: "Dmsnp4m5_", Phone: "bxWFQk3Vv", Tablet: "acs96VpxC" },
  H = ({ height: F, id: o, width: m, ...n }) => {
    var a, i;
    return {
      ...n,
      variant:
        (i = (a = B[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && i !== void 0
          ? i
          : "Dmsnp4m5_",
    };
  },
  J = k(function (F, o) {
    let { activeLocale: m, setLocale: n } = N(),
      { style: a, className: i, layoutId: p, variant: P, ...R } = H(F);
    j(() => {
      let r = v(void 0, m);
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
          document.body.classList.add(`${r.bodyClassName}-framer-EFuj8`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-EFuj8`);
          }
        );
    }, [void 0, m]);
    let [L, U] = q(P, O, !1),
      Z = void 0,
      A = C(null),
      M = E(),
      _ = [];
    return (
      I({}),
      e(T.Provider, {
        value: { primaryVariantId: "Dmsnp4m5_", variantClassNames: z },
        children: l(V, {
          id: p ?? M,
          children: [
            l(c.div, {
              ...R,
              className: f(W, ..._, "framer-ipkpbh", i),
              ref: o ?? A,
              style: { ...a },
              children: [
                e(Y, {
                  breakpoint: L,
                  overrides: {
                    bxWFQk3Vv: {
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
                  children: e(S, {
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
                    className: "framer-eqeiug",
                  }),
                }),
                e(h, {
                  children: e(x, {
                    className: "framer-7y0yhv-container",
                    children: e(b, {
                      height: "100%",
                      html: "",
                      id: "g9Nb1x6b3",
                      layoutId: "g9Nb1x6b3",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/" /* → getDocsUrl("/Toolbox") */,
                      width: "100%",
                    }),
                  }),
                }),
                e(h, {
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
                    className: "framer-1rp5u3c-container",
                    layoutScroll: !0,
                    children: e(y, {
                      height: "100%",
                      id: "bCAJMTFiG",
                      layoutId: "bCAJMTFiG",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: f(W, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  K = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${w.bodyClassName}-framer-EFuj8 { background: white; }`,
    ".framer-EFuj8.framer-1b1b9kb, .framer-EFuj8 .framer-1b1b9kb { display: block; }",
    ".framer-EFuj8.framer-ipkpbh { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-EFuj8 .framer-eqeiug { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-EFuj8 .framer-7y0yhv-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-EFuj8 .framer-1rp5u3c-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-EFuj8.framer-ipkpbh, .framer-EFuj8 .framer-eqeiug { gap: 0px; } .framer-EFuj8.framer-ipkpbh > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-EFuj8.framer-ipkpbh > :first-child { margin-top: 0px; } .framer-EFuj8.framer-ipkpbh > :last-child { margin-bottom: 0px; } .framer-EFuj8 .framer-eqeiug > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-EFuj8 .framer-eqeiug > :first-child { margin-left: 0px; } .framer-EFuj8 .framer-eqeiug > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-EFuj8 .hidden-ipkpbh { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-EFuj8 .hidden-nb8wd6 { display: none !important; } .${w.bodyClassName}-framer-EFuj8 { background: white; } .framer-EFuj8.framer-ipkpbh { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-EFuj8 .hidden-valxep { display: none !important; } .${w.bodyClassName}-framer-EFuj8 { background: white; } .framer-EFuj8.framer-ipkpbh { width: 390px; } .framer-EFuj8 .framer-eqeiug { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-EFuj8 .framer-eqeiug { gap: 0px; } .framer-EFuj8 .framer-eqeiug > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-EFuj8 .framer-eqeiug > :first-child { margin-top: 0px; } .framer-EFuj8 .framer-eqeiug > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = X(J, K, "framer-EFuj8"),
  de = s;
s.displayName = "Page";
s.defaultProps = { height: 1050, width: 1200 };
D(s, [{ explicitInter: !0, fonts: [] }, ...Q, ...$], {
  supportsExplicitInterCodegen: !0,
});
var le = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "Framerx05wlhCdy",
      slots: [],
      annotations: {
        framerImmutableVariables: "true",
        framerIntrinsicWidth: "1200",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"acs96VpxC":{"layout":["fixed","auto"]},"bxWFQk3Vv":{"layout":["fixed","auto"]}}}',
        framerContractVersion: "1",
        framerResponsiveScreen: "",
        framerDisplayContentsDiv: "false",
        framerComponentViewportWidth: "true",
        framerIntrinsicHeight: "1050",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { le as __FramerMetadata__, de as default };
