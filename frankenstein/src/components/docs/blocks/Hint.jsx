import React from 'react';

const STYLES = {
  info:    { bg: '#e6f2f1', border: '#529c9c', fg: '#0e1c31', icon: 'i' },
  success: { bg: '#ecf6f0', border: '#4a9d76', fg: '#0e1c31', icon: '✓' },
  warning: { bg: '#fbf2e3', border: '#cf9342', fg: '#0e1c31', icon: '!' },
  danger:  { bg: '#fbe9e9', border: '#c55a5a', fg: '#0e1c31', icon: '!' },
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
