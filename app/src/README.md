# app/src/

| | |
|---|---|
| `main.jsx`, `App.jsx` | Entry point and the route table |
| `data/` | **The words.** Almost every editable sentence on the site — see `data/README.md` |
| `pages/` | One file per route, desktop version |
| `components/mobile/` | One file per route, phone version — a *separate* tree, see its README |
| `components/` | Everything shared: navbar, footer, the scroll-snap machinery, the story sections |
| `components/docs/` | The Toolbox reader (`/toolbox`) |
| `backdrop/` | The video backdrop that persists behind every route |
| `framer-map/` | The world map, exported from Framer — vendored, see its README |
| `hooks/`, `contexts/`, `utils/` | Shared behaviour |
| `styles/`, `index.css` | Styling that isn't Tailwind utility classes |
| `generated/` | Build output. Not in git, never edit — `scripts/build-docs.mjs` rewrites it. |

Two things about this tree that surprise people, both explained in
`CLAUDE.md`: the homepage exists twice (desktop and phone are different
components, not one responsive layout), and the motion system is load-bearing
— read the comments in `RouteSlider`, `ScrollSnap` and `backdrop/` before
changing how anything moves.
