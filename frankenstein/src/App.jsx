import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import NeoflixPage from './pages/NeoflixPage';
import PublicationsPage from './pages/PublicationsPage';
import Toolbox from './pages/Toolbox';
import ToolboxEmbed from './components/ToolboxEmbed';

function AppShell() {
  const location = useLocation();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isPublications = location.pathname === '/publications';
  const isToolbox = location.pathname.startsWith('/toolbox');

  // NOTE: /neoflix and /publications mount frmrduplicate page chunks that
  // ship their own Framer navbar, but frankenstein's Navbar is used on all
  // routes. The Framer nav is hidden via CSS (`.frmr-mount [data-framer-name=Nav]`
  // in index.css) rather than stacking two navbars.

  return (
    <div className={`min-h-screen ${isNeoflix || isPublications || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neoflix" element={<NeoflixPage />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/contact" element={<NeoflixPage />} />
        <Route path="/toolbox" element={<Toolbox />} />
        <Route path="/toolbox/:slug" element={<ToolboxEmbed />} />
      </Routes>
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
