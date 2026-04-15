import React from 'react';
import { IntroSlide } from 'neoflix-intro-card';
import { useTabletLayout } from '../../hooks/useTabletLayout';
import HeroScrollCue from '../HeroScrollCue';

const IntroSection = ({ inView }) => {
  const { isTablet, isTouchDevice, width } = useTabletLayout();

  // No backdrop publish needed. Under BackdropEngine, Home's 4-cell
  // y-stack is laid out by position — Intro is cell 0 (camo) by
  // construction. The engine translates the stack by
  // scrollContainer.scrollTop / viewportHeight, so the camo cell
  // already shows when the user is parked on (or scrolling toward)
  // the intro slide. Nothing for this component to signal.

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
