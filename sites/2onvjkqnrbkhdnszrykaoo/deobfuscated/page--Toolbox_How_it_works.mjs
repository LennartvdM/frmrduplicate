import { a as b } from "./chunk-7ATIRYTW.mjs";
import { a as y, b as w } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub.mjs";
import {
  H as N,
  R as p,
  S as x,
  U as h,
  V as u,
  X as I,
  Y as X,
  Z as R,
  ba as Q,
  d as S,
  j as B,
  k,
  la as T,
  m as C,
  q as e,
  r as d,
  u as c,
  v as F,
  wa as V,
  xa as g,
} from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var H = x(c.div),
  A = g(y),
  P = g(w),
  U = x(u);
var D = {
  F0GtcbMw9: "(max-width: 809px)",
  QUhfgwQ85: "(min-width: 1200px)",
  zageH2tgr: "(min-width: 810px) and (max-width: 1199px)",
};
var j = "framer-BfSxY",
  W = {
    F0GtcbMw9: "framer-v-a662xs",
    QUhfgwQ85: "framer-v-1sy07lo",
    zageH2tgr: "framer-v-nne2kl",
  },
  _ = b(),
  $ = { Desktop: "QUhfgwQ85", Phone: "F0GtcbMw9", Tablet: "zageH2tgr" },
  O = ({ height: v, id: i, width: f, ...n }) => {
    var a, o;
    return {
      ...n,
      variant:
        (o = (a = $[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && o !== void 0
          ? o
          : "QUhfgwQ85",
    };
  },
  q = S(function (v, i) {
    let { activeLocale: f, setLocale: n } = N(),
      { style: a, className: o, layoutId: m, variant: E, ...L } = O(v);
    k(() => {
      let r = b(void 0, f);
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
          document.body.classList.add(`${r.bodyClassName}-framer-BfSxY`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-BfSxY`);
          }
        );
    }, [void 0, f]);
    let [M, K] = T(E, D, !1),
      Z = void 0,
      z = C(null),
      G = B(),
      Y = [];
    return (
      X({}),
      e(R.Provider, {
        value: { primaryVariantId: "QUhfgwQ85", variantClassNames: W },
        children: d(F, {
          id: m ?? G,
          children: [
            d(c.div, {
              ...L,
              className: p(j, ...Y, "framer-1sy07lo", o),
              ref: i ?? z,
              style: { ...a },
              children: [
                e(Q, {
                  breakpoint: M,
                  overrides: {
                    F0GtcbMw9: {
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
                  children: e(H, {
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
                    className: "framer-1b7fotl",
                  }),
                }),
                e(h, {
                  children: e(u, {
                    className: "framer-168jru0-container",
                    children: e(y, {
                      height: "100%",
                      html: "",
                      id: "AAhRwG2sz",
                      layoutId: "AAhRwG2sz",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/welcome/neoflix/how-it-works",
                      width: "100%",
                    }),
                  }),
                }),
                e(h, {
                  width: "100vw",
                  children: e(U, {
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
                    className: "framer-18afrdj-container",
                    layoutScroll: !0,
                    children: e(w, {
                      height: "100%",
                      id: "URTLxoIyI",
                      layoutId: "URTLxoIyI",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: p(j, ...Y), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  J = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${_.bodyClassName}-framer-BfSxY { background: white; }`,
    ".framer-BfSxY.framer-hty31c, .framer-BfSxY .framer-hty31c { display: block; }",
    ".framer-BfSxY.framer-1sy07lo { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-BfSxY .framer-1b7fotl { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-BfSxY .framer-168jru0-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-BfSxY .framer-18afrdj-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-BfSxY.framer-1sy07lo, .framer-BfSxY .framer-1b7fotl { gap: 0px; } .framer-BfSxY.framer-1sy07lo > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-BfSxY.framer-1sy07lo > :first-child { margin-top: 0px; } .framer-BfSxY.framer-1sy07lo > :last-child { margin-bottom: 0px; } .framer-BfSxY .framer-1b7fotl > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-BfSxY .framer-1b7fotl > :first-child { margin-left: 0px; } .framer-BfSxY .framer-1b7fotl > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-BfSxY .hidden-1sy07lo { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-BfSxY .hidden-nne2kl { display: none !important; } .${_.bodyClassName}-framer-BfSxY { background: white; } .framer-BfSxY.framer-1sy07lo { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-BfSxY .hidden-a662xs { display: none !important; } .${_.bodyClassName}-framer-BfSxY { background: white; } .framer-BfSxY.framer-1sy07lo { width: 390px; } .framer-BfSxY .framer-1b7fotl { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-BfSxY .framer-1b7fotl { gap: 0px; } .framer-BfSxY .framer-1b7fotl > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-BfSxY .framer-1b7fotl > :first-child { margin-top: 0px; } .framer-BfSxY .framer-1b7fotl > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = I(q, J, "framer-BfSxY"),
  le = s;
s.displayName = "Toolbox_Enhancing_Communication_Quality";
s.defaultProps = { height: 1050, width: 1200 };
V(s, [{ explicitInter: !0, fonts: [] }, ...A, ...P], {
  supportsExplicitInterCodegen: !0,
});
var de = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerEY4hH_Y7j",
      slots: [],
      annotations: {
        framerIntrinsicWidth: "1200",
        framerContractVersion: "1",
        framerImmutableVariables: "true",
        framerComponentViewportWidth: "true",
        framerIntrinsicHeight: "1050",
        framerDisplayContentsDiv: "false",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"zageH2tgr":{"layout":["fixed","auto"]},"F0GtcbMw9":{"layout":["fixed","auto"]}}}',
        framerResponsiveScreen: "",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { de as __FramerMetadata__, le as default };
