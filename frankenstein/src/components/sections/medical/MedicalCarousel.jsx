import React, { useRef, useEffect, memo } from "react";
import { assetUrl } from "../../../utils/assetUrl";
import { decorativeVideoProps } from '../../../utils/decorativeVideoProps';

const AUTOPLAY_MS = 6600; // 6.6 seconds

// Default slides if no videos prop is provided
const defaultSlides = [
  { id: "0", video: assetUrl("/videos/urgency.mp4"), alt: "Medical urgency demonstration" },
  { id: "1", video: assetUrl("/videos/coordination.mp4"), alt: "Medical team coordination" },
  { id: "2", video: assetUrl("/videos/focus.mp4"), alt: "Medical focus and precision" },
];

const headlines = [
  {
    firstLine: "Medical interventions demand",
    secondLine: "precision and urgency."
  },
  {
    firstLine: "Which makes coordination within",
    secondLine: "teams vital for success."
  },
  {
    firstLine: "Task‑driven focus can lead to",
    secondLine: "tunnel vision and misalignment."
  }
];

/*
IMPORTANT: This is NOT a crossfade - it's a sequential card removal system.
State 0: A=100%, B=100% (stacked on top of each other)
State 1: A=0%, B=100% (remove top card A)
State 2: A=0%, B=0% (remove card B, reveal base C)

DO NOT "fix" this to crossfade between A and B.
The stacking is intentional to avoid ugly transitions.
*/

const MedicalCarousel = memo(function MedicalCarousel({ current, hoveredIndex, isActive, videoHover, setVideoHover, interactionsEnabled, videos, enableTouchNavigation, onTouchChange, sectionActive = true, onCarouselClick, onReady }) {
  const videoRefs = useRef([null, null, null]);
  const [deckLoaded, setDeckLoaded] = React.useState(false);

  // Use videos prop if provided, otherwise fallback to default slides
  const videoSlides = videos || defaultSlides;

  // Defer loading of lower deck videos - load top video first, then rest after a grace period
  useEffect(() => {
    const timer = setTimeout(() => setDeckLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  // Pause/play videos based on visibility - only play the topmost visible video
  // Video 0 is on top, covers 1 and 2. Video 1 covers 2. No need to decode hidden videos.
  // When section is off-screen, pause ALL videos to free GPU decode.
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (sectionActive && (idx === current || idx === 2)) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [current, deckLoaded, sectionActive]);

  // Real readiness signal. The parent gates interaction on this instead of a
  // fixed timer that just hopes the footage finished loading. Each clip reports
  // when it can show a frame (or errors); once all three are settled we tell the
  // parent the carousel is genuinely ready.
  const onReadyFiredRef = useRef(false);
  const readyIdxRef = useRef(new Set());
  const markReady = (idx) => {
    if (onReadyFiredRef.current) return;
    readyIdxRef.current.add(idx);
    if (readyIdxRef.current.has(0) && readyIdxRef.current.has(1) && readyIdxRef.current.has(2)) {
      onReadyFiredRef.current = true;
      onReady?.();
    }
  };

  useEffect(() => {
    // Count clips already buffered before these handlers attached (cache, or a
    // fast re-mount when scrolling back to the section).
    videoRefs.current.forEach((v, idx) => {
      if (v && v.readyState >= 2) markReady(idx); // HAVE_CURRENT_DATA = first frame
    });
    // Failsafe: never leave interaction wedged off if a load event never lands.
    const failsafe = setTimeout(() => {
      if (!onReadyFiredRef.current) {
        onReadyFiredRef.current = true;
        onReady?.();
      }
    }, 15000);
    return () => clearTimeout(failsafe);
  }, []);

  return (
    <div 
      className="inline-flex flex-row items-center mx-auto w-full relative" 
      style={{
        position: 'relative', 
        minHeight: '0px',
        minWidth: '0px',
        maxWidth: '480px',
        width: '100%',
        height: 'auto',
        aspectRatio: '3 / 2',
        cursor: interactionsEnabled ? 'pointer' : 'default'
      }}
      onMouseEnter={() => interactionsEnabled && setVideoHover?.(true)}
      onMouseLeave={() => interactionsEnabled && setVideoHover?.(false)}
      onClick={onCarouselClick ? () => onCarouselClick(current) : undefined}
      role={onCarouselClick ? 'link' : undefined}
    >
      {/* Static base video (focus) as persistent background */}
      <div
        className="absolute inset-0 flex items-center justify-center z-0"
        style={{
          borderRadius: '16px',
          overflow: 'hidden',
        }}
      >
        <video
          {...decorativeVideoProps}
          ref={el => { videoRefs.current[2] = el; }}
          src={deckLoaded ? videoSlides[2].video : undefined}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          alt={videoSlides[2].alt}
          tabIndex="-1"
          aria-hidden="true"
          draggable="false"
          onLoadedData={() => markReady(2)}
          onError={() => markReady(2)}
          style={{
            outline: 'none',
            transition: 'outline 0.2s',
            background: 'none',
            opacity: 1
          }}
        />
      </div>

      {/* Overlay videos that stack and remove sequentially */}
      {[0, 1].map((i) => {
        // Calculate opacity based on current state
        let opacity = 1;
        if (current === 0) {
          // State 0: Both videos at 100%
          opacity = 1;
        } else if (current === 1) {
          // State 1: First video at 0%, second at 100%
          opacity = i === 0 ? 0 : 1;
        } else {
          // State 2: Both videos at 0%
          opacity = 0;
        }

        return (
          <div
            key={videoSlides[i].id}
            className="absolute inset-0 flex items-center justify-center transition-opacity" // Remove duration-700, use style transition below
            style={{ 
              pointerEvents: i === current ? 'auto' : 'none', 
              background: 'none', 
              borderRadius: '16px', 
              overflow: 'hidden',
              zIndex: 2 - i, // Reverse the z-index so urgency (0) is on top of coordination (1)
              opacity: opacity,
              transition: 'opacity 1.2s cubic-bezier(0.4,0,0.2,1)' // Slower fade
            }}
          >
            <video
              {...decorativeVideoProps}
              ref={el => { videoRefs.current[i] = el; }}
              src={i === 0 || deckLoaded ? videoSlides[i].video : undefined}
              className="w-full h-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              alt={videoSlides[i].alt}
              tabIndex="-1"
              aria-hidden="true"
              draggable="false"
              onLoadedData={() => markReady(i)}
              onError={() => markReady(i)}
              style={{
                outline: 'none',
                transition: 'outline 0.2s',
                background: 'none',
                opacity: 1, // Video itself is always at full opacity
                willChange: 'opacity'
              }}
            />
          </div>
        );
      })}
      {/* Touch navigation overlay for landscape tablets */}
      {enableTouchNavigation && (
        <>
          <button
            aria-label="Previous"
            onClick={(e) => { e.stopPropagation(); onTouchChange?.((current - 1 + videoSlides.length) % videoSlides.length); }}
            style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '15%', background: 'transparent', border: 'none', zIndex: 99, cursor: 'pointer' }}
          />
          <button
            aria-label="Next"
            onClick={(e) => { e.stopPropagation(); onTouchChange?.((current + 1) % videoSlides.length); }}
            style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: '15%', background: 'transparent', border: 'none', zIndex: 99, cursor: 'pointer' }}
          />
        </>
      )}
    </div>
  );
});

export default MedicalCarousel;