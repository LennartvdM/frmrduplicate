/**
 * Toolbox page factory — shared template for all toolbox pages.
 *
 * Every toolbox page is structurally identical: a 60px header with a
 * scroll-triggered opacity animation, a 990px iframe embedding a GitBook
 * docs page, and a fixed 60px nav bar.  Only the iframe URL differs.
 *
 * Usage (in a thin page wrapper):
 *
 *   import { createToolboxPage } from "./toolbox-page-factory.mjs";
 *   const { page, metadata } = createToolboxPage("/Toolbox_Pioneer_Team", "Pioneer Team");
 *   export default page;
 *   export { metadata as __FramerMetadata__ };
 */

import { getDocsUrl } from "./docs-links.mjs";
import { a as EmbedComponent, b as NavComponent } from "./chunk--embed-component.mjs";
import "./chunk--framer-components.mjs";
import {
  useLocale,
  cx,
  withFXWrapper,
  DeviceSizeContainer,
  cssSSRMinifiedHelper,
  withCSS,
  registerCursors,
  CursorContext,
  PropertyOverridesProvider,
  forwardRef,
  useId,
  useInsertionEffect,
  useVariantState,
  useRef,
  jsx,
  jsxs,
  motion,
  LayoutGroup,
  loadFonts,
  getFonts,
} from "./chunk--react-and-framer-runtime.mjs";
import { a as getSiteMetadata } from "./chunk--site-metadata.mjs";
import "./chunk--browser-polyfills.mjs";

// ═══════════════════════════════════════════════════════════════
// Shared constants
// ═══════════════════════════════════════════════════════════════

var MotionDiv = withFXWrapper(motion.div);
var MotionSSR = withFXWrapper(cssSSRMinifiedHelper);
var embedFonts = getFonts(EmbedComponent);
var navFonts = getFonts(NavComponent);

// Shared CSS namespace for all toolbox pages
var CSS_NS = "framer-toolbox";

// Responsive variant IDs
var VARIANT_DESKTOP = "desktop";
var VARIANT_TABLET = "tablet";
var VARIANT_PHONE = "phone";

var BREAKPOINTS = {
  [VARIANT_DESKTOP]: "(min-width: 1200px)",
  [VARIANT_TABLET]: "(min-width: 810px) and (max-width: 1199px)",
  [VARIANT_PHONE]: "(max-width: 809px)",
};

var VARIANT_CLASS_NAMES = {
  [VARIANT_DESKTOP]: "framer-v-desktop",
  [VARIANT_TABLET]: "framer-v-tablet",
  [VARIANT_PHONE]: "framer-v-phone",
};

var DEVICE_MAP = {
  Desktop: VARIANT_DESKTOP,
  Phone: VARIANT_PHONE,
  Tablet: VARIANT_TABLET,
};

// Shared scroll animation targets (header fades from 0.5→1 opacity, translates -60px on scroll)
var SCROLL_TARGETS_FADE = [
  {
    target: { opacity: 0.5, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: 0 },
  },
  {
    target: { opacity: 1, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: -60 },
  },
];

var SCROLL_TARGETS_SLIDE = [
  {
    target: { opacity: 1, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: 0 },
  },
  {
    target: { opacity: 1, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, skewX: 0, skewY: 0, x: 0, y: -60 },
  },
];

// Phone breakpoint override (same slide, no opacity change)
var PHONE_OVERRIDES = {
  [VARIANT_PHONE]: {
    __framer__transformTargets: SCROLL_TARGETS_SLIDE,
  },
};

// ═══════════════════════════════════════════════════════════════
// CSS (shared across all toolbox pages)
// ═══════════════════════════════════════════════════════════════

function buildCSS(bodyClassName) {
  return [
    "@supports (aspect-ratio: 1) { body { --framer-aspect-ratio-supported: auto; } }",
    `.${bodyClassName}-${CSS_NS} { background: white; }`,
    `.${CSS_NS}.framer-base, .${CSS_NS} .framer-base { display: block; }`,
    `.${CSS_NS}.framer-page { align-content: center; align-items: center; background-color: #ffffff; display: flex; flex-direction: column; flex-wrap: nowrap; gap: 0px; height: min-content; justify-content: flex-start; overflow: hidden; padding: 0px; position: relative; width: 1200px; }`,
    `.${CSS_NS} .framer-header { align-content: center; align-items: center; display: flex; flex: none; flex-direction: row; flex-wrap: nowrap; gap: 0px; height: 60px; justify-content: center; overflow: hidden; padding: 0px; position: relative; width: 100%; }`,
    `.${CSS_NS} .framer-content-container { flex: none; height: 990px; position: relative; width: 100%; z-index: 1; }`,
    `.${CSS_NS} .framer-nav-container { flex: none; height: 60px; left: 0px; position: fixed; right: 0px; top: 0px; z-index: 2; }`,
    `@supports (background: -webkit-named-image(i)) and (not (scale:1)) { .${CSS_NS}.framer-page, .${CSS_NS} .framer-header { gap: 0px; } .${CSS_NS}.framer-page > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .${CSS_NS}.framer-page > :first-child { margin-top: 0px; } .${CSS_NS}.framer-page > :last-child { margin-bottom: 0px; } .${CSS_NS} .framer-header > * { margin: 0px; margin-left: calc(0px / 2); margin-right: calc(0px / 2); } .${CSS_NS} .framer-header > :first-child { margin-left: 0px; } .${CSS_NS} .framer-header > :last-child { margin-right: 0px; } }`,
    `@media (min-width: 1200px) { .${CSS_NS} .hidden-desktop { display: none !important; } }`,
    `@media (min-width: 810px) and (max-width: 1199px) { .${CSS_NS} .hidden-tablet { display: none !important; } .${bodyClassName}-${CSS_NS} { background: white; } .${CSS_NS}.framer-page { width: 810px; }}`,
    `@media (max-width: 809px) { .${CSS_NS} .hidden-phone { display: none !important; } .${bodyClassName}-${CSS_NS} { background: white; } .${CSS_NS}.framer-page { width: 390px; } .${CSS_NS} .framer-header { flex-direction: column; } @supports (background: -webkit-named-image(i)) and (not (scale:1)) { .${CSS_NS} .framer-header { gap: 0px; } .${CSS_NS} .framer-header > * { margin: 0px; margin-bottom: calc(0px / 2); margin-top: calc(0px / 2); } .${CSS_NS} .framer-header > :first-child { margin-top: 0px; } .${CSS_NS} .framer-header > :last-child { margin-bottom: 0px; } }}`,
  ];
}

// ═══════════════════════════════════════════════════════════════
// Metadata factory
// ═══════════════════════════════════════════════════════════════

var METADATA_EXPORTS = {
  exports: {
    metadataVersion: {
      type: "variable",
      annotations: { framerContractVersion: "1" },
    },
    default: {
      type: "function",
      annotations: { framerContractVersion: "1" },
    },
    __FramerMetadata__: { type: "variable" },
  },
};

export function createToolboxMetadata(routePath, titleFallback) {
  var bodyClassName = "framer-body-toolbox";

  function getMetadata(locale, activeLocale) {
    var site = getSiteMetadata(locale, activeLocale);
    return {
      bodyClassName: bodyClassName,
      breakpoints: [
        { hash: "desktop", mediaQuery: "(min-width: 1200px)" },
        { hash: "tablet", mediaQuery: "(min-width: 810px) and (max-width: 1199px)" },
        { hash: "phone", mediaQuery: "(max-width: 809px)" },
      ],
      description: site.description,
      elements: {},
      robots: "max-image-preview:large",
      title: site.title || titleFallback,
      viewport: "width=device-width",
    };
  }

  return {
    getMetadata: getMetadata,
    version: 1,
    __FramerMetadata__: METADATA_EXPORTS,
  };
}

// ═══════════════════════════════════════════════════════════════
// Page component factory
// ═══════════════════════════════════════════════════════════════

var PAGE_METADATA_EXPORTS = {
  exports: {
    Props: { type: "tsType", annotations: { framerContractVersion: "1" } },
    default: {
      type: "reactComponent",
      name: "ToolboxPage",
      slots: [],
      annotations: {
        framerIntrinsicHeight: "1050",
        framerImmutableVariables: "true",
        framerComponentViewportWidth: "true",
        framerDisplayContentsDiv: "false",
        framerContractVersion: "1",
        framerIntrinsicWidth: "1200",
        framerCanvasComponentVariantDetails:
          '{"propertyName":"variant","data":{"default":{"layout":["fixed","auto"]},"tablet":{"layout":["fixed","auto"]},"phone":{"layout":["fixed","auto"]}}}',
        framerResponsiveScreen: "",
      },
    },
    __FramerMetadata__: { type: "variable" },
  },
};

export function createToolboxPage(routePath, displayName) {
  var docsUrl = getDocsUrl(routePath);
  var bodyClassName = "framer-body-toolbox";

  // Create inline metadata for this page
  function getMetadata(locale, activeLocale) {
    var site = getSiteMetadata(locale, activeLocale);
    return {
      bodyClassName: bodyClassName,
      breakpoints: [
        { hash: "desktop", mediaQuery: "(min-width: 1200px)" },
        { hash: "tablet", mediaQuery: "(min-width: 810px) and (max-width: 1199px)" },
        { hash: "phone", mediaQuery: "(max-width: 809px)" },
      ],
      description: site.description,
      elements: {},
      robots: "max-image-preview:large",
      title: site.title || displayName,
      viewport: "width=device-width",
    };
  }

  // Resolve variant from props
  var resolveProps = ({ height, id, width, ...rest }) => {
    var mapped = DEVICE_MAP[rest.variant];
    return {
      ...rest,
      variant: mapped !== undefined ? mapped : rest.variant !== undefined ? rest.variant : VARIANT_DESKTOP,
    };
  };

  // The page component
  var ToolboxPageComponent = forwardRef(function ToolboxPage(props, ref) {
    var { activeLocale } = useLocale();
    var { style, className, layoutId, variant: variantProp, ...restProps } = resolveProps(props);

    // Set document metadata
    useInsertionEffect(() => {
      var meta = getMetadata(undefined, activeLocale);
      document.title = meta.title || "";

      if (meta.viewport) {
        var vp = document.querySelector('meta[name="viewport"]');
        if (vp) vp.setAttribute("content", meta.viewport);
      }

      if (meta.robots) {
        var robot = document.querySelector('meta[name="robots"]');
        if (robot) {
          robot.setAttribute("content", meta.robots);
        } else {
          robot = document.createElement("meta");
          robot.setAttribute("name", "robots");
          robot.setAttribute("content", meta.robots);
          document.head.appendChild(robot);
        }
      }

      if (meta.bodyClassName) {
        Array.from(document.body.classList)
          .filter((c) => c.startsWith("framer-body-"))
          .forEach((c) => document.body.classList.remove(c));
        document.body.classList.add(`${meta.bodyClassName}-${CSS_NS}`);
        return () => {
          document.body.classList.remove(`${meta.bodyClassName}-${CSS_NS}`);
        };
      }
    }, [undefined, activeLocale]);

    var [breakpoint] = useVariantState(variantProp, BREAKPOINTS, false);
    var localRef = useRef(null);
    var layoutGroupId = useId();
    var extraClasses = [];

    registerCursors({});

    return jsx(CursorContext.Provider, {
      value: { primaryVariantId: VARIANT_DESKTOP, variantClassNames: VARIANT_CLASS_NAMES },
      children: jsxs(LayoutGroup, {
        id: layoutId ?? layoutGroupId,
        children: [
          jsxs(motion.div, {
            ...restProps,
            className: cx(CSS_NS, ...extraClasses, "framer-page", className),
            ref: ref ?? localRef,
            style: { ...style },
            children: [
              // Header — scroll-triggered opacity fade
              jsx(PropertyOverridesProvider, {
                breakpoint: breakpoint,
                overrides: PHONE_OVERRIDES,
                children: jsx(MotionDiv, {
                  __framer__styleTransformEffectEnabled: true,
                  __framer__transformTargets: SCROLL_TARGETS_FADE,
                  __framer__transformTrigger: "onScroll",
                  __perspectiveFX: false,
                  __targetOpacity: 1,
                  className: "framer-header",
                }),
              }),

              // Content — docs iframe
              jsx(DeviceSizeContainer, {
                children: jsx(cssSSRMinifiedHelper, {
                  className: "framer-content-container",
                  children: jsx(EmbedComponent, {
                    height: "100%",
                    html: "",
                    id: "toolbox-embed",
                    layoutId: "toolbox-embed",
                    style: { height: "100%", width: "100%" },
                    type: "url",
                    url: docsUrl,
                    width: "100%",
                  }),
                }),
              }),

              // Nav bar — fixed top
              jsx(DeviceSizeContainer, {
                width: "100vw",
                children: jsx(MotionSSR, {
                  __framer__styleTransformEffectEnabled: true,
                  __framer__transformTargets: SCROLL_TARGETS_SLIDE,
                  __framer__transformTrigger: "onScroll",
                  __perspectiveFX: false,
                  __targetOpacity: 1,
                  className: "framer-nav-container",
                  layoutScroll: true,
                  children: jsx(NavComponent, {
                    height: "100%",
                    id: "toolbox-nav",
                    layoutId: "toolbox-nav",
                    style: { height: "100%", width: "100%" },
                    width: "100%",
                  }),
                }),
              }),
            ],
          }),
          jsx("div", { className: cx(CSS_NS, ...extraClasses), id: "overlay" }),
        ],
      }),
    });
  });

  // Build CSS with the shared body class name
  var meta = getMetadata();
  var css = buildCSS(meta.bodyClassName);
  var wrapped = withCSS(ToolboxPageComponent, css, CSS_NS);

  wrapped.displayName = displayName;
  wrapped.defaultProps = { height: 1050, width: 1200 };
  loadFonts(wrapped, [{ explicitInter: true, fonts: [] }, ...embedFonts, ...navFonts], {
    supportsExplicitInterCodegen: true,
  });

  return {
    page: wrapped,
    metadata: PAGE_METADATA_EXPORTS,
  };
}
