import React from 'react';
import ScrollSection from './ScrollSection';

export default function SectionManager({ sections }) {
  return (
    <>
      {sections.map((section) => {
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
              const SectionComponent = section.component;
              return <SectionComponent inView={inView} sectionRef={ref} />;
            }}
          </ScrollSection>
        );
      })}
    </>
  );
}
