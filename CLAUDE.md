# CLAUDE.md — Architecture Guide for AI Context

> This is a reverse-engineered Framer export for [neoflix.care](https://neoflix.care), a medical
> video reflection platform. The codebase is the compiled output of a Framer visual editor project,
> deobfuscated and restructured for human/AI readability.

## Quick Start: What to Read

**To understand this site, read these ~3,500 lines (the "core"):**

| File | Lines | What it does |
|------|-------|-------------|
| `deobfuscated/script_main--router.mjs` | 456 | Route table (34 routes), SPA hydration, page transitions |
| `deobfuscated/chunk--shared-components.mjs` | 915 | Lenis smooth scroll, cursor, nav items, noise overlay |
| `deobfuscated/toolbox-page-factory.mjs` | 359 | Shared template for all 29 Toolbox pages (header + GitBook iframe + nav) |
| `deobfuscated/chunk--embed-component.mjs` | 508 | Iframe embed component + shared Toolbox nav bar |
| `deobfuscated/chunk--video-component-controls.mjs` | 328 | Video playback controls (scrubber, fullscreen) |
| `deobfuscated/chunk--video-player-component.mjs` | 328 | Video player (fill/contain/cover modes, InView loading) |
| `deobfuscated/docs-links.mjs` | 51 | Centralized GitBook URL map (route → docs.neoflix.care URL) |
| `deobfuscated/chunk--site-metadata.mjs` | 16 | Favicon, social image, site title/description |
| `deobfuscated/chunk--page-metadata-helper.mjs` | 40 | Responsive breakpoints + SEO metadata |

**To understand individual pages, read these (~11,700 lines):**

| File | Lines | What it does |
|------|-------|-------------|
| `deobfuscated/page--home.mjs` | 5,890 | Home page: world map, scroll-snap sections, spring animations |
| `deobfuscated/page--neoflix.mjs` | 2,960 | Product page: video player, scroll-snap hero, variant states |
| `deobfuscated/page--Publications.mjs` | 2,852 | Publications page: card layout, navigation anchors |

## What to Skip

**NEVER load these into context** (41,441 lines of vendor code):
- `deobfuscated/chunk--react-and-framer-runtime.mjs` (35,529 lines) — bundled React 18 + Framer SDK
- `deobfuscated/chunk--framer-motion.mjs` (5,912 lines) — Framer Motion + world map + scroll-snap HOCs

**Skip these too** (tooling, archives, redundant copies):
- `deobfuscate*.mjs`, `cleanup-html.mjs`, `rewrite-urls.mjs`, `fix-case-refs.mjs` — build/transform scripts
- `formatted/` — prettified HTML copies (redundant with `*.html` at root)
- `sites/2onvjkqnrbkhdnszrykaoo/*.mjs` (top-level, not in `deobfuscated/`) — original obfuscated chunks
- `extracted/*.style2.css` — superseded by `base.css` + `*.page.css`
- `toolbox-page-data.json` — 2.5MB raw data dump, not used at runtime

**Low-value (tiny, repetitive, already maximally collapsed):**
- `deobfuscated/metadata--toolbox_*.mjs` (29 files × 11 lines) — identical metadata stubs
- `deobfuscated/page--Toolbox*.mjs` (29 files × 10 lines) — thin wrappers calling factory

## Architecture

### Routing
Single flat route table in `script_main--router.mjs`. 34 routes keyed by opaque Framer IDs.
Pages are lazy-loaded via `import()`. The router checks `#main[data-framer-hydrate-v2]` to decide
between `hydrateRoot()` (SSR path) and `createRoot().render()` (client navigation).

### Pages
- **Home** (`/`): 6 scroll-snap sections. World map with auto-cycling city zoom (Leiden → Philadelphia → Vienna → Melbourne, 3s intervals). Spring physics: `damping: 24, mass: 9, stiffness: 500`.
- **Neoflix** (`/neoflix`): Product page with video hero. 6 variant states for responsive breakpoints. Uses Lenis smooth scroll. Tween: `0.4s, ease: [0.44, 0, 0.56, 1]`.
- **Publications** (`/Publications`): Card layout with 3 anchor sections (narrative, recordfelectrefine, providers). Uses Lenis smooth scroll.
- **Toolbox** (`/Toolbox` + 28 sub-routes): All rendered by `toolbox-page-factory.mjs`. Each page = fixed-height header + full-width GitBook iframe + nav bar. Content lives on `docs.neoflix.care`, not in this codebase.

### Responsive Breakpoints
Three breakpoints, consistent everywhere:
- Desktop: `min-width: 1200px`
- Tablet: `810px – 1199px`
- Mobile: `max-width: 809px`

Framer SSR-renders all 3 variants into HTML, hides non-matching ones with CSS, cleans up on hydration.

### Animation Systems
1. **Appear animations** (`index.script2.js`): WAAPI-based, runs before React hydrates. Elements start at `opacity: 0.001`, animate in via `element.animate()`.
2. **Framer Motion**: Standard `motion.*` components with variants, `LayoutGroup` for shared-element transitions.
3. **Scroll-snap**: `scroll-snap-type: y mandatory` on Home page via `withScrollSnapContainer` HOC.
4. **Page transitions**: Opacity fade, `0.2s, ease: [0.27, 0, 0.51, 1]`, applied to all Toolbox routes from Home.

### Key Third-Party Libraries (all bundled, no CDN)
- React 18 + ReactDOM
- Framer Motion
- Framer Site SDK (proprietary runtime)
- Lenis (smooth scroll)
- Material Icons (icon set, in framer-motion chunk)

### Fonts (self-hosted)
- Inter Bold 700 (7 unicode-range subsets)
- Inter Medium 500, Extra Bold 800
- DM Sans 500 (`/s/dmsans/`)
- Montserrat 500 (`/s/montserrat/`)

### Content Model
**Everything is hardcoded.** No CMS, no API calls, no dynamic data fetching.
- Page text: baked into SSR HTML and React component trees
- Video sources: literal `src` attributes (`assets/*.mp4`, `assets/*.webm`)
- Toolbox content: loaded via iframe from `docs.neoflix.care` (GitBook)
- Images: `assets/` directory + external GitHub-hosted SVG for world map

## File Organization

```
frmrduplicate/
├── CLAUDE.md                          ← you are here
├── sites/.../deobfuscated/            ← THE CODE (all .mjs files)
│   ├── script_main--router.mjs        ← entry point / router
│   ├── page--home.mjs                 ← home page component
│   ├── page--neoflix.mjs              ← neoflix page component
│   ├── page--Publications.mjs         ← publications page component
│   ├── page--Toolbox*.mjs (29 files)  ← thin wrappers → toolbox-page-factory
│   ├── toolbox-page-factory.mjs       ← shared toolbox template
│   ├── chunk--shared-components.mjs   ← scroll, cursor, nav items
│   ├── chunk--embed-component.mjs     ← iframe embed + toolbox nav
│   ├── chunk--video-*.mjs (2 files)   ← video player + controls
│   ├── chunk--framer-components.mjs   ← font config, link styles
│   ├── chunk--react-and-framer-runtime.mjs  ← [VENDOR] React+Framer
│   ├── chunk--framer-motion.mjs       ← [VENDOR] Motion+Map+ScrollSnap
│   ├── docs-links.mjs                 ← GitBook URL lookup table
│   ├── metadata--*.mjs                ← page metadata (SEO, breakpoints)
│   └── css/                           ← extracted inline CSS
├── extracted/                         ← CSS/JS ripped from HTML
│   ├── base.css                       ← shared 2,272-line reset+fonts+utils
│   ├── *.page.css                     ← page-specific CSS rules
│   └── *.style2.css                   ← [SUPERSEDED] originals with shared prefix
├── assets/                            ← videos, fonts, images (18MB)
├── formatted/                         ← [ARCHIVE] prettified HTML
├── *.html / *.htm                     ← original SSR HTML shells
└── *.mjs (root)                       ← build/transform tooling scripts
```

## Page Component Deep Dive

### page--home.mjs (~5,700 lines, 14 components)

The home page defines 14 Framer components inline (13 unique + 1 reused duplicate):

| Component | displayName | What it does |
|-----------|-------------|-------------|
| `Be` | "Neoflix anim" | Spinning logo mark — Inner Ring + Outer Ring SVGs rotate on hover |
| `Ae` | "Record Reflect Refine Copy" | Cycling h1 headline, 3 color states, 1800ms delay (mobile) |
| `He` | "Record Reflect Refine" | Same cycling headline, wider (desktop) |
| `le` | "Trigger" | Invisible hover block cycling 3 background colors |
| `Ee` | "Decisiveness" | Clickable caption with Main/Active/Inactive states |
| `Ke` | "Quiet Reflection" | Clickable caption (same pattern as above) |
| `We` | "Team Dynamics" | Clickable caption (same pattern) |
| `rr` | "Story Right" | Tab switcher: 3 triggers + 3 captions + video panel, auto-cycles 6.6s |
| `ar` | "Tunnel vision" | Clickable caption (right-aligned) |
| `tr` | "Urgency" | Clickable caption (right-aligned) |
| `nr` | "Coordination" | Clickable caption (right-aligned) |
| `dr` | "Story Left2" | Mirror of Story Right — left-aligned tab switcher |
| `De` | "Home" | **Page root**: nav, responsive layout, scroll-snap sections, world map |

**Key animations:**
- World map: auto-cycles 4 city zooms, spring `damping: 24, mass: 9, stiffness: 500`
- Story panels: auto-advance 3 tabs at 6600ms intervals
- Caption hover: border-radius 0→10, text color swap

### page--neoflix.mjs (~2,700 lines, 2 components)

| Component | displayName | What it does |
|-----------|-------------|-------------|
| `q` | "Backdrop" | Full-screen video layer: 6 variant videos (Time/Dance/Skills/Cost/Team/Perspective) + noise overlay |
| `Z` | "Layer2 2" | **Page root**: fixed navbar, sidebar nav (desktop), scrollable main with 6 content sections |

**6 content sections** (each: heading + video + body text):
1. Time — "Medical procedures are time-sensitive"
2. Dance — "Teams must function in concert"
3. Cost — "Risks of substandard care"
4. Skills — "Skills require ongoing development"
5. Team — "Teamwork demands constant practice"
6. Perspectives — "Multiple perspectives in complex care"

### page--Publications.mjs (~2,500 lines, 2 components)

| Component | displayName | What it does |
|-----------|-------------|-------------|
| `j` | "Backdrop2" | Full-screen background: looping video + noise overlay |
| `q` | "Scroll Section" | **Page root**: nav, sidebar scroll-spy, 3 publication sections |

**3 publication sections** (each: heading + 2 hoverable cards + citation + body text):
1. "Narrative Review" — Video recording emergency care
2. "Provider's Perspective" — Healthcare provider experiences
3. "Record, Reflect, Refine" — Implementation framework

### Shared Patterns (chunk--page-helpers.mjs)

Common utilities extracted from repeated patterns across all pages:
- `mergeVariantProps()` — merge variant-specific props from a map
- `TransitionProvider` — MotionContext transition wrapper
- `AnimatedFragment` — `motion(ReactFragment)`
- `resolveVariant()` — normalize variant name → internal ID
- `makeLayoutKey()` — compute layout dependency keys
- `BASE_VIDEO_PROPS` / `VIDEO_PROPS_FLAT` / `VIDEO_PROPS_ROUNDED` — shared video defaults
- `SPRING_STANDARD` / `SPRING_HEAVY` / `SPRING_CAPTION` — animation configs
- `CSS_ASPECT_RATIO_SUPPORT` — CSS preamble shared by all components

## Design Tokens (CSS Custom Properties)

| Token | Color | Usage |
|-------|-------|-------|
| `--token-3f355627-...` | `rgb(114, 194, 194)` | "Bar Green" — teal accent |
| `--token-4eefdbfc-...` | `rgb(82, 156, 156)` | "Text Highlight" — darker teal |
| `--token-46c9bfd9-...` | `rgb(56, 52, 55)` | Primary dark text |
| `--token-b73f7c2a-...` | `rgb(245, 249, 252)` | Near-white background |
| `--token-13b5b450-...` | `rgb(0, 51, 59)` | Dark teal (publications) |
| `--token-947ca9b0-...` | `rgb(66, 62, 62)` | Caption active dark |
| `--token-11283d1d-...` | `rgb(128, 128, 128)` | Caption inactive grey |

## For AI Sessions: Recommended Loading Order

1. **Always read first:** This file (`CLAUDE.md`)
2. **For routing/structure questions:** `script_main--router.mjs`
3. **For specific page work:** The relevant `page--*.mjs` file (see component tables above)
4. **For shared UI:** `chunk--shared-components.mjs`, `chunk--embed-component.mjs`
5. **For shared utilities:** `chunk--page-helpers.mjs` (common patterns)
6. **For Toolbox changes:** `toolbox-page-factory.mjs` + `docs-links.mjs`
7. **For CSS:** `extracted/base.css` (shared) + `extracted/*.page.css` (per-page)
8. **Never:** `chunk--react-and-framer-runtime.mjs`, `chunk--framer-motion.mjs`

## Context Budget Estimate

| What to load | Lines | Tokens (est.) |
|-------------|-------|---------------|
| This file (CLAUDE.md) | ~200 | ~2K |
| Router | 456 | ~4K |
| Shared components + helpers | ~1,400 | ~12K |
| One page file | 2,500–5,700 | ~20-45K |
| Page-specific CSS | 195–2,542 | ~2-20K |
| **Typical working set** | **~5,000** | **~40K** |

A typical session working on one page should fit comfortably in ~50K tokens of context.
