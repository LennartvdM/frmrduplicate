import { DOCS_LINKS } from "./docs-links.mjs"; /* docs URL: DOCS_LINKS["/Toolbox_Questions_to_ask_during_previewing"] */
import { a as q } from "./chunk-L7BLQOMP.mjs";
import { a as y, b as w } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub.mjs";
import {
  H as X,
  R as p,
  S as u,
  U as x,
  V as h,
  X as T,
  Y as V,
  Z as W,
  ba as I,
  d as F,
  j as k,
  k as C,
  la as L,
  m as N,
  q as e,
  r as c,
  u as l,
  v as O,
  wa as Y,
  xa as g,
} from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var S = u(l.div),
  j = g(y),
  G = g(w),
  M = u(h);
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
  Q = F(function (b, n) {
    let { activeLocale: m, setLocale: i } = X(),
      { style: a, className: o, layoutId: d, variant: z, ...D } = H(b);
    C(() => {
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
    let [R, J] = L(z, A, !1),
      U = void 0,
      E = N(null),
      P = k(),
      _ = [];
    return (
      V({}),
      e(W.Provider, {
        value: { primaryVariantId: "yfgTKwngt", variantClassNames: $ },
        children: c(O, {
          id: d ?? P,
          children: [
            c(l.div, {
              ...D,
              className: p(K, ..._, "framer-1pcffxn", o),
              ref: n ?? E,
              style: { ...a },
              children: [
                e(I, {
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
                    className: "framer-1e0rqq0",
                  }),
                }),
                e(x, {
                  children: e(h, {
                    className: "framer-11d0z0w-container",
                    children: e(y, {
                      height: "100%",
                      html: "",
                      id: "SWQXLrroy",
                      layoutId: "SWQXLrroy",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: DOCS_LINKS["/Toolbox_Questions_to_ask_during_previewing"] /* https://docs.neoflix.care/level-2-in-action/10.-previewing/10.1-questions-to-ask-during-previewing */,
                      width: "100%",
                    }),
                  }),
                }),
                e(x, {
                  width: "100vw",
                  children: e(M, {
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
                    className: "framer-yhjwbr-container",
                    layoutScroll: !0,
                    children: e(w, {
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
            e("div", { className: p(K, ..._), id: "overlay" }),
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
  s = T(Q, Z, "framer-qFu7e"),
  fe = s;
s.displayName = "Toolbox_Learning_from_success_stories";
s.defaultProps = { height: 1050, width: 1200 };
Y(s, [{ explicitInter: !0, fonts: [] }, ...j, ...G], {
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
