/* CSS extracted to: page--Toolbox_Metadata_and_Archiving.css */
import { DOCS_LINKS, getDocsUrl } from "./docs-links.mjs";
import { a as v } from "./chunk-ICFSHZDI.mjs";
import { a as g, b as y } from "./chunk--embed-component.mjs";
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
var L = withFXWrapper(motion.div),
  Z = getFonts(g),
  G = getFonts(y),
  q = withFXWrapper(cssSSRMinifiedHelper);
var A = {
  d1oi4fMZw: "(max-width: 809px)",
  E3WY72sG2: "(min-width: 810px) and (max-width: 1199px)",
  pl2iO1mUk: "(min-width: 1200px)",
};
var P = "framer-lSDMM",
  U = {
    d1oi4fMZw: "framer-v-1pxop0j",
    E3WY72sG2: "framer-v-2qdt5u",
    pl2iO1mUk: "framer-v-43j6u0",
  },
  w = v(),
  $ = { Desktop: "pl2iO1mUk", Phone: "d1oi4fMZw", Tablet: "E3WY72sG2" },
  B = ({ height: b, id: i, width: m, ...n }) => {
    var a, o;
    return {
      ...n,
      variant:
        (o = (a = $[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && o !== void 0
          ? o
          : "pl2iO1mUk",
    };
  },
  H = forwardRef(function (b, i) {
    let { activeLocale: m, setLocale: n } = useLocale(),
      { style: a, className: o, layoutId: l, variant: V, ...R } = B(b);
    useInsertionEffect(() => {
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
          document.body.classList.add(`${r.bodyClassName}-framer-lSDMM`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-lSDMM`);
          }
        );
    }, [void 0, m]);
    let [T, K] = useVariantState(V, A, !1),
      Q = void 0,
      O = useRef(null),
      W = useId(),
      _ = [];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "pl2iO1mUk", variantClassNames: U },
        children: jsxs(LayoutGroup, {
          id: l ?? W,
          children: [
            jsxs(motion.div, {
              ...R,
              className: cx(P, ..._, "framer-43j6u0", o),
              ref: i ?? O,
              style: { ...a },
              children: [
                jsx(PropertyOverridesProvider, {
                  breakpoint: T,
                  overrides: {
                    d1oi4fMZw: {
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
                  children: jsx(L, {
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
                    className: "framer-fz73vx",
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  children: jsx(cssSSRMinifiedHelper, {
                    className: "framer-1bewkfi-container",
                    children: jsx(g, {
                      height: "100%",
                      html: "",
                      id: "IPc28XIeN",
                      layoutId: "IPc28XIeN",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-2-in-action/9.-after-the-intervention/9.3-metadata-and-archiving" /* → getDocsUrl("/Toolbox_Metadata_and_Archiving") */,
                      width: "100%",
                    }),
                  }),
                }),
                jsx(DeviceSizeContainer, {
                  width: "100vw",
                  children: jsx(q, {
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
                    className: "framer-1mv3mqn-container",
                    layoutScroll: !0,
                    children: jsx(y, {
                      height: "100%",
                      id: "pSSEqRcD7",
                      layoutId: "pSSEqRcD7",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            jsx("div", { className: cx(P, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  J = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${w.bodyClassName}-framer-lSDMM { background: white; }`,
    ".framer-lSDMM.framer-ropj60, .framer-lSDMM .framer-ropj60 { display: block; }",
    ".framer-lSDMM.framer-43j6u0 { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-lSDMM .framer-fz73vx { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-lSDMM .framer-1bewkfi-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-lSDMM .framer-1mv3mqn-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-lSDMM.framer-43j6u0, .framer-lSDMM .framer-fz73vx { gap: 0px; } .framer-lSDMM.framer-43j6u0 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-lSDMM.framer-43j6u0 > :first-child { margin-top: 0px; } .framer-lSDMM.framer-43j6u0 > :last-child { margin-bottom: 0px; } .framer-lSDMM .framer-fz73vx > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-lSDMM .framer-fz73vx > :first-child { margin-left: 0px; } .framer-lSDMM .framer-fz73vx > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-lSDMM .hidden-43j6u0 { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-lSDMM .hidden-2qdt5u { display: none !important; } .${w.bodyClassName}-framer-lSDMM { background: white; } .framer-lSDMM.framer-43j6u0 { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-lSDMM .hidden-1pxop0j { display: none !important; } .${w.bodyClassName}-framer-lSDMM { background: white; } .framer-lSDMM.framer-43j6u0 { width: 390px; } .framer-lSDMM .framer-fz73vx { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-lSDMM .framer-fz73vx { gap: 0px; } .framer-lSDMM .framer-fz73vx > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-lSDMM .framer-fz73vx > :first-child { margin-top: 0px; } .framer-lSDMM .framer-fz73vx > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = withCSS(H, J, "framer-lSDMM"),
  de = s;
s.displayName = "Toolbox_Education_And_Training";
s.defaultProps = { height: 1050, width: 1200 };
loadFonts(s, [{ explicitInter: !0, fonts: [] }, ...Z, ...G], {
  supportsExplicitInterCodegen: !0,
});
var fe = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerzI2CbZmPJ",
      slots: [],
      annotations: {
        framerComponentViewportWidth: "true",
        framerIntrinsicWidth: "1200",
        framerContractVersion: "1",
        framerImmutableVariables: "true",
        framerResponsiveScreen: "",
        framerIntrinsicHeight: "1050",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"E3WY72sG2":{"layout":["fixed","auto"]},"d1oi4fMZw":{"layout":["fixed","auto"]}}}',
        framerDisplayContentsDiv: "false",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { fe as __FramerMetadata__, de as default };
