/**
 * collect — first-party, cookieless pageview endpoint.
 *
 * Reached at /api/collect (see the redirect in netlify.toml). The browser side
 * is frankenstein/src/analytics/index.js.
 *
 * What this stores: per-day counters, and nothing else. A pageview increments
 * a number in a bucket for its path, its referring host, its viewport class
 * and its language. There is no row per visit, no identifier, no IP address,
 * no user-agent string, and no hashed stand-in for any of those — so there is
 * nothing here that could later be joined back to a person, and no "unique
 * visitors" figure either. That is the deliberate trade: a visitor count would
 * mean deriving a per-visitor key from IP + user-agent, which is exactly the
 * processing this endpoint exists to avoid.
 *
 * The connecting IP is visible to this function the way it is to any HTTP
 * request. It is never read and never written.
 *
 * Concurrency: Netlify Blobs has no atomic increment, so writes use the
 * conditional-write support instead — read the day's counters with their ETag,
 * merge, and write back only if the ETag still matches. A losing write retries
 * against the newer value rather than clobbering it.
 */
import { getStore } from '@netlify/blobs';

const STORE = 'analytics';
const MAX_ATTEMPTS = 6;

/** Cap the cardinality of every bucket so one crawler cannot balloon a day. */
const MAX_KEYS_PER_BUCKET = 500;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

/** Keep only what we intend to store, in the shape we intend to store it. */
function sanitize(payload) {
  const path = String(payload?.p || '')
    .split(/[?#]/)[0]
    .slice(0, 200);
  if (!path.startsWith('/')) return null;

  const referrer = String(payload?.r || '')
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '')
    .slice(0, 100);

  const viewport = ['mobile', 'tablet', 'desktop'].includes(payload?.v) ? payload.v : 'unknown';
  const language = String(payload?.l || '')
    .toLowerCase()
    .replace(/[^a-z-]/g, '')
    .slice(0, 5);

  return { path, referrer, viewport, language };
}

function emptyDay(date) {
  return { date, views: 0, paths: {}, referrers: {}, viewports: {}, languages: {} };
}

function bump(bucket, key) {
  if (!key) return;
  if (bucket[key] === undefined && Object.keys(bucket).length >= MAX_KEYS_PER_BUCKET) return;
  bucket[key] = (bucket[key] || 0) + 1;
}

export default async (req) => {
  if (req.method !== 'POST') return json(405, { error: 'POST only' });

  let payload;
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'invalid JSON' });
  }

  const event = sanitize(payload);
  if (!event) return json(400, { error: 'invalid payload' });

  const date = new Date().toISOString().slice(0, 10);
  const key = `day/${date}`;

  let store;
  try {
    store = getStore(STORE);
  } catch (err) {
    // getStore throws when the Blobs environment is not wired up. Say so in one
    // greppable line rather than leaving a bare stack in the function log — this
    // is the failure that is hardest to tell apart from "no traffic yet".
    console.error(`[analytics] Netlify Blobs unavailable (getStore): ${err?.message || err}`);
    return json(500, { error: 'blobs unavailable' });
  }

  try {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt += 1) {
      const existing = await store.getWithMetadata(key, { type: 'json', consistency: 'strong' });
      const day = existing?.data || emptyDay(date);

      day.views += 1;
      bump(day.paths, event.path);
      bump(day.referrers, event.referrer || 'direct');
      bump(day.viewports, event.viewport);
      bump(day.languages, event.language);

      const conditions = existing?.etag ? { onlyIfMatch: existing.etag } : { onlyIfNew: true };
      const result = await store.setJSON(key, day, conditions);
      if (result.modified) return new Response(null, { status: 204 });

      // Someone else wrote first. Back off a little and merge against their value.
      await new Promise((resolve) => setTimeout(resolve, 15 * (attempt + 1)));
    }
  } catch (err) {
    console.error(`[analytics] Blobs read/write failed for ${key}: ${err?.message || err}`);
    return json(500, { error: 'blobs write failed' });
  }

  // Contention we could not resolve. Losing one pageview is the right outcome
  // here — far better than retrying forever or overwriting a concurrent write.
  return new Response(null, { status: 204 });
};

// Deliberately no `export const config = { path: … }`.
//
// Declaring a custom path here would have this function and the `/api/*` rewrite
// in netlify.toml both claiming /api/collect, and a declared path can replace
// the function's default /.netlify/functions/collect route — which is what that
// rewrite targets. Whichever of the two the platform evaluates first, the other
// becomes either redundant or a rewrite pointing at nothing. One mechanism, the
// long-stable one: the rewrite maps /api/* onto the default function path.
