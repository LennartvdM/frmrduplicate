// redeploy marker: 2025-10-31T00:00:00Z
import React, { useContext, useEffect } from 'react';
import { useMedicalSection } from './medical/useMedicalSection.jsx';
import MedicalTabletLayout from './medical/MedicalTabletLayout';
import MedicalDesktopLayout from './medical/MedicalDesktopLayout';
import { VideoBackdropContext } from '../../context/VideoBackdropContext';

const MedicalSection = ({ inView, sectionRef, variant = 'v2' }) => {
  const state = useMedicalSection({ inView, variant });
  const { blurVideos, currentVideo, hoveredIndex, interactionsEnabled, isActive } = state;

  // Publish the current blur-video URL up to the single site-wide
  // SharedVideoBackdrop at AppShell level. The shared backdrop then
  // crossfades via deck-of-cards just like it does for BlogPage,
  // using the same video pool — no separate medical deck, no
  // side-by-side "two decks" during route transitions.
  const { setActiveVideoUrl } = useContext(VideoBackdropContext);
  useEffect(() => {
    // Only the ACTIVE section publishes. Inactive siblings stay silent —
    // all medical sections are mounted at once (scroll-snap keeps them
    // in DOM) so having each inactive one clear the URL caused the
    // last-rendered sibling to blank whatever the active one had just
    // published. Intro / worldmap handle "back to no video" by
    // publishing null themselves when they come into view.
    if (!isActive) return undefined;
    const safeHover = interactionsEnabled ? hoveredIndex : null;
    const idx = safeHover !== null ? safeHover : currentVideo;
    const url = blurVideos?.[idx]?.video ?? null;
    setActiveVideoUrl(url);
    return undefined;
  }, [isActive, currentVideo, hoveredIndex, interactionsEnabled, blurVideos, setActiveVideoUrl]);

  if (state.isTabletLayout) {
    return <MedicalTabletLayout {...state} sectionRef={sectionRef} />;
  }

  return <MedicalDesktopLayout {...state} sectionRef={sectionRef} />;
};

export default MedicalSection;
