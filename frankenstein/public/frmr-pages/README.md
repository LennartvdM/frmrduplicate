# frmr-pages

Verbatim copies of the compiled Framer chunks from `frmrduplicate/site/sites/neoflix/`.

At runtime, `src/components/FrmrPageMount.jsx` dynamically imports `bootstrap.mjs` from this directory, which in turn imports a page chunk (`r-i-lvusp…mjs` for `/neoflix`, `wipgqg_rr…mjs` for `/Publications`) and mounts its default export via the bundled React + ReactDOM shipped in `chunk-5swt4qjj.mjs`.

The chunks reference `./assets/*.mp4` and `./assets/*.woff2`. Those paths resolve against the host page URL (not this directory), so the referenced files are duplicated into `frankenstein/public/assets/`.

Do not edit these files by hand — regenerate by copying from `frmrduplicate/site/sites/neoflix/`.
