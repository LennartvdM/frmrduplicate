import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { assetUrl } from '../../utils/assetUrl';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';
import '../../styles/mobile-home.css';

const TEXT_REVEAL_DELAY_MS = 140;

const MOBILE_PANELS = [
  {
    id: 'intro',
    video: assetUrl('/videos/mobile/neoflix_intro_blur_montage.mp4'),
    poster: assetUrl('/videos/mobile/neoflix_intro_blur_montage_poster.png'),
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
    id: 'urgency',
    video: assetUrl('/videos/mobile/urgency.mp4'),
    target: 'time-sensitive',
    label: 'Medical interventions demand precision and urgency.',
    lines: [
      [{ text: 'Medical interventions demand' }],
      [{ text: 'precision and urgency', accent: true }, { text: '.' }],
    ],
  },
  {
    id: 'coordination',
    video: assetUrl('/videos/mobile/coordination.mp4'),
    target: 'like-a-dance',
    label: 'Which makes coordination within teams vital for success.',
    lines: [
      [{ text: 'Which makes ' }, { text: 'coordination', accent: true }],
      [{ text: 'within teams vital for success.' }],
    ],
  },
  {
    id: 'tunnelvision',
    video: assetUrl('/videos/mobile/tunnelvision.mp4'),
    target: 'cost',
    label: 'Task-driven focus can lead to tunnel vision and misalignment.',
    lines: [
      [{ text: 'Task-driven focus can lead to' }],
      [{ text: 'tunnel vision', accent: true }, { text: ' and misalignment.' }],
    ],
  },
  {
    id: 'reflection',
    video: assetUrl('/videos/mobile/reflection.mp4'),
    target: 'sharpening',
    label: 'Quiet reflection allows for sharpening skills.',
    lines: [
      [{ text: 'Quiet ' }, { text: 'reflection', accent: true }, { text: ' allows for' }],
      [{ text: 'sharpening skills.' }],
    ],
  },
  {
    id: 'cohesion',
    video: assetUrl('/videos/mobile/cohesion.mp4'),
    target: 'team-dynamics',
    label: 'Further video debriefs foster cohesion amongst peers.',
    lines: [
      [{ text: 'Further video debriefs foster' }],
      [{ text: 'cohesion', accent: true }, { text: ' amongst peers.' }],
    ],
  },
  {
    id: 'alignment',
    video: assetUrl('/videos/mobile/alignment.mp4'),
    target: 'perspectives',
    label: 'Shared understanding enhances decisiveness.',
    lines: [
      [{ text: 'Shared ' }, { text: 'understanding', accent: true }],
      [{ text: 'enhances decisiveness.' }],
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
              className={segment.accent ? 'mobile-home__accent' : undefined}
            >
              {segment.text}
            </span>
          ))}
        </span>
      ))}
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
  const activeIndexRef = useRef(0);
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
    hideSlideText();
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(() => {
      revealActiveSlideText(0);
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
    hideSlideText();
    revealActiveSlideText();
  }, [activeIndex, hideSlideText, revealActiveSlideText]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;
      const shouldPlay = Math.abs(index - activeIndex) <= 1;
      if (shouldPlay) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    });
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

  return (
    <main
      ref={scrollRef}
      className="mobile-home"
      aria-label="Neoflix mobile introduction"
      onScroll={handleScroll}
    >
      {MOBILE_PANELS.map((panel, index) => (
        <section
          key={panel.id}
          id={`mobile-${panel.id}`}
          ref={(node) => { sectionRefs.current[index] = node; }}
          className="mobile-home__panel"
          aria-label={panel.label}
          style={panel.poster ? { '--mobile-home-poster': `url("${panel.poster}")` } : undefined}
        >
          <video
            ref={(node) => { videoRefs.current[index] = node; }}
            className="mobile-home__video"
            poster={panel.poster}
            muted
            loop
            playsInline
            preload={index < 2 ? 'auto' : 'metadata'}
            aria-hidden="true"
          >
            <source src={panel.video} type="video/mp4" />
          </video>
          <div className="mobile-home__shade" aria-hidden="true" />
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
            className={`mobile-home__headline${panel.intro ? ' mobile-home__headline--intro' : ''}${visibleTextIndex === index ? ' mobile-home__headline--visible' : ''}`}
            aria-label={headlineLabel(panel.lines)}
          >
            <MobileLine lines={panel.lines} />
          </h1>
        </section>
      ))}
    </main>
  );
}
