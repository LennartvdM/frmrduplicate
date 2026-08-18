# CLAUDE.md — working on neoflix.care

This repo is maintained conversationally ("AI as CMS"): the owner describes a
change, you find the right file and make it. This file is the map and the
rulebook. `CONTENT.md` is the content lookup table; `README.md` covers build
and deploy. A full architecture/performance audit lives in `AUDIT.md`
(2026-08; its Phase 0–2 findings are implemented).

## Commands

```bash
cd frankenstein && npm run dev     # dev server (builds docs first)
bash build.sh                      # full production build → dist/ + smoke checks
node frankenstein/scripts/smoke-check.mjs --out dist   # assertions alone
```

Always run `bash build.sh` before pushing a non-trivial change — it compiles
everything, regenerates route HTML, and runs the smoke assertions.

## Where things live

- **Content** → `frankenstein/src/data/` (see `CONTENT.md` for the per-page
  table). Toolbox content → `docs-content/` markdown (but see the mirror rule).
- **Pages** → `src/pages/`. Each of Home/Neoflix/Publications renders a
  desktop tree or a mobile tree (`< 600px`) — separate lazy chunks.
- **Motion system** → `RouteSlider` (page slide), `BackdropProvider`
  (persistent video backdrop), `ScrollSnap` + `SectionManager` +
  `ScrollSection` (desktop home), `TransitionContext` (shared direction
  state). It is deliberate and documented in-file; read before changing.
- **SEO surface** → `src/data/routeMeta.js`, consumed by BOTH
  `hooks/useDocumentMeta.js` (runtime) and `scripts/build-route-html.mjs`
  (build). It must stay **Node-safe**: no `import.meta.env`, no Vite-only
  imports. Same constraint for `src/data/publicationRecords.js`.

## Hard rules

1. **`docs-content/` is a mirror.** A GitHub Action in
   `LennartvdM/NFLX-nieuwe-structuur` overwrites it from GitBook. Edits made
   here can be silently reverted by the next mirror push. Edit docs in
   GitBook, or retire the chain first (decision documented in AUDIT.md §7.1).
2. **`src/generated/` and `public/docs-assets/` are build output.** Never
   hand-edit; never commit files into them. Hand-placed images belong in
   `public/previews/` or another tracked directory.
3. **Copy changes on the homepage must hit BOTH surfaces.** Desktop
   headlines: `src/components/sections/medical/MedicalSection.data.js`.
   Phone panels (same sentences, different shape):
   `src/components/mobile/MobileHome.jsx` (`MOBILE_PANELS`). The files
   carry warning comments. `/neoflix` and `/publications` share section
   data between surfaces, but their phone files have their own hero
   strings near the top.
4. **The tagline has one home**: `TAGLINE` in `src/data/homePage.js`.
   Never retype the sentence elsewhere.
5. **Naming history trap**: `src/data/neoflixSections.js` (the `/neoflix`
   page content) was called `publications.js` until 2026-08 and old
   references may linger in conversation history. The real `/publications`
   content is `publicationsPage.js`; bibliographic facts are
   `publicationRecords.js`.
6. **`HOME_CELLS` in `src/backdrop/BackdropProvider.jsx` mirrors the
   `sections` array in `src/pages/DesktopHome.jsx` by position.** Changing
   one requires changing the other.
7. **Media quality is deliberate — do NOT re-compress the backdrops.**
   The blurred backdrop clips and the phone montage ship at the owner's
   original encodes; pushing them to CRF≈30 posterizes the gradients
   (that mistake and its revert are documented in AUDIT.md). The cheap
   path for constrained visitors is `utils/reducedMedia.js`: webp
   stills in `public/videos/stills/` replace the loops under
   prefers-reduced-motion / Save-Data / low device memory. If a clip
   changes, regenerate its still (`ffmpeg -ss 1.5 -i clip.mp4
   -frames:v 1 -c:v libwebp -quality 88 stills/<name>.webp`). New
   media keeps posters and `preload="metadata"`. Don't reintroduce a
   Google Fonts link (fonts are self-hosted) and don't remove `dnt=1`
   from the Vimeo URL.
8. **No cookies, no analytics without an explicit cookieless choice** —
   the site's privacy posture is "no banner needed" and it should stay so.
9. **Netlify config**: there is intentionally NO `/* → /index.html`
   rewrite. Every route is a physical file; unknown paths must 404 via
   `404.html`. New routes need an entry in `routeMeta.js` (that alone makes
   the build emit the HTML and sitemap entry).

## Verifying changes

- `bash build.sh` must pass (includes smoke checks).
- For visual changes, screenshot with Playwright against a static server on
  `dist/` at 1440×900 and 390×844 — mobile and desktop are different trees;
  check the one you touched (or both when the change is shared).
- CI (`.github/workflows/build.yml`) runs the same build on every PR.
