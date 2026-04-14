/**
 * Publications — uses the shared BlogPage layout.
 * Content lives in data/publicationsPage.js; layout lives in components/shared/BlogPage.
 */
import React from 'react';
import { BlogPage } from '../components/shared';
import {
  sections,
  sectionToVideo,
  deckSources,
} from '../data/publicationsPage';

export default function PublicationsPage() {
  return (
    <BlogPage
      sections={sections}
      sectionToVideo={sectionToVideo}
      deckSources={deckSources}
    />
  );
}
