/**
 * event.mjs — the cookieless analytics beacon.
 *
 * Netlify Function v2. Reached as POST /api/event (rewritten in
 * netlify.toml) and answered with 204 no matter what: the browser sends
 * this with `navigator.sendBeacon` during page teardown, so there is
 * nobody left to read an error, and a failing analytics call must never
 * become a visible problem on the site.
 *
 * Storage is one Netlify Blobs object per UTC day holding nothing but
 * counters. See ../lib/analytics.mjs for exactly what is and is not
 * recorded — the short version is that no cookie, no device storage, no
 * IP address and no visitor identifier is involved anywhere in the path.
 */
import { getStore } from '@netlify/blobs';

import {
  applyEvent,
  dayKey,
  emptyDay,
  parseEvent,
  randomShard,
  shardKey,
} from '../lib/analytics.mjs';

const STORE = 'analytics';
const MAX_BODY_BYTES = 2048;
const WRITE_ATTEMPTS = 4;

const noContent = () =>
  new Response(null, {
    status: 204,
    headers: {
      'Cache-Control': 'no-store',
      // The beacon is same-origin; being explicit stops a stray
      // cross-origin caller from believing it succeeded.
      'Access-Control-Allow-Origin': 'null',
    },
  });

/**
 * Read-modify-write one shard of the day's counters.
 *
 * The pinned SDK writes unconditionally and returns undefined, so this
 * is last-write-wins within a shard — see the SHARDS note in
 * ../lib/analytics.mjs for why that is acceptable and how sharding keeps
 * it rare. The conditional options and the retry loop are already here,
 * so a later SDK that supports compare-and-swap upgrades this to a real
 * CAS without any further change.
 */
async function record(store, day, event, now) {
  const key = shardKey(day, randomShard());
  for (let attempt = 0; attempt < WRITE_ATTEMPTS; attempt += 1) {
    const existing = await store.getWithMetadata(key, { type: 'json' }).catch(() => null);
    const current = existing?.data || emptyDay(day);
    const next = applyEvent({ ...current, day }, event, now);

    const options = existing?.etag ? { onlyIfMatch: existing.etag } : { onlyIfNew: true };
    const result = await store.setJSON(key, next, options);

    // SDKs without conditional writes return undefined — the write has
    // already happened, so there is nothing to retry.
    if (!result || typeof result.modified !== 'boolean' || result.modified) return true;
  }
  return false;
}

export default async (request, context) => {
  if (request.method === 'OPTIONS') return noContent();
  if (request.method !== 'POST') return noContent();

  let body;
  try {
    const raw = await request.text();
    if (!raw || raw.length > MAX_BODY_BYTES) return noContent();
    body = JSON.parse(raw);
  } catch {
    return noContent();
  }

  const selfHosts = [new URL(request.url).hostname, 'neoflix.care', 'www.neoflix.care'];
  const event = parseEvent(body, {
    country: context?.geo?.country?.code,
    selfHosts,
  });
  if (!event) return noContent();

  try {
    const store = getStore({ name: STORE, consistency: 'strong' });
    const now = new Date();
    await record(store, dayKey(now), event, now);

  } catch (error) {
    // Losing a pageview is strictly less bad than a noisy failure on a
    // request the visitor never asked for. Log it for the build/function
    // log and move on.
    console.error('[analytics] write failed:', error?.message || error);
  }

  return noContent();
};

export const config = { path: '/api/event' };
