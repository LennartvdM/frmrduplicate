import React from 'react';
import useViewTransition from '../hooks/useViewTransition';

/**
 * Site-wide footer modeled on neoflixexporttest's richer design:
 * teal → dark-blue gradient, nav columns, signature + funding line,
 * back-to-top button. Rebuilt as native React + Tailwind (structure
 * copied from the Framer export, not the bundled runtime).
 *
 * Navigation goes through useViewTransition so the direction-aware
 * slide (html[data-nav-direction] + View Transitions) fires on Footer
 * clicks the same way it does on Navbar clicks. Using plain <Link>
 * here would skip the direction logic and cause the content to teleport
 * while only the backdrop animates — breaking the spatial mapping
 * between navbar slot order and slide direction.
 */
export default function Footer() {
  const transitionNavigate = useViewTransition();
  const handleNav = (to) => (e) => {
    e.preventDefault();
    transitionNavigate(to);
  };

  const scrollTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const linkClass =
    'text-[13px] leading-5 text-white/70 hover:text-white underline-offset-2 hover:underline transition-colors';
  const headingClass = 'text-sm font-medium text-white mb-3';

  return (
    <footer
      className="w-full"
      style={{
        background:
          'linear-gradient(180deg, rgb(114, 194, 194) 0%, rgb(21, 37, 54) 100%)',
        fontFamily: '"Inter", sans-serif',
        // Snap point: footer's bottom aligns to viewport bottom. Combined
        // with mandatory snap on the scroll container, scrolling past slide 4
        // snaps to this position, which shows the tail of slide 4 above the
        // footer instead of giving the footer its own full slide.
        scrollSnapAlign: 'end',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 pt-14 pb-8">
        {/* Top: brand + nav columns */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          <div>
            <div
              className="text-white font-bold"
              style={{ fontSize: 22, letterSpacing: '-0.05em' }}
            >
              Neoflix
            </div>
            <p className="text-[13px] leading-5 text-white/60 mt-2 max-w-xs">
              Revolutionizing reflection in medical care.
            </p>
          </div>

          <div className="flex gap-14">
            <div>
              <div className={headingClass}>Products</div>
              <ul className="space-y-2">
                <li><a href="/" onClick={handleNav('/')} className={linkClass}>Home</a></li>
                <li><a href="/neoflix" onClick={handleNav('/neoflix')} className={linkClass}>Neoflix</a></li>
              </ul>
            </div>
            <div>
              <div className={headingClass}>Resources</div>
              <ul className="space-y-2">
                <li><a href="/publications" onClick={handleNav('/publications')} className={linkClass}>Publications</a></li>
                <li><a href="/toolbox" onClick={handleNav('/toolbox')} className={linkClass}>Toolbox</a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}
        >
          <p className="text-[13px] leading-5 text-white/70">© 2024 Neoflix</p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 text-[13px] leading-5 text-white/70">
            <a
              href="mailto:lennartvandermolen@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline-offset-2 hover:underline transition-colors"
            >
              Developed by <strong>Lennart vd Molen</strong>
            </a>
            <a
              href="https://www.knaw.nl/fondsen-en-prijzen/knaw-van-walree-fonds"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white underline-offset-2 hover:underline transition-colors"
            >
              <span style={{ fontWeight: 400 }}>Supported by the </span>
              <span style={{ fontWeight: 900 }}>KNAW Van Walree Fund</span>
            </a>
          </div>

          <button
            type="button"
            onClick={scrollTop}
            aria-label="Back to top"
            className="self-start md:self-auto flex items-center justify-center transition-colors hover:bg-black/80"
            style={{
              width: 44,
              height: 44,
              borderRadius: 32,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'white',
            }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 19V5M5 12l7-7 7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  );
}
