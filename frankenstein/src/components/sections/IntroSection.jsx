import React from 'react';
import { IntroSlide } from 'neoflix-intro-card';
import { useTabletLayout } from '../../hooks/useTabletLayout';
import HeroScrollCue from '../HeroScrollCue';

const IntroSection = () => {
  const { isTablet, isTouchDevice, width } = useTabletLayout();

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
