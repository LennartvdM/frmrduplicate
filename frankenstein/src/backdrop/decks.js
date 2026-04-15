/**
 * Named deck constants — the single place that knows which video URLs
 * stack into which backdrop deck.
 *
 * Consumers import by key, not by route string, so renaming or
 * restructuring a route doesn't ripple into the wire format. Medical
 * decks come straight from the section data module; blog decks union
 * the two blog-style pages so a single cell can render both without
 * remounting when the route changes between them.
 */
import { VARIANTS } from '../components/sections/medical/MedicalSection.data';
import {
  deckSources as neoflixDeck,
  sectionToVideo as neoflixMap,
} from '../data/neoflixPage';
import {
  deckSources as publicationsDeck,
  sectionToVideo as publicationsMap,
} from '../data/publicationsPage';

export const MEDICAL_V2_DECK = VARIANTS.v2.blurVideos.map((b) => b.video);
export const MEDICAL_V3_DECK = VARIANTS.v3.blurVideos.map((b) => b.video);

// Union of every video the blog cell might show, deduplicated but
// order-preserving. The cell mounts this once and crossfades within it.
export const BLOG_DECK = Array.from(
  new Set([...neoflixDeck, ...publicationsDeck])
);

// Section-id → video URL, merged across the two blog pages. Section
// ids are unique between routes so the merge is unambiguous.
const BLOG_SECTION_TO_VIDEO = {
  ...neoflixMap,
  ...publicationsMap,
};

/**
 * Resolve a blog section id to its deck index, or -1 if the id isn't
 * mapped. Callers use -1 to mean "nothing to show — fade the cell out".
 */
export function blogIdxForSection(sectionId) {
  if (!sectionId) return -1;
  const url = BLOG_SECTION_TO_VIDEO[sectionId];
  if (!url) return -1;
  const idx = BLOG_DECK.indexOf(url);
  return idx >= 0 ? idx : -1;
}
