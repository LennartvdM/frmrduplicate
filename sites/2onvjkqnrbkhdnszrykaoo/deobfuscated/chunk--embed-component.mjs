/**
 * embed component
 */
import {
  a as C,
  b as L,
  g as w,
  j as X,
  k as G,
  l as K,
} from "./chunk--framer-components.mjs";
import {
  $ as y,
  H as F,
  M as v,
  P as j,
  R as O,
  T as z,
  X as U,
  b as g,
  d as T,
  h as E,
  i as M,
  j as D,
  l as A,
  m as b,
  n as W,
  pa as Y,
  q as e,
  r as R,
  s as H,
  sa as q,
  ta as x,
  u as c,
  v as P,
  wa as B,
  ya as J,
} from "./chunk--react-and-framer-runtime.mjs";
import { c as h } from "./chunk--browser-polyfills.mjs";
function $({ type: t, url: r, html: o, style: a = {} }) {
  return t === "url" && r
    ? e(se, { url: r, style: a })
    : t === "html" && o
      ? e(ce, { html: o, style: a })
      : e(ie, { style: a });
}
j($, {
  type: {
    type: v.Enum,
    defaultValue: "url",
    displaySegmentedControl: !0,
    options: ["url", "html"],
    optionTitles: ["URL", "HTML"],
  },
  url: {
    title: "URL",
    type: v.String,
    description: "Some websites don\u2019t support embedding.",
    hidden(t) {
      return t.type !== "url";
    },
  },
  html: {
    title: "HTML",
    type: v.String,
    displayTextArea: !0,
    hidden(t) {
      return t.type !== "html";
    },
  },
});
function ie({ style: t }) {
  return e("div", {
    style: { minHeight: te(t), ...L, overflow: "hidden", ...t },
    children: e("div", {
      style: _,
      children:
        "To embed a website or widget, add it to the properties\xA0panel.",
    }),
  });
}
function se({ url: t, style: r }) {
  let o = !r.height;
  /[a-z]+:\/\//.test(t) || (t = "https://" + t);
  let a = w(),
    [s, f] = W(a ? void 0 : !1);
  if (
    (M(() => {
      if (!a) return;
      let l = !0;
      f(void 0);
      async function p() {
        let n = await fetch(
          "https://api.framer.com/functions/check-iframe-url?url=" +
            encodeURIComponent(t),
        );
        if (n.status == 200) {
          let { isBlocked: i } = await n.json();
          l && f(i);
        } else {
          let i = await n.text();
          console.error(i);
          let m = new Error("This site can\u2019t be reached.");
          f(m);
        }
      }
      return (
        p().catch((n) => {
          (console.error(n), f(n));
        }),
        () => {
          l = !1;
        }
      );
    }, [t]),
    a && o)
  )
    return e(k, {
      message: "URL embeds do not support auto height.",
      style: r,
    });
  if (!t.startsWith("https://"))
    return e(k, { message: "Unsupported protocol.", style: r });
  if (s === void 0) return e(de, {});
  if (s instanceof Error) return e(k, { message: s.message, style: r });
  if (s === !0) {
    let l = `Can\u2019t embed ${t} due to its content security policy.`;
    return e(k, { message: l, style: r });
  }
  return e("iframe", {
    src: t,
    style: { ...ee, ...r },
    loading: "lazy",
    fetchPriority: a ? "low" : "auto",
    referrerPolicy: "no-referrer",
    sandbox: le(a),
  });
}
var ee = { width: "100%", height: "100%", border: "none" };
function le(t) {
  let r = ["allow-same-origin", "allow-scripts"];
  return (
    t ||
      r.push(
        "allow-downloads",
        "allow-forms",
        "allow-modals",
        "allow-orientation-lock",
        "allow-pointer-lock",
        "allow-popups",
        "allow-popups-to-escape-sandbox",
        "allow-presentation",
        "allow-storage-access-by-user-activation",
        "allow-top-navigation-by-user-activation",
      ),
    r.join(" ")
  );
}
function ce({ html: t, style: r }) {
  let o = b(),
    a = w(),
    [s, f] = W(0),
    l = !r.height,
    p = t.includes("<\/script>");
  if (
    (M(() => {
      var n;
      let i =
        (n = o.current) === null || n === void 0 ? void 0 : n.contentWindow;
      function m(S) {
        if (S.source !== i) return;
        let u = S.data;
        if (typeof u != "object" || u === null) return;
        let I = u.embedHeight;
        typeof I == "number" && f(I);
      }
      return (
        h.addEventListener("message", m),
        i?.postMessage("getEmbedHeight", "*"),
        () => {
          h.removeEventListener("message", m);
        }
      );
    }, []),
    p)
  ) {
    let n = `<html>
    <head>
        <style>body { margin: 0; }</style>
    </head>
    <body>
        ${t}
        <script type="module">
            let height = 0

            function sendEmbedHeight() {
                window.parent.postMessage({
                    embedHeight: height
                }, "*")
            }

            const observer = new ResizeObserver((entries) => {
                if (entries.length !== 1) return
                const entry = entries[0]
                if (entry.target !== document.body) return

                height = entry.contentRect.height
                sendEmbedHeight()
            })

            observer.observe(document.body)

            window.addEventListener("message", (event) => {
                if (event.source !== window.parent) return
                if (event.data !== "getEmbedHeight") return
                sendEmbedHeight()
            })
        <\/script>
    <body>
</html>`,
      i = { ...ee, ...r };
    return (
      l && (i.height = s + "px"),
      e("iframe", { ref: o, style: i, srcDoc: n })
    );
  }
  return e("div", {
    style: { ...fe, ...r },
    dangerouslySetInnerHTML: { __html: t },
  });
}
var fe = {
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
};
function de() {
  return e("div", {
    className: "framerInternalUI-componentPlaceholder",
    style: { ...C, overflow: "hidden" },
    children: e("div", { style: _, children: "Loading\u2026" }),
  });
}
function k({ message: t, style: r }) {
  return e("div", {
    className: "framerInternalUI-errorPlaceholder",
    style: { minHeight: te(r), ...C, overflow: "hidden", ...r },
    children: e("div", { style: _, children: t }),
  });
}
var _ = { textAlign: "center", minWidth: 140 };
function te(t) {
  if (!t.height) return 200;
}
var me = ["JCW3DAiCB"],
  pe = "framer-chkuW",
  ue = { JCW3DAiCB: "framer-v-1v447sb" };
var he = { damping: 60, delay: 0, mass: 1, stiffness: 500, type: "spring" /* physics-based spring animation */ },
  re = { damping: 30, delay: 0, mass: 1, stiffness: 400, type: "spring" /* physics-based spring animation */ },
  ge = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.1,
    skewX: 0,
    skewY: 0,
    transition: re,
  },
  ye = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.05,
    skewX: 0,
    skewY: 0,
    transition: re,
  },
  be = ({ value: t, children: r }) => {
    let o = E(H),
      a = t ?? o.transition,
      s = A(() => ({ ...o, transition: a }), [JSON.stringify(a)]);
    return e(H.Provider, { value: s, children: r });
  },
  ve = c(g),
  xe = ({ height: t, id: r, width: o, ...a }) => ({ ...a }),
  Ce = (t, r) =>
    t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  we = T(function (t, r) {
    let { activeLocale: o, setLocale: a } = F(),
      { style: s, className: f, layoutId: l, variant: p, ...n } = xe(t),
      {
        baseVariant: i,
        classNames: m,
        clearLoadingGesture: S,
        gestureHandlers: u,
        gestureVariant: I,
        isLoading: Ve,
        setGestureState: Se,
        setVariant: Ie,
        variants: N,
      } = Y({
        cycleOrder: me,
        defaultVariant: "JCW3DAiCB",
        variant: p,
        variantClassNames: ue,
      }),
      d = Ce(t, N),
      ae = b(null),
      ne = D(),
      oe = [K],
      Me = z();
    return e(P, {
      id: l ?? ne,
      children: e(ve, {
        animate: N,
        initial: !1,
        children: e(be, {
          value: he,
          children: R(c.nav, {
            ...n,
            ...u,
            className: O(pe, ...oe, "framer-1v447sb", f, m),
            "data-framer-name": "Variant 1",
            layoutDependency: d,
            layoutId: "JCW3DAiCB",
            ref: r ?? ae,
            style: {
              backgroundColor: "rgb(255, 255, 255)",
              boxShadow: "0px 2px 2px 0px rgba(0, 0, 0, 0.2)",
              ...s,
            },
            children: [
              e(y, {
                href: { webPageId: "augiA20Il" },
                openInNewTab: !0,
                children: e(q, {
                  as: "a",
                  background: {
                    alt: "",
                    fit: "fill",
                    pixelHeight: 150,
                    pixelWidth: 142,
                    src: "https://framerusercontent.com/images/YF46j8fFMKZbQy8dqlCCzeOzItk.svg",
                  },
                  className: "framer-14v6odq framer-cee5wl",
                  "data-framer-name": "Logo",
                  layoutDependency: d,
                  layoutId: "kzNgDli2j",
                  whileHover: ge,
                }),
              }),
              R(c.div, {
                className: "framer-lg53ui",
                "data-framer-name": "Links",
                layoutDependency: d,
                layoutId: "toQUyBvN4",
                children: [
                  e(x, {
                    __fromCanvasComponent: !0,
                    children: e(g, {
                      children: e(c.p, {
                        style: {
                          "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                          "--framer-font-family":
                            '"Montserrat", "Montserrat Placeholder", sans-serif',
                          "--framer-font-size": "14px",
                          "--framer-font-weight": "500",
                          "--framer-text-color":
                            "var(--extracted-r6o4lv, rgb(33, 33, 33))",
                        },
                        children: e(y, {
                          href: { webPageId: "bzydBB85Y" },
                          openInNewTab: !1,
                          smoothScroll: !1,
                          children: e(c.a, {
                            className: "framer-styles-preset-b5e6zr",
                            "data-styles-preset": "H9WgrbXMf",
                            children: "Neoflix",
                          }),
                        }),
                      }),
                    }),
                    className: "framer-bfa9yp",
                    "data-framer-name": "Reflection",
                    fonts: ["GF;Montserrat-500"],
                    layoutDependency: d,
                    layoutId: "lb639xMPV",
                    style: { "--extracted-r6o4lv": "rgb(33, 33, 33)" },
                    verticalAlignment: "top",
                    withExternalLayout: !0,
                  }),
                  e(x, {
                    __fromCanvasComponent: !0,
                    children: e(g, {
                      children: e(c.p, {
                        style: {
                          "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                          "--framer-font-family":
                            '"Montserrat", "Montserrat Placeholder", sans-serif',
                          "--framer-font-size": "14px",
                          "--framer-font-weight": "500",
                          "--framer-text-color":
                            "var(--extracted-r6o4lv, rgb(33, 33, 33))",
                        },
                        children: e(y, {
                          href: { webPageId: "aLuYbVoBY" },
                          openInNewTab: !1,
                          smoothScroll: !1,
                          children: e(c.a, {
                            className: "framer-styles-preset-b5e6zr",
                            "data-styles-preset": "H9WgrbXMf",
                            children: "Publications",
                          }),
                        }),
                      }),
                    }),
                    className: "framer-38cvqr",
                    "data-framer-name": "Publications",
                    fonts: ["GF;Montserrat-500"],
                    layoutDependency: d,
                    layoutId: "qLwYpwiQm",
                    style: { "--extracted-r6o4lv": "rgb(33, 33, 33)" },
                    verticalAlignment: "top",
                    withExternalLayout: !0,
                  }),
                  e(y, {
                    href: { webPageId: "x05wlhCdy" },
                    children: e(c.a, {
                      className: "framer-pklntu framer-cee5wl",
                      layoutDependency: d,
                      layoutId: "YhKLaMXjz",
                      style: {
                        backgroundColor:
                          "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                        borderBottomLeftRadius: 128,
                        borderBottomRightRadius: 128,
                        borderTopLeftRadius: 128,
                        borderTopRightRadius: 128,
                      },
                      whileHover: ye,
                      children: e(x, {
                        __fromCanvasComponent: !0,
                        children: e(g, {
                          children: e(c.p, {
                            style: {
                              "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                              "--framer-font-family":
                                '"Montserrat", "Montserrat Placeholder", sans-serif',
                              "--framer-font-size": "14px",
                              "--framer-font-weight": "500",
                              "--framer-text-color":
                                "var(--extracted-r6o4lv, var(--token-d076bbbf-e059-45dd-8d76-40c9c3daac97, rgba(245, 249, 252, 0.9)))",
                            },
                            children: "Toolbox",
                          }),
                        }),
                        className: "framer-42p1at",
                        "data-framer-name": "Toolbox",
                        fonts: ["GF;Montserrat-500"],
                        layoutDependency: d,
                        layoutId: "ZV41p8K9t",
                        style: {
                          "--extracted-r6o4lv":
                            "var(--token-d076bbbf-e059-45dd-8d76-40c9c3daac97, rgba(245, 249, 252, 0.9))",
                        },
                        verticalAlignment: "top",
                        withExternalLayout: !0,
                      }),
                    }),
                  }),
                ],
              }),
            ],
          }),
        }),
      }),
    });
  }),
  ke = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-chkuW.framer-cee5wl, .framer-chkuW .framer-cee5wl { display: block; }",
    ".framer-chkuW.framer-1v447sb { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: nowrap; height: 60px; justify-content: space-between; overflow: hidden; padding: 24px 40px 24px 24px; position: relative; width: 1200px; }",
    ".framer-chkuW .framer-14v6odq { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 40px; justify-content: center; overflow: visible; padding: 0px; position: relative; text-decoration: none; width: 40px; }",
    ".framer-chkuW .framer-lg53ui { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }",
    ".framer-chkuW .framer-bfa9yp, .framer-chkuW .framer-38cvqr { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }",
    ".framer-chkuW .framer-pklntu { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 2px 11px 2px 11px; position: relative; text-decoration: none; width: min-content; z-index: 0; }",
    ".framer-chkuW .framer-42p1at { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; z-index: 10; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-chkuW .framer-14v6odq, .framer-chkuW .framer-lg53ui, .framer-chkuW .framer-pklntu { gap: 0px; } .framer-chkuW .framer-14v6odq > *, .framer-chkuW .framer-pklntu > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-chkuW .framer-14v6odq > :first-child, .framer-chkuW .framer-lg53ui > :first-child, .framer-chkuW .framer-pklntu > :first-child { margin-left: 0px; } .framer-chkuW .framer-14v6odq > :last-child, .framer-chkuW .framer-lg53ui > :last-child, .framer-chkuW .framer-pklntu > :last-child { margin-right: 0px; } .framer-chkuW .framer-lg53ui > * { margin: 0px; margin-left: calc(20px / 2); margin-right: calc(20px / 2); } }",
    ...G,
  ],
  V = U(we, ke, "framer-chkuW"),
  _t = V;
V.displayName = "Nav";
V.defaultProps = { height: 60, width: 1200 };
B(
  V,
  [
    {
      explicitInter: !0,
      fonts: [
        {
          family: "Montserrat",
          source: "google",
          style: "normal",
          url: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew7Y3tcoqK5.woff2",
          weight: "500",
        },
      ],
    },
    ...J(X),
  ],
  { supportsExplicitInterCodegen: !0 },
);
export { $ as a, _t as b };
