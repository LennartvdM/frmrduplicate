import { useCallback, useEffect, useState } from 'react';

/**
 * useDownloadGuard — a soft brake on repeat downloads of one file.
 *
 * This exists for the bored visitor drumming on a download button, not
 * for an attacker: the papers are static files on the CDN, so anyone
 * willing to run curl never executes this code at all. Rate limiting
 * that person belongs at the edge, not here.
 *
 * Which is why the numbers are gentle. Every legitimate reason to click
 * twice — the first download failed, you didn't notice it land, you
 * want a second copy, you're on hospital wifi that dropped — has to
 * pass without ever meeting a wall. The brake only engages on a rhythm
 * no real reader produces, and lets go again in well under a minute.
 *
 * Three deliberate choices:
 *
 *   Per file, not per page. Downloading all six papers in a row is
 *   normal; downloading one of them nine times is not.
 *
 *   sessionStorage, not localStorage. A cooldown must never outlive the
 *   tab. Clinical workstations are shared — a counter that persisted
 *   would tell the next person on that machine to wait for a download
 *   they never made.
 *
 *   Counted on click, not on completion. The browser never tells us a
 *   download finished, and guessing would either double-count or leak.
 */
const WINDOW_MS = 60_000;   // how far back a burst is measured
const BURST_LIMIT = 5;      // clicks on one file within that window
const COOLDOWN_MS = 45_000; // how long the brake stays on
const STORE_KEY = 'neoflix:download-guard';

function readStore() {
  try {
    return JSON.parse(sessionStorage.getItem(STORE_KEY)) || {};
  } catch {
    return {};
  }
}

function writeStore(value) {
  try {
    sessionStorage.setItem(STORE_KEY, JSON.stringify(value));
  } catch {
    // Private mode, or storage full. A guard that can't remember is
    // strictly better than a download that doesn't happen.
  }
}

/**
 * One paper has two buttons — the card's and the gutter's — and they
 * must show the same state at the same moment. Sharing storage isn't
 * enough: without this, tripping the brake on one leaves the other
 * looking ready, and its next click would be swallowed with nothing on
 * screen to explain it. That reads as a broken button, which is worse
 * than the extra request the brake was there to save.
 */
const listeners = new Set();

function broadcast(key, until) {
  listeners.forEach((listener) => listener(key, until));
}

export default function useDownloadGuard(key) {
  const [until, setUntil] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);

  // Pick up a cooldown already running for this file — the same paper
  // has a button on its card and another out in the gutter, and both
  // should reflect the same state.
  useEffect(() => {
    if (!key) return undefined;

    const entry = readStore()[key];
    if (entry?.until > Date.now()) setUntil(entry.until);

    const onChange = (changedKey, changedUntil) => {
      if (changedKey === key) setUntil(changedUntil);
    };
    listeners.add(onChange);
    return () => listeners.delete(onChange);
  }, [key]);

  // Tick only while the brake is on, so an idle page schedules nothing.
  useEffect(() => {
    if (!until) return undefined;
    const tick = () => {
      const left = until - Date.now();
      if (left <= 0) {
        setUntil(0);
        setSecondsLeft(0);
      } else {
        setSecondsLeft(Math.ceil(left / 1000));
      }
    };
    tick();
    const id = setInterval(tick, 250);
    return () => clearInterval(id);
  }, [until]);

  const onClick = useCallback(
    (event) => {
      if (!key) return;

      const now = Date.now();
      const store = readStore();
      const entry = store[key] || { hits: [], until: 0 };

      if (entry.until > now) {
        event.preventDefault();
        broadcast(key, entry.until);
        return;
      }

      const hits = [...(entry.hits || []), now].filter((t) => now - t < WINDOW_MS);

      if (hits.length > BURST_LIMIT) {
        const cooldownUntil = now + COOLDOWN_MS;
        // The click that trips the brake is still honoured — being told
        // to wait for a file you haven't got yet is the worst outcome
        // here, so the brake starts from the next one.
        store[key] = { hits: [], until: cooldownUntil };
        broadcast(key, cooldownUntil);
      } else {
        store[key] = { hits, until: 0 };
      }

      writeStore(store);
    },
    [key]
  );

  return { cooling: Boolean(until), secondsLeft, onClick };
}
