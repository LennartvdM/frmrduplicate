/* CSS extracted to: page--Toolbox_Questions_to_ask_during_previewing.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as q } from "./chunk-L7BLQOMP.mjs";
import { a as y, b as w } from "./chunk--embed-component.mjs";
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
var S = withFXWrapper(motion.div),
  j = getFonts(y),
  G = getFonts(w),
  M = withFXWrapper(cssSSRMinifiedHelper);
var A = {
  KNzGoiDOq: "(min-width: 810px) and (max-width: 1199px)",
  Wdndr0Ovd: "(max-width: 809px)",
  yfgTKwngt: "(min-width: 1200px)",
};
var K = "framer-qFu7e",
  $ = {
    KNzGoiDOq: "framer-v-1ccw4b4",
    Wdndr0Ovd: "framer-v-b200ne",
    yfgTKwngt: "framer-v-1pcffxn",
  },
  v = q(),
  B = { Desktop: "yfgTKwngt", Phone: "Wdndr0Ovd", Tablet: "KNzGoiDOq" },
  H = ({ height: b, id: n, width: m, ...i }) => {
    var a, o;
    return {
      ...i,
      variant:
        (o = (a = B[i.variant]) !== null && a !== void 0 ? a : i.variant) !==
          null && o !== void 0
          ? o
          : "yfgTKwngt",
    };
  },
  Q = forwardRef(function (b, n) {
    let { activeLocale: m, setLocale: i } = useLocale(),
      { style: a, className: o, layoutId: d, variant: z, ...D } = H(b);
    useInsertionEffect(() => {
      let t = q(void 0, m);
      if (((document.title = t.title || ""), t.viewport)) {
        var f;
        (f = document.querySelector('meta[name="viewport"]')) === null ||
          f === void 0 ||
          f.setAttribute("content", t.viewport);
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
          document.body.classList.add(`${t.bodyClassName}-framer-qFu7e`),
          () => {
            document.body.classList.remove(`${t.bodyClassName}-framer-qFu7e`);
          }
        );
    }, [void 0, m]);
    let [R, J] = useVariantState(z, A, !1),
      U = void 0,
      E = useRef(null),
      P = useId(),
      _ = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "yfgTKwngt", variantClassNames: $ },
        children: jsxs(LayoutGroup, {
          id: d ?? P,
          children: [
            jsxs(motion.div, {
              ...D,
              className: cx(K, ..._, "framer-1pcffxn", o),
              ref: n ?? E,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: R,
                  overrides: {
                    Wdndr0Ovd: {
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
                            DeviceSizeContainer: 0,
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
                            DeviceSizeContainer: 0,
                            y: -60,
                          },
                        },
                      ],
                    },
                  },
                  children: jsx(S, {
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
                          DeviceSizeContainer: 0,
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
                          DeviceSizeContainer: 0,
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-1e0rqq0",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-11d0z0w-container",
                    children: jsx(y, {
                      height: "100%",
                      html: "",
                      id: "SWQXLrroy",
                      layoutId: "SWQXLrroy",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/10.-previewing/10.1-questions-to-ask-during-previewing" /* → getDocsUrl("/Toolbox_Questions_to_ask_during_previewing") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(M, {
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
                          DeviceSizeContainer: 0,
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
                          DeviceSizeContainer: 0,
                          y: -60,
                        },
                      },
                    ],
                    __framer__transformTrigger: "onScroll",
                    __perspectiveFX: !1,
                    __targetOpacity: 1,
                    className: "framer-yhjwbr-container",
                    layoutScroll: !0,
                    children: jsx(w, {
                      height: "100%",
                      id: "qOMfOas8p",
                      layoutId: "qOMfOas8p",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(K, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  Z = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${v.bodyClassName}-framer-qFu7e { background: white; }`,
    ".framer-qFu7e.framer-1x0q41e, .framer-qFu7e .framer-1x0q41e { display: block; }",
    ".framer-qFu7e.framer-1pcffxn { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-qFu7e .framer-1e0rqq0 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-qFu7e .framer-11d0z0w-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-qFu7e .framer-yhjwbr-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-qFu7e.framer-1pcffxn, .framer-qFu7e .framer-1e0rqq0 { gap: 0px; } .framer-qFu7e.framer-1pcffxn > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-qFu7e.framer-1pcffxn > :first-child { margin-top: 0px; } .framer-qFu7e.framer-1pcffxn > :last-child { margin-bottom: 0px; } .framer-qFu7e .framer-1e0rqq0 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-qFu7e .framer-1e0rqq0 > :first-child { margin-left: 0px; } .framer-qFu7e .framer-1e0rqq0 > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-qFu7e .hidden-1pcffxn { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-qFu7e .hidden-1ccw4b4 { display: none !important; } .${v.bodyClassName}-framer-qFu7e { background: white; } .framer-qFu7e.framer-1pcffxn { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-qFu7e .hidden-b200ne { display: none !important; } .${v.bodyClassName}-framer-qFu7e { background: white; } .framer-qFu7e.framer-1pcffxn { width: 390px; } .framer-qFu7e .framer-1e0rqq0 { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-qFu7e .framer-1e0rqq0 { gap: 0px; } .framer-qFu7e .framer-1e0rqq0 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-qFu7e .framer-1e0rqq0 > :first-child { margin-top: 0px; } .framer-qFu7e .framer-1e0rqq0 > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(Q, Z, "framer-qFu7e"),
  fe = s;
s.displayName = "Toolbox_Learning_from_success_stories";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...j, ...G], {
  supportsExplicitInterCodegen: !0,
});
var ce = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "Framerut1mnZVW1",
      slots: [],
      annotations: {
        framerComponentViewportWidth: "true",
        framerIntrinsicWidth: "1200",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"KNzGoiDOq":{"layout":["fixed","auto"]},"Wdndr0Ovd":{"layout":["fixed","auto"]}}}',
        framerDisplayContentsDiv: "false",
        framerImmutableVariables: "true",
        framerContractVersion: "1",
        framerResponsiveScreen: "",
        framerIntrinsicHeight: "1050",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { ce as __FramerMetadata__, fe as default };
