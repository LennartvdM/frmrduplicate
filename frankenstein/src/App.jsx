import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RouteSlider from './components/RouteSlider';
import BackdropProvider from './backdrop/BackdropProvider';
import { TransitionProvider } from './contexts/TransitionContext';
import Home from './pages/Home';
import NeoflixPage from './pages/NeoflixPage';
import PublicationsPage from './pages/PublicationsPage';
import DocsPage from './pages/DocsPage';

function AppShell() {
  const location = useLocation();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isPublications = location.pathname === '/publications';
  const isContact = location.pathname === '/contact';
  const isToolbox = location.pathname.startsWith('/toolbox');

  // The navbar, backdrop, and route slider each render independently.
  // They share a single source of truth — TransitionContext — for the
  // current slide direction and "is a slide in flight" flag, but none
  // of them are coupled through a document-scoped animation primitive.
  // This is deliberate: the previous View Transitions API setup froze
  // the whole page (navbar included) behind a snapshot during each
  // nav, which produced dead-click windows on persistent chrome.
  return (
    <div className={`min-h-screen ${isNeoflix || isPublications || isContact || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />
      <BackdropProvider>
        <RouteSlider>
          {(captured) => (
            <Routes location={captured}>
              <Route path="/" element={<Home />} />
              <Route path="/neoflix" element={<NeoflixPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/contact" element={<NeoflixPage scrollTo="contact" />} />
              <Route path="/toolbox" element={<DocsPage />} />
              <Route path="/toolbox/*" element={<DocsPage />} />
            </Routes>
          )}
        </RouteSlider>
      </BackdropProvider>
    </div>
  );
}

export default function App() {
  return (
    <Router basename={import.meta.env.BASE_URL?.replace(/\/$/, '') || ''}>
      <TransitionProvider>
        <AppShell />
      </TransitionProvider>
    </Router>
  );
}
