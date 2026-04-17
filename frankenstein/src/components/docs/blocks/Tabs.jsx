import React, { useState } from 'react';
import DocsNode from '../DocsNode';

export default function Tabs({ children }) {
  // children is the raw AST children array of the tabs node. Each item should
  // be a `tab` node; anything else is rendered between tabs (rare).
  const tabs = (children || []).filter((c) => c && c.type === 'tab');
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;

  return (
    <div className="docs-tabs" style={{ margin: '20px 0', border: '1px solid #e4e8ee', borderRadius: 10, overflow: 'hidden' }}>
      <div
        role="tablist"
        style={{
          display: 'flex',
          gap: 0,
          borderBottom: '1px solid #e4e8ee',
          background: '#f7f9fc',
          overflowX: 'auto',
        }}
      >
        {tabs.map((tab, i) => {
          const isActive = i === active;
          return (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(i)}
              style={{
                padding: '10px 16px',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#0e1c31' : '#5a6674',
                background: isActive ? 'white' : 'transparent',
                border: 'none',
                borderBottom: isActive ? '2px solid #0e1c31' : '2px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {tab.title || `Tab ${i + 1}`}
            </button>
          );
        })}
      </div>
      <div role="tabpanel" style={{ padding: '18px 22px' }}>
        {(tabs[active].children || []).map((c, i) => (
          <DocsNode key={i} node={c} />
        ))}
      </div>
    </div>
  );
}
