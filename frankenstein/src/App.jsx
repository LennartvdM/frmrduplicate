import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Publications from './pages/Publications';
import Toolbox from './pages/Toolbox';
import SidebarScrollSpyDemo from './components/Sidebar';
import ToolboxEmbed from './components/ToolboxEmbed';

function AppShell() {
  const location = useLocation();
  const isNeoflix = location.pathname === '/neoflix' || location.pathname.startsWith('/neoflix/');
  const isToolbox = location.pathname.startsWith('/toolbox');

  return (
    <div className={`min-h-screen ${isNeoflix || isToolbox ? '' : 'bg-[#F5F9FC]'}`}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/neoflix" element={<SidebarScrollSpyDemo />} />
        <Route path="/publications" element={<Publications />} />
        <Route path="/toolbox" element={<Toolbox />} />
        <Route path="/toolbox/:slug" element={<ToolboxEmbed />} />
        <Route path="/contact" element={<SidebarScrollSpyDemo />} />
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
