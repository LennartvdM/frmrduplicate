import React, { lazy, Suspense } from 'react';
import ScrollSnap from '../components/ScrollSnap';
import SectionManager from '../components/SectionManager';
import Footer from '../components/Footer';

// Eagerly load the intro section for fast initial paint
import IntroSection from '../components/sections/IntroSection';

// Lazy load heavy sections to reduce initial bundle
const MedicalSectionV2 = lazy(() => import('../components/sections/MedicalSectionV2'));
const MedicalSectionV3 = lazy(() => import('../components/sections/MedicalSectionV3'));
import WorldMapEmbed from '../components/sections/WorldMapEmbed';
const ContactSection = lazy(() => import('../components/sections/ContactSection'));

const LazySection = ({ component: Component, ...props }) => (
  <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#1c3424' }} />}>
    <Component {...props} />
  </Suspense>
);

const LazyMedicalV2 = (props) => <LazySection component={MedicalSectionV2} {...props} />;
const LazyMedicalV3 = (props) => <LazySection component={MedicalSectionV3} {...props} />;
const LazyWorldMap = () => <WorldMapEmbed />;
const LazyContact = (props) => <LazySection component={ContactSection} {...props} />;

const sections = [
  { name: 'intro', component: IntroSection },
  { name: 'two', component: LazyMedicalV2 },
  { name: 'three', component: LazyMedicalV3 },
  { name: 'four', component: LazyWorldMap },
  { name: 'five', component: LazyContact },
];

const Home = () => {
  return (
    <>
      <ScrollSnap>
        <SectionManager sections={sections} />
      </ScrollSnap>
      <Footer />
    </>
  );
};

export default Home;
