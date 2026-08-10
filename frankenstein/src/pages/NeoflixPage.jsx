/**
 * /neoflix — native React. Uses the shared BlogPage layout; content
 * lives in data/neoflixPage.js and is unchanged.
 *
 * Also serves /contact via App.jsx — that route passes `scrollTo="contact"`
 * so the same page lands on the contact section. The video backdrop is
 * mounted once at AppShell level (SharedVideoBackdrop) and crossfades
 * based on the active section, independent of route slides.
 */
import React from 'react';
import BlogPage from '../components/shared/BlogPage';
import MobileNeoflixPage from '../components/mobile/MobileNeoflixPage';
import useTabletLayout from '../hooks/useTabletLayout';
import { sections } from '../data/neoflixPage';

export default function NeoflixPage({ scrollTo }) {
  const { width } = useTabletLayout();

  if (width > 0 && width < 600) {
    return <MobileNeoflixPage sections={sections} scrollTo={scrollTo} />;
  }

  return <BlogPage sections={sections} scrollTo={scrollTo} pageTitle="Record. Reflect. Refine." />;
}
