# Analytics without a cookie banner

The site measures traffic without storing anything on the visitor's device, so
there is nothing for a consent banner to ask about. This document explains what
is collected, why no banner is needed, and how to read the numbers or swap the
whole thing for a hosted product.

## What is running

Two halves, both first-party:

| Piece | File | Job |
| --- | --- | --- |
| Browser | `frankenstein/src/analytics/index.js` | Builds and sends the pageview |
| Route hook | `frankenstein/src/analytics/usePageviews.js` | Fires one per client-side navigation |
| Endpoint | `netlify/functions/collect.mjs` | Increments per-day counters in Netlify Blobs |
| Read-back | `netlify/functions/stats.mjs` | Returns the counters as JSON |

Nothing is loaded from a third-party domain, so no other company sees your
visitors.

## What is collected

Per pageview, four fields:

- **path** — `/toolbox/welcome/quick-start`, query string stripped
- **referrer host** — `google.com`, host only. A full referrer URL can carry
  search terms and session tokens; the host cannot.
- **viewport class** — `mobile` / `tablet` / `desktop`, matching the app's own
  breakpoints. Exact window dimensions are one of the strongest fingerprinting
  signals there is, so they are bucketed before they leave the browser.
- **language** — `en`, `nl-be`

These land as counters in one JSON blob per day: `{ views, paths: {…},
referrers: {…}, viewports: {…}, languages: {…} }`. There is no row per visit.

## What is deliberately *not* collected

- No cookie, no `localStorage`, no `sessionStorage`, no cache-based identifier.
- No IP address. The connecting IP is visible to the function the way it is to
  any HTTP request, and it is never read and never written.
- No user-agent string.
- **No unique-visitor count.** This is the one real cost of the design. Every
  cookieless product that reports "unique visitors" — Plausible included —
  derives a per-visitor key by hashing IP + user-agent with a salt they rotate
  daily. That is defensible and widely done, but it *is* processing personal
  data to build an identifier, which is the thing this endpoint exists to
  avoid. You get pageviews, not people.

## Why there is no consent banner

Two separate questions get conflated here, and it is worth keeping them apart.

**Storage.** ePrivacy Article 5(3) — the "cookie law", implemented in the
Netherlands as Telecommunicatiewet Art. 11.7a — attaches a consent requirement
to *storing information on, or gaining access to information stored in, the
terminal equipment of a subscriber*. This module stores nothing and reads
nothing back. That requirement is not triggered, which is why there is no
banner. It is not an exemption being claimed; the trigger simply is not met.

**Processing.** GDPR still applies to any personal data processed, which for a
web request means the IP address, transiently, in transit. This endpoint does
not record it, and stores no field that could identify a person or be joined
back to one — so what is retained is aggregate, non-personal data.

That is the reasoning, not legal advice. If the site ever needs to be certain,
the questions worth putting to a DPO are: what does the endpoint retain, and
can any retained field single out a person? For this design the answers are
"per-day counters" and "no".

The site does use `sessionStorage` for one non-analytics thing: which homepage
slide to return to (`scrollsnap:return-section`, set in `Navbar.jsx`). That is
functional state for a navigation the visitor just asked for, not a tracking
identifier, and it clears when the tab closes.

**Do Not Track and Global Privacy Control are honoured.** A visitor with either
set sends nothing at all. Localhost, `.local` and `*.netlify.app` are skipped
too, so development and deploy-preview traffic never reaches production
counters.

Worth knowing: most hosted vendors do *not* honour DNT/GPC by default, so these
numbers will read systematically lower than the same site measured with one of
them — every Brave, DuckDuckGo and DNT-enabled Firefox visitor is dropped. That
is a deliberate choice and easy to reverse (delete the `optedOut()` check in
`src/analytics/index.js`), but it should be reversed knowingly.

## Reading the numbers

Set `ANALYTICS_STATS_TOKEN` in the Netlify site environment
(**Site configuration → Environment variables**) to any long random string.
Until you do, `/api/stats` refuses every request — it fails closed rather than
serving the data to whoever guesses the URL.

```bash
curl -H "Authorization: Bearer $TOKEN" 'https://www.neoflix.care/api/stats?days=30'
```

```json
{
  "window": { "days": 30, "from": "2026-07-12", "to": "2026-08-10" },
  "totals": {
    "views": 1284,
    "paths": { "/": 402, "/toolbox/welcome/quick-start": 96 },
    "referrers": { "direct": 700, "google.com": 310 },
    "viewports": { "desktop": 890, "mobile": 394 },
    "languages": { "en": 1100, "nl": 184 }
  },
  "daily": [{ "date": "2026-08-10", "views": 51 }]
}
```

There is no dashboard UI. If you want one, the JSON is the thing to build it
from — or switch to a hosted product below.

## Switching to a hosted product

The browser module is provider-agnostic. Set these in the Netlify environment
and redeploy; no code changes.

| Variable | Meaning |
| --- | --- |
| `VITE_ANALYTICS_PROVIDER` | `firstparty` (default), `script`, or `none` |
| `VITE_ANALYTICS_SCRIPT` | `script` mode: URL of the hosted beacon |
| `VITE_ANALYTICS_SITE` | `script` mode: your site/domain id |

`script` mode injects the beacon and then stands aside. That only works for
vendors whose own script patches the History API, since this site never
reloads between pages:

| Vendor | Hosting | Price | Works in `script` mode |
| --- | --- | --- | --- |
| **Plausible** | EU (Germany) | ~€9/mo | yes |
| **Simple Analytics** | Netherlands | ~€9/mo | yes |
| **Umami Cloud** | EU region | free tier | yes |
| **Fathom** | EU isolation | ~$15/mo | yes |
| **Cloudflare Web Analytics** | US processor | free | **no** — needs a JSON `data-cf-beacon` attribute rather than the two id attributes this module sets |
| **GoatCounter** | EU | free (non-commercial) | **no** — needs an explicit `count()` per navigation; without it a 74-page docs site records one pageview per visit |

Either of the last two would need a small branch added to
`injectScript()`. Do not just point `VITE_ANALYTICS_SCRIPT` at them and assume
it works.

Prices and hosting jurisdictions above come from vendor documentation and were
not verifiable from the environment this was written in — confirm before
signing anything.

Two things worth knowing before switching:

- All of these see your visitors' IP addresses at their edge, because they have
  to in order to serve the request. The ones that report unique visitors derive
  a daily-rotating hash from IP + user-agent. That is a different trade from the
  first-party setup above — not necessarily a worse one, but a real one.
- "Cookieless" does not mean "touches no storage". Plausible's tracker reads
  `localStorage.plausible_ignore` and Umami's reads `umami.disabled` — opt-out
  flags, read not written. Choose on jurisdiction, price and hosting rather than
  on that distinction.

Set `VITE_ANALYTICS_PROVIDER=none` to turn all measurement off.

## Operational notes

- **Cost.** One function invocation and one Blobs read/write per pageview.
  Netlify's free tier covers 125k function invocations a month.
- **Concurrency.** Blobs has no atomic increment, so `collect.mjs` uses
  conditional writes: read the day's counters with their ETag, merge, write back
  only if the ETag still matches, retry on conflict. Simultaneous pageviews
  cannot silently overwrite each other. After six failed attempts it drops the
  pageview rather than looping — losing one view beats corrupting the day.
- **Cardinality.** Each bucket stops accepting new keys at 500 entries, so a
  crawler hitting thousands of junk URLs cannot balloon a day's blob.
- **Ad blockers.** `/api/collect` is first-party and not on any filter list
  today, so it is counted where a third-party beacon would be blocked. A
  blocklist could add it at any time; that is the nature of the thing.
- **Failure mode.** Every send is wrapped so that a failing endpoint can never
  break the page. Measurement failing silently is the intended behaviour.
