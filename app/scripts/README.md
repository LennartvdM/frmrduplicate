# app/scripts/

The four steps `build.sh` runs, in order. Each is plain Node — no bundler, no
framework — so any of them can be run on its own while debugging.

| Script | Does |
|---|---|
| `build-docs.mjs` | Turns the mirrored GitBook markdown in `docs-content/` into the Toolbox's compiled pages, and copies across **only the images and attachments a page actually links to** |
| `build-publications-zip.mjs` | Bundles the paper PDFs into the single archive the Publications page offers |
| `build-route-html.mjs` | Gives every route its own HTML file with the right title, description and link-preview tags, then writes the sitemap, `robots.txt`, `404.html` and the redirects for old URLs. Driven by `src/data/routeMeta.js`. |
| `smoke-check.mjs` | Seven assertions against the finished build. Fails the deploy rather than shipping a site that compiled but is broken. |

`build-route-html.mjs` must run *after* Vite, because it rewrites the HTML
Vite emits.

The smoke checks exist because each one encodes a mistake that actually
shipped — the share image every page pointed at was missing for months, and
nothing noticed. If you find a new class of silent breakage, add an assertion
here.
