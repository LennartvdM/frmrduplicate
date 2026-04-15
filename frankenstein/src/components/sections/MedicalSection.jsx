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
    if (!isActive) {
      // Clear on leave so the intro slide / worldmap / toolbox don't
      // inherit the last medical video. The next active section
      // (medical or blog) will publish its own URL; briefly crossing
      // null is fine — the backdrop's video layer just dips toward 0
      // and rides the crossfade back up.
      setActiveVideoUrl(null);
      return undefined;
    }
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
