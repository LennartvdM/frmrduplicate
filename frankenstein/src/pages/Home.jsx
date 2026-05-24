import React, { lazy, Suspense } from 'react';
import ScrollSnap from '../components/ScrollSnap';
import SectionManager from '../components/SectionManager';
import Footer from '../components/Footer';

// Eagerly load the intro section for fast initial paint
import IntroSection from '../components/sections/IntroSection';
// Vimeo slide is light (one lazy iframe) and shares the intro's drop hook,
// so load it eagerly — a Suspense fallback would flash dark on its pale fill.
import VimeoSection from '../components/sections/VimeoSection';

// Lazy load heavy sections to reduce initial bundle
const MedicalSectionV2 = lazy(() => import('../components/sections/MedicalSectionV2'));
const MedicalSectionV3 = lazy(() => import('../components/sections/MedicalSectionV3'));
const WorldMapSection = lazy(() => import('../components/sections/worldmap/WorldMapSection'));

const LazySection = ({ component: Component, ...props }) => (
  <Suspense fallback={<div style={{ width: '100%', height: '100%', background: '#1c3424' }} />}>
    <Component {...props} />
  </Suspense>
);

const LazyMedicalV2 = (props) => <LazySection component={MedicalSectionV2} {...props} />;
const LazyMedicalV3 = (props) => <LazySection component={MedicalSectionV3} {...props} />;
const LazyWorldMap = (props) => <LazySection component={WorldMapSection} {...props} />;

const sections = [
  { name: 'intro', component: IntroSection },
  { name: 'two', component: LazyMedicalV2 },
  { name: 'three', component: LazyMedicalV3 },
  { name: 'reel', component: VimeoSection },
  { name: 'worldmap', component: LazyWorldMap },
];

const Home = () => {
  // Footer sits inside ScrollSnap so scrolling past the last section reveals
  // it. Its scroll-snap-align:end makes it a reachable snap target without
  // becoming its own full slide.
  return (
    <ScrollSnap>
      <SectionManager sections={sections} />
      <Footer />
    </ScrollSnap>
  );
};

export default Home;
