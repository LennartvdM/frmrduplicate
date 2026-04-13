/**
 * framer components
 */
import { RenderTarget,
  ControlType,
  useIsOnFramerCanvas,
  useEffect,
  useMemo,
  fontLoader } from "./chunk--react-and-framer-runtime.mjs";
import { navigator } from "./chunk--browser-polyfills.mjs";
fontLoader.loadFonts([]);
var M = [{ explicitInter: true, fonts: [] }],
  R = [
    '.framer-VnG2h .framer-styles-preset-b5e6zr:not(.rich-text-wrapper), .framer-VnG2h .framer-styles-preset-b5e6zr.rich-text-wrapper a { --framer-link-current-text-color: var(--token-3f355627-0701-4163-9212-31117bae3b68, #72c2c2) /* {"name":"Bar Green"} */; --framer-link-current-text-decoration: none; --framer-link-hover-text-color: var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, #529c9c) /* {"name":"Text Highlight"} */; --framer-link-hover-text-decoration: underline; --framer-link-text-color: #574b4b; --framer-link-text-decoration: none; }',
  ],
  k = "framer-VnG2h";
var C = {
    position: "relative",
    width: "100%",
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  E = {
    ...C,
    borderRadius: 6,
    background: "rgba(136, 85, 255, 0.3)",
    color: "#85F",
    border: "1px dashed #85F",
    flexDirection: "column",
  },
  w = {
    onClick: { type: ControlType.EventHandler },
    onMouseEnter: { type: ControlType.EventHandler },
    onMouseLeave: { type: ControlType.EventHandler },
  },
  B = {
    type: ControlType.Number,
    title: "Font Size",
    min: 2,
    max: 200,
    step: 1,
    displayStepper: true,
  },
  I = {
    font: {
      type: ControlType.Boolean,
      title: "Font",
      defaultValue: false,
      disabledTitle: "Default",
      enabledTitle: "Custom",
    },
    fontFamily: {
      type: ControlType.String,
      title: "Family",
      placeholder: "Inter",
      hidden: ({ font: t }) => !t,
    },
    fontWeight: {
      type: ControlType.Enum,
      title: "Weight",
      options: [100, 200, 300, 400, 500, 600, 700, 800, 900],
      optionTitles: [
        "Thin",
        "Extra-light",
        "Light",
        "Regular",
        "Medium",
        "Semi-bold",
        "Bold",
        "Extra-bold",
        "Black",
      ],
      hidden: ({ font: t }) => !t,
    },
  };
function L(t, o) {
  return g(true, t, o);
}
function N(t, o) {
  return g(false, t, o);
}
function g(t, o, u = true) {
  let c = useIsOnFramerCanvas();
  useEffect(() => {
    u && c === t && o();
  }, [c]);
}
var x = () => {
    if (typeof navigator < "u") {
      let t = navigator.userAgent.toLowerCase();
      return (
        (t.indexOf("safari") > -1 ||
          t.indexOf("framermobile") > -1 ||
          t.indexOf("framerx") > -1) &&
        t.indexOf("chrome") < 0
      );
    } else return false;
  },
  U = () => useMemo(() => x(), []);
function J() {
  return useMemo(() => RenderTarget.current() === RenderTarget.canvas, []);
}
function ee(t) {
  let {
    borderRadius: o,
    isMixedBorderRadius: u,
    topLeftRadius: c,
    topRightRadius: p,
    bottomRightRadius: m,
    bottomLeftRadius: f,
  } = t;
  return useMemo(
    () => (u ? `${c}px ${p}px ${m}px ${f}px` : `${o}px`),
    [o, u, c, p, m, f],
  );
}
var te = {
  borderRadius: {
    title: "Radius",
    type: ControlType.FusedNumber,
    toggleKey: "isMixedBorderRadius",
    toggleTitles: ["Radius", "Radius per corner"],
    valueKeys: [
      "topLeftRadius",
      "topRightRadius",
      "bottomRightRadius",
      "bottomLeftRadius",
    ],
    valueLabels: ["TL", "TR", "BR", "BL"],
    min: 0,
  },
};
var ne = {
  padding: {
    type: ControlType.FusedNumber,
    toggleKey: "paddingPerSide",
    toggleTitles: ["Padding", "Padding per side"],
    valueKeys: ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"],
    valueLabels: ["T", "R", "B", "L"],
    min: 0,
    title: "Padding",
  },
};
export {
  C as a,
  E as b,
  w as c,
  L as fontLoader,
  N as navigator,
  U as f,
  J as g,
  ee as useIsOnFramerCanvas,
  te as useEffect,
  M as j,
  R as k,
  k as RenderTarget,
};
