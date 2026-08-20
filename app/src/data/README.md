# app/src/data/

The words. If you want to change something a visitor reads, it is probably in
here. `CONTENT.md` at the repository root maps what you see on the site to the
file it lives in — that's usually a faster way in than this list.

| File | Holds |
|---|---|
| `homePage.js` | `TAGLINE` — the one sentence under the logo. It has exactly one home; never retype it elsewhere. |
| `neoflixSections.js` | The prose of the `/neoflix` page (shared by desktop and phone) |
| `neoflixPage.js` | Which backdrop video plays behind each `/neoflix` section |
| `publicationsPage.js` | The `/publications` page's prose, PDF links and bundle |
| `publicationRecords.js` | Titles, authors, abstracts, DOIs and licences. Also feeds the per-paper pages and the structured data search engines read. |
| `routeMeta.js` | Browser tab titles, search snippets and link-preview cards, per page. Adding a route here is what makes the build emit its HTML and sitemap entry. |
| `docsIndex.js` | The Toolbox's navigation tree and page loader |
| `legacySlugMap.js`, `toolboxPages.js` | Redirects from two earlier generations of Toolbox URLs, so old links still work. Not content — don't add rows. |

Homepage headlines are the exception: they live with their section, in
`../components/sections/medical/MedicalSection.data.js`, and are repeated in
phone shape in `../components/mobile/MobileHome.jsx`.

`routeMeta.js` and `publicationRecords.js` are also read by build scripts
running in plain Node, so they must not use any Vite-only syntax.
