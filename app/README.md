# app/

The website's source. Everything the visitor sees is built from here.

| | |
|---|---|
| `src/` | The code — start at `src/README.md` |
| `public/` | Files served exactly as they are: videos, paper PDFs, fonts, icons |
| `scripts/` | The four build steps — see `scripts/README.md` |
| `index.html` | The single page everything mounts into |
| `vite.config.js`, `tailwind.config.js`, `postcss.config.cjs` | Build tooling |

```bash
npm ci        # install (needs Node 22)
npm run dev   # http://localhost:5173
```

For a production build use `bash build.sh` from the repository root, not
`vite build` from here — the root script also compiles the Toolbox, writes
one HTML file per route, and runs the smoke checks.
