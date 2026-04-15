import { createContext } from 'react';

/**
 * VideoBackdropContext — the one data wire between the content module
 * (every page / section) and the site-wide BackdropEngine. No animation
 * timing crosses this boundary; only URL strings, identifiers, and the
 * Home scroll container ref.
 *
 * New primary API:
 *   setMedicalCarouselTop(variant, url) — Home's V2/V3 medical sections
 *     publish the current carousel top URL for their mini-deck. The
 *     engine's HomeBackdrop renders that cell with idx = deck.indexOf(url).
 *   setBlogTopUrl(url) — blog-style pages (/neoflix, /publications,
 *     /contact) publish the URL resolved by their scroll-spy.
 *   registerHomeScrollContainer(node) — ScrollSnap calls this with its
 *     scroll container on mount; the engine subscribes to its scroll
 *     events to drive Home's vertical y-slide. Pass null to unregister.
 *
 * Legacy bridges (kept so existing consumers still compile during
 * migration, but new code should use the primary API):
 *   setActiveSection(id)  — routed internally to setBlogTopUrl via the
 *     universal section→video map.
 *   setActiveVideoUrl(url) — no-op under the new model. Intro /
 *     WorldMap used to call this with null to clear the backdrop;
 *     that's unnecessary now because Home renders Intro/WorldMap as
 *     camo cells by construction.
 *
 * Defaults are all no-ops so components work outside a provider
 * (test mounts, storybook, etc.).
 */
export const VideoBackdropContext = createContext({
  setMedicalCarouselTop: () => {},
  setBlogTopUrl: () => {},
  registerHomeScrollContainer: () => {},
  setActiveSection: () => {},
  setActiveVideoUrl: () => {},
});
