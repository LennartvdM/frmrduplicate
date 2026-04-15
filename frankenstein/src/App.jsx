import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import RouteTransition from './components/RouteTransition';
import SharedVideoBackdrop from './components/SharedVideoBackdrop';
import { VideoBackdropContext } from './context/VideoBackdropContext';
import { isVideoBackdropRoute } from './config/videoBackdropRoutes';
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
  const hasVideoBackdrop = isVideoBackdropRoute(location.pathname);

  // BlogPage pushes its active section id here; SharedVideoBackdrop
  // reads it to pick the current target card in the deck.
  const [activeSection, setActiveSection] = useState(null);
  const ctx = useMemo(() => ({ setActiveSection }), []);

  return (
    <div className={`min-h-screen ${isNeoflix || isPublications || isContact || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />

      {/* Persistent video backdrop — mounted once for the whole
          /neoflix, /publications, /contact family. Stays put as the
          foreground slides horizontally between them; fades out
          entirely (via AnimatePresence) when routing to a non-video
          page, and fades back in when returning. */}
      <AnimatePresence>
        {hasVideoBackdrop && (
          <SharedVideoBackdrop key="shared-video" activeSection={activeSection} />
        )}
      </AnimatePresence>

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
