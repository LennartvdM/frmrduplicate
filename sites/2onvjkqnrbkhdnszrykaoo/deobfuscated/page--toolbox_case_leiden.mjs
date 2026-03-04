/* CSS extracted to: page--toolbox_case_leiden.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as m } from "./chunk-VQAURQE6.mjs";
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
  useEffect,
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
var H = withFXWrapper(motion.div),
  M = getFonts(g),
  $ = getFonts(w),
  A = withFXWrapper(cssSSRMinifiedHelper);
var K = {
  oYFaEvSCo: "(max-width: 809px)",
  qkDjf6Dj_: "(min-width: 810px) and (max-width: 1199px)",
  sGb5yc_vQ: "(min-width: 1200px)",
};
var P = "framer-vWnxi",
  O = {
    oYFaEvSCo: "framer-v-p7zdm1",
    qkDjf6Dj_: "framer-v-6oymji",
    sGb5yc_vQ: "framer-v-wr5ha4",
  },
  _ = m(),
  Z = { Desktop: "sGb5yc_vQ", Phone: "oYFaEvSCo", Tablet: "qkDjf6Dj_" },
  J = ({ height: b, id: o, width: r, ...s }) => {
    var n, i;
    return {
      ...s,
      variant:
        (i = (n = Z[s.variant]) !== null && n !== void 0 ? n : s.variant) !==
          null && i !== void 0
          ? i
          : "sGb5yc_vQ",
    };
  },
  U = forwardRef(function (b, o) {
    let { activeLocale: r, setLocale: s } = useLocale(),
      { style: n, className: i, layoutId: c, variant: G, ...Q } = J(b);
    (useEffect(() => {
      let a = m(void 0, r);
      if (a.robots) {
        let t = document.querySelector('meta[name="robots"]');
        t
          ? t.setAttribute("content", a.robots)
          : ((t = document.createElement("meta")),
            t.setAttribute("name", "robots"),
            t.setAttribute("content", a.robots),
            document.head.appendChild(t));
      }
    }, [void 0, r]),
      useInsertionEffect(() => {
        let a = m(void 0, r);
        if (((document.title = a.title || ""), a.viewport)) {
          var t;
          (t = document.querySelector('meta[name="viewport"]')) === null ||
            t === void 0 ||
            t.setAttribute("content", a.viewport);
        }
        let C = a.bodyClassName;
        if (C) {
          let f = document.body;
          (f.classList.forEach(
            (k) => k.startsWith("framer-body-") && f.classList.remove(k),
          ),
            f.classList.add(`${a.bodyClassName}-framer-vWnxi`));
        }
        return () => {
          C &&
            document.body.classList.remove(`${a.bodyClassName}-framer-vWnxi`);
        };
      }, [void 0, r]));
    let [q, ae] = useVariantState(G, K, !1),
      te = void 0,
      z = useRef(null),
      B = useId(),
      W = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "sGb5yc_vQ", variantClassNames: O },
        children: jsxs(LayoutGroup, {
          id: c ?? B,
          children: [
            jsxs(motion.div, {
              ...Q,
              className: cx(P, ...W, "framer-wr5ha4", i),
              ref: o ?? z,
              style: { ...n },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: q,
                  overrides: {
                    oYFaEvSCo: {
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
                            cx: 0,
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
                            cx: 0,
                            getFonts: -60,
                          },
                        },
                      ],
                    },
                  },
                  children: jsx(H, {
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
                          cx: 0,
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
                          cx: 0,
                          getFonts: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1mmcea7",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-lsaqfz-container",
                    children: jsx(g, {
                      height: "100%",
                      html: "",
                      id: "tQZ4VpKHB",
                      layoutId: "tQZ4VpKHB",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-1-fundamentals/4.-learning-from-success-stories/nicu-in-leiden-the-netherlands" /* → getDocsUrl("/toolbox_case_leiden") */,
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
                          cx: 0,
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
                          cx: 0,
                          getFonts: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-10ue7t4-container",
                    layoutScroll: !0,
                    children: jsx(w, {
                      height: "100%",
                      id: "gV6ToZ5nY",
                      layoutId: "gV6ToZ5nY",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(P, ...W), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  ee = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${_.bodyClassName}-framer-vWnxi { background: white; }`,
    ".framer-vWnxi.framer-1yaxake, .framer-vWnxi .framer-1yaxake { display: block; }",
    ".framer-vWnxi.framer-wr5ha4 { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-vWnxi .framer-1mmcea7 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-vWnxi .framer-lsaqfz-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-vWnxi .framer-10ue7t4-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-vWnxi.framer-wr5ha4, .framer-vWnxi .framer-1mmcea7 { gap: 0px; } .framer-vWnxi.framer-wr5ha4 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-vWnxi.framer-wr5ha4 > :first-child { margin-top: 0px; } .framer-vWnxi.framer-wr5ha4 > :last-child { margin-bottom: 0px; } .framer-vWnxi .framer-1mmcea7 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-vWnxi .framer-1mmcea7 > :first-child { margin-left: 0px; } .framer-vWnxi .framer-1mmcea7 > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-vWnxi .hidden-wr5ha4 { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-vWnxi .hidden-6oymji { display: none !important; } .${_.bodyClassName}-framer-vWnxi { background: white; } .framer-vWnxi.framer-wr5ha4 { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-vWnxi .hidden-p7zdm1 { display: none !important; } .${_.bodyClassName}-framer-vWnxi { background: white; } .framer-vWnxi.framer-wr5ha4 { width: 390px; } .framer-vWnxi .framer-1mmcea7 { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-vWnxi .framer-1mmcea7 { gap: 0px; } .framer-vWnxi .framer-1mmcea7 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-vWnxi .framer-1mmcea7 > :first-child { margin-top: 0px; } .framer-vWnxi .framer-1mmcea7 > :last-child { margin-bottom: 0px; } }}`,
  ],
  d = withCSS(U, ee, "framer-vWnxi"),
  pe = d;
d.displayName = "Toolbox_case_selection";
d.defaultProps = { height: 1050, width: 1200 };
loadFonts(d, [{ explicitInter: !0, fonts: [] }, ...M, ...$], {
  supportsExplicitInterCodegen: !0,
});
var xe = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerKeW3JpTIh",
      slots: [],
      annotations: {
        framerIntrinsicHeight: "1050",
        framerImmutableVariables: "true",
        framerComponentViewportWidth: "true",
        framerDisplayContentsDiv: "false",
        framerContractVersion: "1",
        framerIntrinsicWidth: "1200",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"qkDjf6Dj_":{"layout":["fixed","auto"]},"oYFaEvSCo":{"layout":["fixed","auto"]}}}',
        framerResponsiveScreen: "",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { xe as __FramerMetadata__, pe as default };
