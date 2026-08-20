import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowDown, Mail } from 'lucide-react';
import useScrollSpy from '../../lib/hooks/useScrollSpy';
import useTransitionNavigate from '../../lib/hooks/useTransitionNavigate';
import { useBackdropTarget } from '../../site/backdrop/useBackdrop';
import { assetUrl } from '../../lib/utils/assetUrl';
import { renderMarkdown } from '../../lib/utils/renderMarkdown';
import { decorativeVideoProps } from '../../lib/utils/decorativeVideoProps';
import { prefersReducedMedia, stillFor } from '../../lib/utils/reducedMedia';
import './neoflix-phone.css';

const NEOFLIX_MEDIA_BY_SECTION = {
  'time-sensitive': {
    clean: assetUrl('/videos/urgency.mp4'),
    blur: assetUrl('/videos/blururgency.mp4'),
    accent: '#f3b45b',
  },
  'like-a-dance': {
    clean: assetUrl('/videos/coordination.mp4'),
    blur: assetUrl('/videos/blurcoordination.mp4'),
    accent: '#62c8c9',
  },
  cost: {
    clean: assetUrl('/videos/focus.mp4'),
    blur: assetUrl('/videos/blurfocus.mp4'),
    accent: '#8ac6ff',
  },
  sharpening: {
    clean: assetUrl('/videos/skills.mp4'),
    blur: assetUrl('/videos/blurskills.mp4'),
    accent: '#79d39d',
  },
  'team-dynamics': {
    clean: assetUrl('/videos/team.mp4'),
    blur: assetUrl('/videos/blurteam.mp4'),
    accent: '#f0d66a',
  },
  perspectives: {
    clean: assetUrl('/videos/perspectives.mp4'),
    blur: assetUrl('/videos/blurperspectives.mp4'),
    accent: '#e6a1a8',
  },
};

const HERO_VIDEO = assetUrl('/videos/mobile/neoflix_intro_blur_montage.mp4');
const HERO_POSTER = assetUrl('/videos/mobile/neoflix_intro_blur_montage_poster.png');

function sectionKicker(index, id) {
  if (id === 'contact') return 'Contact';
  return `Part ${String(index + 1).padStart(2, '0')}`;
}

function firstParagraph(markdown = '') {
  return markdown.trim().split(/\n\s*\n/)[0] || '';
}

function afterFirstParagraph(markdown = '') {
  return markdown.trim().split(/\n\s*\n/).slice(1).join('\n\n');
}

function plainInline(markdown = '') {
  return markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '');
}

export default function MobileNeoflixPage({ sections, scrollTo }) {
  const scrollRef = useRef(null);
  const heroVideoRef = useRef(null);
  const videoRefs = useRef([]);
  const visualSections = sections.filter((section) => section.id !== 'contact');
  const sectionIds = sections.map((section) => section.id);
  const active = useScrollSpy(sectionIds, 96, scrollRef);
  const transitionNavigate = useTransitionNavigate();
  // Reduced-media mode: OS reduced-motion, Save-Data, or a low-memory
  // device (utils/reducedMedia). Loops pause and high-quality stills
  // stand in for the section footage.
  const liteMedia = prefersReducedMedia();

  // Mobile Neoflix paints its own media surfaces. Clear the shared blog
  // backdrop so stale desktop targets do not sit behind this route.
  useBackdropTarget('blog', null);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const hashId = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    const targetId = scrollTo || hashId;
    if (!targetId) {
      container.scrollTo({ top: 0, behavior: 'instant' });
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;
    const top = target.offsetTop - 72;
    container.scrollTo({ top, behavior: 'instant' });
  }, [scrollTo]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;

    const videos = [heroVideoRef.current, ...videoRefs.current].filter(Boolean);
    if (liteMedia) {
      videos.forEach((video) => video.pause());
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target;
          if (entry.isIntersecting) {
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { root, threshold: 0.34 }
    );

    videos.forEach((video) => observer.observe(video));

    return () => observer.disconnect();
  }, [liteMedia]);

  const scrollToSection = useCallback((id) => {
    const container = scrollRef.current;
    const target = document.getElementById(id);
    if (!container || !target) return;
    container.scrollTo({ top: target.offsetTop - 72, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }, []);

  const handleBodyClick = useCallback((e) => {
    const link = e.target.closest('a[data-internal]');
    if (!link) return;
    e.preventDefault();
    transitionNavigate(link.getAttribute('href'));
  }, [transitionNavigate]);

  return (
    <main ref={scrollRef} className="mobile-neoflix" aria-label="Neoflix">
      <section
        className="mobile-neoflix__hero"
        aria-label="Neoflix introduction"
        style={{ '--mobile-neoflix-hero-poster': `url("${HERO_POSTER}")` }}
      >
        <video
          {...decorativeVideoProps}
          ref={heroVideoRef}
          className="mobile-neoflix__hero-video"
          poster={HERO_POSTER}
          muted
          loop
          playsInline
          autoPlay={!liteMedia}
          preload="metadata"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="mobile-neoflix__hero-shade" aria-hidden="true" />
        <div className="mobile-neoflix__hero-copy">
          <p className="mobile-neoflix__eyebrow">Neoflix</p>
          <h1>Record. Reflect. Refine.</h1>
          <p>
            A practical guide for turning high-pressure clinical moments into shared learning.
          </p>
          <button
            type="button"
            className="mobile-neoflix__hero-button"
            onClick={() => scrollToSection(sections[0]?.id)}
          >
            Start reading
            <ArrowDown aria-hidden="true" size={17} strokeWidth={2.3} />
          </button>
        </div>
      </section>

      <nav className="mobile-neoflix__rail" aria-label="Neoflix sections">
        {sections.map((section, index) => (
          <button
            key={section.id}
            type="button"
            className={`mobile-neoflix__rail-button${active === section.id ? ' mobile-neoflix__rail-button--active' : ''}`}
            onClick={() => scrollToSection(section.id)}
          >
            <span>{section.id === 'contact' ? 'Contact' : String(index + 1).padStart(2, '0')}</span>
            {section.title}
          </button>
        ))}
      </nav>

      <div className="mobile-neoflix__intro-band">
        <p>
          Neoflix is built around one simple idea: objective footage gives teams a calmer,
          more complete way to learn from care that happened under pressure.
        </p>
      </div>

      {sections.map((section, index) => {
        const media = NEOFLIX_MEDIA_BY_SECTION[section.id];
        const isContact = section.id === 'contact';
        return (
          <section
            key={section.id}
            id={section.id}
            className={`mobile-neoflix__section${isContact ? ' mobile-neoflix__section--contact' : ''}`}
            style={media ? { '--mobile-neoflix-section-accent': media.accent } : undefined}
          >
            {media?.blur && (
              <div className="mobile-neoflix__section-backdrop" aria-hidden="true">
                {liteMedia ? (
                  <img src={stillFor(media.blur)} alt="" draggable={false} />
                ) : (
                  <video
                    {...decorativeVideoProps}
                    ref={(node) => { videoRefs.current[index * 2] = node; }}
                    src={media.blur}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />
                )}
                <div />
              </div>
            )}
            {(() => {
              const summary = plainInline(firstParagraph(section.content));
              const body = !isContact ? afterFirstParagraph(section.content) : section.content;
              return (
                <div className="mobile-neoflix__section-content">
            {media?.clean && (
              <div className="mobile-neoflix__visual">
                {liteMedia ? (
                  <img src={stillFor(media.clean)} alt="" aria-hidden="true" draggable={false} />
                ) : (
                  <video
                    {...decorativeVideoProps}
                    ref={(node) => { videoRefs.current[(index * 2) + 1] = node; }}
                    src={media.clean}
                    muted
                    loop
                    playsInline
                    preload={index < 2 ? 'auto' : 'metadata'}
                    aria-hidden="true"
                  />
                )}
              </div>
            )}

            <div className="mobile-neoflix__copy">
              <p className="mobile-neoflix__kicker">{sectionKicker(index, section.id)}</p>
              <h2>{section.title}</h2>
              {!isContact && (
                <p className="mobile-neoflix__summary">
                  {summary}
                </p>
              )}
              {body && (
                <div
                  className="mobile-neoflix__body"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(body) }}
                  onClick={handleBodyClick}
                />
              )}
              {isContact && (
                <a className="mobile-neoflix__mail" href="mailto:info@neoflix.care">
                  <Mail aria-hidden="true" size={18} strokeWidth={2.2} />
                  info@neoflix.care
                </a>
              )}
            </div>
                </div>
              );
            })()}
          </section>
        );
      })}

      <div className="mobile-neoflix__bottom-spacer" aria-hidden="true" />
    </main>
  );
}
