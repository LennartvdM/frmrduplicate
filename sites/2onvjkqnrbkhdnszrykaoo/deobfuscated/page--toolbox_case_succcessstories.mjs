import { DOCS_LINKS } from "./docs-links.mjs"; /* docs URL: DOCS_LINKS["/toolbox_case_succcessstories"] */
import { a as m } from "./chunk-YFO2EVVN.mjs";
import { a as w, b as g } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub.mjs";
import {
  H as L,
  R as h,
  S as u,
  U as x,
  V as y,
  X as V,
  Y as q,
  Z as F,
  ba as P,
  d as I,
  i as k,
  j as J,
  k as X,
  la as S,
  m as R,
  q as e,
  r as f,
  u as p,
  v as N,
  wa as O,
  xa as C,
} from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var H = u(p.div),
  M = C(w),
  $ = C(g),
  G = u(y);
var z = {
  bdLldcqm3: "(min-width: 1200px)",
  RlqDWRZDe: "(min-width: 810px) and (max-width: 1199px)",
  uShCCJXpO: "(max-width: 809px)",
};
var Y = "framer-jICDJ",
  B = {
    bdLldcqm3: "framer-v-17k0d8c",
    RlqDWRZDe: "framer-v-1lr8pxy",
    uShCCJXpO: "framer-v-1v5ewf1",
  },
  b = m(),
  K = { Desktop: "bdLldcqm3", Phone: "uShCCJXpO", Tablet: "RlqDWRZDe" },
  Q = ({ height: v, id: n, width: r, ...s }) => {
    var o, i;
    return {
      ...s,
      variant:
        (i = (o = K[s.variant]) !== null && o !== void 0 ? o : s.variant) !==
          null && i !== void 0
          ? i
          : "bdLldcqm3",
    };
  },
  U = I(function (v, n) {
    let { activeLocale: r, setLocale: s } = L(),
      { style: o, className: i, layoutId: l, variant: E, ...T } = Q(v);
    (k(() => {
      let t = m(void 0, r);
      if (t.robots) {
        let a = document.querySelector('meta[name="robots"]');
        a
          ? a.setAttribute("content", t.robots)
          : ((a = document.createElement("meta")),
            a.setAttribute("name", "robots"),
            a.setAttribute("content", t.robots),
            document.head.appendChild(a));
      }
    }, [void 0, r]),
      X(() => {
        let t = m(void 0, r);
        if (((document.title = t.title || ""), t.viewport)) {
          var a;
          (a = document.querySelector('meta[name="viewport"]')) === null ||
            a === void 0 ||
            a.setAttribute("content", t.viewport);
        }
        let j = t.bodyClassName;
        if (j) {
          let c = document.body;
          (c.classList.forEach(
            (D) => D.startsWith("framer-body-") && c.classList.remove(D),
          ),
            c.classList.add(`${t.bodyClassName}-framer-jICDJ`));
        }
        return () => {
          j &&
            document.body.classList.remove(`${t.bodyClassName}-framer-jICDJ`);
        };
      }, [void 0, r]));
    let [W, te] = S(E, z, !1),
      ae = void 0,
      A = R(null),
      Z = J(),
      _ = [];
    return (
      q({}),
      e(F.Provider, {
        value: { primaryVariantId: "bdLldcqm3", variantClassNames: B },
        children: f(N, {
          id: l ?? Z,
          children: [
            f(p.div, {
              ...T,
              className: h(Y, ..._, "framer-17k0d8c", i),
              ref: n ?? A,
              style: { ...o },
              children: [
                e(P, {
                  breakpoint: W,
                  overrides: {
                    uShCCJXpO: {
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
                    className: "framer-1jal4wy",
                  }),
                }),
                e(x, {
                  children: e(y, {
                    className: "framer-baonx0-container",
                    children: e(w, {
                      height: "100%",
                      html: "",
                      id: "KV4cw4lAZ",
                      layoutId: "KV4cw4lAZ",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: DOCS_LINKS["/toolbox_case_succcessstories"] /* https://docs.neoflix.care/level-1-fundamentals/4.-learning-from-success-stories */,
                      width: "100%",
                    }),
                  }),
                }),
                e(x, {
                  width: "100vw",
                  children: e(G, {
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
                    className: "framer-1ui3sei-container",
                    layoutScroll: !0,
                    children: e(g, {
                      height: "100%",
                      id: "kD_HLOGtP",
                      layoutId: "kD_HLOGtP",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: h(Y, ..._), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  ee = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${b.bodyClassName}-framer-jICDJ { background: white; }`,
    ".framer-jICDJ.framer-163xqab, .framer-jICDJ .framer-163xqab { display: block; }",
    ".framer-jICDJ.framer-17k0d8c { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-jICDJ .framer-1jal4wy { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-jICDJ .framer-baonx0-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-jICDJ .framer-1ui3sei-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-jICDJ.framer-17k0d8c, .framer-jICDJ .framer-1jal4wy { gap: 0px; } .framer-jICDJ.framer-17k0d8c > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-jICDJ.framer-17k0d8c > :first-child { margin-top: 0px; } .framer-jICDJ.framer-17k0d8c > :last-child { margin-bottom: 0px; } .framer-jICDJ .framer-1jal4wy > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-jICDJ .framer-1jal4wy > :first-child { margin-left: 0px; } .framer-jICDJ .framer-1jal4wy > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-jICDJ .hidden-17k0d8c { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-jICDJ .hidden-1lr8pxy { display: none !important; } .${b.bodyClassName}-framer-jICDJ { background: white; } .framer-jICDJ.framer-17k0d8c { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-jICDJ .hidden-1v5ewf1 { display: none !important; } .${b.bodyClassName}-framer-jICDJ { background: white; } .framer-jICDJ.framer-17k0d8c { width: 390px; } .framer-jICDJ .framer-1jal4wy { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-jICDJ .framer-1jal4wy { gap: 0px; } .framer-jICDJ .framer-1jal4wy > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-jICDJ .framer-1jal4wy > :first-child { margin-top: 0px; } .framer-jICDJ .framer-1jal4wy > :last-child { margin-bottom: 0px; } }}`,
  ],
  d = V(U, ee, "framer-jICDJ"),
  pe = d;
d.displayName = "Toolbox_case_australia";
d.defaultProps = { height: 1050, width: 1200 };
O(d, [{ explicitInter: !0, fonts: [] }, ...M, ...$], {
  supportsExplicitInterCodegen: !0,
});
var he = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "Framerf7Ah01sPh",
      slots: [],
      annotations: {
        framerResponsiveScreen: "",
        framerContractVersion: "1",
        framerDisplayContentsDiv: "false",
        framerIntrinsicWidth: "1200",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"RlqDWRZDe":{"layout":["fixed","auto"]},"uShCCJXpO":{"layout":["fixed","auto"]}}}',
        framerImmutableVariables: "true",
        framerIntrinsicHeight: "1050",
        framerComponentViewportWidth: "true",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { he as __FramerMetadata__, pe as default };
