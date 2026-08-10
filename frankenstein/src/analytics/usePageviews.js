/**
 * Fires a pageview on every client-side route change.
 *
 * Without this, a single-page app records exactly one pageview per visitor —
 * the document load — and every subsequent navigation is invisible. Hosted
 * beacons that hook history.pushState cover this themselves; the first-party
 * path does not, so the router tells it directly.
 */
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageview } from './index';

export default function usePageviews() {
  const { pathname } = useLocation();

  useEffect(() => {
    trackPageview(pathname);
  }, [pathname]);
}
