import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../../utils/assetUrl';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';
import '../../styles/mobile-home.css';

const TEXT_REVEAL_DELAY_MS = 140;
const OPENING_HEADER_REVEAL_DELAY_MS = 260;
const INTRO_SEQUENCE_COUNT = 2;
const INTRO_BLUR_VIDEO = assetUrl('/videos/mobile/neoflix_intro_blur_montage.mp4');
const INTRO_BLUR_POSTER = assetUrl('/videos/mobile/neoflix_intro_blur_montage_poster.png');

const MOBILE_PANELS = [
  {
    id: 'intro',
    video: INTRO_BLUR_VIDEO,
    poster: INTRO_BLUR_POSTER,
    logo: assetUrl('/favicon.svg'),
    label: 'Neoflix helps teams record, reflect, and refine care.',
    intro: true,
    lines: [
      [{ text: 'Record.' }],
      [{ text: 'Reflect.', accent: true }],
      [{ text: 'Refine.' }],
    ],
  },
  {
    id: 'moment',
    video: INTRO_BLUR_VIDEO,
    poster: INTRO_BLUR_POSTER,
    label: 'In the moment, only the patient matters.',
    chapter: true,
    chapterHeader: {
      line1: 'In the moment,',
      line2prefix: '',
      line2highlight: 'only',
      line2suffix: ' the patient',
      line3: 'matters',
    },
    lines: [
      [{ text: 'In the moment,' }],
      [{ text: 'only', accent: true }, { text: ' the patient' }],
      [{ text: 'matters' }],
    ],
  },
  {
    id: 'urgency',
    video: assetUrl('/videos/mobile/urgency.mp4'),
    target: 'time-sensitive',
    label: 'Medical interventions demand precision and urgency.',
    lines: [
      [{ text: 'Medical interventions demand', delay: 0 }],
      [{ text: 'precision and urgency', accent: true, delay: 260 }, { text: '.', delay: 260 }],
    ],
  },
  {
    id: 'coordination',
    video: assetUrl('/videos/mobile/coordination.mp4'),
    target: 'like-a-dance',
    label: 'Which makes coordination within teams vital for success.',
    lines: [
      [{ text: 'Which makes ', delay: 0 }, { text: 'coordination', accent: true, delay: 180 }],
      [{ text: 'within teams vital for success.', delay: 360 }],
    ],
  },
  {
    id: 'tunnelvision',
    video: assetUrl('/videos/mobile/tunnelvision.mp4'),
    target: 'cost',
    label: 'Task-driven focus can lead to tunnel vision and misalignment.',
    lines: [
      [{ text: 'Task-driven focus', delay: 0 }, { text: ' can lead to', delay: 180 }],
      [{ text: 'tunnel vision', accent: true, delay: 360 }, { text: ' and misalignment.', delay: 360 }],
    ],
  },
  {
    id: 'next',
    video: INTRO_BLUR_VIDEO,
    poster: INTRO_BLUR_POSTER,
    label: 'Yet, reflection strengthens the next.',
    chapter: true,
    chapterHeader: {
      line1: 'Yet,',
      line1suffix: ' ',
      line2prefix: '',
      line2highlight: 'reflection',
      line2suffix: '',
      line3: 'strengthens',
      line4: 'the next',
    },
    lines: [
      [{ text: 'Yet, ' }, { text: 'reflection', accent: true }],
      [{ text: 'strengthens' }],
      [{ text: 'the next' }],
    ],
  },
  {
    id: 'reflection',
    video: assetUrl('/videos/mobile/reflection.mp4'),
    target: 'sharpening',
    label: 'Quiet reflection allows for sharpening skills.',
    lines: [
      [{ text: 'Quiet ', delay: 0 }, { text: 'reflection', accent: true, delay: 180 }, { text: ' allows for', delay: 180 }],
      [{ text: 'sharpening skills.', delay: 360 }],
    ],
  },
  {
    id: 'cohesion',
    video: assetUrl('/videos/mobile/cohesion.mp4'),
    target: 'team-dynamics',
    label: 'Further video debriefs foster cohesion amongst peers.',
    lines: [
      [{ text: 'Further video debriefs', delay: 0 }, { text: ' foster', delay: 180 }],
      [{ text: 'cohesion', accent: true, delay: 360 }, { text: ' amongst peers.', delay: 360 }],
    ],
  },
  {
    id: 'alignment',
    video: assetUrl('/videos/mobile/alignment.mp4'),
    target: 'perspectives',
    label: 'Shared understanding enhances decisiveness.',
    lines: [
      [{ text: 'Shared ', delay: 0 }, { text: 'understanding', accent: true, delay: 180 }],
      [{ text: 'enhances ', delay: 360 }, { text: 'decisiveness.', delay: 520 }],
    ],
  },
];

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

  const hideSlideText = useCallback(() => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    if (visibleTextIndexRef.current === null) return;
    visibleTextIndexRef.current = null;
    setVisibleTextIndex(null);
  }, []);

  const revealActiveSlideText = useCallback((delay = TEXT_REVEAL_DELAY_MS) => {
    if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
    revealTimerRef.current = setTimeout(() => {
      const nextIndex = activeIndexRef.current;
      visibleTextIndexRef.current = nextIndex;
      setVisibleTextIndex(nextIndex);
    }, delay);
  }, []);

  const handleScroll = useCallback(() => {
    const root = scrollRef.current;
    const inOpeningSequence =
      root && root.scrollTop < root.clientHeight * INTRO_SEQUENCE_COUNT - 1;

    if (!inOpeningSequence) hideSlideText();
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      const delay = inOpeningSequence && activeIndexRef.current > 0
        ? OPENING_HEADER_REVEAL_DELAY_MS
        : 0;
      revealActiveSlideText(delay);
    }, TEXT_REVEAL_DELAY_MS);
  }, [hideSlideText, revealActiveSlideText]);

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
      if (revealTimerRef.current) clearTimeout(revealTimerRef.current);
      if (activeIndex === 0) {
        visibleTextIndexRef.current = activeIndex;
        setVisibleTextIndex(activeIndex);
        return;
      }
      hideSlideText();
      return;
    }
    hideSlideText();
    revealActiveSlideText();
  }, [activeIndex, hideSlideText, revealActiveSlideText]);

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
        <h1
          className={`mobile-home__headline${panel.intro ? ' mobile-home__headline--intro' : ''}${panel.chapter ? ' mobile-home__headline--chapter' : ''}${!panel.intro && !panel.chapter ? ' mobile-home__headline--story' : ''}${visibleTextIndex === index ? ' mobile-home__headline--visible' : ''}`}
          aria-label={headlineLabel(panel.lines)}
        >
          {panel.chapterHeader ? (
            <MobileChapterHeader header={panel.chapterHeader} />
          ) : (
            <MobileLine lines={panel.lines} />
          )}
        </h1>
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
