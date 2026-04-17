import React from 'react';

// GitBook {% file src="..." %} — downloadable attachment. src is already
// rewritten to /docs-assets/... by the transformer.
export default function FileLink({ src, name }) {
  const displayName = name || (src ? src.split('/').pop() : 'Download');
  const ext = extOf(displayName);
  return (
    <a
      href={src}
      download
      className="docs-file"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 16px',
        margin: '10px 0',
        border: '1px solid #e4e8ee',
        borderRadius: 10,
        background: 'white',
        textDecoration: 'none',
        color: '#0e1c31',
        fontSize: 14,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: 34,
          height: 34,
          borderRadius: 6,
          background: '#f1f5f9',
          color: '#0e1c31',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: 0.5,
        }}
      >
        {ext.toUpperCase()}
      </span>
      <span style={{ fontWeight: 500 }}>{displayName}</span>
    </a>
  );
}

function extOf(name) {
  const m = /\.([a-z0-9]+)$/i.exec(name || '');
  return m ? m[1] : 'file';
}
