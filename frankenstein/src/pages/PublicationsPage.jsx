/**
 * /publications — native React. Uses the shared BlogPage layout;
 * content lives in data/publicationsPage.js and is unchanged. Video
 * backdrop is mounted at AppShell level (SharedVideoBackdrop).
 */
import React from 'react';
import BlogPage from '../components/shared/BlogPage';
import MobilePublicationsPage from '../components/mobile/MobilePublicationsPage';
import useTabletLayout from '../hooks/useTabletLayout';
import Seo from '../seo/Seo';
import { staticRouteMeta, withBrand } from '../seo/siteMeta';
import { sections } from '../data/publicationsPage';

const meta = staticRouteMeta('/publications');

export default function PublicationsPage() {
  const { width } = useTabletLayout();

  const seo = (
    <Seo title={withBrand(meta.title)} description={meta.description} path="/publications" />
  );

  if (width > 0 && width < 600) {
    return (
      <>
        {seo}
        <MobilePublicationsPage sections={sections} />
      </>
    );
  }

  return (
    <>
      {seo}
      <BlogPage sections={sections} heading={meta.heading} />
    </>
  );
}
