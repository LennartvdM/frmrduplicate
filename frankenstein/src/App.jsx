import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';

function AppShell() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-[#F5F9FC]">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Placeholder routes — will be built out incrementally */}
        <Route path="/neoflix" element={<Placeholder title="Neoflix" />} />
        <Route path="/publications" element={<Placeholder title="Publications" />} />
        <Route path="/contact" element={<Placeholder title="Contact" />} />
        <Route path="/toolbox" element={<Placeholder title="Toolbox" />} />
      </Routes>
    </div>
  );
}

function Placeholder({ title }) {
  return (
    <div className="flex items-center justify-center min-h-screen pt-[60px]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-[#383437] mb-4" style={{ fontFamily: '"Inter", sans-serif' }}>
          {title}
        </h1>
        <p className="text-lg text-[#83828f]" style={{ fontFamily: '"Inter", sans-serif' }}>
          Coming soon
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router basename="/frankenstein">
      <AppShell />
    </Router>
  );
}
