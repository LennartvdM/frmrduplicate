import { a as k } from "./chunk-37MWMNGK.mjs";
import { a as y, b as g } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub.mjs";
import {
  H,
  R as p,
  S as h,
  U as u,
  V as x,
  X as V,
  Y as j,
  Z as I,
  ba as O,
  d as F,
  j as N,
  k as C,
  la as E,
  m as X,
  q as e,
  r as l,
  u as c,
  v as z,
  wa as R,
  xa as v,
} from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var P = h(c.div),
  q = v(y),
  Q = v(g),
  D = h(x);
var M = {
  iXtBO8oyh: "(max-width: 809px)",
  kQczyfAHF: "(min-width: 1200px)",
  rHHVab2_9: "(min-width: 810px) and (max-width: 1199px)",
};
var Y = "framer-hNFvu",
  W = {
    iXtBO8oyh: "framer-v-16sp69q",
    kQczyfAHF: "framer-v-1kh1fjx",
    rHHVab2_9: "framer-v-194pul6",
  },
  b = k(),
  $ = { Desktop: "kQczyfAHF", Phone: "iXtBO8oyh", Tablet: "rHHVab2_9" },
  G = ({ height: w, id: i, width: m, ...n }) => {
    var a, o;
    return {
      ...n,
      variant:
        (o = (a = $[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && o !== void 0
          ? o
          : "kQczyfAHF",
    };
  },
  J = F(function (w, i) {
    let { activeLocale: m, setLocale: n } = H(),
      { style: a, className: o, layoutId: f, variant: A, ...L } = G(w);
    C(() => {
      let r = k(void 0, m);
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
          document.body.classList.add(`${r.bodyClassName}-framer-hNFvu`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-hNFvu`);
          }
        );
    }, [void 0, m]);
    let [T, K] = E(A, M, !1),
      Z = void 0,
      S = X(null),
      B = N(),
      _ = [];
    return (
      j({}),
      e(I.Provider, {
        value: { primaryVariantId: "kQczyfAHF", variantClassNames: W },
        children: l(z, {
          id: f ?? B,
          children: [
            l(c.div, {
              ...L,
              className: p(Y, ..._, "framer-1kh1fjx", o),
              ref: i ?? S,
              style: { ...a },
              children: [
                e(O, {
                  breakpoint: T,
                  overrides: {
                    iXtBO8oyh: {
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
                  children: e(P, {
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
                    className: "framer-16z8kf7",
                  }),
                }),
                e(u, {
                  children: e(x, {
                    className: "framer-128oa3t-container",
                    children: e(y, {
                      height: "100%",
                      html: "",
                      id: "OXzJbg44E",
                      layoutId: "OXzJbg44E",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-1-fundamentals/4.-learning-from-success-stories",
                      width: "100%",
                    }),
                  }),
                }),
                e(u, {
                  width: "100vw",
                  children: e(D, {
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
                    className: "framer-kkvqtd-container",
                    layoutScroll: !0,
                    children: e(g, {
                      height: "100%",
                      id: "daOiqULFk",
                      layoutId: "daOiqULFk",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: p(Y, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  U = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${b.bodyClassName}-framer-hNFvu { background: white; }`,
    ".framer-hNFvu.framer-1ye88zl, .framer-hNFvu .framer-1ye88zl { display: block; }",
    ".framer-hNFvu.framer-1kh1fjx { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-hNFvu .framer-16z8kf7 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-hNFvu .framer-128oa3t-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-hNFvu .framer-kkvqtd-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-hNFvu.framer-1kh1fjx, .framer-hNFvu .framer-16z8kf7 { gap: 0px; } .framer-hNFvu.framer-1kh1fjx > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-hNFvu.framer-1kh1fjx > :first-child { margin-top: 0px; } .framer-hNFvu.framer-1kh1fjx > :last-child { margin-bottom: 0px; } .framer-hNFvu .framer-16z8kf7 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-hNFvu .framer-16z8kf7 > :first-child { margin-left: 0px; } .framer-hNFvu .framer-16z8kf7 > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-hNFvu .hidden-1kh1fjx { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-hNFvu .hidden-194pul6 { display: none !important; } .${b.bodyClassName}-framer-hNFvu { background: white; } .framer-hNFvu.framer-1kh1fjx { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-hNFvu .hidden-16sp69q { display: none !important; } .${b.bodyClassName}-framer-hNFvu { background: white; } .framer-hNFvu.framer-1kh1fjx { width: 390px; } .framer-hNFvu .framer-16z8kf7 { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-hNFvu .framer-16z8kf7 { gap: 0px; } .framer-hNFvu .framer-16z8kf7 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-hNFvu .framer-16z8kf7 > :first-child { margin-top: 0px; } .framer-hNFvu .framer-16z8kf7 > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = V(J, U, "framer-hNFvu"),
  de = s;
s.displayName = "Toolbox Safe_Simple_Small";
s.defaultProps = { height: 1050, width: 1200 };
R(s, [{ explicitInter: !0, fonts: [] }, ...q, ...Q], {
  supportsExplicitInterCodegen: !0,
});
var le = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerHtIN1t6ER",
      slots: [],
      annotations: {
        framerIntrinsicHeight: "1050",
        framerDisplayContentsDiv: "false",
        framerIntrinsicWidth: "1200",
        framerContractVersion: "1",
        framerComponentViewportWidth: "true",
        framerImmutableVariables: "true",
        framerResponsiveScreen: "",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"rHHVab2_9":{"layout":["fixed","auto"]},"iXtBO8oyh":{"layout":["fixed","auto"]}}}',
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { le as __FramerMetadata__, de as default };
