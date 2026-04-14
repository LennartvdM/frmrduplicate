/**
 * /publications — native React. Uses the shared BlogPage layout;
 * content lives in data/publicationsPage.js and is unchanged.
 */
import React from 'react';
import BlogPage from '../components/shared/BlogPage';
import { sections, sectionToVideo, deckSources } from '../data/publicationsPage';

export default function PublicationsPage() {
  return (
    <BlogPage
      sections={sections}
      sectionToVideo={sectionToVideo}
      deckSources={deckSources}
    />
  );
}
