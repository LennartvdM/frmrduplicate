import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { assetUrl } from '../../../utils/assetUrl';

/**
 * Native React port of frmrduplicate's auto-cycling world map.
 *
 * Animation: cycles through 4 cities (Leiden → Philadelphia → Vienna → Melbourne).
 * For each city: unzoomed view for 3s → zoomed view for 5s → advance to next.
 * Pan/zoom is driven by dynamic SVG viewBox with lightweight spring physics.
 */

const MAP_WIDTH = 1440;
const MAP_HEIGHT = 700;

const SPRING = { damping: 15, stiffness: 30, mass: 1 };

const CITIES = [
  {
    id: 'leiden',
    name: 'LUMC Leiden',
    x: 696,
    y: 164,
    unzoomedZoom: 5,
    zoomedZoom: 20,
  },
  {
    id: 'philadelphia',
    name: 'NICU Philadelphia',
    x: 377,
    y: 235,
    unzoomedZoom: 6,
    zoomedZoom: 20,
  },
  {
    id: 'vienna',
    name: 'NICU Vienna',
    x: 742,
    y: 190,
    unzoomedZoom: 7,
    zoomedZoom: 20,
  },
  {
    id: 'melbourne',
    name: 'NICU Melbourne',
    x: 1257,
    y: 573,
    unzoomedZoom: 4,
    zoomedZoom: 20,
  },
];

const UNZOOMED_DWELL_MS = 3000;
const ZOOMED_DWELL_MS = 5000;

export default function WorldMapSection({ inView }) {
  const [cityIndex, setCityIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const containerRef = useRef(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });

  // Track container dimensions so viewBox scales correctly
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

  // Auto-cycle: pause while section is off-screen
  useEffect(() => {
    if (inView === false) return undefined;
    const delay = isZoomed ? ZOOMED_DWELL_MS : UNZOOMED_DWELL_MS;
    const timer = setTimeout(() => {
      if (isZoomed) {
        setIsZoomed(false);
        setCityIndex((i) => (i + 1) % CITIES.length);
      } else {
        setIsZoomed(true);
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [cityIndex, isZoomed, inView]);

  const city = CITIES[cityIndex];
  const targetX = city.x;
  const targetY = city.y;
  const targetZoom = isZoomed ? city.zoomedZoom : city.unzoomedZoom;

  const xSpring = useSpring(targetX, SPRING);
  const ySpring = useSpring(targetY, SPRING);
  const zoomSpring = useSpring(targetZoom, SPRING);

  useEffect(() => {
    xSpring.set(targetX);
    ySpring.set(targetY);
    zoomSpring.set(targetZoom);
  }, [targetX, targetY, targetZoom, xSpring, ySpring, zoomSpring]);

  // Compute viewBox dynamically from spring motion values
  const containerW = containerSize.width || 1;
  const containerH = containerSize.height || 1;
  const viewBox = useTransform([xSpring, ySpring, zoomSpring], ([xv, yv, zv]) => {
    if (!containerW || !containerH) return `0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`;
    const heightRatio = containerH / MAP_HEIGHT;
    const vbHeight = MAP_HEIGHT / zv;
    const vbWidth = containerW / heightRatio / zv;
    const vbLeft = xv - vbWidth / 2;
    const vbTop = yv - vbHeight / 2;
    return `${vbLeft} ${vbTop} ${vbWidth} ${vbHeight}`;
  });

  const handleCityClick = (idx) => {
    setCityIndex(idx);
    setIsZoomed(false);
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

      {/* City label — dead-center of the screen, visible through the
          whole two-pronged cycle (unzoomed → zoomed) for this city.
          Only fades on transition to a new city. */}
      <motion.div
        key={city.id}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
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
              {city.name}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Legend — clickable city pills at bottom */}
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
          {CITIES.map((c, idx) => {
            const active = idx === cityIndex;
            return (
              <button
                key={c.id}
                onClick={() => handleCityClick(idx)}
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
                {c.name.replace(/^(NICU |LUMC )/, '')}
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
