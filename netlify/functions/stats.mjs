/**
 * stats — reads back what collect.mjs recorded.
 *
 *   GET /api/stats?days=30
 *   Authorization: Bearer <ANALYTICS_STATS_TOKEN>     (or ?token=<…>)
 *
 * Fails closed: with no ANALYTICS_STATS_TOKEN configured in the Netlify site
 * environment the endpoint refuses every request rather than serving the
 * numbers to anyone who guesses the URL.
 *
 * Returns JSON — daily totals plus a merged summary over the window.
 */
import { getStore } from '@netlify/blobs';

const STORE = 'analytics';
const DEFAULT_DAYS = 30;
const MAX_DAYS = 365;

const json = (status, body) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });

function presentedToken(req) {
  const header = req.headers.get('authorization') || '';
  const bearer = header.match(/^Bearer\s+(.+)$/i);
  if (bearer) return bearer[1].trim();
  return new URL(req.url).searchParams.get('token') || '';
}

/** Constant-time-ish compare so the token cannot be recovered a byte at a time. */
function tokensMatch(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function mergeInto(target, source) {
  for (const [key, value] of Object.entries(source || {})) {
    target[key] = (target[key] || 0) + value;
  }
}

function topN(bucket, n = 50) {
  return Object.fromEntries(
    Object.entries(bucket)
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
  );
}

export default async (req) => {
  const expected = process.env.ANALYTICS_STATS_TOKEN;
  if (!expected) {
    return json(503, {
      error: 'ANALYTICS_STATS_TOKEN is not set on this site, so stats are unavailable.',
    });
  }
  if (!tokensMatch(presentedToken(req), expected)) return json(401, { error: 'unauthorized' });

  const url = new URL(req.url);
  const days = Math.min(Math.max(parseInt(url.searchParams.get('days') || DEFAULT_DAYS, 10) || DEFAULT_DAYS, 1), MAX_DAYS);

  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - (days - 1));
  const cutoffKey = `day/${cutoff.toISOString().slice(0, 10)}`;

  const store = getStore(STORE);
  const { blobs } = await store.list({ prefix: 'day/' });
  const wanted = blobs.map((blob) => blob.key).filter((key) => key >= cutoffKey).sort();

  const daily = await Promise.all(
    wanted.map((key) => store.get(key, { type: 'json' }).catch(() => null))
  );

  const summary = { views: 0, paths: {}, referrers: {}, viewports: {}, languages: {} };
  for (const day of daily) {
    if (!day) continue;
    summary.views += day.views || 0;
    mergeInto(summary.paths, day.paths);
    mergeInto(summary.referrers, day.referrers);
    mergeInto(summary.viewports, day.viewports);
    mergeInto(summary.languages, day.languages);
  }

  return json(200, {
    window: { days, from: cutoffKey.slice(4), to: new Date().toISOString().slice(0, 10) },
    totals: {
      views: summary.views,
      paths: topN(summary.paths),
      referrers: topN(summary.referrers, 30),
      viewports: summary.viewports,
      languages: topN(summary.languages, 20),
    },
    daily: daily
      .filter(Boolean)
      .map((day) => ({ date: day.date, views: day.views })),
  });
};

// No custom `config.path` — see the note at the foot of collect.mjs. Routing for
// both functions comes from the single /api/* rewrite in netlify.toml.
