// redeploy marker: 2025-10-31T00:00:00Z
import React, { useContext, useEffect } from 'react';
import { useMedicalSection } from './medical/useMedicalSection.jsx';
import MedicalTabletLayout from './medical/MedicalTabletLayout';
import MedicalDesktopLayout from './medical/MedicalDesktopLayout';
import { VideoBackdropContext } from '../../context/VideoBackdropContext';

const MedicalSection = ({ inView, sectionRef, variant = 'v2' }) => {
  const state = useMedicalSection({ inView, variant });
  const { blurVideos, currentVideo, hoveredIndex, interactionsEnabled } = state;

  // Publish this cell's current carousel-top URL to the BackdropEngine.
  // Under the new architecture each medical variant owns its own cell
  // in Home's 4-cell y-stack; the engine renders all four cells at all
  // times (Intro and WorldMap as camo, V2/V3 as video decks) and
  // translates them with the Home scroll-snap container's scrollTop.
  // So V2 and V3 should BOTH always publish the URL they'd be showing
  // if active — it's fine, they're on independent cells, they can't
  // clobber each other. (Previous SharedVideoBackdrop architecture had
  // them all write into one pile, which is why the old code gated on
  // isActive.)
  const { setMedicalCarouselTop } = useContext(VideoBackdropContext);
  useEffect(() => {
    const safeHover = interactionsEnabled ? hoveredIndex : null;
    const idx = safeHover !== null ? safeHover : currentVideo;
    const url = blurVideos?.[idx]?.video ?? null;
    setMedicalCarouselTop(variant, url);
  }, [variant, currentVideo, hoveredIndex, interactionsEnabled, blurVideos, setMedicalCarouselTop]);

  if (state.isTabletLayout) {
    return <MedicalTabletLayout {...state} sectionRef={sectionRef} />;
  }

  return <MedicalDesktopLayout {...state} sectionRef={sectionRef} />;
};

export default MedicalSection;
