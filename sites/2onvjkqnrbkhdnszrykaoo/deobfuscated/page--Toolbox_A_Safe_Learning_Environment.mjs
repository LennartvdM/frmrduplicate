import { DOCS_LINKS } from "./docs-links.mjs"; /* docs URL: DOCS_LINKS["/Toolbox_A_Safe_Learning_Environment"] */
import { a as w } from "./chunk-N6UKUD43.mjs";
import { a as y, b as v } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub.mjs";
import {
  H as X,
  R as c,
  S as h,
  U as u,
  V as x,
  X as M,
  Y as S,
  Z as H,
  ba as Y,
  d as V,
  j as C,
  k,
  la as E,
  m as j,
  q as e,
  r as f,
  u as l,
  v as R,
  wa as F,
  xa as g,
} from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var L = h(l.div),
  z = g(y),
  D = g(v),
  K = h(x);
var Q = {
  CjHKQe1tM: "(min-width: 810px) and (max-width: 1199px)",
  joR3HW0Ss: "(min-width: 1200px)",
  MqR53_Axs: "(max-width: 809px)",
};
var I = "framer-VuNhp",
  $ = {
    CjHKQe1tM: "framer-v-69v6g2",
    joR3HW0Ss: "framer-v-1o8137r",
    MqR53_Axs: "framer-v-j6nyvl",
  },
  _ = w(),
  G = { Desktop: "joR3HW0Ss", Phone: "MqR53_Axs", Tablet: "CjHKQe1tM" },
  O = ({ height: b, id: i, width: m, ...n }) => {
    var a, o;
    return {
      ...n,
      variant:
        (o = (a = G[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && o !== void 0
          ? o
          : "joR3HW0Ss",
    };
  },
  B = V(function (b, i) {
    let { activeLocale: m, setLocale: n } = X(),
      { style: a, className: o, layoutId: d, variant: W, ...T } = O(b);
    k(() => {
      let r = w(void 0, m);
      if (((document.title = r.title || ""), r.viewport)) {
        var p;
        (p = document.querySelector('meta[name="viewport"]')) === null ||
          p === void 0 ||
          p.setAttribute("content", r.viewport);
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
          document.body.classList.add(`${r.bodyClassName}-framer-VuNhp`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-VuNhp`);
          }
        );
    }, [void 0, m]);
    let [A, U] = E(W, Q, !1),
      Z = void 0,
      P = j(null),
      q = C(),
      N = [];
    return (
      S({}),
      e(H.Provider, {
        value: { primaryVariantId: "joR3HW0Ss", variantClassNames: $ },
        children: f(R, {
          id: d ?? q,
          children: [
            f(l.div, {
              ...T,
              className: c(I, ...N, "framer-1o8137r", o),
              ref: i ?? P,
              style: { ...a },
              children: [
                e(Y, {
                  breakpoint: A,
                  overrides: {
                    MqR53_Axs: {
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
                  children: e(L, {
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
                    className: "framer-1hx7mh7",
                  }),
                }),
                e(u, {
                  children: e(x, {
                    className: "framer-1s9wjqq-container",
                    children: e(y, {
                      height: "100%",
                      html: "",
                      id: "EPf5Xgh0S",
                      layoutId: "EPf5Xgh0S",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: DOCS_LINKS["/Toolbox_A_Safe_Learning_Environment"] /* https://docs.neoflix.care/level-2-in-action/11.-lets-neoflix/11.2-a-safe-learning-environment */,
                      width: "100%",
                    }),
                  }),
                }),
                e(u, {
                  width: "100vw",
                  children: e(K, {
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
                    className: "framer-1a1d1bm-container",
                    layoutScroll: !0,
                    children: e(v, {
                      height: "100%",
                      id: "o1hzjCWb7",
                      layoutId: "o1hzjCWb7",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: c(I, ...N), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  J = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${_.bodyClassName}-framer-VuNhp { background: white; }`,
    ".framer-VuNhp.framer-fvghs1, .framer-VuNhp .framer-fvghs1 { display: block; }",
    ".framer-VuNhp.framer-1o8137r { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-VuNhp .framer-1hx7mh7 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-VuNhp .framer-1s9wjqq-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-VuNhp .framer-1a1d1bm-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-VuNhp.framer-1o8137r, .framer-VuNhp .framer-1hx7mh7 { gap: 0px; } .framer-VuNhp.framer-1o8137r > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-VuNhp.framer-1o8137r > :first-child { margin-top: 0px; } .framer-VuNhp.framer-1o8137r > :last-child { margin-bottom: 0px; } .framer-VuNhp .framer-1hx7mh7 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-VuNhp .framer-1hx7mh7 > :first-child { margin-left: 0px; } .framer-VuNhp .framer-1hx7mh7 > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-VuNhp .hidden-1o8137r { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-VuNhp .hidden-69v6g2 { display: none !important; } .${_.bodyClassName}-framer-VuNhp { background: white; } .framer-VuNhp.framer-1o8137r { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-VuNhp .hidden-j6nyvl { display: none !important; } .${_.bodyClassName}-framer-VuNhp { background: white; } .framer-VuNhp.framer-1o8137r { width: 390px; } .framer-VuNhp .framer-1hx7mh7 { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-VuNhp .framer-1hx7mh7 { gap: 0px; } .framer-VuNhp .framer-1hx7mh7 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-VuNhp .framer-1hx7mh7 > :first-child { margin-top: 0px; } .framer-VuNhp .framer-1hx7mh7 > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = M(B, J, "framer-VuNhp"),
  pe = s;
s.displayName = "Toolbox_Tasks_of_the_chair";
s.defaultProps = { height: 1050, width: 1200 };
F(s, [{ explicitInter: !0, fonts: [] }, ...z, ...D], {
  supportsExplicitInterCodegen: !0,
});
var fe = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FramersEYnG8vfd",
      slots: [],
      annotations: {
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"CjHKQe1tM":{"layout":["fixed","auto"]},"MqR53_Axs":{"layout":["fixed","auto"]}}}',
        framerIntrinsicHeight: "1050",
        framerIntrinsicWidth: "1200",
        framerResponsiveScreen: "",
        framerComponentViewportWidth: "true",
        framerImmutableVariables: "true",
        framerContractVersion: "1",
        framerDisplayContentsDiv: "false",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { fe as __FramerMetadata__, pe as default };
