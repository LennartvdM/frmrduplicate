# Neoflix Website Audit

**Date:** 2026-08-18 · **Scope:** whole repo (`frankenstein/` app, `docs-content/` mirror, build pipeline, Netlify config) · **Method:** five parallel deep audits (architecture, dead-code reachability graph, asset/git-weight analysis, runtime performance patterns, hygiene/handoff), with load-bearing claims independently re-verified. Static analysis only; nothing was modified.

**Purpose:** spring cleaning before handoff to a non-technical owner who will maintain the site by prompting AI ("AI as CMS"). Findings are graded: **P0** (fix before handoff), **P1** (correctness/user-facing), **P2** (structural debt), **P3** (polish).

---

## Execution status (2026-08-18, same day)

Phases 0–2 of §9 were implemented on this branch the same day. Delivered: the
delete list (§2.1–2.2), the referenced-only asset filter and 260 MB source
prune (§2.3 — mirror-side prune still pending upstream), og-preview.png
(1.1), 404 + error boundary + real 404 statuses + legacy 301s (6.1), security
headers + CSP (6.3), self-hosted fonts + Vimeo `dnt=1` (6.4), the og-upload
tool retired (7.2), Node 22 + strict `npm ci` + stale config removed (4.6),
video re-encodes/posters/blur removal and full bundle splitting (§5.1–5.3),
both §5.5 bugs fixed, `neoflix-intro-card` inlined (7.3), the data-layer
rename + one-source tagline (4.1/4.3), a11y quick wins (6.5: skip link, focus
reset, `aria-current`, reduced-motion route swaps, sr-only h1s), `/contact`
canonicalized + homepage Organization JSON-LD (6.6), and the handoff kit
(§8: README/CLAUDE.md/CONTENT.md, CI, smoke checks, prettier config).

**Correction:** §1.3 originally claimed the KNAW Van Walree Fund credit was
missing from the site — it was already present in `Footer.jsx`. No change was
needed there.

**Second pass (same day):** the deferred §5.4 items are now also done —
`useTabletLayout` reads one module-level store via `useSyncExternalStore`
(one set of window listeners instead of ~150+ on /toolbox), the dot nav
writes its position imperatively and broadcasts `scrollsnap:dotnav-sync`
(no more per-frame renders or retargeted transitions), the medical
punch-out circles react to that event instead of a perpetual
rAF/querySelectorAll loop, the arrow buttons lost their backdrop-filter,
and the canvas blit engine is reverted: decorative clips render as real
`<video>` again through `IllustrationClip` (same props contract; Edge's
address-bar "Enhance video" prompt accepted as documented in the
component header).

**Decision recorded (7.1):** the GitBook chain **stays** — the client
prefers editing in GitBook. `docs-content/` remains a mirror; CLAUDE.md's
hard rule 1 stands. Revisit only if she later moves her editing to AI.

**Still open (owner decisions):** mirror-side asset prune + consent review
for the three referenced clinical clips (1.2), LICENSE choice (1.3),
analytics pick (6.2), git history rewrite at transfer (7.4), Vite upgrade
(7.5). The cookie-cutter band merge remains deliberately unmerged (pure
refactor, no runtime cost, regression risk on the flagship sections).

---

## Verdict

The site is in better shape than the "frankenstein" framing suggests — and worse in a few places nobody was looking.

**Better than feared:** the GitBook-iframe era is completely over (`/toolbox` is native React; the only iframe on the site is the Vimeo player). The motion system is disciplined — framer-motion usage is small and correct, `will-change` is handled carefully, scroll listeners are passive, offscreen videos are genuinely paused. The SEO plumbing (per-route HTML heads, sitemap, robots.txt, even `llms.txt`) is the strongest subsystem in the repo. And there is no tracking of any kind — no cookies, no analytics, nothing that would ever require a consent banner.

**Worse than feared:** the social-share image every route points at **does not exist** (finding 1.1 — on a site that lives on LinkedIn referrals); **260 MB of the 354 MB GitBook asset mirror is dead weight that still ships in every deploy**, including clinical-room footage and staff photos at public URLs (1.2); and the data layer contains a **name-swap** (`publications.js` holds the Neoflix page, `neoflix.js` is a dead decoy) that is close to a guarantee that an AI-driven edit will one day change the wrong page or silently change nothing (4.1).

### The numbers

| Metric | Now | After cleanup |
|---|---|---|
| Repo total | 608 MB (400 MB tree + 208 MB `.git`) | ~220 MB (with history rewrite: tree ~126 MB + pack ~95 MB) |
| Deploy payload (docs assets) | 354.7 MB, 57 files, all copied | ~95 MB, 11 referenced files (+ small allowlist) |
| Dead source files | 12 files, 1,435 lines | 0 |
| Dead media in `public/` | 12.1 MB videos + 1.84 MB duplicate SVGs | 0 |
| JS shipped to a phone visitor on `/` | ~80–85 % never renders | route-split + lazy docs data |

---

## 1. Critical — fix before handoff (P0)

### 1.1 The Open Graph image does not exist — every share card is broken
All ~82 generated route HTMLs point `og:image`/`twitter:image` at `https://www.neoflix.care/og-preview.png` (`frankenstein/index.html:23,33`, `src/data/routeMeta.js:25`). The file is absent from `public/`, from `git ls-files`, and from **all git history** (verified). The entire `og-upload.html` + `netlify/functions/commit-og.mjs` machinery was built to place this file and has evidently never run to completion. Since LinkedIn referrals are the site's primary channel, every share since launch has rendered without an image.
**Fix:** commit a real 1200×630 PNG at `frankenstein/public/og-preview.png`. Then decide the fate of the upload tool (see 7.2).

### 1.2 All 57 GitBook assets are published unfiltered, including clinical footage and named-person photos
`scripts/build-docs.mjs:616-628` copies **everything** in `docs-content/.gitbook/assets/` to `public/docs-assets/` — referenced or not — so each file is publicly reachable at a guessable URL. That includes `GoPro aangezet op opvangkamer geknipt.mp4` (a resuscitation-room recording), `Ruben zet bril op.mp4`, `opzetten tobii bril.mp4`, staff photos (`Foto Henriette.jfif`, `Foto arjan.jfif`, `Veerle Heesters photo.jpg`, …), and internal documents (`Inwerkdocument procesbegeleider.docx`, `NEOFLIX pitch.pptx`). On a neonatology site, publishing a clinical-room recording at a stable public URL is a consent/GDPR question that should be answered explicitly before handover — even if only staff appear in it.
**Fix:** make `build-docs.mjs` copy only assets actually referenced by the markdown (plus a small allowlist — see the trap in 2.3), and prune the unreferenced files at the source (GitBook / the mirror repo), or the next mirror push restores them.

### 1.3 Licensing and attribution
- Third-party publisher PDFs sit in `.gitbook/assets/` and are republished by the copy-everything loop (`From Safety-I to Safety-II A White Paper.pdf`, `Narrative Review.pdf`, `VOCAL.pdf`, …). The *curated* `/papers/` copies have per-paper license records in `publicationRecords.js`; these uncurated duplicates don't.
- **No `LICENSE` file exists anywhere in the repo.**
- The KNAW Van Walree Fund credit exists **only** in the GitBook mirror (`docs-content/README.md:9`) — it appears nowhere on the actual site. If the grant requires acknowledgement, the site currently doesn't carry it.
**Fix:** the asset prune (1.2) removes the uncurated PDFs; add a `LICENSE`; add the funder credit to the site footer.

### 1.4 Zero documentation for the next maintainer
No `README.md`, no `CLAUDE.md`, no `CONTRIBUTING.md`, no `.github/` (no CI), no tests, no lint/format config — anywhere. For an AI-as-CMS handoff this is the single biggest gap: every session starts by re-excavating the repo (the exact friction that motivated this audit), and nothing catches a broken edit before it deploys. See §8 for the handoff kit.

---

## 2. The delete list (verified dead)

A reachability graph was built from the real entry points (`src/main.jsx`, build scripts, configs), following static/dynamic imports, CSS `@import`/`url()`, barrels, and the `file:` package. Every candidate below was additionally cross-grepped by basename repo-wide.

### 2.1 Dead source files — 12 files, 1,435 lines, all delete-safe

| File | Size | What it was |
|---|---|---|
| `src/pages/Publications.jsx` | 232 B | Old publications route (superseded by `PublicationsPage.jsx`) |
| `src/components/PublicationsSection.jsx` | 601 B | Its body |
| `src/components/shared/index.js` | 483 B | Barrel; only the dead cluster used it |
| `src/components/shared/SidebarLayout.jsx` | 9.3 KB | Legacy sidebar article layout |
| `src/components/shared/SidebarItem.jsx` | 1.3 KB | Sidebar nav item |
| `src/components/shared/ContentSection.jsx` | 2.9 KB | Animated content section |
| `src/components/shared/animations.js` | 3.1 KB | Sidebar animation utils |
| `src/styles/sidebar.css` | 14.1 KB | Sidebar styles |
| `src/components/sections/medical/VideoManager.jsx` | 1.3 KB | Old controlled `<video>` wrapper |
| `src/styles/video-controls.css` | 913 B | WebKit control hiding, unreferenced |
| `src/data/neoflix.js` | 12.6 KB | **Dead decoy** — stale draft of the publications content (see 4.1) |
| `src/version.js` | 100 B | CJS `require` of a file that doesn't exist |

Proof of death for the big cluster: `shared/index.js:5` re-exports `BLOG_PAGE_STYLE` from `BlogPage.jsx`, which has no such export — the build would fail if anything live imported this barrel. Bonus: Tailwind's content glob scans these files, so deleting them also removes their utility classes from the shipped CSS.

Also dead inside the live `neoflix-intro-card` package: `CalibrationToolbox.jsx` (349 lines, the package's largest file) plus its `DEFAULT_PARAMS`/`NEOFLIX_LOGO_FULL_SVG` exports — the app imports only `IntroSlide` and `useDropPhysics`.

Vestigial build code: the `ogUploadPlugin` dev middleware in `vite.config.js` (`/__upload-og`) is called by nothing — `og-upload.html` posts to the Netlify function even in dev.

### 2.2 Dead media in `public/` — 13.9 MB

- `public/videos/mobile/neoflix_intro_mobile.mp4` — 7.78 MB, superseded, unreferenced.
- `public/videos/mobile/collaboration.mp4` — 4.31 MB, old-generation clip at 8,545 kbps, unreferenced.
- `public/worldmap.svg` and `public/assets/worldmap.svg` — two byte-identical copies (942 KB each) of the map SVG whose live copy is bundled from `src/frmr-map/assets/`. (~1.84 MB; verify with one build-and-diff before removing.)

### 2.3 The GitBook asset prune — 260 MB

Of 57 files in `docs-content/.gitbook/assets/` (354.66 MB), the markdown references **11 files (94.65 MB)**. The other **46 files (260.01 MB)** are dead weight — including 105 MB of byte-identical `X` / `X (1)` duplicate pairs, a 41.79 MB `Figure 3.tif`, two `.mov` exports (32.4 MB), and five orphaned `.pptx` decks. Because `build-docs.mjs` copies everything, all of it ships in **every deploy**.

Two things to respect while pruning:
- **Prune at the source.** `docs-content/` is mirrored in by a GitHub Action from `LennartvdM/NFLX-nieuwe-structuur`; deleting files only here means the next mirror push restores them. Remove them in GitBook / the mirror repo (and/or add the build-side filter so deploys are protected regardless).
- **The trap:** `narrative-review-frontiers-preview.png` is referenced by **no markdown** but is required by `BlogPage.jsx:47` (`/docs-assets/narrative-review-frontiers-preview.png`). It only reaches production because the build copies everything. Any allowlist must include it — or better, move it next to the 5 tracked preview PNGs (see 4.4).

### 2.4 Git history (optional, at handoff)

The pack is 208 MB, dominated by the current asset dump (only 25 MB is orphaned history — mostly five superseded mobile videos). After the source-side prune, a one-time history rewrite (or a fresh-start squash at handoff) brings `.git` to roughly **95–100 MB**. Worth doing once, right before transfer — a smaller clone makes every future AI session start faster.

### 2.5 Looks dead, isn't — do not delete

- `MedicalSectionV2.jsx` / `MedicalSectionV3.jsx` — not stale revisions; they are 6-line **content-variant** shims (`variant="v2"|"v3"`) rendered as home slides 2 and 3. Consider renaming (e.g. `MedicalSectionMoment` / `MedicalSectionReflection`) so the names stop implying supersession.
- The 21 hashed `.woff2` files in `public/assets/` — the Framer map runtime's own fonts, loaded via URL strings inside the compiled chunks. (Related bug: the chunks also reference 7 `Inter-Bold.*.woff2` files that **don't exist** — silent 404s at runtime, masked by fallback.)
- `src/frmr-map/**` — all four chunks + the SVG are live behind `WorldMap.jsx`.
- `MedicalMobileLayout.jsx` — *effectively* unreachable (Home short-circuits to `MobileHome` below 600 px before `MedicalSection` can pick it), but keep until the breakpoint unification (4.5) makes that provable.
- `data/publications.js` — **live** despite the misleading name; it feeds `/neoflix` (see 4.1).

---

## 3. Architecture — what's actually there

### 3.1 Shell and routes

`main.jsx` → `App.jsx`: `Router` → `TransitionProvider` → `Navbar` + `BackdropProvider` → `RouteSlider` → `Routes`, plus `MobileDock` under 600 px.

| Route | Desktop | Mobile (<600 px) | Split type |
|---|---|---|---|
| `/` | `ScrollSnap` → `SectionManager` (5 sections) | `MobileHome` | **Hard fork — copy duplicated** (4.2) |
| `/neoflix` | `BlogPage` | `MobileNeoflixPage` | Shared data, two layouts (good) |
| `/publications` | `BlogPage` | `MobilePublicationsPage` | Shared data, two layouts (good) |
| `/publications/:slug` | `PaperPage` | same | CSS-only |
| `/contact` | `NeoflixPage scrollTo="contact"` | same | Alias route (see 6.6) |
| `/toolbox`, `/toolbox/*` | `DocsPage` (sidebar + article + ToC rail) | same, CSS-responsive | **Best pattern in the repo** |

No `path="*"` route: an unknown URL renders the navbar over an empty fixed-position layer — blank screen, HTTP 200 (see 6.1).

### 3.2 Content pipeline

```
GitBook (docs.neoflix.care editing UI)
   │  webhook / mirror
   ▼
LennartvdM/NFLX-nieuwe-structuur  ──GitHub Action──▶  docs-content/  (this repo, tracked files, "do not edit by hand")
                                                        │
                                              build.sh on Netlify:
                                              1. build-docs.mjs        → src/generated/*.json + public/docs-assets/ (gitignored)
                                              2. build-publications-zip.mjs → papers bundle + manifest (gitignored)
                                              3. vite build            → dist/
                                              4. build-route-html.mjs  → 82 per-route HTML heads + sitemap + robots + llms.txt
```

The per-route HTML + SPA-rewrite interplay is **correct** (Netlify serves physical files before applying the non-forced `/*` → `/index.html` rewrite). Three tiers of content, three editing surfaces: docs = markdown in GitBook; long-form pages = `src/data/*.js`; everything else = hardcoded JSX (the problem — see §4).

### 3.3 Motion system (healthy)

`TransitionContext` (direction + is-sliding) → read by `RouteSlider` (slot-keyed AnimatePresence slide; deliberate, documented replacement for the View Transitions API) and `ScrollSection` (gates section reveals during slides). `BackdropProvider` is a single persistent video backdrop with a publish/subscribe target model and a well-designed decode budget. This architecture is sound; the performance costs live elsewhere (§5).

### 3.4 Known overlaps

- **Three IntersectionObservers watch the same home sections**; `SectionManager`'s (`SectionManager.jsx:10-27`) sets state nothing reads — deletable.
- **`useViewport` vs `useTabletLayout`** are near-duplicates that can disagree during rotation; consumers are split arbitrarily across them.
- The **600 px breakpoint is hardcoded in 7 files**.
- `SimpleCookieCutterBand` / `MirroredCookieCutterBand` are copy-paste twins whose only real delta is mirror direction — and `MedicalSection.data.js` already carries the `orientation` field that would drive a single merged component.

---

## 4. Traps for an AI-maintained site

These are the findings that matter most for the AI-as-CMS plan. Each one is a way a plausible, well-intentioned prompt produces a wrong or invisible result.

### 4.1 The name-swap (highest risk)

```
src/data/publications.js     → content for /neoflix        (LIVE, mislabeled — its own header comment says "Publications page", which is false)
src/data/neoflix.js          → content for /publications   (DEAD stale draft — nothing imports it)
src/data/publicationsPage.js → content for /publications   (live, correct)
src/data/neoflixPage.js      → re-export shim over publications.js (live)
```

An agent told "update the publications page" that greps `publications` finds `publications.js` first — the Neoflix file — and the file's own comment confirms the mistake. An agent that greps `neoflix` finds `neoflix.js`, edits it, and **nothing changes on the site**.
**Fix:** delete `neoflix.js` (it's in the delete list); rename `publications.js` → `neoflixSections.js` and collapse the `neoflixPage.js` shim; correct the header comments.

### 4.2 Mobile/desktop copy forks

- `MobileHome.jsx:13-127` (`MOBILE_PANELS`) restates the desktop home copy from `MedicalSection.data.js:15-19,43-47` — same sentences, **incompatible data shapes** (desktop: `firstLine`/`secondLine`; mobile: nested `lines[][{text,accent,delay}]`). A copy edit on one surface silently leaves the other stale.
- Mobile-only strings invisible from the data layer: `MobileNeoflixPage.jsx:167-171` ("Record. Reflect. Refine." hero + subtitle), `:197-200` (intro band), `MobilePublicationsPage.jsx:199-203` ("Articles" + subtitle).
- The media maps are triplicated: `sectionToVideo` in `neoflixPage.js`, plus parallel copies with accent colors in both mobile pages.
**Fix:** lift shared copy into one data module both layouts read; failing that, the CLAUDE.md rule "every copy change must be made on both surfaces" is mandatory.

### 4.3 The homepage tagline lives in five places

"Improve patient care through video reflection." exists at `IntroSection.jsx:29` (the live prop), `neoflix-intro-card/src/IntroSlide.jsx:85` (overridden default), `neoflix-intro-card/src/RecordReflectRefine.jsx:39` (another default), with the mobile equivalent (different copy entirely) at `MobileHome.jsx:19-25`, and the SEO title/description at `routeMeta.js:42-45`. None of these are in `src/data/`.

### 4.4 Generated-vs-tracked confusion

`public/docs-assets/` is gitignored as "regenerated on every build" — yet **5 hand-placed publication preview PNGs are tracked inside it** (tracked files override gitignore), and a 6th preview (`narrative-review-frontiers-preview.png`) arrives only via the copy-everything loop (2.3). Hand-placed content living in a directory documented as disposable is a booby trap for any cleanup.
**Fix:** move the previews to a tracked directory (e.g. `public/previews/`), update `BlogPage.jsx`/`publicationsPage.js` paths, and let `docs-assets/` be purely generated.

### 4.5 Standing sync debts (document or dissolve)

- `legacySlugMap.js` ↔ `toolboxPages.js`: two hand-maintained 89-entry tables whose headers tell you to keep them in sync; `toolboxPages.js`'s header also claims consumers (`ToolboxEmbed.jsx`, "CMS /admin") that don't exist. Its three helpers are dead; its only live use is legacy-URL rewriting in `renderMarkdown.js:165`.
- `BackdropProvider.jsx:62-75` (`HOME_CELLS`) must mirror `Home.jsx`'s `sections` array — undeclared coupling.
- `routeMeta.js` is dual-consumed by `useDocumentMeta.js` (runtime) and `build-route-html.mjs` (build) and must stay Node-safe — this one is well documented in the file, the others aren't.
- The 600 px breakpoint in 7 files (3.4).

### 4.6 The build's silent failure paths

- `neoflix-intro-card` declares peer `framer-motion >= 11`; the app pins `^10.12.16`. It works only via the existing lockfile — and `build.sh:14` runs `npm ci --prefer-offline 2>/dev/null || npm install`, which hides why `npm ci` failed **and** falls back to a fresh resolve that would hit ERESOLVE. A client-era dependency touch could fail confusingly or drift versions silently.
**Fix:** align the peer range (or inline the package, 7.3), drop the `2>/dev/null || npm install` fallback so a lockfile mismatch fails loudly.
- Netlify env still declares `SUBMODULE_STRATEGY = "recursive"` with a comment about submodule pulls; `docs-content` has been regular tracked files for some time. Stale config that will actively mislead the next maintainer. `NODE_VERSION = 18` is EOL (April 2025) — bump to a current LTS.

---

## 5. Performance — where the computation actually goes

**The surprise: the material-motion work is not the cost.** framer-motion usage is 18 `motion.*` elements site-wide, zero layout animations, zero per-frame state-driven springs, correct `will-change` hygiene. The heaviness lives in five other places:

### 5.1 Phone network weight (highest real-world impact)

- `public/videos/mobile/neoflix_intro_blur_montage.mp4` is **9.79 MB** with `preload="auto"` on the phone homepage (`MobileHome.jsx:503`) — ~15–25 s of a 4G radio before anything else, competing with the JS bundle. It's a *blurred* montage; it does not need the bitrate. Re-encode to ≤1.5 MB and drop to `preload="metadata"`.
- Phone `/neoflix` mounts **13 `<video>` elements** (~15.7 MB), `/publications` 8 (~12 MB) — pointed at the **desktop** encodes even though `public/videos/mobile/` has 190–360 KB equivalents. Only `MobileHome` uses the mobile directory.
- Only hero videos have posters; every section/panel video paints black until decode. Emit one poster frame per clip.
- `/toolbox` has no mobile branch, so phones mount the full 6-clip desktop backdrop deck (~2.4 MB + 6 decoders) behind a text page.

### 5.2 Redundant GPU blur (biggest phone framerate win, trivial fix)

`mobile-neoflix.css:215,263` and `mobile-publications.css:232,257`: a full-viewport `filter: blur(14px)` on a *playing* video with `backdrop-filter: blur(20px)` composited on top — per frame, on sources that are **already blurred assets** (`blururgency.mp4`, …). Delete the filter, replace the backdrop-filter with a gradient fill.

### 5.3 One bundle ships everything to everyone

- `docsIndex.js:15` eager-globs all ~75 compiled docs ASTs (~400–500 KB) into the main chunk; the file's own comment says the lazy switch is a one-line change.
- All five page components are static imports, and each page statically imports **both** its mobile and desktop trees. A phone visitor to `/` parses roughly **80–85 % JS/CSS it never renders**.
- The Framer map (793 KB chunks + 942 KB SVG fetch) is correctly split behind `lazy()`, but as home section 5 it still loads on every desktop visit.
**Fix:** `eager: false` on the docs glob; `React.lazy` the routes; split mobile/desktop behind the width branch. Highest-leverage performance change in the repo.

### 5.4 Main-thread video engine and per-frame work (desktop)

- `IllustrationCanvas.jsx` replaces `<video>` with an off-DOM decoder blitted to canvas via rAF — built to suppress Edge's "enhance video" prompt and the PiP button. Cost: main-thread texture copies for every painted frame; worst case **12 live decoders / 8 concurrent blit loops** during a section transition. Consider reverting decorative decks to real `<video>` (`decorativeVideoProps.js` already suppresses PiP/remote playback) and accepting Edge's prompt.
- `ScrollSnap.jsx:257-289`: a scroll handler doing ~12 forced layout reads per event, then `setDotNavTop` → **a React render per animation frame** during scroll, feeding a `top` transition that re-targets 60×/s. Replace with an IntersectionObserver + imperative `transform`.
- `MedicalDesktopLayout.jsx:88-116`: perpetual rAF doing document-wide `querySelectorAll` + 3 `getBoundingClientRect` per frame, ×2 mounted sections, still running 4 s after the section leaves view. Run it on index change instead.
- Two stacked `HeroScrollCue` instances (`ScrollSnap.jsx:426` + `IntroSection.jsx:34`) each animate gradient stops inside an SVG `<mask>` — full mask re-rasterization per frame, doubled. Delete the duplicate; move the wave to CSS transforms.
- `RecordReflectRefine.jsx:93-103`: a 1260 ms `setInterval` retargeting two SVG-ring springs, forever — no viewport or `document.hidden` gate; it runs while you read the footer and in background tabs.
- `useTabletLayout` registers 3 window listeners + a debounce timer **per call site**; via `useTransitionNavigate` it reaches every docs-sidebar row → **~150–180 listeners on `/toolbox`**. Hoist to one `ViewportProvider`.
- `DocsSidebar.jsx:353`: the app's only capture-phase, non-passive global scroll listener, plus a ResizeObserver on every ancestor up to `<body>`.

### 5.5 Two live bugs found along the way

1. **Sections can vanish permanently.** `useSectionLifecycle.js` has no exit from `'cleaned'`: scroll past a medical slide, wait 4 s, scroll back → opacity stays 0 for the rest of the session.
2. **Sections mounted mid-resize never observe.** `ScrollSection.jsx:44-54`: if the effect first runs while `html.is-resizing` is set, the IntersectionObserver is never created and the section never reveals (the comment admits the polling fallback doesn't re-run the effect).

---

## 6. Functional gaps

### 6.1 Errors and 404s
- Add `<Route path="*">` — `DocsPage.jsx:148-162` already contains a good `NotFound` to reuse — and emit `404.html` from `build-route-html.mjs`.
- Add one `ErrorBoundary` around the route slider: today a single render throw white-screens the site (zero boundaries exist).
- Videos have no `onError`/poster fallback: a renamed file in `public/videos/` yields a silently empty section — exactly the failure a non-technical owner will cause and not see.

### 6.2 Analytics without cookies (the requested feature)

There is currently **nothing** — and, importantly, nothing that requires a banner. All four serious options below are cookieless and banner-free; pick by budget and taste:

| Option | Cost | How | Trade-off |
|---|---|---|---|
| **GoatCounter** | Free (non-commercial) | ~3.5 KB script | Recommended default for a zero-budget non-profit; spartan dashboard; open source |
| **Cloudflare Web Analytics** | Free | JS beacon | Free and easy; dashboard is basic; still sends visitor IP/UA to Cloudflare |
| **Plausible** | ~$9/mo (10k views), NP discount | 1 KB script, EU-hosted | Nicest dashboard for a client; open source |
| **Netlify Analytics** | $9/mo/site | **Server-side, zero JS** | Literally invisible to visitors, immune to ad-blockers, counts everything; tied to Netlify |

Recommendation: **GoatCounter** if free matters most; **Netlify Analytics** if $9/mo is fine and you want zero page impact and true numbers. Either involves no cookies, no consent banner, no policy change.
Sources: [Plausible on cookieless analytics](https://plausible.io/cookieless-web-analytics) · [Netlify Web Analytics docs](https://docs.netlify.com/manage/monitoring/web-analytics/overview/) · [GoatCounter](https://www.goatcounter.com/) · [2026 comparison](https://klymentiev.com/blog/best-free-analytics-2026)

### 6.3 Security headers
`netlify.toml` sets caching only. Add: `Strict-Transport-Security`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `X-Frame-Options`/`frame-ancestors`, and a CSP — which is cheap here: the app shell has exactly one external script and no inline scripts (only `og-upload.html` would need excluding). Minor related fix: the `no-cache` header rule matches only `/*.html`, so pretty routes like `/publications` get default caching for their HTML.

### 6.4 Fonts and third-party privacy
- Google Fonts is hot-linked twice — `index.html:36` **and** a render-blocking `@import` at `src/index.css:1` (a serial DNS+TLS+fetch hop; delete the `@import` regardless of what else you do). Self-hosting Inter/Montserrat removes the EU IP-disclosure issue (the pattern German courts ruled against) and two connections from the critical path.
- The Vimeo embed drops cookies once played; add `&dnt=1` to `VimeoSection.jsx:6` — a one-line change that disables Vimeo's session tracking.

### 6.5 Accessibility (top items)
- **Desktop pages have zero real headings** — `AutoFitHeading` renders `<div>`s; all six `<h1>`s on the site are on mobile/docs pages. Screen readers and content extraction see no structure on the homepage.
- No focus/scroll management on route change (`RouteSlider` moves the page; focus stays behind); no skip link; one `aria-current` in the whole app (navbar doesn't mark the active page).
- Carousel/deck controls are mostly `div onClick` (13 handlers vs 8 real buttons in the medical section); `MobileDock` is the exemplar done right — copy its pattern.
- `prefers-reduced-motion` is honored in 6 files but **not** by the two biggest systems: `RouteSlider` (full-viewport slide) and `AutoFitHeading` (2250 ms staggers).
- The teal `#62c8c9` fails contrast as text (~2.1:1) and as the focus ring in `mobile-dock.css:56`; body text at `opacity: .5–.55` in several stylesheets.
- No captions/transcripts on any video (`<track>` count: zero).

### 6.6 SEO polish (baseline is strong)
- `/contact` renders the same page as `/neoflix` with its own self-canonical and sitemap entry — duplicate content; canonicalize `/contact` → `/neoflix` or drop it from the sitemap.
- JSON-LD exists only on `/publications` + paper pages; add an `Organization`/`WebSite` node on the homepage.
- One global OG image for all 82 routes (`routeMeta` supports per-route `image` — unused). No `lastmod` in the sitemap.
- Verify `SITE_URL` (`routeMeta.js:23`, `www.neoflix.care`) matches Netlify's primary domain — every canonical depends on it; and `Footer.jsx:89` hardcodes non-www `https://neoflix.care/contact` (full page load + redirect; breaks on domain change — make it a router link).

---

## 7. Structural decisions to make (recommendations attached)

1. **The GitBook chain.** Today: GitBook → mirror repo → GitHub Action → `docs-content/` → build. Each hop is a failure point invisible to the client. If she will keep editing docs in GitBook's UI, keep the chain but document it prominently. If AI becomes the editing surface for docs too, retire GitBook and make `docs-content/` canonical markdown in this repo — the pipeline already treats it as plain files, so this is a *deletion of process*, not a migration. **Recommendation: collapse it at handoff** — one repo, one source of truth, markdown that AI edits natively. (Decide together with her.)
2. **og-upload tool.** It's an admin page shipped to production, storing its shared secret in `localStorage`, fronting a repo-write PAT, committing straight to `main`, with no rate limit. Now that AI maintains the site, "replace the OG image" is a one-sentence prompt. **Recommendation: delete the page, the Vite input, the vestigial plugin, and the Netlify function; revoke the PAT and `UPLOAD_SECRET`.** (Keeping it means at minimum: Netlify password protection + size/type validation.)
3. **`neoflix-intro-card`.** A `file:` package with one consumer, an unsatisfied peer dependency, and a 349-line dead calibration tool. **Recommendation: inline its 5 live files into `src/`, delete the package — dissolves the ERESOLVE bomb (4.6) for free.**
4. **History rewrite at handoff** (2.4). **Recommendation: yes, once, right before transfer.**
5. **Version staleness.** Node 18 (EOL) is the only urgent bump — Netlify will eventually drop the image. Vite 4 (EOL) is worth planning; React 18, framer-motion 10 (riskiest — test motion thoroughly), Tailwind 3, Router 6 are fine to defer. Don't hand her a majors-upgrade backlog and an EOL build image on day one.

---

## 8. The handoff kit (what to create)

1. **`CLAUDE.md`** — the highest-leverage file in this whole audit. Must state: the repo map; where copy lives vs where layout lives; the desktop/mobile fork and the "edit both surfaces" rule (until 4.2 is fixed); `docs-content/` is mirrored — never hand-edit (or, post-7.1, "docs live here as markdown"); `src/generated/` + `public/docs-assets/` are build output; `routeMeta.js` is the SEO surface and must stay Node-safe; the `HOME_CELLS`↔`sections` coupling; how to run (`npm run dev`) and how deploys happen.
2. **`README.md`** — install, dev, build, deploy model, where Netlify env vars live.
3. **`CONTENT.md`** — a "want to change X? → edit Y" table by page region. Non-technical owners ask by what they see, not by filename.
4. **CI** — one GitHub workflow running `bash build.sh` on PR. A build-only check catches the most common AI-editing failure (broken import, stray brace in a data file) before production.
5. **A 3-assertion smoke test** — `og-preview.png` exists; every `ROUTE_META` key emitted an HTML file; `sitemap.xml` non-empty. Would have caught finding 1.1.
6. **Prettier + minimal ESLint** — mechanical correctness where no tests exist.
7. **`LICENSE`** + KNAW Van Walree Fund credit in the footer (1.3).

---

## 9. Suggested sequence

| Phase | Work | Effort |
|---|---|---|
| **0 — Before handoff (correctness & safety)** | og-preview.png (1.1) · asset allowlist + source prune + consent decision (1.2) · LICENSE + funder credit (1.3) · delete list §2.1–2.2 · 404 route + ErrorBoundary (6.1) · security headers (6.3) · `dnt=1` + delete CSS `@import` (6.4) · fix stale netlify.toml + Node version + `npm ci` fallback (4.6) · move tracked previews out of docs-assets (4.4) | ~1–2 days |
| **1 — Cheap performance wins** | re-encode the 9.8 MB montage + `preload` (5.1) · point mobile routes at mobile encodes + posters (5.1) · delete double blur (5.2) · `eager:false` + lazy routes (5.3) · gate toolbox backdrop on phones (5.1) · fix the two §5.5 bugs · delete duplicate HeroScrollCue | ~1 day |
| **2 — Handoff kit + structure** | CLAUDE.md/README/CONTENT.md + CI + smoke test + lint (§8) · data-file renames (4.1) · unify home copy (4.2) · inline neoflix-intro-card (7.3) · analytics install (6.2) · self-host fonts (6.4) · a11y top items (6.5) | ~2–3 days |
| **3 — When convenient** | ViewportProvider (5.4) · merge cookie-cutter bands · dot-nav imperative rewrite · canvas-vs-video decision (5.4) · GitBook chain decision (7.1) · history rewrite (7.4) · Vite/Node upgrades (7.5) | opportunistic |

Everything in Phase 0–1 is low-risk and mechanical; nothing requires a redesign. The site's bones — the motion architecture, the docs pipeline, the SEO generation — are genuinely good. The cleanup is mostly *removal*: of dead branches, of a decoy data file, of 260 MB of unreferenced media, and of the scaffolding that held the frankenstein together while it was being stitched.
