/**
 * /neoflix — native React. Uses the shared BlogPage layout; content
 * lives in data/neoflixPage.js and is unchanged.
 */
import React from 'react';
import BlogPage from '../components/shared/BlogPage';
import { sections, sectionToVideo, deckSources } from '../data/neoflixPage';

export default function NeoflixPage() {
  return (
    <BlogPage
      sections={sections}
      sectionToVideo={sectionToVideo}
      deckSources={deckSources}
    />
  );
}
