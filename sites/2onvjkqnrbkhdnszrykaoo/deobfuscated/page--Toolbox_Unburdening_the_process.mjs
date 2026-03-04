import { a as v } from "./chunk-VH44VBV6.mjs";
import { a as h, b as y } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub.mjs";
import {
  H as X,
  R as p,
  S as u,
  U as w,
  V as g,
  X as N,
  Y as P,
  Z as R,
  ba as E,
  d as k,
  j as Q,
  k as C,
  la as U,
  m as I,
  q as e,
  r as l,
  u as c,
  v as F,
  wa as Y,
  xa as x,
} from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var H = u(c.div),
  L = x(h),
  B = x(y),
  D = u(g);
var M = {
  aggqgyfRx: "(min-width: 810px) and (max-width: 1199px)",
  J_PEIjKFt: "(max-width: 809px)",
  UuUq0AHIk: "(min-width: 1200px)",
};
var V = "framer-mOQw3",
  S = {
    aggqgyfRx: "framer-v-1kt2119",
    J_PEIjKFt: "framer-v-1if43vz",
    UuUq0AHIk: "framer-v-vey6bu",
  },
  b = v(),
  G = { Desktop: "UuUq0AHIk", Phone: "J_PEIjKFt", Tablet: "aggqgyfRx" },
  J = ({ height: _, id: n, width: s, ...i }) => {
    var a, o;
    return {
      ...i,
      variant:
        (o = (a = G[i.variant]) !== null && a !== void 0 ? a : i.variant) !==
          null && o !== void 0
          ? o
          : "UuUq0AHIk",
    };
  },
  K = k(function (_, n) {
    let { activeLocale: s, setLocale: i } = X(),
      { style: a, className: o, layoutId: d, variant: j, ...q } = J(_);
    C(() => {
      let r = v(void 0, s);
      if (((document.title = r.title || ""), r.viewport)) {
        var f;
        (f = document.querySelector('meta[name="viewport"]')) === null ||
          f === void 0 ||
          f.setAttribute("content", r.viewport);
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
          document.body.classList.add(`${r.bodyClassName}-framer-mOQw3`),
          () => {
            document.body.classList.remove(`${r.bodyClassName}-framer-mOQw3`);
          }
        );
    }, [void 0, s]);
    let [A, $] = U(j, M, !1),
      Z = void 0,
      T = I(null),
      W = Q(),
      O = [];
    return (
      P({}),
      e(R.Provider, {
        value: { primaryVariantId: "UuUq0AHIk", variantClassNames: S },
        children: l(F, {
          id: d ?? W,
          children: [
            l(c.div, {
              ...q,
              className: p(V, ...O, "framer-vey6bu", o),
              ref: n ?? T,
              style: { ...a },
              children: [
                e(E, {
                  breakpoint: A,
                  overrides: {
                    J_PEIjKFt: {
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
                    className: "framer-umnr06",
                  }),
                }),
                e(w, {
                  children: e(g, {
                    className: "framer-1wffai3-container",
                    children: e(h, {
                      height: "100%",
                      html: "",
                      id: "W2CcC9PWg",
                      layoutId: "W2CcC9PWg",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: "https://docs.neoflix.care/level-1-fundamentals/1.-preproduction/1.4-unburdening-the-process",
                      width: "100%",
                    }),
                  }),
                }),
                e(w, {
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
                    className: "framer-6t7of9-container",
                    layoutScroll: !0,
                    children: e(y, {
                      height: "100%",
                      id: "YWDUGG0eR",
                      layoutId: "YWDUGG0eR",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: p(V, ...O), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  z = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${b.bodyClassName}-framer-mOQw3 { background: white; }`,
    ".framer-mOQw3.framer-1fot8mo, .framer-mOQw3 .framer-1fot8mo { display: block; }",
    ".framer-mOQw3.framer-vey6bu { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-mOQw3 .framer-umnr06 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-mOQw3 .framer-1wffai3-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-mOQw3 .framer-6t7of9-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-mOQw3.framer-vey6bu, .framer-mOQw3 .framer-umnr06 { gap: 0px; } .framer-mOQw3.framer-vey6bu > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-mOQw3.framer-vey6bu > :first-child { margin-top: 0px; } .framer-mOQw3.framer-vey6bu > :last-child { margin-bottom: 0px; } .framer-mOQw3 .framer-umnr06 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-mOQw3 .framer-umnr06 > :first-child { margin-left: 0px; } .framer-mOQw3 .framer-umnr06 > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-mOQw3 .hidden-vey6bu { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-mOQw3 .hidden-1kt2119 { display: none !important; } .${b.bodyClassName}-framer-mOQw3 { background: white; } .framer-mOQw3.framer-vey6bu { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-mOQw3 .hidden-1if43vz { display: none !important; } .${b.bodyClassName}-framer-mOQw3 { background: white; } .framer-mOQw3.framer-vey6bu { width: 390px; } .framer-mOQw3 .framer-umnr06 { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-mOQw3 .framer-umnr06 { gap: 0px; } .framer-mOQw3 .framer-umnr06 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-mOQw3 .framer-umnr06 > :first-child { margin-top: 0px; } .framer-mOQw3 .framer-umnr06 > :last-child { margin-bottom: 0px; } }}`,
  ],
  m = N(K, z, "framer-mOQw3"),
  fe = m;
m.displayName = "Toolbox_How_it_works";
m.defaultProps = { height: 1050, width: 1200 };
Y(m, [{ explicitInter: !0, fonts: [] }, ...L, ...B], {
  supportsExplicitInterCodegen: !0,
});
var le = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FramerX8n9MxBBr",
      slots: [],
      annotations: {
        framerIntrinsicWidth: "1200",
        framerImmutableVariables: "true",
        framerContractVersion: "1",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"aggqgyfRx":{"layout":["fixed","auto"]},"J_PEIjKFt":{"layout":["fixed","auto"]}}}',
        framerComponentViewportWidth: "true",
        framerResponsiveScreen: "",
        framerDisplayContentsDiv: "false",
        framerIntrinsicHeight: "1050",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { le as __FramerMetadata__, fe as default };
