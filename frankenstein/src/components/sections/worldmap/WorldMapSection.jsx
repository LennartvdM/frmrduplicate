import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';
import { assetUrl } from '../../../utils/assetUrl';

/**
 * Native React port of frmrduplicate's auto-cycling world map.
 * Faithful to chunk--framer-motion.mjs (MapComponent / Ye).
 *
 * Behavior:
 *   - 8 variants: 4 cities × (unzoomed, zoomed) = 8 states, played in order.
 *   - Dwell 3s on unzoomed, 5s on zoomed, then advance.
 *   - On each variant change: x/y spring toward target (damping:15, stiffness:30, mass:1);
 *     zoom tweens in two phases: current → peakZoom(15) → target, each phase taking
 *     transitionDuration/2 seconds. This creates the "pull out over the world, push
 *     back in on the next city" camera feel.
 *   - ViewBox computed so aspect ratio matches the container exactly.
 */

const MAP_WIDTH = 1440;
const MAP_HEIGHT = 700;
const PEAK_ZOOM = 15;
const SPRING = { damping: 15, stiffness: 30, mass: 1 };

// Exact values from chunk--framer-motion.mjs:2820-2850.
// Property name in the source is "ControlType" — a deobfuscation artifact
// where Framer's ControlType enum key stood in for the y prop; values ARE y.
const VARIANTS = [
  { id: 'JxNX4Rz95', city: 'leiden',       label: 'LUMC Leiden',        x: 696,  y: 164, zoom: 5,  dwellMs: 3000, transitionDuration: 6.4 },
  { id: 'xKuwJW1Uo', city: 'leiden',       label: 'LUMC Leiden',        x: 696,  y: 164, zoom: 20, dwellMs: 5000, transitionDuration: 6.4 },
  { id: 'EvvqCP6nV', city: 'philadelphia', label: 'NICU Philadelphia',  x: 377,  y: 235, zoom: 6,  dwellMs: 3000, transitionDuration: 6.4 },
  { id: 'SU3ycjUmU', city: 'philadelphia', label: 'NICU Philadelphia',  x: 377,  y: 235, zoom: 20, dwellMs: 5000, transitionDuration: 6.4 },
  { id: 'jnA617SP9', city: 'vienna',       label: 'NICU Vienna',        x: 742,  y: 190, zoom: 7,  dwellMs: 3000, transitionDuration: 6.4 },
  { id: 'V7QOBUaOQ', city: 'vienna',       label: 'NICU Vienna',        x: 742,  y: 190, zoom: 20, dwellMs: 5000, transitionDuration: 6.4 },
  { id: 'MVG35Wb9S', city: 'melbourne',    label: 'NICU Melbourne',     x: 1257, y: 573, zoom: 4,  dwellMs: 3000, transitionDuration: 6.3 },
  { id: 'bcMqa8ndK', city: 'melbourne',    label: 'NICU Melbourne',     x: 1259, y: 573, zoom: 20, dwellMs: 5000, transitionDuration: 6.4 },
];

const CITY_ORDER = ['leiden', 'philadelphia', 'vienna', 'melbourne'];
const LEGEND_LABELS = {
  leiden: 'Leiden',
  philadelphia: 'Philadelphia',
  vienna: 'Vienna',
  melbourne: 'Melbourne',
};

export default function WorldMapSection({ inView }) {
  const [idx, setIdx] = useState(0);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Track container dimensions so viewBox aspect matches exactly.
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setContainerSize({ width: rect.width, height: rect.height });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const v0 = VARIANTS[0];
  const xSpring = useSpring(v0.x, SPRING);
  const ySpring = useSpring(v0.y, SPRING);
  const zoomMV = useMotionValue(v0.zoom);

  // Drive animations on variant change: spring x/y, two-phase tween zoom.
  useEffect(() => {
    const v = VARIANTS[idx];
    xSpring.set(v.x);
    ySpring.set(v.y);
    const phaseDur = v.transitionDuration / 2;
    const a1 = animate(zoomMV, PEAK_ZOOM, { duration: phaseDur });
    let a2 = null;
    a1.then(() => {
      a2 = animate(zoomMV, v.zoom, { duration: phaseDur });
    });
    return () => {
      a1.stop();
      if (a2) a2.stop();
    };
  }, [idx, xSpring, ySpring, zoomMV]);

  // Auto-advance cycle. Pause when off-screen.
  useEffect(() => {
    if (inView === false) return undefined;
    const timer = setTimeout(() => {
      setIdx((i) => (i + 1) % VARIANTS.length);
    }, VARIANTS[idx].dwellMs);
    return () => clearTimeout(timer);
  }, [idx, inView]);

  // Compute viewBox dynamically — matches chunk--framer-motion.mjs:2002-2012.
  const containerW = containerSize.width;
  const containerH = containerSize.height;
  const viewBox = useTransform([xSpring, ySpring, zoomMV], ([xv, yv, zv]) => {
    if (!containerW || !containerH) return `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;
    const u = containerH / MAP_HEIGHT;
    const T = MAP_HEIGHT / zv;
    const X = containerW / u / zv;
    const Q = xv - X / 2;
    const K = yv - T / 2;
    return `${Q} ${K} ${X} ${T}`;
  });

  const current = VARIANTS[idx];
  const cityIdx = CITY_ORDER.indexOf(current.city);

  const handleLegendClick = (city) => {
    const targetIdx = VARIANTS.findIndex((v) => v.city === city);
    if (targetIdx !== -1) setIdx(targetIdx);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
      }}
    >
      {/* Map SVG with animated viewBox */}
      <motion.svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
        viewBox={viewBox}
        style={{ opacity: 0.77 }}
      >
        <image
          href={assetUrl('/worldmap.svg')}
          width={MAP_WIDTH}
          height={MAP_HEIGHT}
        />
      </motion.svg>

      {/* Pin + label — dead-center, persists through a city's full two-phase cycle */}
      <motion.div
        key={current.city}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.44, 0, 0.56, 1] }}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
      >
        <div
          className="px-6 py-3 rounded-xl"
          style={{
            backgroundColor: 'rgba(245, 249, 252, 0.5)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            boxShadow: '0px 1px 2px 0px rgba(0,0,0,0.25)',
          }}
        >
          <div className="flex items-center gap-2">
            <PinIcon />
            <h2
              style={{
                fontFamily: 'Inter, sans-serif',
                fontWeight: 700,
                fontSize: '31px',
                lineHeight: 1.1,
                color: 'rgb(56, 52, 55)',
                margin: 0,
              }}
            >
              {current.label}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Legend — clickable city pills at bottom (Leganda in source) */}
      <div className="absolute left-1/2 bottom-10 -translate-x-1/2 z-10">
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-[15px]"
          style={{
            border: '3px solid rgba(245, 249, 252, 0.6)',
            backgroundColor: 'rgba(245, 249, 252, 0.25)',
            backdropFilter: 'blur(6px)',
            WebkitBackdropFilter: 'blur(6px)',
          }}
        >
          {CITY_ORDER.map((city, i) => {
            const active = i === cityIdx;
            return (
              <button
                key={city}
                onClick={() => handleLegendClick(city)}
                className="px-4 py-2 rounded-[10px] transition-all"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: active ? 600 : 500,
                  fontSize: '14px',
                  color: active ? 'rgb(56, 52, 55)' : 'rgba(56, 52, 55, 0.7)',
                  backgroundColor: active
                    ? 'rgba(245, 249, 252, 0.9)'
                    : 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                {LEGEND_LABELS[city]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function PinIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="rgb(255, 130, 102)"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
    </svg>
  );
}
