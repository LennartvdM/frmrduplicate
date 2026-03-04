/**
 * Import aliases resolved:
 *   ee → SmoothScrollComponent
 *   re → NoiseOverlayComponent
 *   ae → NavItemComponent
 *   _e → interMediumFontDefs
 *   je → interMediumPresetCSS
 *   Ue → interMediumCSSScope
 *   Fe → interExtraBoldFontDefs
 *   ze → interExtraBoldPresetCSS
 *   Te → interExtraBoldCSSScope
 *   Ce → fontConfig
 *   Ne → linkPresetStyles
 *   Re → cssClassScope
 *   pe → useRoute
 *   D → useLocale
 *   w → resolveLinks
 *   ue → ControlType
 *   ge → addPropertyControls
 *   T → cx
 *   ye → useDeviceSize
 *   t → DeviceSizeContainer
 *   p → cssSSRMinifiedHelper
 *   M → withCSS
 *   xe → registerCursors
 *   ke → CursorContext
 *   o → ReactFragment
 *   I → PropertyOverridesProvider
 *   C → withScrollSection
 *   V → forwardRef
 *   ce → useContext
 *   fe → useEffect
 *   B → useId
 *   de → useInsertionEffect
 *   he → useMemo
 *   be → useVariantState
 *   k → useRef
 *   ve → useVariantState
 *   e → jsx
 *   r → jsxs
 *   we → fontLoader
 *   Q → MotionContext
 *   m → RichTextComponent
 *   s → motion
 *   L → LayoutGroup
 *   Ie → SVGComponent
 *   O → loadFonts
 *   b → getFonts
 *   P → normalizeFontConfig
 */
import { SmoothScrollComponent,
  NoiseOverlayComponent,
  NavItemComponent,
  interMediumFontDefs,
  interMediumPresetCSS,
  interMediumCSSScope,
  interExtraBoldFontDefs,
  interExtraBoldPresetCSS,
  interExtraBoldCSSScope } from "./chunk--shared-components.mjs";
import { a as c } from "./chunk-4R3P5DN4.mjs";
import { fontConfig,
  linkPresetStyles,
  cssClassScope } from "./chunk--framer-components.mjs";
import "./chunk-42U43NKG.mjs";
import { $ as a,
  useRoute,
  useLocale,
  resolveLinks,
  ControlType,
  addPropertyControls,
  cx,
  useDeviceSize,
  DeviceSizeContainer,
  cssSSRMinifiedHelper,
  withCSS,
  registerCursors,
  CursorContext,
  ReactFragment,
  PropertyOverridesProvider,
  withScrollSection,
  forwardRef,
  useContext,
  useEffect,
  useId,
  useInsertionEffect,
  useMemo,
  useVariantState,
  useRef,
  useVariantState,
  jsx,
  qa as $,
  jsxs,
  fontLoader,
  MotionContext,
  RichTextComponent,
  motion,
  LayoutGroup,
  SVGComponent,
  loadFonts,
  getFonts,
  normalizeFontConfig } from "./chunk--react-and-framer-runtime.mjs";
import { a as Y } from "./chunk-QPIK4HVB.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
var Ye = b(c),
  Ze = b(re),
  We = [
    "Rre_u8WuV",
    "DkxmDygok",
    "eMNO9x2r7",
    "tcTKLfIBw",
    "sJR17n1rz",
    "gRcraNE8T",
  ],
  He = "framer-v0tbV",
  Ke = {
    DkxmDygok: "framer-v-92htoe",
    eMNO9x2r7: "framer-v-1d3z733",
    gRcraNE8T: "framer-v-2ke98f",
    Rre_u8WuV: "framer-v-1ewt70r",
    sJR17n1rz: "framer-v-1evn86j",
    tcTKLfIBw: "framer-v-424790",
  };
function Pe(f, ...n) {
  let u = {};
  return (n?.forEach((d) => d && Object.assign(u, f[d])), u);
}
var Xe = { delay: 0, duration: 0.4, ease: [0.44, 0, 0.56, 1], type: "tween" /* CSS-like easing animation */ },
  Ge = ({ value: f, children: n }) => {
    let u = useContext(Q),
      d = f ?? u.transition,
      g = useMemo(() => ({ ...u, transition: d }), [JSON.stringify(d)]);
    return e(Q.Provider, { value: g, children: n });
  },
  Je = s(o),
  Qe = {
    Cost: "tcTKLfIBw",
    Dance: "DkxmDygok",
    Perspective: "gRcraNE8T",
    Skills: "eMNO9x2r7",
    Team: "sJR17n1rz",
    Time: "Rre_u8WuV",
  },
  $e = ({ height: f, id: n, width: u, ...d }) => {
    var g, y;
    return {
      ...d,
      variant:
        (y = (g = Qe[d.variant]) !== null && g !== void 0 ? g : d.variant) !==
          null && y !== void 0
          ? y
          : "Rre_u8WuV",
    };
  },
  er = (f, n) =>
    f.layoutDependency ? n.join("-") + f.layoutDependency : n.join("-"),
  rr = V(function (f, n) {
    let { activeLocale: u, setLocale: d } = D(),
      { style: g, className: y, layoutId: v, variant: W, ...H } = $e(f),
      {
        baseVariant: h,
        classNames: ie,
        gestureHandlers: se,
        gestureVariant: E,
        setGestureState: R,
        setVariant: ne,
        variants: _,
      } = useVariantState({
        cycleOrder: We,
        defaultVariant: "Rre_u8WuV",
        variant: W,
        variantClassNames: Ke,
      }),
      l = er(f, _),
      j = k(null),
      S = () => h !== "sJR17n1rz",
      U = () => h === "sJR17n1rz",
      K = () => h === "eMNO9x2r7",
      F = () => !["eMNO9x2r7", "sJR17n1rz", "gRcraNE8T"].includes(h),
      X = () => !["sJR17n1rz", "gRcraNE8T"].includes(h),
      z = B(),
      G = [],
      A = useDeviceSize();
    return e(L, {
      id: v ?? z,
      children: e(Je, {
        animate: _,
        initial: !1,
        children: e(Ge, {
          value: Xe,
          children: r(s.div, {
            ...H,
            ...se,
            className: T(He, ...G, "framer-1ewt70r", y, ie),
            "data-framer-name": "Time",
            layoutDependency: l,
            layoutId: "Rre_u8WuV",
            ref: n ?? j,
            style: { ...g },
            ...Pe(
              {
                DkxmDygok: { "data-framer-name": "Dance" },
                eMNO9x2r7: { "data-framer-name": "Skills" },
                gRcraNE8T: { "data-framer-name": "Perspective" },
                sJR17n1rz: { "data-framer-name": "Team" },
                tcTKLfIBw: { "data-framer-name": "Cost" },
              },
              h,
              E,
            ),
            children: [
              S() &&
                e(s.div, {
                  background: {
                    alt: "",
                    fit: "fill",
                    intrinsicHeight: 600,
                    intrinsicWidth: 800,
                  },
                  className: "framer-1h9hgau",
                  "data-framer-name": "Six",
                  layoutDependency: l,
                  layoutId: "eU92XqQwC",
                  children: e(t, {
                    children: e(s.div, {
                      className: "framer-1qcn6wb-container",
                      layoutDependency: l,
                      layoutId: "EumH2pnmK-container",
                      children: e(c, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderRadius: 0,
                        bottomLeftRadius: 0,
                        bottomRightRadius: 0,
                        controls: !1,
                        height: "100%",
                        id: "EumH2pnmK",
                        isMixedBorderRadius: !1,
                        layoutId: "EumH2pnmK",
                        loop: !0,
                        muted: !0,
                        objectFit: "cover",
                        playing: !0,
                        posterEnabled: !1,
                        srcFile:
                          "https://framerusercontent.com/assets/3KRVWM0969ThuiryJ2Na4KdAuw.webm",
                        srcType: "Upload",
                        srcUrl:
                          "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                        startTime: 0,
                        style: { height: "100%", width: "100%" },
                        topLeftRadius: 0,
                        topRightRadius: 0,
                        volume: 25,
                        width: "100%",
                      }),
                    }),
                  }),
                }),
              U() &&
                e(s.div, {
                  background: {
                    alt: "",
                    fit: "fill",
                    intrinsicHeight: 600,
                    intrinsicWidth: 800,
                  },
                  className: "framer-o9c2ut",
                  "data-framer-name": "Five",
                  layoutDependency: l,
                  layoutId: "BPDy0EIjX",
                  children: e(t, {
                    children: e(s.div, {
                      className: "framer-7mze90-container",
                      layoutDependency: l,
                      layoutId: "Q4Ut8FyxB-container",
                      children: e(c, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderRadius: 0,
                        bottomLeftRadius: 0,
                        bottomRightRadius: 0,
                        controls: !1,
                        height: "100%",
                        id: "Q4Ut8FyxB",
                        isMixedBorderRadius: !1,
                        layoutId: "Q4Ut8FyxB",
                        loop: !0,
                        muted: !0,
                        objectFit: "cover",
                        playing: !0,
                        posterEnabled: !1,
                        srcFile:
                          "https://framerusercontent.com/assets/NWFWQm9VeBbWCrqKomUJfkkMA.webm",
                        srcType: "Upload",
                        srcUrl:
                          "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                        startTime: 0,
                        style: { height: "100%", width: "100%" },
                        topLeftRadius: 0,
                        topRightRadius: 0,
                        volume: 25,
                        width: "100%",
                      }),
                    }),
                  }),
                }),
              K() &&
                e(s.div, {
                  background: {
                    alt: "",
                    fit: "fill",
                    intrinsicHeight: 600,
                    intrinsicWidth: 800,
                  },
                  className: "framer-1fk9uar",
                  "data-framer-name": "Four",
                  layoutDependency: l,
                  layoutId: "dHStQykAp",
                  children: e(t, {
                    children: e(s.div, {
                      className: "framer-uoewgw-container",
                      layoutDependency: l,
                      layoutId: "Ocb0EpzC7-container",
                      children: e(c, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderRadius: 0,
                        bottomLeftRadius: 0,
                        bottomRightRadius: 0,
                        controls: !1,
                        height: "100%",
                        id: "Ocb0EpzC7",
                        isMixedBorderRadius: !1,
                        layoutId: "Ocb0EpzC7",
                        loop: !0,
                        muted: !0,
                        objectFit: "cover",
                        playing: !0,
                        posterEnabled: !1,
                        srcFile:
                          "https://framerusercontent.com/assets/jm9eE97tcdcEFSStDS6W6jp0e1w.webm",
                        srcType: "Upload",
                        srcUrl:
                          "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                        startTime: 0,
                        style: { height: "100%", width: "100%" },
                        topLeftRadius: 0,
                        topRightRadius: 0,
                        volume: 25,
                        width: "100%",
                      }),
                    }),
                  }),
                }),
              F() &&
                e(s.div, {
                  background: {
                    alt: "",
                    fit: "fill",
                    intrinsicHeight: 600,
                    intrinsicWidth: 800,
                  },
                  className: "framer-7d7u5f",
                  "data-framer-name": "Three",
                  layoutDependency: l,
                  layoutId: "jNKdLtv4F",
                  children: e(t, {
                    children: e(s.div, {
                      className: "framer-iinprr-container",
                      layoutDependency: l,
                      layoutId: "kFS3ppAvv-container",
                      children: e(c, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderRadius: 0,
                        bottomLeftRadius: 0,
                        bottomRightRadius: 0,
                        controls: !1,
                        height: "100%",
                        id: "kFS3ppAvv",
                        isMixedBorderRadius: !1,
                        layoutId: "kFS3ppAvv",
                        loop: !0,
                        muted: !0,
                        objectFit: "cover",
                        playing: !0,
                        posterEnabled: !1,
                        srcFile:
                          "https://framerusercontent.com/assets/Td3yuMpa2nfPPlQmXPZ9jlbJyM.webm",
                        srcType: "Upload",
                        srcUrl:
                          "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                        startTime: 0,
                        style: { height: "100%", width: "100%" },
                        topLeftRadius: 0,
                        topRightRadius: 0,
                        volume: 25,
                        width: "100%",
                      }),
                    }),
                  }),
                }),
              X() &&
                e(s.div, {
                  background: {
                    alt: "",
                    fit: "fill",
                    intrinsicHeight: 600,
                    intrinsicWidth: 800,
                  },
                  className: "framer-zpq5vh",
                  "data-framer-name": "Two",
                  layoutDependency: l,
                  layoutId: "e5OwLlH31",
                  style: { opacity: 1 },
                  variants: {
                    eMNO9x2r7: { opacity: 0 },
                    tcTKLfIBw: { opacity: 0 },
                  },
                  children: e(t, {
                    children: e(s.div, {
                      className: "framer-foyl56-container",
                      layoutDependency: l,
                      layoutId: "NRZzc9_Zy-container",
                      children: e(c, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderRadius: 0,
                        bottomLeftRadius: 0,
                        bottomRightRadius: 0,
                        controls: !1,
                        height: "100%",
                        id: "NRZzc9_Zy",
                        isMixedBorderRadius: !1,
                        layoutId: "NRZzc9_Zy",
                        loop: !0,
                        muted: !0,
                        objectFit: "cover",
                        playing: !0,
                        posterEnabled: !1,
                        srcFile:
                          "https://framerusercontent.com/assets/nwkGJaoCYeLPIfxMZrvXBowWIus.webm",
                        srcType: "Upload",
                        srcUrl:
                          "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                        startTime: 0,
                        style: { height: "100%", width: "100%" },
                        topLeftRadius: 0,
                        topRightRadius: 0,
                        volume: 25,
                        width: "100%",
                      }),
                    }),
                  }),
                }),
              e(s.div, {
                background: {
                  alt: "",
                  fit: "fill",
                  intrinsicHeight: 600,
                  intrinsicWidth: 800,
                },
                className: "framer-1xyvsbf",
                "data-framer-name": "One",
                layoutDependency: l,
                layoutId: "bum8s_tcv",
                style: { opacity: 1 },
                variants: {
                  DkxmDygok: { opacity: 0 },
                  eMNO9x2r7: { opacity: 0 },
                  gRcraNE8T: { opacity: 0 },
                  sJR17n1rz: { opacity: 0 },
                  tcTKLfIBw: { opacity: 0 },
                },
                children:
                  S() &&
                  e(t, {
                    children: e(s.div, {
                      className: "framer-33vwgr-container",
                      layoutDependency: l,
                      layoutId: "DRu3_2xH9-container",
                      children: e(c, {
                        backgroundColor: "rgba(0, 0, 0, 0)",
                        borderRadius: 0,
                        bottomLeftRadius: 0,
                        bottomRightRadius: 0,
                        controls: !1,
                        height: "100%",
                        id: "DRu3_2xH9",
                        isMixedBorderRadius: !1,
                        layoutId: "DRu3_2xH9",
                        loop: !0,
                        muted: !0,
                        objectFit: "cover",
                        playing: !0,
                        posterEnabled: !1,
                        srcFile:
                          "https://framerusercontent.com/assets/nwkGJaoCYeLPIfxMZrvXBowWIus.webm",
                        srcType: "Upload",
                        srcUrl:
                          "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                        startTime: 0,
                        style: { height: "100%", width: "100%" },
                        topLeftRadius: 0,
                        topRightRadius: 0,
                        volume: 25,
                        width: "100%",
                        ...Pe(
                          {
                            DkxmDygok: { srcFile: void 0 },
                            gRcraNE8T: {
                              srcFile:
                                "https://framerusercontent.com/assets/79AjxJOlJJurDtgiqVvuGW34pAI.webm",
                            },
                          },
                          h,
                          E,
                        ),
                      }),
                    }),
                  }),
              }),
              e(s.div, {
                className: "framer-pq83k9",
                "data-framer-name": "Noise Blending",
                layoutDependency: l,
                layoutId: "okOOF1hn2",
                children: e(t, {
                  children: e(s.div, {
                    className: "framer-1d40tbl-container",
                    layoutDependency: l,
                    layoutId: "d4DRh0AXt-container",
                    children: e(NoiseOverlayComponent, {
                      backgroundSize: 64,
                      borderRadius: 0,
                      height: "100%",
                      id: "d4DRh0AXt",
                      layoutId: "d4DRh0AXt",
                      opacity: 0.1,
                      style: { height: "100%", width: "100%" },
                      width: "100%",
                    }),
                  }),
                }),
              }),
            ],
          }),
        }),
      }),
    });
  }),
  ar = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-v0tbV.framer-12qjzrj, .framer-v0tbV .framer-12qjzrj { display: block; }",
    ".framer-v0tbV.framer-1ewt70r { height: 600px; overflow: hidden; position: relative; width: 800px; }",
    ".framer-v0tbV .framer-1h9hgau, .framer-v0tbV .framer-1qcn6wb-container, .framer-v0tbV .framer-o9c2ut, .framer-v0tbV .framer-7mze90-container, .framer-v0tbV .framer-1fk9uar, .framer-v0tbV .framer-uoewgw-container, .framer-v0tbV .framer-7d7u5f, .framer-v0tbV .framer-iinprr-container, .framer-v0tbV .framer-foyl56-container, .framer-v0tbV .framer-33vwgr-container, .framer-v0tbV .framer-1d40tbl-container { bottom: 0px; flex: none; left: 0px; position: absolute; right: 0px; top: 0px; }",
    ".framer-v0tbV .framer-zpq5vh { bottom: 0px; flex: none; left: 0px; overflow: visible; position: absolute; right: 0px; top: 0px; }",
    ".framer-v0tbV .framer-1xyvsbf { bottom: 0px; flex: none; left: 0px; overflow: hidden; position: absolute; right: 0px; top: 0px; }",
    ".framer-v0tbV .framer-pq83k9 { bottom: 0px; flex: none; left: 0px; mix-blend-mode: screen; overflow: visible; position: absolute; right: 0px; top: 0px; }",
  ],
  q = M(rr, ar, "framer-v0tbV"),
  te = q;
q.displayName = "Backdrop";
q.defaultProps = { height: 600, width: 800 };
addPropertyControls(q, {
  variant: {
    options: [
      "Rre_u8WuV",
      "DkxmDygok",
      "eMNO9x2r7",
      "tcTKLfIBw",
      "sJR17n1rz",
      "gRcraNE8T",
    ],
    optionTitles: ["Time", "Dance", "Skills", "Cost", "Team", "Perspective"],
    title: "Variant",
    type: ControlType.Enum,
  },
});
O(q, [{ explicitInter: !0, fonts: [] }, ...Ye, ...Ze], {
  supportsExplicitInterCodegen: !0,
});
fontLoader.loadFonts([]);
var Ae = [{ explicitInter: !0, fonts: [] }],
  Ve = [
    ".framer-1BPWo .framer-styles-preset-1wicq5s:not(.rich-text-wrapper), .framer-1BPWo .framer-styles-preset-1wicq5s.rich-text-wrapper a { --framer-link-current-text-color: var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, #383437); --framer-link-current-text-decoration: none; --framer-link-hover-text-color: var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, #529c9c); --framer-link-hover-text-decoration: underline; --framer-link-text-color: var(--token-13b5b450-71c4-4161-9a24-7b5eae77301e, #00333b); --framer-link-text-decoration: none; }",
  ],
  Be = "framer-1BPWo";
var ir = b(SmoothScrollComponent),
  sr = b(te),
  nr = $(te),
  or = b(c),
  lr = b(NavItemComponent),
  N = $(NavItemComponent);
var mr = { AlOztWgAm: "(max-width: 1199px)", vtnUon983: "(min-width: 1200px)" },
  cr = () => typeof document < "u",
  Le = "framer-CacIk",
  fr = { AlOztWgAm: "framer-v-p363ye", vtnUon983: "framer-v-18oda3j" },
  dr = { delay: 0.3, duration: 0.4, ease: [0.44, 0, 0.56, 1], type: "tween" /* CSS-like easing animation */ },
  hr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    transition: dr,
    x: 0,
    y: 0,
  },
  pr = {
    opacity: 0.001,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    x: 0,
    y: 0,
  },
  De = { damping: 30, delay: 0, mass: 1, stiffness: 400, type: "spring" /* physics-based spring animation */ },
  ur = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.1,
    skewX: 0,
    skewY: 0,
    transition: De,
  },
  gr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.05,
    skewX: 0,
    skewY: 0,
    transition: De,
  },
  Mr = Y(),
  yr = { Desktop: "vtnUon983", Phone: "AlOztWgAm" },
  xr = ({ height: f, id: n, width: u, ...d }) => {
    var g, y;
    return {
      ...d,
      variant:
        (y = (g = yr[d.variant]) !== null && g !== void 0 ? g : d.variant) !==
          null && y !== void 0
          ? y
          : "vtnUon983",
    };
  },
  kr = V(function (f, n) {
    let { activeLocale: u, setLocale: d } = D(),
      { style: g, className: y, layoutId: v, variant: W, ...H } = xr(f);
    (useEffect(() => {
      let i = Y(void 0, u);
      if (i.robots) {
        let x = document.querySelector('meta[name="robots"]');
        x
          ? x.setAttribute("content", i.robots)
          : ((x = document.createElement("meta")),
            x.setAttribute("name", "robots"),
            x.setAttribute("content", i.robots),
            document.head.appendChild(x));
      }
    }, [void 0, u]),
      useInsertionEffect(() => {
        let i = Y(void 0, u);
        if (((document.title = i.title || ""), i.viewport)) {
          var x;
          (x = document.querySelector('meta[name="viewport"]')) === null ||
            x === void 0 ||
            x.setAttribute("content", i.viewport);
        }
        let le = i.bodyClassName;
        if (le) {
          let J = document.body;
          (J.classList.forEach(
            (me) => me.startsWith("framer-body-") && J.classList.remove(me),
          ),
            J.classList.add(`${i.bodyClassName}-framer-CacIk`));
        }
        return () => {
          le &&
            document.body.classList.remove(`${i.bodyClassName}-framer-CacIk`);
        };
      }, [void 0, u]));
    let [h, ie] = useVariantState(W, mr, !1),
      se = void 0,
      E = k(null),
      R = () => (cr() ? h !== "AlOztWgAm" : !0),
      ne = w("WjO84y3BZ"),
      _ = k(null),
      l = w("dbtg_NZW8"),
      j = k(null),
      S = w("tftSCv8zZ"),
      U = k(null),
      K = w("mRVhqybMB"),
      F = k(null),
      X = w("NYP2seWhD"),
      z = k(null),
      G = w("DXqsCYt4L"),
      A = k(null),
      vr = useRoute(),
      Me = B(),
      oe = [interExtraBoldCSSScope, interMediumCSSScope, Be, cssClassScope];
    return (
      registerCursors({}),
      e(CursorContext.Provider, {
        value: { primaryVariantId: "vtnUon983", variantClassNames: fr },
        children: r(L, {
          id: v ?? Me,
          children: [
            r(s.div, {
              ...H,
              className: T(Le, ...oe, "framer-18oda3j", y),
              ref: n ?? E,
              style: { ...g },
              children: [
                e(t, {
                  children: e(p, {
                    className: "framer-1xxbq53-container",
                    children: e(SmoothScrollComponent, {
                      height: "100%",
                      id: "n2mjdAzVc",
                      intensity: 15,
                      layoutId: "n2mjdAzVc",
                      width: "100%",
                    }),
                  }),
                }),
                e(t, {
                  width: "100vw",
                  children: e(p, {
                    animate: hr,
                    className: "framer-12f3lu4-container",
                    "data-framer-appear-id": "12f3lu4",
                    initial: pr,
                    layoutScroll: !0,
                    optimized: !0,
                    style: { transformPerspective: 1200 },
                    children: e(nr, {
                      __framer__animateOnce: !1,
                      __framer__threshold: 0.5,
                      __framer__variantAppearEffectEnabled: !0,
                      height: "100%",
                      id: "X_da1JZ1k",
                      layoutId: "X_da1JZ1k",
                      style: { height: "100%", width: "100%" },
                      variant: "Rre_u8WuV",
                      width: "100%",
                    }),
                  }),
                }),
                r("div", {
                  className: "framer-1a06t1c",
                  children: [
                    R() &&
                      r("div", {
                        className: "framer-t3l13x hidden-p363ye",
                        "data-framer-name": "Sidebarstack",
                        name: "Sidebarstack",
                        children: [
                          e("div", {
                            className: "framer-wihk6b",
                            "data-framer-name": "navfiller",
                            name: "navfiller",
                          }),
                          e("div", {
                            className: "framer-14fjts4",
                            "data-framer-name": "Sidebar",
                            name: "Sidebar",
                          }),
                        ],
                      }),
                    r("main", {
                      className: "framer-28jrge",
                      "data-framer-name": "Main",
                      "data-hide-scrollbars": !0,
                      name: "Main",
                      children: [
                        e("section", {
                          className: "framer-sa5hnr",
                          "data-framer-name": "Section-Time",
                          "data-hide-scrollbars": !0,
                          id: ne,
                          name: "Section-Time",
                          ref: _,
                          children: e("div", {
                            className: "framer-s6m53n",
                            children: e("div", {
                              className: "framer-nm0ikv",
                              children: r("div", {
                                className: "framer-1hg5wdu",
                                children: [
                                  R() &&
                                    e("div", {
                                      className: "framer-1x24jff hidden-p363ye",
                                    }),
                                  e("div", {
                                    className: "framer-18z1jzc",
                                    children: r("div", {
                                      className: "framer-1ouw02o",
                                      children: [
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              e("h1", {
                                                className:
                                                  "framer-styles-preset-3nqyhf",
                                                "data-styles-preset":
                                                  "YAP816Y5n",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                  "--framer-text-color":
                                                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                                                },
                                                children:
                                                  "Medical procedures are time-sensitive ",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "Medical interventions demand precision, urgency, and a high degree of ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "IDh2dRb_U",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "adaptability",
                                                      }),
                                                    }),
                                                  }),
                                                  ". In critical care situations, every ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "cASgO3jWQ",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: r("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: [
                                                        e("strong", {
                                                          children: "decision",
                                                        }),
                                                        " ",
                                                      ],
                                                    }),
                                                  }),
                                                  "and action carries significant weight. Healthcare providers must assess complex scenarios rapidly, weighing potential risks and benefits within limited timeframes. The ability to ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "pcYRXVdRv",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: r("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: [
                                                        e("strong", {
                                                          children:
                                                            "prioritize",
                                                        }),
                                                        " ",
                                                      ],
                                                    }),
                                                  }),
                                                  "effectively and maintain clear focus under pressure is paramount.",
                                                ],
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "Even in less urgent settings, time remains a critical factor. Delays can compromise ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "HtIN1t6ER",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "patient outcomes",
                                                      }),
                                                    }),
                                                  }),
                                                  ", requiring medical professionals to balance thoroughness with swift execution. This pressure is compounded by the dynamic nature of the medical field. Unforeseen complications, individual patient variations, and the demands of team coordination introduce variables that require constant reassessment.",
                                                ],
                                              }),
                                            ],
                                          }),
                                          className: "framer-11v6mfd",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                        e("div", {
                                          className: "framer-1boqtvh",
                                          children: e(t, {
                                            children: e(p, {
                                              className:
                                                "framer-1cmixjq-container",
                                              children: e(I, {
                                                breakpoint: h,
                                                overrides: {
                                                  AlOztWgAm: {
                                                    srcFile:
                                                      "https://framerusercontent.com/assets/94FGIKDXviN3xJyP51X5YDq5hw.mp4",
                                                  },
                                                },
                                                children: e(c, {
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0)",
                                                  borderRadius: 15,
                                                  bottomLeftRadius: 15,
                                                  bottomRightRadius: 15,
                                                  controls: !1,
                                                  height: "100%",
                                                  id: "h0JpIKWrU",
                                                  isMixedBorderRadius: !1,
                                                  layoutId: "h0JpIKWrU",
                                                  loop: !0,
                                                  muted: !0,
                                                  objectFit: "cover",
                                                  playing: !0,
                                                  posterEnabled: !1,
                                                  srcFile:
                                                    "https://framerusercontent.com/assets/VVN9eNnNBxaXeBaoKH17jHgiJg.mp4",
                                                  srcType: "Upload",
                                                  srcUrl:
                                                    "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                                                  startTime: 0,
                                                  style: {
                                                    height: "100%",
                                                    width: "100%",
                                                  },
                                                  topLeftRadius: 15,
                                                  topRightRadius: 15,
                                                  volume: 25,
                                                  width: "100%",
                                                }),
                                              }),
                                            }),
                                          }),
                                        }),
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "Healthcare providers must navigate this complex landscape with unwavering professionalism. Their ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "KgHIqfucs",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children: "dedication",
                                                      }),
                                                    }),
                                                  }),
                                                  " and ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "S5cL1K0Pb",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: r("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: [
                                                        e("strong", {
                                                          children: "expertise",
                                                        }),
                                                        " ",
                                                      ],
                                                    }),
                                                  }),
                                                  "are essential during these time-sensitive moments. The challenges are undeniable, but so are the rewards of providing optimal patient care within these demanding circumstances.",
                                                ],
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                            ],
                                          }),
                                          className: "framer-1u19uqd",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        }),
                        e("section", {
                          className: "framer-1y2dv23",
                          "data-framer-name": "Section-Dance",
                          "data-hide-scrollbars": !0,
                          id: l,
                          name: "Section-Dance",
                          ref: j,
                          children: e("div", {
                            className: "framer-1rxj0w1",
                            children: e("div", {
                              className: "framer-1uvzzs6",
                              children: r("div", {
                                className: "framer-1nko6ww",
                                children: [
                                  e("div", { className: "framer-1ubi6hg" }),
                                  e("div", {
                                    className: "framer-f0xdgz",
                                    children: r("div", {
                                      className: "framer-1a7bs04",
                                      children: [
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              e("h1", {
                                                className:
                                                  "framer-styles-preset-3nqyhf",
                                                "data-styles-preset":
                                                  "YAP816Y5n",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                  "--framer-text-color":
                                                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                                                },
                                                children: "Like a dance",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "While individual members excel in their specific roles, true success requires more than just technical skill. Nurses, physicians, technicians, and support staff communicate and ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "zI2CbZmPJ",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children: "anticipate",
                                                      }),
                                                    }),
                                                  }),
                                                  " each other's needs, ensuring necessary ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "uQs2bgVcT",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: r("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: [
                                                        e("strong", {
                                                          children: "resources",
                                                        }),
                                                        " ",
                                                      ],
                                                    }),
                                                  }),
                                                  "are available at the critical moment. An experienced team functions as a well-oiled machine, with every member moving in sync.",
                                                ],
                                              }),
                                            ],
                                          }),
                                          className: "framer-1f2berh",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                        e("div", {
                                          className: "framer-avx6mw",
                                          children: e(t, {
                                            children: e(p, {
                                              className:
                                                "framer-1vljw3j-container",
                                              children: e(I, {
                                                breakpoint: h,
                                                overrides: {
                                                  AlOztWgAm: {
                                                    srcFile:
                                                      "https://framerusercontent.com/assets/AsfMI1YIuCOQ4pfzbVw61U2T0d0.mp4",
                                                  },
                                                },
                                                children: e(c, {
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0)",
                                                  borderRadius: 15,
                                                  bottomLeftRadius: 15,
                                                  bottomRightRadius: 15,
                                                  controls: !1,
                                                  height: "100%",
                                                  id: "meqeFY16Y",
                                                  isMixedBorderRadius: !1,
                                                  layoutId: "meqeFY16Y",
                                                  loop: !0,
                                                  muted: !0,
                                                  objectFit: "cover",
                                                  playing: !0,
                                                  posterEnabled: !1,
                                                  srcFile:
                                                    "https://framerusercontent.com/assets/YAHq7DplZB3DU76ZSORV03P8Y.mp4",
                                                  srcType: "Upload",
                                                  srcUrl:
                                                    "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                                                  startTime: 0,
                                                  style: {
                                                    height: "100%",
                                                    width: "100%",
                                                  },
                                                  topLeftRadius: 15,
                                                  topRightRadius: 15,
                                                  volume: 25,
                                                  width: "100%",
                                                }),
                                              }),
                                            }),
                                          }),
                                        }),
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "Beyond the immediate patient care team, effective coordination extends throughout the healthcare system. Lab technicians swiftly process critical samples, pharmacists carefully prepare medications, and administrators manage resources so that the care team has the right tools and support. This ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "fN3izV_im",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "network of collaboration",
                                                      }),
                                                    }),
                                                  }),
                                                  " allows care teams to focus on treating patients, knowing the right information and resources are flowing smoothly behind the scenes.",
                                                ],
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "This fluidity develops over time through collaboration and shared experiences. Trust solidifies through ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "sEYnG8vfd",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "repeated interactions",
                                                      }),
                                                    }),
                                                  }),
                                                  ", allowing team members to rely on each other's expertise and judgment. This strong foundation becomes crucial in high-pressure situations, enabling the team to deliver exceptional patient care when it matters most.",
                                                ],
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                            ],
                                          }),
                                          className: "framer-11834y9",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        }),
                        e("section", {
                          className: "framer-tryz2c",
                          "data-framer-name": "Section-Cost",
                          "data-hide-scrollbars": !0,
                          id: S,
                          name: "Section-Cost",
                          ref: U,
                          children: e("div", {
                            className: "framer-qbgm69",
                            children: e("div", {
                              className: "framer-69ea2v",
                              children: r("div", {
                                className: "framer-106jc55",
                                children: [
                                  e("div", { className: "framer-xe0474" }),
                                  e("div", {
                                    className: "framer-1wijqoy",
                                    children: r("div", {
                                      className: "framer-vv1jrc",
                                      children: [
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              e("h1", {
                                                className:
                                                  "framer-styles-preset-3nqyhf",
                                                "data-styles-preset":
                                                  "YAP816Y5n",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                  "--framer-text-color":
                                                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                                                },
                                                children:
                                                  "But this comes at a cost",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                            ],
                                          }),
                                          className: "framer-nl13cd",
                                          fonts: ["Inter"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                        e("div", {
                                          className: "framer-1261yhd",
                                          children: e(t, {
                                            children: e(p, {
                                              className:
                                                "framer-b4cavj-container",
                                              children: e(I, {
                                                breakpoint: h,
                                                overrides: {
                                                  AlOztWgAm: {
                                                    srcFile:
                                                      "https://framerusercontent.com/assets/4EQcQDQ3npZd3gwjcKO6sENyQG0.mp4",
                                                  },
                                                },
                                                children: e(c, {
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0)",
                                                  borderRadius: 15,
                                                  bottomLeftRadius: 15,
                                                  bottomRightRadius: 15,
                                                  controls: !1,
                                                  height: "100%",
                                                  id: "hFaYa_W3V",
                                                  isMixedBorderRadius: !1,
                                                  layoutId: "hFaYa_W3V",
                                                  loop: !0,
                                                  muted: !0,
                                                  objectFit: "cover",
                                                  playing: !0,
                                                  posterEnabled: !1,
                                                  srcFile:
                                                    "https://framerusercontent.com/assets/iYTbAuik57o8JZn3y2UfYugl8s.webm",
                                                  srcType: "Upload",
                                                  srcUrl:
                                                    "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                                                  startTime: 0,
                                                  style: {
                                                    height: "100%",
                                                    width: "100%",
                                                  },
                                                  topLeftRadius: 15,
                                                  topRightRadius: 15,
                                                  volume: 25,
                                                  width: "100%",
                                                }),
                                              }),
                                            }),
                                          }),
                                        }),
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "The pressure to perform individual tasks with precision can inadvertently diminish the importance of ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "sEYnG8vfd",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "team cohesion",
                                                      }),
                                                    }),
                                                  }),
                                                  ". When members become overly absorbed in their specific responsibilities, subtle ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "MrFemP8j0",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "communication breakdowns",
                                                      }),
                                                    }),
                                                  }),
                                                  " may occur. This can manifest as misinterpretations, delays, or a decreased ability to anticipate the needs of other team members. Such breakdowns can disrupt the coordinated effort required for optimal patient care.",
                                                ],
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "The division of labor within medical teams is essential for efficiency, yet it can inadvertently create ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "EY4hH_Y7j",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "silos of information",
                                                      }),
                                                    }),
                                                  }),
                                                  ". This compartmentalization can lead to a decreased awareness of how individual actions might impact the broader team effort. Seemingly minor discrepancies or misalignments between team members can, in aggregate, have a significant effect on the",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "X8n9MxBBr",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: r("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: [
                                                        " ",
                                                        e("strong", {
                                                          children:
                                                            "overall flow",
                                                        }),
                                                      ],
                                                    }),
                                                  }),
                                                  " and success of a procedure.",
                                                ],
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children:
                                                  "The emphasis on individual expertise risks obscuring the collaborative nature of effective medical care. This narrow focus can make it difficult to maintain a shared understanding of the situation and overall patient needs. Missed opportunities for support or a lack of resource reallocation where necessary may occur, potentially impacting patient outcomes.",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                            ],
                                          }),
                                          className: "framer-1ejabff",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        }),
                        e("section", {
                          className: "framer-jnm6wk",
                          "data-framer-name": "Section-Skills",
                          "data-hide-scrollbars": !0,
                          id: K,
                          name: "Section-Skills",
                          ref: F,
                          children: e("div", {
                            className: "framer-g98yis",
                            children: e("div", {
                              className: "framer-zsje82",
                              children: r("div", {
                                className: "framer-yjzruh",
                                children: [
                                  e("div", { className: "framer-1vy4v2" }),
                                  e("div", {
                                    className: "framer-g1ueej",
                                    children: r("div", {
                                      className: "framer-3p4opu",
                                      children: [
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              e("h1", {
                                                className:
                                                  "framer-styles-preset-3nqyhf",
                                                "data-styles-preset":
                                                  "YAP816Y5n",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                  "--framer-text-color":
                                                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                                                },
                                                children: "Sharpening skills ",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "The complexity of the medical field necessitates continuous learning. Complex cases offer",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "N3WZmbqwm",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: r("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: [
                                                        " ",
                                                        e("strong", {
                                                          children:
                                                            "valuable opportunities",
                                                        }),
                                                      ],
                                                    }),
                                                  }),
                                                  " for critical self-review. Healthcare providers can carefully examine their decision-making, technical precision, and potential complications in the context of each case.",
                                                ],
                                              }),
                                            ],
                                          }),
                                          className: "framer-5yjl5u",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                        e("div", {
                                          className: "framer-a6fuxj",
                                          children: e(t, {
                                            children: e(p, {
                                              className:
                                                "framer-nvaod3-container",
                                              children: e(I, {
                                                breakpoint: h,
                                                overrides: {
                                                  AlOztWgAm: {
                                                    srcFile:
                                                      "https://framerusercontent.com/assets/DmivDyww4OxLLV34oV7ac24l2Q.mp4",
                                                  },
                                                },
                                                children: e(c, {
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0)",
                                                  borderRadius: 15,
                                                  bottomLeftRadius: 15,
                                                  bottomRightRadius: 15,
                                                  controls: !1,
                                                  height: "100%",
                                                  id: "EhgsuZXgp",
                                                  isMixedBorderRadius: !1,
                                                  layoutId: "EhgsuZXgp",
                                                  loop: !0,
                                                  muted: !0,
                                                  objectFit: "cover",
                                                  playing: !0,
                                                  posterEnabled: !1,
                                                  srcFile:
                                                    "https://framerusercontent.com/assets/lwhbyca3SIAUTdycQSuEDXMs9k.mp4",
                                                  srcType: "Upload",
                                                  srcUrl:
                                                    "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                                                  startTime: 0,
                                                  style: {
                                                    height: "100%",
                                                    width: "100%",
                                                  },
                                                  topLeftRadius: 15,
                                                  topRightRadius: 15,
                                                  volume: 25,
                                                  width: "100%",
                                                }),
                                              }),
                                            }),
                                          }),
                                        }),
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "This ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "ut1mnZVW1",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "introspective analysis",
                                                      }),
                                                    }),
                                                  }),
                                                  " can enhance patient care. It suggests a dedication to ongoing ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "t97unZiTK",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "skill refinement",
                                                      }),
                                                    }),
                                                  }),
                                                  ". Self-reflection allows healthcare providers to identify both their strengths and areas for further development.",
                                                ],
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "A commitment to continuous,",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "rC8gH4Mco",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: r("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: [
                                                        " ",
                                                        e("strong", {
                                                          children:
                                                            "self-directed learning",
                                                        }),
                                                      ],
                                                    }),
                                                  }),
                                                  " helps medical providers effectively handle the challenges of the dynamic medical environment. It fosters a culture of careful self-assessment and a drive for continuous improvement, benefiting healthcare practitioners and their patients.",
                                                ],
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                            ],
                                          }),
                                          className: "framer-ysem9e",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        }),
                        e("section", {
                          className: "framer-1k2r7fq",
                          "data-framer-name": "Section-Team",
                          "data-hide-scrollbars": !0,
                          id: X,
                          name: "Section-Team",
                          ref: z,
                          children: e("div", {
                            className: "framer-1n46uon",
                            children: e("div", {
                              className: "framer-3egmf7",
                              children: r("div", {
                                className: "framer-7i1v0w",
                                children: [
                                  e("div", { className: "framer-i2rcf0" }),
                                  e("div", {
                                    className: "framer-pecmdd",
                                    children: r("div", {
                                      className: "framer-1itas1o",
                                      children: [
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              e("h1", {
                                                className:
                                                  "framer-styles-preset-3nqyhf",
                                                "data-styles-preset":
                                                  "YAP816Y5n",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                  "--framer-text-color":
                                                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                                                },
                                                children:
                                                  "Strenghtening team dynamics",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "While healthcare providers continuously develop their individual skills, it's equally important to foster strong team dynamics. Video debriefs offer a valuable tool for ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "nzfaDOFRY",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "collaborative analysis",
                                                      }),
                                                    }),
                                                  }),
                                                  " and improvement. In these sessions, teams review medical footage, identifying successful strategies, potential areas for optimization, and any breakdowns in communication or workflow.",
                                                ],
                                              }),
                                            ],
                                          }),
                                          className: "framer-1tf77ld",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                        e("div", {
                                          className: "framer-1niytn",
                                          children: e(t, {
                                            children: e(p, {
                                              className:
                                                "framer-1cj2qsy-container",
                                              children: e(I, {
                                                breakpoint: h,
                                                overrides: {
                                                  AlOztWgAm: {
                                                    srcFile:
                                                      "https://framerusercontent.com/assets/vwo4RiwL3gvpTSfYWhwtOZLTmhU.mp4",
                                                  },
                                                },
                                                children: e(c, {
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0)",
                                                  borderRadius: 15,
                                                  bottomLeftRadius: 15,
                                                  bottomRightRadius: 15,
                                                  controls: !1,
                                                  height: "100%",
                                                  id: "i_fLUmv7t",
                                                  isMixedBorderRadius: !1,
                                                  layoutId: "i_fLUmv7t",
                                                  loop: !0,
                                                  muted: !0,
                                                  objectFit: "cover",
                                                  playing: !0,
                                                  posterEnabled: !1,
                                                  srcFile:
                                                    "https://framerusercontent.com/assets/iwaVLcZgCGinuOBBBe6yoz9e4U.mp4",
                                                  srcType: "Upload",
                                                  srcUrl:
                                                    "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                                                  startTime: 0,
                                                  style: {
                                                    height: "100%",
                                                    width: "100%",
                                                  },
                                                  topLeftRadius: 15,
                                                  topRightRadius: 15,
                                                  volume: 25,
                                                  width: "100%",
                                                }),
                                              }),
                                            }),
                                          }),
                                        }),
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "The emphasis within debriefings is on ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "mRVtT24DH",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "constructive problem-solving",
                                                      }),
                                                    }),
                                                  }),
                                                  ". This creates a safe space for open communication without judgment, promoting transparency and a focus on team-wide improvement. By inviting all team members to share their unique perspectives, video debriefs enhance understanding between colleagues, regardless of role or experience level.",
                                                ],
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children:
                                                  "Regularly reviewing cases in this structured format can lead to improved patient outcomes, optimized team efficiency, and stronger professional relationships. It fosters a culture of learning, growth, and mutual support throughout the medical team.",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                            ],
                                          }),
                                          className: "framer-1llnw04",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        }),
                        e("section", {
                          className: "framer-ybzgtm",
                          "data-framer-name": "Section-Perspectives",
                          "data-hide-scrollbars": !0,
                          id: G,
                          name: "Section-Perspectives",
                          ref: A,
                          children: e("div", {
                            className: "framer-1xunj3i",
                            children: e("div", {
                              className: "framer-1encm2n",
                              children: r("div", {
                                className: "framer-1mewfbx",
                                children: [
                                  e("div", { className: "framer-bqaqqm" }),
                                  e("div", {
                                    className: "framer-hh5gom",
                                    children: r("div", {
                                      className: "framer-2tsoyv",
                                      children: [
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              e("h1", {
                                                className:
                                                  "framer-styles-preset-3nqyhf",
                                                "data-styles-preset":
                                                  "YAP816Y5n",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                  "--framer-text-color":
                                                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                                                },
                                                children:
                                                  "Broadening perspectives",
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "Collaborative case reviews offer benefits beyond individual skills and procedural analysis. They establish a ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "ymL2yz5Md",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "foundation of shared confidence",
                                                      }),
                                                    }),
                                                  }),
                                                  " across the team. Through the careful examination of past workflows, each member gains clarity on their responsibilities, effective communication strategies, and potential contingency plans for complex scenarios.",
                                                ],
                                              }),
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "This knowledge can minimize hesitation during critical procedures, leading to more ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "X8n9MxBBr",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "deliberate actions",
                                                      }),
                                                    }),
                                                  }),
                                                  " and efficient communication. A ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "NM8YGpOE1",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "sense of preparedness",
                                                      }),
                                                    }),
                                                  }),
                                                  " emerges, bolstering confidence in both individual skills and team cohesion. Additionally, the review process allows the team to identify and address potential areas for improvement in their workflow or communication patterns.",
                                                ],
                                              }),
                                            ],
                                          }),
                                          className: "framer-13yw1ak",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                        e("div", {
                                          className: "framer-11a32oa",
                                          children: e(t, {
                                            children: e(p, {
                                              className:
                                                "framer-ix3j3j-container",
                                              children: e(I, {
                                                breakpoint: h,
                                                overrides: {
                                                  AlOztWgAm: {
                                                    srcFile:
                                                      "https://framerusercontent.com/assets/4NGDIFKnqSawyWIzI61eP17UVsQ.mp4",
                                                  },
                                                },
                                                children: e(c, {
                                                  backgroundColor:
                                                    "rgba(0, 0, 0, 0)",
                                                  borderRadius: 15,
                                                  bottomLeftRadius: 15,
                                                  bottomRightRadius: 15,
                                                  controls: !1,
                                                  height: "100%",
                                                  id: "urRzfVoZ4",
                                                  isMixedBorderRadius: !0,
                                                  layoutId: "urRzfVoZ4",
                                                  loop: !0,
                                                  muted: !0,
                                                  objectFit: "cover",
                                                  playing: !0,
                                                  posterEnabled: !1,
                                                  srcFile:
                                                    "https://framerusercontent.com/assets/iJ4dgBLL0n3cEr9t7DvoTeMFVwY.mp4",
                                                  srcType: "Upload",
                                                  srcUrl:
                                                    "https://assets.mixkit.co/videos/preview/mixkit-shining-sun-in-the-sky-surrounded-by-moving-clouds-31793-small.mp4",
                                                  startTime: 0,
                                                  style: {
                                                    height: "100%",
                                                    width: "100%",
                                                  },
                                                  topLeftRadius: 15,
                                                  topRightRadius: 15,
                                                  volume: 25,
                                                  width: "100%",
                                                }),
                                              }),
                                            }),
                                          }),
                                        }),
                                        e(m, {
                                          __fromCanvasComponent: !0,
                                          children: r(o, {
                                            children: [
                                              r("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: [
                                                  "These factors enable the team to perform optimally under pressure. The collaborative preparation and shared understanding foster a sense of readiness. By ",
                                                  e(a, {
                                                    href: {
                                                      webPageId: "H5snp07v4",
                                                    },
                                                    openInNewTab: !1,
                                                    smoothScroll: !1,
                                                    children: e("a", {
                                                      className:
                                                        "framer-styles-preset-1wicq5s",
                                                      "data-styles-preset":
                                                        "ro7OPezbn",
                                                      children: e("strong", {
                                                        children:
                                                          "proactively addressing",
                                                      }),
                                                    }),
                                                  }),
                                                  " challenges and establishing clear expectations, the team can work together effectively for the best possible patient outcomes.",
                                                ],
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                              e("p", {
                                                className:
                                                  "framer-styles-preset-21ogod",
                                                "data-styles-preset":
                                                  "xZndidUCt",
                                                style: {
                                                  "--framer-text-alignment":
                                                    "left",
                                                },
                                                children: e("br", {
                                                  className: "trailing-break",
                                                }),
                                              }),
                                            ],
                                          }),
                                          className: "framer-9bihrp",
                                          fonts: ["Inter", "Inter-Bold"],
                                          verticalAlignment: "top",
                                          withExternalLayout: !0,
                                        }),
                                      ],
                                    }),
                                  }),
                                ],
                              }),
                            }),
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
                r("nav", {
                  className: "framer-127ahf",
                  "data-framer-name": "Nav",
                  name: "Nav",
                  children: [
                    R() &&
                      e(a, {
                        href: { webPageId: "augiA20Il" },
                        openInNewTab: !0,
                        children: e(s.a, {
                          "aria-label": "Framer University logo",
                          className:
                            "framer-il55l2 hidden-p363ye framer-p7mxce",
                          "data-framer-name": "Logo",
                          name: "Logo",
                          whileHover: ur,
                          children: e(SVGComponent, {
                            className: "framer-13rf3nq",
                            "data-framer-name": "Neoflix_Logo_SVG",
                            fill: "black",
                            intrinsicHeight: 429,
                            intrinsicWidth: 407,
                            name: "Neoflix_Logo_SVG",
                            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 406.548 428.788"><defs><style>.cls-1{fill:#48c2c5}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M26.01 307.464c5.39 68.03 63.415 121.324 211.152 121.324-58.907 0-104.765-26.64-130.847-72.367-37.136-11.599-63.256-28.585-80.304-48.957ZM286.307 21.4C163.502-75.529-79.82 181.001 26.01 307.463 16.49 187.289 171.26 21.145 286.307 21.399Zm120.241 210.503c0-154.088-53.418-210.356-120.241-210.504 21.27 16.788 38.913 44.194 50.509 84.701 41.835 26.47 69.732 72.903 69.732 125.803Z"/><path class="cls-1" d="M82.183 255.473c0 39.41 8.53 73.592 24.132 100.947 34.05 10.634 77.32 16.753 131.42 16.753-63.114 0-100.797-43.992-100.797-117.674 0-64.553 53.329-117.069 118.875-117.069 52.924 0 95.98 42.787 95.98 95.376 0-52.356-5.454-94.437-14.977-127.706a149.154 149.154 0 0 0-80.013-23.285c-96.287 0-174.62 77.455-174.62 172.658Z"/><circle class="cls-1" cx="244.366" cy="248.571" r="43.387"/></g></g></svg>',
                            withExternalLayout: !0,
                          }),
                        }),
                      }),
                    r("div", {
                      className: "framer-r1l2tq",
                      "data-framer-name": "Links",
                      name: "Links",
                      children: [
                        e(m, {
                          __fromCanvasComponent: !0,
                          children: e(o, {
                            children: e("p", {
                              style: {
                                "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                                "--framer-font-family":
                                  '"Montserrat", "Montserrat Placeholder", sans-serif',
                                "--framer-font-size": "14px",
                                "--framer-font-weight": "500",
                                "--framer-text-color":
                                  "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                              },
                              children: e(a, {
                                href: { webPageId: "bzydBB85Y" },
                                openInNewTab: !1,
                                smoothScroll: !1,
                                children: e("a", {
                                  className: "framer-styles-preset-b5e6zr",
                                  "data-styles-preset": "H9WgrbXMf",
                                  children: "Neoflix",
                                }),
                              }),
                            }),
                          }),
                          className: "framer-v8erz7",
                          "data-framer-name": "Reflection",
                          fonts: ["GF;Montserrat-500"],
                          name: "Reflection",
                          verticalAlignment: "top",
                          withExternalLayout: !0,
                        }),
                        e(m, {
                          __fromCanvasComponent: !0,
                          children: e(o, {
                            children: e("p", {
                              style: {
                                "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                                "--framer-font-family":
                                  '"Montserrat", "Montserrat Placeholder", sans-serif',
                                "--framer-font-size": "14px",
                                "--framer-font-weight": "500",
                                "--framer-text-color": "rgb(33, 33, 33)",
                              },
                              children: e(a, {
                                href: { webPageId: "aLuYbVoBY" },
                                openInNewTab: !1,
                                smoothScroll: !1,
                                children: e("a", {
                                  className: "framer-styles-preset-b5e6zr",
                                  "data-styles-preset": "H9WgrbXMf",
                                  children: "Publications",
                                }),
                              }),
                            }),
                          }),
                          className: "framer-tuh9ck",
                          "data-framer-name": "Reflection",
                          fonts: ["GF;Montserrat-500"],
                          name: "Reflection",
                          verticalAlignment: "top",
                          withExternalLayout: !0,
                        }),
                        e(a, {
                          href: { webPageId: "x05wlhCdy" },
                          children: e(s.a, {
                            className: "framer-whs8ci framer-p7mxce",
                            whileHover: gr,
                            children: e(m, {
                              __fromCanvasComponent: !0,
                              children: e(o, {
                                children: e("p", {
                                  style: {
                                    "--font-selector":
                                      "R0Y7TW9udHNlcnJhdC01MDA=",
                                    "--framer-font-family":
                                      '"Montserrat", "Montserrat Placeholder", sans-serif',
                                    "--framer-font-size": "14px",
                                    "--framer-font-weight": "500",
                                    "--framer-text-color":
                                      "var(--token-d076bbbf-e059-45dd-8d76-40c9c3daac97, rgba(245, 249, 252, 0.9))",
                                  },
                                  children: "Toolbox",
                                }),
                              }),
                              className: "framer-1qy114b",
                              "data-framer-name": "Toolbox",
                              fonts: ["GF;Montserrat-500"],
                              name: "Toolbox",
                              verticalAlignment: "top",
                              withExternalLayout: !0,
                            }),
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
                R() &&
                  r("div", {
                    className: "framer-15osv68 hidden-p363ye",
                    "data-framer-name": "Dummy Stack",
                    name: "Dummy Stack",
                    children: [
                      r("div", {
                        className: "framer-1m7yk5f",
                        "data-framer-name": "Sidebarstack",
                        name: "Sidebarstack",
                        children: [
                          r("div", {
                            className: "framer-eu137",
                            "data-framer-name": "Sidebarstack",
                            name: "Sidebarstack",
                            children: [
                              e("div", {
                                className: "framer-srx6on",
                                "data-framer-name": "navfiller",
                                name: "navfiller",
                              }),
                              e("div", {
                                className: "framer-187rc8f",
                                "data-framer-name": "Sidebar",
                                name: "Sidebar",
                                children: r("div", {
                                  className: "framer-uvjknm",
                                  "data-framer-name": "Links",
                                  name: "Links",
                                  children: [
                                    e(C, {
                                      links: [
                                        {
                                          href: {
                                            hash: ":WjO84y3BZ",
                                            webPageId: "bzydBB85Y",
                                          },
                                          implicitPathVariables: void 0,
                                        },
                                      ],
                                      children: (i) =>
                                        e(t, {
                                          width: "273.6px",
                                          children: e(p, {
                                            className:
                                              "framer-144xu0w-container",
                                            "data-framer-name": "Item",
                                            name: "Item",
                                            children: e(N, {
                                              __framer__animateOnce: !1,
                                              __framer__targets: [
                                                { ref: _, target: "f7_6jHMU5" },
                                                { ref: j, target: "Rwa3hKEk5" },
                                              ],
                                              __framer__threshold: 0.5,
                                              __framer__variantAppearEffectEnabled:
                                                !0,
                                              height: "100%",
                                              id: "MD7Nj1EEZ",
                                              layoutId: "MD7Nj1EEZ",
                                              name: "Item",
                                              PGkyTrycd: "Time-sensitive",
                                              PvnQG2uF_: !0,
                                              S0KhFTFra: i[0],
                                              style: { width: "100%" },
                                              variant: "Rwa3hKEk5",
                                              width: "100%",
                                            }),
                                          }),
                                        }),
                                    }),
                                    e(C, {
                                      links: [
                                        {
                                          href: {
                                            hash: ":dbtg_NZW8",
                                            webPageId: "bzydBB85Y",
                                          },
                                          implicitPathVariables: void 0,
                                        },
                                      ],
                                      children: (i) =>
                                        e(t, {
                                          width: "273.6px",
                                          children: e(p, {
                                            className:
                                              "framer-13oq9sc-container",
                                            "data-framer-name": "Item",
                                            name: "Item",
                                            children: e(N, {
                                              __framer__animateOnce: !1,
                                              __framer__targets: [
                                                { ref: j, target: "f7_6jHMU5" },
                                                { ref: U, target: "Rwa3hKEk5" },
                                              ],
                                              __framer__threshold: 0.5,
                                              __framer__variantAppearEffectEnabled:
                                                !0,
                                              height: "100%",
                                              id: "HmNLG1mvV",
                                              layoutId: "HmNLG1mvV",
                                              name: "Item",
                                              PGkyTrycd: "Like a dance",
                                              PvnQG2uF_: !0,
                                              S0KhFTFra: i[0],
                                              style: { width: "100%" },
                                              variant: "Rwa3hKEk5",
                                              width: "100%",
                                            }),
                                          }),
                                        }),
                                    }),
                                    e(C, {
                                      links: [
                                        {
                                          href: {
                                            hash: ":tftSCv8zZ",
                                            webPageId: "bzydBB85Y",
                                          },
                                          implicitPathVariables: void 0,
                                        },
                                      ],
                                      children: (i) =>
                                        e(t, {
                                          width: "273.6px",
                                          children: e(p, {
                                            className:
                                              "framer-1lxqg2f-container",
                                            "data-framer-name": "Item",
                                            name: "Item",
                                            children: e(N, {
                                              __framer__animateOnce: !1,
                                              __framer__targets: [
                                                { ref: U, target: "f7_6jHMU5" },
                                                { ref: F, target: "Rwa3hKEk5" },
                                              ],
                                              __framer__threshold: 0.5,
                                              __framer__variantAppearEffectEnabled:
                                                !0,
                                              height: "100%",
                                              id: "lVFvNHfUU",
                                              layoutId: "lVFvNHfUU",
                                              name: "Item",
                                              PGkyTrycd:
                                                "But this comes at a cost",
                                              PvnQG2uF_: !0,
                                              S0KhFTFra: i[0],
                                              style: { width: "100%" },
                                              variant: "Rwa3hKEk5",
                                              width: "100%",
                                            }),
                                          }),
                                        }),
                                    }),
                                    e(C, {
                                      links: [
                                        {
                                          href: {
                                            hash: ":mRVhqybMB",
                                            webPageId: "bzydBB85Y",
                                          },
                                          implicitPathVariables: void 0,
                                        },
                                      ],
                                      children: (i) =>
                                        e(t, {
                                          width: "273.6px",
                                          children: e(p, {
                                            className:
                                              "framer-1oawkpd-container",
                                            "data-framer-name": "Item",
                                            name: "Item",
                                            children: e(N, {
                                              __framer__animateOnce: !1,
                                              __framer__targets: [
                                                { ref: F, target: "f7_6jHMU5" },
                                                { ref: z, target: "Rwa3hKEk5" },
                                              ],
                                              __framer__threshold: 0.5,
                                              __framer__variantAppearEffectEnabled:
                                                !0,
                                              height: "100%",
                                              id: "axDyaLLq6",
                                              layoutId: "axDyaLLq6",
                                              name: "Item",
                                              PGkyTrycd: "Sharpening skills",
                                              PvnQG2uF_: !0,
                                              S0KhFTFra: i[0],
                                              style: { width: "100%" },
                                              variant: "Rwa3hKEk5",
                                              width: "100%",
                                            }),
                                          }),
                                        }),
                                    }),
                                    e(C, {
                                      links: [
                                        {
                                          href: {
                                            hash: ":NYP2seWhD",
                                            webPageId: "bzydBB85Y",
                                          },
                                          implicitPathVariables: void 0,
                                        },
                                      ],
                                      children: (i) =>
                                        e(t, {
                                          width: "273.6px",
                                          children: e(p, {
                                            className:
                                              "framer-1aw20d8-container",
                                            "data-framer-name": "Item",
                                            name: "Item",
                                            children: e(N, {
                                              __framer__animateOnce: !1,
                                              __framer__targets: [
                                                { ref: z, target: "f7_6jHMU5" },
                                                { ref: A, target: "Rwa3hKEk5" },
                                              ],
                                              __framer__threshold: 0.5,
                                              __framer__variantAppearEffectEnabled:
                                                !0,
                                              height: "100%",
                                              id: "cCGn3tsBd",
                                              layoutId: "cCGn3tsBd",
                                              name: "Item",
                                              PGkyTrycd:
                                                "Strengthening team dynamics",
                                              PvnQG2uF_: !0,
                                              S0KhFTFra: i[0],
                                              style: { width: "100%" },
                                              variant: "Rwa3hKEk5",
                                              width: "100%",
                                            }),
                                          }),
                                        }),
                                    }),
                                    e(C, {
                                      links: [
                                        {
                                          href: {
                                            hash: ":DXqsCYt4L",
                                            webPageId: "bzydBB85Y",
                                          },
                                          implicitPathVariables: void 0,
                                        },
                                      ],
                                      children: (i) =>
                                        e(t, {
                                          width: "273.6px",
                                          children: e(p, {
                                            className:
                                              "framer-yle7l6-container",
                                            "data-framer-name": "Item",
                                            name: "Item",
                                            children: e(N, {
                                              __framer__animateOnce: !1,
                                              __framer__targets: [
                                                { ref: A, target: "f7_6jHMU5" },
                                              ],
                                              __framer__threshold: 0,
                                              __framer__variantAppearEffectEnabled:
                                                !0,
                                              height: "100%",
                                              id: "oVFbPFs55",
                                              layoutId: "oVFbPFs55",
                                              name: "Item",
                                              PGkyTrycd:
                                                "Broadening perspectives",
                                              PvnQG2uF_: !0,
                                              S0KhFTFra: i[0],
                                              style: { width: "100%" },
                                              variant: "Rwa3hKEk5",
                                              width: "100%",
                                            }),
                                          }),
                                        }),
                                    }),
                                  ],
                                }),
                              }),
                            ],
                          }),
                          e("div", {
                            className: "framer-aong3m",
                            "data-framer-name": "navfiller",
                            name: "navfiller",
                          }),
                        ],
                      }),
                      e("main", {
                        className: "framer-gcvtsl",
                        "data-framer-name": "Main",
                        "data-hide-scrollbars": !0,
                        name: "Main",
                      }),
                    ],
                  }),
              ],
            }),
            e("div", { className: T(Le, ...oe), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  br = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-CacIk.framer-p7mxce, .framer-CacIk .framer-p7mxce { display: block; }",
    ".framer-CacIk.framer-18oda3j { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: visible; padding: 0px; position: relative; width: 1200px; }",
    ".framer-CacIk .framer-1xxbq53-container { flex: none; height: auto; position: relative; width: auto; }",
    ".framer-CacIk .framer-12f3lu4-container { flex: none; height: 100vh; left: 0px; pointer-events: none; position: fixed; right: 0px; top: 0px; z-index: -1; }",
    ".framer-CacIk .framer-1a06t1c { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; max-width: 1540px; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-CacIk .framer-t3l13x { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: center; left: 0px; opacity: 0; overflow: hidden; padding: 0px; position: relative; top: 0px; width: 400px; }",
    ".framer-CacIk .framer-wihk6b, .framer-CacIk .framer-srx6on, .framer-CacIk .framer-aong3m { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 70px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 280px; }",
    ".framer-CacIk .framer-14fjts4 { align-content: center; align-items: center; background-color: var(--token-9bde1f78-4ca9-4486-8fc1-31c3f35d4e21, #1c3664); border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; border-top-left-radius: 15px; border-top-right-radius: 15px; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; height: 1px; justify-content: space-between; overflow: visible; padding: 0px; position: relative; width: 400px; z-index: 1; }",
    ".framer-CacIk .framer-28jrge { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: auto; padding: 0px; position: relative; width: 1px; z-index: 7; }",
    ".framer-CacIk .framer-sa5hnr, .framer-CacIk .framer-1y2dv23, .framer-CacIk .framer-tryz2c, .framer-CacIk .framer-jnm6wk, .framer-CacIk .framer-1k2r7fq, .framer-CacIk .framer-ybzgtm { align-content: flex-start; align-items: flex-start; border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; min-height: 100vh; overflow: hidden; padding: 0px; position: relative; width: 100%; will-change: var(--framer-will-change-override, transform); }",
    ".framer-CacIk .framer-s6m53n, .framer-CacIk .framer-1rxj0w1, .framer-CacIk .framer-qbgm69, .framer-CacIk .framer-g98yis, .framer-CacIk .framer-1n46uon, .framer-CacIk .framer-1xunj3i { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1px; z-index: 1; }",
    ".framer-CacIk .framer-nm0ikv, .framer-CacIk .framer-1uvzzs6, .framer-CacIk .framer-69ea2v, .framer-CacIk .framer-zsje82, .framer-CacIk .framer-3egmf7, .framer-CacIk .framer-1encm2n { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-CacIk .framer-1hg5wdu, .framer-CacIk .framer-1nko6ww, .framer-CacIk .framer-106jc55, .framer-CacIk .framer-yjzruh, .framer-CacIk .framer-7i1v0w, .framer-CacIk .framer-1mewfbx { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; max-width: 1040px; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-CacIk .framer-1x24jff, .framer-CacIk .framer-1ubi6hg, .framer-CacIk .framer-xe0474, .framer-CacIk .framer-1vy4v2, .framer-CacIk .framer-i2rcf0, .framer-CacIk .framer-bqaqqm { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 70px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 692px; }",
    ".framer-CacIk .framer-18z1jzc { align-content: flex-start; align-items: flex-start; background-color: var(--token-d076bbbf-e059-45dd-8d76-40c9c3daac97, rgba(245, 249, 252, 0.8)); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-top-left-radius: 10px; border-top-right-radius: 10px; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; max-width: 960px; padding: 80px 0px 120px 0px; position: relative; width: 95%; }",
    ".framer-CacIk .framer-1ouw02o, .framer-CacIk .framer-1a7bs04, .framer-CacIk .framer-vv1jrc, .framer-CacIk .framer-3p4opu, .framer-CacIk .framer-1itas1o, .framer-CacIk .framer-2tsoyv { align-content: flex-end; align-items: flex-end; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 38px; height: min-content; justify-content: center; max-width: 684px; overflow: hidden; padding: 0px 10px 0px 10px; position: relative; width: 100%; }",
    ".framer-CacIk .framer-11v6mfd, .framer-CacIk .framer-1u19uqd, .framer-CacIk .framer-1f2berh, .framer-CacIk .framer-11834y9, .framer-CacIk .framer-1ejabff, .framer-CacIk .framer-5yjl5u, .framer-CacIk .framer-ysem9e, .framer-CacIk .framer-1tf77ld, .framer-CacIk .framer-1llnw04, .framer-CacIk .framer-13yw1ak, .framer-CacIk .framer-9bihrp { flex: none; height: auto; max-width: 600px; overflow: hidden; overflow-y: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; z-index: 10; }",
    ".framer-CacIk .framer-1boqtvh, .framer-CacIk .framer-avx6mw, .framer-CacIk .framer-1261yhd, .framer-CacIk .framer-a6fuxj, .framer-CacIk .framer-1niytn, .framer-CacIk .framer-11a32oa { align-content: center; align-items: center; border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; border-top-left-radius: 15px; border-top-right-radius: 15px; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 400px; justify-content: center; max-width: 600px; overflow: hidden; padding: 0px; position: relative; width: 100%; will-change: var(--framer-will-change-override, transform); }",
    ".framer-CacIk .framer-1cmixjq-container, .framer-CacIk .framer-1vljw3j-container, .framer-CacIk .framer-b4cavj-container, .framer-CacIk .framer-nvaod3-container, .framer-CacIk .framer-1cj2qsy-container, .framer-CacIk .framer-ix3j3j-container { flex: none; height: 100%; position: relative; width: 100%; }",
    ".framer-CacIk .framer-f0xdgz, .framer-CacIk .framer-1wijqoy, .framer-CacIk .framer-g1ueej, .framer-CacIk .framer-pecmdd, .framer-CacIk .framer-hh5gom { align-content: flex-start; align-items: flex-start; background-color: rgba(245, 249, 252, 0.8); border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; border-top-left-radius: 10px; border-top-right-radius: 10px; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; max-width: 960px; padding: 80px 0px 120px 0px; position: relative; width: 95%; }",
    ".framer-CacIk .framer-nl13cd { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; flex: none; height: auto; max-width: 600px; overflow: hidden; overflow-y: auto; position: relative; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; z-index: 10; }",
    ".framer-CacIk .framer-127ahf { align-content: center; align-items: center; background-color: #ffffff; box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2); display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; height: 60px; justify-content: space-between; left: calc(50.00000000000002% - 100% / 2); opacity: 0.9; overflow: visible; padding: 24px 40px 24px 24px; position: fixed; top: 0px; width: 100%; z-index: 10; }",
    ".framer-CacIk .framer-il55l2 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 40px; justify-content: center; overflow: visible; padding: 0px; position: relative; text-decoration: none; width: 40px; }",
    ".framer-CacIk .framer-13rf3nq { flex: 40 0 0px; height: 40px; position: relative; width: 1px; }",
    ".framer-CacIk .framer-r1l2tq { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }",
    ".framer-CacIk .framer-v8erz7, .framer-CacIk .framer-tuh9ck { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }",
    ".framer-CacIk .framer-whs8ci { align-content: center; align-items: center; background-color: var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, #383437); border-bottom-left-radius: 128px; border-bottom-right-radius: 128px; border-top-left-radius: 128px; border-top-right-radius: 128px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 2px 11px 2px 11px; position: relative; text-decoration: none; width: min-content; z-index: 0; }",
    ".framer-CacIk .framer-1qy114b { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; z-index: 10; }",
    ".framer-CacIk .framer-15osv68 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; left: 50%; max-width: 1540px; overflow: hidden; padding: 0px; position: fixed; top: 0px; transform: translateX(-50%); width: 100%; z-index: 1; }",
    ".framer-CacIk .framer-1m7yk5f { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: center; left: 0px; overflow: hidden; padding: 0px; position: relative; top: 0px; width: 400px; }",
    ".framer-CacIk .framer-eu137 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 800px; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 380px; z-index: 1; }",
    ".framer-CacIk .framer-187rc8f { align-content: center; align-items: center; background-color: var(--token-9bde1f78-4ca9-4486-8fc1-31c3f35d4e21, #1c3664); border-bottom-left-radius: 15px; border-bottom-right-radius: 15px; border-top-left-radius: 15px; border-top-right-radius: 15px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; height: 54.25vh; justify-content: space-between; overflow: visible; padding: 0px; pointer-events: auto; position: relative; width: 400px; z-index: 1; }",
    ".framer-CacIk .framer-uvjknm { align-content: center; align-items: center; display: flex; flex: 0.9 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: flex-start; padding: 48px; position: relative; width: 1px; z-index: 1; }",
    ".framer-CacIk .framer-144xu0w-container, .framer-CacIk .framer-13oq9sc-container, .framer-CacIk .framer-1lxqg2f-container, .framer-CacIk .framer-1oawkpd-container, .framer-CacIk .framer-1aw20d8-container, .framer-CacIk .framer-yle7l6-container { flex: none; height: auto; position: relative; width: 90%; }",
    ".framer-CacIk .framer-gcvtsl { align-content: flex-start; align-items: flex-start; align-self: stretch; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: auto; justify-content: flex-start; overflow: auto; padding: 0px; position: relative; width: 1px; z-index: 7; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-CacIk.framer-18oda3j, .framer-CacIk .framer-1a06t1c, .framer-CacIk .framer-t3l13x, .framer-CacIk .framer-wihk6b, .framer-CacIk .framer-28jrge, .framer-CacIk .framer-sa5hnr, .framer-CacIk .framer-s6m53n, .framer-CacIk .framer-nm0ikv, .framer-CacIk .framer-1hg5wdu, .framer-CacIk .framer-1x24jff, .framer-CacIk .framer-18z1jzc, .framer-CacIk .framer-1ouw02o, .framer-CacIk .framer-1boqtvh, .framer-CacIk .framer-1y2dv23, .framer-CacIk .framer-1rxj0w1, .framer-CacIk .framer-1uvzzs6, .framer-CacIk .framer-1nko6ww, .framer-CacIk .framer-1ubi6hg, .framer-CacIk .framer-f0xdgz, .framer-CacIk .framer-1a7bs04, .framer-CacIk .framer-avx6mw, .framer-CacIk .framer-tryz2c, .framer-CacIk .framer-qbgm69, .framer-CacIk .framer-69ea2v, .framer-CacIk .framer-106jc55, .framer-CacIk .framer-xe0474, .framer-CacIk .framer-1wijqoy, .framer-CacIk .framer-vv1jrc, .framer-CacIk .framer-1261yhd, .framer-CacIk .framer-jnm6wk, .framer-CacIk .framer-g98yis, .framer-CacIk .framer-zsje82, .framer-CacIk .framer-yjzruh, .framer-CacIk .framer-1vy4v2, .framer-CacIk .framer-g1ueej, .framer-CacIk .framer-3p4opu, .framer-CacIk .framer-a6fuxj, .framer-CacIk .framer-1k2r7fq, .framer-CacIk .framer-1n46uon, .framer-CacIk .framer-3egmf7, .framer-CacIk .framer-7i1v0w, .framer-CacIk .framer-i2rcf0, .framer-CacIk .framer-pecmdd, .framer-CacIk .framer-1itas1o, .framer-CacIk .framer-1niytn, .framer-CacIk .framer-ybzgtm, .framer-CacIk .framer-1xunj3i, .framer-CacIk .framer-1encm2n, .framer-CacIk .framer-1mewfbx, .framer-CacIk .framer-bqaqqm, .framer-CacIk .framer-hh5gom, .framer-CacIk .framer-2tsoyv, .framer-CacIk .framer-11a32oa, .framer-CacIk .framer-il55l2, .framer-CacIk .framer-r1l2tq, .framer-CacIk .framer-whs8ci, .framer-CacIk .framer-15osv68, .framer-CacIk .framer-1m7yk5f, .framer-CacIk .framer-eu137, .framer-CacIk .framer-srx6on, .framer-CacIk .framer-uvjknm, .framer-CacIk .framer-aong3m, .framer-CacIk .framer-gcvtsl { gap: 0px; } .framer-CacIk.framer-18oda3j > *, .framer-CacIk .framer-t3l13x > *, .framer-CacIk .framer-28jrge > *, .framer-CacIk .framer-s6m53n > *, .framer-CacIk .framer-nm0ikv > *, .framer-CacIk .framer-1hg5wdu > *, .framer-CacIk .framer-18z1jzc > *, .framer-CacIk .framer-1rxj0w1 > *, .framer-CacIk .framer-1uvzzs6 > *, .framer-CacIk .framer-1nko6ww > *, .framer-CacIk .framer-f0xdgz > *, .framer-CacIk .framer-qbgm69 > *, .framer-CacIk .framer-69ea2v > *, .framer-CacIk .framer-106jc55 > *, .framer-CacIk .framer-1wijqoy > *, .framer-CacIk .framer-g98yis > *, .framer-CacIk .framer-zsje82 > *, .framer-CacIk .framer-yjzruh > *, .framer-CacIk .framer-g1ueej > *, .framer-CacIk .framer-1n46uon > *, .framer-CacIk .framer-3egmf7 > *, .framer-CacIk .framer-7i1v0w > *, .framer-CacIk .framer-pecmdd > *, .framer-CacIk .framer-1xunj3i > *, .framer-CacIk .framer-1encm2n > *, .framer-CacIk .framer-1mewfbx > *, .framer-CacIk .framer-hh5gom > *, .framer-CacIk .framer-1m7yk5f > *, .framer-CacIk .framer-eu137 > *, .framer-CacIk .framer-gcvtsl > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-CacIk.framer-18oda3j > :first-child, .framer-CacIk .framer-t3l13x > :first-child, .framer-CacIk .framer-wihk6b > :first-child, .framer-CacIk .framer-28jrge > :first-child, .framer-CacIk .framer-s6m53n > :first-child, .framer-CacIk .framer-nm0ikv > :first-child, .framer-CacIk .framer-1hg5wdu > :first-child, .framer-CacIk .framer-18z1jzc > :first-child, .framer-CacIk .framer-1ouw02o > :first-child, .framer-CacIk .framer-1boqtvh > :first-child, .framer-CacIk .framer-1rxj0w1 > :first-child, .framer-CacIk .framer-1uvzzs6 > :first-child, .framer-CacIk .framer-1nko6ww > :first-child, .framer-CacIk .framer-f0xdgz > :first-child, .framer-CacIk .framer-1a7bs04 > :first-child, .framer-CacIk .framer-avx6mw > :first-child, .framer-CacIk .framer-qbgm69 > :first-child, .framer-CacIk .framer-69ea2v > :first-child, .framer-CacIk .framer-106jc55 > :first-child, .framer-CacIk .framer-1wijqoy > :first-child, .framer-CacIk .framer-vv1jrc > :first-child, .framer-CacIk .framer-1261yhd > :first-child, .framer-CacIk .framer-g98yis > :first-child, .framer-CacIk .framer-zsje82 > :first-child, .framer-CacIk .framer-yjzruh > :first-child, .framer-CacIk .framer-g1ueej > :first-child, .framer-CacIk .framer-3p4opu > :first-child, .framer-CacIk .framer-a6fuxj > :first-child, .framer-CacIk .framer-1n46uon > :first-child, .framer-CacIk .framer-3egmf7 > :first-child, .framer-CacIk .framer-7i1v0w > :first-child, .framer-CacIk .framer-pecmdd > :first-child, .framer-CacIk .framer-1itas1o > :first-child, .framer-CacIk .framer-1niytn > :first-child, .framer-CacIk .framer-1xunj3i > :first-child, .framer-CacIk .framer-1encm2n > :first-child, .framer-CacIk .framer-1mewfbx > :first-child, .framer-CacIk .framer-hh5gom > :first-child, .framer-CacIk .framer-2tsoyv > :first-child, .framer-CacIk .framer-11a32oa > :first-child, .framer-CacIk .framer-1m7yk5f > :first-child, .framer-CacIk .framer-eu137 > :first-child, .framer-CacIk .framer-srx6on > :first-child, .framer-CacIk .framer-uvjknm > :first-child, .framer-CacIk .framer-aong3m > :first-child, .framer-CacIk .framer-gcvtsl > :first-child { margin-top: 0px; } .framer-CacIk.framer-18oda3j > :last-child, .framer-CacIk .framer-t3l13x > :last-child, .framer-CacIk .framer-wihk6b > :last-child, .framer-CacIk .framer-28jrge > :last-child, .framer-CacIk .framer-s6m53n > :last-child, .framer-CacIk .framer-nm0ikv > :last-child, .framer-CacIk .framer-1hg5wdu > :last-child, .framer-CacIk .framer-18z1jzc > :last-child, .framer-CacIk .framer-1ouw02o > :last-child, .framer-CacIk .framer-1boqtvh > :last-child, .framer-CacIk .framer-1rxj0w1 > :last-child, .framer-CacIk .framer-1uvzzs6 > :last-child, .framer-CacIk .framer-1nko6ww > :last-child, .framer-CacIk .framer-f0xdgz > :last-child, .framer-CacIk .framer-1a7bs04 > :last-child, .framer-CacIk .framer-avx6mw > :last-child, .framer-CacIk .framer-qbgm69 > :last-child, .framer-CacIk .framer-69ea2v > :last-child, .framer-CacIk .framer-106jc55 > :last-child, .framer-CacIk .framer-1wijqoy > :last-child, .framer-CacIk .framer-vv1jrc > :last-child, .framer-CacIk .framer-1261yhd > :last-child, .framer-CacIk .framer-g98yis > :last-child, .framer-CacIk .framer-zsje82 > :last-child, .framer-CacIk .framer-yjzruh > :last-child, .framer-CacIk .framer-g1ueej > :last-child, .framer-CacIk .framer-3p4opu > :last-child, .framer-CacIk .framer-a6fuxj > :last-child, .framer-CacIk .framer-1n46uon > :last-child, .framer-CacIk .framer-3egmf7 > :last-child, .framer-CacIk .framer-7i1v0w > :last-child, .framer-CacIk .framer-pecmdd > :last-child, .framer-CacIk .framer-1itas1o > :last-child, .framer-CacIk .framer-1niytn > :last-child, .framer-CacIk .framer-1xunj3i > :last-child, .framer-CacIk .framer-1encm2n > :last-child, .framer-CacIk .framer-1mewfbx > :last-child, .framer-CacIk .framer-hh5gom > :last-child, .framer-CacIk .framer-2tsoyv > :last-child, .framer-CacIk .framer-11a32oa > :last-child, .framer-CacIk .framer-1m7yk5f > :last-child, .framer-CacIk .framer-eu137 > :last-child, .framer-CacIk .framer-srx6on > :last-child, .framer-CacIk .framer-uvjknm > :last-child, .framer-CacIk .framer-aong3m > :last-child, .framer-CacIk .framer-gcvtsl > :last-child { margin-bottom: 0px; } .framer-CacIk .framer-1a06t1c > *, .framer-CacIk .framer-sa5hnr > *, .framer-CacIk .framer-1x24jff > *, .framer-CacIk .framer-1y2dv23 > *, .framer-CacIk .framer-1ubi6hg > *, .framer-CacIk .framer-tryz2c > *, .framer-CacIk .framer-xe0474 > *, .framer-CacIk .framer-jnm6wk > *, .framer-CacIk .framer-1vy4v2 > *, .framer-CacIk .framer-1k2r7fq > *, .framer-CacIk .framer-i2rcf0 > *, .framer-CacIk .framer-ybzgtm > *, .framer-CacIk .framer-bqaqqm > *, .framer-CacIk .framer-15osv68 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-CacIk .framer-1a06t1c > :first-child, .framer-CacIk .framer-sa5hnr > :first-child, .framer-CacIk .framer-1x24jff > :first-child, .framer-CacIk .framer-1y2dv23 > :first-child, .framer-CacIk .framer-1ubi6hg > :first-child, .framer-CacIk .framer-tryz2c > :first-child, .framer-CacIk .framer-xe0474 > :first-child, .framer-CacIk .framer-jnm6wk > :first-child, .framer-CacIk .framer-1vy4v2 > :first-child, .framer-CacIk .framer-1k2r7fq > :first-child, .framer-CacIk .framer-i2rcf0 > :first-child, .framer-CacIk .framer-ybzgtm > :first-child, .framer-CacIk .framer-bqaqqm > :first-child, .framer-CacIk .framer-il55l2 > :first-child, .framer-CacIk .framer-r1l2tq > :first-child, .framer-CacIk .framer-whs8ci > :first-child, .framer-CacIk .framer-15osv68 > :first-child { margin-left: 0px; } .framer-CacIk .framer-1a06t1c > :last-child, .framer-CacIk .framer-sa5hnr > :last-child, .framer-CacIk .framer-1x24jff > :last-child, .framer-CacIk .framer-1y2dv23 > :last-child, .framer-CacIk .framer-1ubi6hg > :last-child, .framer-CacIk .framer-tryz2c > :last-child, .framer-CacIk .framer-xe0474 > :last-child, .framer-CacIk .framer-jnm6wk > :last-child, .framer-CacIk .framer-1vy4v2 > :last-child, .framer-CacIk .framer-1k2r7fq > :last-child, .framer-CacIk .framer-i2rcf0 > :last-child, .framer-CacIk .framer-ybzgtm > :last-child, .framer-CacIk .framer-bqaqqm > :last-child, .framer-CacIk .framer-il55l2 > :last-child, .framer-CacIk .framer-r1l2tq > :last-child, .framer-CacIk .framer-whs8ci > :last-child, .framer-CacIk .framer-15osv68 > :last-child { margin-right: 0px; } .framer-CacIk .framer-wihk6b > *, .framer-CacIk .framer-1boqtvh > *, .framer-CacIk .framer-avx6mw > *, .framer-CacIk .framer-1261yhd > *, .framer-CacIk .framer-a6fuxj > *, .framer-CacIk .framer-1niytn > *, .framer-CacIk .framer-11a32oa > *, .framer-CacIk .framer-srx6on > *, .framer-CacIk .framer-uvjknm > *, .framer-CacIk .framer-aong3m > * { margin: 0px; margin-bottom: calc(10px / 2); margin-top: calc(10px / 2); } .framer-CacIk .framer-1ouw02o > *, .framer-CacIk .framer-1a7bs04 > *, .framer-CacIk .framer-vv1jrc > *, .framer-CacIk .framer-3p4opu > *, .framer-CacIk .framer-1itas1o > *, .framer-CacIk .framer-2tsoyv > * { margin: 0px; margin-bottom: calc(38px / 2); margin-top: calc(38px / 2); } .framer-CacIk .framer-il55l2 > *, .framer-CacIk .framer-whs8ci > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-CacIk .framer-r1l2tq > * { margin: 0px; margin-left: calc(20px / 2); margin-right: calc(20px / 2); } }",
    "@media (min-width: 1200px) { .framer-CacIk .hidden-18oda3j { display: none !important; } }",
    "@media (max-width: 1199px) { .framer-CacIk .hidden-p363ye { display: none !important; } .framer-CacIk.framer-18oda3j { width: 390px; } .framer-CacIk .framer-1xxbq53-container, .framer-CacIk .framer-sa5hnr { order: 0; } .framer-CacIk .framer-12f3lu4-container, .framer-CacIk .framer-1y2dv23 { order: 1; } .framer-CacIk .framer-1a06t1c { order: 4; padding: 80px 0px 82px 0px; } .framer-CacIk .framer-18z1jzc { z-index: -1; } .framer-CacIk .framer-1ouw02o { gap: 42px; } .framer-CacIk .framer-tryz2c { order: 2; } .framer-CacIk .framer-jnm6wk { order: 3; } .framer-CacIk .framer-1k2r7fq { order: 4; } .framer-CacIk .framer-ybzgtm { order: 5; } .framer-CacIk .framer-127ahf { align-content: flex-end; align-items: flex-end; background-color: var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, #f5f9fc); flex-direction: column; opacity: unset; order: 2; z-index: 8; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-CacIk .framer-1ouw02o, .framer-CacIk .framer-127ahf { gap: 0px; } .framer-CacIk .framer-1ouw02o > * { margin: 0px; margin-bottom: calc(42px / 2); margin-top: calc(42px / 2); } .framer-CacIk .framer-1ouw02o > :first-child { margin-top: 0px; } .framer-CacIk .framer-1ouw02o > :last-child { margin-bottom: 0px; } .framer-CacIk .framer-127ahf > *, .framer-CacIk .framer-127ahf > :first-child, .framer-CacIk .framer-127ahf > :last-child { margin: 0px; } }}",
    ...ze,
    ...je,
    ...Ve,
    ...Ne,
    '.framer-CacIk[data-hide-scrollbars="true"]::-webkit-scrollbar, .framer-CacIk [data-hide-scrollbars="true"]::-webkit-scrollbar { width: 0px; height: 0px; }',
    '.framer-CacIk[data-hide-scrollbars="true"]::-webkit-scrollbar-thumb, .framer-CacIk [data-hide-scrollbars="true"]::-webkit-scrollbar-thumb { background: transparent; }',
  ],
  Z = M(kr, br, "framer-CacIk"),
  Or = Z;
Z.displayName = "Layer2 2";
Z.defaultProps = { height: 8880, width: 1200 };
O(
  Z,
  [
    {
      explicitInter: !0,
      fonts: [
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
          url: "https://framerusercontent.com/assets/5vvr9Vy74if2I6bQbJvbw7SY1pQ.woff2",
          weight: "400",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
          url: "https://framerusercontent.com/assets/EOr0mi4hNtlgWNn9if640EZzXCo.woff2",
          weight: "400",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+1F00-1FFF",
          url: "https://framerusercontent.com/assets/Y9k9QrlZAqio88Klkmbd8VoMQc.woff2",
          weight: "400",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+0370-03FF",
          url: "https://framerusercontent.com/assets/OYrD2tBIBPvoJXiIHnLoOXnY9M.woff2",
          weight: "400",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
          url: "https://framerusercontent.com/assets/JeYwfuaPfZHQhEG8U5gtPDZ7WQ.woff2",
          weight: "400",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
          url: "https://framerusercontent.com/assets/vQyevYAyHtARFwPqUzQGpnDs.woff2",
          weight: "400",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB",
          url: "https://framerusercontent.com/assets/b6Y37FthZeALduNqHicBT6FutY.woff2",
          weight: "400",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
          url: "https://framerusercontent.com/assets/DpPBYI0sL4fYLgAkX8KXOPVt7c.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
          url: "https://framerusercontent.com/assets/4RAEQdEOrcnDkhHiiCbJOw92Lk.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+1F00-1FFF",
          url: "https://framerusercontent.com/assets/1K3W8DizY3v4emK8Mb08YHxTbs.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+0370-03FF",
          url: "https://framerusercontent.com/assets/tUSCtfYVM1I1IchuyCwz9gDdQ.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
          url: "https://framerusercontent.com/assets/VgYFWiwsAC5OYxAycRXXvhze58.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
          url: "https://framerusercontent.com/assets/DXD0Q7LSl7HEvDzucnyLnGBHM.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB",
          url: "https://framerusercontent.com/assets/GIryZETIX4IFypco5pYZONKhJIo.woff2",
          weight: "700",
        },
        {
          family: "Montserrat",
          source: "google",
          style: "normal",
          url: "https://fonts.gstatic.com/s/montserrat/v26/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtZ6Ew7Y3tcoqK5.woff2",
          weight: "500",
        },
      ],
    },
    ...ir,
    ...sr,
    ...or,
    ...lr,
    ...P(interExtraBoldFontDefs),
    ...P(interMediumFontDefs),
    ...P(Ae),
    ...P(fontConfig),
  ],
  { supportsExplicitInterCodegen: !0 },
);
var Yr = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "FramerbzydBB85Y",
      slots: [],
      annotations: {
        framerDisplayContentsDiv: "false",
        framerResponsiveScreen: "",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"AlOztWgAm":{"layout":["fixed","auto"]}}}',
        framerIntrinsicWidth: "1200",
        framerContractVersion: "1",
        framerIntrinsicHeight: "8880",
        framerComponentViewportWidth: "true",
        framerImmutableVariables: "true",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};
export { Yr as __FramerMetadata__, Or as default };
