# app/src/

Organised by **page**, not by file type. Everything one page of the website
needs is in that page's folder: the laptop version, the phone version, its
words and its styles, side by side.

| | |
|---|---|
| `pages/home/` | The homepage |
| `pages/neoflix/` | `/neoflix` — also serves `/contact` |
| `pages/publications/` | `/publications` and the individual paper pages |
| `pages/toolbox/` | `/toolbox` — the reader for the GitBook pages |
| `pages/not-found/` | The 404 page |
| `site/` | Everything shared: navbar, footer, the video backdrop, the motion system, per-page titles |
| `lib/` | Hooks and small helpers. Nothing here is page-specific. |
| `framer-map/` | The world map, exported from Framer — vendored, see its README |
| `generated/` | Build output. Not in git, never edit — `scripts/build-docs.mjs` rewrites it. |
| `App.jsx` | The route table: which URL renders which page |
| `main.jsx`, `index.css` | Entry point and global styles |

Each page folder follows the same shape:

```
pages/publications/
  PublicationsPage.jsx     picks the surface, laptop or phone
  PublicationsPhone.jsx    the phone version
  content.js               the words on the page
  *.css                    styles used only by this page
```

Two things about this tree that surprise people, both in `CLAUDE.md`: the
laptop and phone versions of a page are **different components**, not one
responsive layout — so a sentence can be changed in one and not the other —
and the motion system is load-bearing. Read the comments in `site/motion/`
and `site/backdrop/` before changing how anything moves.
