import React, { useRef, useEffect, useState } from 'react';
import ScrollSection from './ScrollSection';

export default function SectionManager({ sections }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Single shared IntersectionObserver for all sections
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target);
            if (idx !== -1) setCurrentIdx(idx);
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref instanceof Element) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, [sections.length]);

  return (
    <>
      {sections.map((section, idx) => {
        // Medical sections used to set their own #1c3424 bg to prevent
        // a white flash during loading. The site-wide BackdropProvider
        // now fills with #1c3424 behind the video deck and covers the
        // whole viewport, so sections stay transparent — that lets the
        // backdrop's videos show through on the medical sections.
        return (
          <ScrollSection
            key={section.name}
            name={section.name}
          >
            {({ inView, ref }) => {
              sectionRefs.current[idx] = ref;
              const SectionComponent = section.component;
              return <SectionComponent inView={inView} sectionRef={ref} />;
            }}
          </ScrollSection>
        );
      })}
    </>
  );
} 