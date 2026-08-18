import { assetUrl } from './assetUrl';

/**
 * Reduced-media mode: serve a high-quality still instead of a looping
 * video when the visitor's situation asks for it.
 *
 * Every signal here is a client-side capability/preference read —
 * nothing is stored, nothing is sent anywhere, no identifier is
 * created — so this needs no consent banner and changes nothing about
 * the site's "no cookies, no tracking" posture:
 *
 * - prefers-reduced-motion: the visitor explicitly asked their OS for
 *   less movement. Decorative loops are exactly what they meant.
 * - Save-Data: the visitor asked their browser to spend less data.
 * - deviceMemory < 4 GB: a low-end device; a dozen video decoders is
 *   the difference between smooth and janky scrolling there.
 *
 * Stills live in /videos/stills/<name>.webp, generated from the
 * original (pre-compression) footage — see CLAUDE.md's media rule.
 */
export function prefersReducedMedia() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return true;
  const connection = navigator.connection;
  if (connection?.saveData) return true;
  if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory < 4) return true;
  return false;
}

/** The still that stands in for a clip URL, or null if none exists. */
export function stillFor(src) {
  if (!src) return null;
  const match = String(src).match(/\/videos\/(?:mobile\/)?([^/?#]+)\.mp4$/);
  return match ? assetUrl(`/videos/stills/${match[1]}.webp`) : null;
}
