/* CSS extracted to: page--home.1.css, page--home.2.css, page--home.3.css, page--home.4.css, page--home.5.css, page--home.6.css, page--home.7.css, page--home.8.css, page--home.9.css, page--home.10.css, page--home.11.css, page--home.12.css, page--home.13.css, page--home.14.css */
import { a as Ve } from "./metadata--home.mjs";
import { withScrollSnapContainer,
  MapComponent,
  MapMobile2Component,
  withScrollSnapChild,
  withScrollSnapContainerAlt } from "./chunk--framer-motion.mjs";
import "./chunk--inter-bold-font-loader.mjs";
import { a as G } from "./chunk--video-component-controls.mjs";
import { fontConfig,
  linkPresetStyles,
  cssClassScope } from "./chunk--framer-components.mjs";
import { $ as B,
  useLocale,
  ControlType,
  addPropertyControls,
  cx,
  withFXWrapper,
  useDeviceSize,
  DeviceSizeContainer,
  cssSSRMinifiedHelper,
  withCSS,
  registerCursors,
  CursorContext,
  ReactFragment,
  PropertyOverridesProvider,
  forwardRef,
  scheduleAppearAnimation,
  setAppearAnimationValues,
  useContext,
  useEffect,
  useId,
  useInsertionEffect,
  useVariantAnimationCallbacks,
  useMemo,
  useVariantState,
  useRef,
  useOnVariantChange,
  CycleSymbol,
  useComponentVariantState,
  jsx,
  jsxs,
  MotionContext,
  FrameComponent,
  RichTextComponent,
  motion,
  LayoutGroup,
  SVGComponent,
  loadFonts,
  getFonts,
  normalizeFontConfig } from "./chunk--react-and-framer-runtime.mjs";
import "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";
import { mergeVariantProps, TransitionProvider, AnimatedFragment, SPRING_STANDARD, SPRING_HEAVY, SPRING_CAPTION, EASE_STANDARD, EASE_LINEAR, TWEEN_INSTANT, TWEEN_MEDIUM, TWEEN_LONG, TWEEN_CYCLE, TWEEN_SLOW, CYCLE_INTERVAL_MS } from "./chunk--page-helpers.mjs";

/* ============================================================================
 * STRUCTURAL NAVIGATION — page--home.mjs component index
 * ============================================================================
 *
 * Shared utilities / scroll-snap setup ................ ~57–61
 *
 * COMPONENT: "Neoflix anim" (ve/Be) ................... ~62–269
 *   - Animated SVG logo with hover variant (2 variants)
 *
 * COMPONENT: "Record Reflect Refine Copy" (be) ........ ~270–547
 *   - 3-variant tabbed component (copy variant)
 *
 * COMPONENT: "Record Reflect Refine" (we) ............. ~590–932
 *   - 3-variant tabbed component (original)
 *
 * COMPONENT: "Trigger" (Ce) ........................... ~981–1088
 *   - Scroll-trigger animation component
 *
 * COMPONENT: "Decisiveness" (qe) ...................... ~1108–1280
 *   - 3-variant card (Active/Inactive/Main) with tap
 *
 * COMPONENT: "Quiet Reflection" (Re) .................. ~1317–1503
 *   - 3-variant card (Active/Inactive/Main) with tap
 *
 * COMPONENT: "Team Dynamics" (Xe) ..................... ~1540–1714
 *   - 3-variant card (Active/Inactive/Main) with tap
 *
 * COMPONENT: "Team Dynamics" continued / tab section ... ~1743–2429
 *   - Multi-tab content with video and rich text
 *
 * COMPONENT: "Story Right" (Oe) ....................... ~2440–2451
 *   - Font loader bridge
 *
 * COMPONENT: "Tunnel vision" (ke) ..................... ~2451–2636
 *   - 3-variant card (inactive/Main/Raised)
 *
 * COMPONENT: "Urgency" (Ue) ........................... ~2673–2860
 *   - 3-variant card (Inactive/Main/Raised)
 *
 * COMPONENT: "Coordination" (Ie) ...................... ~2897–3089
 *   - 3-variant card (Inactive/Main/Raised)
 *
 * COMPONENT: "Story Left2" (_e) ....................... ~3118–3901
 *   - Multi-tab content with video and rich text
 *
 * COMPONENT: "Neoflix anim" (cr = Be, duplicate removed) ~3902
 *   - Alias to first "Neoflix anim" — duplicate was removed
 *
 * PAGE ASSEMBLY: "Home" (De) .......................... ~3903–5466
 *   - Main page component, scroll-snap sections, font loading
 *
 * EXPORTS / page metadata ............................. ~5466–end
 * ============================================================================ */

var scrollSnapStyle = {
    scrollSnapAlign: "start",
    scrollSnapStop: "always",
    transition: "scroll-snap-align 1s ease-in-out",
  },
  withScrollSnap = (t) => (a) => jsx(t, { ...a, style: scrollSnapStyle });
var FXDiv = withFXWrapper(motion.div),
  ra = { h9tfYk7K5: { hover: true } },
  NeoflixAnim_cycleOrder = ["I5QaL6oi8", "h9tfYk7K5"],
  ta = "framer-Kv8wc",
  NeoflixAnim_variantClassNames = { h9tfYk7K5: "framer-v-1kdysgy", I5QaL6oi8: "framer-v-yyb023" };
var sa = {
    opacity: 0,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.01,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
    x: 0,
    y: 0,
  },
  fa = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
    x: 0,
    y: 0,
  },
  la = {
    opacity: 0.001,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.01,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  },
  ca = { "Variant 1": "I5QaL6oi8", "Variant 2": "h9tfYk7K5" },
  resolveNeoflixAnimProps = ({ height: t, id: a, width: n, ...i }) => {
    var o, f;
    return {
      ...i,
      variant:
        (f = (o = ca[i.variant]) !== null && o !== undefined ? o : i.variant) !==
          null && f !== undefined
          ? f
          : "I5QaL6oi8",
    };
  },
  NeoflixAnim_layoutKey = (t, a) => a.join("-") + t.layoutDependency,
  _NeoflixAnim = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      { style, className, layoutId, variant, ...restProps } = resolveNeoflixAnimProps(props),
      {
        baseVariant,
        classNames,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: NeoflixAnim_cycleOrder,
        defaultVariant: "I5QaL6oi8",
        enabledGestures: ra,
        variant: variant,
        variantClassNames: NeoflixAnim_variantClassNames,
      }),
      v = NeoflixAnim_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      m = activeVariantCallback(async (...Y) => {
        await delay(() => setVariant("h9tfYk7K5"), 400);
      }),
      h = activeVariantCallback(async (...Y) => {
        (setGestureState({ isPressed: false }), setVariant("I5QaL6oi8"));
      });
    useOnVariantChange(baseVariant, { default: m });
    let localRef = useRef(null),
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: SPRING_HEAVY,
          children: jsxs(FXDiv, {
            ...restProps,
            className: cx(ta, ...additionalClassNames, "framer-yyb023", className, classNames),
            "data-framer-name": "Variant 1",
            "data-highlight": true,
            layoutDependency: v,
            layoutId: "I5QaL6oi8",
            onHoverEnd: () => setGestureState({ isHovered: false }),
            onHoverStart: () => setGestureState({ isHovered: true }),
            onTap: () => setGestureState({ isPressed: false }),
            onTapCancel: () => setGestureState({ isPressed: false }),
            onTapStart: () => setGestureState({ isPressed: true }),
            ref: forwardedRef ?? localRef,
            style: { ...style },
            ...mergeVariantProps(
              {
                "h9tfYk7K5-hover": {
                  __framer__presenceAnimate: setAppearAnimationValues(
                    "animate",
                    "pbltdq",
                    fa,
                    undefined,
                  ),
                  __framer__presenceExit: sa,
                  __framer__presenceInitial: setAppearAnimationValues(
                    "initial",
                    "pbltdq",
                    la,
                    undefined,
                  ),
                  __perspectiveFX: false,
                  __smartComponentFX: true,
                  __targetOpacity: 1,
                  "data-framer-appear-id": "pbltdq",
                  "data-framer-name": undefined,
                },
                h9tfYk7K5: { "data-framer-name": "Variant 2", onTap: h },
              },
              baseVariant,
              gestureVariant,
            ),
            children: [
              jsx(SVGComponent, {
                className: "framer-1nwrmj9",
                "data-framer-name": "Inner Ring",
                fill: "black",
                intrinsicHeight: 395,
                intrinsicWidth: 395,
                layoutDependency: v,
                layoutId: "GpQarFo4G",
                style: { rotate: -62 },
                svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 395.143 395.143"><defs><style>.cls-1{fill:#48c1c4}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M68.664 203.057c0 31.323 6.78 58.493 19.181 80.236 27.063 8.452 61.456 13.315 104.457 13.315-50.166 0-80.117-34.965-80.117-93.53 0-51.308 42.387-93.05 94.485-93.05 42.066 0 76.288 34.008 76.288 75.808 0-41.614-4.335-75.061-11.905-101.505a118.552 118.552 0 0 0-63.596-18.507c-76.531 0-138.793 61.563-138.793 137.233Z"/><circle cx="197.571" cy="197.571" r="197.571" style="fill:none"/><circle class="cls-1" cx="197.571" cy="197.571" r="34.485"/></g></g></svg>',
                variants: {
                  "h9tfYk7K5-hover": { rotate: -6 },
                  h9tfYk7K5: { rotate: 0 },
                },
                withExternalLayout: true,
              }),
              jsx(SVGComponent, {
                className: "framer-1fz3tc2",
                "data-framer-name": "Outer Ring",
                fill: "black",
                intrinsicHeight: 395,
                intrinsicWidth: 395,
                layoutDependency: v,
                layoutId: "bxUtsItPi",
                style: { rotate: 97 },
                svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 395.143 395.143"><defs><style>.cls-1{fill:#48c1c4}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M24.017 244.38c4.284 54.074 50.404 96.432 167.829 96.432-46.821 0-83.27-21.173-104.001-57.52-29.517-9.218-50.277-22.719-63.828-38.911Zm206.89-227.371C133.3-60.031-60.1 143.865 24.017 244.38c-7.567-95.518 115.45-227.574 206.89-227.372Zm95.571 167.314c0-122.473-42.457-167.197-95.57-167.314 16.905 13.343 30.929 35.126 40.145 67.322 33.252 21.039 55.425 57.945 55.425 99.992Z"/><circle cx="197.571" cy="197.571" r="197.571" style="fill:none"/><circle class="cls-1" cx="197.571" cy="197.571" r="34.485"/></g></g></svg>',
                variants: {
                  "h9tfYk7K5-hover": { rotate: 5 },
                  h9tfYk7K5: { rotate: 0 },
                },
                withExternalLayout: true,
              }),
              jsx(SVGComponent, {
                className: "framer-v5bumn",
                "data-framer-name": "Neoflix",
                fill: "black",
                intrinsicHeight: 198,
                intrinsicWidth: 895,
                layoutDependency: v,
                layoutId: "hFmAPTsEi",
                svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 894.846 198.191"><g data-name="Layer 2"><path d="M129.67 137.377 26.207 3.003H0v192.458h32.486V60.476l103.736 134.985h25.934V3.003H129.67v134.374zm163.518-69.949q-13.654-8.19-32.759-8.19-19.387 0-34.534 8.873a63.203 63.203 0 0 0-23.75 24.433q-8.6 15.56-8.599 36.307 0 21.294 8.872 36.854a60.123 60.123 0 0 0 25.252 24.024q16.38 8.464 39.038 8.462a94.357 94.357 0 0 0 28.936-4.64q14.467-4.64 24.024-12.558l-9.555-22.931a61.517 61.517 0 0 1-20.474 10.783 76.356 76.356 0 0 1-22.385 3.412q-13.655 0-22.932-4.914a31.287 31.287 0 0 1-13.922-14.741 50.002 50.002 0 0 1-4.183-16.107h95.635v-10.1q0-20.743-7.507-35.762a55.137 55.137 0 0 0-21.158-23.204Zm-50.913 20.338q8.049-5.323 19.519-5.323 15.285 0 23.477 9.964 7.26 8.838 8.08 24.433h-67.052a50.525 50.525 0 0 1 3.691-14.06 33.567 33.567 0 0 1 12.285-15.014Zm203.512-20.064q-15.292-8.46-36.035-8.463-20.749 0-36.035 8.463a59.168 59.168 0 0 0-23.75 24.023q-8.465 15.56-8.462 36.853 0 21.294 8.463 36.99a58.914 58.914 0 0 0 23.75 24.16q15.285 8.464 36.034 8.463 20.743 0 36.035-8.463a58.966 58.966 0 0 0 23.75-24.16q8.459-15.694 8.463-36.99 0-21.293-8.463-36.853a59.22 59.22 0 0 0-23.75-24.023ZM434.321 161.2q-9.284 11.055-24.569 11.056-15.291 0-24.57-11.056-9.283-11.056-9.28-32.623 0-21.837 9.28-32.622 9.279-10.781 24.57-10.783 15.285 0 24.57 10.783 9.277 10.787 9.281 32.622 0 21.569-9.282 32.623ZM552.25 40.949a21.29 21.29 0 0 1 9.555-9.419q6.552-3.41 17.471-3.958l12.558-.819-2.184-25.115-13.377.819q-31.396 1.913-46.272 16.38-14.882 14.472-14.877 42.86v.272h-25.661V87.63h25.661v107.831h34.123V87.63h36.308V61.969h-36.308v-5.733q0-9.277 3.004-15.287Zm108.104 129.124a22.255 22.255 0 0 1-11.465-2.73 16.656 16.656 0 0 1-6.961-8.327 35.192 35.192 0 0 1-2.32-13.512V3.003h-34.125v144.139q0 25.119 11.33 38.083 11.324 12.968 35.08 12.966a70.83 70.83 0 0 0 9.963-.683q4.773-.683 9.691-1.774l.547-27.026a28.85 28.85 0 0 1-5.734 1.092q-3.007.275-6.006.273Zm32.209-108.104h34.124v133.493h-34.124zM690.379 0h38.219v33.305h-38.219zm204.467 195.461-56.274-68.807 52.725-64.685H851.44l-32.213 41.186-32.213-41.186h-39.856l52.426 64.562-55.975 68.93h39.856l35.508-45.148 35.743 45.148h40.13z" style="fill:#1c3664" data-name="Layer 1"/></g></svg>',
                withExternalLayout: true,
              }),
            ],
          }),
        }),
      }),
    });
  }),
  NeoflixAnim_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-Kv8wc.framer-1lhwvl1, .framer-Kv8wc .framer-1lhwvl1 { display: block; }",
    ".framer-Kv8wc.framer-yyb023 { height: 287px; overflow: visible; position: relative; width: 935px; }",
    ".framer-Kv8wc .framer-1nwrmj9 { aspect-ratio: 1 / 1; bottom: -42px; flex: none; left: -43px; position: absolute; top: -43px; width: var(--framer-aspect-ratio-supported, 372px); z-index: 1; }",
    ".framer-Kv8wc .framer-1fz3tc2 { aspect-ratio: 1 / 1; bottom: -43px; flex: none; left: -43px; position: absolute; top: -42px; width: var(--framer-aspect-ratio-supported, 372px); z-index: 1; }",
    ".framer-Kv8wc .framer-v5bumn { aspect-ratio: 4.52020202020202 / 1; bottom: 0px; flex: none; height: 50%; position: absolute; right: 0px; width: var(--framer-aspect-ratio-supported, 646px); z-index: 1; }",
    ".framer-Kv8wc.framer-v-1kdysgy.framer-yyb023 { cursor: pointer; }",
  ],
  NeoflixAnim = withCSS(_NeoflixAnim, NeoflixAnim_css, "framer-Kv8wc");
NeoflixAnim.displayName = "Neoflix anim";
NeoflixAnim.defaultProps = { height: 287, width: 935 };
addPropertyControls(NeoflixAnim, {
  variant: {
    options: ["I5QaL6oi8", "h9tfYk7K5"],
    optionTitles: ["Variant 1", "Variant 2"],
    title: "Variant",
    type: ControlType.Enum,
  },
});
loadFonts(NeoflixAnim, [{ explicitInter: true, fonts: [] }], { supportsExplicitInterCodegen: true });
var RecordReflectRefineCopy_cycleOrder = ["jPAyFUDCD", "KVq4FzV2g", "ak_u9yeBh"],
  ya = "framer-Kt2aq",
  RecordReflectRefineCopy_variantClassNames = {
    ak_u9yeBh: "framer-v-tsw57o",
    jPAyFUDCD: "framer-v-1mo43e9",
    KVq4FzV2g: "framer-v-1xs1f2",
  };
var wa = {
    "Variant 1": "jPAyFUDCD",
    "Variant 2": "KVq4FzV2g",
    "Variant 3": "ak_u9yeBh",
  },
  resolveRecordReflectRefineCopyProps = ({ height: t, id: a, width: n, ...i }) => {
    var o, f;
    return {
      ...i,
      variant:
        (f = (o = wa[i.variant]) !== null && o !== undefined ? o : i.variant) !==
          null && f !== undefined
          ? f
          : "jPAyFUDCD",
    };
  },
  RecordReflectRefineCopy_layoutKey = (t, a) => a.join("-") + t.layoutDependency,
  _RecordReflectRefineCopy = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      { style, className, layoutId, variant, ...restProps } = resolveRecordReflectRefineCopyProps(props),
      {
        baseVariant,
        classNames,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: RecordReflectRefineCopy_cycleOrder,
        defaultVariant: "jPAyFUDCD",
        variant: variant,
        variantClassNames: RecordReflectRefineCopy_variantClassNames,
      }),
      v = RecordReflectRefineCopy_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      m = activeVariantCallback(async (...J) => {
        await delay(() => setVariant("KVq4FzV2g"), 1800);
      }),
      h = activeVariantCallback(async (...J) => {
        await delay(() => setVariant("ak_u9yeBh"), 1800);
      }),
      b = activeVariantCallback(async (...J) => {
        await delay(() => setVariant("jPAyFUDCD"), 1800);
      }),
      V = activeVariantCallback(async (...J) => {
        setVariant("ak_u9yeBh");
      }),
      M = activeVariantCallback(async (...J) => {
        setVariant("jPAyFUDCD");
      });
    useOnVariantChange(baseVariant, { ak_u9yeBh: b, default: m, KVq4FzV2g: h });
    let localRef = useRef(null),
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: TWEEN_INSTANT,
          children: jsx(motion.div, {
            ...restProps,
            className: cx(ya, ...additionalClassNames, "framer-1mo43e9", className, classNames),
            "data-framer-name": "Variant 1",
            "data-highlight": true,
            layoutDependency: v,
            layoutId: "jPAyFUDCD",
            onHoverEnd: () => setGestureState({ isHovered: false }),
            onHoverStart: () => setGestureState({ isHovered: true }),
            onTap: () => setGestureState({ isPressed: false }),
            onTapCancel: () => setGestureState({ isPressed: false }),
            onTapStart: () => setGestureState({ isPressed: true }),
            ref: forwardedRef ?? localRef,
            style: { ...style },
            ...mergeVariantProps(
              {
                ak_u9yeBh: { "data-framer-name": "Variant 3" },
                KVq4FzV2g: { "data-framer-name": "Variant 2" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: jsx(TransitionProvider, {
              value: TWEEN_INSTANT,
              children: jsx(RichTextComponent, {
                __fromCanvasComponent: true,
                children: jsx(ReactFragment, {
                  children: jsxs(motion.h1, {
                    style: {
                      "--font-selector": "R0Y7SW50ZXItNzAw",
                      "--framer-font-family":
                        '"Inter", "Inter Placeholder", sans-serif',
                      "--framer-font-size": "62px",
                      "--framer-font-weight": "700",
                      "--framer-letter-spacing": "-2px",
                      "--framer-text-alignment": "left",
                      "--framer-text-color":
                        "var(--extracted-gdpscs, var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55)))",
                    },
                    children: [
                      jsx(motion.span, {
                        style: {
                          "--framer-text-color":
                            "var(--extracted-1sp2osd, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                        },
                        children: jsx(motion.strong, { children: "Record," }),
                      }),
                      jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                      jsx(motion.strong, { children: "Reflect," }),
                      jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                      jsx(motion.strong, { children: "Refine:" }),
                    ],
                  }),
                }),
                className: "framer-1vt5l4u",
                fonts: ["GF;Inter-700", "GF;Inter-900"],
                layoutDependency: v,
                layoutId: "Swyv6Qqy3",
                style: {
                  "--extracted-1sp2osd":
                    "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                  "--extracted-gdpscs":
                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                  "--framer-link-text-color": "rgb(0, 153, 255)",
                  "--framer-link-text-decoration": "underline",
                  "--framer-paragraph-spacing": "0px",
                },
                variants: {
                  ak_u9yeBh: {
                    "--extracted-1sc344s":
                      "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                    "--extracted-1sp2osd":
                      "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                    "--extracted-f12k5c":
                      "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                    "--extracted-gdpscs":
                      "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                  },
                  KVq4FzV2g: {
                    "--extracted-1dy2hks":
                      "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                    "--extracted-1sc344s":
                      "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                    "--extracted-1sp2osd":
                      "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                    "--extracted-gdpscs":
                      "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                  },
                },
                verticalAlignment: "top",
                withExternalLayout: true,
                ...mergeVariantProps(
                  {
                    ak_u9yeBh: {
                      "data-highlight": true,
                      children: jsx(ReactFragment, {
                        children: jsxs(motion.h1, {
                          style: {
                            "--font-selector": "R0Y7SW50ZXItNzAw",
                            "--framer-font-family":
                              '"Inter", "Inter Placeholder", sans-serif',
                            "--framer-font-size": "62px",
                            "--framer-font-weight": "700",
                            "--framer-letter-spacing": "-2px",
                            "--framer-text-alignment": "left",
                            "--framer-text-color":
                              "var(--extracted-gdpscs, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                          },
                          children: [
                            jsx(motion.span, {
                              style: {
                                "--framer-text-color":
                                  "var(--extracted-1sp2osd, var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: "Record," }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--framer-text-color":
                                  "var(--extracted-f12k5c, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                              },
                              children: jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                            }),
                            jsx(motion.strong, { children: "Reflect," }),
                            jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                            jsx(motion.span, {
                              style: {
                                "--framer-text-color":
                                  "var(--extracted-1sc344s, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                              },
                              children: jsx(motion.strong, { children: "Refine:" }),
                            }),
                          ],
                        }),
                      }),
                      onTap: M,
                    },
                    KVq4FzV2g: {
                      "data-highlight": true,
                      children: jsx(ReactFragment, {
                        children: jsxs(motion.h1, {
                          style: {
                            "--font-selector": "R0Y7SW50ZXItNzAw",
                            "--framer-font-family":
                              '"Inter", "Inter Placeholder", sans-serif',
                            "--framer-font-size": "62px",
                            "--framer-font-weight": "700",
                            "--framer-letter-spacing": "-2px",
                            "--framer-text-alignment": "left",
                            "--framer-text-color":
                              "var(--extracted-gdpscs, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                          },
                          children: [
                            jsx(motion.span, {
                              style: {
                                "--framer-text-color":
                                  "var(--extracted-1sp2osd, var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: "Record," }),
                            }),
                            jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                            jsx(motion.strong, { children: "Reflect," }),
                            jsx(motion.span, {
                              style: {
                                "--framer-text-color":
                                  "var(--extracted-1dy2hks, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--framer-text-color":
                                  "var(--extracted-1sc344s, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: "Refine:" }),
                            }),
                          ],
                        }),
                      }),
                      onTap: V,
                    },
                  },
                  baseVariant,
                  gestureVariant,
                ),
              }),
            }),
          }),
        }),
      }),
    });
  }),
  RecordReflectRefineCopy_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-Kt2aq.framer-1npt7uu, .framer-Kt2aq .framer-1npt7uu { display: block; }",
    ".framer-Kt2aq.framer-1mo43e9 { align-content: center; align-items: center; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: auto; justify-content: center; max-width: 2018px; padding: 0px 0px 0px 0px; position: relative; width: auto; }",
    ".framer-Kt2aq .framer-1vt5l4u { -webkit-user-select: none; flex: none; height: auto; overflow: visible; position: relative; user-select: none; white-space: pre; width: auto; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-Kt2aq.framer-1mo43e9 { gap: 0px; } .framer-Kt2aq.framer-1mo43e9 > * { margin: 0px; margin-bottom: calc(20px / 2); margin-top: calc(20px / 2); } .framer-Kt2aq.framer-1mo43e9 > :first-child { margin-top: 0px; } .framer-Kt2aq.framer-1mo43e9 > :last-child { margin-bottom: 0px; } }",
    ".framer-Kt2aq.framer-v-1xs1f2 .framer-1vt5l4u, .framer-Kt2aq.framer-v-tsw57o .framer-1vt5l4u { cursor: pointer; }",
    ".framer-Kt2aq.framer-v-tsw57o.framer-1mo43e9 { gap: 0px; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-Kt2aq.framer-v-tsw57o.framer-1mo43e9 { gap: 0px; } .framer-Kt2aq.framer-v-tsw57o.framer-1mo43e9 > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-Kt2aq.framer-v-tsw57o.framer-1mo43e9 > :first-child { margin-top: 0px; } .framer-Kt2aq.framer-v-tsw57o.framer-1mo43e9 > :last-child { margin-bottom: 0px; } }",
  ],
  RecordReflectRefineCopy = withCSS(_RecordReflectRefineCopy, RecordReflectRefineCopy_css, "framer-Kt2aq");
RecordReflectRefineCopy.displayName = "Record Reflect Refine Copy";
RecordReflectRefineCopy.defaultProps = { height: 223, width: 226 };
addPropertyControls(RecordReflectRefineCopy, {
  variant: {
    options: ["jPAyFUDCD", "KVq4FzV2g", "ak_u9yeBh"],
    optionTitles: ["Variant 1", "Variant 2", "Variant 3"],
    title: "Variant",
    type: ControlType.Enum,
  },
});
loadFonts(
  RecordReflectRefineCopy,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-medium.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-bold.woff2",
          weight: "900",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var RecordReflectRefine_cycleOrder = ["Aa5IjJyQQ", "Ds7IWPpXk", "wtxEodMdN"],
  ka = "framer-ABLhs",
  RecordReflectRefine_variantClassNames = {
    Aa5IjJyQQ: "framer-v-2fjn4z",
    Ds7IWPpXk: "framer-v-wbkwq0",
    wtxEodMdN: "framer-v-10ybi4f",
  };
var _a = {
    "Variant 1": "Aa5IjJyQQ",
    "Variant 2": "Ds7IWPpXk",
    "Variant 3": "wtxEodMdN",
  },
  resolveRecordReflectRefineProps = ({ height: t, id: a, width: n, ...i }) => {
    var o, f;
    return {
      ...i,
      variant:
        (f = (o = _a[i.variant]) !== null && o !== undefined ? o : i.variant) !==
          null && f !== undefined
          ? f
          : "Aa5IjJyQQ",
    };
  },
  RecordReflectRefine_layoutKey = (t, a) =>
    t.layoutDependency ? a.join("-") + t.layoutDependency : a.join("-"),
  _RecordReflectRefine = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      { style, className, layoutId, variant, ...restProps } = resolveRecordReflectRefineProps(props),
      {
        baseVariant,
        classNames,
        clearLoadingGesture,
        gestureHandlers,
        gestureVariant,
        isLoading,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: RecordReflectRefine_cycleOrder,
        defaultVariant: "Aa5IjJyQQ",
        variant: variant,
        variantClassNames: RecordReflectRefine_variantClassNames,
      }),
      m = RecordReflectRefine_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      V = activeVariantCallback(async (...de) => {
        await delay(() => setVariant("Ds7IWPpXk"), 1800);
      }),
      M = activeVariantCallback(async (...de) => {
        await delay(() => setVariant("wtxEodMdN"), 1800);
      }),
      A = activeVariantCallback(async (...de) => {
        await delay(() => setVariant("Aa5IjJyQQ"), 1800);
      }),
      Y = activeVariantCallback(async (...de) => {
        setVariant("wtxEodMdN");
      }),
      $ = activeVariantCallback(async (...de) => {
        setVariant("Aa5IjJyQQ");
      });
    useOnVariantChange(baseVariant, { default: V, Ds7IWPpXk: M, wtxEodMdN: A });
    let localRef = useRef(null),
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: TWEEN_INSTANT,
          children: jsx(motion.div, {
            ...restProps,
            ...gestureHandlers,
            className: cx(ka, ...additionalClassNames, "framer-2fjn4z", className, classNames),
            "data-framer-name": "Variant 1",
            "data-highlight": true,
            layoutDependency: m,
            layoutId: "Aa5IjJyQQ",
            ref: forwardedRef ?? localRef,
            style: { ...style },
            ...mergeVariantProps(
              {
                Ds7IWPpXk: { "data-framer-name": "Variant 2" },
                wtxEodMdN: { "data-framer-name": "Variant 3" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: jsx(TransitionProvider, {
              value: TWEEN_INSTANT,
              children: jsx(RichTextComponent, {
                __fromCanvasComponent: true,
                children: jsx(ReactFragment, {
                  children: jsxs(motion.h1, {
                    style: {
                      "--font-selector": "R0Y7SW50ZXItNTAw",
                      "--framer-font-family":
                        '"Inter", "Inter Placeholder", sans-serif',
                      "--framer-font-size": "47px",
                      "--framer-font-weight": "500",
                      "--framer-letter-spacing": "-2px",
                      "--framer-text-alignment": "left",
                      "--framer-text-color":
                        "var(--extracted-gdpscs, var(--token-1af50db2-7d53-4f76-a442-1d2b2bb0984c, rgb(131, 130, 143)))",
                    },
                    children: [
                      jsx(motion.span, {
                        style: {
                          "--font-selector": "R0Y7SW50ZXItNzAw",
                          "--framer-font-size": "62px",
                          "--framer-font-weight": "700",
                          "--framer-text-color":
                            "var(--extracted-1sp2osd, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                        },
                        children: jsx(motion.strong, { children: "Record," }),
                      }),
                      jsx(motion.span, {
                        style: {
                          "--font-selector": "R0Y7SW50ZXItNzAw",
                          "--framer-font-size": "62px",
                          "--framer-font-weight": "700",
                          "--framer-text-color":
                            "var(--extracted-f12k5c, var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55)))",
                        },
                        children: jsx(motion.strong, {
                          children: " Reflect, Refine:",
                        }),
                      }),
                      jsx(motion.span, {
                        style: {
                          "--framer-font-size": "62px",
                          "--framer-text-color":
                            "var(--extracted-1ke0nse, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                        },
                        children: jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                      }),
                      jsx(motion.strong, {
                        children:
                          "Improve patient care through video reflection.",
                      }),
                    ],
                  }),
                }),
                className: "framer-1tufjen",
                fonts: ["GF;Inter-500", "GF;Inter-700", "GF;Inter-900"],
                layoutDependency: m,
                layoutId: "W3aGdN5VZ",
                style: {
                  "--extracted-1ke0nse":
                    "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                  "--extracted-1sp2osd":
                    "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                  "--extracted-f12k5c":
                    "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                  "--extracted-gdpscs":
                    "var(--token-1af50db2-7d53-4f76-a442-1d2b2bb0984c, rgb(131, 130, 143))",
                  "--framer-link-text-color": "rgb(0, 153, 255)",
                  "--framer-link-text-decoration": "underline",
                  "--framer-paragraph-spacing": "0px",
                },
                variants: {
                  Ds7IWPpXk: {
                    "--extracted-1dy2hks":
                      "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                    "--extracted-1sp2osd":
                      "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                    "--extracted-f12k5c":
                      "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                    "--extracted-gdpscs":
                      "var(--token-1af50db2-7d53-4f76-a442-1d2b2bb0984c, rgb(137, 130, 143))",
                  },
                  wtxEodMdN: {
                    "--extracted-1dy2hks":
                      "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                    "--extracted-1sc344s":
                      "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                    "--extracted-1sp2osd":
                      "var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55))",
                    "--extracted-f12k5c":
                      "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                  },
                },
                verticalAlignment: "top",
                withExternalLayout: true,
                ...mergeVariantProps(
                  {
                    Ds7IWPpXk: {
                      "data-highlight": true,
                      children: jsx(ReactFragment, {
                        children: jsxs(motion.h1, {
                          style: {
                            "--font-selector": "R0Y7SW50ZXItNTAw",
                            "--framer-font-family":
                              '"Inter", "Inter Placeholder", sans-serif',
                            "--framer-font-size": "47px",
                            "--framer-font-weight": "500",
                            "--framer-letter-spacing": "-2px",
                            "--framer-text-alignment": "left",
                            "--framer-text-color":
                              "var(--extracted-gdpscs, var(--token-1af50db2-7d53-4f76-a442-1d2b2bb0984c, rgb(137, 130, 143)))",
                          },
                          children: [
                            jsx(motion.span, {
                              style: {
                                "--font-selector": "R0Y7SW50ZXItNzAw",
                                "--framer-font-size": "62px",
                                "--framer-font-weight": "700",
                                "--framer-text-color":
                                  "var(--extracted-1sp2osd, var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: "Record," }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--font-selector": "R0Y7SW50ZXItNzAw",
                                "--framer-font-size": "62px",
                                "--framer-font-weight": "700",
                                "--framer-text-color":
                                  "var(--extracted-f12k5c, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                              },
                              children: jsx(motion.strong, { children: " Reflect," }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--font-selector": "R0Y7SW50ZXItNzAw",
                                "--framer-font-size": "62px",
                                "--framer-font-weight": "700",
                                "--framer-text-color":
                                  "var(--extracted-1ke0nse, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: " Refine:" }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--framer-font-size": "62px",
                                "--framer-text-color":
                                  "var(--extracted-1dy2hks, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                            }),
                            jsx(motion.strong, {
                              children:
                                "Improve patient care through video reflection.",
                            }),
                          ],
                        }),
                      }),
                      onTap: Y,
                    },
                    wtxEodMdN: {
                      "data-highlight": true,
                      children: jsx(ReactFragment, {
                        children: jsxs(motion.h1, {
                          style: {
                            "--font-selector": "R0Y7SW50ZXItNTAw",
                            "--framer-font-family":
                              '"Inter", "Inter Placeholder", sans-serif',
                            "--framer-font-size": "47px",
                            "--framer-font-weight": "500",
                            "--framer-letter-spacing": "-2px",
                            "--framer-text-alignment": "left",
                            "--framer-text-color":
                              "var(--extracted-gdpscs, var(--token-1af50db2-7d53-4f76-a442-1d2b2bb0984c, rgb(131, 130, 143)))",
                          },
                          children: [
                            jsx(motion.span, {
                              style: {
                                "--font-selector": "R0Y7SW50ZXItNzAw",
                                "--framer-font-size": "62px",
                                "--framer-font-weight": "700",
                                "--framer-text-color":
                                  "var(--extracted-1sp2osd, var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: "Record," }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--font-selector": "R0Y7SW50ZXItNzAw",
                                "--framer-font-size": "62px",
                                "--framer-font-weight": "700",
                                "--framer-text-color":
                                  "var(--extracted-f12k5c, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                              },
                              children: jsx(motion.strong, { children: " " }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--font-selector": "R0Y7SW50ZXItNzAw",
                                "--framer-font-size": "62px",
                                "--framer-font-weight": "700",
                                "--framer-text-color":
                                  "var(--extracted-1ke0nse, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: "Reflect, " }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--font-selector": "R0Y7SW50ZXItNzAw",
                                "--framer-font-size": "62px",
                                "--framer-font-weight": "700",
                                "--framer-text-color":
                                  "var(--extracted-1dy2hks, var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156)))",
                              },
                              children: jsx(motion.strong, { children: "Refine:" }),
                            }),
                            jsx(motion.span, {
                              style: {
                                "--framer-font-size": "62px",
                                "--framer-text-color":
                                  "var(--extracted-1sc344s, var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55)))",
                              },
                              children: jsx(motion.strong, { children: jsx(motion.useVariantState, {}) }),
                            }),
                            jsx(motion.strong, {
                              children:
                                "Improve patient care through video reflection.",
                            }),
                          ],
                        }),
                      }),
                      onTap: $,
                    },
                  },
                  baseVariant,
                  gestureVariant,
                ),
              }),
            }),
          }),
        }),
      }),
    });
  }),
  RecordReflectRefine_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-ABLhs.framer-1khxqi7, .framer-ABLhs .framer-1khxqi7 { display: block; }",
    ".framer-ABLhs.framer-2fjn4z { align-content: flex-start; align-items: flex-start; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; max-width: 2018px; padding: 0px; position: relative; width: 717px; }",
    ".framer-ABLhs .framer-1tufjen { -webkit-user-select: none; flex: none; height: auto; overflow: visible; position: relative; user-select: none; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-ABLhs.framer-2fjn4z { gap: 0px; } .framer-ABLhs.framer-2fjn4z > * { margin: 0px; margin-bottom: calc(20px / 2); margin-top: calc(20px / 2); } .framer-ABLhs.framer-2fjn4z > :first-child { margin-top: 0px; } .framer-ABLhs.framer-2fjn4z > :last-child { margin-bottom: 0px; } }",
    ".framer-ABLhs.framer-v-wbkwq0 .framer-1tufjen, .framer-ABLhs.framer-v-10ybi4f .framer-1tufjen { cursor: pointer; }",
  ],
  RecordReflectRefine = withCSS(_RecordReflectRefine, RecordReflectRefine_css, "framer-ABLhs");
RecordReflectRefine.displayName = "Record Reflect Refine";
RecordReflectRefine.defaultProps = { height: 187, width: 717 };
addPropertyControls(RecordReflectRefine, {
  variant: {
    options: ["Aa5IjJyQQ", "Ds7IWPpXk", "wtxEodMdN"],
    optionTitles: ["Variant 1", "Variant 2", "Variant 3"],
    title: "Variant",
    type: ControlType.Enum,
  },
});
loadFonts(
  RecordReflectRefine,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-regular.woff2",
          weight: "500",
        },
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-medium.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-bold.woff2",
          weight: "900",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var Trigger_cycleOrder = ["xKACItaHS", "rgX5PDpQJ", "xeZKtnsQM"],
  Trigger_variantClassNames = {
    rgX5PDpQJ: "framer-v-1um4wiz",
    xeZKtnsQM: "framer-v-n8ebt9",
    xKACItaHS: "framer-v-4hw3vi",
  };
var Sa = {
    "Variant 1": "xKACItaHS",
    "Variant 2": "rgX5PDpQJ",
    "Variant 3": "xeZKtnsQM",
  },
  Ta = {
    default: {
      damping: 60,
      delay: 0,
      duration: 0.3,
      ease: [0.44, 0, 0.56, 1],
      mass: 1,
      stiffness: 500,
      type: "spring" /* physics-based spring animation */,
    },
  },
  _Trigger = forwardRef(function (
    {
      id: t,
      style: a,
      className: n,
      width: i,
      height: o,
      layoutId: f,
      variant: s = "xKACItaHS",
      hover: U,
      ...C
    },
    forwardedRef,
  ) {
    let L = Sa[s] || s,
      {
        baseVariant,
        classNames,
        gestureVariant,
        setGestureState,
        setVariant,
        transition,
        variants,
      } = useComponentVariantState({
        cycleOrder: Trigger_cycleOrder,
        defaultVariant: "xKACItaHS",
        transitions: Ta,
        variant: L,
        variantClassNames: Trigger_variantClassNames,
      }),
      h = variants.join("-") + C.layoutDependency,
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      M = activeVariantCallback(async (...Y) => {
        if (U && (await U(...Y)) === false) return false;
      }),
      autoId = useId();
    return jsx(LayoutGroup, {
      id: f ?? autoId,
      children: jsx(motion.div, {
        initial: L,
        animate: variants,
        onHoverStart: () => setGestureState({ isHovered: true }),
        onHoverEnd: () => setGestureState({ isHovered: false }),
        onTapStart: () => setGestureState({ isPressed: true }),
        onTap: () => setGestureState({ isPressed: false }),
        onTapCancel: () => setGestureState({ isPressed: false }),
        className: cx("framer-7RIWM", classNames),
        style: { display: "contents" },
        children: jsx(motion.div, {
          ...C,
          className: cx("framer-4hw3vi", n),
          "data-framer-name": "Variant 1",
          "data-highlight": true,
          layoutDependency: h,
          layoutId: "xKACItaHS",
          onMouseEnter: M,
          ref: forwardedRef,
          style: {
            backgroundColor: "rgb(51, 170, 255)",
            borderBottomLeftRadius: 16,
            borderBottomRightRadius: 16,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            ...a,
          },
          transition: transition,
          variants: {
            rgX5PDpQJ: { backgroundColor: "rgb(153, 204, 102)" },
            xeZKtnsQM: { backgroundColor: "rgb(119, 85, 204)" },
          },
          ...mergeVariantProps(
            {
              rgX5PDpQJ: { "data-framer-name": "Variant 2" },
              xeZKtnsQM: { "data-framer-name": "Variant 3" },
            },
            baseVariant,
            gestureVariant,
          ),
        }),
      }),
    });
  }),
  Trigger_css = [
    '.framer-7RIWM [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }',
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-7RIWM * { box-sizing: border-box; }",
    ".framer-7RIWM .framer-ibx2dq { display: block; }",
    ".framer-7RIWM .framer-4hw3vi { height: 54px; overflow: visible; position: relative; width: 238px; }",
  ],
  Trigger = withCSS(_Trigger, Trigger_css, "framer-7RIWM");
Trigger.displayName = "Trigger";
Trigger.defaultProps = { height: 54, width: 238 };
addPropertyControls(Trigger, {
  variant: {
    options: ["xKACItaHS", "rgX5PDpQJ", "xeZKtnsQM"],
    optionTitles: ["Variant 1", "Variant 2", "Variant 3"],
    title: "Variant",
    type: ControlType.Enum,
  },
  e8FqqnNOm: { title: "Hover", type: ControlType.EventHandler },
});
loadFonts(Trigger, []);
var Decisiveness_cycleOrder = ["QCVLxQKOQ", "XVQi0W0KO", "Xwn3H48jY"],
  Ba = "framer-2FQXY",
  Decisiveness_variantClassNames = {
    QCVLxQKOQ: "framer-v-14h8w6j",
    XVQi0W0KO: "framer-v-1r41h02",
    Xwn3H48jY: "framer-v-548aw2",
  };
var Ea = (t, a) => `translateX(-50%) ${a}`,
  Qa = { Active: "XVQi0W0KO", Inactive: "Xwn3H48jY", Main: "QCVLxQKOQ" },
  resolveDecisivenessProps = ({ height: t, id: a, tap: n, width: i, ...o }) => {
    var f, s;
    return {
      ...o,
      NXCj7csO1: n ?? o.NXCj7csO1,
      variant:
        (s = (f = Qa[o.variant]) !== null && f !== undefined ? f : o.variant) !==
          null && s !== undefined
          ? s
          : "QCVLxQKOQ",
    };
  },
  Decisiveness_layoutKey = (t, a) =>
    t.layoutDependency ? a.join("-") + t.layoutDependency : a.join("-"),
  _Decisiveness = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      {
        style,
        className,
        layoutId,
        variant,
        NXCj7csO1,
        ...restProps
      } = resolveDecisivenessProps(props),
      {
        baseVariant,
        classNames,
        gestureHandlers,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: Decisiveness_cycleOrder,
        defaultVariant: "QCVLxQKOQ",
        variant: variant,
        variantClassNames: Decisiveness_variantClassNames,
      }),
      u = Decisiveness_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      b = activeVariantCallback(async (...Q) => {
        if ((setGestureState({ isPressed: false }), NXCj7csO1 && (await NXCj7csO1(...Q)) === false)) return false;
      }),
      V = activeVariantCallback(async (...Q) => {
        setVariant("XVQi0W0KO");
      });
    useOnVariantChange(baseVariant, { default: V, Xwn3H48jY: undefined });
    let localRef = useRef(null),
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: SPRING_CAPTION,
          children: jsx(motion.div, {
            ...restProps,
            ...gestureHandlers,
            className: cx(Ba, ...additionalClassNames, "framer-14h8w6j", className, classNames),
            "data-framer-name": "Main",
            "data-highlight": true,
            layoutDependency: u,
            layoutId: "QCVLxQKOQ",
            onTap: b,
            ref: forwardedRef ?? localRef,
            style: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...style,
            },
            variants: {
              XVQi0W0KO: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            },
            ...mergeVariantProps(
              {
                XVQi0W0KO: { "data-framer-name": "Active" },
                Xwn3H48jY: { "data-framer-name": "Inactive" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: jsx(RichTextComponent, {
              __fromCanvasComponent: true,
              children: jsx(ReactFragment, {
                children: jsx(motion.h2, {
                  style: {
                    "--font-selector": "R0Y7SW50ZXItNTAw",
                    "--framer-font-family":
                      '"Inter", "Inter Placeholder", sans-serif',
                    "--framer-font-size": "24px",
                    "--framer-font-weight": "500",
                    "--framer-letter-spacing": "-0.5px",
                    "--framer-line-height": "1.5em",
                    "--framer-text-alignment": "left",
                    "--framer-text-color":
                      "var(--extracted-1of0zx5, rgb(136, 136, 136))",
                  },
                  children: "Shared understanding enhances decisiveness.",
                }),
              }),
              className: "framer-1c06u0h",
              fonts: ["GF;Inter-500"],
              layoutDependency: u,
              layoutId: "KgelfXCcm",
              style: {
                "--extracted-1of0zx5": "rgb(136, 136, 136)",
                "--framer-paragraph-spacing": "0px",
              },
              transformTemplate: Ea,
              variants: {
                XVQi0W0KO: {
                  "--extracted-1of0zx5":
                    "var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62))",
                },
              },
              verticalAlignment: "top",
              withExternalLayout: true,
              ...mergeVariantProps(
                {
                  XVQi0W0KO: {
                    children: jsx(ReactFragment, {
                      children: jsx(motion.h2, {
                        style: {
                          "--font-selector": "R0Y7SW50ZXItNTAw",
                          "--framer-font-family":
                            '"Inter", "Inter Placeholder", sans-serif',
                          "--framer-font-size": "24px",
                          "--framer-font-weight": "500",
                          "--framer-letter-spacing": "-0.5px",
                          "--framer-line-height": "1.5em",
                          "--framer-text-alignment": "left",
                          "--framer-text-color":
                            "var(--extracted-1of0zx5, var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62)))",
                        },
                        children: "Shared understanding enhances decisiveness.",
                      }),
                    }),
                  },
                },
                baseVariant,
                gestureVariant,
              ),
            }),
          }),
        }),
      }),
    });
  }),
  Decisiveness_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-2FQXY.framer-1919kbd, .framer-2FQXY .framer-1919kbd { display: block; }",
    ".framer-2FQXY.framer-14h8w6j { cursor: pointer; height: 72px; overflow: visible; position: relative; width: 380px; }",
    ".framer-2FQXY .framer-1c06u0h { -webkit-user-select: none; bottom: 0px; flex: none; height: auto; left: 50%; overflow: visible; position: absolute; user-select: none; white-space: pre-wrap; width: 360px; word-break: break-word; word-wrap: break-word; }",
    ".framer-2FQXY.framer-v-1r41h02.framer-14h8w6j { overflow: hidden; will-change: var(--framer-will-change-override, transform); }",
  ],
  Decisiveness = withCSS(_Decisiveness, Decisiveness_css, "framer-2FQXY");
Decisiveness.displayName = "Decisiveness";
Decisiveness.defaultProps = { height: 72, width: 380 };
addPropertyControls(Decisiveness, {
  variant: {
    options: ["QCVLxQKOQ", "XVQi0W0KO", "Xwn3H48jY"],
    optionTitles: ["Main", "Active", "Inactive"],
    title: "Variant",
    type: ControlType.Enum,
  },
  NXCj7csO1: { title: "Tap", type: ControlType.EventHandler },
});
loadFonts(
  Decisiveness,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-regular.woff2",
          weight: "500",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var QuietReflection_cycleOrder = ["A73BIfYrH", "yFu0ego46", "Bq4Oqy1P7"],
  rt = "framer-pC2CI",
  QuietReflection_variantClassNames = {
    A73BIfYrH: "framer-v-1f4gy1p",
    Bq4Oqy1P7: "framer-v-11x7aqu",
    yFu0ego46: "framer-v-tr7mnx",
  };
var nt = (t, a) => `translateX(-50%) ${a}`,
  st = { Active: "yFu0ego46", Inactive: "Bq4Oqy1P7", Main: "A73BIfYrH" },
  resolveQuietReflectionProps = ({ height: t, id: a, tap: n, width: i, ...o }) => {
    var f, s;
    return {
      ...o,
      HEb3Jrr9H: n ?? o.HEb3Jrr9H,
      variant:
        (s = (f = st[o.variant]) !== null && f !== undefined ? f : o.variant) !==
          null && s !== undefined
          ? s
          : "A73BIfYrH",
    };
  },
  QuietReflection_layoutKey = (t, a) =>
    t.layoutDependency ? a.join("-") + t.layoutDependency : a.join("-"),
  _QuietReflection = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      {
        style,
        className,
        layoutId,
        variant,
        HEb3Jrr9H,
        ...restProps
      } = resolveQuietReflectionProps(props),
      {
        baseVariant,
        classNames,
        gestureHandlers,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: QuietReflection_cycleOrder,
        defaultVariant: "A73BIfYrH",
        variant: variant,
        variantClassNames: QuietReflection_variantClassNames,
      }),
      u = QuietReflection_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      b = activeVariantCallback(async (...J) => {
        if ((setGestureState({ isPressed: false }), HEb3Jrr9H && (await HEb3Jrr9H(...J)) === false)) return false;
      }),
      V = activeVariantCallback(async (...J) => {
        setVariant("yFu0ego46");
      }),
      M = activeVariantCallback(async (...J) => {
        setVariant("yFu0ego46");
      });
    useOnVariantChange(baseVariant, { Bq4Oqy1P7: undefined, default: V });
    let localRef = useRef(null),
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: SPRING_CAPTION,
          children: jsx(motion.div, {
            ...restProps,
            ...gestureHandlers,
            className: cx(rt, ...additionalClassNames, "framer-1f4gy1p", className, classNames),
            "data-framer-name": "Main",
            "data-highlight": true,
            layoutDependency: u,
            layoutId: "A73BIfYrH",
            onTap: b,
            ref: forwardedRef ?? localRef,
            style: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...style,
            },
            variants: {
              yFu0ego46: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            },
            ...mergeVariantProps(
              {
                Bq4Oqy1P7: { "data-framer-name": "Inactive" },
                yFu0ego46: { "data-framer-name": "Active" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: jsx(motion.div, {
              className: "framer-1aqnoq4",
              layoutDependency: u,
              layoutId: "erKigIyyG",
              transformTemplate: nt,
              children: jsx(RichTextComponent, {
                __fromCanvasComponent: true,
                children: jsx(ReactFragment, {
                  children: jsx(motion.h2, {
                    style: {
                      "--font-selector": "R0Y7SW50ZXItNTAw",
                      "--framer-font-family":
                        '"Inter", "Inter Placeholder", sans-serif',
                      "--framer-font-size": "24px",
                      "--framer-font-weight": "500",
                      "--framer-letter-spacing": "-0.5px",
                      "--framer-line-height": "1.5em",
                      "--framer-text-alignment": "left",
                      "--framer-text-color":
                        "var(--extracted-1of0zx5, var(--token-11283d1d-910e-47f4-b268-f6a3911b834b, rgb(128, 128, 128)))",
                    },
                    children: "Quiet reflection allows for sharpening skills.",
                  }),
                }),
                className: "framer-85chcm",
                "data-highlight": true,
                fonts: ["GF;Inter-500"],
                layoutDependency: u,
                layoutId: "Ni4NDiS2N",
                onTap: M,
                style: {
                  "--extracted-1of0zx5":
                    "var(--token-11283d1d-910e-47f4-b268-f6a3911b834b, rgb(128, 128, 128))",
                  "--framer-paragraph-spacing": "0px",
                },
                variants: {
                  yFu0ego46: {
                    "--extracted-1of0zx5":
                      "var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62))",
                  },
                },
                verticalAlignment: "top",
                withExternalLayout: true,
                ...mergeVariantProps(
                  {
                    yFu0ego46: {
                      children: jsx(ReactFragment, {
                        children: jsx(motion.h2, {
                          style: {
                            "--font-selector": "R0Y7SW50ZXItNTAw",
                            "--framer-font-family":
                              '"Inter", "Inter Placeholder", sans-serif',
                            "--framer-font-size": "24px",
                            "--framer-font-weight": "500",
                            "--framer-letter-spacing": "-0.5px",
                            "--framer-line-height": "1.5em",
                            "--framer-text-alignment": "left",
                            "--framer-text-color":
                              "var(--extracted-1of0zx5, var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62)))",
                          },
                          children:
                            "Quiet reflection allows for sharpening skills.",
                        }),
                      }),
                    },
                  },
                  baseVariant,
                  gestureVariant,
                ),
              }),
            }),
          }),
        }),
      }),
    });
  }),
  QuietReflection_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-pC2CI.framer-1nchnn2, .framer-pC2CI .framer-1nchnn2 { display: block; }",
    ".framer-pC2CI.framer-1f4gy1p { cursor: pointer; height: 72px; overflow: visible; position: relative; width: 380px; }",
    ".framer-pC2CI .framer-1aqnoq4 { align-content: center; align-items: center; bottom: 0px; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; left: 50%; overflow: visible; padding: 0px; position: absolute; width: 360px; }",
    ".framer-pC2CI .framer-85chcm { -webkit-user-select: none; cursor: pointer; flex: none; height: auto; overflow: visible; position: relative; user-select: none; white-space: pre-wrap; width: 360px; word-break: break-word; word-wrap: break-word; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-pC2CI .framer-1aqnoq4 { gap: 0px; } .framer-pC2CI .framer-1aqnoq4 > * { margin: 0px; margin-bottom: calc(10px / 2); margin-top: calc(10px / 2); } .framer-pC2CI .framer-1aqnoq4 > :first-child { margin-top: 0px; } .framer-pC2CI .framer-1aqnoq4 > :last-child { margin-bottom: 0px; } }",
    ".framer-pC2CI.framer-v-tr7mnx.framer-1f4gy1p { overflow: hidden; will-change: var(--framer-will-change-override, transform); }",
  ],
  QuietReflection = withCSS(_QuietReflection, QuietReflection_css, "framer-pC2CI");
QuietReflection.displayName = "Quiet Reflection";
QuietReflection.defaultProps = { height: 72, width: 380 };
addPropertyControls(QuietReflection, {
  variant: {
    options: ["A73BIfYrH", "yFu0ego46", "Bq4Oqy1P7"],
    optionTitles: ["Main", "Active", "Inactive"],
    title: "Variant",
    type: ControlType.Enum,
  },
  HEb3Jrr9H: { title: "Tap", type: ControlType.EventHandler },
});
loadFonts(
  QuietReflection,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-regular.woff2",
          weight: "500",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var TeamDynamics_cycleOrder = ["HkR7N8JHH", "qFD4z7zh2", "uLTZzDf3c"],
  pt = "framer-gdsq7",
  TeamDynamics_variantClassNames = {
    HkR7N8JHH: "framer-v-6uc7fk",
    qFD4z7zh2: "framer-v-13j692f",
    uLTZzDf3c: "framer-v-1ws1zva",
  };
var gt = (t, a) => `translate(-50%, -50%) ${a}`,
  vt = { Active: "qFD4z7zh2", Inactive: "uLTZzDf3c", Main: "HkR7N8JHH" },
  resolveTeamDynamicsProps = ({ height: t, id: a, tap: n, width: i, ...o }) => {
    var f, s;
    return {
      ...o,
      E2jYS2CvR: n ?? o.E2jYS2CvR,
      variant:
        (s = (f = vt[o.variant]) !== null && f !== undefined ? f : o.variant) !==
          null && s !== undefined
          ? s
          : "HkR7N8JHH",
    };
  },
  TeamDynamics_layoutKey = (t, a) =>
    t.layoutDependency ? a.join("-") + t.layoutDependency : a.join("-"),
  _TeamDynamics = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      {
        style,
        className,
        layoutId,
        variant,
        E2jYS2CvR,
        ...restProps
      } = resolveTeamDynamicsProps(props),
      {
        baseVariant,
        classNames,
        gestureHandlers,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: TeamDynamics_cycleOrder,
        defaultVariant: "HkR7N8JHH",
        variant: variant,
        variantClassNames: TeamDynamics_variantClassNames,
      }),
      u = TeamDynamics_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      b = activeVariantCallback(async (...Q) => {
        if ((setGestureState({ isPressed: false }), E2jYS2CvR && (await E2jYS2CvR(...Q)) === false)) return false;
      }),
      V = activeVariantCallback(async (...Q) => {
        setVariant("qFD4z7zh2");
      });
    useOnVariantChange(baseVariant, { default: V, uLTZzDf3c: undefined });
    let localRef = useRef(null),
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: SPRING_CAPTION,
          children: jsx(motion.div, {
            ...restProps,
            ...gestureHandlers,
            className: cx(pt, ...additionalClassNames, "framer-6uc7fk", className, classNames),
            "data-framer-name": "Main",
            "data-highlight": true,
            layoutDependency: u,
            layoutId: "HkR7N8JHH",
            onTap: b,
            ref: forwardedRef ?? localRef,
            style: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...style,
            },
            variants: {
              qFD4z7zh2: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            },
            ...mergeVariantProps(
              {
                qFD4z7zh2: { "data-framer-name": "Active" },
                uLTZzDf3c: { "data-framer-name": "Inactive" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: jsx(RichTextComponent, {
              __fromCanvasComponent: true,
              children: jsx(ReactFragment, {
                children: jsx(motion.h2, {
                  style: {
                    "--font-selector": "R0Y7SW50ZXItNTAw",
                    "--framer-font-family":
                      '"Inter", "Inter Placeholder", sans-serif',
                    "--framer-font-size": "24px",
                    "--framer-font-weight": "500",
                    "--framer-letter-spacing": "-0.5px",
                    "--framer-line-height": "1.5em",
                    "--framer-text-alignment": "left",
                    "--framer-text-color":
                      "var(--extracted-1of0zx5, rgb(136, 136, 136))",
                  },
                  children:
                    "Further video debriefs foster cohesion amongst peers.",
                }),
              }),
              className: "framer-1pt2td0",
              fonts: ["GF;Inter-500"],
              layoutDependency: u,
              layoutId: "IiOQvh_3z",
              style: {
                "--extracted-1of0zx5": "rgb(136, 136, 136)",
                "--framer-paragraph-spacing": "0px",
              },
              transformTemplate: gt,
              variants: {
                qFD4z7zh2: {
                  "--extracted-1of0zx5":
                    "var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62))",
                },
              },
              verticalAlignment: "top",
              withExternalLayout: true,
              ...mergeVariantProps(
                {
                  qFD4z7zh2: {
                    children: jsx(ReactFragment, {
                      children: jsx(motion.h2, {
                        style: {
                          "--font-selector": "R0Y7SW50ZXItNTAw",
                          "--framer-font-family":
                            '"Inter", "Inter Placeholder", sans-serif',
                          "--framer-font-size": "24px",
                          "--framer-font-weight": "500",
                          "--framer-letter-spacing": "-0.5px",
                          "--framer-line-height": "1.5em",
                          "--framer-text-alignment": "left",
                          "--framer-text-color":
                            "var(--extracted-1of0zx5, var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62)))",
                        },
                        children:
                          "Further video debriefs foster cohesion amongst peers.",
                      }),
                    }),
                  },
                },
                baseVariant,
                gestureVariant,
              ),
            }),
          }),
        }),
      }),
    });
  }),
  TeamDynamics_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-gdsq7.framer-71ejvw, .framer-gdsq7 .framer-71ejvw { display: block; }",
    ".framer-gdsq7.framer-6uc7fk { cursor: pointer; height: 72px; overflow: visible; position: relative; width: 380px; }",
    ".framer-gdsq7 .framer-1pt2td0 { -webkit-user-select: none; flex: none; height: auto; left: 50%; overflow: visible; position: absolute; top: 50%; user-select: none; white-space: pre-wrap; width: 360px; word-break: break-word; word-wrap: break-word; }",
    ".framer-gdsq7.framer-v-13j692f.framer-6uc7fk { overflow: hidden; will-change: var(--framer-will-change-override, transform); }",
  ],
  TeamDynamics = withCSS(_TeamDynamics, TeamDynamics_css, "framer-gdsq7");
TeamDynamics.displayName = "Team Dynamics";
TeamDynamics.defaultProps = { height: 72, width: 380 };
addPropertyControls(TeamDynamics, {
  variant: {
    options: ["HkR7N8JHH", "qFD4z7zh2", "uLTZzDf3c"],
    optionTitles: ["Main", "Active", "Inactive"],
    title: "Variant",
    type: ControlType.Enum,
  },
  E2jYS2CvR: { title: "Tap", type: ControlType.EventHandler },
});
loadFonts(
  TeamDynamics,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-regular.woff2",
          weight: "500",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var FXDiv = withFXWrapper(motion.div),
  FXLink = scheduleAppearAnimation(withFXWrapper(motion.a)),
  Rt = getFonts(Trigger),
  Xt = getFonts(QuietReflection),
  Ot = getFonts(TeamDynamics),
  kt = getFonts(Decisiveness),
  Ut = getFonts(G),
  StoryRight_cycleOrder = ["SoQlwVPaX", "CuHIQOWnA", "ggKLLEo3O"],
  _t = "framer-MY1rC",
  StoryRight_variantClassNames = {
    CuHIQOWnA: "framer-v-sltbvw",
    ggKLLEo3O: "framer-v-8q1l2i",
    SoQlwVPaX: "framer-v-1gwjjt4",
  };
var Je = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: TWEEN_LONG,
    x: 0,
    y: 0,
  },
  Ge = {
    opacity: 0.001,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  },
  $e = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    x: -410,
    y: 0,
  },
  er = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    transition: TWEEN_CYCLE,
    x: -410,
    y: 0,
  },
  Lt = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.02,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
    y: -4,
  },
  St = {
    "First Tab": "SoQlwVPaX",
    "Variant 2": "CuHIQOWnA",
    "Variant 3": "ggKLLEo3O",
  },
  resolveStoryRightProps = ({ height: t, id: a, tap: n, width: i, ...o }) => {
    var f, s;
    return {
      ...o,
      U4TM70Ust: n ?? o.U4TM70Ust,
      variant:
        (s = (f = St[o.variant]) !== null && f !== undefined ? f : o.variant) !==
          null && s !== undefined
          ? s
          : "SoQlwVPaX",
    };
  },
  StoryRight_layoutKey = (t, a) =>
    t.layoutDependency ? a.join("-") + t.layoutDependency : a.join("-"),
  _StoryRight = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      {
        style,
        className,
        layoutId,
        variant,
        U4TM70Ust,
        ...restProps
      } = resolveStoryRightProps(props),
      {
        baseVariant,
        classNames,
        clearLoadingGesture,
        gestureHandlers,
        gestureVariant,
        isLoading,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: StoryRight_cycleOrder,
        defaultVariant: "SoQlwVPaX",
        variant: variant,
        variantClassNames: StoryRight_variantClassNames,
      }),
      h = StoryRight_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      M = activeVariantCallback(async (...ye) => {
        await delay(() => setVariant(CycleSymbol), 6600);
      }),
      A = activeVariantCallback(async (...ye) => {
        if (U4TM70Ust && (await U4TM70Ust(...ye)) === false) return false;
        setVariant("SoQlwVPaX");
      }),
      Y = activeVariantCallback(async (...ye) => {
        setVariant("SoQlwVPaX");
      }),
      $ = activeVariantCallback(async (...ye) => {
        setVariant("CuHIQOWnA");
      }),
      Q = activeVariantCallback(async (...ye) => {
        setVariant("ggKLLEo3O");
      });
    useOnVariantChange(baseVariant, { default: M });
    let localRef = useRef(null),
      ce = () => !["CuHIQOWnA", "ggKLLEo3O"].includes(baseVariant),
      je = () => baseVariant === "CuHIQOWnA",
      de = () => baseVariant === "ggKLLEo3O",
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: TWEEN_MEDIUM,
          children: jsxs(motion.div, {
            ...restProps,
            ...gestureHandlers,
            className: cx(_t, ...additionalClassNames, "framer-1gwjjt4", className, classNames),
            "data-framer-name": "First Tab",
            "data-highlight": true,
            layoutDependency: h,
            layoutId: "SoQlwVPaX",
            ref: forwardedRef ?? localRef,
            style: { ...style },
            ...mergeVariantProps(
              {
                CuHIQOWnA: { "data-framer-name": "Variant 2" },
                ggKLLEo3O: { "data-framer-name": "Variant 3" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: [
              ce() &&
                jsx(B, {
                  href: { hash: ":mRVhqybMB", webPageId: "bzydBB85Y" },
                  openInNewTab: false,
                  children: jsx(FXLink, {
                    __perspectiveFX: false,
                    __smartComponentFX: true,
                    __targetOpacity: 1,
                    animate: Je,
                    className: "framer-yibhi7 framer-3s0w40",
                    "data-framer-appear-id": "yibhi7",
                    "data-framer-name": "Line1",
                    initial: Ge,
                    layoutDependency: h,
                    layoutId: "d4yrklyed",
                    optimized: true,
                    style: {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    children: jsx(motion.div, {
                      className: "framer-kf2wna",
                      layoutDependency: h,
                      layoutId: "sJrvLCmSo",
                      children: jsx(FXDiv, {
                        __framer__animate: { transition: TWEEN_CYCLE },
                        __framer__animateOnce: true,
                        __framer__enter: $e,
                        __framer__exit: er,
                        __framer__styleAppearEffectEnabled: true,
                        __framer__threshold: 0.5,
                        __perspectiveFX: false,
                        __smartComponentFX: true,
                        __targetOpacity: 1,
                        className: "framer-1vbzu8s",
                        "data-framer-name": "Line",
                        layoutDependency: h,
                        layoutId: "mDHudrKYZ",
                        style: {
                          backgroundColor:
                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          transformPerspective: 1200,
                        },
                      }),
                    }),
                  }),
                }),
              je() &&
                jsx(B, {
                  href: { hash: ":NYP2seWhD", webPageId: "bzydBB85Y" },
                  openInNewTab: false,
                  children: jsx(FXLink, {
                    __perspectiveFX: false,
                    __smartComponentFX: true,
                    __targetOpacity: 1,
                    animate: Je,
                    className: "framer-pm8gf7 framer-3s0w40",
                    "data-framer-appear-id": "pm8gf7",
                    "data-framer-name": "Line2",
                    initial: Ge,
                    layoutDependency: h,
                    layoutId: "AOX7QIi27",
                    optimized: true,
                    style: {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    children: jsx(motion.div, {
                      className: "framer-12ws8fg",
                      layoutDependency: h,
                      layoutId: "HA4XkAUHM",
                      children: jsx(FXDiv, {
                        __framer__animate: { transition: TWEEN_CYCLE },
                        __framer__animateOnce: true,
                        __framer__enter: $e,
                        __framer__exit: er,
                        __framer__styleAppearEffectEnabled: true,
                        __framer__threshold: 0.5,
                        __perspectiveFX: false,
                        __smartComponentFX: true,
                        __targetOpacity: 1,
                        className: "framer-1xiqm97",
                        "data-framer-name": "Line",
                        layoutDependency: h,
                        layoutId: "ZIkCL7Bu3",
                        style: {
                          backgroundColor:
                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          transformPerspective: 1200,
                        },
                      }),
                    }),
                  }),
                }),
              de() &&
                jsx(B, {
                  href: { hash: ":DXqsCYt4L", webPageId: "bzydBB85Y" },
                  openInNewTab: false,
                  children: jsx(FXLink, {
                    __perspectiveFX: false,
                    __smartComponentFX: true,
                    __targetOpacity: 1,
                    animate: Je,
                    className: "framer-18rxxtg framer-3s0w40",
                    "data-framer-appear-id": "18rxxtg",
                    "data-framer-name": "Line3",
                    initial: Ge,
                    layoutDependency: h,
                    layoutId: "KkDnWBjxk",
                    optimized: true,
                    style: {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    children: jsx(motion.div, {
                      className: "framer-1scv3mw",
                      layoutDependency: h,
                      layoutId: "Xhd69UAep",
                      children: jsx(FXDiv, {
                        __framer__animate: { transition: TWEEN_CYCLE },
                        __framer__animateOnce: true,
                        __framer__enter: $e,
                        __framer__exit: er,
                        __framer__styleAppearEffectEnabled: true,
                        __framer__threshold: 0.5,
                        __perspectiveFX: false,
                        __smartComponentFX: true,
                        __targetOpacity: 1,
                        className: "framer-12uz4g5",
                        "data-framer-name": "Line",
                        layoutDependency: h,
                        layoutId: "AMhooyiTh",
                        style: {
                          backgroundColor:
                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          transformPerspective: 1200,
                        },
                      }),
                    }),
                  }),
                }),
              jsx(B, {
                href: { webPageId: "sfcH2behU" },
                openInNewTab: false,
                children: jsxs(motion.a, {
                  className: "framer-1q8th58 framer-3s0w40",
                  "data-framer-name": "hovertriggers",
                  layoutDependency: h,
                  layoutId: "IaUgOVncF",
                  children: [
                    jsx(DeviceSizeContainer, {
                      children: jsx(motion.div, {
                        className: "framer-1dg46b4-container",
                        layoutDependency: h,
                        layoutId: "mwqNaEEJ5-container",
                        style: { opacity: 0 },
                        children: jsx(Trigger, {
                          height: "100%",
                          id: "mwqNaEEJ5",
                          layoutId: "mwqNaEEJ5",
                          style: { height: "100%", width: "100%" },
                          variant: "xKACItaHS",
                          width: "100%",
                          ...mergeVariantProps(
                            {
                              CuHIQOWnA: { hover: A },
                              ggKLLEo3O: { hover: Y },
                            },
                            baseVariant,
                            gestureVariant,
                          ),
                        }),
                      }),
                    }),
                    jsx(DeviceSizeContainer, {
                      children: jsx(motion.div, {
                        className: "framer-38lnyz-container",
                        layoutDependency: h,
                        layoutId: "qkqShLL2U-container",
                        style: { opacity: 0 },
                        children: jsx(Trigger, {
                          height: "100%",
                          hover: $,
                          id: "qkqShLL2U",
                          layoutId: "qkqShLL2U",
                          style: { height: "100%", width: "100%" },
                          variant: "rgX5PDpQJ",
                          width: "100%",
                        }),
                      }),
                    }),
                    jsx(DeviceSizeContainer, {
                      children: jsx(motion.div, {
                        className: "framer-1jkfppu-container",
                        layoutDependency: h,
                        layoutId: "B8p7HqPsG-container",
                        style: { opacity: 0 },
                        children: jsx(Trigger, {
                          height: "100%",
                          hover: Q,
                          id: "B8p7HqPsG",
                          layoutId: "B8p7HqPsG",
                          style: { height: "100%", width: "100%" },
                          variant: "xeZKtnsQM",
                          width: "100%",
                        }),
                      }),
                    }),
                  ],
                }),
              }),
              jsxs(motion.div, {
                className: "framer-1sr9rsy",
                "data-framer-name": "Captions",
                layoutDependency: h,
                layoutId: "BgqK63l7f",
                children: [
                  jsx(DeviceSizeContainer, {
                    width: "380px",
                    children: jsx(motion.div, {
                      className: "framer-1x25rle-container",
                      layoutDependency: h,
                      layoutId: "cMLiBJIJv-container",
                      children: jsx(QuietReflection, {
                        height: "100%",
                        id: "cMLiBJIJv",
                        layoutId: "cMLiBJIJv",
                        style: { height: "100%", width: "100%" },
                        variant: "A73BIfYrH",
                        width: "100%",
                        ...mergeVariantProps(
                          {
                            CuHIQOWnA: { variant: "Bq4Oqy1P7" },
                            ggKLLEo3O: { variant: "Bq4Oqy1P7" },
                          },
                          baseVariant,
                          gestureVariant,
                        ),
                      }),
                    }),
                  }),
                  jsx(DeviceSizeContainer, {
                    width: "380px",
                    children: jsx(motion.div, {
                      className: "framer-93qqv0-container",
                      layoutDependency: h,
                      layoutId: "qdfY4PCfH-container",
                      children: jsx(TeamDynamics, {
                        height: "100%",
                        id: "qdfY4PCfH",
                        layoutId: "qdfY4PCfH",
                        style: { height: "100%", width: "100%" },
                        variant: "uLTZzDf3c",
                        width: "100%",
                        ...mergeVariantProps({ CuHIQOWnA: { variant: "HkR7N8JHH" } }, baseVariant, gestureVariant),
                      }),
                    }),
                  }),
                  jsx(DeviceSizeContainer, {
                    width: "380px",
                    children: jsx(motion.div, {
                      className: "framer-ptft8n-container",
                      layoutDependency: h,
                      layoutId: "imXFxFHKL-container",
                      children: jsx(Decisiveness, {
                        height: "100%",
                        id: "imXFxFHKL",
                        layoutId: "imXFxFHKL",
                        style: { height: "100%", width: "100%" },
                        variant: "Xwn3H48jY",
                        width: "100%",
                        ...mergeVariantProps({ ggKLLEo3O: { variant: "QCVLxQKOQ" } }, baseVariant, gestureVariant),
                      }),
                    }),
                  }),
                  jsx(motion.div, {
                    className: "framer-wcqno7",
                    layoutDependency: h,
                    layoutId: "rZWg2VUnG",
                    style: {
                      backgroundColor:
                        "var(--token-c0c800ee-fb80-4c6c-9156-db7383f7e366, rgb(232, 232, 232))",
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      boxShadow: "1px 2px 2px 0px rgba(0,0,0,0.25)",
                    },
                  }),
                ],
              }),
              jsx(FrameComponent, {
                background: {
                  alt: "",
                  fit: "fill",
                  intrinsicHeight: 720,
                  intrinsicWidth: 960,
                },
                className: "framer-czj9l",
                "data-framer-name": "Image",
                layoutDependency: h,
                layoutId: "kpWjsC16r",
                style: {
                  borderBottomLeftRadius: 20,
                  borderBottomRightRadius: 20,
                  borderTopLeftRadius: 20,
                  borderTopRightRadius: 20,
                },
                children: jsx(B, {
                  href: { hash: ":mRVhqybMB", webPageId: "bzydBB85Y" },
                  openInNewTab: false,
                  smoothScroll: true,
                  ...mergeVariantProps(
                    {
                      CuHIQOWnA: {
                        href: { hash: ":NYP2seWhD", webPageId: "bzydBB85Y" },
                      },
                      ggKLLEo3O: {
                        href: { hash: ":DXqsCYt4L", webPageId: "bzydBB85Y" },
                      },
                    },
                    baseVariant,
                    gestureVariant,
                  ),
                  children: jsxs(motion.a, {
                    className: "framer-763a3a framer-3s0w40",
                    layoutDependency: h,
                    layoutId: "J3f2kPx1k",
                    style: {
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      boxShadow: "1px 2px 2px 0px rgba(0,0,0,0.25)",
                    },
                    whileHover: Lt,
                    children: [
                      jsx(DeviceSizeContainer, {
                        children: jsx(motion.div, {
                          className: "framer-idlw4i-container",
                          "data-framer-name": "vbroadeningperspectives",
                          layoutDependency: h,
                          layoutId: "mwMMXlRlp-container",
                          name: "vbroadeningperspectives",
                          style: { opacity: 0 },
                          variants: { ggKLLEo3O: { opacity: 1 } },
                          children: jsx(G, {
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            borderRadius: 0,
                            bottomLeftRadius: 0,
                            bottomRightRadius: 0,
                            controls: false,
                            height: "100%",
                            id: "mwMMXlRlp",
                            isMixedBorderRadius: false,
                            layoutId: "mwMMXlRlp",
                            loop: true,
                            muted: true,
                            name: "vbroadeningperspectives",
                            objectFit: "contain",
                            playing: true,
                            posterEnabled: false,
                            srcFile:
                              "./assets/cexyfedyhdwvyi0kgvaz2qgg38.webm",
                            srcType: "Upload",
                            srcUrl:
                              "./assets/mixkit-clouds-sky.mp4",
                            startTime: 0,
                            style: { height: "100%", width: "100%" },
                            topLeftRadius: 0,
                            topRightRadius: 0,
                            volume: 25,
                            width: "100%",
                          }),
                        }),
                      }),
                      jsx(DeviceSizeContainer, {
                        children: jsx(motion.div, {
                          className: "framer-1878zvf-container",
                          "data-framer-name": "vsharpeningskills",
                          layoutDependency: h,
                          layoutId: "LewgSSbxg-container",
                          name: "vsharpeningskills",
                          style: { opacity: 1 },
                          variants: {
                            CuHIQOWnA: { opacity: 0 },
                            ggKLLEo3O: { opacity: 0 },
                          },
                          children: jsx(G, {
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            borderRadius: 0,
                            bottomLeftRadius: 0,
                            bottomRightRadius: 0,
                            controls: false,
                            height: "100%",
                            id: "LewgSSbxg",
                            isMixedBorderRadius: false,
                            layoutId: "LewgSSbxg",
                            loop: true,
                            muted: true,
                            name: "vsharpeningskills",
                            objectFit: "contain",
                            playing: true,
                            posterEnabled: false,
                            srcFile:
                              "./assets/lkbbehx9min328birbog9cugfvc.webm",
                            srcType: "Upload",
                            srcUrl:
                              "./assets/mixkit-clouds-sky.mp4",
                            startTime: 0,
                            style: { height: "100%", width: "100%" },
                            topLeftRadius: 0,
                            topRightRadius: 0,
                            volume: 25,
                            width: "100%",
                          }),
                        }),
                      }),
                      jsx(DeviceSizeContainer, {
                        children: jsx(motion.div, {
                          className: "framer-1hj8jok-container",
                          "data-framer-name": "vteamdynamics",
                          layoutDependency: h,
                          layoutId: "sK_XsYxr3-container",
                          name: "vteamdynamics",
                          style: { opacity: 0 },
                          variants: { CuHIQOWnA: { opacity: 1 } },
                          children: jsx(G, {
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            borderRadius: 0,
                            bottomLeftRadius: 0,
                            bottomRightRadius: 0,
                            controls: false,
                            height: "100%",
                            id: "sK_XsYxr3",
                            isMixedBorderRadius: false,
                            layoutId: "sK_XsYxr3",
                            loop: true,
                            muted: true,
                            name: "vteamdynamics",
                            objectFit: "contain",
                            playing: true,
                            posterEnabled: false,
                            srcFile:
                              "./assets/kvutgkencjuuy3cn6trl9fqjxgq.webm",
                            srcType: "Upload",
                            srcUrl:
                              "./assets/mixkit-clouds-sky.mp4",
                            startTime: 0,
                            style: { height: "100%", width: "100%" },
                            topLeftRadius: 0,
                            topRightRadius: 0,
                            volume: 25,
                            width: "100%",
                          }),
                        }),
                      }),
                    ],
                  }),
                }),
              }),
            ],
          }),
        }),
      }),
    });
  }),
  StoryRight_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-MY1rC.framer-3s0w40, .framer-MY1rC .framer-3s0w40 { display: block; }",
    ".framer-MY1rC.framer-1gwjjt4 { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: wrap; gap: 80px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 1000px; }",
    ".framer-MY1rC .framer-yibhi7 { flex: none; height: 89px; left: -15px; overflow: hidden; position: absolute; text-decoration: none; top: 40px; width: 410px; will-change: var(--framer-will-change-override, transform); z-index: 7; }",
    ".framer-MY1rC .framer-kf2wna, .framer-MY1rC .framer-12ws8fg, .framer-MY1rC .framer-1scv3mw { align-content: center; align-items: center; bottom: 0px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 2px; justify-content: center; left: 0px; overflow: hidden; padding: 0px; position: absolute; right: 0px; z-index: 10; }",
    ".framer-MY1rC .framer-1vbzu8s, .framer-MY1rC .framer-1xiqm97, .framer-MY1rC .framer-12uz4g5 { align-content: flex-start; align-items: flex-start; bottom: 0px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; justify-content: center; left: calc(50.00000000000002% - 410px / 2); overflow: visible; padding: 0px; position: absolute; top: 0px; width: 410px; z-index: 1; }",
    ".framer-MY1rC .framer-pm8gf7 { flex: none; height: 89px; left: -15px; overflow: hidden; position: absolute; text-decoration: none; top: calc(50.28409090909093% - 89px / 2); width: 410px; will-change: var(--framer-will-change-override, transform); z-index: 7; }",
    ".framer-MY1rC .framer-18rxxtg { bottom: 37px; flex: none; height: 89px; left: -15px; overflow: hidden; position: absolute; text-decoration: none; width: 410px; will-change: var(--framer-will-change-override, transform); z-index: 7; }",
    ".framer-MY1rC .framer-1q8th58 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 21px; height: 256px; justify-content: center; left: calc(19.00000000000002% - 379px / 2); overflow: visible; padding: 0px; position: absolute; text-decoration: none; top: calc(50.28409090909093% - 256px / 2); width: 379px; z-index: 1; }",
    ".framer-MY1rC .framer-1dg46b4-container, .framer-MY1rC .framer-38lnyz-container, .framer-MY1rC .framer-1jkfppu-container { flex: none; height: 72px; position: relative; width: 382px; }",
    ".framer-MY1rC .framer-1sr9rsy { align-content: flex-end; align-items: flex-end; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; padding: 0px; position: relative; width: min-content; }",
    ".framer-MY1rC .framer-1x25rle-container, .framer-MY1rC .framer-93qqv0-container, .framer-MY1rC .framer-ptft8n-container { flex: none; height: 72px; position: relative; width: 380px; }",
    ".framer-MY1rC .framer-wcqno7 { flex: none; height: 90px; left: -15px; overflow: visible; position: absolute; right: -15px; top: -9px; z-index: -1; }",
    ".framer-MY1rC .framer-czj9l { align-content: center; align-items: center; aspect-ratio: 1.5325 / 1; display: flex; flex: 2 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: var(--framer-aspect-ratio-supported, 352px); justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 1px; will-change: var(--framer-will-change-override, transform); }",
    ".framer-MY1rC .framer-763a3a { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 352px; justify-content: center; overflow: hidden; padding: 0px; position: relative; text-decoration: none; width: 540px; will-change: var(--framer-will-change-override, transform); z-index: 1; }",
    ".framer-MY1rC .framer-idlw4i-container, .framer-MY1rC .framer-1878zvf-container { bottom: -4px; flex: none; left: -47px; position: absolute; right: -48px; top: 0px; z-index: 1; }",
    ".framer-MY1rC .framer-1hj8jok-container { bottom: -2px; flex: none; left: -47px; position: absolute; right: -48px; top: -2px; z-index: 1; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-MY1rC.framer-1gwjjt4, .framer-MY1rC .framer-kf2wna, .framer-MY1rC .framer-1vbzu8s, .framer-MY1rC .framer-12ws8fg, .framer-MY1rC .framer-1xiqm97, .framer-MY1rC .framer-1scv3mw, .framer-MY1rC .framer-12uz4g5, .framer-MY1rC .framer-1q8th58, .framer-MY1rC .framer-1sr9rsy, .framer-MY1rC .framer-czj9l, .framer-MY1rC .framer-763a3a { gap: 0px; } .framer-MY1rC.framer-1gwjjt4 > * { margin: 0px; margin-left: calc(80px / 2); margin-right: calc(80px / 2); } .framer-MY1rC.framer-1gwjjt4 > :first-child, .framer-MY1rC .framer-kf2wna > :first-child, .framer-MY1rC .framer-1vbzu8s > :first-child, .framer-MY1rC .framer-12ws8fg > :first-child, .framer-MY1rC .framer-1xiqm97 > :first-child, .framer-MY1rC .framer-1scv3mw > :first-child, .framer-MY1rC .framer-12uz4g5 > :first-child, .framer-MY1rC .framer-763a3a > :first-child { margin-left: 0px; } .framer-MY1rC.framer-1gwjjt4 > :last-child, .framer-MY1rC .framer-kf2wna > :last-child, .framer-MY1rC .framer-1vbzu8s > :last-child, .framer-MY1rC .framer-12ws8fg > :last-child, .framer-MY1rC .framer-1xiqm97 > :last-child, .framer-MY1rC .framer-1scv3mw > :last-child, .framer-MY1rC .framer-12uz4g5 > :last-child, .framer-MY1rC .framer-763a3a > :last-child { margin-right: 0px; } .framer-MY1rC .framer-kf2wna > *, .framer-MY1rC .framer-1vbzu8s > *, .framer-MY1rC .framer-12ws8fg > *, .framer-MY1rC .framer-1xiqm97 > *, .framer-MY1rC .framer-1scv3mw > *, .framer-MY1rC .framer-12uz4g5 > *, .framer-MY1rC .framer-763a3a > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-MY1rC .framer-1q8th58 > * { margin: 0px; margin-bottom: calc(21px / 2); margin-top: calc(21px / 2); } .framer-MY1rC .framer-1q8th58 > :first-child, .framer-MY1rC .framer-1sr9rsy > :first-child, .framer-MY1rC .framer-czj9l > :first-child { margin-top: 0px; } .framer-MY1rC .framer-1q8th58 > :last-child, .framer-MY1rC .framer-1sr9rsy > :last-child, .framer-MY1rC .framer-czj9l > :last-child { margin-bottom: 0px; } .framer-MY1rC .framer-1sr9rsy > *, .framer-MY1rC .framer-czj9l > * { margin: 0px; margin-bottom: calc(20px / 2); margin-top: calc(20px / 2); } }",
    ".framer-MY1rC.framer-v-sltbvw .framer-wcqno7 { top: calc(50.00000000000002% - 90px / 2); }",
    ".framer-MY1rC.framer-v-8q1l2i .framer-wcqno7 { bottom: -11px; top: unset; }",
  ],
  StoryRight = withCSS(_StoryRight, StoryRight_css, "framer-MY1rC");
StoryRight.displayName = "Story Right";
StoryRight.defaultProps = { height: 352, width: 1e3 };
addPropertyControls(StoryRight, {
  variant: {
    options: ["SoQlwVPaX", "CuHIQOWnA", "ggKLLEo3O"],
    optionTitles: ["First Tab", "Variant 2", "Variant 3"],
    title: "Variant",
    type: ControlType.Enum,
  },
  U4TM70Ust: { title: "Tap", type: ControlType.EventHandler },
});
loadFonts(StoryRight, [{ explicitInter: true, fonts: [] }, ...Rt, ...Xt, ...Ot, ...kt, ...Ut], {
  supportsExplicitInterCodegen: true,
});
var TunnelVision_cycleOrder = ["NFc0G3jDM", "NH6OUC_9N", "Bx08xEGah"],
  At = "framer-Z1wid",
  TunnelVision_variantClassNames = {
    Bx08xEGah: "framer-v-s81sxb",
    NFc0G3jDM: "framer-v-r8ywzq",
    NH6OUC_9N: "framer-v-3v0an8",
  };
var Kt = (t, a) => `translateX(-50%) ${a}`,
  Zt = { "Variant 1": "NFc0G3jDM", Inactive: "Bx08xEGah", Raised: "NH6OUC_9N" },
  resolveTunnelVisionProps = ({ height: t, id: a, tap: n, width: i, ...o }) => {
    var f, s;
    return {
      ...o,
      UGmfn7WC9: n ?? o.UGmfn7WC9,
      variant:
        (s = (f = Zt[o.variant]) !== null && f !== undefined ? f : o.variant) !==
          null && s !== undefined
          ? s
          : "NFc0G3jDM",
    };
  },
  TunnelVision_layoutKey = (t, a) => a.join("-") + t.layoutDependency,
  _TunnelVision = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      {
        style,
        className,
        layoutId,
        variant,
        UGmfn7WC9,
        ...restProps
      } = resolveTunnelVisionProps(props),
      {
        baseVariant,
        classNames,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: TunnelVision_cycleOrder,
        defaultVariant: "NFc0G3jDM",
        variant: variant,
        variantClassNames: TunnelVision_variantClassNames,
      }),
      x = TunnelVision_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      h = activeVariantCallback(async (...Q) => {
        if ((setGestureState({ isPressed: false }), UGmfn7WC9 && (await UGmfn7WC9(...Q)) === false)) return false;
      }),
      b = activeVariantCallback(async (...Q) => {
        setVariant("NH6OUC_9N");
      }),
      V = activeVariantCallback(async (...Q) => {
        setVariant("NH6OUC_9N");
      });
    useOnVariantChange(baseVariant, { Bx08xEGah: undefined, default: b });
    let localRef = useRef(null),
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: SPRING_CAPTION,
          children: jsx(motion.div, {
            ...restProps,
            className: cx(At, ...additionalClassNames, "framer-r8ywzq", className, classNames),
            "data-framer-name": "Variant 1",
            "data-highlight": true,
            layoutDependency: x,
            layoutId: "NFc0G3jDM",
            onHoverEnd: () => setGestureState({ isHovered: false }),
            onHoverStart: () => setGestureState({ isHovered: true }),
            onTap: h,
            onTapCancel: () => setGestureState({ isPressed: false }),
            onTapStart: () => setGestureState({ isPressed: true }),
            ref: forwardedRef ?? localRef,
            style: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...style,
            },
            variants: {
              NH6OUC_9N: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            },
            ...mergeVariantProps(
              {
                Bx08xEGah: { "data-framer-name": "Inactive" },
                NH6OUC_9N: { "data-framer-name": "Raised" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: jsx(RichTextComponent, {
              __fromCanvasComponent: true,
              children: jsx(ReactFragment, {
                children: jsx(motion.h2, {
                  style: {
                    "--font-selector": "R0Y7SW50ZXItNTAw",
                    "--framer-font-family":
                      '"Inter", "Inter Placeholder", sans-serif',
                    "--framer-font-size": "24px",
                    "--framer-font-weight": "500",
                    "--framer-letter-spacing": "-0.5px",
                    "--framer-line-height": "1.5em",
                    "--framer-text-alignment": "right",
                    "--framer-text-color":
                      "var(--extracted-1of0zx5, var(--token-11283d1d-910e-47f4-b268-f6a3911b834b, rgb(128, 128, 128)))",
                  },
                  children:
                    "Task-driven focus can lead to tunnel vision and misalignment.",
                }),
              }),
              className: "framer-1i486jk",
              "data-highlight": true,
              fonts: ["GF;Inter-500"],
              layoutDependency: x,
              layoutId: "oD0eK4xzU",
              onTap: V,
              style: {
                "--extracted-1of0zx5":
                  "var(--token-11283d1d-910e-47f4-b268-f6a3911b834b, rgb(128, 128, 128))",
                "--framer-paragraph-spacing": "0px",
              },
              transformTemplate: Kt,
              variants: {
                NH6OUC_9N: {
                  "--extracted-1of0zx5":
                    "var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62))",
                },
              },
              verticalAlignment: "top",
              withExternalLayout: true,
              ...mergeVariantProps(
                {
                  Bx08xEGah: { "data-highlight": undefined, onTap: undefined },
                  NH6OUC_9N: {
                    "data-highlight": undefined,
                    children: jsx(ReactFragment, {
                      children: jsx(motion.h2, {
                        style: {
                          "--font-selector": "R0Y7SW50ZXItNTAw",
                          "--framer-font-family":
                            '"Inter", "Inter Placeholder", sans-serif',
                          "--framer-font-size": "24px",
                          "--framer-font-weight": "500",
                          "--framer-letter-spacing": "-0.5px",
                          "--framer-line-height": "1.5em",
                          "--framer-text-alignment": "right",
                          "--framer-text-color":
                            "var(--extracted-1of0zx5, var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62)))",
                        },
                        children:
                          "Task-driven focus can lead to tunnel vision and misalignment.",
                      }),
                    }),
                    onTap: undefined,
                  },
                },
                baseVariant,
                gestureVariant,
              ),
            }),
          }),
        }),
      }),
    });
  }),
  TunnelVision_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-Z1wid.framer-5pcjz4, .framer-Z1wid .framer-5pcjz4 { display: block; }",
    ".framer-Z1wid.framer-r8ywzq { cursor: pointer; height: 72px; overflow: visible; position: relative; width: 380px; }",
    ".framer-Z1wid .framer-1i486jk { -webkit-user-select: none; bottom: 0px; cursor: pointer; flex: none; height: auto; left: 50%; overflow: visible; position: absolute; user-select: none; white-space: pre-wrap; width: 360px; word-break: break-word; word-wrap: break-word; }",
    ".framer-Z1wid.framer-v-3v0an8.framer-r8ywzq { overflow: hidden; will-change: var(--framer-will-change-override, transform); }",
    ".framer-Z1wid.framer-v-3v0an8 .framer-1i486jk, .framer-Z1wid.framer-v-s81sxb .framer-1i486jk { cursor: unset; }",
  ],
  TunnelVision = withCSS(_TunnelVision, TunnelVision_css, "framer-Z1wid");
TunnelVision.displayName = "Tunnel vision";
TunnelVision.defaultProps = { height: 72, width: 380 };
addPropertyControls(TunnelVision, {
  variant: {
    options: ["NFc0G3jDM", "NH6OUC_9N", "Bx08xEGah"],
    optionTitles: ["Variant 1", "Raised", "Inactive"],
    title: "Variant",
    type: ControlType.Enum,
  },
  UGmfn7WC9: { title: "Tap", type: ControlType.EventHandler },
});
loadFonts(
  TunnelVision,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-regular.woff2",
          weight: "500",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var Urgency_cycleOrder = ["zsZ4Z5z6N", "j8drpudA2", "gO1Oy0ksh"],
  an = "framer-0umfc",
  Urgency_variantClassNames = {
    gO1Oy0ksh: "framer-v-138ztx9",
    j8drpudA2: "framer-v-1elz6w7",
    zsZ4Z5z6N: "framer-v-1g1moqd",
  };
var on = (t, a) => `translateY(-50%) ${a}`,
  ln = { inactive: "gO1Oy0ksh", Main: "zsZ4Z5z6N", Raised: "j8drpudA2" },
  resolveUrgencyProps = ({ height: t, id: a, tap: n, width: i, ...o }) => {
    var f, s;
    return {
      ...o,
      mBC2PxMBg: n ?? o.mBC2PxMBg,
      variant:
        (s = (f = ln[o.variant]) !== null && f !== undefined ? f : o.variant) !==
          null && s !== undefined
          ? s
          : "zsZ4Z5z6N",
    };
  },
  Urgency_layoutKey = (t, a) => a.join("-") + t.layoutDependency,
  _Urgency = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      {
        style,
        className,
        layoutId,
        variant,
        mBC2PxMBg,
        ...restProps
      } = resolveUrgencyProps(props),
      {
        baseVariant,
        classNames,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: Urgency_cycleOrder,
        defaultVariant: "zsZ4Z5z6N",
        variant: variant,
        variantClassNames: Urgency_variantClassNames,
      }),
      x = Urgency_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      h = activeVariantCallback(async (...Q) => {
        if ((setGestureState({ isPressed: false }), mBC2PxMBg && (await mBC2PxMBg(...Q)) === false)) return false;
      }),
      b = activeVariantCallback(async (...Q) => {
        setVariant("j8drpudA2");
      });
    useOnVariantChange(baseVariant, { default: b, gO1Oy0ksh: undefined });
    let localRef = useRef(null),
      M = () => baseVariant !== "j8drpudA2",
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: SPRING_CAPTION,
          children: jsxs(motion.div, {
            ...restProps,
            className: cx(an, ...additionalClassNames, "framer-1g1moqd", className, classNames),
            "data-framer-name": "Main",
            "data-highlight": true,
            layoutDependency: x,
            layoutId: "zsZ4Z5z6N",
            onHoverEnd: () => setGestureState({ isHovered: false }),
            onHoverStart: () => setGestureState({ isHovered: true }),
            onTap: h,
            onTapCancel: () => setGestureState({ isPressed: false }),
            onTapStart: () => setGestureState({ isPressed: true }),
            ref: forwardedRef ?? localRef,
            style: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...style,
            },
            variants: {
              j8drpudA2: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            },
            ...mergeVariantProps(
              {
                gO1Oy0ksh: { "data-framer-name": "inactive" },
                j8drpudA2: { "data-framer-name": "Raised" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: [
              M() &&
                jsx(motion.div, {
                  className: "framer-zcizhz",
                  layoutDependency: x,
                  layoutId: "IXgMWqBN9",
                  transformTemplate: on,
                }),
              jsx(RichTextComponent, {
                __fromCanvasComponent: true,
                children: jsx(ReactFragment, {
                  children: jsx(motion.h2, {
                    style: {
                      "--font-selector": "R0Y7SW50ZXItNTAw",
                      "--framer-font-family":
                        '"Inter", "Inter Placeholder", sans-serif',
                      "--framer-font-size": "24px",
                      "--framer-font-weight": "500",
                      "--framer-letter-spacing": "-0.5px",
                      "--framer-line-height": "1.5em",
                      "--framer-text-alignment": "right",
                      "--framer-text-color":
                        "var(--extracted-1of0zx5, var(--token-11283d1d-910e-47f4-b268-f6a3911b834b, rgb(128, 128, 128)))",
                    },
                    children:
                      "Medical interventions demand precision and urgency.",
                  }),
                }),
                className: "framer-7j382z",
                fonts: ["GF;Inter-500"],
                layoutDependency: x,
                layoutId: "U54kHzfoR",
                style: {
                  "--extracted-1of0zx5":
                    "var(--token-11283d1d-910e-47f4-b268-f6a3911b834b, rgb(128, 128, 128))",
                  "--framer-paragraph-spacing": "0px",
                },
                variants: {
                  j8drpudA2: {
                    "--extracted-1of0zx5":
                      "var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(89, 89, 89))",
                  },
                },
                verticalAlignment: "top",
                withExternalLayout: true,
                ...mergeVariantProps(
                  {
                    j8drpudA2: {
                      children: jsx(ReactFragment, {
                        children: jsx(motion.h2, {
                          style: {
                            "--font-selector": "R0Y7SW50ZXItNTAw",
                            "--framer-font-family":
                              '"Inter", "Inter Placeholder", sans-serif',
                            "--framer-font-size": "24px",
                            "--framer-font-weight": "500",
                            "--framer-letter-spacing": "-0.5px",
                            "--framer-line-height": "1.5em",
                            "--framer-text-alignment": "right",
                            "--framer-text-color":
                              "var(--extracted-1of0zx5, var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(89, 89, 89)))",
                          },
                          children:
                            "Medical interventions demand precision and urgency.",
                        }),
                      }),
                    },
                  },
                  baseVariant,
                  gestureVariant,
                ),
              }),
            ],
          }),
        }),
      }),
    });
  }),
  Urgency_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-0umfc.framer-ut790n, .framer-0umfc .framer-ut790n { display: block; }",
    ".framer-0umfc.framer-1g1moqd { cursor: pointer; height: 72px; overflow: visible; position: relative; width: 380px; }",
    ".framer-0umfc .framer-zcizhz { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; left: 0px; min-height: 72px; overflow: visible; padding: 0px; position: absolute; top: 50%; width: 360px; }",
    ".framer-0umfc .framer-7j382z { -webkit-user-select: none; bottom: 0px; flex: none; height: auto; left: 0px; overflow: visible; position: absolute; user-select: none; white-space: pre-wrap; width: 360px; word-break: break-word; word-wrap: break-word; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-0umfc .framer-zcizhz { gap: 0px; } .framer-0umfc .framer-zcizhz > * { margin: 0px; margin-bottom: calc(10px / 2); margin-top: calc(10px / 2); } .framer-0umfc .framer-zcizhz > :first-child { margin-top: 0px; } .framer-0umfc .framer-zcizhz > :last-child { margin-bottom: 0px; } }",
    ".framer-0umfc.framer-v-1elz6w7.framer-1g1moqd { width: 410px; }",
  ],
  Urgency = withCSS(_Urgency, Urgency_css, "framer-0umfc");
Urgency.displayName = "Urgency";
Urgency.defaultProps = { height: 72, width: 380 };
addPropertyControls(Urgency, {
  variant: {
    options: ["zsZ4Z5z6N", "j8drpudA2", "gO1Oy0ksh"],
    optionTitles: ["Main", "Raised", "inactive"],
    title: "Variant",
    type: ControlType.Enum,
  },
  mBC2PxMBg: { title: "Tap", type: ControlType.EventHandler },
});
loadFonts(
  Urgency,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-regular.woff2",
          weight: "500",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var Coordination_cycleOrder = ["S3kYznUP4", "xZIBSRPrK", "aJO1FcIHC"],
  un = "framer-DCwjj",
  Coordination_variantClassNames = {
    aJO1FcIHC: "framer-v-1q68uxm",
    S3kYznUP4: "framer-v-11b0mpr",
    xZIBSRPrK: "framer-v-327s0c",
  };
var yn = (t, a) => `translateY(-50%) ${a}`,
  wn = { Inactive: "aJO1FcIHC", Main: "S3kYznUP4", Raised: "xZIBSRPrK" },
  resolveCoordinationProps = ({ height: t, id: a, tap: n, width: i, ...o }) => {
    var f, s;
    return {
      ...o,
      kJZ82E8Mx: n ?? o.kJZ82E8Mx,
      variant:
        (s = (f = wn[o.variant]) !== null && f !== undefined ? f : o.variant) !==
          null && s !== undefined
          ? s
          : "S3kYznUP4",
    };
  },
  Coordination_layoutKey = (t, a) => a.join("-") + t.layoutDependency,
  _Coordination = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      {
        style,
        className,
        layoutId,
        variant,
        kJZ82E8Mx,
        ...restProps
      } = resolveCoordinationProps(props),
      {
        baseVariant,
        classNames,
        gestureVariant,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: Coordination_cycleOrder,
        defaultVariant: "S3kYznUP4",
        variant: variant,
        variantClassNames: Coordination_variantClassNames,
      }),
      x = Coordination_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      h = activeVariantCallback(async (...Q) => {
        if ((setGestureState({ isPressed: false }), kJZ82E8Mx && (await kJZ82E8Mx(...Q)) === false)) return false;
      }),
      b = activeVariantCallback(async (...Q) => {
        setVariant("xZIBSRPrK");
      });
    useOnVariantChange(baseVariant, { aJO1FcIHC: undefined, default: b });
    let localRef = useRef(null),
      M = () => baseVariant !== "xZIBSRPrK",
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: SPRING_CAPTION,
          children: jsxs(motion.div, {
            ...restProps,
            className: cx(un, ...additionalClassNames, "framer-11b0mpr", className, classNames),
            "data-framer-name": "Main",
            "data-highlight": true,
            layoutDependency: x,
            layoutId: "S3kYznUP4",
            onHoverEnd: () => setGestureState({ isHovered: false }),
            onHoverStart: () => setGestureState({ isHovered: true }),
            onTap: h,
            onTapCancel: () => setGestureState({ isPressed: false }),
            onTapStart: () => setGestureState({ isPressed: true }),
            ref: forwardedRef ?? localRef,
            style: {
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...style,
            },
            variants: {
              xZIBSRPrK: {
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            },
            ...mergeVariantProps(
              {
                aJO1FcIHC: { "data-framer-name": "Inactive" },
                xZIBSRPrK: { "data-framer-name": "Raised" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: [
              M() &&
                jsx(motion.div, {
                  className: "framer-jjhh2s",
                  layoutDependency: x,
                  layoutId: "TkGeRqFTC",
                  transformTemplate: yn,
                  children: jsx(motion.div, {
                    className: "framer-1bvamph",
                    layoutDependency: x,
                    layoutId: "DQ_akzWYl",
                  }),
                }),
              jsx(RichTextComponent, {
                __fromCanvasComponent: true,
                children: jsx(ReactFragment, {
                  children: jsx(motion.h2, {
                    style: {
                      "--font-selector": "R0Y7SW50ZXItNTAw",
                      "--framer-font-family":
                        '"Inter", "Inter Placeholder", sans-serif',
                      "--framer-font-size": "24px",
                      "--framer-font-weight": "500",
                      "--framer-letter-spacing": "-0.5px",
                      "--framer-line-height": "1.5em",
                      "--framer-text-alignment": "right",
                      "--framer-text-color":
                        "var(--extracted-1of0zx5, rgb(136, 136, 136))",
                    },
                    children:
                      "Which makes coordination within teams vital for success.",
                  }),
                }),
                className: "framer-1oxm0h1",
                fonts: ["GF;Inter-500"],
                layoutDependency: x,
                layoutId: "X7pDW2f3h",
                style: {
                  "--extracted-1of0zx5": "rgb(136, 136, 136)",
                  "--framer-paragraph-spacing": "0px",
                },
                variants: {
                  xZIBSRPrK: {
                    "--extracted-1of0zx5":
                      "var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62))",
                  },
                },
                verticalAlignment: "top",
                withExternalLayout: true,
                ...mergeVariantProps(
                  {
                    xZIBSRPrK: {
                      children: jsx(ReactFragment, {
                        children: jsx(motion.h2, {
                          style: {
                            "--font-selector": "R0Y7SW50ZXItNTAw",
                            "--framer-font-family":
                              '"Inter", "Inter Placeholder", sans-serif',
                            "--framer-font-size": "24px",
                            "--framer-font-weight": "500",
                            "--framer-letter-spacing": "-0.5px",
                            "--framer-line-height": "1.5em",
                            "--framer-text-alignment": "right",
                            "--framer-text-color":
                              "var(--extracted-1of0zx5, var(--token-947ca9b0-2c83-4d26-befd-e83070b35a6e, rgb(66, 62, 62)))",
                          },
                          children:
                            "Which makes coordination within teams vital for success.",
                        }),
                      }),
                    },
                  },
                  baseVariant,
                  gestureVariant,
                ),
              }),
            ],
          }),
        }),
      }),
    });
  }),
  Coordination_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-DCwjj.framer-1fjq90v, .framer-DCwjj .framer-1fjq90v { display: block; }",
    ".framer-DCwjj.framer-11b0mpr { cursor: pointer; height: 72px; overflow: visible; position: relative; width: 380px; }",
    ".framer-DCwjj .framer-jjhh2s { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; left: 0px; overflow: visible; padding: 0px; position: absolute; right: 20px; top: 50%; }",
    ".framer-DCwjj .framer-1bvamph { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; min-height: 72px; overflow: visible; padding: 0px; position: relative; width: 100%; }",
    ".framer-DCwjj .framer-1oxm0h1 { -webkit-user-select: none; bottom: 0px; flex: none; height: auto; left: 0px; overflow: visible; position: absolute; user-select: none; white-space: pre-wrap; width: 360px; word-break: break-word; word-wrap: break-word; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-DCwjj .framer-jjhh2s, .framer-DCwjj .framer-1bvamph { gap: 0px; } .framer-DCwjj .framer-jjhh2s > * { margin: 0px; margin-bottom: calc(10px / 2); margin-top: calc(10px / 2); } .framer-DCwjj .framer-jjhh2s > :first-child { margin-top: 0px; } .framer-DCwjj .framer-jjhh2s > :last-child { margin-bottom: 0px; } .framer-DCwjj .framer-1bvamph > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-DCwjj .framer-1bvamph > :first-child { margin-left: 0px; } .framer-DCwjj .framer-1bvamph > :last-child { margin-right: 0px; } }",
    ".framer-DCwjj.framer-v-327s0c.framer-11b0mpr { overflow: hidden; will-change: var(--framer-will-change-override, transform); }",
  ],
  Coordination = withCSS(_Coordination, Coordination_css, "framer-DCwjj");
Coordination.displayName = "Coordination";
Coordination.defaultProps = { height: 72, width: 380 };
addPropertyControls(Coordination, {
  variant: {
    options: ["S3kYznUP4", "xZIBSRPrK", "aJO1FcIHC"],
    optionTitles: ["Main", "Raised", "Inactive"],
    title: "Variant",
    type: ControlType.Enum,
  },
  kJZ82E8Mx: { title: "Tap", type: ControlType.EventHandler },
});
loadFonts(
  Coordination,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v13-latin-regular.woff2",
          weight: "500",
        },
      ],
    },
  ],
  { supportsExplicitInterCodegen: true },
);
var FXDiv = withFXWrapper(motion.div),
  FXLink = scheduleAppearAnimation(withFXWrapper(motion.a)),
  On = getFonts(G),
  kn = getFonts(Urgency),
  Un = getFonts(Coordination),
  In = getFonts(TunnelVision),
  _n = getFonts(Trigger),
  StoryLeft2_cycleOrder = ["Q1DJ9ntwf", "qvmKCdJXN", "hxzAUWcy0"],
  jn = "framer-sRCsS",
  StoryLeft2_variantClassNames = {
    hxzAUWcy0: "framer-v-jxbueo",
    Q1DJ9ntwf: "framer-v-khfq23",
    qvmKCdJXN: "framer-v-1m0rm34",
  };
var Br = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: TWEEN_LONG,
    x: 0,
    y: 0,
  },
  sr = {
    opacity: 0.001,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  },
  fr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    x: -410,
    y: 0,
  },
  lr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transformPerspective: 1200,
    transition: TWEEN_CYCLE,
    x: -410,
    y: 0,
  },
  Fn = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: TWEEN_SLOW,
    x: 0,
    y: 0,
  },
  Sn = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.005,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
    y: -4,
  },
  mr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
    y: -4,
  },
  Pn = {
    "First tab": "Q1DJ9ntwf",
    "SECOND TAB": "qvmKCdJXN",
    "Third Tab": "hxzAUWcy0",
  },
  resolveStoryLeft2Props = ({ height: t, id: a, width: n, ...i }) => {
    var o, f;
    return {
      ...i,
      variant:
        (f = (o = Pn[i.variant]) !== null && o !== undefined ? o : i.variant) !==
          null && f !== undefined
          ? f
          : "Q1DJ9ntwf",
    };
  },
  StoryLeft2_layoutKey = (t, a) =>
    t.layoutDependency ? a.join("-") + t.layoutDependency : a.join("-"),
  _StoryLeft2 = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      { style, className, layoutId, variant, ...restProps } = resolveStoryLeft2Props(props),
      {
        baseVariant,
        classNames,
        clearLoadingGesture,
        gestureHandlers,
        gestureVariant,
        isLoading,
        setGestureState,
        setVariant,
        variants,
      } = useComponentVariantState({
        cycleOrder: StoryLeft2_cycleOrder,
        defaultVariant: "Q1DJ9ntwf",
        variant: variant,
        variantClassNames: StoryLeft2_variantClassNames,
      }),
      m = StoryLeft2_layoutKey(props, variants),
      { activeVariantCallback, delay } = useVariantAnimationCallbacks(baseVariant),
      V = activeVariantCallback(async (...xe) => {
        await delay(() => setVariant(CycleSymbol), 6600);
      }),
      M = activeVariantCallback(async (...xe) => {
        await delay(() => setVariant("qvmKCdJXN"), 60);
      }),
      A = activeVariantCallback(async (...xe) => {
        await delay(() => setVariant("Q1DJ9ntwf"), 60);
      }),
      Y = activeVariantCallback(async (...xe) => {
        await delay(() => setVariant("hxzAUWcy0"), 60);
      });
    useOnVariantChange(baseVariant, { default: V });
    let localRef = useRef(null),
      Q = () => !["qvmKCdJXN", "hxzAUWcy0"].includes(baseVariant),
      J = () => baseVariant === "qvmKCdJXN",
      ce = () => baseVariant === "hxzAUWcy0",
      autoId = useId(),
      additionalClassNames = [],
      deviceSize = useDeviceSize();
    return jsx(LayoutGroup, {
      id: layoutId ?? autoId,
      children: jsx(AnimatedFragment, {
        animate: variants,
        initial: false,
        children: jsx(TransitionProvider, {
          value: TWEEN_MEDIUM,
          children: jsxs(motion.div, {
            ...restProps,
            ...gestureHandlers,
            className: cx(jn, ...additionalClassNames, "framer-khfq23", className, classNames),
            "data-framer-name": "First tab",
            "data-highlight": true,
            layoutDependency: m,
            layoutId: "Q1DJ9ntwf",
            ref: forwardedRef ?? localRef,
            style: { ...style },
            ...mergeVariantProps(
              {
                hxzAUWcy0: { "data-framer-name": "Third Tab" },
                qvmKCdJXN: { "data-framer-name": "SECOND TAB" },
              },
              baseVariant,
              gestureVariant,
            ),
            children: [
              Q() &&
                jsx(B, {
                  href: { hash: ":WjO84y3BZ", webPageId: "bzydBB85Y" },
                  openInNewTab: false,
                  smoothScroll: true,
                  children: jsx(FXLink, {
                    __perspectiveFX: false,
                    __smartComponentFX: true,
                    __targetOpacity: 1,
                    animate: Br,
                    className: "framer-5fo9sd framer-rf24a0",
                    "data-framer-appear-id": "5fo9sd",
                    "data-framer-name": "Line1",
                    initial: sr,
                    layoutDependency: m,
                    layoutId: "ym2GR63Iz",
                    optimized: true,
                    style: {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    children: jsx(motion.div, {
                      className: "framer-1l53x7w",
                      layoutDependency: m,
                      layoutId: "rP4Qgd3xN",
                      children: jsx(FXDiv, {
                        __framer__animate: { transition: TWEEN_CYCLE },
                        __framer__animateOnce: true,
                        __framer__enter: fr,
                        __framer__exit: lr,
                        __framer__styleAppearEffectEnabled: true,
                        __framer__threshold: 0.5,
                        __perspectiveFX: false,
                        __smartComponentFX: true,
                        __targetOpacity: 1,
                        className: "framer-q7g51l",
                        "data-framer-name": "Line",
                        layoutDependency: m,
                        layoutId: "jgW5MYMzz",
                        style: {
                          backgroundColor:
                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          transformPerspective: 1200,
                        },
                      }),
                    }),
                  }),
                }),
              J() &&
                jsx(B, {
                  href: { hash: ":dbtg_NZW8", webPageId: "bzydBB85Y" },
                  openInNewTab: false,
                  children: jsx(FXLink, {
                    __perspectiveFX: false,
                    __smartComponentFX: true,
                    __targetOpacity: 1,
                    animate: Br,
                    className: "framer-1ssjips framer-rf24a0",
                    "data-framer-appear-id": "1ssjips",
                    "data-framer-name": "Line2",
                    initial: sr,
                    layoutDependency: m,
                    layoutId: "kVKqiec1R",
                    optimized: true,
                    style: {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    children: jsx(motion.div, {
                      className: "framer-rmlb7z",
                      layoutDependency: m,
                      layoutId: "dyJ8qqujy",
                      children: jsx(FXDiv, {
                        __framer__animate: { transition: TWEEN_CYCLE },
                        __framer__animateOnce: true,
                        __framer__enter: fr,
                        __framer__exit: lr,
                        __framer__styleAppearEffectEnabled: true,
                        __framer__threshold: 0.5,
                        __perspectiveFX: false,
                        __smartComponentFX: true,
                        __targetOpacity: 1,
                        className: "framer-t6njsg",
                        "data-framer-name": "Line",
                        layoutDependency: m,
                        layoutId: "oaGE6dyw7",
                        style: {
                          backgroundColor:
                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          transformPerspective: 1200,
                        },
                      }),
                    }),
                  }),
                }),
              ce() &&
                jsx(B, {
                  href: { hash: ":tftSCv8zZ", webPageId: "bzydBB85Y" },
                  openInNewTab: false,
                  children: jsx(FXLink, {
                    __perspectiveFX: false,
                    __smartComponentFX: true,
                    __targetOpacity: 1,
                    animate: Fn,
                    className: "framer-75yx8m framer-rf24a0",
                    "data-framer-appear-id": "75yx8m",
                    "data-framer-name": "Line3",
                    initial: sr,
                    layoutDependency: m,
                    layoutId: "VLlZAE501",
                    optimized: true,
                    style: {
                      borderBottomLeftRadius: 10,
                      borderBottomRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                    },
                    children: jsx(motion.div, {
                      className: "framer-1lbny7u",
                      layoutDependency: m,
                      layoutId: "mholq0un4",
                      children: jsx(FXDiv, {
                        __framer__animate: { transition: TWEEN_CYCLE },
                        __framer__animateOnce: true,
                        __framer__enter: fr,
                        __framer__exit: lr,
                        __framer__styleAppearEffectEnabled: true,
                        __framer__threshold: 0.5,
                        __perspectiveFX: false,
                        __smartComponentFX: true,
                        __targetOpacity: 1,
                        className: "framer-18zfk1b",
                        "data-framer-name": "Line",
                        layoutDependency: m,
                        layoutId: "tK06K0bmz",
                        style: {
                          backgroundColor:
                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                          borderBottomLeftRadius: 5,
                          borderBottomRightRadius: 5,
                          borderTopLeftRadius: 5,
                          borderTopRightRadius: 5,
                          transformPerspective: 1200,
                        },
                      }),
                    }),
                  }),
                }),
              jsx(B, {
                href: { hash: ":WjO84y3BZ", webPageId: "bzydBB85Y" },
                openInNewTab: false,
                smoothScroll: true,
                ...mergeVariantProps(
                  {
                    hxzAUWcy0: {
                      href: { hash: ":tftSCv8zZ", webPageId: "bzydBB85Y" },
                    },
                    qvmKCdJXN: {
                      href: { hash: ":dbtg_NZW8", webPageId: "bzydBB85Y" },
                    },
                  },
                  baseVariant,
                  gestureVariant,
                ),
                children: jsxs(motion.a, {
                  background: {
                    alt: "",
                    fit: "fill",
                    intrinsicHeight: 720,
                    intrinsicWidth: 960,
                  },
                  className: "framer-1muvgug framer-rf24a0",
                  "data-framer-name": "Image",
                  layoutDependency: m,
                  layoutId: "FN0bI2dEy",
                  style: {
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                  },
                  whileHover: Sn,
                  ...mergeVariantProps(
                    {
                      hxzAUWcy0: {
                        background: {
                          alt: "",
                          intrinsicHeight: 720,
                          intrinsicWidth: 960,
                          positionX: "center",
                          positionY: "center",
                        },
                      },
                    },
                    baseVariant,
                    gestureVariant,
                  ),
                  children: [
                    jsx(motion.div, {
                      className: "framer-1jvhuey",
                      layoutDependency: m,
                      layoutId: "W4e4Idf8E",
                      style: {
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        boxShadow: "1px 2px 2px 0px rgba(0,0,0,0.25)",
                      },
                      children: jsx(DeviceSizeContainer, {
                        children: jsx(motion.div, {
                          className: "framer-9b41qt-container",
                          "data-framer-name": "vtimesensitive",
                          layoutDependency: m,
                          layoutId: "lRPaywmwY-container",
                          name: "vtimesensitive",
                          style: { opacity: 1 },
                          variants: {
                            hxzAUWcy0: { opacity: 0 },
                            qvmKCdJXN: { opacity: 0 },
                          },
                          children: jsx(G, {
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            borderRadius: 20,
                            bottomLeftRadius: 20,
                            bottomRightRadius: 20,
                            controls: false,
                            height: "100%",
                            id: "lRPaywmwY",
                            isMixedBorderRadius: false,
                            layoutId: "lRPaywmwY",
                            loop: true,
                            muted: true,
                            name: "vtimesensitive",
                            objectFit: "cover",
                            playing: true,
                            posterEnabled: false,
                            srcFile:
                              "./assets/eajlwckeju4dyztpqovk8kwz9w.webm",
                            srcType: "Upload",
                            srcUrl:
                              "./assets/mixkit-clouds-sky.mp4",
                            startTime: 0,
                            style: { height: "100%", width: "100%" },
                            topLeftRadius: 20,
                            topRightRadius: 20,
                            volume: 25,
                            width: "100%",
                          }),
                        }),
                      }),
                    }),
                    jsx(motion.div, {
                      className: "framer-e12bp3",
                      layoutDependency: m,
                      layoutId: "QT1qNrDs6",
                      style: {
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        boxShadow: "1px 2px 2px 0px rgba(0,0,0,0.25)",
                      },
                      children: jsx(DeviceSizeContainer, {
                        children: jsx(motion.div, {
                          className: "framer-vhj82g-container",
                          "data-framer-name": "vcomesatcost",
                          layoutDependency: m,
                          layoutId: "GabEP_Evd-container",
                          name: "vcomesatcost",
                          style: { opacity: 0 },
                          variants: { hxzAUWcy0: { opacity: 1 } },
                          children: jsx(G, {
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            borderRadius: 20,
                            bottomLeftRadius: 20,
                            bottomRightRadius: 20,
                            controls: false,
                            height: "100%",
                            id: "GabEP_Evd",
                            isMixedBorderRadius: false,
                            layoutId: "GabEP_Evd",
                            loop: true,
                            muted: true,
                            name: "vcomesatcost",
                            objectFit: "cover",
                            playing: true,
                            posterEnabled: false,
                            srcFile:
                              "./assets/iytbauik57o8jzn3y2ufyugl8s.webm",
                            srcType: "Upload",
                            srcUrl:
                              "./assets/mixkit-clouds-sky.mp4",
                            startTime: 0,
                            style: { height: "100%", width: "100%" },
                            topLeftRadius: 20,
                            topRightRadius: 20,
                            volume: 25,
                            width: "100%",
                          }),
                        }),
                      }),
                    }),
                    jsx(motion.div, {
                      className: "framer-j1b2k8",
                      layoutDependency: m,
                      layoutId: "QlgvEBdq2",
                      style: {
                        borderBottomLeftRadius: 20,
                        borderBottomRightRadius: 20,
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                        boxShadow: "1px 2px 2px 0px rgba(0,0,0,0.25)",
                      },
                      children: jsx(DeviceSizeContainer, {
                        children: jsx(motion.div, {
                          className: "framer-11ixtnj-container",
                          "data-framer-name": "vlikeadance",
                          layoutDependency: m,
                          layoutId: "rzTdZzVVu-container",
                          name: "vlikeadance",
                          style: { opacity: 0 },
                          variants: { qvmKCdJXN: { opacity: 1 } },
                          children: jsx(G, {
                            backgroundColor: "rgba(0, 0, 0, 0)",
                            borderRadius: 20,
                            bottomLeftRadius: 20,
                            bottomRightRadius: 20,
                            controls: false,
                            height: "100%",
                            id: "rzTdZzVVu",
                            isMixedBorderRadius: false,
                            layoutId: "rzTdZzVVu",
                            loop: true,
                            muted: true,
                            name: "vlikeadance",
                            objectFit: "cover",
                            playing: true,
                            posterEnabled: false,
                            srcFile:
                              "./assets/yahq7dplzb3du76zsorv03p8y.mp4",
                            srcType: "Upload",
                            srcUrl:
                              "./assets/mixkit-clouds-sky.mp4",
                            startTime: 13.4,
                            style: { height: "100%", width: "100%" },
                            topLeftRadius: 20,
                            topRightRadius: 20,
                            volume: 25,
                            width: "100%",
                            ...mergeVariantProps({ hxzAUWcy0: { startTime: 0 } }, baseVariant, gestureVariant),
                          }),
                        }),
                      }),
                    }),
                  ],
                }),
              }),
              jsx(B, {
                ...mergeVariantProps(
                  {
                    hxzAUWcy0: {
                      href: { webPageId: "sfcH2behU" },
                      openInNewTab: false,
                    },
                  },
                  baseVariant,
                  gestureVariant,
                ),
                children: jsxs(motion.a, {
                  className: "framer-h0n0bm framer-rf24a0",
                  "data-framer-name": "Captions",
                  layoutDependency: m,
                  layoutId: "WSK0MVtYX",
                  children: [
                    jsx(DeviceSizeContainer, {
                      width: "380px",
                      children: jsx(motion.div, {
                        className: "framer-ho4a6n-container",
                        layoutDependency: m,
                        layoutId: "Kjarh8b0F-container",
                        whileHover: mr,
                        children: jsx(Urgency, {
                          height: "100%",
                          id: "Kjarh8b0F",
                          layoutId: "Kjarh8b0F",
                          style: { height: "100%", width: "100%" },
                          variant: "zsZ4Z5z6N",
                          width: "100%",
                          ...mergeVariantProps(
                            {
                              hxzAUWcy0: {
                                mBC2PxMBg: undefined,
                                variant: "gO1Oy0ksh",
                              },
                              qvmKCdJXN: {
                                mBC2PxMBg: undefined,
                                variant: "gO1Oy0ksh",
                              },
                            },
                            baseVariant,
                            gestureVariant,
                          ),
                        }),
                      }),
                    }),
                    jsx(DeviceSizeContainer, {
                      width: "380px",
                      children: jsx(motion.div, {
                        className: "framer-17nq8nm-container",
                        layoutDependency: m,
                        layoutId: "Qw2n1EueW-container",
                        whileHover: mr,
                        ...mergeVariantProps({ qvmKCdJXN: { whileHover: undefined } }, baseVariant, gestureVariant),
                        children: jsx(Coordination, {
                          height: "100%",
                          id: "Qw2n1EueW",
                          layoutId: "Qw2n1EueW",
                          style: { height: "100%", width: "100%" },
                          variant: "aJO1FcIHC",
                          width: "100%",
                          ...mergeVariantProps({ qvmKCdJXN: { variant: "S3kYznUP4" } }, baseVariant, gestureVariant),
                        }),
                      }),
                    }),
                    jsx(DeviceSizeContainer, {
                      width: "380px",
                      children: jsx(motion.div, {
                        className: "framer-6if8f0-container",
                        layoutDependency: m,
                        layoutId: "BPtfXhKGl-container",
                        whileHover: mr,
                        ...mergeVariantProps({ hxzAUWcy0: { whileHover: undefined } }, baseVariant, gestureVariant),
                        children: jsx(TunnelVision, {
                          height: "100%",
                          id: "BPtfXhKGl",
                          layoutId: "BPtfXhKGl",
                          style: { height: "100%", width: "100%" },
                          variant: "Bx08xEGah",
                          width: "100%",
                          ...mergeVariantProps({ hxzAUWcy0: { variant: "NFc0G3jDM" } }, baseVariant, gestureVariant),
                        }),
                      }),
                    }),
                    jsx(motion.div, {
                      className: "framer-gr8coz",
                      layoutDependency: m,
                      layoutId: "DcHrFa3kE",
                      style: {
                        backgroundColor:
                          "var(--token-c0c800ee-fb80-4c6c-9156-db7383f7e366, rgb(232, 232, 232))",
                        borderBottomLeftRadius: 10,
                        borderBottomRightRadius: 10,
                        borderTopLeftRadius: 10,
                        borderTopRightRadius: 10,
                        boxShadow: "1px 2px 2px 0px rgba(0,0,0,0.25)",
                      },
                    }),
                  ],
                }),
              }),
              jsx(B, {
                href: { webPageId: "sfcH2behU" },
                openInNewTab: false,
                children: jsxs(motion.a, {
                  className: "framer-17ix8tg framer-rf24a0",
                  "data-framer-name": "hovertriggers",
                  layoutDependency: m,
                  layoutId: "Nigco7AyM",
                  children: [
                    jsx(DeviceSizeContainer, {
                      children: jsx(motion.div, {
                        className: "framer-12hfz3c-container",
                        layoutDependency: m,
                        layoutId: "siYOUFHkt-container",
                        style: { opacity: 0 },
                        children: jsx(Trigger, {
                          height: "100%",
                          id: "siYOUFHkt",
                          layoutId: "siYOUFHkt",
                          style: { height: "100%", width: "100%" },
                          variant: "xKACItaHS",
                          width: "100%",
                        }),
                      }),
                    }),
                    jsx(DeviceSizeContainer, {
                      children: jsx(motion.div, {
                        className: "framer-1ii6dh3-container",
                        layoutDependency: m,
                        layoutId: "CC4a7R4Fp-container",
                        style: { opacity: 0 },
                        children: jsx(Trigger, {
                          height: "100%",
                          hover: M,
                          id: "CC4a7R4Fp",
                          layoutId: "CC4a7R4Fp",
                          style: { height: "100%", width: "100%" },
                          variant: "rgX5PDpQJ",
                          width: "100%",
                          ...mergeVariantProps(
                            {
                              hxzAUWcy0: { hover: A },
                              qvmKCdJXN: { hover: A },
                            },
                            baseVariant,
                            gestureVariant,
                          ),
                        }),
                      }),
                    }),
                    jsx(DeviceSizeContainer, {
                      children: jsx(motion.div, {
                        className: "framer-1xqtcq4-container",
                        layoutDependency: m,
                        layoutId: "VaOijB5sh-container",
                        style: { opacity: 0 },
                        children: jsx(Trigger, {
                          height: "100%",
                          hover: Y,
                          id: "VaOijB5sh",
                          layoutId: "VaOijB5sh",
                          style: { height: "100%", width: "100%" },
                          variant: "xeZKtnsQM",
                          width: "100%",
                          ...mergeVariantProps({ hxzAUWcy0: { hover: M } }, baseVariant, gestureVariant),
                        }),
                      }),
                    }),
                  ],
                }),
              }),
            ],
          }),
        }),
      }),
    });
  }),
  StoryLeft2_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    ".framer-sRCsS.framer-rf24a0, .framer-sRCsS .framer-rf24a0 { display: block; }",
    ".framer-sRCsS.framer-khfq23 { align-content: center; align-items: center; display: flex; flex-direction: row; flex-wrap: wrap; gap: 80px; height: min-content; justify-content: center; overflow: visible; padding: 0px 20px 0px 0px; position: relative; width: 1000px; }",
    ".framer-sRCsS .framer-5fo9sd { bottom: 224px; flex: none; overflow: hidden; position: absolute; right: 0px; text-decoration: none; top: 39px; width: 410px; will-change: var(--framer-will-change-override, transform); z-index: 7; }",
    ".framer-sRCsS .framer-1l53x7w, .framer-sRCsS .framer-rmlb7z, .framer-sRCsS .framer-1lbny7u { align-content: center; align-items: center; bottom: 0px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 2px; justify-content: center; left: 0px; overflow: hidden; padding: 0px; position: absolute; right: 0px; z-index: 10; }",
    ".framer-sRCsS .framer-q7g51l, .framer-sRCsS .framer-t6njsg, .framer-sRCsS .framer-18zfk1b { align-content: flex-start; align-items: flex-start; bottom: 0px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; justify-content: center; left: calc(50.00000000000002% - 410px / 2); overflow: visible; padding: 0px; position: absolute; top: 0px; width: 410px; z-index: 1; }",
    ".framer-sRCsS .framer-1ssjips { flex: none; height: 90px; overflow: hidden; position: absolute; right: 0px; text-decoration: none; top: calc(50.00000000000002% - 90px / 2); width: 411px; will-change: var(--framer-will-change-override, transform); z-index: 7; }",
    ".framer-sRCsS .framer-75yx8m { bottom: 39px; flex: none; height: 90px; overflow: hidden; position: absolute; right: 0px; text-decoration: none; width: 411px; will-change: var(--framer-will-change-override, transform); z-index: 7; }",
    ".framer-sRCsS .framer-1muvgug { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: 352px; justify-content: center; overflow: hidden; padding: 0px; position: relative; text-decoration: none; width: 520px; will-change: var(--framer-will-change-override, transform); }",
    ".framer-sRCsS .framer-1jvhuey, .framer-sRCsS .framer-j1b2k8 { align-content: center; align-items: center; bottom: 0px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; left: -10px; min-height: 352px; min-width: 540px; overflow: visible; padding: 0px; position: absolute; width: min-content; }",
    ".framer-sRCsS .framer-9b41qt-container, .framer-sRCsS .framer-vhj82g-container, .framer-sRCsS .framer-11ixtnj-container { flex: none; height: 352px; left: calc(50.00000000000002% - 540px / 2); position: absolute; top: calc(50.00000000000002% - 352px / 2); width: 540px; z-index: 1; }",
    ".framer-sRCsS .framer-e12bp3 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; left: -10px; min-height: 352px; min-width: 540px; overflow: visible; padding: 0px; position: absolute; top: -1px; width: min-content; }",
    ".framer-sRCsS .framer-h0n0bm { align-content: flex-end; align-items: flex-end; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; padding: 0px; position: relative; width: min-content; }",
    ".framer-sRCsS .framer-ho4a6n-container, .framer-sRCsS .framer-17nq8nm-container, .framer-sRCsS .framer-6if8f0-container { flex: none; height: 72px; position: relative; width: 380px; }",
    ".framer-sRCsS .framer-gr8coz { bottom: 176px; flex: none; overflow: visible; position: absolute; right: -20px; top: -10px; width: 410px; z-index: -1; }",
    ".framer-sRCsS .framer-17ix8tg { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 21px; height: 277px; justify-content: center; overflow: visible; padding: 0px; position: absolute; right: 0px; text-decoration: none; top: calc(50.00000000000002% - 277px / 2); width: 411px; z-index: 1; }",
    ".framer-sRCsS .framer-12hfz3c-container, .framer-sRCsS .framer-1ii6dh3-container, .framer-sRCsS .framer-1xqtcq4-container { flex: none; height: 72px; position: relative; width: 382px; }",
    "@supports (background: -webkit-named-image(i)) and (not (font-palette:dark)) { .framer-sRCsS.framer-khfq23, .framer-sRCsS .framer-1l53x7w, .framer-sRCsS .framer-q7g51l, .framer-sRCsS .framer-rmlb7z, .framer-sRCsS .framer-t6njsg, .framer-sRCsS .framer-1lbny7u, .framer-sRCsS .framer-18zfk1b, .framer-sRCsS .framer-1muvgug, .framer-sRCsS .framer-1jvhuey, .framer-sRCsS .framer-e12bp3, .framer-sRCsS .framer-j1b2k8, .framer-sRCsS .framer-h0n0bm, .framer-sRCsS .framer-17ix8tg { gap: 0px; } .framer-sRCsS.framer-khfq23 > * { margin: 0px; margin-left: calc(80px / 2); margin-right: calc(80px / 2); } .framer-sRCsS.framer-khfq23 > :first-child, .framer-sRCsS .framer-1l53x7w > :first-child, .framer-sRCsS .framer-q7g51l > :first-child, .framer-sRCsS .framer-rmlb7z > :first-child, .framer-sRCsS .framer-t6njsg > :first-child, .framer-sRCsS .framer-1lbny7u > :first-child, .framer-sRCsS .framer-18zfk1b > :first-child, .framer-sRCsS .framer-1jvhuey > :first-child, .framer-sRCsS .framer-e12bp3 > :first-child, .framer-sRCsS .framer-j1b2k8 > :first-child { margin-left: 0px; } .framer-sRCsS.framer-khfq23 > :last-child, .framer-sRCsS .framer-1l53x7w > :last-child, .framer-sRCsS .framer-q7g51l > :last-child, .framer-sRCsS .framer-rmlb7z > :last-child, .framer-sRCsS .framer-t6njsg > :last-child, .framer-sRCsS .framer-1lbny7u > :last-child, .framer-sRCsS .framer-18zfk1b > :last-child, .framer-sRCsS .framer-1jvhuey > :last-child, .framer-sRCsS .framer-e12bp3 > :last-child, .framer-sRCsS .framer-j1b2k8 > :last-child { margin-right: 0px; } .framer-sRCsS .framer-1l53x7w > *, .framer-sRCsS .framer-q7g51l > *, .framer-sRCsS .framer-rmlb7z > *, .framer-sRCsS .framer-t6njsg > *, .framer-sRCsS .framer-1lbny7u > *, .framer-sRCsS .framer-18zfk1b > *, .framer-sRCsS .framer-1jvhuey > *, .framer-sRCsS .framer-e12bp3 > *, .framer-sRCsS .framer-j1b2k8 > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-sRCsS .framer-1muvgug > *, .framer-sRCsS .framer-h0n0bm > * { margin: 0px; margin-bottom: calc(20px / 2); margin-top: calc(20px / 2); } .framer-sRCsS .framer-1muvgug > :first-child, .framer-sRCsS .framer-h0n0bm > :first-child, .framer-sRCsS .framer-17ix8tg > :first-child { margin-top: 0px; } .framer-sRCsS .framer-1muvgug > :last-child, .framer-sRCsS .framer-h0n0bm > :last-child, .framer-sRCsS .framer-17ix8tg > :last-child { margin-bottom: 0px; } .framer-sRCsS .framer-17ix8tg > * { margin: 0px; margin-bottom: calc(21px / 2); margin-top: calc(21px / 2); } }",
    ".framer-sRCsS.framer-v-1m0rm34 .framer-1ssjips, .framer-sRCsS.framer-v-1m0rm34 .framer-12hfz3c-container, .framer-sRCsS.framer-v-jxbueo .framer-17nq8nm-container, .framer-sRCsS.framer-v-jxbueo .framer-1xqtcq4-container { order: 1; }",
    ".framer-sRCsS.framer-v-1m0rm34 .framer-1muvgug { order: 3; }",
    ".framer-sRCsS.framer-v-1m0rm34 .framer-h0n0bm { order: 4; }",
    ".framer-sRCsS.framer-v-1m0rm34 .framer-gr8coz { bottom: unset; height: 90px; left: calc(51.05263157894739% - 411px / 2); right: unset; top: calc(50.00000000000002% - 90px / 2); width: 411px; }",
    ".framer-sRCsS.framer-v-1m0rm34 .framer-17ix8tg { order: 5; }",
    ".framer-sRCsS.framer-v-1m0rm34 .framer-1ii6dh3-container, .framer-sRCsS.framer-v-jxbueo .framer-ho4a6n-container, .framer-sRCsS.framer-v-jxbueo .framer-1ii6dh3-container { order: 0; }",
    ".framer-sRCsS.framer-v-1m0rm34 .framer-1xqtcq4-container, .framer-sRCsS.framer-v-jxbueo .framer-6if8f0-container, .framer-sRCsS.framer-v-jxbueo .framer-12hfz3c-container { order: 2; }",
    ".framer-sRCsS.framer-v-jxbueo .framer-vhj82g-container { bottom: -1px; top: unset; }",
    ".framer-sRCsS.framer-v-jxbueo .framer-h0n0bm { text-decoration: none; }",
    ".framer-sRCsS.framer-v-jxbueo .framer-gr8coz { bottom: unset; height: 90px; left: calc(51.05263157894739% - 411px / 2); order: 3; right: unset; top: calc(85.93750000000003% - 90px / 2); width: 411px; }",
  ],
  StoryLeft2 = withCSS(_StoryLeft2, StoryLeft2_css, "framer-sRCsS");
StoryLeft2.displayName = "Story Left2";
StoryLeft2.defaultProps = { height: 352, width: 1e3 };
addPropertyControls(StoryLeft2, {
  variant: {
    options: ["Q1DJ9ntwf", "qvmKCdJXN", "hxzAUWcy0"],
    optionTitles: ["First tab", "SECOND TAB", "Third Tab"],
    title: "Variant",
    type: ControlType.Enum,
  },
});
loadFonts(StoryLeft2, [{ explicitInter: true, fonts: [] }, ...On, ...kn, ...Un, ...In, ..._n], {
  supportsExplicitInterCodegen: true,
});
var li = getFonts(MapMobile2Component),
  ge = withScrollSnapChild(motion.section),
  me = withScrollSnap(motion.section),
  mi = getFonts(G),
  di = getFonts(NeoflixAnim),
  ci = getFonts(RecordReflectRefineCopy),
  pi = withScrollSnapContainer(motion.main),
  hi = getFonts(NeoflixAnim),
  ui = getFonts(RecordReflectRefine),
  Fe = scheduleAppearAnimation(motion.div),
  gi = getFonts(StoryLeft2),
  xi = getFonts(StoryRight),
  yi = getFonts(MapComponent),
  vi = withScrollSnapContainerAlt(motion.main),
  bi = {
    CXFUsfZRE: "(max-width: 809px)",
    ueHalD28r: "(min-width: 810px) and (max-width: 1199px)",
    WQLkyLRf1: "(min-width: 1200px)",
  },
  Er = () => typeof document < "u",
  Kr = "framer-qO1UX",
  wi = {
    CXFUsfZRE: "framer-v-1jamxon",
    ueHalD28r: "framer-v-1uu5wld",
    WQLkyLRf1: "framer-v-72rtr7",
  },
  Ci = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.1,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
  },
  qi = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.05,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
  },
  Wr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.01,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
    y: -4,
  },
  pr = (t, a) => `translateX(-50%) ${a}`,
  Ri = { damping: 30, delay: 1, mass: 1, stiffness: 400, type: "spring" /* physics-based spring animation */ },
  Qr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: Ri,
    x: 0,
    y: 0,
  },
  Se = {
    opacity: 0.001,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    x: 0,
    y: 0,
  },
  Xi = { damping: 30, delay: 0.9, mass: 1, stiffness: 400, type: "spring" /* physics-based spring animation */ },
  Zr = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    transition: Xi,
    x: 0,
    y: 0,
  },
  Jr = (t, a) => `translate(-50%, -50%) ${a}`,
  Gr = (t, a) => `translateY(-50%) ${a}`,
  Oi = {
    opacity: 1,
    rotate: 0,
    rotateX: 0,
    rotateY: 0,
    scale: 1.02,
    skewX: 0,
    skewY: 0,
    transition: SPRING_STANDARD,
  },
  hr = Ve(),
  ki = { Desktop: "WQLkyLRf1", Phone: "CXFUsfZRE", Tablet: "ueHalD28r" },
  resolveHomeProps = ({ height: t, id: a, width: n, ...i }) => {
    var o, f;
    return {
      ...i,
      variant:
        (f = (o = ki[i.variant]) !== null && o !== undefined ? o : i.variant) !==
          null && f !== undefined
          ? f
          : "WQLkyLRf1",
    };
  },
  _Home = forwardRef(function (props, forwardedRef) {
    let { activeLocale, setLocale } = useLocale(),
      { style, className, layoutId, variant, ...restProps } = resolveHomeProps(props);
    (useEffect(() => {
      let u = Ve(undefined, activeLocale);
      if (u.robots) {
        let m = document.querySelector('meta[name="robots"]');
        m
          ? m.setAttribute("content", u.robots)
          : ((m = document.createElement("meta")),
            m.setAttribute("name", "robots"),
            m.setAttribute("content", u.robots),
            document.head.appendChild(m));
      }
    }, [undefined, activeLocale]),
      useInsertionEffect(() => {
        let u = Ve(undefined, activeLocale);
        if (((document.title = u.title || ""), u.viewport)) {
          var m;
          (m = document.querySelector('meta[name="viewport"]')) === null ||
            m === undefined ||
            m.setAttribute("content", u.viewport);
        }
        let h = u.bodyClassName;
        if (h) {
          let b = document.body;
          (b.classList.forEach(
            (V) => V.startsWith("framer-body-") && b.classList.remove(V),
          ),
            b.classList.add(`${u.bodyClassName}-framer-qO1UX`));
        }
        return () => {
          h &&
            document.body.classList.remove(`${u.bodyClassName}-framer-qO1UX`);
        };
      }, [undefined, activeLocale]));
    let [l, p] = useVariantState(variant, bi, false),
      L = undefined,
      localRef = useRef(null),
      d = () => (Er() ? l !== "CXFUsfZRE" : true),
      R = () => !Er() || l === "CXFUsfZRE",
      autoId = useId(),
      x = [cssClassScope];
    return (
      registerCursors({}),
      jsx(CursorContext.Provider, {
        value: { primaryVariantId: "WQLkyLRf1", variantClassNames: wi },
        children: jsxs(LayoutGroup, {
          id: layoutId ?? autoId,
          children: [
            jsxs(motion.div, {
              ...restProps,
              className: cx(Kr, ...x, "framer-72rtr7", className),
              ref: forwardedRef ?? localRef,
              style: { ...style },
              children: [
                jsxs("nav", {
                  className: "framer-13yn9ib",
                  "data-framer-name": "Nav",
                  name: "Nav",
                  children: [
                    d() &&
                      jsx(B, {
                        href: { webPageId: "augiA20Il" },
                        openInNewTab: false,
                        children: jsx(motion.a, {
                          "aria-label": "Framer University logo",
                          className:
                            "framer-xvlq3 hidden-1jamxon framer-lux5qc",
                          "data-framer-name": "Logo",
                          name: "Logo",
                          whileHover: Ci,
                          children: jsx(SVGComponent, {
                            className: "framer-bg8cfc",
                            "data-framer-name": "Neoflix_Logo_SVG",
                            fill: "black",
                            intrinsicHeight: 429,
                            intrinsicWidth: 407,
                            name: "Neoflix_Logo_SVG",
                            svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 406.548 428.788"><defs><style>.cls-1{fill:#48c2c5}</style></defs><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><path class="cls-1" d="M26.01 307.464c5.39 68.03 63.415 121.324 211.152 121.324-58.907 0-104.765-26.64-130.847-72.367-37.136-11.599-63.256-28.585-80.304-48.957ZM286.307 21.4C163.502-75.529-79.82 181.001 26.01 307.463 16.49 187.289 171.26 21.145 286.307 21.399Zm120.241 210.503c0-154.088-53.418-210.356-120.241-210.504 21.27 16.788 38.913 44.194 50.509 84.701 41.835 26.47 69.732 72.903 69.732 125.803Z"/><path class="cls-1" d="M82.183 255.473c0 39.41 8.53 73.592 24.132 100.947 34.05 10.634 77.32 16.753 131.42 16.753-63.114 0-100.797-43.992-100.797-117.674 0-64.553 53.329-117.069 118.875-117.069 52.924 0 95.98 42.787 95.98 95.376 0-52.356-5.454-94.437-14.977-127.706a149.154 149.154 0 0 0-80.013-23.285c-96.287 0-174.62 77.455-174.62 172.658Z"/><circle class="cls-1" cx="244.366" cy="248.571" r="43.387"/></g></g></svg>',
                            withExternalLayout: true,
                          }),
                        }),
                      }),
                    jsxs("div", {
                      className: "framer-rfpe3x",
                      "data-framer-name": "Links",
                      name: "Links",
                      children: [
                        jsx(RichTextComponent, {
                          __fromCanvasComponent: true,
                          children: jsx(ReactFragment, {
                            children: jsx("p", {
                              style: {
                                "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                                "--framer-font-family":
                                  '"Montserrat", "Montserrat Placeholder", sans-serif',
                                "--framer-font-size": "14px",
                                "--framer-font-weight": "500",
                                "--framer-text-color":
                                  "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                              },
                              children: jsx(B, {
                                href: { webPageId: "bzydBB85Y" },
                                openInNewTab: false,
                                smoothScroll: false,
                                children: jsx("a", {
                                  className: "framer-styles-preset-b5e6zr",
                                  "data-styles-preset": "H9WgrbXMf",
                                  children: "Neoflix",
                                }),
                              }),
                            }),
                          }),
                          className: "framer-stxdqk",
                          "data-framer-name": "Reflection",
                          fonts: ["GF;Montserrat-500"],
                          name: "Reflection",
                          verticalAlignment: "top",
                          withExternalLayout: true,
                        }),
                        jsx(RichTextComponent, {
                          __fromCanvasComponent: true,
                          children: jsx(ReactFragment, {
                            children: jsx("p", {
                              style: {
                                "--font-selector": "R0Y7TW9udHNlcnJhdC01MDA=",
                                "--framer-font-family":
                                  '"Montserrat", "Montserrat Placeholder", sans-serif',
                                "--framer-font-size": "14px",
                                "--framer-font-weight": "500",
                                "--framer-text-color": "rgb(33, 33, 33)",
                              },
                              children: jsx(B, {
                                href: { webPageId: "aLuYbVoBY" },
                                openInNewTab: false,
                                smoothScroll: false,
                                children: jsx("a", {
                                  className: "framer-styles-preset-b5e6zr",
                                  "data-styles-preset": "H9WgrbXMf",
                                  children: "Publications",
                                }),
                              }),
                            }),
                          }),
                          className: "framer-1o1zry",
                          "data-framer-name": "Reflection",
                          fonts: ["GF;Montserrat-500"],
                          name: "Reflection",
                          verticalAlignment: "top",
                          withExternalLayout: true,
                        }),
                        jsx(B, {
                          href: { webPageId: "x05wlhCdy" },
                          children: jsx(motion.a, {
                            className: "framer-pi7ax framer-lux5qc",
                            whileHover: qi,
                            children: jsx(RichTextComponent, {
                              __fromCanvasComponent: true,
                              children: jsx(ReactFragment, {
                                children: jsx("p", {
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
                              className: "framer-lgurj2",
                              "data-framer-name": "Toolbox",
                              fonts: ["GF;Montserrat-500"],
                              name: "Toolbox",
                              verticalAlignment: "top",
                              withExternalLayout: true,
                            }),
                          }),
                        }),
                      ],
                    }),
                  ],
                }),
                R() &&
                  jsxs(pi, {
                    className: "framer-2oid04 hidden-72rtr7 hidden-1uu5wld",
                    "data-framer-name": "Main",
                    name: "Main",
                    children: [
                      jsx(ge, {
                        className: "framer-su22bd",
                        "data-framer-name": "Worldmap",
                        name: "Worldmap",
                        children: jsx(PropertyOverridesProvider, {
                          breakpoint: l,
                          overrides: {
                            CXFUsfZRE: {
                              width: "calc(100vw + 810px)",
                              y: 8960,
                            },
                          },
                          children: jsx(DeviceSizeContainer, {
                            height: 1100,
                            children: jsx(cssSSRMinifiedHelper, {
                              className: "framer-15e83ey-container",
                              children: jsx(MapMobile2Component, {
                                height: "100%",
                                id: "o7_4SypJZ",
                                layoutId: "o7_4SypJZ",
                                style: { height: "100%", width: "100%" },
                                U61PmbVVJ: {
                                  delay: 1,
                                  duration: 10,
                                  ease: [0.44, 0, 0.56, 1],
                                  type: "tween" /* CSS-like easing animation */,
                                },
                                variant: "ldXzQ12pX",
                                width: "100%",
                              }),
                            }),
                          }),
                        }),
                      }),
                      jsx(me, {
                        className: "framer-1ik8i4i",
                        "data-framer-name": "Section-Intermission",
                        name: "Section-Intermission",
                        children: jsx(motion.div, {
                          className: "framer-1gmu7om",
                          children: jsx(motion.div, {
                            className: "framer-6b16oh",
                            children: jsx(motion.div, {
                              className: "framer-t91ls2",
                              children: jsx(RichTextComponent, {
                                __fromCanvasComponent: true,
                                children: jsx(ReactFragment, {
                                  children: jsxs("h1", {
                                    style: {
                                      "--font-selector": "R0Y7SW50ZXItNzAw",
                                      "--framer-font-family":
                                        '"Inter", "Inter Placeholder", sans-serif',
                                      "--framer-font-size": "55px",
                                      "--framer-font-weight": "700",
                                      "--framer-letter-spacing": "-2px",
                                      "--framer-text-alignment": "left",
                                      "--framer-text-color":
                                        "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                    },
                                    children: [
                                      "In the moment, ",
                                      jsx("span", {
                                        style: {
                                          "--framer-text-color":
                                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                                        },
                                        children: "only",
                                      }),
                                      " the patient matters\u2026",
                                    ],
                                  }),
                                }),
                                className: "framer-3u9q5l",
                                fonts: ["GF;Inter-700"],
                                verticalAlignment: "top",
                                withExternalLayout: true,
                              }),
                            }),
                          }),
                        }),
                      }),
                      jsx(me, {
                        className: "framer-pbgesn",
                        "data-framer-name": "Section-Dance",
                        name: "Section-Dance",
                        children: jsxs(motion.div, {
                          className: "framer-uvqrd9",
                          children: [
                            jsx(motion.div, {
                              className: "framer-1778g3n",
                              children: jsx(B, {
                                href: {
                                  hash: ":dbtg_NZW8",
                                  webPageId: "bzydBB85Y",
                                },
                                openInNewTab: false,
                                smoothScroll: true,
                                children: jsx(motion.a, {
                                  className: "framer-155vfoo framer-lux5qc",
                                  children: jsx(DeviceSizeContainer, {
                                    children: jsx(cssSSRMinifiedHelper, {
                                      className: "framer-e1ey9a-container",
                                      children: jsx(G, {
                                        backgroundColor: "rgba(0, 0, 0, 0)",
                                        borderRadius: 0,
                                        bottomLeftRadius: 0,
                                        bottomRightRadius: 0,
                                        controls: false,
                                        height: "100%",
                                        id: "eNqCt0PTc",
                                        isMixedBorderRadius: false,
                                        layoutId: "eNqCt0PTc",
                                        loop: true,
                                        muted: true,
                                        objectFit: "cover",
                                        playing: true,
                                        posterEnabled: false,
                                        srcFile:
                                          "./assets/asfmi1yiucoq4pfzbvw61u2t0d0.mp4",
                                        srcType: "Upload",
                                        srcUrl:
                                          "./assets/mixkit-clouds-sky.mp4",
                                        startTime: 0,
                                        style: {
                                          height: "100%",
                                          width: "100%",
                                        },
                                        topLeftRadius: 0,
                                        topRightRadius: 0,
                                        volume: 25,
                                        width: "100%",
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                            jsx(motion.div, {
                              className: "framer-1djjt42",
                              children: jsx(motion.div, {
                                className: "framer-19ai335",
                                children: jsx(RichTextComponent, {
                                  __fromCanvasComponent: true,
                                  children: jsx(ReactFragment, {
                                    children: jsx("h3", {
                                      style: {
                                        "--font-selector": "SW50ZXItQm9sZA==",
                                        "--framer-font-family":
                                          '"Inter", "Inter Placeholder", sans-serif',
                                        "--framer-font-size": "30px",
                                        "--framer-font-weight": "700",
                                        "--framer-letter-spacing": "-0.5px",
                                        "--framer-line-height": "1.4em",
                                        "--framer-text-alignment": "center",
                                        "--framer-text-color":
                                          "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                      },
                                      children:
                                        "Which makes coordination within teams vital for success.",
                                    }),
                                  }),
                                  className: "framer-16735xb",
                                  fonts: ["Inter-Bold"],
                                  verticalAlignment: "top",
                                  withExternalLayout: true,
                                }),
                              }),
                            }),
                          ],
                        }),
                      }),
                      jsx(me, {
                        className: "framer-15vmt0k",
                        "data-framer-name": "Section-Cost",
                        name: "Section-Cost",
                        children: jsxs(motion.div, {
                          className: "framer-1fllrdy",
                          children: [
                            jsx(motion.div, {
                              className: "framer-1tp3ir",
                              children: jsx(B, {
                                href: {
                                  hash: ":tftSCv8zZ",
                                  webPageId: "bzydBB85Y",
                                },
                                openInNewTab: false,
                                smoothScroll: true,
                                children: jsx(motion.a, {
                                  className: "framer-70lyct framer-lux5qc",
                                  children: jsx(DeviceSizeContainer, {
                                    children: jsx(cssSSRMinifiedHelper, {
                                      className: "framer-19faesl-container",
                                      children: jsx(G, {
                                        backgroundColor: "rgba(0, 0, 0, 0)",
                                        borderRadius: 0,
                                        bottomLeftRadius: 0,
                                        bottomRightRadius: 0,
                                        controls: false,
                                        height: "100%",
                                        id: "h1verNsbC",
                                        isMixedBorderRadius: false,
                                        layoutId: "h1verNsbC",
                                        loop: true,
                                        muted: true,
                                        objectFit: "cover",
                                        playing: true,
                                        posterEnabled: false,
                                        srcFile:
                                          "./assets/4eqcqdq3npzd3gwjcko6senyqg0.mp4",
                                        srcType: "Upload",
                                        srcUrl:
                                          "./assets/mixkit-clouds-sky.mp4",
                                        startTime: 0,
                                        style: {
                                          height: "100%",
                                          width: "100%",
                                        },
                                        topLeftRadius: 0,
                                        topRightRadius: 0,
                                        volume: 25,
                                        width: "100%",
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                            jsx(motion.div, {
                              className: "framer-a4hnew",
                              children: jsx(motion.div, {
                                className: "framer-1p147u6",
                                children: jsx(RichTextComponent, {
                                  __fromCanvasComponent: true,
                                  children: jsx(ReactFragment, {
                                    children: jsx("h3", {
                                      style: {
                                        "--font-selector": "SW50ZXItQm9sZA==",
                                        "--framer-font-family":
                                          '"Inter", "Inter Placeholder", sans-serif',
                                        "--framer-font-size": "30px",
                                        "--framer-font-weight": "700",
                                        "--framer-letter-spacing": "-0.5px",
                                        "--framer-line-height": "1.4em",
                                        "--framer-text-alignment": "center",
                                        "--framer-text-color":
                                          "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                      },
                                      children:
                                        "Task-driven focus can lead to tunnel vision and misalignment.",
                                    }),
                                  }),
                                  className: "framer-1s2g2i9",
                                  fonts: ["Inter-Bold"],
                                  verticalAlignment: "top",
                                  withExternalLayout: true,
                                }),
                              }),
                            }),
                          ],
                        }),
                      }),
                      jsx(me, {
                        className: "framer-h6e4v4",
                        "data-framer-name": "Section-Intermission",
                        name: "Section-Intermission",
                        children: jsx(motion.div, {
                          className: "framer-1g89ijn",
                          children: jsx(motion.div, {
                            className: "framer-k7dh17",
                            children: jsx(motion.div, {
                              className: "framer-r98bkj",
                              children: jsx(RichTextComponent, {
                                __fromCanvasComponent: true,
                                children: jsx(ReactFragment, {
                                  children: jsxs("h1", {
                                    style: {
                                      "--font-selector": "R0Y7SW50ZXItNzAw",
                                      "--framer-font-family":
                                        '"Inter", "Inter Placeholder", sans-serif',
                                      "--framer-font-size": "50px",
                                      "--framer-font-weight": "700",
                                      "--framer-letter-spacing": "-2px",
                                      "--framer-text-alignment": "left",
                                      "--framer-text-color":
                                        "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                    },
                                    children: [
                                      jsx("span", {
                                        style: { "--framer-font-size": "55px" },
                                        children: "...yet, ",
                                      }),
                                      jsx("span", {
                                        style: {
                                          "--framer-font-size": "55px",
                                          "--framer-text-color":
                                            "var(--token-3f355627-0701-4163-9212-31117bae3b68, rgb(114, 194, 194))",
                                        },
                                        children: "reflection",
                                      }),
                                      jsx("span", {
                                        style: { "--framer-font-size": "55px" },
                                        children: " strengthens",
                                      }),
                                      jsx("span", {
                                        style: { "--framer-font-size": "55px" },
                                        children: jsx("br", {}),
                                      }),
                                      jsx("span", {
                                        style: { "--framer-font-size": "55px" },
                                        children: "the next.",
                                      }),
                                    ],
                                  }),
                                }),
                                className: "framer-1dkioac",
                                fonts: ["GF;Inter-700"],
                                verticalAlignment: "top",
                                withExternalLayout: true,
                              }),
                            }),
                          }),
                        }),
                      }),
                      jsx(me, {
                        className: "framer-1h5rsno",
                        "data-framer-name": "Section-Skills",
                        name: "Section-Skills",
                        children: jsxs(motion.div, {
                          className: "framer-ycgccy",
                          children: [
                            jsx(motion.div, {
                              className: "framer-eru19r",
                              children: jsx(B, {
                                href: {
                                  hash: ":mRVhqybMB",
                                  webPageId: "bzydBB85Y",
                                },
                                openInNewTab: false,
                                smoothScroll: true,
                                children: jsx(motion.a, {
                                  className: "framer-1b0vvft framer-lux5qc",
                                  children: jsx(DeviceSizeContainer, {
                                    children: jsx(cssSSRMinifiedHelper, {
                                      className: "framer-ni3rk9-container",
                                      children: jsx(G, {
                                        backgroundColor: "rgba(0, 0, 0, 0)",
                                        borderRadius: 0,
                                        bottomLeftRadius: 0,
                                        bottomRightRadius: 0,
                                        controls: false,
                                        height: "100%",
                                        id: "Uta90mcQl",
                                        isMixedBorderRadius: false,
                                        layoutId: "Uta90mcQl",
                                        loop: true,
                                        muted: true,
                                        objectFit: "cover",
                                        playing: true,
                                        posterEnabled: false,
                                        srcFile:
                                          "./assets/dmivdyww4oxllv34ov7ac24l2q.mp4",
                                        srcType: "Upload",
                                        srcUrl:
                                          "./assets/mixkit-clouds-sky.mp4",
                                        startTime: 0,
                                        style: {
                                          height: "100%",
                                          width: "100%",
                                        },
                                        topLeftRadius: 0,
                                        topRightRadius: 0,
                                        volume: 25,
                                        width: "100%",
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                            jsx(motion.div, {
                              className: "framer-1anpbt7",
                              children: jsx(motion.div, {
                                className: "framer-dvlf7d",
                                children: jsx(RichTextComponent, {
                                  __fromCanvasComponent: true,
                                  children: jsx(ReactFragment, {
                                    children: jsx("h3", {
                                      style: {
                                        "--font-selector": "SW50ZXItQm9sZA==",
                                        "--framer-font-family":
                                          '"Inter", "Inter Placeholder", sans-serif',
                                        "--framer-font-size": "30px",
                                        "--framer-font-weight": "700",
                                        "--framer-letter-spacing": "-0.5px",
                                        "--framer-line-height": "1.4em",
                                        "--framer-text-alignment": "center",
                                        "--framer-text-color":
                                          "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                      },
                                      children:
                                        "Quiet reflection allows for sharpening skills.",
                                    }),
                                  }),
                                  className: "framer-24ge97",
                                  fonts: ["Inter-Bold"],
                                  verticalAlignment: "top",
                                  withExternalLayout: true,
                                }),
                              }),
                            }),
                          ],
                        }),
                      }),
                      jsx(me, {
                        className: "framer-1o8tkgz",
                        "data-framer-name": "Section-Team",
                        name: "Section-Team",
                        children: jsxs(motion.div, {
                          className: "framer-4avabb",
                          children: [
                            jsx(motion.div, {
                              className: "framer-14lpll9",
                              children: jsx(B, {
                                href: {
                                  hash: ":NYP2seWhD",
                                  webPageId: "bzydBB85Y",
                                },
                                openInNewTab: false,
                                children: jsx(motion.a, {
                                  className: "framer-9inaut framer-lux5qc",
                                  children: jsx(DeviceSizeContainer, {
                                    children: jsx(cssSSRMinifiedHelper, {
                                      className: "framer-1gc0yrt-container",
                                      children: jsx(G, {
                                        backgroundColor: "rgba(0, 0, 0, 0)",
                                        borderRadius: 0,
                                        bottomLeftRadius: 0,
                                        bottomRightRadius: 0,
                                        controls: false,
                                        height: "100%",
                                        id: "HHubI0W0Z",
                                        isMixedBorderRadius: false,
                                        layoutId: "HHubI0W0Z",
                                        loop: true,
                                        muted: true,
                                        objectFit: "cover",
                                        playing: true,
                                        posterEnabled: false,
                                        srcFile:
                                          "./assets/vwo4riwl3gvptsfywhwtozltmhu.mp4",
                                        srcType: "Upload",
                                        srcUrl:
                                          "./assets/mixkit-clouds-sky.mp4",
                                        startTime: 0,
                                        style: {
                                          height: "100%",
                                          width: "100%",
                                        },
                                        topLeftRadius: 0,
                                        topRightRadius: 0,
                                        volume: 25,
                                        width: "100%",
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                            jsx(motion.div, {
                              className: "framer-194fqnw",
                              children: jsx(motion.div, {
                                className: "framer-1lmwi62",
                                children: jsx(RichTextComponent, {
                                  __fromCanvasComponent: true,
                                  children: jsx(ReactFragment, {
                                    children: jsx("h3", {
                                      style: {
                                        "--font-selector": "SW50ZXItQm9sZA==",
                                        "--framer-font-family":
                                          '"Inter", "Inter Placeholder", sans-serif',
                                        "--framer-font-size": "30px",
                                        "--framer-font-weight": "700",
                                        "--framer-letter-spacing": "-0.5px",
                                        "--framer-line-height": "1.4em",
                                        "--framer-text-alignment": "center",
                                        "--framer-text-color":
                                          "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                      },
                                      children:
                                        "Further video debriefs foster cohesion amongst peers.",
                                    }),
                                  }),
                                  className: "framer-bjt2fy",
                                  fonts: ["Inter-Bold"],
                                  verticalAlignment: "top",
                                  withExternalLayout: true,
                                }),
                              }),
                            }),
                          ],
                        }),
                      }),
                      jsx(me, {
                        className: "framer-bstmck",
                        "data-framer-name": "Section-Perspective",
                        name: "Section-Perspective",
                        children: jsxs(motion.div, {
                          className: "framer-1fycwfh",
                          children: [
                            jsx(motion.div, {
                              className: "framer-11wjs2p",
                              children: jsx(B, {
                                href: {
                                  hash: ":DXqsCYt4L",
                                  webPageId: "bzydBB85Y",
                                },
                                openInNewTab: false,
                                smoothScroll: true,
                                children: jsx(motion.a, {
                                  className: "framer-1udrl05 framer-lux5qc",
                                  children: jsx(DeviceSizeContainer, {
                                    children: jsx(cssSSRMinifiedHelper, {
                                      className: "framer-18mjo87-container",
                                      children: jsx(G, {
                                        backgroundColor: "rgba(0, 0, 0, 0)",
                                        borderRadius: 0,
                                        bottomLeftRadius: 0,
                                        bottomRightRadius: 0,
                                        controls: false,
                                        height: "100%",
                                        id: "JWDyD_uLT",
                                        isMixedBorderRadius: false,
                                        layoutId: "JWDyD_uLT",
                                        loop: true,
                                        muted: true,
                                        objectFit: "cover",
                                        playing: true,
                                        posterEnabled: false,
                                        srcFile:
                                          "./assets/4ngdifknqsawywizi61ep17uvsq.mp4",
                                        srcType: "Upload",
                                        srcUrl:
                                          "./assets/mixkit-clouds-sky.mp4",
                                        startTime: 0,
                                        style: {
                                          height: "100%",
                                          width: "100%",
                                        },
                                        topLeftRadius: 0,
                                        topRightRadius: 0,
                                        volume: 25,
                                        width: "100%",
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                            jsx(motion.div, {
                              className: "framer-jl5t6f",
                              children: jsx(motion.div, {
                                className: "framer-1l2tixu",
                                children: jsx(RichTextComponent, {
                                  __fromCanvasComponent: true,
                                  children: jsx(ReactFragment, {
                                    children: jsx("h3", {
                                      style: {
                                        "--font-selector": "SW50ZXItQm9sZA==",
                                        "--framer-font-family":
                                          '"Inter", "Inter Placeholder", sans-serif',
                                        "--framer-font-size": "30px",
                                        "--framer-font-weight": "700",
                                        "--framer-letter-spacing": "-0.5px",
                                        "--framer-line-height": "1.4em",
                                        "--framer-text-alignment": "center",
                                        "--framer-text-color":
                                          "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                      },
                                      children:
                                        "Shared understanding enhances decisiveness.",
                                    }),
                                  }),
                                  className: "framer-g8l3fz",
                                  fonts: ["Inter-Bold"],
                                  verticalAlignment: "top",
                                  withExternalLayout: true,
                                }),
                              }),
                            }),
                          ],
                        }),
                      }),
                      jsx(me, {
                        className: "framer-14fyi8v",
                        "data-framer-name": "Section-Time",
                        name: "Section-Time",
                        children: jsxs(motion.div, {
                          className: "framer-qg0h3f",
                          children: [
                            jsx(motion.div, {
                              className: "framer-1rf1z8u",
                              children: jsx(B, {
                                href: {
                                  hash: ":WjO84y3BZ",
                                  webPageId: "bzydBB85Y",
                                },
                                openInNewTab: false,
                                smoothScroll: true,
                                children: jsx(motion.a, {
                                  className: "framer-105urfr framer-lux5qc",
                                  children: jsx(DeviceSizeContainer, {
                                    children: jsx(cssSSRMinifiedHelper, {
                                      className: "framer-1ta4ebg-container",
                                      children: jsx(G, {
                                        backgroundColor: "rgba(0, 0, 0, 0)",
                                        borderRadius: 0,
                                        bottomLeftRadius: 0,
                                        bottomRightRadius: 0,
                                        controls: false,
                                        height: "100%",
                                        id: "KM0xYqjRv",
                                        isMixedBorderRadius: false,
                                        layoutId: "KM0xYqjRv",
                                        loop: true,
                                        muted: true,
                                        objectFit: "cover",
                                        playing: true,
                                        posterEnabled: false,
                                        srcFile:
                                          "./assets/94fgikdxvin3xjyp51x5ydq5hw.mp4",
                                        srcType: "Upload",
                                        srcUrl:
                                          "./assets/mixkit-clouds-sky.mp4",
                                        startTime: 0,
                                        style: {
                                          height: "100%",
                                          width: "100%",
                                        },
                                        topLeftRadius: 0,
                                        topRightRadius: 0,
                                        volume: 25,
                                        width: "100%",
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                            jsx(motion.div, {
                              className: "framer-z1w1qy",
                              children: jsx(motion.div, {
                                className: "framer-1brktv",
                                children: jsx(RichTextComponent, {
                                  __fromCanvasComponent: true,
                                  children: jsx(ReactFragment, {
                                    children: jsx("h3", {
                                      style: {
                                        "--font-selector": "SW50ZXItQm9sZA==",
                                        "--framer-font-family":
                                          '"Inter", "Inter Placeholder", sans-serif',
                                        "--framer-font-size": "30px",
                                        "--framer-font-weight": "700",
                                        "--framer-letter-spacing": "-0.5px",
                                        "--framer-line-height": "1.4em",
                                        "--framer-text-alignment": "center",
                                        "--framer-text-color":
                                          "var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, rgb(245, 249, 252))",
                                      },
                                      children:
                                        "Medical interventions demand precision and urgency.",
                                    }),
                                  }),
                                  className: "framer-3d5i5i",
                                  fonts: ["Inter-Bold"],
                                  verticalAlignment: "top",
                                  withExternalLayout: true,
                                }),
                              }),
                            }),
                          ],
                        }),
                      }),
                      jsxs(me, {
                        className: "framer-vsn0zu",
                        "data-framer-name": "Hero Section",
                        name: "Hero Section",
                        children: [
                          jsx(motion.div, { className: "framer-1xzh66h" }),
                          jsx(PropertyOverridesProvider, {
                            breakpoint: l,
                            overrides: {
                              CXFUsfZRE: { width: "99.4956vw", y: 90 },
                            },
                            children: jsx(DeviceSizeContainer, {
                              height: 242,
                              children: jsx(cssSSRMinifiedHelper, {
                                className: "framer-u2hhht-container",
                                whileHover: Wr,
                                children: jsx(NeoflixAnim, {
                                  height: "100%",
                                  id: "qzyMp3yoL",
                                  layoutId: "qzyMp3yoL",
                                  style: { height: "100%", width: "100%" },
                                  variant: "h9tfYk7K5",
                                  width: "100%",
                                }),
                              }),
                            }),
                          }),
                          jsx(motion.div, {
                            className: "framer-9tpc26",
                            "data-framer-name": "Moment",
                            name: "Moment",
                            children: jsxs(motion.div, {
                              className: "framer-1nn7z0v",
                              children: [
                                jsx(PropertyOverridesProvider, {
                                  breakpoint: l,
                                  overrides: { CXFUsfZRE: { y: 377.5 } },
                                  children: jsx(DeviceSizeContainer, {
                                    height: 223,
                                    children: jsx(cssSSRMinifiedHelper, {
                                      className: "framer-s7m1wf-container",
                                      children: jsx(RecordReflectRefineCopy, {
                                        height: "100%",
                                        id: "RhYHZi1K3",
                                        layoutId: "RhYHZi1K3",
                                        variant: "jPAyFUDCD",
                                        width: "100%",
                                      }),
                                    }),
                                  }),
                                }),
                                jsx(RichTextComponent, {
                                  __fromCanvasComponent: true,
                                  children: jsx(ReactFragment, {
                                    children: jsx("p", {
                                      style: {
                                        "--font-selector": "SW50ZXItQm9sZA==",
                                        "--framer-font-family":
                                          '"Inter", "Inter Placeholder", sans-serif',
                                        "--framer-font-size": "27px",
                                        "--framer-font-weight": "700",
                                        "--framer-text-color":
                                          "var(--token-1af50db2-7d53-4f76-a442-1d2b2bb0984c, rgb(152, 151, 161))",
                                      },
                                      children:
                                        "Improve patient care through video reflection.",
                                    }),
                                  }),
                                  className: "framer-4s8a2j",
                                  fonts: ["Inter-Bold"],
                                  verticalAlignment: "top",
                                  withExternalLayout: true,
                                }),
                              ],
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
                d() &&
                  jsxs(vi, {
                    className: "framer-1vtk60x hidden-1jamxon",
                    "data-framer-name": "Main",
                    name: "Main",
                    children: [
                      jsxs(ge, {
                        className: "framer-p8551w",
                        "data-framer-name": "Hero Section",
                        name: "Hero Section",
                        children: [
                          jsx(PropertyOverridesProvider, {
                            breakpoint: l,
                            overrides: {
                              ueHalD28r: {
                                height: 242,
                                width: "99.4956vw",
                                y: 173,
                              },
                            },
                            children: jsx(DeviceSizeContainer, {
                              height: 221,
                              width: "60vw",
                              y: 221,
                              children: jsx(cssSSRMinifiedHelper, {
                                className: "framer-1bdw7m-container",
                                transformTemplate: pr,
                                whileHover: Wr,
                                children: jsx(NeoflixAnim, {
                                  height: "100%",
                                  id: "tW6wrwedt",
                                  layoutId: "tW6wrwedt",
                                  style: { height: "100%", width: "100%" },
                                  variant: "h9tfYk7K5",
                                  width: "100%",
                                }),
                              }),
                            }),
                          }),
                          jsx(PropertyOverridesProvider, {
                            breakpoint: l,
                            overrides: { ueHalD28r: { transformTemplate: pr } },
                            children: jsx(motion.div, {
                              className: "framer-g3ro50",
                              "data-framer-name": "Moment",
                              name: "Moment",
                              children: jsx(motion.div, {
                                className: "framer-1ey594a",
                                children: jsx(PropertyOverridesProvider, {
                                  breakpoint: l,
                                  overrides: { ueHalD28r: { y: 600 } },
                                  children: jsx(DeviceSizeContainer, {
                                    height: 187,
                                    width: "685px",
                                    y: 373,
                                    children: jsx(PropertyOverridesProvider, {
                                      breakpoint: l,
                                      overrides: {
                                        ueHalD28r: {
                                          transformTemplate: undefined,
                                        },
                                      },
                                      children: jsx(cssSSRMinifiedHelper, {
                                        className: "framer-1eeo48e-container",
                                        transformTemplate: pr,
                                        children: jsx(RecordReflectRefine, {
                                          height: "100%",
                                          id: "NP_oewk8B",
                                          layoutId: "NP_oewk8B",
                                          style: { width: "100%" },
                                          variant: "Aa5IjJyQQ",
                                          width: "100%",
                                        }),
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                          }),
                        ],
                      }),
                      jsxs(ge, {
                        className: "framer-15cs0zp",
                        "data-framer-name": "Only the patient",
                        name: "Only the patient",
                        children: [
                          jsxs(Fe, {
                            animate: Qr,
                            className: "framer-1b5k5bb",
                            "data-framer-appear-id": "1b5k5bb",
                            "data-framer-name": "Moment header",
                            initial: Se,
                            name: "Moment header",
                            optimized: true,
                            children: [
                              jsx(motion.div, {
                                className: "framer-1i9dtug",
                                "data-framer-name": "Moment",
                                name: "Moment",
                                children: jsx(motion.div, {
                                  className: "framer-lp3hr5",
                                  "data-framer-name": "Content",
                                  name: "Content",
                                  children: jsx(RichTextComponent, {
                                    __fromCanvasComponent: true,
                                    children: jsx(ReactFragment, {
                                      children: jsxs("h1", {
                                        style: {
                                          "--font-selector": "R0Y7SW50ZXItNzAw",
                                          "--framer-font-family":
                                            '"Inter", "Inter Placeholder", sans-serif',
                                          "--framer-font-size": "50px",
                                          "--framer-font-weight": "700",
                                          "--framer-letter-spacing": "-2px",
                                          "--framer-text-alignment": "left",
                                          "--framer-text-color":
                                            "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                                        },
                                        children: [
                                          "In the moment, ",
                                          jsx("span", {
                                            style: {
                                              "--framer-text-color":
                                                "var(--token-61880a63-a0aa-4fc8-8a06-12f5d7522891, rgb(82, 156, 156))",
                                            },
                                            children: "only",
                                          }),
                                          " the patient matters",
                                        ],
                                      }),
                                    }),
                                    className: "framer-k8tuvw",
                                    fonts: ["GF;Inter-700"],
                                    verticalAlignment: "top",
                                    withExternalLayout: true,
                                  }),
                                }),
                              }),
                              jsx(motion.div, {
                                className: "framer-1agyzia",
                                children: jsx(motion.div, {
                                  className: "framer-1r3oll3",
                                  "data-framer-name": "Content",
                                  name: "Content",
                                }),
                              }),
                            ],
                          }),
                          jsx(Fe, {
                            animate: Zr,
                            className: "framer-j6gb99",
                            "data-framer-appear-id": "j6gb99",
                            "data-framer-name": "Animation Left",
                            initial: Se,
                            name: "Animation Left",
                            optimized: true,
                            children: jsx(motion.div, {
                              className: "framer-b5i1zv",
                              "data-framer-name": "Features",
                              name: "Features",
                              children: jsx(motion.div, {
                                className: "framer-1mxq6mp",
                                children: jsx(PropertyOverridesProvider, {
                                  breakpoint: l,
                                  overrides: {
                                    ueHalD28r: {
                                      width:
                                        "calc(min(100vw - 50px, 1000px) + 120px)",
                                    },
                                  },
                                  children: jsx(DeviceSizeContainer, {
                                    height: 352,
                                    width: "1000px",
                                    y: 1394,
                                    children: jsx(PropertyOverridesProvider, {
                                      breakpoint: l,
                                      overrides: {
                                        ueHalD28r: { transformTemplate: Gr },
                                      },
                                      children: jsx(cssSSRMinifiedHelper, {
                                        className: "framer-1k0ssbx-container",
                                        transformTemplate: Jr,
                                        children: jsx(StoryLeft2, {
                                          height: "100%",
                                          id: "oxXlQ801e",
                                          layoutId: "oxXlQ801e",
                                          style: { width: "100%" },
                                          variant: "Q1DJ9ntwf",
                                          width: "100%",
                                        }),
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                          }),
                        ],
                      }),
                      jsx(ge, {
                        className: "framer-3oh3yy",
                        "data-framer-name": "Yet, Reflection",
                        name: "Yet, Reflection",
                        children: jsxs(ge, {
                          className: "framer-11411eu",
                          "data-framer-name": "Reflection strengthens",
                          name: "Reflection strengthens",
                          children: [
                            jsxs(Fe, {
                              animate: Qr,
                              className: "framer-6axhfk",
                              "data-framer-appear-id": "6axhfk",
                              "data-framer-name": "Moment header",
                              initial: Se,
                              name: "Moment header",
                              optimized: true,
                              children: [
                                jsx(motion.div, {
                                  className: "framer-13fed00",
                                  children: jsx(motion.div, {
                                    className: "framer-101nclb",
                                    "data-framer-name": "Content",
                                    name: "Content",
                                  }),
                                }),
                                jsx(motion.div, {
                                  className: "framer-1dhzm6h",
                                  "data-framer-name": "Moment",
                                  name: "Moment",
                                  children: jsx(motion.div, {
                                    className: "framer-7ooj09",
                                    "data-framer-name": "Content",
                                    name: "Content",
                                    children: jsx(RichTextComponent, {
                                      __fromCanvasComponent: true,
                                      children: jsx(ReactFragment, {
                                        children: jsxs("h1", {
                                          style: {
                                            "--font-selector":
                                              "R0Y7SW50ZXItNzAw",
                                            "--framer-font-family":
                                              '"Inter", "Inter Placeholder", sans-serif',
                                            "--framer-font-size": "50px",
                                            "--framer-font-weight": "700",
                                            "--framer-letter-spacing": "-2px",
                                            "--framer-text-alignment": "right",
                                            "--framer-text-color":
                                              "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                                          },
                                          children: [
                                            "Yet, ",
                                            jsx("span", {
                                              style: {
                                                "--framer-text-color":
                                                  "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                                              },
                                              children: "reflection",
                                            }),
                                            " strengthens",
                                            jsx("br", {}),
                                            "the next",
                                          ],
                                        }),
                                      }),
                                      className: "framer-l3m9nd",
                                      fonts: ["GF;Inter-700"],
                                      verticalAlignment: "top",
                                      withExternalLayout: true,
                                    }),
                                  }),
                                }),
                              ],
                            }),
                            jsx(Fe, {
                              animate: Zr,
                              className: "framer-x5gqdq",
                              "data-framer-appear-id": "x5gqdq",
                              "data-framer-name": "Animation Right",
                              initial: Se,
                              name: "Animation Right",
                              optimized: true,
                              children: jsx(motion.div, {
                                className: "framer-1en550q",
                                "data-framer-name": "Features",
                                name: "Features",
                                children: jsx(motion.div, {
                                  className: "framer-ezl8wv",
                                  children: jsx(PropertyOverridesProvider, {
                                    breakpoint: l,
                                    overrides: {
                                      ueHalD28r: {
                                        width:
                                          "calc(min(100vw - 50px, 1000px) + 150px)",
                                      },
                                    },
                                    children: jsx(DeviceSizeContainer, {
                                      height: 352,
                                      width: "1000px",
                                      y: 2398,
                                      children: jsx(PropertyOverridesProvider, {
                                        breakpoint: l,
                                        overrides: {
                                          ueHalD28r: {
                                            transformTemplate: undefined,
                                          },
                                        },
                                        children: jsx(cssSSRMinifiedHelper, {
                                          className: "framer-qjopz5-container",
                                          transformTemplate: Jr,
                                          children: jsx(StoryRight, {
                                            height: "100%",
                                            id: "vc1jCsqkh",
                                            layoutId: "vc1jCsqkh",
                                            style: { width: "100%" },
                                            variant: "SoQlwVPaX",
                                            width: "100%",
                                          }),
                                        }),
                                      }),
                                    }),
                                  }),
                                }),
                              }),
                            }),
                          ],
                        }),
                      }),
                      jsxs(ge, {
                        className: "framer-1j5oyue",
                        "data-framer-name": "Worldmap",
                        name: "Worldmap",
                        children: [
                          jsx(DeviceSizeContainer, {
                            height: 1e3,
                            width: "100vw",
                            y: 3060,
                            children: jsx(cssSSRMinifiedHelper, {
                              className: "framer-14yr6pu-container",
                              children: jsx(MapComponent, {
                                height: "100%",
                                id: "RNjVxsq3J",
                                layoutId: "RNjVxsq3J",
                                style: { height: "100%", width: "100%" },
                                U61PmbVVJ: {
                                  delay: 1,
                                  duration: 10,
                                  ease: [0.44, 0, 0.56, 1],
                                  type: "tween" /* CSS-like easing animation */,
                                },
                                variant: "JxNX4Rz95",
                                width: "100%",
                              }),
                            }),
                          }),
                          jsx(motion.div, {
                            className: "framer-1b8s87v",
                            "data-framer-name": "Learnmore",
                            name: "Learnmore",
                            children: jsx(motion.div, {
                              className: "framer-x72eal",
                              "data-border": true,
                              children: jsx(B, {
                                href: { webPageId: "f7Ah01sPh" },
                                openInNewTab: false,
                                children: jsx(motion.a, {
                                  className: "framer-djajqq framer-lux5qc",
                                  whileHover: Oi,
                                  children: jsx(RichTextComponent, {
                                    __fromCanvasComponent: true,
                                    children: jsx(ReactFragment, {
                                      children: jsxs("h1", {
                                        style: {
                                          "--font-selector": "R0Y7SW50ZXItNzAw",
                                          "--framer-font-family":
                                            '"Inter", "Inter Placeholder", sans-serif',
                                          "--framer-font-size": "50px",
                                          "--framer-font-weight": "700",
                                          "--framer-letter-spacing": "-2px",
                                          "--framer-text-alignment": "left",
                                          "--framer-text-color":
                                            "var(--token-c8b566a8-9d13-4284-b32a-9b7fd1a6f5a4, rgb(56, 52, 55))",
                                        },
                                        children: [
                                          "Learn more about Neoflix from our ",
                                          jsx("span", {
                                            style: {
                                              "--framer-text-color":
                                                "var(--token-4eefdbfc-188c-4e73-9cde-c40c46f943d5, rgb(82, 156, 156))",
                                            },
                                            children: "network",
                                          }),
                                        ],
                                      }),
                                    }),
                                    className: "framer-w7thi6",
                                    fonts: ["GF;Inter-700"],
                                    transformTemplate: Gr,
                                    verticalAlignment: "top",
                                    withExternalLayout: true,
                                  }),
                                }),
                              }),
                            }),
                          }),
                        ],
                      }),
                    ],
                  }),
              ],
            }),
            jsx("div", { className: cx(Kr, ...x), id: "overlay" }),
          ],
        }),
      })
    );
  }),
  Home_css = [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${hr.bodyClassName}-framer-qO1UX { background: white; }`,
    ".framer-qO1UX.framer-lux5qc, .framer-qO1UX .framer-lux5qc { display: block; }",
    ".framer-qO1UX.framer-72rtr7 { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-qO1UX .framer-13yn9ib { -webkit-backdrop-filter: blur(5px); align-content: center; align-items: center; backdrop-filter: blur(5px); background-color: rgba(255, 255, 255, 0.5); box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.2); display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; height: 60px; justify-content: space-between; overflow: visible; padding: 24px 40px 24px 24px; position: relative; width: 100%; z-index: 10; }",
    ".framer-qO1UX .framer-xvlq3 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 40px; justify-content: center; overflow: visible; padding: 0px; position: relative; text-decoration: none; width: 40px; }",
    ".framer-qO1UX .framer-bg8cfc { flex: none; height: 40px; position: relative; width: 40px; }",
    ".framer-qO1UX .framer-rfpe3x { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: min-content; }",
    ".framer-qO1UX .framer-stxdqk, .framer-qO1UX .framer-1o1zry { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; }",
    ".framer-qO1UX .framer-pi7ax { align-content: center; align-items: center; background-color: var(--token-46c9bfd9-1bda-49fb-a06e-e385b05c9b2f, #383437); border-bottom-left-radius: 128px; border-bottom-right-radius: 128px; border-top-left-radius: 128px; border-top-right-radius: 128px; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 2px 11px 2px 11px; position: relative; text-decoration: none; width: min-content; z-index: 0; }",
    ".framer-qO1UX .framer-lgurj2 { -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre; width: auto; z-index: 10; }",
    ".framer-qO1UX .framer-2oid04, .framer-qO1UX .framer-1vtk60x { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: flex-start; overflow: auto; padding: 0px; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-su22bd, .framer-qO1UX .framer-1j5oyue { align-content: center; align-items: center; background-color: var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, #eef2f5); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; will-change: var(--framer-will-change-override, transform); }",
    ".framer-qO1UX .framer-15e83ey-container { bottom: 0px; flex: none; height: 110.00000000000001vh; left: -405px; position: absolute; right: -405px; z-index: 1; }",
    '.framer-qO1UX .framer-1ik8i4i { align-content: center; align-items: center; background: radial-gradient(261% 75% at 100% 50%, #016161 0%, var(--token-6fd11671-6924-4615-8f38-f932e61b0ba4, rgb(0, 22, 46)) /* {"name":"Gradient dark"} */ 100%); display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }',
    ".framer-qO1UX .framer-1gmu7om { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 100vh; justify-content: center; overflow: hidden; padding: 60px 0px 0px 0px; position: relative; width: 390px; }",
    ".framer-qO1UX .framer-6b16oh, .framer-qO1UX .framer-1778g3n, .framer-qO1UX .framer-1djjt42, .framer-qO1UX .framer-1tp3ir, .framer-qO1UX .framer-a4hnew, .framer-qO1UX .framer-k7dh17, .framer-qO1UX .framer-eru19r, .framer-qO1UX .framer-1anpbt7, .framer-qO1UX .framer-14lpll9, .framer-qO1UX .framer-194fqnw, .framer-qO1UX .framer-11wjs2p, .framer-qO1UX .framer-jl5t6f, .framer-qO1UX .framer-z1w1qy { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 1px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-t91ls2 { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 100%; justify-content: center; padding: 80px 0px 0px 0px; pointer-events: none; position: relative; width: 1px; }",
    ".framer-qO1UX .framer-3u9q5l, .framer-qO1UX .framer-1dkioac { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; --framer-paragraph-spacing: 0px; -webkit-user-select: none; flex: 0.8 0 0px; height: auto; overflow: visible; position: relative; user-select: none; white-space: pre-wrap; width: 1px; word-break: break-word; word-wrap: break-word; }",
    '.framer-qO1UX .framer-pbgesn, .framer-qO1UX .framer-1h5rsno, .framer-qO1UX .framer-1o8tkgz, .framer-qO1UX .framer-bstmck, .framer-qO1UX .framer-14fyi8v { align-content: center; align-items: center; background: radial-gradient(261% 75% at 100% 50%, #016161 0%, var(--token-6fd11671-6924-4615-8f38-f932e61b0ba4, rgb(0, 22, 46)) /* {"name":"Gradient dark"} */ 100%); display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }',
    ".framer-qO1UX .framer-uvqrd9, .framer-qO1UX .framer-1fllrdy, .framer-qO1UX .framer-1g89ijn, .framer-qO1UX .framer-ycgccy, .framer-qO1UX .framer-4avabb, .framer-qO1UX .framer-1fycwfh { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 100vh; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 390px; }",
    ".framer-qO1UX .framer-155vfoo, .framer-qO1UX .framer-70lyct, .framer-qO1UX .framer-1b0vvft, .framer-qO1UX .framer-9inaut, .framer-qO1UX .framer-1udrl05, .framer-qO1UX .framer-105urfr { background-color: #bbddff; flex: 1 0 0px; height: 100%; position: relative; text-decoration: none; width: 1px; }",
    ".framer-qO1UX .framer-e1ey9a-container, .framer-qO1UX .framer-19faesl-container, .framer-qO1UX .framer-ni3rk9-container, .framer-qO1UX .framer-1gc0yrt-container, .framer-qO1UX .framer-18mjo87-container, .framer-qO1UX .framer-1ta4ebg-container { flex: none; height: 50vh; left: 0px; position: absolute; right: 0px; top: calc(50.505050505050534% - 50vh / 2); }",
    ".framer-qO1UX .framer-19ai335, .framer-qO1UX .framer-1p147u6, .framer-qO1UX .framer-dvlf7d, .framer-qO1UX .framer-1lmwi62, .framer-qO1UX .framer-1l2tixu { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 100%; justify-content: center; padding: 20px 0px 0px 0px; pointer-events: none; position: relative; width: 1px; }",
    ".framer-qO1UX .framer-16735xb, .framer-qO1UX .framer-1s2g2i9, .framer-qO1UX .framer-24ge97, .framer-qO1UX .framer-bjt2fy, .framer-qO1UX .framer-g8l3fz, .framer-qO1UX .framer-3d5i5i { flex: none; height: auto; position: relative; white-space: pre-wrap; width: 347px; word-break: break-word; word-wrap: break-word; }",
    '.framer-qO1UX .framer-15vmt0k { align-content: center; align-items: center; background: radial-gradient(261% 75% at 100% 50%, #016161 0%, var(--token-6fd11671-6924-4615-8f38-f932e61b0ba4, rgb(0, 22, 46)) /* {"name":"Gradient dark"} */ 100%); display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 100%; }',
    ".framer-qO1UX .framer-h6e4v4 { align-content: center; align-items: center; background-color: var(--token-13b5b450-71c4-4161-9a24-7b5eae77301e, #00333b); display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: 100vh; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    '.framer-qO1UX .framer-r98bkj { align-content: center; align-items: center; background: radial-gradient(261% 75% at 100% 50%, #016161 0%, var(--token-6fd11671-6924-4615-8f38-f932e61b0ba4, rgb(0, 22, 46)) /* {"name":"Gradient dark"} */ 100%); display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 100%; justify-content: center; padding: 80px 0px 0px 0px; pointer-events: none; position: relative; width: 1px; }',
    ".framer-qO1UX .framer-qg0h3f { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 100vh; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 390px; }",
    ".framer-qO1UX .framer-1rf1z8u { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 1px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-1brktv { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 100%; justify-content: center; padding: 20px 0px 0px 0px; pointer-events: none; position: relative; width: 1px; }",
    '.framer-qO1UX .framer-vsn0zu { align-content: center; align-items: center; background: linear-gradient(180deg, var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, #f5f9fc) /* {"name":"Greywhite"} */ 0%, rgba(245, 249, 252, 1) 72.97297297297297%, rgb(120, 142, 158) 88.78877656953829%, var(--token-13b5b450-71c4-4161-9a24-7b5eae77301e, rgb(0, 51, 59)) /* {"name":"Mobile background"} */ 100%); display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 100vh; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }',
    ".framer-qO1UX .framer-1xzh66h { -webkit-mask: url('./images/4kxsxvu7zt8sexmeswpnojmkq.svg') alpha no-repeat center / cover add; box-shadow: 0px -2px 5px 0px rgba(0, 0, 0, 0.25); flex: none; height: 50.125vh; left: 188px; mask: url('./images/4kxsxvu7zt8sexmeswpnojmkq.svg') alpha no-repeat center / cover add; overflow: hidden; position: absolute; top: calc(49.12500000000002% - 50.125vh / 2); width: 658px; }",
    ".framer-qO1UX .framer-u2hhht-container { aspect-ratio: 3.269230769230769 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 61px); pointer-events: auto; position: absolute; right: 0px; top: 30px; width: 99%; z-index: 1; }",
    ".framer-qO1UX .framer-9tpc26 { align-content: flex-start; align-items: flex-start; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 30px 0px 0px 0px; position: relative; width: 1px; }",
    ".framer-qO1UX .framer-1nn7z0v { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 1px; }",
    ".framer-qO1UX .framer-s7m1wf-container { flex: none; height: auto; pointer-events: none; position: relative; width: auto; }",
    ".framer-qO1UX .framer-4s8a2j { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; -webkit-user-select: none; flex: none; height: auto; position: relative; user-select: none; white-space: pre-wrap; width: 221px; word-break: break-word; word-wrap: break-word; }",
    ".framer-qO1UX .framer-p8551w { align-content: center; align-items: center; background-color: var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, #edf2f5); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 100vh; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-1bdw7m-container { aspect-ratio: 3.269230769230769 / 1; flex: none; height: var(--framer-aspect-ratio-supported, 218px); left: 50%; position: absolute; top: 161px; transform: translateX(-50%); width: 60%; z-index: 1; }",
    ".framer-qO1UX .framer-g3ro50 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: visible; padding: 0px; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-1ey594a { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; min-height: 588px; overflow: visible; padding: 0px; position: relative; width: 685px; }",
    ".framer-qO1UX .framer-1eeo48e-container { bottom: 0px; flex: none; height: auto; left: 50%; position: absolute; transform: translateX(-50%); width: 100%; z-index: 1; }",
    ".framer-qO1UX .framer-15cs0zp, .framer-qO1UX .framer-3oh3yy, .framer-qO1UX .framer-11411eu { align-content: center; align-items: center; background-color: var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, #eef2f5); border-bottom-left-radius: 4px; border-bottom-right-radius: 4px; border-top-left-radius: 4px; border-top-right-radius: 4px; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: 100vh; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; will-change: var(--framer-will-change-override, transform); }",
    ".framer-qO1UX .framer-1b5k5bb, .framer-qO1UX .framer-6axhfk { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 1200px; }",
    ".framer-qO1UX .framer-1i9dtug { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 0px 0px 0px 50px; position: relative; width: 1px; }",
    ".framer-qO1UX .framer-lp3hr5, .framer-qO1UX .framer-7ooj09 { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; max-width: 2018px; padding: 0px; position: relative; width: 400px; }",
    ".framer-qO1UX .framer-k8tuvw, .framer-qO1UX .framer-l3m9nd { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; --framer-paragraph-spacing: 0px; -webkit-user-select: none; flex: none; height: auto; overflow: visible; position: relative; user-select: none; white-space: pre-wrap; width: 100%; word-break: break-word; word-wrap: break-word; }",
    ".framer-qO1UX .framer-1agyzia, .framer-qO1UX .framer-13fed00 { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 1px; }",
    ".framer-qO1UX .framer-1r3oll3, .framer-qO1UX .framer-101nclb { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 20px; height: min-content; justify-content: center; max-width: 2018px; min-height: 120px; padding: 0px; position: relative; width: 400px; }",
    ".framer-qO1UX .framer-j6gb99 { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: visible; padding: 50px 0px 100px 50px; position: relative; width: 100%; z-index: 8; }",
    ".framer-qO1UX .framer-b5i1zv, .framer-qO1UX .framer-1en550q { align-content: flex-start; align-items: flex-start; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 100px; height: min-content; justify-content: center; max-width: 1000px; overflow: visible; padding: 0px; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-1mxq6mp, .framer-qO1UX .framer-ezl8wv { flex: none; height: 352px; overflow: visible; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-1k0ssbx-container, .framer-qO1UX .framer-qjopz5-container { flex: none; height: auto; left: 50%; position: absolute; top: 50%; transform: translate(-50%, -50%); width: 1000px; }",
    ".framer-qO1UX .framer-1dhzm6h { align-content: center; align-items: center; display: flex; flex: 1 0 0px; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 0px 0px 8px 50px; position: relative; width: 1px; }",
    ".framer-qO1UX .framer-x5gqdq { align-content: center; align-items: center; display: flex; flex: none; flex-direction: column; flex-wrap: nowrap; gap: 10px; height: min-content; justify-content: center; overflow: hidden; padding: 50px 0px 100px 50px; position: relative; width: 100%; z-index: 8; }",
    ".framer-qO1UX .framer-14yr6pu-container { flex: none; height: 100vh; position: relative; width: 100%; }",
    ".framer-qO1UX .framer-1b8s87v { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 39%; justify-content: center; overflow: visible; padding: 154px; pointer-events: auto; position: absolute; right: -272px; top: 0px; width: 872px; z-index: 1; }",
    ".framer-qO1UX .framer-x72eal { --border-bottom-width: 1px; --border-color: rgba(245, 249, 252, 0.6); --border-left-width: 1px; --border-right-width: 1px; --border-style: solid; --border-top-width: 1px; -webkit-backdrop-filter: blur(5px); align-content: center; align-items: center; backdrop-filter: blur(5px); background-color: rgba(245, 249, 252, 0.56); border-bottom-left-radius: 20px; border-top-left-radius: 20px; box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.25); display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 70%; justify-content: center; overflow: hidden; padding: 0px; pointer-events: auto; position: absolute; right: 0px; top: calc(50.00000000000002% - 70% / 2); width: 816px; will-change: var(--framer-will-change-override, transform); z-index: 9; }",
    ".framer-qO1UX .framer-djajqq { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 10px; height: 100%; justify-content: flex-end; left: calc(50.00000000000002% - 816px / 2); overflow: visible; padding: 0px; pointer-events: auto; position: absolute; text-decoration: none; top: -1px; width: 816px; z-index: 1; }",
    ".framer-qO1UX .framer-w7thi6 { --framer-link-text-color: #0099ff; --framer-link-text-decoration: underline; --framer-paragraph-spacing: 0px; -webkit-user-select: none; flex: none; height: auto; left: 44px; overflow: visible; position: absolute; top: 50%; transform: translateY(-50%); user-select: none; white-space: pre-wrap; width: 500px; word-break: break-word; word-wrap: break-word; z-index: 1; }",
    "@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-qO1UX.framer-72rtr7, .framer-qO1UX .framer-xvlq3, .framer-qO1UX .framer-rfpe3x, .framer-qO1UX .framer-pi7ax, .framer-qO1UX .framer-2oid04, .framer-qO1UX .framer-su22bd, .framer-qO1UX .framer-1ik8i4i, .framer-qO1UX .framer-1gmu7om, .framer-qO1UX .framer-6b16oh, .framer-qO1UX .framer-t91ls2, .framer-qO1UX .framer-pbgesn, .framer-qO1UX .framer-uvqrd9, .framer-qO1UX .framer-1778g3n, .framer-qO1UX .framer-1djjt42, .framer-qO1UX .framer-19ai335, .framer-qO1UX .framer-15vmt0k, .framer-qO1UX .framer-1fllrdy, .framer-qO1UX .framer-1tp3ir, .framer-qO1UX .framer-a4hnew, .framer-qO1UX .framer-1p147u6, .framer-qO1UX .framer-h6e4v4, .framer-qO1UX .framer-1g89ijn, .framer-qO1UX .framer-k7dh17, .framer-qO1UX .framer-r98bkj, .framer-qO1UX .framer-1h5rsno, .framer-qO1UX .framer-ycgccy, .framer-qO1UX .framer-eru19r, .framer-qO1UX .framer-1anpbt7, .framer-qO1UX .framer-dvlf7d, .framer-qO1UX .framer-1o8tkgz, .framer-qO1UX .framer-4avabb, .framer-qO1UX .framer-14lpll9, .framer-qO1UX .framer-194fqnw, .framer-qO1UX .framer-1lmwi62, .framer-qO1UX .framer-bstmck, .framer-qO1UX .framer-1fycwfh, .framer-qO1UX .framer-11wjs2p, .framer-qO1UX .framer-jl5t6f, .framer-qO1UX .framer-1l2tixu, .framer-qO1UX .framer-14fyi8v, .framer-qO1UX .framer-qg0h3f, .framer-qO1UX .framer-1rf1z8u, .framer-qO1UX .framer-z1w1qy, .framer-qO1UX .framer-1brktv, .framer-qO1UX .framer-vsn0zu, .framer-qO1UX .framer-9tpc26, .framer-qO1UX .framer-1nn7z0v, .framer-qO1UX .framer-1vtk60x, .framer-qO1UX .framer-p8551w, .framer-qO1UX .framer-g3ro50, .framer-qO1UX .framer-1ey594a, .framer-qO1UX .framer-15cs0zp, .framer-qO1UX .framer-1b5k5bb, .framer-qO1UX .framer-1i9dtug, .framer-qO1UX .framer-lp3hr5, .framer-qO1UX .framer-1agyzia, .framer-qO1UX .framer-1r3oll3, .framer-qO1UX .framer-j6gb99, .framer-qO1UX .framer-b5i1zv, .framer-qO1UX .framer-3oh3yy, .framer-qO1UX .framer-11411eu, .framer-qO1UX .framer-6axhfk, .framer-qO1UX .framer-13fed00, .framer-qO1UX .framer-101nclb, .framer-qO1UX .framer-1dhzm6h, .framer-qO1UX .framer-7ooj09, .framer-qO1UX .framer-x5gqdq, .framer-qO1UX .framer-1en550q, .framer-qO1UX .framer-1j5oyue, .framer-qO1UX .framer-1b8s87v, .framer-qO1UX .framer-x72eal, .framer-qO1UX .framer-djajqq { gap: 0px; } .framer-qO1UX.framer-72rtr7 > *, .framer-qO1UX .framer-2oid04 > *, .framer-qO1UX .framer-su22bd > *, .framer-qO1UX .framer-1ik8i4i > *, .framer-qO1UX .framer-pbgesn > *, .framer-qO1UX .framer-15vmt0k > *, .framer-qO1UX .framer-h6e4v4 > *, .framer-qO1UX .framer-1h5rsno > *, .framer-qO1UX .framer-1o8tkgz > *, .framer-qO1UX .framer-bstmck > *, .framer-qO1UX .framer-14fyi8v > *, .framer-qO1UX .framer-1vtk60x > *, .framer-qO1UX .framer-g3ro50 > *, .framer-qO1UX .framer-1j5oyue > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .framer-qO1UX.framer-72rtr7 > :first-child, .framer-qO1UX .framer-2oid04 > :first-child, .framer-qO1UX .framer-su22bd > :first-child, .framer-qO1UX .framer-1ik8i4i > :first-child, .framer-qO1UX .framer-1gmu7om > :first-child, .framer-qO1UX .framer-pbgesn > :first-child, .framer-qO1UX .framer-uvqrd9 > :first-child, .framer-qO1UX .framer-15vmt0k > :first-child, .framer-qO1UX .framer-1fllrdy > :first-child, .framer-qO1UX .framer-h6e4v4 > :first-child, .framer-qO1UX .framer-1g89ijn > :first-child, .framer-qO1UX .framer-1h5rsno > :first-child, .framer-qO1UX .framer-ycgccy > :first-child, .framer-qO1UX .framer-1o8tkgz > :first-child, .framer-qO1UX .framer-4avabb > :first-child, .framer-qO1UX .framer-bstmck > :first-child, .framer-qO1UX .framer-1fycwfh > :first-child, .framer-qO1UX .framer-14fyi8v > :first-child, .framer-qO1UX .framer-qg0h3f > :first-child, .framer-qO1UX .framer-1nn7z0v > :first-child, .framer-qO1UX .framer-1vtk60x > :first-child, .framer-qO1UX .framer-p8551w > :first-child, .framer-qO1UX .framer-g3ro50 > :first-child, .framer-qO1UX .framer-15cs0zp > :first-child, .framer-qO1UX .framer-lp3hr5 > :first-child, .framer-qO1UX .framer-1r3oll3 > :first-child, .framer-qO1UX .framer-j6gb99 > :first-child, .framer-qO1UX .framer-b5i1zv > :first-child, .framer-qO1UX .framer-3oh3yy > :first-child, .framer-qO1UX .framer-11411eu > :first-child, .framer-qO1UX .framer-101nclb > :first-child, .framer-qO1UX .framer-7ooj09 > :first-child, .framer-qO1UX .framer-x5gqdq > :first-child, .framer-qO1UX .framer-1en550q > :first-child, .framer-qO1UX .framer-1j5oyue > :first-child { margin-top: 0px; } .framer-qO1UX.framer-72rtr7 > :last-child, .framer-qO1UX .framer-2oid04 > :last-child, .framer-qO1UX .framer-su22bd > :last-child, .framer-qO1UX .framer-1ik8i4i > :last-child, .framer-qO1UX .framer-1gmu7om > :last-child, .framer-qO1UX .framer-pbgesn > :last-child, .framer-qO1UX .framer-uvqrd9 > :last-child, .framer-qO1UX .framer-15vmt0k > :last-child, .framer-qO1UX .framer-1fllrdy > :last-child, .framer-qO1UX .framer-h6e4v4 > :last-child, .framer-qO1UX .framer-1g89ijn > :last-child, .framer-qO1UX .framer-1h5rsno > :last-child, .framer-qO1UX .framer-ycgccy > :last-child, .framer-qO1UX .framer-1o8tkgz > :last-child, .framer-qO1UX .framer-4avabb > :last-child, .framer-qO1UX .framer-bstmck > :last-child, .framer-qO1UX .framer-1fycwfh > :last-child, .framer-qO1UX .framer-14fyi8v > :last-child, .framer-qO1UX .framer-qg0h3f > :last-child, .framer-qO1UX .framer-1nn7z0v > :last-child, .framer-qO1UX .framer-1vtk60x > :last-child, .framer-qO1UX .framer-p8551w > :last-child, .framer-qO1UX .framer-g3ro50 > :last-child, .framer-qO1UX .framer-15cs0zp > :last-child, .framer-qO1UX .framer-lp3hr5 > :last-child, .framer-qO1UX .framer-1r3oll3 > :last-child, .framer-qO1UX .framer-j6gb99 > :last-child, .framer-qO1UX .framer-b5i1zv > :last-child, .framer-qO1UX .framer-3oh3yy > :last-child, .framer-qO1UX .framer-11411eu > :last-child, .framer-qO1UX .framer-101nclb > :last-child, .framer-qO1UX .framer-7ooj09 > :last-child, .framer-qO1UX .framer-x5gqdq > :last-child, .framer-qO1UX .framer-1en550q > :last-child, .framer-qO1UX .framer-1j5oyue > :last-child { margin-bottom: 0px; } .framer-qO1UX .framer-xvlq3 > *, .framer-qO1UX .framer-pi7ax > *, .framer-qO1UX .framer-6b16oh > *, .framer-qO1UX .framer-t91ls2 > *, .framer-qO1UX .framer-1778g3n > *, .framer-qO1UX .framer-1djjt42 > *, .framer-qO1UX .framer-19ai335 > *, .framer-qO1UX .framer-1tp3ir > *, .framer-qO1UX .framer-a4hnew > *, .framer-qO1UX .framer-1p147u6 > *, .framer-qO1UX .framer-k7dh17 > *, .framer-qO1UX .framer-r98bkj > *, .framer-qO1UX .framer-eru19r > *, .framer-qO1UX .framer-1anpbt7 > *, .framer-qO1UX .framer-dvlf7d > *, .framer-qO1UX .framer-14lpll9 > *, .framer-qO1UX .framer-194fqnw > *, .framer-qO1UX .framer-1lmwi62 > *, .framer-qO1UX .framer-11wjs2p > *, .framer-qO1UX .framer-jl5t6f > *, .framer-qO1UX .framer-1l2tixu > *, .framer-qO1UX .framer-1rf1z8u > *, .framer-qO1UX .framer-z1w1qy > *, .framer-qO1UX .framer-vsn0zu > *, .framer-qO1UX .framer-1ey594a > *, .framer-qO1UX .framer-1i9dtug > *, .framer-qO1UX .framer-1agyzia > *, .framer-qO1UX .framer-13fed00 > *, .framer-qO1UX .framer-1dhzm6h > *, .framer-qO1UX .framer-1b8s87v > *, .framer-qO1UX .framer-x72eal > *, .framer-qO1UX .framer-djajqq > * { margin: 0px; margin-left: calc(10px / 2); margin-right: calc(10px / 2); } .framer-qO1UX .framer-xvlq3 > :first-child, .framer-qO1UX .framer-rfpe3x > :first-child, .framer-qO1UX .framer-pi7ax > :first-child, .framer-qO1UX .framer-6b16oh > :first-child, .framer-qO1UX .framer-t91ls2 > :first-child, .framer-qO1UX .framer-1778g3n > :first-child, .framer-qO1UX .framer-1djjt42 > :first-child, .framer-qO1UX .framer-19ai335 > :first-child, .framer-qO1UX .framer-1tp3ir > :first-child, .framer-qO1UX .framer-a4hnew > :first-child, .framer-qO1UX .framer-1p147u6 > :first-child, .framer-qO1UX .framer-k7dh17 > :first-child, .framer-qO1UX .framer-r98bkj > :first-child, .framer-qO1UX .framer-eru19r > :first-child, .framer-qO1UX .framer-1anpbt7 > :first-child, .framer-qO1UX .framer-dvlf7d > :first-child, .framer-qO1UX .framer-14lpll9 > :first-child, .framer-qO1UX .framer-194fqnw > :first-child, .framer-qO1UX .framer-1lmwi62 > :first-child, .framer-qO1UX .framer-11wjs2p > :first-child, .framer-qO1UX .framer-jl5t6f > :first-child, .framer-qO1UX .framer-1l2tixu > :first-child, .framer-qO1UX .framer-1rf1z8u > :first-child, .framer-qO1UX .framer-z1w1qy > :first-child, .framer-qO1UX .framer-1brktv > :first-child, .framer-qO1UX .framer-vsn0zu > :first-child, .framer-qO1UX .framer-9tpc26 > :first-child, .framer-qO1UX .framer-1ey594a > :first-child, .framer-qO1UX .framer-1b5k5bb > :first-child, .framer-qO1UX .framer-1i9dtug > :first-child, .framer-qO1UX .framer-1agyzia > :first-child, .framer-qO1UX .framer-6axhfk > :first-child, .framer-qO1UX .framer-13fed00 > :first-child, .framer-qO1UX .framer-1dhzm6h > :first-child, .framer-qO1UX .framer-1b8s87v > :first-child, .framer-qO1UX .framer-x72eal > :first-child, .framer-qO1UX .framer-djajqq > :first-child { margin-left: 0px; } .framer-qO1UX .framer-xvlq3 > :last-child, .framer-qO1UX .framer-rfpe3x > :last-child, .framer-qO1UX .framer-pi7ax > :last-child, .framer-qO1UX .framer-6b16oh > :last-child, .framer-qO1UX .framer-t91ls2 > :last-child, .framer-qO1UX .framer-1778g3n > :last-child, .framer-qO1UX .framer-1djjt42 > :last-child, .framer-qO1UX .framer-19ai335 > :last-child, .framer-qO1UX .framer-1tp3ir > :last-child, .framer-qO1UX .framer-a4hnew > :last-child, .framer-qO1UX .framer-1p147u6 > :last-child, .framer-qO1UX .framer-k7dh17 > :last-child, .framer-qO1UX .framer-r98bkj > :last-child, .framer-qO1UX .framer-eru19r > :last-child, .framer-qO1UX .framer-1anpbt7 > :last-child, .framer-qO1UX .framer-dvlf7d > :last-child, .framer-qO1UX .framer-14lpll9 > :last-child, .framer-qO1UX .framer-194fqnw > :last-child, .framer-qO1UX .framer-1lmwi62 > :last-child, .framer-qO1UX .framer-11wjs2p > :last-child, .framer-qO1UX .framer-jl5t6f > :last-child, .framer-qO1UX .framer-1l2tixu > :last-child, .framer-qO1UX .framer-1rf1z8u > :last-child, .framer-qO1UX .framer-z1w1qy > :last-child, .framer-qO1UX .framer-1brktv > :last-child, .framer-qO1UX .framer-vsn0zu > :last-child, .framer-qO1UX .framer-9tpc26 > :last-child, .framer-qO1UX .framer-1ey594a > :last-child, .framer-qO1UX .framer-1b5k5bb > :last-child, .framer-qO1UX .framer-1i9dtug > :last-child, .framer-qO1UX .framer-1agyzia > :last-child, .framer-qO1UX .framer-6axhfk > :last-child, .framer-qO1UX .framer-13fed00 > :last-child, .framer-qO1UX .framer-1dhzm6h > :last-child, .framer-qO1UX .framer-1b8s87v > :last-child, .framer-qO1UX .framer-x72eal > :last-child, .framer-qO1UX .framer-djajqq > :last-child { margin-right: 0px; } .framer-qO1UX .framer-rfpe3x > * { margin: 0px; margin-left: calc(20px / 2); margin-right: calc(20px / 2); } .framer-qO1UX .framer-1gmu7om > *, .framer-qO1UX .framer-uvqrd9 > *, .framer-qO1UX .framer-1fllrdy > *, .framer-qO1UX .framer-1g89ijn > *, .framer-qO1UX .framer-ycgccy > *, .framer-qO1UX .framer-4avabb > *, .framer-qO1UX .framer-1fycwfh > *, .framer-qO1UX .framer-qg0h3f > *, .framer-qO1UX .framer-1nn7z0v > *, .framer-qO1UX .framer-p8551w > *, .framer-qO1UX .framer-15cs0zp > *, .framer-qO1UX .framer-j6gb99 > *, .framer-qO1UX .framer-3oh3yy > *, .framer-qO1UX .framer-11411eu > *, .framer-qO1UX .framer-x5gqdq > * { margin: 0px; margin-bottom: calc(10px / 2); margin-top: calc(10px / 2); } .framer-qO1UX .framer-1brktv > *, .framer-qO1UX .framer-9tpc26 > *, .framer-qO1UX .framer-1b5k5bb > *, .framer-qO1UX .framer-6axhfk > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-qO1UX .framer-lp3hr5 > *, .framer-qO1UX .framer-1r3oll3 > *, .framer-qO1UX .framer-101nclb > *, .framer-qO1UX .framer-7ooj09 > * { margin: 0px; margin-bottom: calc(20px / 2); margin-top: calc(20px / 2); } .framer-qO1UX .framer-b5i1zv > *, .framer-qO1UX .framer-1en550q > * { margin: 0px; margin-bottom: calc(100px / 2); margin-top: calc(100px / 2); } }",
    `@media (min-width: 810px) and (max-width: 1199px) { .${hr.bodyClassName}-framer-qO1UX { background: white; } .framer-qO1UX.framer-72rtr7 { width: 810px; } .framer-qO1UX .framer-p8551w { order: 0; } .framer-qO1UX .framer-1bdw7m-container { height: var(--framer-aspect-ratio-supported, 242px); left: 50%; order: 3; top: 113px; width: 99%; } .framer-qO1UX .framer-g3ro50 { align-content: flex-start; align-items: flex-start; flex-direction: row; left: 51%; order: 0; position: absolute; top: 540px; transform: translateX(-50%); width: 793px; z-index: 1; } .framer-qO1UX .framer-1ey594a { align-content: flex-start; align-items: flex-start; min-height: unset; } .framer-qO1UX .framer-1eeo48e-container { bottom: unset; left: unset; order: 0; position: relative; transform: unset; } .framer-qO1UX .framer-15cs0zp { order: 1; } .framer-qO1UX .framer-1b5k5bb { order: 0; width: 100%; } .framer-qO1UX .framer-1i9dtug { padding: 0px; } .framer-qO1UX .framer-1agyzia, .framer-qO1UX .framer-13fed00 { flex: 0.7 0 0px; } .framer-qO1UX .framer-j6gb99, .framer-qO1UX .framer-3oh3yy { order: 2; } .framer-qO1UX .framer-1k0ssbx-container { left: -120px; right: 0px; transform: translateY(-50%); width: unset; } .framer-qO1UX .framer-6axhfk { width: 100%; } .framer-qO1UX .framer-1dhzm6h { padding: 0px 0px 8px 0px; } .framer-qO1UX .framer-qjopz5-container { left: -30px; right: -120px; top: 0px; transform: unset; width: unset; } .framer-qO1UX .framer-1j5oyue { order: 3; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-qO1UX .framer-g3ro50 { gap: 0px; } .framer-qO1UX .framer-g3ro50 > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .framer-qO1UX .framer-g3ro50 > :first-child { margin-left: 0px; } .framer-qO1UX .framer-g3ro50 > :last-child { margin-right: 0px; } }}`,
    `@media (max-width: 809px) { .${hr.bodyClassName}-framer-qO1UX { background: white; } .framer-qO1UX.framer-72rtr7 { width: 390px; } .framer-qO1UX .framer-13yn9ib { align-content: flex-end; align-items: flex-end; background-color: var(--token-b73f7c2a-3920-4d15-bb22-d8016da87d50, #f5f9fc); flex-direction: column; order: 0; z-index: 3; } .framer-qO1UX .framer-2oid04 { order: 1; } .framer-qO1UX .framer-su22bd { order: 11; } .framer-qO1UX .framer-1ik8i4i { order: 3; } .framer-qO1UX .framer-pbgesn { order: 5; } .framer-qO1UX .framer-15vmt0k { order: 6; } .framer-qO1UX .framer-h6e4v4 { order: 7; } .framer-qO1UX .framer-1h5rsno { order: 8; } .framer-qO1UX .framer-1o8tkgz { order: 9; } .framer-qO1UX .framer-bstmck { order: 10; } .framer-qO1UX .framer-14fyi8v { order: 4; } .framer-qO1UX .framer-vsn0zu { order: 0; } .framer-qO1UX .framer-u2hhht-container { height: var(--framer-aspect-ratio-supported, 115px); } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .framer-qO1UX .framer-13yn9ib { gap: 0px; } .framer-qO1UX .framer-13yn9ib > *, .framer-qO1UX .framer-13yn9ib > :first-child, .framer-qO1UX .framer-13yn9ib > :last-child { margin: 0px; } }}`,
    ...linkPresetStyles,
    '.framer-qO1UX[data-border="true"]::after, .framer-qO1UX [data-border="true"]::after { content: ""; border-width: var(--border-top-width, 0) var(--border-right-width, 0) var(--border-bottom-width, 0) var(--border-left-width, 0); border-color: var(--border-color, none); border-style: var(--border-style, none); width: 100%; height: 100%; position: absolute; box-sizing: border-box; left: 0; top: 0; border-radius: inherit; pointer-events: none; }',
  ],
  Home = withCSS(_Home, Home_css, "framer-qO1UX");
Home.displayName = "Home";
Home.defaultProps = { height: 860, width: 1200 };
loadFonts(
  Home,
  [
    {
      explicitInter: true,
      fonts: [
        {
          family: "Montserrat",
          source: "google",
          style: "normal",
          url: "./assets/fonts/montserrat-v26-latin-bold.woff2",
          weight: "500",
        },
        {
          family: "Inter",
          source: "google",
          style: "normal",
          url: "./assets/fonts/inter-v18-latin-medium.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0460-052F, U+1C80-1C88, U+20B4, U+2DE0-2DFF, U+A640-A69F, U+FE2E-FE2F",
          url: "./assets/dppbyi0sl4fylgakx8kxopvt7c.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116",
          url: "./assets/4raeqdeorcndkhhiicbjow92lk.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+1F00-1FFF",
          url: "./assets/1k3w8dizy3v4emk8mb08yhxtbs.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange: "U+0370-03FF",
          url: "./assets/tusctfyvm1i1ichuycwz9gddq.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0100-024F, U+0259, U+1E00-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF",
          url: "./assets/vgyfwiwsac5oyxaycrxxvhze58.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
          url: "./assets/dxd0q7lsl7hevdzucnylngbhm.woff2",
          weight: "700",
        },
        {
          family: "Inter",
          source: "framer",
          style: "normal",
          unicodeRange:
            "U+0102-0103, U+0110-0111, U+0128-0129, U+0168-0169, U+01A0-01A1, U+01AF-01B0, U+1EA0-1EF9, U+20AB",
          url: "./assets/giryzetix4ifypco5pyzonkhjio.woff2",
          weight: "700",
        },
      ],
    },
    ...li,
    ...mi,
    ...di,
    ...ci,
    ...hi,
    ...ui,
    ...gi,
    ...xi,
    ...yi,
    ...normalizeFontConfig(fontConfig),
  ],
  { supportsExplicitInterCodegen: true },
);
var qs = {
  exports: {
    default: {
      type: "reactComponent",
      name: "FrameraugiA20Il",
      slots: [],
      annotations: {
        framerComponentViewportWidth: "true",
        framerResponsiveScreen: "",
        framerIntrinsicWidth: "1200",
        framerIntrinsicHeight: "860",
        framerDisplayContentsDiv: "false",
        framerContractVersion: "1",
        framerImmutableVariables: "true",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"ueHalD28r":{"layout":["fixed","auto"]},"CXFUsfZRE":{"layout":["fixed","auto"]}}}',
      },
    },
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    __FramerMetadata__: { type: "variable" },
  },
};
export { qs as __FramerMetadata__, Home as default };
