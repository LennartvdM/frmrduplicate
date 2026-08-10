import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../../utils/assetUrl';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';
import { decorativeVideoProps } from '../../utils/decorativeVideoProps';
import { MOBILE_PANELS, INTRO_BLUR_POSTER, INTRO_BLUR_VIDEO } from './mobileHomeCopy.js';
import '../../styles/mobile-home.css';

const TEXT_REVEAL_DELAY_MS = 140;
const OPENING_HEADER_REVEAL_DELAY_MS = 260;
const INTRO_SEQUENCE_COUNT = 2;
/**
 * Renders the panel headline at whichever heading level the panel warrants.
 * All the styling lives on the className, so the tag is free to vary.
 */
function Headline({ tag: Tag, children, ...rest }) {
  return <Tag {...rest}>{children}</Tag>;
}

function MobileLine({ lines }) {
  return (
    <>
      {lines.map((line, lineIndex) => (
        <span className="mobile-home__line" key={lineIndex}>
          {line.map((segment, segmentIndex) => (
            <span
              key={`${segment.text}-${segmentIndex}`}
              className={`mobile-home__story-part${segment.accent ? ' mobile-home__accent' : ''}`}
              style={{ '--mobile-home-story-delay': `${segment.delay ?? lineIndex * 180}ms` }}
            >
              {segment.text}
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

function MobileChapterHeader({ header }) {
  const hasInlineDelayedGroup = Boolean(header.line1suffix);

  return (
    <>
      <span className="mobile-home__chapter-line">
        <span>{header.line1}</span>
        {hasInlineDelayedGroup && (
          <>
            <span className="mobile-home__chapter-part mobile-home__chapter-part--delayed">
              {header.line1suffix}
            </span>
            <span className="mobile-home__chapter-part mobile-home__chapter-part--delayed mobile-home__accent">
              {header.line2highlight}
            </span>
            <span className="mobile-home__chapter-part mobile-home__chapter-part--delayed">
              {header.line2suffix}
            </span>
          </>
        )}
      </span>
      {!hasInlineDelayedGroup && (
        <span className="mobile-home__chapter-line mobile-home__chapter-line--delayed">
          <span>{header.line2prefix}</span>
          <span className="mobile-home__accent">{header.line2highlight}</span>
          <span>{header.line2suffix}</span>
        </span>
      )}
      <span className="mobile-home__chapter-line mobile-home__chapter-line--delayed">
        {header.line3}
      </span>
      {header.line4 && (
        <span className="mobile-home__chapter-line mobile-home__chapter-line--delayed">
          {header.line4}
        </span>
      )}
    </>
  );
}

function headlineLabel(lines) {
  return lines
    .map((line) => line.map((segment) => segment.text).join(''))
    .join(' ');
}

export default function MobileHome() {
  const scrollRef = useRef(null);
  const sectionRefs = useRef([]);
  const videoRefs = useRef([]);
  const sharedIntroVideoRef = useRef(null);
  const activeIndexRef = useRef(0);
  const previousVideoIndexRef = useRef(null);
  const visibleTextIndexRef = useRef(null);
  const pendingRevealIndexRef = useRef(null);
  const revealTimerRef = useRef(null);
  const scrollTimerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleTextIndex, setVisibleTextIndex] = useState(null);
  const transitionNavigate = useTransitionNavigate();

  const observerOptions = useMemo(() => ({ threshold: 0.58 }), []);

  const openPanelArticle = useCallback((target) => {
    if (!target) return;
    transitionNavigate(`/neoflix#${target}`);
  }, [transitionNavigate]);

  const cancelPendingReveal = useCallback(() => {
    if (revealTimerRef.current) {
      clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
    pendingRevealIndexRef.current = null;
  }, []);

  const isPanelSettled = useCallback((index) => {
    const root = scrollRef.current;
    const section = sectionRefs.current[index];
    if (!root || !section) return false;

    return Math.abs(root.scrollTop - section.offsetTop) <= Math.max(4, root.clientHeight * 0.006);
  }, []);

  const showSlideText = useCallback((index) => {
    pendingRevealIndexRef.current = null;
    if (visibleTextIndexRef.current === index) return;
    visibleTextIndexRef.current = index;
    setVisibleTextIndex(index);
  }, []);

  const hideSlideText = useCallback(() => {
    cancelPendingReveal();
    if (visibleTextIndexRef.current === null) return;
    visibleTextIndexRef.current = null;
    setVisibleTextIndex(null);
  }, [cancelPendingReveal]);

  const scheduleSlideTextReveal = useCallback((
    index = activeIndexRef.current,
    delay = TEXT_REVEAL_DELAY_MS,
    options = {}
  ) => {
    const { requireSettled = false, attempts = 6 } = options;

    if (visibleTextIndexRef.current === index) {
      cancelPendingReveal();
      return;
    }

    cancelPendingReveal();
    pendingRevealIndexRef.current = index;

    const queueReveal = (nextDelay, remainingAttempts) => {
      revealTimerRef.current = setTimeout(() => {
        revealTimerRef.current = null;

        if (pendingRevealIndexRef.current !== index || activeIndexRef.current !== index) {
          pendingRevealIndexRef.current = null;
          return;
        }

        if (requireSettled && !isPanelSettled(index) && remainingAttempts > 0) {
          queueReveal(TEXT_REVEAL_DELAY_MS, remainingAttempts - 1);
          return;
        }

        showSlideText(index);
      }, nextDelay);
    };

    queueReveal(delay, attempts);
  }, [cancelPendingReveal, isPanelSettled, showSlideText]);

  const handleScroll = useCallback(() => {
    const root = scrollRef.current;
    if (!root) return;

    const currentIndex = activeIndexRef.current;
    const inOpeningSequence =
      root.scrollTop < root.clientHeight * INTRO_SEQUENCE_COUNT - 1;
    const visiblePanelIsStillSettled =
      visibleTextIndexRef.current === currentIndex && isPanelSettled(currentIndex);

    if (!inOpeningSequence && !visiblePanelIsStillSettled) hideSlideText();
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      scrollTimerRef.current = null;
      const revealIndex = activeIndexRef.current;
      const revealIsOpening =
        root.scrollTop < root.clientHeight * INTRO_SEQUENCE_COUNT - 1;
      const delay = revealIsOpening && revealIndex > 0
        ? OPENING_HEADER_REVEAL_DELAY_MS
        : 0;
      scheduleSlideTextReveal(revealIndex, delay, {
        requireSettled: revealIndex >= INTRO_SEQUENCE_COUNT,
      });
    }, TEXT_REVEAL_DELAY_MS);
  }, [hideSlideText, isPanelSettled, scheduleSlideTextReveal]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const active = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (!active) return;
        const nextIndex = sectionRefs.current.indexOf(active.target);
        if (nextIndex >= 0) {
          activeIndexRef.current = nextIndex;
          setActiveIndex(nextIndex);
        }
      },
      { ...observerOptions, root }
    );

    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, [observerOptions]);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    if (activeIndex < INTRO_SEQUENCE_COUNT) {
      if (activeIndex === 0) {
        cancelPendingReveal();
        showSlideText(activeIndex);
        return;
      }
      hideSlideText();
      return;
    }
    hideSlideText();
    scheduleSlideTextReveal(activeIndex, TEXT_REVEAL_DELAY_MS, { requireSettled: true });
  }, [activeIndex, cancelPendingReveal, hideSlideText, scheduleSlideTextReveal, showSlideText]);

  useEffect(() => {
    const sharedIntroVideo = sharedIntroVideoRef.current;
    const introSequenceActive = activeIndex < INTRO_SEQUENCE_COUNT;
    const introSequenceWasActive =
      previousVideoIndexRef.current !== null &&
      previousVideoIndexRef.current < INTRO_SEQUENCE_COUNT;

    if (sharedIntroVideo) {
      if (introSequenceActive) {
        if (!introSequenceWasActive) {
          try {
            sharedIntroVideo.currentTime = 0;
          } catch {
            // Some browsers reject seeking before metadata is available.
          }
        }
        sharedIntroVideo.play().catch(() => {});
      } else {
        sharedIntroVideo.pause();
        try {
          sharedIntroVideo.currentTime = 0;
        } catch {
          // Some browsers reject seeking before metadata is available.
        }
      }
    }

    videoRefs.current.forEach((video, index) => {
      if (index < INTRO_SEQUENCE_COUNT) return;
      if (!video) return;
      if (index !== activeIndex) {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {
          // Some browsers reject seeking before metadata is available.
        }
        return;
      }

      try {
        video.currentTime = 0;
      } catch {
        // Playback can still start if an early seek is not accepted.
      }
      video.play().catch(() => {});
    });

    previousVideoIndexRef.current = activeIndex;
  }, [activeIndex]);

  useEffect(() => {
    const goHome = () => {
      const scroller = scrollRef.current;
      if (scroller) scroller.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('mobile-home:go-to-top', goHome);
    return () => window.removeEventListener('mobile-home:go-to-top', goHome);
  }, []);

  useEffect(() => () => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    pendingRevealIndexRef.current = null;
  }, []);

  const renderPanel = (panel, index, options = {}) => {
    const sharedBackdrop = options.sharedBackdrop === true;

    return (
      <section
        key={panel.id}
        id={`mobile-${panel.id}`}
        ref={(node) => { sectionRefs.current[index] = node; }}
        className={`mobile-home__panel${sharedBackdrop ? ' mobile-home__panel--shared-backdrop' : ''}`}
        aria-label={panel.label}
        style={!sharedBackdrop && panel.poster ? { '--mobile-home-poster': `url("${panel.poster}")` } : undefined}
      >
        {!sharedBackdrop && (
          <>
            <video
              {...decorativeVideoProps}
              ref={(node) => { videoRefs.current[index] = node; }}
              className="mobile-home__video"
              poster={panel.poster}
              muted
              loop
              playsInline
              preload={index < 3 ? 'auto' : 'metadata'}
              aria-hidden="true"
            >
              <source src={panel.video} type="video/mp4" />
            </video>
            <div className="mobile-home__shade" aria-hidden="true" />
          </>
        )}
        {panel.target && (
          <button
            type="button"
            className="mobile-home__tap"
            data-neoflix-target={panel.target}
            aria-label={`Open Neoflix article: ${panel.label}`}
            onClick={() => openPanelArticle(panel.target)}
          />
        )}
        {panel.logo && (
          <div className="mobile-home__brand" aria-label="Neoflix">
            <img
              className="mobile-home__logo"
              src={panel.logo}
              alt=""
              width="44"
              height="46"
              aria-hidden="true"
            />
            <span>Neoflix</span>
          </div>
        )}
        {/* Only the intro panel is the page's heading; the other eight are
            successive story beats, so they are h2. This used to render an h1
            per panel — nine of them on the version Googlebot-smartphone
            actually indexes, since Home.jsx switches to MobileHome under
            600px. Visually inert: mobile-home.css hangs every rule off the
            mobile-home__headline* classes, not the tag. */}
        <Headline
          tag={panel.intro ? 'h1' : 'h2'}
          className={`mobile-home__headline${panel.intro ? ' mobile-home__headline--intro' : ''}${panel.chapter ? ' mobile-home__headline--chapter' : ''}${!panel.intro && !panel.chapter ? ' mobile-home__headline--story' : ''}${visibleTextIndex === index ? ' mobile-home__headline--visible' : ''}`}
          aria-label={headlineLabel(panel.lines)}
        >
          {panel.chapterHeader ? (
            <MobileChapterHeader header={panel.chapterHeader} />
          ) : (
            <MobileLine lines={panel.lines} />
          )}
        </Headline>
      </section>
    );
  };

  return (
    <main
      ref={scrollRef}
      className="mobile-home"
      aria-label="Neoflix mobile introduction"
      onScroll={handleScroll}
    >
      <div
        className="mobile-home__intro-sequence"
        style={{ '--mobile-home-poster': `url("${INTRO_BLUR_POSTER}")` }}
      >
        <div className="mobile-home__intro-backdrop" aria-hidden="true">
          <video
            {...decorativeVideoProps}
            ref={sharedIntroVideoRef}
            className="mobile-home__video mobile-home__video--intro-shared"
            poster={INTRO_BLUR_POSTER}
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={INTRO_BLUR_VIDEO} type="video/mp4" />
          </video>
          <div className="mobile-home__shade" />
        </div>
        {MOBILE_PANELS.slice(0, INTRO_SEQUENCE_COUNT).map((panel, index) => (
          renderPanel(panel, index, { sharedBackdrop: true })
        ))}
      </div>
      {MOBILE_PANELS.slice(INTRO_SEQUENCE_COUNT).map((panel, index) => (
        renderPanel(panel, index + INTRO_SEQUENCE_COUNT)
      ))}
    </main>
  );
}
