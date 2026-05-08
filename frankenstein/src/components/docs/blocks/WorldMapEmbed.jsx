import React, { lazy, Suspense } from 'react';

// Lazy-load the WorldMap so the ~500 kB Framer chunks stay out of the
// main bundle. Docs pages without {% worldmap %} pay nothing.
const WorldMap = lazy(() => import('../../sections/worldmap/WorldMap'));

const wrapperStyle = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 9',
  margin: '24px 0',
  borderRadius: 12,
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(14, 28, 49, 0.08)',
  background: 'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
};

// Renders {% worldmap %} from a docs page. Bounded box so the Framer
// MapComponent gets explicit dimensions (it sizes to its parent).
export default function WorldMapEmbed() {
  return (
    <div className="docs-worldmap-embed" style={wrapperStyle}>
      <Suspense fallback={null}>
        <WorldMap style={{ position: 'absolute', inset: 0 }} />
      </Suspense>
    </div>
  );
}
