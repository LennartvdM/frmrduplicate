import React from 'react';

// GitBook {% embed url="..." %} — typically a link-preview card for an external
// article. We render a simple card. YouTube / Vimeo URLs could be upgraded to
// inline players later; kept as a link card for now to stay honest about what
// we can render without fetching the target.
export default function Embed({ url, children }) {
  const host = safeHost(url);
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="docs-embed"
      style={{
        display: 'block',
        margin: '20px 0',
        padding: '16px 18px',
        border: '1px solid #e4e8ee',
        borderRadius: 10,
        background: 'white',
        textDecoration: 'none',
        color: 'inherit',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#6ea8ff';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(14, 28, 49, 0.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e4e8ee';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ fontSize: 12, color: '#6ea8ff', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
        {host || 'External link'}
      </div>
      <div style={{ fontSize: 14, color: '#0e1c31', wordBreak: 'break-all' }}>{url}</div>
      {children && React.Children.count(children) > 0 && (
        <div style={{ marginTop: 8, fontSize: 13, color: '#5a6674' }}>{children}</div>
      )}
    </a>
  );
}

function safeHost(url) {
  try { return new URL(url).host.replace(/^www\./, ''); } catch { return null; }
}
