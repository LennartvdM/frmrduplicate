import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { assetUrl } from '../../../utils/assetUrl';

// Ported from frmrduplicate MapComponent (chunk--framer-motion.mjs).
// City camera configs come from the Framer variant table; the auto-cycle
// advances every CYCLE_INTERVAL_MS. Spring physics match the original
// (damping:24, mass:9, stiffness:500) — see frmrduplicate/CLAUDE.md.
const VIEWBOX_W = 1440;
const VIEWBOX_H = 700;
const CYCLE_INTERVAL_MS = 3000;
const MAP_SPRING = { type: 'spring', damping: 24, mass: 9, stiffness: 500 };

const CITIES = [
  { id: 'leiden',       label: 'NICU Leiden',       x: 696,  y: 164, zoom: 5 },
  { id: 'philadelphia', label: 'NICU Philadelphia', x: 377,  y: 235, zoom: 6 },
  { id: 'vienna',       label: 'NICU Vienna',       x: 742,  y: 190, zoom: 7 },
  { id: 'melbourne',    label: 'NICU Melbourne',    x: 1257, y: 573, zoom: 4 },
];

function cameraTransform(city) {
  // Pan the map so the city sits at viewport center, then scale about
  // the (now-centered) point. Percentages are relative to the motion
  // element's own box — which fills the slide — so this works at any
  // viewport size without measuring.
  return {
    x: `${(0.5 - city.x / VIEWBOX_W) * 100}%`,
    y: `${(0.5 - city.y / VIEWBOX_H) * 100}%`,
    scale: city.zoom,
  };
}

export default function WorldMapSlide({ inView }) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (!inView) return undefined;
    const id = setInterval(() => {
      setActiveIdx((i) => (i + 1) % CITIES.length);
    }, CYCLE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [inView]);

  const active = CITIES[activeIdx];

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
      }}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          transformOrigin: '50% 50%',
          willChange: 'transform',
        }}
        animate={cameraTransform(active)}
        transition={MAP_SPRING}
      >
        <img
          src={assetUrl('/assets/worldmap.svg')}
          alt=""
          draggable={false}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />
      </motion.div>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '12%',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            style={{
              fontFamily: '"Inter", "Inter Placeholder", sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(24px, 3vw, 40px)',
              letterSpacing: '-0.5px',
              color: '#383437',
              padding: '10px 22px',
              borderRadius: 999,
              background: 'rgba(255, 255, 255, 0.72)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
            }}
          >
            {active.label}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
