/**
 * Maps the current route to its position in the navbar, so page
 * transitions can pick a horizontal slide direction from it.
 *
 * The navbar is a 5-slot horizontal grid:
 *   0  Home
 *   1  Neoflix
 *   2  Publications
 *   3  Contact         (same route as Neoflix, different scroll target)
 *   4  Toolbox         (and all /toolbox/:slug subroutes)
 *
 * Direction = (target index) − (previous index).
 *   direction > 0 → user is moving right in the navbar
 *   direction < 0 → user is moving left
 *   direction = 0 → no transition (e.g. navigating between toolbox slugs)
 */
import { useLocation } from 'react-router-dom';

export const NAV_ORDER = [
  { index: 0, path: '/' },
  { index: 1, path: '/neoflix' },
  { index: 2, path: '/publications' },
  { index: 3, path: '/contact' },
  { index: 4, path: '/toolbox' },
];

export function getNavIndexForPath(pathname) {
  if (!pathname) return 0;
  // Toolbox subroutes (/toolbox/:slug) all share slot 4.
  if (pathname === '/toolbox' || pathname.startsWith('/toolbox/')) return 4;
  const match = NAV_ORDER.find((n) => n.path === pathname);
  return match ? match.index : 0;
}

export default function useNavIndex() {
  const location = useLocation();
  return getNavIndexForPath(location.pathname);
}
