# CONTENT.md — "I want to change X" → edit Y

Lookup table by what you see on the site. Paths are under `app/`
unless noted. After editing, `bash build.sh` from the repo root must pass.

## Homepage (desktop, ≥600px wide)

| What you see | Where it lives |
|---|---|
| Tagline under the logo ("Improve patient care…") | `TAGLINE` in `src/data/homePage.js` (one string, used everywhere) |
| The animated "Record / Reflect / Refine" headline words | `src/components/intro/RecordReflectRefine.jsx` (`WORDS`) |
| The two story sections' headlines, captions, carousel copy | `src/components/sections/medical/MedicalSection.data.js` — keyed `pressure` (the problem) and `reflection` (the answer). **Also update the phone version, next table** |
| Section videos (blur + clean clips) | `public/videos/*.mp4`, mapped in `MedicalSection.data.js`. Replacing a clip? Read CLAUDE.md rule 7 first, and regenerate its still in `public/videos/stills/`. |
| World-map city stories | `src/components/sections/worldmap/` |
| Footer names, credits, KNAW funding line | `src/components/Footer.jsx` |

## Homepage (phone, <600px)

| What you see | Where it lives |
|---|---|
| Hero lines + label | `src/components/mobile/MobileHome.jsx` top constants |
| Story panels (same sentences as desktop sections 2–3) | `MOBILE_PANELS` in `src/components/mobile/MobileHome.jsx` — **keep in step with `MedicalSection.data.js`** |
| Panel videos/posters | `public/videos/mobile/` |

## /neoflix (and /contact, which is the same page)

| What you see | Where it lives |
|---|---|
| All section prose + titles (both desktop and phone) | `src/data/neoflixSections.js` |
| Phone-only hero ("Record. Reflect. Refine." + subtitle, intro band) | `src/components/mobile/MobileNeoflixPage.jsx` — search the file for the sentence you want to change |
| Section backdrop videos / accent colors | desktop: `src/data/neoflixPage.js`; phone: map at top of `MobileNeoflixPage.jsx` |

## /publications

| What you see | Where it lives |
|---|---|
| Section prose, PDF links, bundle | `src/data/publicationsPage.js` |
| Titles, authors, abstracts, DOIs, licences (also feeds paper pages + JSON-LD) | `src/data/publicationRecords.js` |
| The PDFs themselves | `public/papers/` (swap a file under the same name to correct it) |
| Preview thumbnails on article cards | `public/previews/` |
| Phone-only hero ("Articles" + subtitle) | `src/components/mobile/MobilePublicationsPage.jsx` — search the file for `<h1>Articles</h1>` |

## /toolbox (the guide)

All pages are markdown in `docs-content/` — **but that directory is mirrored
from GitBook** (repo `LennartvdM/NFLX-nieuwe-structuur`). Edit in GitBook, or
retire the mirror first (AUDIT.md §7.1). Only images/files actually linked
from a page are published.

## Browser tab titles, search snippets, link previews

| What | Where |
|---|---|
| Title + description per page (Google, LinkedIn cards) | `src/data/routeMeta.js` |
| The share image | `public/og-preview.png` (commit a new 1200×630 PNG under the same name) |
| Favicon / app icons | `public/favicon.svg` + PNGs in `public/` |

## Adding a page

Add the route in `src/App.jsx`, an entry in `src/data/routeMeta.js` (this
also puts it in the sitemap and gives it an HTML file), and a link in
`src/components/Navbar.jsx` / `Footer.jsx` if it should be reachable from
the chrome.
