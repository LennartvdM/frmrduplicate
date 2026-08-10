import React, { useRef, useEffect, memo } from 'react';
import IllustrationCanvas from '../../shared/IllustrationCanvas';

const TabletMedicalCarousel = memo(function TabletMedicalCarousel({ videos = [], current = 0, onChange, onPauseChange, className, style, sectionActive = true, onCarouselClick }) {
  const containerRef = useRef(null);
  const [deckLoaded, setDeckLoaded] = React.useState(false);

  // Defer loading of lower deck videos - load top video first, then rest after grace period
  useEffect(() => {
    const timer = setTimeout(() => setDeckLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Only the topmost visible clip (current) and the base (2) decode; the
  // others are stacked underneath where nobody can see them. When the
  // section is off-screen, nothing decodes.
  const shouldPlay = (idx) => sectionActive && (idx === current || idx === 2);

  // Ensure there are 3 valid slides
  const videoSlides = [
    videos[0] || {},
    videos[1] || videos[0] || {},
    videos[2] || videos[1] || videos[0] || {},
  ];

  // Opacity logic: upper cards (>= current) are visible, lower (< current) fade away
  const getOpacity = idx => (idx >= current ? 1 : 0);
  const getZ = idx => 10 - idx; // Higher z for upper layers

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ position: 'relative', touchAction: 'pan-y', cursor: onCarouselClick ? 'pointer' : undefined, ...style }}
      onClick={onCarouselClick ? () => onCarouselClick(current) : undefined}
      role={onCarouselClick ? 'link' : undefined}
    >
      {[2, 1, 0].map(i => (
        <div
          key={videoSlides[i]?.id || i}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 16,
            overflow: 'hidden',
            zIndex: getZ(i),
            opacity: getOpacity(i),
            background: 'none',
            boxShadow: '0 0 0 1px var(--edge-1d)',
            transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)',
            pointerEvents: i === current ? 'auto' : 'none',
          }}
        >
          <IllustrationCanvas
            src={i === 0 || deckLoaded ? videoSlides[i]?.video : undefined}
            play={shouldPlay(i)}
            preload="metadata"
            className="w-full h-full object-cover"
            style={{ outline: 'none', background: 'none', width: '100%', height: '100%' }}
          />
        </div>
      ))}
      {/* Left/Right tap zones for navigation */}
      <button
        aria-label="Previous"
        onClick={(e) => { e.stopPropagation(); onChange?.((current - 1 + videos.length) % videos.length); }}
        style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '15%', background: 'transparent', border: 'none', zIndex: 99 }}
      />
      <button
        aria-label="Next"
        onClick={(e) => { e.stopPropagation(); onChange?.((current + 1) % videos.length); }}
        style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '15%', background: 'transparent', border: 'none', zIndex: 99 }}
      />
    </div>
  );
});

export default TabletMedicalCarousel;
