# neoflix.care

Static site for **Neoflix** — interprofessional video review of real neonatal
procedures, developed at the Department of Neonatology, Leiden University
Medical Center. React SPA with per-route static HTML, deployed on Netlify.

Three companion docs, in the order you'll want them:

- **`CONTENT.md`** — "I want to change X → edit Y", by what you see on the site.
- **`CLAUDE.md`** — the conventions and invariants. Read before changing code.
- **`AUDIT.md`** — the 2026-08 architecture/performance audit and what remains open.

## Requirements

**Node 22.** Netlify (`netlify.toml`) and CI both pin it, and the build is
run with `npm ci`, so a different major will either fail the install or
produce a build that doesn't match production.

## Quick start

```bash
cd app
npm ci                       # npm install also works; CI and Netlify use ci
npm run dev                  # http://localhost:5173
```

`npm run dev` runs two build steps first (`predev`): it compiles
`docs-content/` into the toolbox's JSON, and bundles the publication PDFs
into a zip. Both write into ignored output directories — see *Generated
output* below.

Full production build — exactly what Netlify runs:

```bash
bash build.sh                # from the repo root → dist/, then smoke checks
```

Run the post-build assertions on their own:

```bash
node app/scripts/smoke-check.mjs --out dist
```

**Run `bash build.sh` before pushing anything non-trivial.** It compiles
everything, regenerates the per-route HTML, and runs seven assertions that
catch the structural breakage a compile can't see (missing share image, a
route with no HTML file, an empty sitemap, a stray Google Fonts link).

## Repo layout

| Path | What it is |
|---|---|
| `app/` | The app: React 18 + Vite 4 + Tailwind 3 + framer-motion 10, React Router 6 |
| `app/src/data/` | Almost all editable content (see `CONTENT.md`) |
| `app/src/components/mobile/` | The phone tree — a *separate* set of components (see *Two surfaces*) |
| `app/src/backdrop/` | The persistent video backdrop behind every route |
| `app/src/framer-map/` | The world map, exported from Framer as compiled chunks. Vendored, not hand-written — patch via CSS overrides in `src/index.css`, not by editing the chunks. |
| `app/scripts/` | The four build steps: docs compiler, publications zip, route-HTML/sitemap writer, smoke checks |
| `app/public/` | Media served as-is: videos, stills, paper PDFs, fonts, icons |
| `docs-content/` | **Mirrored** GitBook markdown for `/toolbox`. Pushed here by a GitHub Action in `LennartvdM/NFLX-nieuwe-structuur`. Do not hand-edit unless that chain is retired. |
| `netlify.toml` | Node version, security headers (strict CSP), caching. Deliberately no SPA rewrite — see below. |
| `build.sh` | The one build entrypoint |
| `.github/workflows/build.yml` | CI: runs `build.sh` on every PR and on pushes to `main` |

### Generated output — never commit, never hand-edit

| Path | Written by |
|---|---|
| `dist/` | `build.sh` (gitignored) |
| `app/src/generated/` | `scripts/build-docs.mjs` — the compiled toolbox pages |
| `app/public/docs-assets/` | `scripts/build-docs.mjs` — GitBook images and attachments |
| `app/public/papers/neoflix-publications.zip` | `scripts/build-publications-zip.mjs` |

Hand-placed images belong in `public/previews/` or another tracked directory —
anything dropped into the paths above is overwritten on the next build.

## Two surfaces

Home, `/neoflix` and `/publications` each render **either a desktop tree or a
phone tree**, forked at `600px`, as separate lazy chunks. They are different
components, not one responsive layout.

The practical consequence: **a copy change on the homepage has to be made
twice** — desktop headlines live in `MedicalSection.data.js`, the same
sentences in phone shape live in `MOBILE_PANELS` in `MobileHome.jsx`. Both
files carry warning comments. `CONTENT.md` lists which pages share their
section data and which don't.

## How routing and deploys work

Every real route gets a **physical HTML file** with its own title,
description, canonical and OG tags (`scripts/build-route-html.mjs`, driven by
`src/data/routeMeta.js`). Adding a route to `routeMeta.js` is what makes the
build emit its HTML and its sitemap entry.

Legacy toolbox URLs 301 via the generated `_redirects` (two generations of
them). Anything else falls through to `404.html` — which is the app shell, so
visitors see the styled not-found page while crawlers get a genuine 404
status. That only works because there is **no `/* → /index.html` rewrite** in
`netlify.toml`; don't add one.

Pushing to `main` triggers the Netlify build. Editing the docs in GitBook
triggers the mirror Action in the other repo, which pushes `docs-content/`
here, which triggers a rebuild.

`scripts/build-docs.mjs` publishes **only the GitBook assets that pages
actually reference**. Unreferenced uploads in the GitBook space never reach
the public site.

## Media

The video encodes are deliberate and were arrived at by measurement — a
blanket compression pass was tried and reverted because it posterized the
gradients. **`CLAUDE.md` rule 7 is the rulebook: read it before re-encoding
anything**, including which clips are already optimal and must be left alone.

Visitors who ask for less get less: `utils/reducedMedia.js` swaps the
backdrop videos for stills when the browser reports `prefers-reduced-motion`,
Save-Data, or low device memory. Every clip therefore has a matching still in
`public/videos/stills/` — if a clip changes, regenerate its still so the two
agree. The stills look unreferenced to a plain text search because their
paths are built at runtime from the clip's filename.

## Privacy

- **No cookies, no analytics, nothing that needs a consent banner.** Keep it
  that way: if analytics are ever wanted, it has to be a cookieless option.
  GoatCounter (free) and Netlify Analytics ($9/mo, zero client JS) are the
  shortlisted candidates. Still an open decision — `AUDIT.md` §6.2.
- Inter and Montserrat are **self-hosted** (`public/fonts/`,
  `src/styles/fonts.css`). Don't reintroduce a Google Fonts `<link>` — the
  CSP forbids it and a smoke check fails the build if one appears.
- The only third-party iframe is the Vimeo player, and its URL carries
  `dnt=1`. Don't remove it.

## Netlify

- Build command `bash build.sh`, publish directory `dist`, Node 22 — all set
  in `netlify.toml`, not in the Netlify UI.
- **No environment variables are required.** `GITHUB_TOKEN` and
  `UPLOAD_SECRET` belonged to an upload tool that has been removed; delete
  them in the Netlify UI and revoke the GitHub PAT if either is still there.

## Verifying a change

1. `bash build.sh` must pass — it includes the smoke checks.
2. For visual changes, screenshot against a static server on `dist/` at
   1440×900 and 390×844. The two surfaces are different trees: check the one
   you touched, or both when the change is shared.
3. CI runs the same build on every PR.
