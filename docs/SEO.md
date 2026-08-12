# SEO

The site is a React SPA. Everything below exists because search engines,
social unfurlers and AI crawlers do not all run JavaScript, and the ones that
do still prefer not to.

## The problem this replaced

Every URL served the same file. `netlify.toml` had a `/* → /index.html 200`
catch-all, so `/toolbox/level-2-in-action/refine` and `/publications` and a
typo'd URL all returned the *homepage's* HTML: one `<title>`, one description,
a canonical pointing at `/`, and an empty `<div id="root">`. A crawler that did
not execute the bundle saw no content at all on any of the ~78 URLs, and one
that did still saw a canonical claiming every page was the homepage. A
mistyped URL returned `200 OK` — a soft 404, which search engines have to
guess about. There was no sitemap and no robots.txt.

## How it works now

`build.sh` runs three steps:

```
node scripts/build-docs.mjs     docs-content/ (GitBook mirror) → AST JSON
npx vite build --outDir ../dist  the SPA bundle
node scripts/prerender.mjs       one HTML document per URL
```

`prerender.mjs` reads the built `dist/index.html` as a template and, for each
of the 78 routes, writes `dist/<route>/index.html` with:

- that URL's own title, description, canonical, Open Graph and Twitter tags
- a JSON-LD `@graph` (Organization + WebSite, plus BreadcrumbList / Article /
  FAQPage / ItemList where they apply)
- a static, readable copy of the page inside `#root`

It also writes `sitemap.xml`, `robots.txt`, `404.html` and `_redirects`.

Netlify serves `/toolbox/foo` from `toolbox/foo/index.html` (pretty URLs), so
no redirect rule is involved and **there is deliberately no SPA catch-all any
more**. Unmatched paths get `404.html` with a real 404 status. That page still
boots the SPA, so a URL the router can resolve client-side still lands the
visitor on the right page while crawlers get the honest status code.

### The two markers

`frankenstein/index.html` contains:

```html
<!--seo:head-->  … default (homepage) tags …  <!--/seo:head-->
<div id="root"><!--seo:body--></div>
```

The prerenderer replaces the contents of both per route. **Do not hand-edit the
tags between the head markers** — they are overwritten on every build. The copy
lives in `src/seo/siteMeta.js`.

If `prerender.mjs` reports a missing `<!--seo:body-->` marker, it was run twice
without a rebuild in between and read its own output as the template. Re-run
`npx vite build --outDir ../dist` first.

### Where things live

| File | Role |
| --- | --- |
| `src/seo/siteMeta.js` | Per-route titles/descriptions, canonical rules, URL helpers. **Single source of truth.** Imported by both the browser and Node. |
| `src/seo/structuredData.js` | JSON-LD builders |
| `src/seo/astText.js` | Plain-text and FAQ extraction from the docs AST; heading slugs |
| `src/seo/DocumentHead.jsx` | Keeps `<head>` correct across client-side navigations |
| `scripts/prerender.mjs` | The build step |
| `scripts/lib/astToHtml.mjs` | Docs AST → static HTML |
| `scripts/og/og-card.html` | Source artwork for `public/og-preview.png` |

`src/seo/*` and the data modules it reads must stay importable by plain Node —
no browser globals, no `import.meta.glob`, and **explicit `.js` extensions on
relative imports**. That is why `src/utils/assetUrl.js` guards
`import.meta.env` and why `src/data/*.js` import `../utils/assetUrl.js` with
the extension.

### Prerendered content is not cloaking

The static copy inside `#root` is the same copy the app renders, from the same
data. `main.jsx` clears it the moment React mounts. Nothing is shown to a
crawler that a visitor would not see — the point is to make the page readable
*before* the bundle lands, not to say something different.

### Adding a route

1. Add it to `STATIC_ROUTES` in `src/seo/siteMeta.js` with a title and
   description.
2. If it has body copy worth indexing, add it to `sectionsByRoute` in
   `prerender.mjs`.
3. Rebuild and confirm the page count goes up.

Toolbox pages need nothing — they are enumerated from the docs manifest.

### Adding a docs AST node type

`scripts/lib/astToHtml.mjs` and `src/components/docs/DocsNode.jsx` are
hand-maintained twins over the same node types. A new type added in
`build-docs.mjs` must be handled in **both** or it renders nowhere.

## Verifying a build

```bash
bash build.sh
find dist -name index.html | wc -l                                    # 78
grep -c '<loc>' dist/sitemap.xml                                      # 77 (/contact is canonicalised away)
grep -rho '<title>[^<]*' --include=index.html dist | sort -u | wc -l   # 78 — all distinct
grep -rho 'name="description" content="[^"]*"' --include=index.html dist | sort -u | wc -l  # 78
```

## What still needs the site owner

These cannot be done from the repo:

1. **Keep `neoflix.care` as the primary domain** in the Netlify UI. It is the
   apex today, with `www.neoflix.care` redirecting to it, and `SITE_ORIGIN` in
   `src/seo/siteMeta.js` matches that. Netlify performs the redirect at the
   platform layer, so nothing in `netlify.toml` can substitute for it — and if
   the primary is ever switched to `www`, `SITE_ORIGIN` has to move with it or
   every canonical, `og:url` and sitemap entry will point at a redirect.
2. **Google Search Console and Bing Webmaster Tools** — verify the property
   (DNS TXT, or drop the HTML verification file in `frankenstein/public/`) and
   submit `https://neoflix.care/sitemap.xml`.
3. **Re-scrape the social cards** once deployed, via the LinkedIn Post
   Inspector and X card validator. `og-preview.png` never existed before this
   change, so every previously shared link is cached with a broken image.
4. **Replace `og-preview.png`** if you want different artwork — either edit
   `scripts/og/og-card.html` and re-render, or use the existing uploader at
   `/og-upload.html`.
5. **Upstream GitBook fixes** in `LennartvdM/NFLX-nieuwe-structuur`, since
   `docs-content/` is a read-only mirror here: 9 figures have empty `alt`
   text, 2 headings are empty, and 18 page titles carry a numeric prefix that
   contradicts their own slug (`11.-lets-neoflix` titled "7. Let's Neoflix").
   The sidebar is correct — those come from `SUMMARY.md` — but the article
   `<h1>`, the prev/next labels and each page's `<title>` inherit the stale
   number.

## Known, not done

Deliberate omissions, with reasons:

- **No `twitter:site` / `twitter:creator`.** No handles exist anywhere in the
  repo, and wrong tags are worse than absent ones.
- **No hreflang.** Only worth adding alongside an actual translation.
- **Docs images carry no `width`/`height`,** so they can shift layout as they
  load. Fixing it means probing image dimensions in `build-docs.mjs`. Four of
  74 pages have images; the largest is a 3.3 MB PNG at the top of
  `level-2-in-action/record` which `Figure.jsx` also lazy-loads despite being
  above the fold.
- **Page-weight work not attempted:** the world map mounts eagerly on the
  desktop homepage (~520 kB gzip of JS + SVG before anyone scrolls to it);
  `docsIndex.js` welds all 74 compiled doc pages into the entry chunk
  (~70 kB gzip) via an eager `import.meta.glob`; three identical copies of
  `worldmap.svg` (942 kB each) ship, of which one is used; and
  `public/videos/mobile/` holds ~12 MB of video nothing references. None of
  these are SEO defects as such, but Core Web Vitals is a ranking input and
  the first two are felt by every visitor.
