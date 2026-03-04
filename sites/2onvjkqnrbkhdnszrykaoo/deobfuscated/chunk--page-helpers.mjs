/**
 * Shared helper utilities for page components.
 * Extracted from repeated patterns found in page--home, page--neoflix, page--Publications.
 *
 * These patterns were originally emitted once per component by Framer's code generator.
 * Centralizing them here saves ~200+ lines per page file.
 */
import {
  useContext,
  useMemo,
  jsx,
  MotionContext,
  motion,
  ReactFragment,
} from "./chunk--react-and-framer-runtime.mjs";

/**
 * Merge variant-specific props from a map.
 * Originally duplicated 12x in page--home, once per component.
 *
 * Usage: mergeVariantProps({ variantId: { prop: value } }, baseVariant, gestureVariant)
 */
export function mergeVariantProps(map, ...variants) {
  let result = {};
  variants?.forEach((v) => v && Object.assign(result, map[v]));
  return result;
}

/**
 * MotionContext transition provider.
 * Originally duplicated 10+ times per page file as a local component.
 *
 * Usage: <TransitionProvider value={transitionConfig}>{children}</TransitionProvider>
 */
export const TransitionProvider = ({ value, children }) => {
  let parent = useContext(MotionContext),
    transition = value ?? parent.transition,
    merged = useMemo(
      () => ({ ...parent, transition }),
      [JSON.stringify(transition)],
    );
  return jsx(MotionContext.Provider, { value: merged, children });
};

/**
 * Animated fragment — motion() applied to React.Fragment.
 * Originally created once per component (10+ times per page).
 */
export const AnimatedFragment = motion(ReactFragment);

/**
 * Normalize variant prop: resolve human-readable names to internal IDs.
 * Originally duplicated 14x in page--home.
 *
 * Usage: resolveVariant(VARIANT_MAP, props, "defaultVariantId")
 */
export function resolveVariant(variantMap, { height, id, width, ...rest }, defaultId) {
  let resolved = variantMap[rest.variant] ?? rest.variant ?? defaultId;
  return { ...rest, variant: resolved };
}

/**
 * Compute layout dependency key from variant list.
 * Originally duplicated 6+ times per page.
 */
export function makeLayoutKey(props, variants) {
  return props.layoutDependency
    ? variants.join("-") + props.layoutDependency
    : variants.join("-");
}

/**
 * CSS aspect-ratio support check — included in every component's CSS array.
 */
export const CSS_ASPECT_RATIO_SUPPORT =
  "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }";

/**
 * Base video player props shared by all video instances.
 * Only srcFile, id, layoutId, and name differ between instances.
 */
export const BASE_VIDEO_PROPS = {
  backgroundColor: "rgba(0, 0, 0, 0)",
  controls: false,
  isMixedBorderRadius: false,
  loop: true,
  muted: true,
  playing: true,
  posterEnabled: false,
  srcType: "Upload",
  srcUrl: "./assets/mixkit-clouds-sky.mp4",
  startTime: 0,
  style: { height: "100%", width: "100%" },
  volume: 25,
  height: "100%",
  width: "100%",
};

/** Base video props with no border radius (used in Backdrop layers) */
export const VIDEO_PROPS_FLAT = {
  ...BASE_VIDEO_PROPS,
  borderRadius: 0,
  bottomLeftRadius: 0,
  bottomRightRadius: 0,
  topLeftRadius: 0,
  topRightRadius: 0,
};

/** Base video props with 15px border radius (used in content sections) */
export const VIDEO_PROPS_ROUNDED = {
  ...BASE_VIDEO_PROPS,
  borderRadius: 15,
  bottomLeftRadius: 15,
  bottomRightRadius: 15,
  topLeftRadius: 15,
  topRightRadius: 15,
};

/**
 * Inter 500 font config — loaded identically by 6 components in page--home.
 */
export const INTER_500_FONT = [
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
];

/**
 * Standard spring configs used across all pages.
 */
export const SPRING_STANDARD = {
  damping: 30,
  delay: 0,
  mass: 1,
  stiffness: 400,
  type: "spring",
};

export const SPRING_HEAVY = {
  damping: 24,
  delay: 0,
  mass: 9,
  stiffness: 500,
  type: "spring",
};

export const SPRING_CAPTION = {
  damping: 60,
  delay: 0,
  mass: 1,
  stiffness: 500,
  type: "spring",
};

/**
 * Trailing break paragraph — used as spacer between text blocks.
 * Appears 17x in neoflix, similar counts in other pages.
 */
export const TRAILING_BREAK_PARAGRAPH = {
  className: "framer-styles-preset-21ogod",
  "data-styles-preset": "xZndidUCt",
  style: { "--framer-text-alignment": "left" },
};
