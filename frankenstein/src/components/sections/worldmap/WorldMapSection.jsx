import React, { useEffect, useRef, useState } from 'react';
import { motion, useSpring, useMotionValue, useTransform, animate } from 'framer-motion';
import { assetUrl } from '../../../utils/assetUrl';

/**
 * Port of frmrduplicate's MapComponent (chunk--framer-motion.mjs Ye+fa).
 *
 * Semantic translation note: Framer SDK's useSpring does NOT auto-track its
 * source argument — you drive it via `.set(value)` and the spring animates
 * toward that value. npm framer-motion's useSpring DOES auto-track the
 * argument. So the source's pattern:
 *
 *     R = useSpring(n, F);  useEffect(() => R.set(n), [n]);
 *
 * becomes simply `useSpring(n, F)` here — the spring auto-animates on prop
 * change with identical physics. Redundant `.set()` calls on an auto-tracking
 * spring would snap-cancel the in-progress animation, which is what was
 * causing the spring behavior to feel off.
 *
 * For zoom, the source overrides the spring with a two-phase tween
 * (`D.set(c, {duration})` / `D.set(l, {duration})`). In npm framer-motion
 * that overload doesn't exist; we use a plain useMotionValue + `animate()`
 * so the two-phase tween is the sole driver and nothing competes with it.
 */

// ─── Ye: inner map viewport (lines 1964-2065 in source) ────────────────────
function Ye({
  x: n,
  y: i,          // source prop is named "ControlType" (deobfuscation artifact); values are y.
  zoom: l,
  showCrosshair: d,
  transitionDuration: h,
  peakZoom: c,
}) {
  const b = useRef(null);
  const [k, S] = useState({ width: 0, height: 0 });
  const o = 1440;
  const L = 700;
  const F = { damping: 15, stiffness: 30, mass: 1 };
  // x/y: useSpring auto-tracks the prop; animating in on change is implicit.
  const R = useSpring(n, F);
  const p = useSpring(i, F);
  // zoom: plain motion value controlled exclusively by the two-phase tween.
  const D = useMotionValue(l);

  useEffect(() => {
    let a1 = null;
    let a2 = null;
    let cancelled = false;
    (async () => {
      a1 = animate(D, c, { duration: h / 2 });
      await a1.finished;
      if (cancelled) return;
      a2 = animate(D, l, { duration: h / 2 });
      await a2.finished;
    })();
    return () => {
      cancelled = true;
      if (a1) a1.stop();
      if (a2) a2.stop();
    };
  }, [l, h, c, D]);

  useEffect(() => {
    const w = () => {
      if (b.current) {
        const { width: a, height: f } = b.current.getBoundingClientRect();
        S({ width: a, height: f });
      }
    };
    w();
    window.addEventListener('resize', w);
    return () => window.removeEventListener('resize', w);
  }, []);

  const _ = (w, a, f) => {
    if (k.width && k.height) {
      const u = k.height / L;
      const T = L / f;
      const X = k.width / u / f;
      const Q = w - X / 2;
      const K = a - T / 2;
      return `${Q} ${K} ${X} ${T}`;
    }
    return `0 0 ${o} ${L}`;
  };
  const s = useTransform([R, p, D], ([w, a, f]) => _(w, a, f));

  return (
    <div
      ref={b}
      style={{
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <motion.svg
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid slice"
        viewBox={s}
      >
        <image href={assetUrl('/worldmap.svg')} width={o} height={L} />
      </motion.svg>
      {d && (
        <svg
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
          }}
        >
          <line x1="49.5%" y1="0" x2="49.5%" y2="100%" stroke="red" strokeWidth="1" />
          <line x1="0" y1="49.5%" x2="100%" y2="49.5%" stroke="red" strokeWidth="1" />
        </svg>
      )}
    </div>
  );
}

// ─── Variant cycle (lines 2553-2850 in source) ─────────────────────────────

// Variant IDs in cycle order (Yr at line 2553).
const Yr = [
  'JxNX4Rz95', // Leiden
  'xKuwJW1Uo', // Leiden Zoomed
  'EvvqCP6nV', // Philadelphia
  'SU3ycjUmU', // Philadelphia Zoomed
  'jnA617SP9', // Vienna
  'V7QOBUaOQ', // Vienna Zoomed
  'MVG35Wb9S', // Australia (Melbourne)
  'bcMqa8ndK', // Australia Zoomed
];

// Per-variant (x, y, zoom) overrides merged onto base state (lines 2828-2849).
// Base: x=696, y=164, zoom=5, transitionDuration=6.4, peakZoom=15.
const VARIANT_COORDS = {
  JxNX4Rz95: { x: 696,  y: 164, zoom: 5,  transitionDuration: 6.4 },
  xKuwJW1Uo: { x: 696,  y: 164, zoom: 20, transitionDuration: 6.4 },
  EvvqCP6nV: { x: 377,  y: 235, zoom: 6,  transitionDuration: 6.4 },
  SU3ycjUmU: { x: 377,  y: 235, zoom: 20, transitionDuration: 6.4 },
  jnA617SP9: { x: 742,  y: 190, zoom: 7,  transitionDuration: 6.4 },
  V7QOBUaOQ: { x: 742,  y: 190, zoom: 20, transitionDuration: 6.4 },
  MVG35Wb9S: { x: 1257, y: 573, zoom: 4,  transitionDuration: 6.3 },
  bcMqa8ndK: { x: 1259, y: 573, zoom: 20, transitionDuration: 6.4 },
};

// Auto-advance delays (lines 2692-2713).
// Pattern: unzoomed → 3s → zoomed → 5s → next unzoomed.
const DWELL_MS = {
  JxNX4Rz95: 3000, xKuwJW1Uo: 5000,
  EvvqCP6nV: 3000, SU3ycjUmU: 5000,
  jnA617SP9: 3000, V7QOBUaOQ: 5000,
  MVG35Wb9S: 3000, bcMqa8ndK: 5000,
};

// Display labels for the legend and center tag.
const VARIANT_LABEL = {
  JxNX4Rz95: 'LUMC Leiden',       xKuwJW1Uo: 'LUMC Leiden',
  EvvqCP6nV: 'NICU Philadelphia', SU3ycjUmU: 'NICU Philadelphia',
  jnA617SP9: 'NICU Vienna',       V7QOBUaOQ: 'NICU Vienna',
  MVG35Wb9S: 'NICU Melbourne',    bcMqa8ndK: 'NICU Melbourne',
};

const VARIANT_CITY = {
  JxNX4Rz95: 'leiden',       xKuwJW1Uo: 'leiden',
  EvvqCP6nV: 'philadelphia', SU3ycjUmU: 'philadelphia',
  jnA617SP9: 'vienna',       V7QOBUaOQ: 'vienna',
  MVG35Wb9S: 'melbourne',    bcMqa8ndK: 'melbourne',
};

const CITY_ORDER = ['leiden', 'philadelphia', 'vienna', 'melbourne'];
const CITY_LEGEND_LABEL = {
  leiden: 'Leiden',
  philadelphia: 'Philadelphia',
  vienna: 'Vienna',
  melbourne: 'Melbourne',
};

export default function WorldMapSection({ inView }) {
  const [variant, setVariant] = useState(Yr[0]);

  // Auto-cycle (pauses when section is off-screen).
  useEffect(() => {
    if (inView === false) return undefined;
    const delay = DWELL_MS[variant];
    if (!delay) return undefined;
    const timer = setTimeout(() => {
      const i = Yr.indexOf(variant);
      setVariant(Yr[(i + 1) % Yr.length]);
    }, delay);
    return () => clearTimeout(timer);
  }, [variant, inView]);

  const coords = VARIANT_COORDS[variant];
  const city = VARIANT_CITY[variant];

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, opacity: 0.77 }}>
        <Ye
          x={coords.x}
          y={coords.y}
          zoom={coords.zoom}
          transitionDuration={coords.transitionDuration}
          peakZoom={15}
          showCrosshair={false}
        />
      </div>

      {/* Center pin+label — persists across both variants of the current city */}
      <motion.div
        key={city}
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
              {VARIANT_LABEL[variant]}
            </h2>
          </div>
        </div>
      </motion.div>

      {/* Legend (Leganda in source) — 4 city pills at bottom */}
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
          {CITY_ORDER.map((c) => {
            const active = c === city;
            return (
              <button
                key={c}
                onClick={() => {
                  const idx = Yr.findIndex((v) => VARIANT_CITY[v] === c);
                  if (idx !== -1) setVariant(Yr[idx]);
                }}
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
                {CITY_LEGEND_LABEL[c]}
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
