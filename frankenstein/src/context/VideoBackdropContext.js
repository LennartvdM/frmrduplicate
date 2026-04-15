import { createContext } from 'react';

/**
 * Lets any page publish which video the shared backdrop should have on
 * top of its deck. Two signals:
 *
 *   setActiveSection(id)  — used by BlogPage-style routes (section id
 *                           resolves through UNIVERSAL_SECTION_TO_VIDEO).
 *   setActiveVideoUrl(url) — used by Home's medical sections, which
 *                            already have a video URL picked from their
 *                            own state (current / hovered carousel idx).
 *
 * If neither is set, the backdrop's video layer fades to 0 and only
 * the #1c3424 camo fill shows.
 *
 * Nothing else uses this — if the provider is missing the defaults are
 * no-ops.
 */
export const VideoBackdropContext = createContext({
  setActiveSection: () => {},
  setActiveVideoUrl: () => {},
});
