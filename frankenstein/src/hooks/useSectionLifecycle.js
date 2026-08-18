import { useState, useEffect, useRef } from 'react';

export const useSectionLifecycle = (sectionId, inView) => {
  const [sectionState, setSectionState] = useState('idle'); // idle, entering, active, preserving, cleaned
  const cleanupTimerRef = useRef(null);
  const entranceTimerRef = useRef(null);
  const entranceCompleteRef = useRef(false);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (inView) {
        setSectionState('entering');
        entranceCompleteRef.current = false;
        
        if (entranceTimerRef.current) {
          clearTimeout(entranceTimerRef.current);
        }
        
        entranceTimerRef.current = setTimeout(() => {
          entranceCompleteRef.current = true;
          setSectionState('active');
        }, 4000);
      }
      return;
    }

    if (inView && (sectionState === 'idle' || sectionState === 'cleaned')) {
      // Section comes into view — either for the first time or again
      // after cleanup. 'cleaned' used to be a dead end: scroll past a
      // section, wait out the 4s preserve window, scroll back, and the
      // section stayed invisible (opacity 0) for the rest of the
      // session because no branch ever left 'cleaned'.
      setSectionState('entering');
      entranceCompleteRef.current = false;
      
      // Clear any existing entrance timer
      if (entranceTimerRef.current) {
        clearTimeout(entranceTimerRef.current);
      }
      
      entranceTimerRef.current = setTimeout(() => {
        entranceCompleteRef.current = true;
        setSectionState('active');
      }, 4000);
    } else if (!inView && (sectionState === 'entering' || sectionState === 'active')) {
      // Section leaves view - start preservation period
      setSectionState('preserving');
      
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
      
      cleanupTimerRef.current = setTimeout(() => {
        setSectionState('cleaned');
      }, 4000);
    } else if (inView && sectionState === 'preserving') {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }
      setSectionState(entranceCompleteRef.current ? 'active' : 'entering');
    }

    return () => {
      if (cleanupTimerRef.current) {
        clearTimeout(cleanupTimerRef.current);
      }
      if (entranceTimerRef.current) {
        clearTimeout(entranceTimerRef.current);
      }
    };
  }, [inView, sectionState, sectionId]);

  return {
    sectionState,
    isVisible: true, // Always render the component, let the section handle its own visibility
    shouldAnimate: sectionState === 'entering',
    isActive: sectionState === 'active',
    isPreserved: sectionState === 'preserving'
  };
}; 