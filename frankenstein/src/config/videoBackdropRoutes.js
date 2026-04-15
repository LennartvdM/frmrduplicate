/**
 * Which routes render a full-bleed video backdrop, and where the
 * backdrop's per-section video mappings live.
 *
 * The backdrop is mounted once at AppShell level and persists across
 * transitions between any two video routes. Only the foreground content
 * slides horizontally in those cases — the backdrop just crossfades its
 * target video via the deck-of-cards opacity rule. Non-video routes
 * unmount the backdrop entirely, so the whole page slides as one.
 *
 * /contact is an alias for the /neoflix page at a specific scroll target,
 * so it shares neoflix's video config.
 */
import {
  deckSources as neoflixDeck,
  sectionToVideo as neoflixMap,
} from '../data/neoflixPage';
import {
  deckSources as publicationsDeck,
  sectionToVideo as publicationsMap,
} from '../data/publicationsPage';

// Union of every video used by any video-backdrop route, deduplicated
// but order-preserving. The deck-of-cards stacking reads this array top
// to bottom — lower indices sit higher in the pile.
export const UNIVERSAL_DECK_SOURCES = Array.from(
  new Set([...neoflixDeck, ...publicationsDeck])
);

// section id → video URL, unioned across routes. Section IDs are unique
// between routes (e.g. "time-sensitive" for neoflix, "preface" for
// publications) so this simple merge is unambiguous.
export const UNIVERSAL_SECTION_TO_VIDEO = {
  ...neoflixMap,
  ...publicationsMap,
};

// Per-route video configs — AppShell picks one based on the current
// pathname. /contact piggybacks on neoflix.
const ROUTE_VIDEO_CONFIGS = {
  '/neoflix': { deckSources: neoflixDeck, sectionToVideo: neoflixMap },
  '/publications': {
    deckSources: publicationsDeck,
    sectionToVideo: publicationsMap,
  },
  '/contact': { deckSources: neoflixDeck, sectionToVideo: neoflixMap },
};

export function getVideoConfigForPath(pathname) {
  return ROUTE_VIDEO_CONFIGS[pathname] || null;
}

export function isVideoBackdropRoute(pathname) {
  return Boolean(ROUTE_VIDEO_CONFIGS[pathname]);
}
