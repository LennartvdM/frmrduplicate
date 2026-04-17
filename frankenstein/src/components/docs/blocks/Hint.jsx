import React from 'react';

const STYLES = {
  info:    { bg: '#eef4ff', border: '#6ea8ff', fg: '#0e1c31', icon: 'i' },
  success: { bg: '#ecfaf0', border: '#5cc48a', fg: '#0e1c31', icon: '✓' },
  warning: { bg: '#fff7e6', border: '#e0a24a', fg: '#0e1c31', icon: '!' },
  danger:  { bg: '#fdecec', border: '#d46a6a', fg: '#0e1c31', icon: '!' },
};

export default function Hint({ style = 'info', children }) {
  const cfg = STYLES[style] || STYLES.info;
  return (
    <aside
      role="note"
      className={`docs-hint docs-hint-${style}`}
      style={{
        borderLeft: `3px solid ${cfg.border}`,
        background: cfg.bg,
        color: cfg.fg,
        borderRadius: 8,
        padding: '14px 18px',
        margin: '20px 0',
        display: 'flex',
        gap: 12,
      }}
    >
      <span
        aria-hidden="true"
        style={{
          flexShrink: 0,
          width: 22,
          height: 22,
          borderRadius: '50%',
          background: cfg.border,
          color: 'white',
          fontWeight: 700,
          fontSize: 13,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 2,
        }}
      >
        {cfg.icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>{children}</div>
    </aside>
  );
}
