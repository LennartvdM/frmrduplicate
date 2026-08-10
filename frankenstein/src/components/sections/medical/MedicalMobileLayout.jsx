import React, { useEffect, useRef, useState } from 'react';
import { decorativeVideoProps } from '../../../utils/decorativeVideoProps';

const SLIDE_GUTTER = 20;
const SLIDE_RATIO = 3 / 2;

export default function MedicalMobileLayout({
  sectionRef,
  layoutKey,
  shouldTransition,
  // config
  mainVideos,
  headlines,
  header,
  // visibility
  headerVisible,
  videoVisible,
  captionsVisible,
  // state
  currentVideo,
  // handlers
  handleTabletCarouselChange,
  navigateToSection,
}) {
  const trackRef = useRef(null);
  const slideRefs = useRef([]);
  const videoRefs = useRef([]);
  const userScrollingRef = useRef(false);
  const userScrollTimerRef = useRef(null);
  const programmaticScrollRef = useRef(false);

  const [activeSlide, setActiveSlide] = useState(currentVideo);

  // Carousel index → autoplay/backdrop sync. The shared autoplay loop
  // in useMedicalSection ticks `currentVideo`; mirror that into the
  // scroll position when the user isn't actively dragging.
  useEffect(() => {
    if (userScrollingRef.current) return;
    const track = trackRef.current;
    const slide = slideRefs.current[currentVideo];
    if (!track || !slide) return;
    programmaticScrollRef.current = true;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    setActiveSlide(currentVideo);
    const id = setTimeout(() => { programmaticScrollRef.current = false; }, 600);
    return () => clearTimeout(id);
  }, [currentVideo]);

  // Pause non-active videos to keep GPU decode budget tight.
  useEffect(() => {
    videoRefs.current.forEach((video, idx) => {
      if (!video) return;
      if (idx === activeSlide) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
  }, [activeSlide]);

  // Detect which slide the user has snapped to. rAF-coalesced.
  const rafRef = useRef(0);
  const handleScroll = () => {
    if (rafRef.current) return;
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = 0;
      readScroll();
    });
  };
  const readScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    if (!programmaticScrollRef.current) {
      userScrollingRef.current = true;
      if (userScrollTimerRef.current) clearTimeout(userScrollTimerRef.current);
      userScrollTimerRef.current = setTimeout(() => {
        userScrollingRef.current = false;
      }, 250);
    }
    const slideWidth = track.clientWidth;
    const idx = Math.round(track.scrollLeft / slideWidth);
    if (idx !== activeSlide && idx >= 0 && idx < mainVideos.length) {
      setActiveSlide(idx);
      handleTabletCarouselChange?.(idx);
    }
  };

  return (
    <div
      key={layoutKey}
      ref={sectionRef}
      className="w-full relative overflow-hidden"
      style={{
        height: '100dvh',
        background: 'transparent',
      }}
    >
      <div
        style={{
          paddingTop: 'calc(var(--nav-h, 60px) + 12px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 24px)',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Heading */}
        <div
          style={{
            paddingLeft: SLIDE_GUTTER,
            paddingRight: SLIDE_GUTTER,
            opacity: headerVisible ? 1 : 0,
            transition: shouldTransition ? 'opacity 1.2s ease' : 'none',
          }}
        >
          <h2
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: -1,
              lineHeight: 1.15,
              color: '#fff',
              margin: 0,
              textShadow: '0 2px 16px rgba(0,0,0,0.22), 0 1px 2px rgba(0,0,0,0.18)',
            }}
          >
            <span>{header.line1}</span>
            {header.line1suffix ? <span>{header.line1suffix}</span> : <br />}
            <span style={{ color: '#48c1c4' }}>{header.line2highlight}</span>
            <span>{header.line2suffix}</span>
            <br />
            <span>{header.line3}</span>
            {header.line4 && (<><br /><span>{header.line4}</span></>)}
          </h2>
        </div>

        {/* Horizontal scroll-snap slider */}
        <div
          data-dot-nav-target
          style={{
            flex: '1 1 auto',
            minHeight: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <div
            ref={trackRef}
            onScroll={handleScroll}
            style={{
              width: '100%',
              display: 'flex',
              overflowX: 'auto',
              overflowY: 'hidden',
              scrollSnapType: 'x mandatory',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              touchAction: 'pan-x pan-y',
              overscrollBehaviorX: 'contain',
              opacity: videoVisible ? 1 : 0,
              transition: shouldTransition ? 'opacity 1.2s ease' : 'none',
              scrollbarWidth: 'none',
            }}
          >
            {mainVideos.map((video, idx) => (
              <div
                key={video.id || idx}
                ref={(el) => { slideRefs.current[idx] = el; }}
                style={{
                  flex: '0 0 100%',
                  scrollSnapAlign: 'center',
                  scrollSnapStop: 'always',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'stretch',
                  paddingLeft: SLIDE_GUTTER,
                  paddingRight: SLIDE_GUTTER,
                  gap: 14,
                }}
              >
                <button
                  type="button"
                  onClick={() => navigateToSection?.(idx)}
                  style={{
                    width: '100%',
                    aspectRatio: `${SLIDE_RATIO}`,
                    borderRadius: 16,
                    overflow: 'hidden',
                    position: 'relative',
                    border: 'none',
                    padding: 0,
                    background: '#000',
                    cursor: 'pointer',
                    boxShadow: '0 0 0 1px var(--edge-1d), 0 6px 24px rgba(0,0,0,0.25)',
                  }}
                  aria-label={`Open ${headlines[idx]?.firstLine || `slide ${idx + 1}`}`}
                >
                  <video
                    {...decorativeVideoProps}
                    ref={(el) => { videoRefs.current[idx] = el; }}
                    src={video.video}
                    muted
                    loop
                    playsInline
                    preload={idx === 0 ? 'metadata' : 'none'}
                    aria-hidden="true"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      pointerEvents: 'none',
                    }}
                  />
                </button>

                <p
                  style={{
                    margin: 0,
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 18,
                    fontWeight: 500,
                    lineHeight: 1.3,
                    letterSpacing: '-0.3px',
                    textAlign: 'center',
                    opacity: captionsVisible ? 1 : 0,
                    transition: shouldTransition ? 'opacity 0.5s ease' : 'none',
                  }}
                >
                  {headlines[idx]?.firstLine}
                  <br />
                  {headlines[idx]?.secondLine}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Slide indicator */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 8,
            opacity: captionsVisible ? 1 : 0,
            transition: shouldTransition ? 'opacity 0.5s ease' : 'none',
          }}
        >
          {mainVideos.map((_, idx) => (
            <button
              key={idx}
              type="button"
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => {
                const track = trackRef.current;
                const slide = slideRefs.current[idx];
                if (track && slide) {
                  programmaticScrollRef.current = true;
                  track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
                }
                handleTabletCarouselChange?.(idx);
              }}
              style={{
                width: idx === activeSlide ? 22 : 8,
                height: 8,
                borderRadius: 999,
                border: 'none',
                padding: 0,
                background: idx === activeSlide ? '#fff' : 'rgba(255,255,255,0.4)',
                transition: 'width 0.25s ease, background 0.25s ease',
                cursor: 'pointer',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
