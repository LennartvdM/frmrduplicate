/**
 * IntroSlide — Complete intro/hero section for the home page.
 *
 * Reproduces the original Framer "Hero Section" (page--home.mjs:4886–4963 mobile,
 * 4972–5047 desktop) using standalone components. Zero Framer runtime dependencies.
 *
 * Layout (desktop):
 *   ┌──────────────────────────────────────────────┐
 *   │  [navbar slot]                                │
 *   │                                               │
 *   │        ◐◑  N e o f l i x                     │  ← NeoflixLogo (centered)
 *   │                                               │
 *   │  Record, Reflect, Refine:                     │  ← RecordReflectRefine
 *   │  Improve patient care through                 │
 *   │  video reflection.                            │
 *   │                                               │
 *   │  [Improve patient care...]                    │  ← subtitle (mobile only, below)
 *   └──────────────────────────────────────────────┘
 *
 * The navbar is a **render prop / slot** — pass your own component via `navbar`.
 * If omitted, the slot renders nothing (no default nav).
 *
 * Design tokens:
 *   - Background: white (rgb(255, 255, 255))
 *   - Subtitle grey: rgb(152, 151, 161) — --token-1af50db2
 *   - Logo entrance: spring delay 0.9s (damping:30, mass:1, stiffness:400)
 *   - Headline entrance: spring delay 1.0s (same spring)
 */
import { useMemo, useEffect, useRef } from "react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Debug logging
// ---------------------------------------------------------------------------
const DEBUG = true;
const log = (...args) => DEBUG && console.log("[IntroSlide]", ...args);
import NeoflixLogo from "./NeoflixLogo.mjs";
import RecordReflectRefine from "./RecordReflectRefine.mjs";

// Entrance animation springs (from page--home.mjs:3949, 3973)
const ENTRANCE_LOGO = {
  type: "spring",
  damping: 30,
  mass: 1,
  stiffness: 400,
  delay: 0.9,
};

const ENTRANCE_HEADLINE = {
  type: "spring",
  damping: 30,
  mass: 1,
  stiffness: 400,
  delay: 1.0,
};

// Breakpoints matching the original (from CLAUDE.md)
const DESKTOP_MIN = 1200;
const TABLET_MIN = 810;

/**
 * @param {Object} props
 * @param {React.ReactNode} [props.navbar] - Your navbar component (slot). Renders above the hero content.
 * @param {string} [props.variant="desktop"] - "desktop" | "tablet" | "mobile"
 * @param {string} [props.backgroundColor="rgb(255, 255, 255)"]
 * @param {Object} [props.logoProps] - Override props passed to NeoflixLogo
 * @param {Object} [props.headlineProps] - Override props passed to RecordReflectRefine
 * @param {string} [props.subtitle] - Override the subtitle text below the cycling headline
 * @param {string} [props.subtitleColor="rgb(152, 151, 161)"] - Subtitle text color
 * @param {boolean} [props.fullHeight=true] - Whether to use 100vh height (scroll-snap)
 * @param {string} [props.className]
 * @param {Object} [props.style]
 */
export default function IntroSlide({
  navbar = null,
  variant = "desktop",
  backgroundColor = "rgb(255, 255, 255)",
  logoProps = {},
  headlineProps = {},
  subtitle = "Improve patient care through video reflection.",
  subtitleColor = "rgb(152, 151, 161)",
  fullHeight = true,
  className = "",
  style = {},
}) {
  const isMobile = variant === "mobile";
  const isDesktop = variant === "desktop";
  const renderCount = useRef(0);
  renderCount.current++;

  log(`render #${renderCount.current}`, {
    variant,
    isMobile,
    isDesktop,
    fullHeight,
    backgroundColor,
    hasNavbar: !!navbar,
  });

  useEffect(() => {
    log("MOUNTED — checking framer-motion availability...");
    try {
      // Verify motion is actually the framer-motion export
      log("motion object keys:", Object.keys(motion).slice(0, 10));
      log("motion.div exists:", !!motion.div);
    } catch (e) {
      log("ERROR checking motion:", e.message);
    }
    return () => log("UNMOUNTED");
  }, []);

  // Logo dimensions scale with viewport
  const logoDimensions = useMemo(() => {
    const dims = isMobile
      ? { width: "99.5vw", height: 242 }
      : isDesktop
        ? { width: "60vw", height: 221 }
        : { width: "99.5vw", height: 242 }; // tablet
    log("logoDimensions:", dims);
    return dims;
  }, [isMobile, isDesktop]);

  return (
    <section
      className={`intro-slide ${className}`}
      style={{
        position: "relative",
        width: "100%",
        height: fullHeight ? "100vh" : "auto",
        minHeight: fullHeight ? "100vh" : undefined,
        backgroundColor,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        scrollSnapAlign: "start",
        scrollSnapStop: "always",
        ...style,
      }}
    >
      {/* Navbar slot */}
      {navbar}

      {/* Hero content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          padding: isMobile ? "0 16px" : "0 40px",
        }}
      >
        {/* Logo — centered, with entrance animation */}
        <motion.div
          style={{
            width: logoDimensions.width,
            maxWidth: 935,
            position: "relative",
            display: "flex",
            justifyContent: "center",
            marginBottom: isMobile ? 40 : 60,
          }}
          initial={{ opacity: 0.001, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={ENTRANCE_LOGO}
          whileHover={{ scale: 1.01, y: -4 }}
          onAnimationStart={() => log("logo wrapper entrance START", ENTRANCE_LOGO)}
          onAnimationComplete={() => log("logo wrapper entrance COMPLETE")}
        >
          <NeoflixLogo
            autoPlayDelay={1000}
            style={{ width: "100%", height: "auto" }}
            {...logoProps}
          />
        </motion.div>

        {/* Headline + subtitle area */}
        <motion.div
          style={{
            width: "100%",
            maxWidth: isMobile ? undefined : 685,
            display: "flex",
            flexDirection: "column",
            alignItems: isMobile ? "center" : "flex-start",
            ...(isDesktop
              ? { transform: "translateX(-50%)", position: "relative", left: "50%" }
              : {}),
          }}
          initial={{ opacity: 0.001, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={ENTRANCE_HEADLINE}
          onAnimationStart={() => log("headline wrapper entrance START", ENTRANCE_HEADLINE)}
          onAnimationComplete={() => log("headline wrapper entrance COMPLETE")}
        >
          <RecordReflectRefine
            variant={isMobile ? "mobile" : "desktop"}
            showSubtitle={!isMobile}
            {...headlineProps}
          />

          {/* Mobile-only subtitle (separate from the cycling headline) */}
          {isMobile && (
            <p
              style={{
                fontFamily: '"Inter", "Inter Placeholder", sans-serif',
                fontSize: "27px",
                fontWeight: 700,
                color: subtitleColor,
                textAlign: "center",
                margin: "24px 0 0 0",
                lineHeight: 1.3,
              }}
            >
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}

IntroSlide.displayName = "IntroSlide";

/**
 * CSS custom properties for design token compatibility.
 * Apply these to a parent element if you want token-based theming:
 *
 *   --neoflix-teal: rgb(82, 156, 156);
 *   --neoflix-dark: rgb(56, 52, 55);
 *   --neoflix-grey: rgb(131, 130, 143);
 *   --neoflix-bar-green: rgb(114, 194, 194);
 *   --neoflix-bg: rgb(245, 249, 252);
 */
