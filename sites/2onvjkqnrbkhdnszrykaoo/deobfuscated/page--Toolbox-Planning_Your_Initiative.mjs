/* CSS extracted to: page--Toolbox-Planning_Your_Initiative.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as v } from "./chunk-WSPWSMCG.mjs";
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
var B = withFXWrapper(motion.div),
  G = getFonts(g),
  S = getFonts(w),
  j = withFXWrapper(cssSSRMinifiedHelper);
var K = {
  BZnNm6xV7: "(min-width: 810px) and (max-width: 1199px)",
  tlpMGWhtZ: "(max-width: 809px)",
  y9EKl6QNo: "(min-width: 1200px)",
};
var Z = "framer-XTO77",
  Q = {
    BZnNm6xV7: "framer-v-gevwu",
    tlpMGWhtZ: "framer-v-6dmx1r",
    y9EKl6QNo: "framer-v-c7ar5q",
  },
  b = v(),
  A = { Desktop: "y9EKl6QNo", Phone: "tlpMGWhtZ", Tablet: "BZnNm6xV7" },
  $ = ({ height: X, id: i, width: m, ...n }) => {
    var a, o;
    return {
      ...n,
      variant:
        (o = (a = A[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && o !== void 0
          ? o
          : "y9EKl6QNo",
    };
  },
  U = forwardRef(function (X, i) {
    let { activeLocale: m, setLocale: n } = useLocale(),
      { style: a, className: o, layoutId: d, variant: Y, ...M } = $(X);
    useInsertionEffect(() => {
      let r = v(void 0, m);
      if (((document.title = r.title || ""), r.viewport)) {
        var c;
        (c = document.querySelector('meta[name="viewport"]')) === null ||
          c === void 0 ||
          c.setAttribute("content", r.viewport);
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
          document.body.classList.add(`${r.bodyClassName}-framer-XTO77`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-XTO77`);
          }
        );
    }, [void 0, m]);
    let [D, H] = useVariantState(Y, K, !1),
      J = void 0,
      L = useRef(null),
      P = useId(),
      _ = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "y9EKl6QNo", variantClassNames: Q },
        children: jsxs(LayoutGroup, {
          id: d ?? P,
          children: [
            jsxs(motion.div, {
              ...M,
              className: cx(Z, ..._, "framer-c7ar5q", o),
              ref: i ?? L,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: D,
                  overrides: {
                    tlpMGWhtZ: {
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
                            withFXWrapper: 0,
                            getFonts: 0,
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
                            withFXWrapper: 0,
                            getFonts: -60,
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
                          withFXWrapper: 0,
                          getFonts: 0,
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
                          withFXWrapper: 0,
                          getFonts: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-8xc7qy",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-5svpib-container",
                    children: jsx(g, {
                      height: "100%",
                      html: "",
                      id: "eiUJNDpWn",
                      layoutId: "eiUJNDpWn",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-1-fundamentals/2.-planning-your-initiative" /* → getDocsUrl("/Toolbox-Planning_Your_Initiative") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(j, {
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
                          withFXWrapper: 0,
                          getFonts: 0,
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
                          withFXWrapper: 0,
                          getFonts: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1p5ugvx-container",
                    layoutScroll: !0,
                    children: jsx(w, {
                      height: "100%",
                      id: "RZd3p80Ow",
                      layoutId: "RZd3p80Ow",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(Z, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  z = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${b.bodyClassName}-framer-XTO77 { background: white; }`,
    ".framer-XTO77.framer-1gkceg5, .framer-XTO77 .framer-1gkceg5 { display: block; }",
    ".framer-XTO77.framer-c7ar5q { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-XTO77 .framer-8xc7qy { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-XTO77 .framer-5svpib-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-XTO77 .framer-1p5ugvx-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-XTO77.framer-c7ar5q, .framer-XTO77 .framer-8xc7qy { gap: 0px; } .framer-XTO77.framer-c7ar5q > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-XTO77.framer-c7ar5q > :first-child { margin-top: 0px; } .framer-XTO77.framer-c7ar5q > :last-child { margin-bottom: 0px; } .framer-XTO77 .framer-8xc7qy > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-XTO77 .framer-8xc7qy > :first-child { margin-left: 0px; } .framer-XTO77 .framer-8xc7qy > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-XTO77 .hidden-c7ar5q { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-XTO77 .hidden-gevwu { display: none !important; } .${b.bodyClassName}-framer-XTO77 { background: white; } .framer-XTO77.framer-c7ar5q { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-XTO77 .hidden-6dmx1r { display: none !important; } .${b.bodyClassName}-framer-XTO77 { background: white; } .framer-XTO77.framer-c7ar5q { width: 390px; } .framer-XTO77 .framer-8xc7qy { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-XTO77 .framer-8xc7qy { gap: 0px; } .framer-XTO77 .framer-8xc7qy > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-XTO77 .framer-8xc7qy > :first-child { margin-top: 0px; } .framer-XTO77 .framer-8xc7qy > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(U, z, "framer-XTO77"),
  ce = s;
s.displayName = "Toolbox";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...G, ...S], {
  supportsExplicitInterCodegen: !0,
});
var le = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerIDh2dRb_U",
      slots: [],
      annotations: {
        framerResponsiveScreen: "",
        framerImmutableVariables: "true",
        framerIntrinsicWidth: "1200",
        framerComponentViewportWidth: "true",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"BZnNm6xV7":{"layout":["fixed","auto"]},"tlpMGWhtZ":{"layout":["fixed","auto"]}}}',
        framerContractVersion: "1",
        framerIntrinsicHeight: "1050",
        framerDisplayContentsDiv: "false",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { le as __FramerMetadata__, ce as default };
