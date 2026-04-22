// src/App.jsx — SPA with Home and Publications routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Publications from './pages/Publications';
import Toolbox from './pages/Toolbox';
import SidebarScrollSpyDemo from './components/Sidebar';
import Home from './pages/Home';
import WorldMapEditor from './components/WorldMapEditor';
import CMSAdmin from './pages/CMSAdmin';
import ToolboxEmbed from './components/ToolboxEmbed';

function AppShell() {
  const location = useLocation();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isAdmin = location.pathname === '/admin';
  const isToolbox = location.pathname.startsWith('/toolbox');
  const isMapEditor = location.pathname === '/map-editor';
  const hideNavbar = isAdmin || isMapEditor;

  return (
    <div className={`min-h-screen ${isNeoflix || isAdmin || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neoflix" element={<SidebarScrollSpyDemo />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/toolbox" element={<Toolbox />} />
        <Route path="/map-editor" element={<div className="fixed inset-0"><WorldMapEditor /></div>} />
        <Route path="/admin" element={<CMSAdmin />} />
        <Route path="/toolbox/:slug" element={<ToolboxEmbed />} />
      </Routes>
    </div>
  );
}

const basename = import.meta.env.BASE_URL?.replace(/\/$/, '') || '';

export default function App() {
  return (
    <Router basename={basename}>
      <AppShell />
    </Router>
  );
}
