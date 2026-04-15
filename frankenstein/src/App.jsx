import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RouteTransition from './components/RouteTransition';
import BackdropProvider from './backdrop/BackdropProvider';
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

  // BackdropProvider wraps every route. It owns the one fixed backdrop
  // layer (stays alive across route changes, independent view-transition
  // group) and exposes the publish API through useBackdropTarget /
  // useBackdropPublisher. Every page / section publishes its target
  // state through that one wire — no animation state crosses the
  // boundary.
  return (
    <div className={`min-h-screen ${isNeoflix || isPublications || isContact || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />
      <BackdropProvider>
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
      </BackdropProvider>
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
