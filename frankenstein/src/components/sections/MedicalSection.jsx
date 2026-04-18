// redeploy marker: 2025-10-31T00:00:00Z
import React, { useCallback } from 'react';
import { useMedicalSection } from './medical/useMedicalSection.jsx';
import MedicalTabletLayout from './medical/MedicalTabletLayout';
import MedicalDesktopLayout from './medical/MedicalDesktopLayout';
import { useBackdropTarget } from '../../backdrop/useBackdrop';
import { MEDICAL_V2_DECK, MEDICAL_V3_DECK } from '../../backdrop/decks';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';

const DECK_BY_VARIANT = {
  v2: MEDICAL_V2_DECK,
  v3: MEDICAL_V3_DECK,
};

const MedicalSection = ({ inView, sectionRef, variant = 'v2' }) => {
  const state = useMedicalSection({ inView, variant });
  const { currentVideo, hoveredIndex, interactionsEnabled, sectionTargets } = state;

  const transitionNavigate = useTransitionNavigate();
  // Each caption/video is a deep-link into the corresponding /neoflix
  // section. Captions and videos map 1:1 to the page's scroll anchors
  // (see data/publications.js section ids), turning the carousel into
  // a reverse-funnel entry point for the long-form article.
  const navigateToSection = useCallback((idx) => {
    const target = sectionTargets?.[idx];
    if (!target) return;
    transitionNavigate(`/neoflix#${target}`);
  }, [sectionTargets, transitionNavigate]);

  // Publish this variant's current carousel top into Home's y-stack cell.
  // V2 and V3 own independent cells; they can't clobber each other, so
  // each publishes unconditionally while mounted. Hover overrides the
  // carousel's current index when interactions are enabled.
  const safeHover = interactionsEnabled ? hoveredIndex : null;
  const topIdx = safeHover !== null ? safeHover : currentVideo;
  useBackdropTarget(`medical-${variant}`, {
    kind: 'video',
    deck: DECK_BY_VARIANT[variant],
    topIdx,
  });

  if (state.isTabletLayout) {
    return <MedicalTabletLayout {...state} sectionRef={sectionRef} navigateToSection={navigateToSection} />;
  }

  return <MedicalDesktopLayout {...state} sectionRef={sectionRef} navigateToSection={navigateToSection} />;
};

export default MedicalSection;
