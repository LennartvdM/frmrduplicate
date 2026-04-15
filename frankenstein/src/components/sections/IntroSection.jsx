import React, { useContext, useEffect } from 'react';
import { IntroSlide } from 'neoflix-intro-card';
import { useTabletLayout } from '../../hooks/useTabletLayout';
import HeroScrollCue from '../HeroScrollCue';
import { VideoBackdropContext } from '../../context/VideoBackdropContext';

const IntroSection = ({ inView }) => {
  const { isTablet, isTouchDevice, width } = useTabletLayout();

  // Clear the shared video backdrop's target when the intro is the
  // section in view. Medical sections only publish while active (they
  // don't blank on deactivation, to avoid sibling clobber), so intro
  // owning the "no video here" signal is how the camo comes back when
  // the user scrolls up from a medical section.
  const { setActiveVideoUrl } = useContext(VideoBackdropContext);
  useEffect(() => {
    if (inView) setActiveVideoUrl(null);
  }, [inView, setActiveVideoUrl]);

  let variant = 'desktop';
  if (isTouchDevice && width < 600) {
    variant = 'mobile';
  } else if (isTablet) {
    variant = 'tablet';
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <IntroSlide
        variant={variant}
        backgroundColor="#F5F9FC"
        fullHeight={false}
        subtitle="Improve patient care through video reflection."
        style={{
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, #FFFFFF, #F5F9FC)',
        }}
      />
      <HeroScrollCue />
    </div>
  );
};

export default IntroSection;
