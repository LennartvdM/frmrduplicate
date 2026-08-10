/**
 * analytics/index.js — cookieless pageview reporting.
 *
 * Deliberately stores nothing on the visitor's device: no cookie, no
 * localStorage, no sessionStorage, no fingerprint. That is the whole
 * reason this site needs no consent banner, so any future change that
 * writes to the device is a change that brings the banner with it.
 *
 * What gets sent, per pageview:
 *   p  pathname (no query string, no hash)
 *   r  referrer — only when it is another site, and the server keeps
 *      just the hostname
 *   e  1 when this pageview started the visit (referrer isn't us)
 *   d  "mobile" | "tablet" | "desktop", from viewport width alone
 * and, when the page is closed or navigated away from, the time spent
 * on it. Nothing else. No identifier ties two pageviews together.
 *
 * Provider is selected with VITE_ANALYTICS_PROVIDER:
 *   firstparty (default)  this repo's /api/event endpoint
 *   plausible             Plausible Analytics, needs VITE_PLAUSIBLE_DOMAIN
 *   umami                 Umami, needs VITE_UMAMI_ID (+ VITE_UMAMI_SRC)
 *   none                  no analytics at all, no requests
 * All four are cookieless.
 */

const ENDPOINT = '/api/event';

const PROVIDER = (import.meta.env.VITE_ANALYTICS_PROVIDER || 'firstparty').toLowerCase();

/** Hosts where measurement is meaningful: not localhost, not previews. */
function isMeasurableHost(hostname) {
  if (!hostname) return false;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]') return false;
  // Netlify deploy previews and branch deploys — "deploy-preview-12--site"
  // and "branch--site" — would otherwise mix test traffic into the real
  // numbers.
  if (hostname.includes('--')) return false;
  return true;
}

/**
 * Global Privacy Control is an explicit, legally recognised opt-out. We
 * collect nothing personal either way, but honouring it costs one line
 * and is the point of the whole setup.
 */
function optedOut() {
  return typeof navigator !== 'undefined' && navigator.globalPrivacyControl === true;
}

function deviceClass() {
  const width = window.innerWidth || document.documentElement.clientWidth || 0;
  if (width < 600) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function isEnabled() {
  if (typeof window === 'undefined') return false;
  if (PROVIDER === 'none') return false;
  if (optedOut()) return false;
  return isMeasurableHost(window.location.hostname);
}

function send(payload) {
  const body = JSON.stringify(payload);
  try {
    // sendBeacon survives the page being torn down, which a normal
    // fetch does not — that is what makes the "time on page" ping
    // reliable on close.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    fetch(ENDPOINT, {
      method: 'POST',
      body,
      keepalive: true,
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => {});
  } catch {
    /* Analytics must never break the page it is measuring. */
  }
}

/* ------------------------------------------------------------------ *
 * Third-party cookieless providers (opt-in via env var)
 * ------------------------------------------------------------------ */

function loadScript(attrs) {
  const script = document.createElement('script');
  script.defer = true;
  for (const [key, value] of Object.entries(attrs)) script.setAttribute(key, value);
  document.head.appendChild(script);
}

function startPlausible() {
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  if (!domain) {
    console.warn('[analytics] VITE_ANALYTICS_PROVIDER=plausible but VITE_PLAUSIBLE_DOMAIN is unset');
    return () => {};
  }
  // The "hash" build is not needed; the manual build lets React Router
  // drive pageviews instead of Plausible guessing at History API events.
  loadScript({
    src: 'https://plausible.io/js/script.manual.js',
    'data-domain': domain,
  });
  window.plausible =
    window.plausible ||
    function plausibleQueue(...args) {
      (window.plausible.q = window.plausible.q || []).push(args);
    };
  return () => window.plausible('pageview');
}

function startUmami() {
  const websiteId = import.meta.env.VITE_UMAMI_ID;
  if (!websiteId) {
    console.warn('[analytics] VITE_ANALYTICS_PROVIDER=umami but VITE_UMAMI_ID is unset');
    return () => {};
  }
  loadScript({
    src: import.meta.env.VITE_UMAMI_SRC || 'https://cloud.umami.is/script.js',
    'data-website-id': websiteId,
    'data-auto-track': 'false',
  });
  return () => window.umami?.track?.();
}

/* ------------------------------------------------------------------ *
 * Public API
 * ------------------------------------------------------------------ */

let started = false;
let sendPageview = null;
let currentPath = null;
let enteredAt = 0;

/** Report time spent on the page we are leaving, if it was more than a glance. */
function flushDuration() {
  if (!enteredAt) return;
  const ms = Date.now() - enteredAt;
  enteredAt = 0;
  if (ms < 1000) return;
  send({ t: 'end', ms });
}

/**
 * Start analytics. Safe to call once, at app mount; subsequent route
 * changes are reported through trackPageview().
 */
export function initAnalytics() {
  if (started || !isEnabled()) return;
  started = true;

  if (PROVIDER === 'plausible') sendPageview = startPlausible();
  else if (PROVIDER === 'umami') sendPageview = startUmami();

  if (PROVIDER === 'firstparty') {
    // "hidden" is the only teardown signal that fires reliably on mobile
    // Safari, where pagehide/unload are routinely skipped.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushDuration();
    });
    window.addEventListener('pagehide', flushDuration);
  }
}

/** Report one pageview. Called on mount and on every route change. */
export function trackPageview(pathname) {
  if (!started || !isEnabled()) return;
  const path = pathname || window.location.pathname;
  if (path === currentPath) return;

  if (sendPageview) {
    sendPageview();
    currentPath = path;
    return;
  }

  // Close out the previous page's timer before opening the next one.
  flushDuration();

  const referrer = document.referrer || '';
  let external = false;
  if (referrer) {
    try {
      external = new URL(referrer).hostname !== window.location.hostname;
    } catch {
      external = false;
    }
  }
  // First render of the session, or arrival from another site: this
  // pageview is someone showing up rather than clicking around.
  const entry = currentPath === null && (!referrer || external);

  send({
    t: 'view',
    p: path,
    r: entry && external ? referrer : undefined,
    e: entry ? 1 : 0,
    d: deviceClass(),
  });

  currentPath = path;
  enteredAt = Date.now();
}
