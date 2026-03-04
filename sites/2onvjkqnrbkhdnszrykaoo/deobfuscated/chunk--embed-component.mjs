/* CSS extracted to: chunk--embed-component.css */
/**
 * embed component
 */
import { containerStyle,
  placeholderStyle,
  useIsOnCanvas,
  fontConfig,
  linkPresetStyles,
  cssClassScope } from "./chunk--framer-components.mjs";
import { $ as y,
  useLocale,
  ControlType,
  addPropertyControls,
  cx,
  useDeviceSize,
  withCSS,
  ReactFragment,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useVariantState,
  jsx,
  jsxs,
  MotionContext,
  FrameComponent,
  RichTextComponent,
  motion,
  LayoutGroup,
  loadFonts,
  normalizeFontConfig } from "./chunk--react-and-framer-runtime.mjs";
import { window } from "./chunk--browser-polyfills.mjs";
function $({ type: t, url: r, html: o, style: a = {} }) {
  return t === "url" && r
    ? jsx(se, { url: r, style: a })
    : t === "html" && o
      ? jsx(ce, { html: o, style: a })
      : jsx(ie, { style: a });
}
addPropertyControls($, {
  type: {
    type: ControlType.Enum,
    defaultValue: "url",
    displaySegmentedControl: !0,
    options: ["url", "html"],
    optionTitles: ["URL", "HTML"],
  },
  url: {
    title: "URL",
    type: ControlType.String,
    description: "Some websites don\u2019t support embedding.",
    hidden(t) {
      return t.type !== "url";
    },
  },
  html: {
    title: "HTML",
    type: ControlType.String,
    displayTextArea: !0,
    hidden(t) {
      return t.type !== "html";
    },
  },
});
function ie({ style: t }) {
  return jsx("div", {
    style: { minHeight: te(t), ...placeholderStyle, overflow: "hidden", ...t },
    children: jsx("div", {
      style: _,
      children:
        "To embed a website or widget, add it to the properties\xA0panel.",
    }),
  });
}
function se({ url: t, style: r }) {
  let o = !r.height;
  /[a-z]+:\/\//.test(t) || (t = "https://" + t);
  let a = useIsOnCanvas(),
    [s, f] = useState(a ? void 0 : !1);
  if (
    (useEffect(() => {
      if (!a) return;
      let l = !0;
      f(void 0);
      async function p() {
        // Framer API dependency removed — skip iframe URL check.
        // In the exported site useIsOnCanvas() is always false,
        // so this code path is never reached. If it were, we
        // optimistically allow the embed (isBlocked = false).
        l && f(false);
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
    return jsx(k, {
      message: "URL embeds do not support auto height.",
      style: r,
    });
  if (!t.startsWith("https://"))
    return jsx(k, { message: "Unsupported protocol.", style: r });
  if (s === void 0) return jsx(de, {});
  if (s instanceof Error) return jsx(k, { message: s.message, style: r });
  if (s === !0) {
    let l = `Can\u2019t embed ${t} due to its content security policy.`;
    return jsx(k, { message: l, style: r });
  }
  return jsx("iframe", {
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
  let o = useRef(),
    a = useIsOnCanvas(),
    [s, f] = useState(0),
    l = !r.height,
    p = t.includes("<\/script>");
  if (
    (useEffect(() => {
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
        window.addEventListener("message", m),
        i?.postMessage("getEmbedHeight", "*"),
        () => {
          window.removeEventListener("message", m);
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
      jsx("iframe", { ref: o, style: i, srcDoc: n })
    );
  }
  return jsx("div", {
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
  return jsx("div", {
    className: "framerInternalUI-componentPlaceholder",
    style: { ...containerStyle, overflow: "hidden" },
    children: jsx("div", { style: _, children: "Loading\u2026" }),
  });
}
function k({ message: t, style: r }) {
  return jsx("div", {
    className: "framerInternalUI-errorPlaceholder",
    style: { minHeight: te(r), ...containerStyle, overflow: "hidden", ...r },
    children: jsx("div", { style: _, children: t }),
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
    let o = useContext(MotionContext),
      a = t ?? o.transition,
      s = useMemo(() => ({ ...o, transition: a }), [JSON.stringify(a)]);
    return jsx(MotionContext.Provider, { value: s, children: r });
  },
  ve = motion(ReactFragment),
  xe = ({ height: t, id: r, width: o, ...a }) => ({ ...a }),
  Ce = (t, r) =>
    t.layoutDependency ? r.join("-") + t.layoutDependency : r.join("-"),
  we = forwardRef(function (t, r) {
    let { activeLocale: o, setLocale: a } = useLocale(),
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
      } = useVariantState({
        cycleOrder: me,
        defaultVariant: "JCW3DAiCB",
        variant: p,
        variantClassNames: ue,
      }),
      d = Ce(t, N),
      ae = useRef(null),
      ne = useId(),
      oe = [cssClassScope],
      Me = useDeviceSize();
    return jsx(LayoutGroup, {
      id: l ?? ne,
      children: jsx(ve, {
        animate: N,
        initial: !1,
        children: jsx(be, {
          value: he,
          children: jsxs(motion.nav, {
            ...n,
            ...u,
            className: cx(pe, ...oe, "framer-1v447sb", f, m),
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
              jsx(y, {
                href: { webPageId: "augiA20Il" },
                openInNewTab: !0,
                children: jsx(FrameComponent, {
                  as: "a",
                  background: {
                    alt: "",
                    fit: "fill",
                    pixelHeight: 150,
                    pixelWidth: 142,
                    src: "./images/yf46j8ffmkzbqy8dqlcczeozitk.svg",
                  },
                  className: "framer-14v6odq framer-cee5wl",
                  "data-framer-name": "Logo",
                  layoutDependency: d,
                  layoutId: "kzNgDli2j",
                  whileHover: ge,
                }),
              }),
              jsxs(motion.div, {
                className: "framer-lg53ui",
                "data-framer-name": "Links",
                layoutDependency: d,
                layoutId: "toQUyBvN4",
                children: [
                  jsx(RichTextComponent, {
                    __fromCanvasComponent: !0,
                    children: jsx(ReactFragment, {
                      children: jsx(motion.p, {
                        style: {
                          "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                          "--framer-font-family":
                            '"Montserrat", "Montserrat Placeholder", sans-serif',
                          "--framer-font-size": "14px",
                          "--framer-font-weight": "500",
                          "--framer-text-color":
                            "var(--extracted-r6o4lv, rgb(33, 33, 33))",
                        },
                        children: jsx(y, {
                          href: { webPageId: "bzydBB85Y" },
                          openInNewTab: !1,
                          smoothScroll: !1,
                          children: jsx(motion.a, {
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
                  jsx(RichTextComponent, {
                    __fromCanvasComponent: !0,
                    children: jsx(ReactFragment, {
                      children: jsx(motion.p, {
                        style: {
                          "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                          "--framer-font-family":
                            '"Montserrat", "Montserrat Placeholder", sans-serif',
                          "--framer-font-size": "14px",
                          "--framer-font-weight": "500",
                          "--framer-text-color":
                            "var(--extracted-r6o4lv, rgb(33, 33, 33))",
                        },
                        children: jsx(y, {
                          href: { webPageId: "aLuYbVoBY" },
                          openInNewTab: !1,
                          smoothScroll: !1,
                          children: jsx(motion.a, {
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
                  jsx(y, {
                    href: { webPageId: "x05wlhCdy" },
                    children: jsx(motion.a, {
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
                      children: jsx(RichTextComponent, {
                        __fromCanvasComponent: !0,
                        children: jsx(ReactFragment, {
                          children: jsx(motion.p, {
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
    ...linkPresetStyles,
  ],
  V = withCSS(we, ke, "framer-chkuW"),
  _t = V;
V.displayName = "Nav";
V.defaultProps = { height: 60, width: 1200 };
loadFonts(
  V,
  [
    {
      explicitInter: !0,
      fonts: [
        {
          family: "Montserrat",
          source: "google",
          style: "normal",
          url: "./assets/fonts/montserrat-v26-latin-bold.woff2",
          weight: "500",
        },
      ],
    },
    ...normalizeFontConfig(fontConfig),
  ],
  { supportsExplicitInterCodegen: !0 },
);
export { $ as a, _t as useRef };
