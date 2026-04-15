// redeploy marker: 2025-10-31T00:00:00Z
import React from 'react';
import { useMedicalSection } from './medical/useMedicalSection.jsx';
import MedicalTabletLayout from './medical/MedicalTabletLayout';
import MedicalDesktopLayout from './medical/MedicalDesktopLayout';
import { useBackdropTarget } from '../../backdrop/useBackdrop';
import { MEDICAL_V2_DECK, MEDICAL_V3_DECK } from '../../backdrop/decks';

const DECK_BY_VARIANT = {
  v2: MEDICAL_V2_DECK,
  v3: MEDICAL_V3_DECK,
};

const MedicalSection = ({ inView, sectionRef, variant = 'v2' }) => {
  const state = useMedicalSection({ inView, variant });
  const { currentVideo, hoveredIndex, interactionsEnabled } = state;

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
    return <MedicalTabletLayout {...state} sectionRef={sectionRef} />;
  }

  return <MedicalDesktopLayout {...state} sectionRef={sectionRef} />;
};

export default MedicalSection;
