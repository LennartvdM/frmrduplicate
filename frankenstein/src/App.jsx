import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import MobileDock from './components/mobile/MobileDock';
import RouteSlider from './components/RouteSlider';
import BackdropProvider from './backdrop/BackdropProvider';
import { TransitionProvider } from './contexts/TransitionContext';
import useTabletLayout from './hooks/useTabletLayout';
import useDocumentMeta from './hooks/useDocumentMeta';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import NeoflixPage from './pages/NeoflixPage';
import PublicationsPage from './pages/PublicationsPage';
import DocsPage from './pages/DocsPage';
import PaperPage from './pages/PaperPage';
import NotFoundPage from './pages/NotFoundPage';

function AppShell() {
  const location = useLocation();
  const { width } = useTabletLayout();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isPublications = location.pathname.startsWith('/publications');
  const isContact = location.pathname === '/contact';
  const isToolbox = location.pathname.startsWith('/toolbox');
  const showMobileDock = width > 0 && width < 600;

  // Client-side navigation doesn't reload the document, so the head has
  // to be updated by hand. The build writes the same values into each
  // route's HTML for anything that doesn't run JavaScript.
  useDocumentMeta();

  // The navbar, backdrop, and route slider each render independently.
  // They share a single source of truth — TransitionContext — for the
  // current slide direction and "is a slide in flight" flag, but none
  // of them are coupled through a document-scoped animation primitive.
  // This is deliberate: the previous View Transitions API setup froze
  // the whole page (navbar included) behind a snapshot during each
  // nav, which produced dead-click windows on persistent chrome.
  return (
    <div className={`min-h-screen ${isNeoflix || isPublications || isContact || isToolbox ? '' : 'bg-[var(--cool-page)]'}`}>
      <Navbar />
      <ErrorBoundary>
        <BackdropProvider>
          <RouteSlider>
            {(captured) => (
              <Routes location={captured}>
                <Route path="/" element={<Home />} />
                <Route path="/neoflix" element={<NeoflixPage />} />
                <Route path="/publications" element={<PublicationsPage />} />
                <Route path="/publications/:slug" element={<PaperPage />} />
                <Route path="/contact" element={<NeoflixPage scrollTo="contact" />} />
                <Route path="/toolbox" element={<DocsPage />} />
                <Route path="/toolbox/*" element={<DocsPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            )}
          </RouteSlider>
        </BackdropProvider>
      </ErrorBoundary>
      {showMobileDock ? <MobileDock /> : null}
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
