/**
 * Unit tests for netlify/lib/analytics.mjs.
 *
 * The aggregation logic is the part that can silently corrupt a whole
 * day's numbers, and it is the part that can't be exercised without a
 * deployed Netlify Blobs store — so it lives in a pure module and is
 * tested here with plain Node.
 *
 * Run: npm run test:analytics
 */
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  LIMITS,
  SHARDS,
  applyEvent,
  cleanCountry,
  cleanPath,
  cleanReferrer,
  dayFromKey,
  dayKey,
  emptyDay,
  mergeShards,
  parseEvent,
  randomShard,
  recentDays,
  shardKey,
  summarise,
} from '../netlify/lib/analytics.mjs';

const NOW = new Date('2026-08-10T12:00:00.000Z');
const SELF = ['neoflix.care', 'www.neoflix.care'];

test('cleanPath normalises and rejects junk', () => {
  assert.equal(cleanPath('/toolbox/x?utm_source=x#frag'), '/toolbox/x');
  assert.equal(cleanPath('/toolbox//x/'), '/toolbox/x');
  assert.equal(cleanPath('/'), '/');
  assert.equal(cleanPath('no-leading-slash'), null);
  assert.equal(cleanPath('/' + 'a'.repeat(LIMITS.pathLength)), null);
  assert.equal(cleanPath('/bad\u0000path'), null);
  assert.equal(cleanPath(42), null);
});

test('cleanReferrer keeps only the host, and drops our own', () => {
  assert.equal(cleanReferrer('https://www.google.com/search?q=secret+terms', SELF), 'google.com');
  assert.equal(cleanReferrer('https://www.neoflix.care/toolbox', SELF), null);
  assert.equal(cleanReferrer('https://neoflix.care/', SELF), null);
  assert.equal(cleanReferrer('not a url', SELF), null);
  assert.equal(cleanReferrer('', SELF), null);
});

test('cleanCountry accepts only ISO-3166 alpha-2', () => {
  assert.equal(cleanCountry('nl'), 'NL');
  assert.equal(cleanCountry('NLD'), null);
  assert.equal(cleanCountry(undefined), null);
});

test('parseEvent normalises a pageview and never trusts the client country', () => {
  const event = parseEvent(
    { t: 'view', p: '/neoflix?x=1', r: 'https://t.co/abc', e: 1, d: 'mobile' },
    { country: 'de', selfHosts: SELF }
  );
  assert.deepEqual(event, {
    type: 'view',
    path: '/neoflix',
    referrer: 't.co',
    entry: true,
    device: 'mobile',
    country: 'DE',
  });
});

test('parseEvent rejects unusable payloads', () => {
  assert.equal(parseEvent(null, { selfHosts: SELF }), null);
  assert.equal(parseEvent({ t: 'view' }, { selfHosts: SELF }), null);
  assert.equal(parseEvent({ t: 'end', ms: -5 }, { selfHosts: SELF }), null);
  assert.deepEqual(parseEvent({ t: 'end', ms: '1500' }, { selfHosts: SELF }), {
    type: 'end',
    ms: 1500,
  });
});

test('parseEvent falls back to desktop for an unknown device', () => {
  const event = parseEvent({ t: 'view', p: '/', d: 'watch' }, { selfHosts: SELF });
  assert.equal(event.device, 'desktop');
});

test('applyEvent counts a view, and only counts an entry as a visit', () => {
  let day = emptyDay('2026-08-10');
  day = applyEvent(day, { type: 'view', path: '/', entry: true, device: 'desktop', country: 'NL', referrer: 'google.com' }, NOW);
  day = applyEvent(day, { type: 'view', path: '/neoflix', entry: false, device: 'desktop', country: 'NL' }, NOW);

  assert.equal(day.views, 2);
  assert.equal(day.visits, 1);
  assert.deepEqual(day.paths, { '/': 1, '/neoflix': 1 });
  assert.deepEqual(day.referrers, { 'google.com': 1 });
  assert.deepEqual(day.countries, { NL: 2 });
  assert.equal(day.devices.desktop, 2);
});

test('applyEvent does not mutate its input', () => {
  const day = emptyDay('2026-08-10');
  const next = applyEvent(day, { type: 'view', path: '/', entry: true, device: 'desktop' }, NOW);
  assert.equal(day.views, 0, 'the original record must be untouched so a failed write can retry');
  assert.equal(next.views, 1);
});

test('applyEvent clamps absurd durations instead of letting them skew the mean', () => {
  let day = emptyDay('2026-08-10');
  day = applyEvent(day, { type: 'end', ms: 5000 }, NOW);
  day = applyEvent(day, { type: 'end', ms: 9 * 60 * 60 * 1000 }, NOW);
  assert.equal(day.duration.samples, 2);
  assert.equal(day.duration.totalMs, 5000 + 30 * 60 * 1000);
  assert.equal(day.views, 0, 'a duration ping is not a pageview');
});

test('cardinality is capped so an open endpoint cannot bloat a day blob', () => {
  let day = emptyDay('2026-08-10');
  for (let i = 0; i < LIMITS.paths + 25; i += 1) {
    day = applyEvent(day, { type: 'view', path: `/spam/${i}`, entry: false, device: 'desktop' }, NOW);
  }
  assert.equal(Object.keys(day.paths).length, LIMITS.paths + 1, 'capped keys plus the "other" bucket');
  assert.equal(day.paths.other, 25);
  assert.equal(day.views, LIMITS.paths + 25, 'every view is still counted');
});

test('shard keys round-trip', () => {
  assert.equal(shardKey('2026-08-10', 3), '2026-08-10/3');
  assert.equal(dayFromKey('2026-08-10/3'), '2026-08-10');
  assert.equal(dayFromKey('2026-08-10'), null);
  assert.equal(dayFromKey('nonsense'), null);
  for (let i = 0; i < 200; i += 1) {
    const shard = randomShard();
    assert.ok(Number.isInteger(shard) && shard >= 0 && shard < SHARDS);
  }
});

test('mergeShards sums a day split across shards', () => {
  const a = applyEvent(emptyDay('2026-08-10'), { type: 'view', path: '/', entry: true, device: 'mobile', country: 'NL', referrer: 'google.com' }, NOW);
  const b = applyEvent(emptyDay('2026-08-10'), { type: 'view', path: '/', entry: false, device: 'desktop', country: 'BE' }, NOW);
  const c = applyEvent(emptyDay('2026-08-09'), { type: 'view', path: '/neoflix', entry: true, device: 'desktop' }, NOW);

  const merged = mergeShards([b, c, a]);
  assert.deepEqual(merged.map((d) => d.day), ['2026-08-09', '2026-08-10'], 'oldest first');

  const today = merged[1];
  assert.equal(today.views, 2);
  assert.equal(today.visits, 1);
  assert.deepEqual(today.paths, { '/': 2 });
  assert.deepEqual(today.countries, { NL: 1, BE: 1 });
  assert.equal(today.devices.mobile, 1);
  assert.equal(today.devices.desktop, 1);
});

test('summarise ranks dimensions and averages the duration', () => {
  let day = emptyDay('2026-08-10');
  for (let i = 0; i < 3; i += 1) {
    day = applyEvent(day, { type: 'view', path: '/neoflix', entry: false, device: 'desktop' }, NOW);
  }
  day = applyEvent(day, { type: 'view', path: '/', entry: true, device: 'mobile', referrer: 'google.com' }, NOW);
  day = applyEvent(day, { type: 'end', ms: 4000 }, NOW);
  day = applyEvent(day, { type: 'end', ms: 6000 }, NOW);

  const result = summarise([day]);
  assert.equal(result.views, 4);
  assert.equal(result.visits, 1);
  assert.equal(result.avgSeconds, 5);
  assert.deepEqual(result.paths, [
    { key: '/neoflix', count: 3 },
    { key: '/', count: 1 },
  ]);
  assert.deepEqual(result.referrers, [{ key: 'google.com', count: 1 }]);
  assert.deepEqual(result.series, [{ day: '2026-08-10', views: 4, visits: 1 }]);
});

test('summarise reports no average when nothing was sampled', () => {
  assert.equal(summarise([emptyDay('2026-08-10')]).avgSeconds, null);
});

test('recentDays returns N UTC days ending today, oldest first', () => {
  const days = recentDays(3, NOW);
  assert.deepEqual(days, ['2026-08-08', '2026-08-09', '2026-08-10']);
  assert.equal(dayKey(NOW), '2026-08-10');
});
