// Server-side proxy to Google Apps Script.
//
// Why: some client firewalls block script.google.com (GAS is abused by
// scammers, so reputation lists sometimes flag it). Routing through this
// function lets those clients reach the backend via the site's own origin.
//
// This improves on the plain Netlify 200-rewrite because a Function follows
// GAS's internal 302 → script.googleusercontent.com redirect server-side and
// returns a clean response body; the edge rewrite surfaced opaqueredirects
// that the browser could not consume.

const DEFAULT_GAS_URL = 'https://script.google.com/macros/s/AKfycbw3gcRqlbc9lH0WKiR5yEeM4whu_WFVAUg9lE8cf9Uyf6C-teYRfA5CQX2tCaZZiV-nlg/exec';
const GAS_URL = process.env.GAS_SCRIPT_URL || DEFAULT_GAS_URL;

// Netlify's synchronous function execution cap is 10s; leave headroom.
const UPSTREAM_TIMEOUT_MS = 9000;

export default async (request) => {
  if (request.method !== 'GET' && request.method !== 'POST') {
    return jsonResponse(405, { success: false, error: 'Method not allowed' });
  }

  const incoming = new URL(request.url);
  const target = new URL(GAS_URL);
  incoming.searchParams.forEach((value, key) => target.searchParams.set(key, value));

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  try {
    const upstreamInit = {
      method: request.method,
      redirect: 'follow',
      signal: controller.signal,
    };

    if (request.method === 'POST') {
      upstreamInit.body = await request.text();
      const contentType = request.headers.get('content-type');
      if (contentType) {
        upstreamInit.headers = { 'content-type': contentType };
      }
    }

    const upstream = await fetch(target.toString(), upstreamInit);
    const body = await upstream.text();
    const contentType = upstream.headers.get('content-type') || 'application/json; charset=utf-8';

    return new Response(body, {
      status: upstream.status,
      headers: {
        'content-type': contentType,
        'cache-control': 'no-store',
      },
    });
  } catch (error) {
    const isAbort = error.name === 'AbortError';
    return jsonResponse(isAbort ? 504 : 502, {
      success: false,
      error: isAbort ? 'Upstream timeout' : 'Upstream request failed',
    });
  } finally {
    clearTimeout(timer);
  }
};

function jsonResponse(status, body) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}
