# SEO and analytics

Two things live here: how per-route SEO is produced for a client-rendered
SPA, and how the cookieless analytics work.

---

## 1. SEO

### The problem this solves

The site is a React SPA behind a `/* → /index.html` rewrite. Every URL used
to serve one identical document, so all 79 pages shared a single title,
description, canonical URL and social card. Google can render JavaScript and
would eventually work it out; Bing's fallback path, the Slack / LinkedIn / X
link unfurlers, and most AI crawlers do not run JavaScript at all and simply
saw the home page 79 times.

### How it works now

`frankenstein/scripts/prerender-seo.mjs` runs after `vite build` (wired into
both `build.sh` and the `postbuild` npm script). For every route it writes a
real file into `dist/`:

```
dist/index.html
dist/neoflix/index.html
dist/publications/index.html
dist/contact/index.html
dist/toolbox/index.html
dist/toolbox/<slug>/index.html      × 73
```

Each carries that route's own `<title>`, description, canonical, OpenGraph
and Twitter tags, JSON-LD, and a `<noscript>` block containing the page's
real text. Netlify serves a matching static file in preference to a
non-forced redirect, so these take over from the SPA fallback automatically —
the app itself boots exactly as before.

It also emits:

- **`dist/sitemap.xml`** — 77 URLs (every route except `/contact`, which
  canonicalises to `/neoflix`).
- **`dist/robots.txt`** — allows everything except the internal tooling, and
  points at the sitemap.
- **`dist/_redirects`** — 148 forced `301`s from the legacy
  `PascalDashCase` toolbox slugs to their path-based equivalents, then the
  SPA fallback last.

> The SPA catch-all lives in `_redirects` rather than `netlify.toml` on
> purpose: Netlify applies `netlify.toml` redirects *before* `_redirects`, so
> a `/*` rule in the toml would shadow every 301 underneath it.

### Editing the copy

Titles and descriptions for the hand-authored routes are in
**`frankenstein/src/seo/siteMeta.js`** — that is the only file to edit.

Toolbox pages take their title from the GitBook page and their description
from frontmatter `description:` when present, otherwise from the page's own
opening paragraph (only 14 of 74 pages have frontmatter descriptions). To
control one explicitly, add a description to that page's frontmatter in the
GitBook source repo.

### Client-side navigation

`frankenstein/src/seo/Seo.jsx` re-applies the same tags when React Router
changes route without a document load. It mutates the tags the prerenderer
wrote rather than appending new ones, so nothing accumulates while routing
around. Unknown `/toolbox/...` slugs render `noindex`.

### What you still need to do

1. Submit `https://www.neoflix.care/sitemap.xml` in
   [Google Search Console](https://search.google.com/search-console) and
   [Bing Webmaster Tools](https://www.bing.com/webmasters).
2. That's it — everything else is automatic on each deploy.

---

## 2. Analytics

Cookieless, so **no consent banner is required**.

### What is collected

Per pageview: the path, the referrer *hostname* (only when it is another
site), whether the pageview started a visit, and a device bucket
(mobile/tablet/desktop, from viewport width). Plus time-on-page when you
leave. The country comes from Netlify's edge geo, from which nothing is
stored but a two-letter code.

### What is not

No cookie. No `localStorage`, no `sessionStorage`, no fingerprint — nothing
is read from or written to the visitor's device, which is precisely what the
ePrivacy consent rule is about, and precisely why there is no banner.

Nothing personal is stored server-side either: no IP address, no user-agent
string, and no visitor identifier of any kind — not even a hashed or salted
one. Every request folds into per-day counters and is then forgotten. There
is no record that could be traced back to a person even in principle.

`navigator.globalPrivacyControl` is honoured as an opt-out anyway.

Because there is no visitor identifier, **"visits" is an estimate**: a
pageview arriving from outside the site counts as someone showing up, and
in-app navigation afterwards does not. Someone returning twice in a day
counts twice.

### Reading the numbers

1. In Netlify → **Site configuration → Environment variables**, add
   `ANALYTICS_TOKEN` set to any long random string.
2. Redeploy.
3. Open `https://www.neoflix.care/analytics.html` and paste the token.

The dashboard shows pageviews, visits, average time on page, a per-day
chart, and top pages / referrers / countries / devices. The token is held in
memory only — the admin page stores nothing either, so you re-enter it after
a reload.

Until `ANALYTICS_TOKEN` is set, `/api/stats` returns a 503 telling you so.
Collection works regardless.

### How it is built

| File | Role |
| --- | --- |
| `frankenstein/src/analytics/index.js` | Browser beacon, fired on route change |
| `netlify/functions/event.mjs` | `POST /api/event` — folds one event into the day's counters |
| `netlify/functions/stats.mjs` | `GET /api/stats` — token-guarded rollup |
| `netlify/lib/analytics.mjs` | Pure aggregation logic |
| `scripts/test-analytics.mjs` | Unit tests — `npm run test:analytics` |
| `frankenstein/public/analytics.html` | Dashboard |

Storage is Netlify Blobs: one small JSON object per UTC day per shard,
holding counters only. Traffic from `localhost` and from Netlify deploy
previews is not counted.

**On the pinned `@netlify/blobs` version.** It is pinned to exactly `9.1.5`
rather than a range. Every release from `9.1.6` up pulls in `@netlify/dev-utils`,
which depends on `image-size`, which carries two unpatched high-severity
DoS advisories (`GHSA-w3rx-r6r6-pgpr`, `GHSA-5p2g-fcmc-qvqq` — flagged for
*all* published versions, so there is nothing to upgrade to). `9.1.5` keeps
`npm audit` clean.

The cost is that `9.1.5` has no conditional writes, so updating a counter is
a read-modify-write that two simultaneous visitors could collide on. Each
day's counters are therefore spread over 8 shards, each writer picking one at
random, which makes a collision roughly 8× rarer; the read side sums them.
`event.mjs` already passes `onlyIfMatch`/`onlyIfNew` and honours the returned
`modified` flag, so **once `image-size` ships a fix, bumping the pin turns the
remaining races off with no other change.**

### Using Plausible or Umami instead

All the third-party options below are also cookieless. Set these Netlify
environment variables and redeploy — no code change:

| Variable | Values |
| --- | --- |
| `VITE_ANALYTICS_PROVIDER` | `firstparty` (default) · `plausible` · `umami` · `none` |
| `VITE_PLAUSIBLE_DOMAIN` | e.g. `neoflix.care` — required for `plausible` |
| `VITE_UMAMI_ID` | website ID — required for `umami` |
| `VITE_UMAMI_SRC` | optional, for self-hosted Umami |

Route changes are reported manually in all three cases, so SPA navigation is
tracked correctly rather than guessed at.

A fourth option needs no code at all: **Netlify Analytics** ($9/mo, in the
Netlify UI) counts requests server-side, so there is no script on the page
whatsoever. It cannot see SPA route changes or custom events, and it counts
bots.
