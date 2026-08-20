import React from 'react';
import WorldMap from './WorldMap';

// Slide 4: full-bleed worldmap. The shared <WorldMap> handles the Framer
// mount and city-marker click → /toolbox/... slide-routing.
export default function WorldMapSection() {
  return <WorldMap className="w-full h-full" />;
}
