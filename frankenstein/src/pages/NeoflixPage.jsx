/**
 * Neoflix — uses the shared BlogPage layout (same module as /publications).
 * Only the content differs: product sections live in data/neoflixPage.js.
 */
import React from 'react';
import { BlogPage } from '../components/shared';
import {
  sections,
  sectionToVideo,
  deckSources,
} from '../data/neoflixPage';

export default function NeoflixPage() {
  return (
    <BlogPage
      sections={sections}
      sectionToVideo={sectionToVideo}
      deckSources={deckSources}
    />
  );
}
