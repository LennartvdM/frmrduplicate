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
import Seo from '../seo/Seo';
import { staticRouteMeta, withBrand } from '../seo/siteMeta';
import { sections } from '../data/neoflixPage';

export default function NeoflixPage({ scrollTo }) {
  const { width } = useTabletLayout();

  // /contact renders this same component; its meta canonicalises back to
  // /neoflix so the two URLs don't compete for identical content.
  const meta = staticRouteMeta(scrollTo === 'contact' ? '/contact' : '/neoflix');

  const seo = (
    <Seo
      title={withBrand(meta.title)}
      description={meta.description}
      path={meta.canonical || meta.path}
    />
  );

  if (width > 0 && width < 600) {
    return (
      <>
        {seo}
        <MobileNeoflixPage sections={sections} scrollTo={scrollTo} />
      </>
    );
  }

  return (
    <>
      {seo}
      <BlogPage sections={sections} scrollTo={scrollTo} heading={meta.heading} />
    </>
  );
}
