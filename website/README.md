# website/

Everything the site is built from. Organised by **page**, not by file type:
everything one page needs is in that page's folder — the laptop version, the
phone version, its words and its styles, side by side.

| | |
|---|---|
| `pages/home/` | The homepage |
| `pages/neoflix/` | `/neoflix` — also serves `/contact` |
| `pages/publications/` | `/publications` and the individual paper pages |
| `pages/toolbox/` | `/toolbox` — the reader for the GitBook pages |
| `pages/not-found/` | The 404 page |
| `shared/` | Used by every page: navbar, footer, the video backdrop, the motion system, per-page titles |
| `lib/` | Hooks and small helpers. Nothing here is page-specific. |
| `public/` | Files served exactly as they are: videos, paper PDFs, fonts, icons |
| `scripts/` | The four build steps — see `scripts/README.md` |
| `framer-map/` | The world map, exported from Framer — vendored, see its README |
| `generated/` | Build output. Not in git, never edit. |
| `App.jsx` | The route table: which URL renders which page |
| `main.jsx`, `index.css`, `index.html` | Entry point and global styles |

Every page folder follows the same shape:

```
pages/publications/
  PublicationsPage.jsx     picks the surface, laptop or phone
  PublicationsPhone.jsx    the phone version
  content.js               the words on the page
  *.css                    styles used only by this page
```

```bash
npm ci        # install (needs Node 22)
npm run dev   # http://localhost:5173
```

For a production build use `bash build.sh` from the repository root, not
`vite build` from here — the root script also compiles the Toolbox, writes one
HTML file per route, and runs the smoke checks.

Two things about this tree that surprise people, both written up in
`CLAUDE.md`: the laptop and phone versions of a page are **different
components**, not one responsive layout — so a sentence can be changed in one
and not the other — and the motion system is load-bearing. Read the comments in
`shared/motion/` and `shared/backdrop/` before changing how anything moves.
