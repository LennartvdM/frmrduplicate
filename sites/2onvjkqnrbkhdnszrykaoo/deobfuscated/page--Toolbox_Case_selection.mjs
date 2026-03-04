import { DOCS_LINKS } from "./docs-links.mjs"; /* docs URL: DOCS_LINKS["/Toolbox_Case_selection"] */
import { a as w } from "./chunk-YRUSXTEZ.mjs";
import { a as g, b } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import "./chunk--empty-stub.mjs";
import {
  H as F,
  R as p,
  S as h,
  U as x,
  V as y,
  X as Y,
  Y as q,
  Z as X,
  ba as O,
  d as k,
  j as Z,
  k as C,
  la as V,
  m as R,
  q as e,
  r as f,
  u as l,
  v as N,
  wa as j,
  xa as u,
} from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var P = h(l.div),
  S = u(g),
  A = u(b),
  J = h(y);
var Q = {
  O2R29QjFO: "(max-width: 809px)",
  xYaM39J3n: "(min-width: 1200px)",
  yRcs1myye: "(min-width: 810px) and (max-width: 1199px)",
};
var L = "framer-ZrI92",
  B = {
    O2R29QjFO: "framer-v-toq88q",
    xYaM39J3n: "framer-v-ei83m9",
    yRcs1myye: "framer-v-8y62k",
  },
  v = w(),
  H = { Desktop: "xYaM39J3n", Phone: "O2R29QjFO", Tablet: "yRcs1myye" },
  W = ({ height: _, id: i, width: m, ...n }) => {
    var a, o;
    return {
      ...n,
      variant:
        (o = (a = H[n.variant]) !== null && a !== void 0 ? a : n.variant) !==
          null && o !== void 0
          ? o
          : "xYaM39J3n",
    };
  },
  $ = k(function (_, i) {
    let { activeLocale: m, setLocale: n } = F(),
      { style: a, className: o, layoutId: d, variant: M, ...T } = W(_);
    C(() => {
      let t = w(void 0, m);
      if (((document.title = t.title || ""), t.viewport)) {
        var c;
        (c = document.querySelector('meta[name="viewport"]')) === null ||
          c === void 0 ||
          c.setAttribute("content", t.viewport);
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
          document.body.classList.add(`${t.bodyClassName}-framer-ZrI92`),
          () => {
            document.body.classList.remove(`${t.bodyClassName}-framer-ZrI92`);
          }
        );
    }, [void 0, m]);
    let [z, K] = V(M, Q, !1),
      U = void 0,
      D = R(null),
      E = Z(),
      I = [];
    return (
      q({}),
      e(X.Provider, {
        value: { primaryVariantId: "xYaM39J3n", variantClassNames: B },
        children: f(N, {
          id: d ?? E,
          children: [
            f(l.div, {
              ...T,
              className: p(L, ...I, "framer-ei83m9", o),
              ref: i ?? D,
              style: { ...a },
              children: [
                e(O, {
                  breakpoint: z,
                  overrides: {
                    O2R29QjFO: {
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
                    className: "framer-tdbkq7",
                  }),
                }),
                e(x, {
                  children: e(y, {
                    className: "framer-b0fqsm-container",
                    children: e(g, {
                      height: "100%",
                      html: "",
                      id: "ocDNfwszm",
                      layoutId: "ocDNfwszm",
                      style: { height: "100%", width: "100%" },
                      type: "url",
                      url: DOCS_LINKS["/Toolbox_Case_selection"] /* https://docs.neoflix.care/level-2-in-action/5.-preparation-and-consent/5.2-case-selection */,
                      width: "100%",
                    }),
                  }),
                }),
                e(x, {
                  width: "100vw",
                  children: e(J, {
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
                    className: "framer-k6lwnz-container",
                    layoutScroll: !0,
                    children: e(b, {
                      height: "100%",
                      id: "gBwDz3b0L",
                      layoutId: "gBwDz3b0L",
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              ],
            }),
            e("div", { className: p(L, ...I), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  G = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${v.bodyClassName}-framer-ZrI92 { background: white; }`,
    ".framer-ZrI92.framer-1kcag02, .framer-ZrI92 .framer-1kcag02 { display: block; }",
    ".framer-ZrI92.framer-ei83m9 { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-ZrI92 .framer-tdbkq7 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-ZrI92 .framer-b0fqsm-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }",
    ".framer-ZrI92 .framer-k6lwnz-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-ZrI92.framer-ei83m9, .framer-ZrI92 .framer-tdbkq7 { gap: 0px; } .framer-ZrI92.framer-ei83m9 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-ZrI92.framer-ei83m9 > :first-child { margin-top: 0px; } .framer-ZrI92.framer-ei83m9 > :last-child { margin-bottom: 0px; } .framer-ZrI92 .framer-tdbkq7 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-ZrI92 .framer-tdbkq7 > :first-child { margin-left: 0px; } .framer-ZrI92 .framer-tdbkq7 > :last-child { margin-right: 0px; } }",
    "@media (min-width: 1200px) { .framer-ZrI92 .hidden-ei83m9 { display: none !important; } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .framer-ZrI92 .hidden-8y62k { display: none !important; } .${v.bodyClassName}-framer-ZrI92 { background: white; } .framer-ZrI92.framer-ei83m9 { width: 810px; }}`,
    `@media (max-width: 809px) { .framer-ZrI92 .hidden-toq88q { display: none !important; } .${v.bodyClassName}-framer-ZrI92 { background: white; } .framer-ZrI92.framer-ei83m9 { width: 390px; } .framer-ZrI92 .framer-tdbkq7 { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-ZrI92 .framer-tdbkq7 { gap: 0px; } .framer-ZrI92 .framer-tdbkq7 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-ZrI92 .framer-tdbkq7 > :first-child { margin-top: 0px; } .framer-ZrI92 .framer-tdbkq7 > :last-child { margin-bottom: 0px; } }}`,
  ],
  s = Y($, G, "framer-ZrI92"),
  ce = s;
s.displayName = "Toolbox_After_the_Intervention";
s.defaultProps = { height: 1050, width: 1200 };
j(s, [{ explicitInter: !0, fonts: [] }, ...S, ...A], {
  supportsExplicitInterCodegen: !0,
});
var fe = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FramerH5snp07v4",
      slots: [],
      annotations: {
        framerContractVersion: "1",
        framerResponsiveScreen: "",
        framerIntrinsicWidth: "1200",
        framerIntrinsicHeight: "1050",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"yRcs1myye":{"layout":["fixed","auto"]},"O2R29QjFO":{"layout":["fixed","auto"]}}}',
        framerDisplayContentsDiv: "false",
        framerComponentViewportWidth: "true",
        framerImmutableVariables: "true",
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { fe as __FramerMetadata__, ce as default };
