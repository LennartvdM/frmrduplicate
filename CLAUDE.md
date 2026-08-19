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
7. **Media quality is deliberate — measure before you re-encode.**
   A blanket compression pass over these clips was tried and reverted:
   CRF≈30 posterized the gradients (see AUDIT.md). Two clips
   (`Blursskills.mp4`, `mobile/neoflix_intro_blur_montage.mp4`) are
   already artefact-free and near-optimally encoded — re-encoding them
   at ANY setting measurably *loses* quality and, for the montage,
   produces a bigger file. Leave them alone.

   The other five backdrop loops went through a deliberate pass that
   exploits the fact that they are heavily blurred by design: an extra
   gaussian blur is imperceptible on already-blurred footage, but it
   is a low-pass filter, so it erases compression artefacts (which are
   high-frequency) and leaves the encoder almost nothing to waste bits
   on. Blur in 10-bit and dither down, so the smoothing doesn't cause
   banding:

   ```bash
   ffmpeg -i in.mp4 -an \
     -vf "format=yuv420p10le,gblur=sigma=2.5,format=yuv420p" \
     -c:v libx264 -preset veryslow -crf 18 \
     -x264-params "aq-mode=3:psy-rd=0.3" \
     -pix_fmt yuv420p -movflags +faststart out.mp4
   ```

   That gained +10.5 to +12.8 dB of artefact-freeness at 33–86% of the
   original size. Before applying it to any clip, measure whether the
   clip needs it — a whole-clip self-vs-blur PSNR under ~60 dB means
   real artefacts, over ~70 dB means it is already clean and you would
   only add generation loss:

   ```bash
   ffmpeg -i clip.mp4 -filter_complex \
     "split[a][b];[a]gblur=sigma=1[ab];[b][ab]psnr" -f null -
   ```

   Never apply this to the sharp foreground clips (`urgency`, `focus`,
   `coordination`, `skills`, `team`, `perspectives`) — blurring real
   detail is visible immediately. Keep the backdrops at 720x426 and the
   foreground clips at their native resolutions.

   Constrained visitors get stills instead of video via
   `utils/reducedMedia.js` (prefers-reduced-motion / Save-Data / low
   device memory). If a clip changes, regenerate its still so the two
   match: `ffmpeg -ss 1.5 -i clip.mp4 -frames:v 1 -c:v libwebp
   -quality 88 stills/<name>.webp`. New media keeps posters and
   `preload="metadata"`. Don't reintroduce a Google Fonts link (fonts
   are self-hosted) and don't remove `dnt=1` from the Vimeo URL.

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
