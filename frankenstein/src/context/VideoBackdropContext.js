import { createContext } from 'react';

/**
 * Lets any BlogPage-style route push its current active section up to
 * AppShell so the SharedVideoBackdrop (which sits above the route
 * transition) can pick the right target video. Nothing else uses this —
 * if the provider is missing (e.g. on non-video routes) the default
 * `setActiveSection` is a no-op.
 */
export const VideoBackdropContext = createContext({
  setActiveSection: () => {},
});
