# website/pages/

One folder per page of the website. To change something a visitor sees, this
is almost always where to start — `CONTENT.md` at the repository root maps
what's on screen to the file it lives in.

| Folder | URL |
|---|---|
| `home/` | `/` |
| `neoflix/` | `/neoflix` and `/contact` (the same page, scrolled to a different place) |
| `publications/` | `/publications` and `/publications/<paper>` |
| `toolbox/` | `/toolbox` and everything under it |
| `not-found/` | anything else |

Each folder holds both surfaces — the laptop version and the phone version —
plus that page's words (`content.js`) and its styles. Whatever is used by more
than one page lives in `../shared/` instead.

`App.jsx` one level up is the list of which URL renders which of these.
