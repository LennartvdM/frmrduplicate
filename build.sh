#!/usr/bin/env bash
set -e

echo "=== Neoflix combined build ==="

OUT="dist"
rm -rf "$OUT"
mkdir -p "$OUT"

# 1. Landing page (static)
echo "--- Copying landing page ---"
cp landing/index.html "$OUT/index.html"

# 2. Build bashtest (Vite SPA) — set base path for subdirectory deploy
echo "--- Building bashtest ---"
cd bashtest
npm ci --prefer-offline 2>/dev/null || npm install
# Skip prebuild (git rev-parse) since we're building from parent dir
echo "dev" > src/version.txt
VITE_BASE=/bashtest/ npx vite build --outDir "../$OUT/bashtest"
cd ..

# 3. Build frankenstein (Vite SPA)
echo "--- Building frankenstein ---"
cd frankenstein
npm ci --prefer-offline 2>/dev/null || npm install
VITE_BASE=/frankenstein/ npx vite build --outDir "../$OUT/frankenstein"
cd ..

# 4. Copy frmrduplicate (static site from site/ directory)
echo "--- Copying frmrduplicate ---"
cp -r frmrduplicate/site "$OUT/frmrduplicate"

# 5. Copy neoflixexporttest (static HTML)
echo "--- Copying neoflixexporttest ---"
cp -r neoflixexporttest "$OUT/neoflixexporttest"
# Remove .git artifacts and node_modules if any snuck in
rm -rf "$OUT/neoflixexporttest/.git" "$OUT/neoflixexporttest/node_modules"

echo "=== Build complete → $OUT/ ==="
ls -la "$OUT/"
