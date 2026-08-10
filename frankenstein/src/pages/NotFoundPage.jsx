/**
 * Catch-all route. Before this existed, App.jsx matched nothing for an unknown
 * top-level path and rendered an empty subtree — a blank white page with no way
 * back. Netlify serves 404.html (a real 404 status) for those URLs; this is
 * what the app shows once React takes over, and what /404.html prerenders.
 */
import React from 'react';
import useTransitionNavigate from '../hooks/useTransitionNavigate';
import '../components/docs/docs.css';

const LINKS = [
  { href: '/', label: 'Home' },
  { href: '/neoflix', label: 'Neoflix' },
  { href: '/publications', label: 'Publications' },
  { href: '/toolbox', label: 'Toolbox' },
];

export default function NotFoundPage() {
  const transitionNavigate = useTransitionNavigate();

  return (
    <main className="docs-not-found">
      <h1>Page not found</h1>
      <p>That page isn&rsquo;t here. It may have moved, or the link may be out of date.</p>
      <ul style={{ display: 'flex', gap: 20, flexWrap: 'wrap', listStyle: 'none', padding: 0 }}>
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                transitionNavigate(link.href);
              }}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
