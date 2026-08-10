/**
 * analytics.mjs — pure aggregation logic for the cookieless analytics
 * endpoints. Kept free of Netlify imports so it can be unit-tested with
 * plain Node (see scripts/test-analytics.mjs).
 *
 * WHAT IS AND ISN'T COLLECTED
 *
 * Nothing is written to the visitor's device: no cookies, no
 * localStorage, no sessionStorage, no device fingerprint. Nothing that
 * identifies a person is written on the server either — no IP address,
 * no user-agent string, no per-visitor identifier of any kind, not even
 * a hashed one. Every request folds into per-day counters and is then
 * forgotten, so there is no record that could be traced back to an
 * individual even in principle.
 *
 * That is what keeps the site out of consent-banner territory: the ePrivacy
 * rule is about reading from or writing to the user's terminal equipment,
 * and this reads and writes nothing.
 *
 * "Visits" are therefore an estimate, not a device count: a pageview
 * whose referrer is not this site is treated as someone arriving, and
 * subsequent in-app navigations are not. That over-counts anyone who
 * returns later in the day and under-counts nothing important.
 */

/** Ceilings on stored cardinality — a bloated day blob is the only real
 *  abuse vector on an open write endpoint, so every dimension is capped
 *  and overflow is counted under a single "other" bucket. */
export const LIMITS = {
  paths: 400,
  referrers: 200,
  countries: 250,
  pathLength: 128,
  refLength: 96,
};

export const DEVICES = ['mobile', 'tablet', 'desktop'];

/**
 * A day's counters are spread over this many blobs, each writer picking
 * one at random.
 *
 * The pinned @netlify/blobs (9.1.5) has no conditional writes, so a
 * counter update is read-modify-write and two writers landing in the
 * same ~100ms window would have one overwrite the other. Sharding makes
 * that roughly SHARDS times less likely for the price of summing a few
 * objects on read. Later versions of the SDK do support compare-and-swap
 * — event.mjs already passes the options and honours the `modified`
 * flag, so raising the pin turns the remaining races off for free.
 */
export const SHARDS = 8;

/** UTC day key, e.g. "2026-08-10". */
export function dayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Blob key for one shard of one day, e.g. "2026-08-10/3". */
export function shardKey(day, shard) {
  return `${day}/${shard}`;
}

/** Pick a shard at random. */
export function randomShard() {
  return Math.floor(Math.random() * SHARDS);
}

/** The day part of a shard key, or null if the key isn't one of ours. */
export function dayFromKey(key) {
  const match = /^(\d{4}-\d{2}-\d{2})\/\d+$/.exec(key || '');
  return match ? match[1] : null;
}

export function emptyDay(day) {
  return {
    day,
    views: 0,
    visits: 0,
    paths: {},
    referrers: {},
    countries: {},
    devices: { mobile: 0, tablet: 0, desktop: 0 },
    duration: { samples: 0, totalMs: 0 },
    updated: null,
  };
}

/** Normalise a pathname: strip query/hash, collapse slashes, cap length. */
export function cleanPath(input) {
  if (typeof input !== 'string') return null;
  const path = input.split(/[?#]/)[0].trim();
  if (!path.startsWith('/')) return null;
  const collapsed = path.replace(/\/{2,}/g, '/');
  const trimmed = collapsed.length > 1 ? collapsed.replace(/\/+$/, '') : '/';
  if (trimmed.length > LIMITS.pathLength) return null;
  // Reject control characters — nothing legitimate contains them and
  // they would corrupt the dashboard's rendering.
  if (/[\u0000-\u001f\u007f]/.test(trimmed)) return null;
  return trimmed;
}

/**
 * Reduce a referrer to its bare hostname. Full referrer URLs can carry
 * search terms and identifiers in their query string, so only the host
 * is ever stored.
 */
export function cleanReferrer(input, selfHosts = []) {
  if (typeof input !== 'string' || !input) return null;
  let host;
  try {
    host = new URL(input).hostname.toLowerCase();
  } catch {
    return null;
  }
  if (!host) return null;
  const bare = host.replace(/^www\./, '');
  if (selfHosts.some((self) => bare === self.replace(/^www\./, ''))) return null;
  if (bare.length > LIMITS.refLength) return null;
  return bare;
}

export function cleanDevice(input) {
  return DEVICES.includes(input) ? input : 'desktop';
}

export function cleanCountry(input) {
  if (typeof input !== 'string') return null;
  const code = input.trim().toUpperCase();
  return /^[A-Z]{2}$/.test(code) ? code : null;
}

/** Increment `map[key]`, folding into "other" once the cap is reached. */
function bump(map, key, cap) {
  if (key == null) return;
  if (map[key] === undefined && Object.keys(map).length >= cap) {
    map.other = (map.other || 0) + 1;
    return;
  }
  map[key] = (map[key] || 0) + 1;
}

/**
 * Fold one validated event into a day record. Returns a new object;
 * never mutates `day`, so a failed conditional write can simply be
 * retried against freshly-read state.
 */
export function applyEvent(day, event, now = new Date()) {
  const next = {
    ...emptyDay(day?.day || dayKey(now)),
    ...day,
    paths: { ...(day?.paths || {}) },
    referrers: { ...(day?.referrers || {}) },
    countries: { ...(day?.countries || {}) },
    devices: { ...emptyDay().devices, ...(day?.devices || {}) },
    duration: { ...emptyDay().duration, ...(day?.duration || {}) },
  };

  if (event.type === 'end') {
    // Duration pings carry no new pageview — they only refine the
    // average time spent on a page.
    if (Number.isFinite(event.ms) && event.ms > 0) {
      next.duration.samples += 1;
      // One tab left open overnight would otherwise swamp the mean.
      next.duration.totalMs += Math.min(event.ms, 30 * 60 * 1000);
    }
    next.updated = now.toISOString();
    return next;
  }

  next.views += 1;
  if (event.entry) next.visits += 1;
  bump(next.paths, event.path, LIMITS.paths);
  if (event.entry && event.referrer) bump(next.referrers, event.referrer, LIMITS.referrers);
  bump(next.countries, event.country, LIMITS.countries);
  next.devices[cleanDevice(event.device)] += 1;
  next.updated = now.toISOString();
  return next;
}

/**
 * Validate and normalise a raw beacon body. Returns null when the
 * payload is unusable, which the endpoint answers with 204 anyway —
 * a beacon is fire-and-forget and must never surface an error to a
 * visitor's browser.
 */
export function parseEvent(body, { country, selfHosts }) {
  if (!body || typeof body !== 'object') return null;

  const type = body.t === 'end' ? 'end' : 'view';
  if (type === 'end') {
    const ms = Number(body.ms);
    if (!Number.isFinite(ms) || ms <= 0) return null;
    return { type: 'end', ms: Math.round(ms) };
  }

  const path = cleanPath(body.p);
  if (!path) return null;

  const referrer = cleanReferrer(body.r, selfHosts);
  return {
    type: 'view',
    path,
    referrer,
    // The client marks a pageview as an entry when it did not come from
    // one of our own pages; that is the visit proxy described above.
    entry: body.e === 1 || body.e === true,
    device: cleanDevice(body.d),
    country: cleanCountry(country),
  };
}

/**
 * Fold the shards belonging to each day back into one record per day.
 * Input is any mix of shard records; output is sorted oldest-first.
 */
export function mergeShards(records) {
  const byDay = new Map();
  for (const record of records) {
    if (!record?.day) continue;
    const target = byDay.get(record.day) || emptyDay(record.day);
    target.views += record.views || 0;
    target.visits += record.visits || 0;
    for (const field of ['paths', 'referrers', 'countries']) {
      for (const [key, value] of Object.entries(record[field] || {})) {
        target[field][key] = (target[field][key] || 0) + value;
      }
    }
    for (const key of DEVICES) target.devices[key] += record.devices?.[key] || 0;
    target.duration.samples += record.duration?.samples || 0;
    target.duration.totalMs += record.duration?.totalMs || 0;
    if (!target.updated || (record.updated && record.updated > target.updated)) {
      target.updated = record.updated;
    }
    byDay.set(record.day, target);
  }
  return [...byDay.values()].sort((a, b) => a.day.localeCompare(b.day));
}

/** Roll a set of day records into the shape the dashboard renders. */
export function summarise(days) {
  const totals = {
    views: 0,
    visits: 0,
    paths: {},
    referrers: {},
    countries: {},
    devices: { mobile: 0, tablet: 0, desktop: 0 },
    duration: { samples: 0, totalMs: 0 },
  };
  const series = [];

  for (const day of days) {
    if (!day) continue;
    totals.views += day.views || 0;
    totals.visits += day.visits || 0;
    for (const [key, value] of Object.entries(day.paths || {})) {
      totals.paths[key] = (totals.paths[key] || 0) + value;
    }
    for (const [key, value] of Object.entries(day.referrers || {})) {
      totals.referrers[key] = (totals.referrers[key] || 0) + value;
    }
    for (const [key, value] of Object.entries(day.countries || {})) {
      totals.countries[key] = (totals.countries[key] || 0) + value;
    }
    for (const key of DEVICES) totals.devices[key] += day.devices?.[key] || 0;
    totals.duration.samples += day.duration?.samples || 0;
    totals.duration.totalMs += day.duration?.totalMs || 0;
    series.push({ day: day.day, views: day.views || 0, visits: day.visits || 0 });
  }

  const rank = (map) =>
    Object.entries(map)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .map(([key, count]) => ({ key, count }));

  return {
    views: totals.views,
    visits: totals.visits,
    avgSeconds: totals.duration.samples
      ? Math.round(totals.duration.totalMs / totals.duration.samples / 1000)
      : null,
    devices: totals.devices,
    series: series.sort((a, b) => a.day.localeCompare(b.day)),
    paths: rank(totals.paths),
    referrers: rank(totals.referrers),
    countries: rank(totals.countries),
  };
}

/** The `count` most recent UTC day keys, oldest first. */
export function recentDays(count, now = new Date()) {
  const out = [];
  for (let i = count - 1; i >= 0; i -= 1) {
    const date = new Date(now.getTime() - i * 86400000);
    out.push(dayKey(date));
  }
  return out;
}
