import React from 'react';
import { BookOpen, Home, Newspaper, Video } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import useTransitionNavigate from '../../hooks/useTransitionNavigate';
import '../../styles/mobile-dock.css';

function MobileDockButton({ icon: Icon, label, active = false, onClick }) {
  return (
    <button
      type="button"
      className={`mobile-dock__button${active ? ' mobile-dock__button--active' : ''}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Icon aria-hidden="true" size={20} strokeWidth={2.2} />
    </button>
  );
}

export default function MobileDock() {
  const location = useLocation();
  const transitionNavigate = useTransitionNavigate();

  const path = location.pathname;
  const isHome = path === '/';
  const isNeoflix = path === '/neoflix' || path.startsWith('/neoflix/') || path === '/contact';
  const isPublications = path === '/publications';
  const isToolbox = path === '/toolbox' || path.startsWith('/toolbox/');

  const goHome = () => {
    if (isHome) {
      window.dispatchEvent(new Event('mobile-home:go-to-top'));
      return;
    }
    transitionNavigate('/');
  };

  return (
    <nav className="mobile-dock" aria-label="Primary mobile navigation">
      <MobileDockButton
        icon={Video}
        label="Open Neoflix"
        active={isNeoflix}
        onClick={() => {
          if (!isNeoflix) transitionNavigate('/neoflix');
        }}
      />
      <MobileDockButton
        icon={Newspaper}
        label="Open Articles"
        active={isPublications}
        onClick={() => {
          if (!isPublications) transitionNavigate('/publications');
        }}
      />
      <MobileDockButton
        icon={Home}
        label={isHome ? 'Back to first slide' : 'Open Home'}
        active={isHome}
        onClick={goHome}
      />
      <MobileDockButton
        icon={BookOpen}
        label="Open Toolbox"
        active={isToolbox}
        onClick={() => {
          if (!isToolbox) transitionNavigate('/toolbox');
        }}
      />
    </nav>
  );
}
