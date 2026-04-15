/**
 * /publications — native React. Uses the shared BlogPage layout;
 * content lives in data/publicationsPage.js and is unchanged. Video
 * backdrop is mounted at AppShell level (SharedVideoBackdrop).
 */
import React from 'react';
import BlogPage from '../components/shared/BlogPage';
import { sections } from '../data/publicationsPage';

export default function PublicationsPage() {
  return <BlogPage sections={sections} />;
}
