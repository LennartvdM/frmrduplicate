import React, { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { ArrowDown, ExternalLink, FileText } from 'lucide-react';
import useScrollSpy from '../../hooks/useScrollSpy';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';
import { useBackdropTarget } from '../../backdrop/useBackdrop';
import { assetUrl } from '../../utils/assetUrl';
import { renderMarkdown } from '../../utils/renderMarkdown';
import { decorativeVideoProps } from '../../utils/decorativeVideoProps';
import PublicationAttachment from '../shared/PublicationAttachment';
import '../../styles/mobile-publications.css';

const HERO_VIDEO = assetUrl('/videos/mobile/neoflix_intro_blur_montage.mp4');
const HERO_POSTER = assetUrl('/videos/mobile/neoflix_intro_blur_montage_poster.png');

const PUBLICATION_MEDIA = {
  preface: {
    clean: assetUrl('/videos/team.mp4'),
    blur: assetUrl('/videos/blurteam.mp4'),
    accent: '#62c8c9',
  },
  narrative: {
    clean: assetUrl('/videos/urgency.mp4'),
    blur: assetUrl('/videos/blururgency.mp4'),
    accent: '#f3b45b',
  },
  providers: {
    clean: assetUrl('/videos/perspectives.mp4'),
    blur: assetUrl('/videos/blurperspectives.mp4'),
    accent: '#8ac6ff',
  },
  recordreflectrefine: {
    clean: assetUrl('/videos/skills.mp4'),
    blur: assetUrl('/videos/Blursskills.mp4'),
    accent: '#79d39d',
  },
  practicalguidance: {
    clean: assetUrl('/videos/coordination.mp4'),
    blur: assetUrl('/videos/blurcoordination.mp4'),
    accent: '#e6a1a8',
  },
  drivingresearch: {
    clean: assetUrl('/videos/focus.mp4'),
    blur: assetUrl('/videos/blurfocus.mp4'),
    accent: '#c5bcff',
  },
  internationalcollab: {
    clean: assetUrl('/videos/team.mp4'),
    blur: assetUrl('/videos/blurteam.mp4'),
    accent: '#f0d66a',
  },
};

function splitHeading(title = '') {
  const match = title.match(/^(\d+)\.\s+(.+)$/);
  if (!match) return { number: '', title };
  return { number: match[1], title: match[2] };
}

function parsePublicationContent(content = '') {
  const paperMatch = content.match(
    /^\s*\*\*\[([^\]]+)\]\(([^)]+)\)\*\*\s*\n+\*([^*][^\n]*?)\*\s*\n+---\s*\n+([\s\S]*)$/
  );

  if (paperMatch) {
    const [, paperTitle, paperUrl, citation, body] = paperMatch;
    return {
      paperTitle: paperTitle.trim().replace(/\.$/, ''),
      paperUrl: paperUrl.trim(),
      citation: citation.trim(),
      status: '',
      body,
    };
  }

  const statusMatch = content.match(/^\s*\*([^*\n]+)\*\s*\n+---\s*\n+([\s\S]*)$/);
  if (statusMatch) {
    const [, status, body] = statusMatch;
    return {
      paperTitle: '',
      paperUrl: '',
      citation: '',
      status: status.trim(),
      body,
    };
  }

  return {
    paperTitle: '',
    paperUrl: '',
    citation: '',
    status: '',
    body: content,
  };
}

function sectionLabel(section, index) {
  if (section.id === 'preface') return 'Intro';
  return `Article ${String(index).padStart(2, '0')}`;
}

export default function MobilePublicationsPage({ sections, scrollTo }) {
  const scrollRef = useRef(null);
  const heroVideoRef = useRef(null);
  const articleVideoRefs = useRef([]);
  const sectionIds = sections.map((section) => section.id);
  const active = useScrollSpy(sectionIds, 88, scrollRef);
  const transitionNavigate = useTransitionNavigate();
  const reduceMotion = typeof window !== 'undefined'
    && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
    container.scrollTo({ top: target.offsetTop - 74, behavior: 'instant' });
  }, [scrollTo]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return undefined;

    const videos = [heroVideoRef.current, ...articleVideoRefs.current].filter(Boolean);
    if (!videos.length) return undefined;

    if (reduceMotion) {
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
      { root, threshold: 0.28 }
    );

    videos.forEach((video) => observer.observe(video));
    return () => observer.disconnect();
  }, [reduceMotion, sections]);

  const scrollToSection = useCallback((id) => {
    const container = scrollRef.current;
    const target = document.getElementById(id);
    if (!container || !target) return;
    container.scrollTo({ top: target.offsetTop - 74, behavior: 'smooth' });
    history.replaceState(null, '', `#${id}`);
  }, []);

  const handleBodyClick = useCallback((event) => {
    const link = event.target.closest('a[data-internal]');
    if (!link) return;
    event.preventDefault();
    transitionNavigate(link.getAttribute('href'));
  }, [transitionNavigate]);

  return (
    <main ref={scrollRef} className="mobile-publications" aria-label="Neoflix articles">
      <section
        className="mobile-publications__hero"
        aria-label="Neoflix article introduction"
        style={{ '--mobile-publications-hero-poster': `url("${HERO_POSTER}")` }}
      >
        <video
          {...decorativeVideoProps}
          ref={heroVideoRef}
          className="mobile-publications__hero-video"
          poster={HERO_POSTER}
          muted
          loop
          playsInline
          autoPlay={!reduceMotion}
          preload="metadata"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="mobile-publications__hero-wash" aria-hidden="true" />
        <div className="mobile-publications__hero-copy">
          <p className="mobile-publications__eyebrow">Neoflix</p>
          <h1>Articles</h1>
          <p>
            Publications and research notes behind video reflection in neonatal care.
          </p>
          <button
            type="button"
            className="mobile-publications__hero-button"
            onClick={() => scrollToSection(sections[0]?.id)}
          >
            Start reading
            <ArrowDown aria-hidden="true" size={17} strokeWidth={2.3} />
          </button>
        </div>
      </section>

      <nav className="mobile-publications__rail" aria-label="Article sections">
        {sections.map((section, index) => {
          const { number, title } = splitHeading(section.title);
          return (
            <button
              key={section.id}
              type="button"
              className={`mobile-publications__rail-button${active === section.id ? ' mobile-publications__rail-button--active' : ''}`}
              onClick={() => scrollToSection(section.id)}
            >
              <span>{number || '00'}</span>
              {title}
            </button>
          );
        })}
      </nav>

      <div className="mobile-publications__lead">
        <FileText aria-hidden="true" size={20} strokeWidth={2.2} />
        <p>
          A compact reading path through the evidence base: what video review reveals,
          how teams experience it, and where it opens new research questions.
        </p>
      </div>

      {sections.map((section, index) => {
        const { number, title } = splitHeading(section.title);
        const parsed = parsePublicationContent(section.content);
        const media = PUBLICATION_MEDIA[section.id] || PUBLICATION_MEDIA.preface;
        return (
          <section
            key={section.id}
            id={section.id}
            className={`mobile-publications__article${section.id === 'preface' ? ' mobile-publications__article--preface' : ''}`}
            style={{ '--publication-accent': media.accent }}
          >
            <div className="mobile-publications__article-backdrop" aria-hidden="true">
              <video
                {...decorativeVideoProps}
                ref={(node) => { articleVideoRefs.current[index] = node; }}
                src={media.blur}
                muted
                loop
                playsInline
                preload="metadata"
              />
              <div />
            </div>

            <div className="mobile-publications__article-inner">
              <p className="mobile-publications__kicker">
                {sectionLabel(section, number || index)}
              </p>
              <h2>{title}</h2>

              {parsed.paperTitle && (
                <a
                  className="mobile-publications__paper-link"
                  href={parsed.paperUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{parsed.paperTitle}</span>
                  <ExternalLink aria-hidden="true" size={26} strokeWidth={2.1} />
                </a>
              )}

              {parsed.status && (
                <p className="mobile-publications__status">{parsed.status}</p>
              )}

              {parsed.citation && (
                <p className="mobile-publications__citation">{parsed.citation}</p>
              )}

              {/* The paper itself, below its citation — inherits the
                  section's --publication-accent from the <section>. */}
              <PublicationAttachment pdf={section.pdf} variant="mobile" />

              <div
                className="mobile-publications__body"
                dangerouslySetInnerHTML={{ __html: renderMarkdown(parsed.body) }}
                onClick={handleBodyClick}
              />
            </div>
          </section>
        );
      })}

      <div className="mobile-publications__bottom-spacer" aria-hidden="true" />
    </main>
  );
}
