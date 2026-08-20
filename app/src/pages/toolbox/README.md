# app/src/pages/toolbox/

The reader for `/toolbox`. **The text of those pages isn't here** — it's
markdown in `docs-content/` at the repository root, mirrored automatically
from GitBook. Edit the words in GitBook; edit how they look here.

| | |
|---|---|
| `ToolboxPage.jsx` | The page: sidebar, article, contents rail |
| `DocsSidebar.jsx` | The navigation tree, including the tab that marks the current page |
| `DocsNode.jsx` | Turns the compiled markdown into React |
| `blocks/` | GitBook's own block types: callouts, tabs, cards, file downloads, the world map embed |
| `docsIndex.js` | The navigation tree and the page loader |
| `docs.css` | Everything the reader looks like |
| `legacySlugMap.js`, `legacyGitbookUrls.js` | Redirects from two earlier generations of Toolbox URLs, so old links still work. Not content — don't add rows. |

Two rules from `CLAUDE.md` apply here in particular: the whole toolbox loads
as **one** bundle (rule 12 — splitting it per page makes it visibly reload on
every click), and bare-element CSS under `.docs-body` can leak into the
embedded world map (rule 10).
