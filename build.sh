#!/usr/bin/env bash
set -e

echo "=== Frankenstein build ==="

OUT="dist"
rm -rf "$OUT"

# docs-content/ is mirrored into this repo by a GitHub Action in
# LennartvdM/NFLX-nieuwe-structuur (.github/workflows/mirror.yml).
# It lives here as regular tracked files. Do not edit by hand.

cd frankenstein
npm ci --prefer-offline 2>/dev/null || npm install
# Transform docs-content/ (GitBook mirror) → compiled AST JSON + assets
node scripts/build-docs.mjs
npx vite build --outDir "../$OUT"
cd ..

echo "=== Build complete → $OUT/ ==="
ls -la "$OUT/"
