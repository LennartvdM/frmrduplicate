import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as w } from "./chunk-TU3JLHPG.mjs";
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
var B = withFXWrapper(motion.div),
  D = getFonts(b),
  z = getFonts(y),
  O = withFXWrapper(cssSSRMinifiedHelper);
var E = {
  Lg4KIU1zA: "(min-width: 810px) and (max-width: 1199px)",
  LI8BK0CA1: "(min-width: 1200px)",
  O9_jDFbZC: "(max-width: 809px)",
};
var Y = "framer-QWLgG",
  S = {
    Lg4KIU1zA: "framer-v-yiuxz5",
    LI8BK0CA1: "framer-v-1britxi",
    O9_jDFbZC: "framer-v-19ox8u4",
  },
  _ = w(),
  M = { Desktop: "LI8BK0CA1", Phone: "O9_jDFbZC", Tablet: "Lg4KIU1zA" },
  Z = ({ height: v, id: o, width: m, ...n }) => {
    var a, i;
    return {
      ...n,
      variant:
        (i = (a = M[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && i !== void 0
          ? i
          : "LI8BK0CA1",
    };
  },
  U = forwardRef(function (v, o) {
    let { activeLocale: m, setLocale: n } = useLocale(),
      { style: a, className: i, layoutId: d, variant: K, ...P } = Z(v);
    useInsertionEffect(() => {
      let r = w(void 0, m);
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
          document.body.classList.add(`${r.bodyClassName}-framer-QWLgG`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-QWLgG`);
          }
        );
    }, [void 0, m]);
    let [T, H] = useVariantState(K, E, !1),
      J = void 0,
      R = useRef(null),
      q = useId(),
      L = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "LI8BK0CA1", variantClassNames: S },
        children: jsxs(LayoutGroup, {
          id: d ?? q,
          children: [
            jsxs(motion.div, {
              ...P,
              className: cx(Y, ...L, "framer-1britxi", i),
              ref: o ?? R,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: T,
                  overrides: {
                    O9_jDFbZC: {
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
                    className: "framer-jqsgtb",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-1yohw4u-container",
                    children: jsx(b, {
                      height: "100%",
                      html: "",
                      id: "ReYPKfwB9",
                      layoutId: "ReYPKfwB9",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/15.-recordings-for-research" /* → getDocsUrl("/Toolbox_Recordings_for_research") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(O, {
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
                    className: "framer-vijl21-container",
                    layoutScroll: !0,
                    children: jsx(y, {
                      height: "100%",
                      id: "P85V2tG3_",
                      layoutId: "P85V2tG3_",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(Y, ...L), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  $ = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${_.bodyClassName}-framer-QWLgG { background: white; }`,
    ".framer-QWLgG.framer-sionuo, .framer-QWLgG .framer-sionuo { display: block; }",
    ".framer-QWLgG.framer-1britxi { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-QWLgG .framer-jqsgtb { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-QWLgG .framer-1yohw4u-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-QWLgG .framer-vijl21-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-QWLgG.framer-1britxi, .framer-QWLgG .framer-jqsgtb { gap: 0px; } .framer-QWLgG.framer-1britxi > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-QWLgG.framer-1britxi > :first-child { margin-top: 0px; } .framer-QWLgG.framer-1britxi > :last-child { margin-bottom: 0px; } .framer-QWLgG .framer-jqsgtb > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-QWLgG .framer-jqsgtb > :first-child { margin-left: 0px; } .framer-QWLgG .framer-jqsgtb > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-QWLgG .hidden-1britxi { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-QWLgG .hidden-yiuxz5 { display: none !important; } .${_.bodyClassName}-framer-QWLgG { background: white; } .framer-QWLgG.framer-1britxi { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-QWLgG .hidden-19ox8u4 { display: none !important; } .${_.bodyClassName}-framer-QWLgG { background: white; } .framer-QWLgG.framer-1britxi { width: 390px; } .framer-QWLgG .framer-jqsgtb { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-QWLgG .framer-jqsgtb { gap: 0px; } .framer-QWLgG .framer-jqsgtb > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-QWLgG .framer-jqsgtb > :first-child { margin-top: 0px; } .framer-QWLgG .framer-jqsgtb > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(U, $, "framer-QWLgG"),
  le = s;
s.displayName = "Toolbox_Metadata_and_Archiving";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...D, ...z], {
  supportsExplicitInterCodegen: !0,
});
var fe = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FrameruQs2bgVcT",
      slots: [],
      annotations: {
        framerComponentViewportWidth: "true",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"Lg4KIU1zA":{"layout":["fixed","auto"]},"O9_jDFbZC":{"layout":["fixed","auto"]}}}',
        framerResponsiveScreen: "",
        framerDisplayContentsDiv: "false",
        framerIntrinsicWidth: "1200",
        framerIntrinsicHeight: "1050",
        framerImmutableVariables: "true",
        framerContractVersion: "1",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { fe as __FramerMetadata__, le as default };
