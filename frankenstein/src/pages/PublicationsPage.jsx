/**
 * /publications — native React. Uses the shared BlogPage layout;
 * content lives in data/publicationsPage.js and is unchanged. Video
 * backdrop is mounted at AppShell level (SharedVideoBackdrop).
 */
import React from 'react';
import BlogPage from '../components/shared/BlogPage';
import MobilePublicationsPage from '../components/mobile/MobilePublicationsPage';
import useTabletLayout from '../hooks/useTabletLayout';
import { sections } from '../data/publicationsPage';

export default function PublicationsPage() {
  const { width } = useTabletLayout();

  if (width > 0 && width < 600) {
    return <MobilePublicationsPage sections={sections} />;
  }

  return <BlogPage sections={sections} />;
}
