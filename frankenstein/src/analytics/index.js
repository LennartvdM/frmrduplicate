/**
 * Cookieless analytics.
 *
 * The whole point of this module is what it does *not* do. It sets no cookie,
 * writes nothing to localStorage or sessionStorage, and builds no identifier
 * for the visitor — not in the browser, and not from anything it sends. Nothing
 * is stored on the device, which is the condition ePrivacy Art. 5(3) attaches
 * consent to, so the site needs no cookie banner. (That is about storage; see
 * docs/ANALYTICS.md for the separate, and narrower, question of what the
 * receiving end may keep.)
 *
 * What gets sent per pageview: the path, the referrer's host (host only — a
 * full referrer URL can carry search terms and session tokens), the viewport
 * bucket, and the language. That is it. No screen fingerprint, no timing
 * profile, no per-visitor token.
 *
 * Configuration is by build-time env var, so a deploy with none of these set
 * ships an inert module:
 *
 *   VITE_ANALYTICS_PROVIDER   'firstparty' | 'script' | 'none'   (default 'firstparty')
 *   VITE_ANALYTICS_ENDPOINT   firstparty: where to POST          (default '/api/collect')
 *   VITE_ANALYTICS_SCRIPT     script: URL of a hosted beacon
 *   VITE_ANALYTICS_SITE       script: site/domain id, emitted as both
 *                             data-domain and data-website-id
 *
 * `script` mode suits vendors that patch the History API themselves and so
 * count client-side navigations without help — Plausible, Umami, Simple
 * Analytics, Fathom. It does NOT suit GoatCounter, which needs an explicit
 * count() per navigation, or Cloudflare Web Analytics, which wants a JSON
 * data-cf-beacon attribute rather than the two id attributes set below. Either
 * would need its own branch here; on a 74-page docs site GoatCounter would
 * otherwise record one pageview per visit.
 */

const env = import.meta.env || {};

const PROVIDER = env.VITE_ANALYTICS_PROVIDER || 'firstparty';
const ENDPOINT = env.VITE_ANALYTICS_ENDPOINT || '/api/collect';
const SCRIPT_URL = env.VITE_ANALYTICS_SCRIPT || '';
const SITE_ID = env.VITE_ANALYTICS_SITE || '';

let started = false;
let lastPath = null;

/**
 * Honour the browser-level signals. Neither is legally load-bearing for a
 * measurement that stores nothing, but a visitor who has set one has said
 * plainly that they would rather not be counted.
 */
function optedOut() {
  if (typeof navigator === 'undefined') return true;
  if (navigator.globalPrivacyControl === true) return true;
  const dnt = navigator.doNotTrack ?? window.doNotTrack ?? navigator.msDoNotTrack;
  return dnt === '1' || dnt === 'yes';
}

/**
 * Traffic that is not real traffic: local development, and Netlify's branch and
 * deploy-preview hosts. Without the *.netlify.app exclusion every preview build
 * would write into the same counters as production.
 */
function isNonProduction() {
  const host = window.location.hostname;
  return (
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host === '[::1]' ||
    host.endsWith('.local') ||
    host.endsWith('.netlify.app') ||
    window.location.protocol === 'file:'
  );
}

/** Host only, and only when it is a different site. Same-site referrers are noise. */
function referrerHost() {
  const ref = document.referrer;
  if (!ref) return '';
  try {
    const url = new URL(ref);
    if (url.hostname === window.location.hostname) return '';
    return url.hostname;
  } catch {
    return '';
  }
}

/**
 * Three buckets, matching the app's own layout breakpoints. Coarse on purpose:
 * exact viewport dimensions are one of the strongest fingerprinting signals
 * there is, and "was this read on a phone" is the only question worth asking.
 */
function viewportClass() {
  const width = window.innerWidth || 0;
  if (width < 600) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}

function send(payload) {
  const body = JSON.stringify(payload);
  try {
    // sendBeacon survives the page being closed mid-flight, which a plain
    // fetch does not. It cannot set a content type other than the three CORS-
    // safelisted ones, hence the explicit Blob type.
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: 'application/json' });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    fetch(ENDPOINT, {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      credentials: 'omit',
      mode: 'same-origin',
    }).catch(() => {});
  } catch {
    // Measurement must never be able to break the page it is measuring.
  }
}

/** Record a pageview. Safe to call on every route change; repeats are dropped. */
export function trackPageview(pathname) {
  if (!started || PROVIDER !== 'firstparty') return;
  const path = pathname || window.location.pathname;
  if (path === lastPath) return;
  lastPath = path;

  send({
    p: path,
    r: referrerHost(),
    v: viewportClass(),
    l: (navigator.language || '').slice(0, 5),
  });
}

function injectScript() {
  if (!SCRIPT_URL) return;
  // Dynamically inserted scripts are async by default, so there is no `defer`
  // to set — it would be ignored.
  const script = document.createElement('script');
  script.src = SCRIPT_URL;
  if (SITE_ID) {
    // Plausible reads data-domain, Umami reads data-website-id. Setting both
    // means the vendor can be swapped without touching this file.
    script.setAttribute('data-domain', SITE_ID);
    script.setAttribute('data-website-id', SITE_ID);
  }
  document.head.appendChild(script);
}

/** Called once from main.jsx. Everything else is driven by usePageviews. */
export function startAnalytics() {
  if (started || PROVIDER === 'none') return;
  if (typeof window === 'undefined') return;
  if (optedOut() || isNonProduction()) return;

  started = true;
  if (PROVIDER === 'script') {
    injectScript();
    return;
  }
  trackPageview(window.location.pathname);
}

export const analyticsProvider = PROVIDER;
