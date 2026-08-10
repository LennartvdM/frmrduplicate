/**
 * stats.mjs — read side of the cookieless analytics.
 *
 * Netlify Function v2, reached as GET /api/stats. Returns the rolled-up
 * counters for the last N days as JSON, for /analytics.html to render.
 *
 * Guarded by the ANALYTICS_TOKEN environment variable. The numbers are
 * aggregate and contain nothing personal, but they are the site owner's
 * business rather than the public's, and an open read endpoint would
 * also be an open invitation to scrape it on a loop.
 */
import { timingSafeEqual } from 'node:crypto';

import { getStore } from '@netlify/blobs';

import { dayFromKey, emptyDay, mergeShards, recentDays, summarise } from '../lib/analytics.mjs';

const STORE = 'analytics';
const MAX_DAYS = 90;
const DEFAULT_DAYS = 30;

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Constant-time compare that does not leak the expected length. */
function tokenMatches(provided, expected) {
  if (typeof provided !== 'string' || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function presentedToken(request) {
  const header = request.headers.get('authorization') || '';
  const bearer = header.match(/^Bearer\s+(.+)$/i);
  if (bearer) return bearer[1].trim();
  return new URL(request.url).searchParams.get('token');
}

export default async (request) => {
  if (request.method !== 'GET') return json(405, { error: 'GET only' });

  const expected = process.env.ANALYTICS_TOKEN;
  if (!expected) {
    return json(503, {
      error:
        'ANALYTICS_TOKEN is not set. Add it under Site configuration → Environment variables in Netlify, then redeploy.',
    });
  }
  if (!tokenMatches(presentedToken(request), expected)) {
    return json(401, { error: 'Bad or missing token.' });
  }

  const url = new URL(request.url);
  const requested = Number(url.searchParams.get('days'));
  const days = Number.isFinite(requested)
    ? Math.min(MAX_DAYS, Math.max(1, Math.trunc(requested)))
    : DEFAULT_DAYS;

  try {
    const store = getStore({ name: STORE, consistency: 'strong' });
    const wanted = new Set(recentDays(days));

    // One list call, then fetch only the shards that actually exist —
    // cheaper than probing every day × shard combination, most of which
    // are empty on a site this size.
    const { blobs } = await store.list();
    const keys = (blobs || [])
      .map((blob) => blob.key)
      .filter((key) => wanted.has(dayFromKey(key)));

    const records = await Promise.all(
      keys.map((key) => store.get(key, { type: 'json' }).catch(() => null))
    );
    const merged = mergeShards(records.filter(Boolean));

    // Days with no traffic have no blob at all; put them back as zeroes
    // so the chart shows the gap instead of closing over it.
    const byDay = new Map(merged.map((record) => [record.day, record]));
    const series = recentDays(days).map((day) => byDay.get(day) || emptyDay(day));

    return json(200, { days, ...summarise(series) });
  } catch (error) {
    return json(500, { error: `Could not read analytics: ${error?.message || error}` });
  }
};

export const config = { path: '/api/stats' };
