#!/usr/bin/env bash
#
# verify-deploy.sh — check a deployed Neoflix site end to end.
#
#   ./scripts/verify-deploy.sh https://deploy-preview-12--neoflixduplicate.netlify.app
#   ./scripts/verify-deploy.sh https://neoflix.care "$ANALYTICS_STATS_TOKEN"
#
# Everything here is a serving behaviour that cannot be checked from the build
# output alone: status codes, redirect rules, function routing and the Blobs
# write. Run it against a deploy preview before merging, and against production
# after.
#
# The token argument is optional. Without it the two checks that read analytics
# back are skipped rather than failed.
#
# Exits non-zero if any check fails.

set -uo pipefail

BASE="${1:-}"
TOKEN="${2:-}"

if [ -z "$BASE" ]; then
  echo "usage: $0 <base-url> [stats-token]" >&2
  exit 2
fi
BASE="${BASE%/}"

pass=0; fail=0; skip=0

ok()   { printf '  \033[32mPASS\033[0m  %s\n' "$1"; pass=$((pass+1)); }
bad()  { printf '  \033[31mFAIL\033[0m  %s\n         expected: %s\n         got:      %s\n' "$1" "$2" "$3"; fail=$((fail+1)); }
note() { printf '  \033[33mSKIP\033[0m  %s — %s\n' "$1" "$2"; skip=$((skip+1)); }

echo
echo "Verifying $BASE"
echo

# ── the SEO change: does each URL serve its own document? ──────────────────
echo "Per-URL documents"

home_title=$(curl -fsS "$BASE/" 2>/dev/null | grep -o '<title>[^<]*' | head -1 | sed 's/<title>//')
doc_title=$(curl -fsS "$BASE/toolbox/welcome/quick-start" 2>/dev/null | grep -o '<title>[^<]*' | head -1 | sed 's/<title>//')

if [ -z "$doc_title" ]; then
  bad "toolbox page serves a document" "a <title>" "nothing — is the site up?"
elif [ "$doc_title" = "$home_title" ]; then
  bad "toolbox page has its own title" "a toolbox title" "the homepage's: $doc_title"
else
  ok "toolbox page has its own title — $doc_title"
fi

canonical=$(curl -fsS "$BASE/toolbox/welcome/quick-start" 2>/dev/null | grep -o 'rel="canonical" href="[^"]*"' | sed 's/.*href="//;s/"//')
case "$canonical" in
  https://neoflix.care/toolbox/welcome/quick-start) ok "canonical points at the apex" ;;
  "") bad "canonical present" "a canonical link" "none" ;;
  *)  bad "canonical points at the apex" "https://neoflix.care/toolbox/welcome/quick-start" "$canonical" ;;
esac

# ── crawl plumbing ────────────────────────────────────────────────────────
echo
echo "Crawl plumbing"

# No -f here: it makes curl exit non-zero on a 404, which is the answer we want.
code=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE/definitely-not-a-real-page")
if [ "$code" = "404" ]; then ok "unknown path returns a real 404"
else bad "unknown path returns a real 404" "404" "$code (a soft 404 — the SPA catch-all is back?)"; fi

redir=$(curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' "$BASE/toolbox/Quick-Start")
case "$redir" in
  301*welcome/quick-start) ok "legacy slug 301s to the canonical URL" ;;
  *) bad "legacy slug 301s" "301 → …/toolbox/welcome/quick-start" "$redir" ;;
esac

locs=$(curl -fsS "$BASE/sitemap.xml" 2>/dev/null | grep -c '<loc>')
if [ "$locs" = "77" ]; then ok "sitemap lists 77 URLs"
else bad "sitemap lists 77 URLs" "77" "$locs"; fi

if curl -fsS "$BASE/robots.txt" 2>/dev/null | grep -q "Sitemap: https://neoflix.care/sitemap.xml"; then
  ok "robots.txt points at the sitemap"
else
  bad "robots.txt points at the sitemap" "Sitemap: https://neoflix.care/sitemap.xml" "missing"
fi

img=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE/og-preview.png")
if [ "$img" = "200" ]; then ok "og-preview.png is served"
else bad "og-preview.png is served" "200" "$img"; fi

# ── analytics ─────────────────────────────────────────────────────────────
echo
echo "Analytics"

probe="/verify-$(date -u +%H%M%S)"
collect=$(curl -sS -o /dev/null -w '%{http_code}' -X POST "$BASE/api/collect" \
  -H 'content-type: application/json' \
  -d "{\"p\":\"$probe\",\"r\":\"\",\"v\":\"desktop\",\"l\":\"en\"}")

case "$collect" in
  204) ok "/api/collect accepted a pageview" ;;
  404) bad "/api/collect is reachable" "204" "404 — the /api/* rewrite in netlify.toml is not firing" ;;
  500) bad "/api/collect wrote to Blobs" "204" "500 — check the function log for [analytics]" ;;
  *)   bad "/api/collect accepted a pageview" "204" "$collect" ;;
esac

if [ -z "$TOKEN" ]; then
  note "/api/stats returns the pageview" "no token given"
  note "/stats dashboard loads" "no token given"
else
  body=$(curl -sS -H "authorization: Bearer $TOKEN" "$BASE/api/stats?days=1")
  case "$body" in
    *"$probe"*) ok "/api/stats reports the pageview just sent — the Blobs round trip works" ;;
    *ANALYTICS_STATS_TOKEN*) bad "/api/stats is configured" "counters" "503 — the env var is not set on the site" ;;
    *unauthorized*) bad "/api/stats accepts the token" "counters" "401 — wrong token, or not scoped to Functions" ;;
    *) bad "/api/stats reports the pageview" "$probe in paths" "$(printf '%s' "$body" | head -c 120)" ;;
  esac

  dash=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE/stats")
  if [ "$dash" = "200" ]; then ok "/stats dashboard is served"
  else bad "/stats dashboard is served" "200" "$dash"; fi
fi

# ── summary ───────────────────────────────────────────────────────────────
echo
printf '  %d passed, %d failed' "$pass" "$fail"
[ "$skip" -gt 0 ] && printf ', %d skipped' "$skip"
echo
echo
[ "$fail" -eq 0 ] || exit 1
