# neoflix.care

Static site for **Neoflix** — interprofessional video review of real neonatal
procedures, developed at the Department of Neonatology, Leiden University
Medical Center. React SPA with per-route static HTML, deployed on Netlify.

## Quick start

```bash
cd frankenstein
npm install        # or: npm ci
npm run dev        # compiles the docs first, then starts Vite on :5173
```

Full production build (exactly what Netlify runs):

```bash
bash build.sh      # → dist/ at the repo root, then post-build smoke checks
```

## Repo layout

| Path | What it is |
|---|---|
| `frankenstein/` | The app: React 18 + Vite + Tailwind + framer-motion |
| `frankenstein/src/data/` | Almost all editable content (see `CONTENT.md`) |
| `frankenstein/scripts/` | Build steps: docs compiler, route-HTML/sitemap writer, publications zip, smoke checks |
| `docs-content/` | **Mirrored** GitBook markdown for `/toolbox`. Pushed here by a GitHub Action in `LennartvdM/NFLX-nieuwe-structuur`. Do not hand-edit unless that chain is retired. |
| `netlify.toml` | Headers (CSP etc.) + caching. There is deliberately no SPA rewrite — see below. |
| `build.sh` | The one build entrypoint |
| `.github/workflows/build.yml` | CI: runs `build.sh` on every push/PR |

## How routing and deploys work

Every real route gets a **physical HTML file** with its own title,
description, canonical and OG tags (`scripts/build-route-html.mjs`, driven by
`src/data/routeMeta.js`). Legacy toolbox URLs 301 via the generated
`_redirects`. Anything else falls through to `404.html` — which is the app
shell, so visitors see a styled not-found page while crawlers get a real 404.

Pushing to `main` triggers the Netlify build. A push to the docs GitBook
triggers the mirror Action in the other repo, which pushes `docs-content/`
here, which triggers a rebuild.

`scripts/build-docs.mjs` publishes **only the GitBook assets that pages
actually reference**. Unreferenced uploads in the GitBook space never reach
the public site.

## Fonts, privacy, analytics

- Inter and Montserrat are **self-hosted** (`frankenstein/public/fonts/`,
  `src/styles/fonts.css`). Don't reintroduce a Google Fonts `<link>`.
- The site sets **no cookies** and runs **no analytics**. The Vimeo embed
  uses `dnt=1`. If analytics are wanted, pick a cookieless option so no
  consent banner is needed — GoatCounter (free) or Netlify Analytics
  ($9/mo, zero client JS) are the shortlisted candidates; either is a
  one-line/zero-line install.
- Netlify environment variables: none are required. (`GITHUB_TOKEN` and
  `UPLOAD_SECRET` belonged to a removed upload tool — delete them in the
  Netlify UI and revoke the GitHub PAT if still present.)

## For maintainers working with AI

Read `CLAUDE.md` (conventions, invariants, traps) and `CONTENT.md`
("I want to change X → edit Y"). The CI build plus
`frankenstein/scripts/smoke-check.mjs` catch the most common editing
mistakes before they deploy.
