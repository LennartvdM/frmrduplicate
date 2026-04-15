/**
 * /neoflix — native React. Uses the shared BlogPage layout; content
 * lives in data/neoflixPage.js and is unchanged.
 *
 * Also serves /contact via App.jsx — that route passes `scrollTo="contact"`
 * so the same page lands on the contact section. The horizontal slide in
 * RouteTransition makes that re-mount read like its own page.
 */
import React from 'react';
import BlogPage from '../components/shared/BlogPage';
import { sections, sectionToVideo, deckSources } from '../data/neoflixPage';

export default function NeoflixPage({ scrollTo }) {
  return (
    <BlogPage
      sections={sections}
      sectionToVideo={sectionToVideo}
      deckSources={deckSources}
      scrollTo={scrollTo}
    />
  );
}
