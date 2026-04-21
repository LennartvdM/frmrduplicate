import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { assetUrl } from '../../../utils/assetUrl';

// ──────────────────────────────────────────────────────────────────────────
// Direct port of MapComponent from
// frmrduplicate/src/vendor/chunk--framer-motion.mjs.
//
// Panzoom (Ye, ~1964-2013): an <svg> whose viewBox is driven by three
// springs — x, y, zoom. The viewBox is recomputed so (x, y) sits at the
// center of the visible rect and `zoom` shrinks the rect about that
// point. On every variant change the zoom motion value tweens UP to
// peakZoom (15) over transitionDuration/2, then DOWN to the target zoom
// over another transitionDuration/2 — that's the signature "sweep out,
// move, sweep back in" the original has.
//
// Auto-cycle (fa, ~2663-2752): 8-state loop alternating wide/zoomed for
// each of Leiden → Philadelphia → Vienna → Melbourne. Each wide state
// holds 3s before going to its zoomed pair; each zoomed state holds 5s
// before jumping to the next city. One full loop = 32s.
// ──────────────────────────────────────────────────────────────────────────

const SVG_W = 1440;
const SVG_H = 700;
const PEAK_ZOOM = 15;
const SPRING = { damping: 15, stiffness: 30, mass: 1 };

// x, y match the Panzoom coords from the variant tables; zoom and
// transitionDuration match the per-variant overrides. delay is how long
// we hold on this state before advancing. Order matches the state
// machine in useOnVariantChange.
const CYCLE = [
  { id: 'leiden-wide',       label: 'NICU Leiden',       x: 696,  y: 164, zoom: 5,  transitionDuration: 6.4, delay: 3000 },
  { id: 'leiden-zoomed',     label: 'NICU Leiden',       x: 696,  y: 164, zoom: 20, transitionDuration: 6.4, delay: 5000 },
  { id: 'philadelphia-wide', label: 'NICU Philadelphia', x: 377,  y: 235, zoom: 6,  transitionDuration: 6.4, delay: 3000 },
  { id: 'philadelphia-zoom', label: 'NICU Philadelphia', x: 377,  y: 235, zoom: 20, transitionDuration: 6.4, delay: 5000 },
  { id: 'vienna-wide',       label: 'NICU Vienna',       x: 742,  y: 190, zoom: 7,  transitionDuration: 6.4, delay: 3000 },
  { id: 'vienna-zoomed',     label: 'NICU Vienna',       x: 742,  y: 190, zoom: 20, transitionDuration: 6.4, delay: 5000 },
  { id: 'melbourne-wide',    label: 'NICU Melbourne',    x: 1257, y: 573, zoom: 4,  transitionDuration: 6.3, delay: 3000 },
  { id: 'melbourne-zoomed',  label: 'NICU Melbourne',    x: 1259, y: 573, zoom: 20, transitionDuration: 6.3, delay: 5000 },
];

export default function WorldMapSlide({ inView }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [idx, setIdx] = useState(0);
  const active = CYCLE[idx];

  // Measure the container so viewBox math preserves aspect ratio.
  useEffect(() => {
    const measure = () => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      setSize({ width: r.width, height: r.height });
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // x, y springs — follow target smoothly. zoom is a raw motion value
  // driven by a two-phase tween (→ peakZoom → target) on each change,
  // which is why it can't be a spring: the duration is controlled
  // per-transition, not by physics.
  const xMV = useSpring(active.x, SPRING);
  const yMV = useSpring(active.y, SPRING);
  const zoomMV = useMotionValue(active.zoom);

  useEffect(() => {
    xMV.set(active.x);
    yMV.set(active.y);

    let cancelled = false;
    let current = null;
    (async () => {
      current = animate(zoomMV, PEAK_ZOOM, { duration: active.transitionDuration / 2 });
      await current;
      if (cancelled) return;
      current = animate(zoomMV, active.zoom, { duration: active.transitionDuration / 2 });
      await current;
    })();
    return () => {
      cancelled = true;
      current?.stop?.();
    };
  }, [active.x, active.y, active.zoom, active.transitionDuration, xMV, yMV, zoomMV]);

  // Advance through the 8-state cycle while the slide is in view.
  useEffect(() => {
    if (!inView) return undefined;
    const id = setTimeout(() => {
      setIdx((i) => (i + 1) % CYCLE.length);
    }, active.delay);
    return () => clearTimeout(id);
  }, [inView, idx, active.delay]);

  // Derived viewBox string — matches Ye's _() formula exactly:
  //   u = container_h / SVG_H
  //   vbH = SVG_H / zoom
  //   vbW = container_w / u / zoom
  //   vbX = x - vbW/2,   vbY = y - vbH/2
  const viewBox = useTransform([xMV, yMV, zoomMV], ([cx, cy, z]) => {
    if (!size.width || !size.height) return `0 0 ${SVG_W} ${SVG_H}`;
    const u = size.height / SVG_H;
    const vbH = SVG_H / z;
    const vbW = size.width / u / z;
    const vbX = cx - vbW / 2;
    const vbY = cy - vbH / 2;
    return `${vbX} ${vbY} ${vbW} ${vbH}`;
  });

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background:
          'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
      }}
    >
      <motion.svg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        viewBox={viewBox}
        style={{ display: 'block' }}
      >
        <image href={assetUrl('/assets/worldmap.svg')} width={SVG_W} height={SVG_H} />
      </motion.svg>

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: '10%',
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none',
        }}
      >
        <motion.div
          key={active.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          style={{
            fontFamily: '"Inter", "Inter Placeholder", sans-serif',
            fontWeight: 700,
            fontSize: 'clamp(20px, 2.4vw, 32px)',
            letterSpacing: '-0.5px',
            color: '#383437',
            padding: '10px 22px',
            borderRadius: 999,
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(5px)',
            WebkitBackdropFilter: 'blur(5px)',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)',
          }}
        >
          {active.label}
        </motion.div>
      </div>
    </div>
  );
}
