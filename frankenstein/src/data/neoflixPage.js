/**
 * Neoflix Product Page Data
 * Content sourced from neoflixexporttest (source of truth)
 * Layout/styling matches frmrduplicate's Neoflix design
 *
 * Note: the product/philosophy sections (time-sensitive, dance, cost,
 * skills, team, perspectives) live here for the /neoflix route.
 * The academic publications live in publicationsPage.js for /publications.
 */
import { assetUrl } from '../utils/assetUrl';

// Re-export the product sections from publications.js
// (bashtest named the file confusingly but the content is correct)
export { sections, animationConfig } from './publications';

// Video backdrop mapping for product sections
export const sectionToVideo = {
  'time-sensitive': assetUrl('/videos/blururgency.mp4'),
  'like-a-dance': assetUrl('/videos/blurcoordination.mp4'),
  'cost': assetUrl('/videos/blurfocus.mp4'),
  'sharpening': assetUrl('/videos/blursskills.mp4'),
  'team-dynamics': assetUrl('/videos/blurteam.mp4'),
  'perspectives': assetUrl('/videos/blurperspectives.mp4'),
  'contact': assetUrl('/videos/blurcoordination.mp4'),
};

// Video deck sources for preloading
export const deckSources = [
  assetUrl('/videos/blurcoordination.mp4'),
  assetUrl('/videos/blurfocus.mp4'),
  assetUrl('/videos/blurperspectives.mp4'),
  assetUrl('/videos/blursskills.mp4'),
  assetUrl('/videos/blurteam.mp4'),
  assetUrl('/videos/blururgency.mp4'),
];

// Page styling — matches frmrduplicate's Neoflix design (warm brown)
export const pageStyle = {
  backgroundColor: '#483226',
  sidebarClassName: 'bg-[#112038]',
  sectionStyle: {
    background: 'linear-gradient(135deg, rgba(250,250,249,0.85), rgba(253,244,255,0.85))',
  },
};
