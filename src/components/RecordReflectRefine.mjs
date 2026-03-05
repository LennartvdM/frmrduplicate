/**
 * RecordReflectRefine — Cycling headline component.
 *
 * Reproduces the original Framer "Record Reflect Refine" component
 * (page--home.mjs:625–979) using only React + framer-motion.
 *
 * Behavior:
 *   - Cycles through 3 states every 1800ms
 *   - Each state highlights one word ("Record," / "Reflect," / "Refine:") in teal
 *   - The other words are dark (rgb(56, 52, 55))
 *   - Subtitle text below in grey: "Improve patient care through video reflection."
 *   - Clicking advances to next state immediately
 *
 * Two variants:
 *   - "desktop" (default): 62px bold headline + 47px subtitle, width: 717px
 *   - "mobile": 62px bold headline only, narrower, no subtitle
 *
 * Original color tokens:
 *   - Teal highlight: rgb(82, 156, 156) — --token-4eefdbfc
 *   - Dark text: rgb(56, 52, 55) — --token-46c9bfd9
 *   - Grey subtitle: rgb(131, 130, 143) — --token-1af50db2
 */
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Debug logging
// ---------------------------------------------------------------------------
const DEBUG = true;
const log = (...args) => DEBUG && console.log("[RecordReflectRefine]", ...args);

const CYCLE_DELAY_MS = 1800;

// Color tokens
const TEAL = "rgb(82, 156, 156)";
const DARK = "rgb(56, 52, 55)";
const GREY = "rgb(131, 130, 143)";

// The 3 words and their cycle index
const WORDS = [
  { text: "Record,", id: 0 },
  { text: " Reflect,", id: 1 },
  { text: " Refine:", id: 2 },
];

/**
 * @param {Object} props
 * @param {number} [props.cycleDelay=1800] - ms between word highlights
 * @param {string} [props.tealColor] - Override teal highlight color
 * @param {string} [props.darkColor] - Override dark text color
 * @param {string} [props.greyColor] - Override grey subtitle color
 * @param {boolean} [props.showSubtitle=true] - Show the subtitle line
 * @param {string} [props.subtitle] - Override subtitle text
 * @param {string} [props.variant="desktop"] - "desktop" or "mobile"
 * @param {boolean} [props.autoPlay=true] - Whether to auto-cycle
 * @param {Function} [props.onVariantChange] - Callback when active word changes
 * @param {string} [props.className]
 * @param {Object} [props.style]
 */
export default function RecordReflectRefine({
  cycleDelay = CYCLE_DELAY_MS,
  tealColor = TEAL,
  darkColor = DARK,
  greyColor = GREY,
  showSubtitle = true,
  subtitle = "Improve patient care through video reflection.",
  variant = "desktop",
  autoPlay = true,
  onVariantChange,
  className = "",
  style = {},
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const renderCount = useRef(0);
  const cycleCount = useRef(0);
  renderCount.current++;

  log(`render #${renderCount.current}`, {
    activeIndex,
    activeWord: WORDS[activeIndex]?.text,
    autoPlay,
    cycleDelay,
    variant,
    showSubtitle,
  });

  // Auto-cycle through the 3 words
  useEffect(() => {
    if (!autoPlay) {
      log("autoPlay is OFF — no cycling");
      return;
    }
    log(`starting auto-cycle interval (${cycleDelay}ms)`);
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = (prev + 1) % 3;
        cycleCount.current++;
        log(`cycle #${cycleCount.current}: "${WORDS[prev].text}" → "${WORDS[next].text}"`);
        onVariantChange?.(next);
        return next;
      });
    }, cycleDelay);
    return () => {
      log("cleanup: clearing cycle interval");
      clearInterval(timer);
    };
  }, [cycleDelay, autoPlay, onVariantChange]);

  // Click advances to next word
  const handleClick = useCallback(() => {
    setActiveIndex((prev) => {
      const next = (prev + 1) % 3;
      log(`click: "${WORDS[prev].text}" → "${WORDS[next].text}"`);
      onVariantChange?.(next);
      return next;
    });
  }, [onVariantChange]);

  const isMobile = variant === "mobile";
  const fontSize = "62px";
  const subtitleSize = "47px";

  return (
    <div
      className={`record-reflect-refine ${className}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isMobile ? "center" : "flex-start",
        justifyContent: "center",
        gap: 20,
        maxWidth: 2018,
        width: isMobile ? "auto" : 717,
        cursor: "pointer",
        userSelect: "none",
        WebkitUserSelect: "none",
        ...style,
      }}
      onClick={handleClick}
    >
      <h1
        style={{
          fontFamily: '"Inter", "Inter Placeholder", sans-serif',
          fontSize,
          fontWeight: 700,
          letterSpacing: "-2px",
          textAlign: "left",
          lineHeight: 1.2,
          margin: 0,
          whiteSpace: isMobile ? "pre" : "pre-wrap",
          wordBreak: isMobile ? undefined : "break-word",
          wordWrap: isMobile ? undefined : "break-word",
        }}
      >
        {WORDS.map((word) => (
          <span
            key={word.id}
            style={{
              color: activeIndex === word.id ? tealColor : darkColor,
              fontWeight: 700,
              transition: "color 0s", // instant swap, matching TWEEN_INSTANT
            }}
          >
            {word.text}
          </span>
        ))}
      </h1>

      {showSubtitle && !isMobile && (
        <p
          style={{
            fontFamily: '"Inter", "Inter Placeholder", sans-serif',
            fontSize: subtitleSize,
            fontWeight: 500,
            letterSpacing: "-2px",
            textAlign: "left",
            color: greyColor,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

RecordReflectRefine.displayName = "RecordReflectRefine";
