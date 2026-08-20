import React, { lazy, Suspense, useCallback, useState } from 'react';

// Lazy-load the WorldMap so the ~500 kB Framer chunks stay out of the
// main bundle. Docs pages without {% worldmap %} pay nothing.
const WorldMap = lazy(() => import('../../../site/worldmap/WorldMap'));

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

// City strings authored in markdown (case-insensitive). The build script
// passes the raw value through; we normalize here.
const CITY_BY_KEY = {
  leiden: 'Leiden',
  philadelphia: 'Philadelphia',
  vienna: 'Vienna',
  melbourne: 'Melbourne',
};

const CITY_VARIANTS = {
  Leiden: 'JxNX4Rz95',
  Philadelphia: 'EvvqCP6nV',
  Vienna: 'jnA617SP9',
  Melbourne: 'MVG35Wb9S',
};

// Renders {% worldmap %} (autocycling) or {% worldmap city="vienna" %}
// (paused on Vienna; first click anywhere in the embed starts the
// autocycle). Bounded box so the Framer MapComponent gets explicit
// dimensions.
export default function WorldMapEmbed({ city: cityKey }) {
  const city = cityKey ? CITY_BY_KEY[String(cityKey).toLowerCase()] || null : null;
  const variant = city ? CITY_VARIANTS[city] : undefined;
  const [paused, setPaused] = useState(Boolean(city));
  const handleActivate = useCallback(() => setPaused(false), []);

  return (
    <div className="docs-worldmap-embed" data-paused={paused || undefined} style={wrapperStyle}>
      <Suspense fallback={null}>
        <WorldMap
          variant={variant}
          paused={paused}
          currentCity={city}
          onActivate={handleActivate}
          style={{ position: 'absolute', inset: 0 }}
        />
      </Suspense>
    </div>
  );
}
