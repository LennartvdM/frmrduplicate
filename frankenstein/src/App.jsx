import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PublicationsPage from './pages/PublicationsPage';
import FramerEmbed from './components/FramerEmbed';
import Toolbox from './pages/Toolbox';
import ToolboxEmbed from './components/ToolboxEmbed';

function AppShell() {
  const location = useLocation();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isPublications = location.pathname === '/publications';
  const isToolbox = location.pathname.startsWith('/toolbox');

  return (
    <div className={`min-h-screen ${isNeoflix || isPublications || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neoflix" element={<FramerEmbed page="neoflix.html" title="Neoflix" />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/toolbox" element={<Toolbox />} />
        <Route path="/toolbox/:slug" element={<ToolboxEmbed />} />
        <Route path="/contact" element={<FramerEmbed page="neoflix.html" title="Contact" />} />
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
