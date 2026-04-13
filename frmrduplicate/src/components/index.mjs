/**
 * Standalone components — clean reimplementations of the original Framer export.
 *
 * These components use only React + framer-motion. No Framer runtime dependencies.
 * They reproduce the original visual behavior pixel-for-pixel while giving you
 * full control over every prop, animation config, and color token.
 *
 * Usage:
 *   import { IntroSlide, NeoflixLogo, RecordReflectRefine } from "./components/index.mjs";
 *
 *   <IntroSlide
 *     navbar={<YourNavbar />}
 *     variant="desktop"
 *   />
 */
export { default as NeoflixLogo, NEOFLIX_LOGO_FULL_SVG } from "./NeoflixLogo.mjs";
export { default as RecordReflectRefine } from "./RecordReflectRefine.mjs";
export { default as IntroSlide } from "./IntroSlide.mjs";
export { default as Navbar } from "./Navbar.mjs";
