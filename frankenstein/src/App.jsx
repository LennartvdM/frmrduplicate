import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Publications from './pages/Publications';
import Toolbox from './pages/Toolbox';
import ToolboxEmbed from './components/ToolboxEmbed';

// Neoflix page: iframe of the frmrduplicate version (Framer export).
// Works well as-is; will be refactored to clean React later.
function NeoflixEmbed() {
  return (
    <iframe
      src="/frmrduplicate/neoflix.html"
      title="Neoflix"
      style={{
        width: '100%',
        height: 'calc(100vh - 60px)',
        marginTop: 60,
        border: 'none',
        display: 'block',
      }}
    />
  );
}

function AppShell() {
  const location = useLocation();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isToolbox = location.pathname.startsWith('/toolbox');

  return (
    <div className={`min-h-screen ${isNeoflix || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neoflix" element={<NeoflixEmbed />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/toolbox" element={<Toolbox />} />
        <Route path="/toolbox/:slug" element={<ToolboxEmbed />} />
        <Route path="/contact" element={<NeoflixEmbed />} />
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
