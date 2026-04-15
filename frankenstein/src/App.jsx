import React, { useCallback, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RouteTransition from './components/RouteTransition';
import SharedVideoBackdrop from './components/SharedVideoBackdrop';
import { VideoBackdropContext } from './context/VideoBackdropContext';
import { UNIVERSAL_SECTION_TO_VIDEO } from './config/videoBackdropRoutes';
import Home from './pages/Home';
import NeoflixPage from './pages/NeoflixPage';
import PublicationsPage from './pages/PublicationsPage';
import Toolbox from './pages/Toolbox';
import ToolboxEmbed from './components/ToolboxEmbed';

function AppShell() {
  const location = useLocation();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isPublications = location.pathname === '/publications';
  const isContact = location.pathname === '/contact';
  const isToolbox = location.pathname.startsWith('/toolbox');

  // One shared video backdrop for the whole site. Pages push either:
  //   setActiveSection(id)   — used by BlogPage (resolves through
  //                             UNIVERSAL_SECTION_TO_VIDEO)
  //   setActiveVideoUrl(url) — used by Home's medical sections, which
  //                             already track a video URL via their
  //                             carousel state
  // Resolved target URL drives the deck-of-cards crossfade inside
  // SharedVideoBackdrop. When both are null, the video layer fades
  // out and only the #1c3424 camo fill shows.
  const [activeSection, setActiveSection] = useState(null);
  const [activeVideoUrl, setActiveVideoUrl] = useState(null);
  const ctx = useMemo(
    () => ({ setActiveSection, setActiveVideoUrl }),
    []
  );

  const targetVideoUrl = activeVideoUrl
    || (activeSection ? UNIVERSAL_SECTION_TO_VIDEO[activeSection] : null)
    || null;

  return (
    <div className={`min-h-screen ${isNeoflix || isPublications || isContact || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />

      {/* One persistent backdrop for the whole site. No AnimatePresence
          conditional mount — it stays alive across every route, just
          fading its video layer in/out as pages do or don't publish a
          target URL. That's what eliminates the "two decks sliding
          side-by-side" problem at route transitions. */}
      <SharedVideoBackdrop targetVideoUrl={targetVideoUrl} />

      <VideoBackdropContext.Provider value={ctx}>
        <RouteTransition>
          {(captured) => (
            <Routes location={captured}>
              <Route path="/" element={<Home />} />
              <Route path="/neoflix" element={<NeoflixPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/contact" element={<NeoflixPage scrollTo="contact" />} />
              <Route path="/toolbox" element={<Toolbox />} />
              <Route path="/toolbox/:slug" element={<ToolboxEmbed />} />
            </Routes>
          )}
        </RouteTransition>
      </VideoBackdropContext.Provider>
    </div>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
      <AppShell />
    </Router>
  );
}
