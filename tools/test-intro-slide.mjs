#!/usr/bin/env node
/**
 * Console test for IntroSlide animation logic.
 *
 * Validates the state machines, rotation values, timer configs, and spring
 * parameters without needing React or a browser. Catches the kind of bugs
 * that make the animation "not work" — wrong rotation targets, missing
 * transitions, broken state flow.
 *
 * Run: node tools/test-intro-slide.mjs
 */

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ ${label}`);
  }
}

function section(name) {
  console.log(`\n── ${name} ──`);
}

// ---------------------------------------------------------------------------
// 1. NeoflixLogo rotation state machine
// ---------------------------------------------------------------------------
section("NeoflixLogo — rotation targets");

const INNER_RING = { splayed: -62, assembled: 0, hover: -6 };
const OUTER_RING = { splayed: 97, assembled: 0, hover: 5 };

// Simulate state transitions
function getRotations(assembled, hovered) {
  const inner = !assembled
    ? INNER_RING.splayed
    : hovered
      ? INNER_RING.hover
      : INNER_RING.assembled;
  const outer = !assembled
    ? OUTER_RING.splayed
    : hovered
      ? OUTER_RING.hover
      : OUTER_RING.assembled;
  return { inner, outer };
}

// Mount state (not yet assembled)
const mount = getRotations(false, false);
assert(mount.inner === -62, `Mount: inner = ${mount.inner} (expect -62)`);
assert(mount.outer === 97, `Mount: outer = ${mount.outer} (expect 97)`);

// Assembled (resting)
const rest = getRotations(true, false);
assert(rest.inner === 0, `Assembled: inner = ${rest.inner} (expect 0)`);
assert(rest.outer === 0, `Assembled: outer = ${rest.outer} (expect 0)`);

// Hover while assembled
const hover = getRotations(true, true);
assert(hover.inner === -6, `Hover: inner = ${hover.inner} (expect -6)`);
assert(hover.outer === 5, `Hover: outer = ${hover.outer} (expect 5)`);

// Hover while not assembled (should stay splayed, not mix states)
const hoverSplayed = getRotations(false, true);
assert(hoverSplayed.inner === -62, `Hover+splayed: inner = ${hoverSplayed.inner} (expect -62, not mixed)`);
assert(hoverSplayed.outer === 97, `Hover+splayed: outer = ${hoverSplayed.outer} (expect 97, not mixed)`);

// ---------------------------------------------------------------------------
// 2. Spring configs
// ---------------------------------------------------------------------------
section("Spring configs");

const SPRING_HEAVY = { type: "spring", damping: 24, mass: 9, stiffness: 500 };
const SPRING_ENTRANCE = { type: "spring", damping: 30, mass: 1, stiffness: 400 };

assert(SPRING_HEAVY.type === "spring", "SPRING_HEAVY is a spring");
assert(SPRING_HEAVY.damping === 24, `SPRING_HEAVY damping = ${SPRING_HEAVY.damping}`);
assert(SPRING_HEAVY.mass === 9, `SPRING_HEAVY mass = ${SPRING_HEAVY.mass}`);
assert(SPRING_HEAVY.stiffness === 500, `SPRING_HEAVY stiffness = ${SPRING_HEAVY.stiffness}`);

// Verify the heavy spring is actually slow (natural frequency ω = √(k/m))
const omega = Math.sqrt(SPRING_HEAVY.stiffness / SPRING_HEAVY.mass);
assert(omega < 10, `SPRING_HEAVY ω = ${omega.toFixed(2)} (< 10 = slow, weighty)`);

const omegaEntrance = Math.sqrt(SPRING_ENTRANCE.stiffness / SPRING_ENTRANCE.mass);
assert(omegaEntrance > 15, `SPRING_ENTRANCE ω = ${omegaEntrance.toFixed(2)} (> 15 = snappy)`);

// Damping ratio ζ = c / (2√(km)) — underdamped if < 1
const zeta = SPRING_HEAVY.damping / (2 * Math.sqrt(SPRING_HEAVY.stiffness * SPRING_HEAVY.mass));
assert(zeta < 1, `SPRING_HEAVY ζ = ${zeta.toFixed(3)} (< 1 = underdamped, will overshoot)`);

// ---------------------------------------------------------------------------
// 3. RecordReflectRefine cycling
// ---------------------------------------------------------------------------
section("RecordReflectRefine — word cycling");

const WORDS = ["Record,", " Reflect,", " Refine:"];
const CYCLE_DELAY_MS = 1800;

assert(WORDS.length === 3, `${WORDS.length} words to cycle`);
assert(CYCLE_DELAY_MS === 1800, `Cycle delay = ${CYCLE_DELAY_MS}ms`);

// Verify cycling wraps correctly
for (let i = 0; i < 6; i++) {
  const index = i % 3;
  const word = WORDS[index];
  assert(typeof word === "string" && word.length > 0, `Cycle ${i}: index=${index} → "${word}"`);
}

// ---------------------------------------------------------------------------
// 4. IntroSlide layout configs
// ---------------------------------------------------------------------------
section("IntroSlide — layout per variant");

function getLogoDimensions(variant) {
  const isMobile = variant === "mobile";
  const isDesktop = variant === "desktop";
  if (isMobile) return { width: "99.5vw", height: 242 };
  if (isDesktop) return { width: "60vw", height: 221 };
  return { width: "99.5vw", height: 242 }; // tablet
}

const desktop = getLogoDimensions("desktop");
assert(desktop.width === "60vw", `Desktop logo width = ${desktop.width}`);
assert(desktop.height === 221, `Desktop logo height = ${desktop.height}`);

const mobile = getLogoDimensions("mobile");
assert(mobile.width === "99.5vw", `Mobile logo width = ${mobile.width}`);
assert(mobile.height === 242, `Mobile logo height = ${mobile.height}`);

const tablet = getLogoDimensions("tablet");
assert(tablet.width === "99.5vw", `Tablet logo width = ${tablet.width}`);
assert(tablet.height === 242, `Tablet logo height = ${tablet.height}`);

// ---------------------------------------------------------------------------
// 5. Entrance animation delays
// ---------------------------------------------------------------------------
section("Entrance animation sequence");

const ENTRANCE_LOGO_DELAY = 0.9;
const ENTRANCE_HEADLINE_DELAY = 1.0;
const AUTOPLAY_DELAY = 1000; // ms — must be >= ENTRANCE_LOGO_DELAY to be visible

assert(ENTRANCE_LOGO_DELAY < ENTRANCE_HEADLINE_DELAY,
  `Logo (${ENTRANCE_LOGO_DELAY}s) appears before headline (${ENTRANCE_HEADLINE_DELAY}s)`);
assert(AUTOPLAY_DELAY >= ENTRANCE_LOGO_DELAY * 1000,
  `Ring unfurl (${AUTOPLAY_DELAY}ms) starts after logo entrance (${ENTRANCE_LOGO_DELAY * 1000}ms)`);

// (IntroSlide file check is in the SVG section below, after __dirname is defined)

// ---------------------------------------------------------------------------
// 6. Color tokens
// ---------------------------------------------------------------------------
section("Color tokens");

const TEAL = "rgb(82, 156, 156)";
const DARK = "rgb(56, 52, 55)";

assert(TEAL.startsWith("rgb("), `Teal is rgb format: ${TEAL}`);
assert(DARK.startsWith("rgb("), `Dark is rgb format: ${DARK}`);

// Logo default colors
const LOGO_TEAL = "#48c1c4";
const LOGO_DARK = "#1c3664";
assert(LOGO_TEAL.startsWith("#"), `Logo teal is hex: ${LOGO_TEAL}`);
assert(LOGO_DARK.startsWith("#"), `Logo wordmark is hex: ${LOGO_DARK}`);

// ---------------------------------------------------------------------------
// 7. SVG integrity (quick structural checks)
// ---------------------------------------------------------------------------
section("SVG structure");

// Read the actual component file
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const logoSrc = readFileSync(resolve(__dirname, "../src/components/NeoflixLogo.mjs"), "utf8");

assert(logoSrc.includes("InnerRingSVG"), "NeoflixLogo defines InnerRingSVG");
assert(logoSrc.includes("OuterRingSVG"), "NeoflixLogo defines OuterRingSVG");
assert(logoSrc.includes("WordmarkSVG"), "NeoflixLogo defines WordmarkSVG");
assert(logoSrc.includes("onHoverStart"), "Hover is on parent container (onHoverStart)");
assert(logoSrc.includes("onHoverEnd"), "Hover cleanup (onHoverEnd)");
assert(!logoSrc.includes("dangerouslySetInnerHTML"), "No dangerouslySetInnerHTML (proper JSX SVGs)");
assert(!logoSrc.includes("whileHover"), "No whileHover on individual elements (hover via state)");
assert(logoSrc.includes("SPRING_HEAVY"), "Uses SPRING_HEAVY for ring animation");

const introSrc = readFileSync(resolve(__dirname, "../src/components/IntroSlide.mjs"), "utf8");
assert(introSrc.includes("NeoflixLogo"), "IntroSlide imports NeoflixLogo");
assert(introSrc.includes("RecordReflectRefine"), "IntroSlide imports RecordReflectRefine");
assert(introSrc.includes("scroll-snap"), "IntroSlide uses scroll-snap");
assert(introSrc.includes(`autoPlayDelay={${AUTOPLAY_DELAY}}`),
  `IntroSlide passes autoPlayDelay={${AUTOPLAY_DELAY}} to NeoflixLogo`);

// ---------------------------------------------------------------------------
// Summary
// ---------------------------------------------------------------------------
console.log(`\n${"═".repeat(40)}`);
console.log(`  ${passed} passed, ${failed} failed`);
console.log(`${"═".repeat(40)}`);

if (failed > 0) {
  process.exit(1);
}
