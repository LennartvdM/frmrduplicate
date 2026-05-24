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
import { assetUrl } from '../utils/assetUrl';

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

/**
 * Toolbox (docs) deck — the 6 blur videos, reused from the site-wide
 * video pool. The mapping from a docs slug to an index is deterministic
 * (slug-hash mod 6) so the same page shows the same video across visits,
 * which keeps the "video change = page change" cue from reading as
 * random flicker. The mapping itself is arbitrary — videos carry no
 * meaning, they just mark that you moved.
 */
export const TOOLBOX_DECK = [
  assetUrl('/videos/blurcoordination.mp4'),
  assetUrl('/videos/blurfocus.mp4'),
  assetUrl('/videos/blurperspectives.mp4'),
  assetUrl('/videos/blursskills.mp4'),
  assetUrl('/videos/blurteam.mp4'),
  assetUrl('/videos/blururgency.mp4'),
];

/**
 * Stable string hash (FNV-1a 32-bit). Deterministic across sessions and
 * builds — we never want the same slug to land on different videos on
 * different visits.
 */
function hashSlug(slug) {
  let h = 0x811c9dc5;
  for (let i = 0; i < slug.length; i++) {
    h ^= slug.charCodeAt(i);
    h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) >>> 0;
  }
  return h >>> 0;
}

export function toolboxIdxForSlug(slug) {
  if (!slug) return 0;
  return hashSlug(slug) % TOOLBOX_DECK.length;
}

