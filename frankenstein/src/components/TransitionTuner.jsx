import React, { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import useViewTransition from '../hooks/useViewTransition';
import { NAV_ORDER, getNavIndexForPath } from '../hooks/useNavIndex';

/**
 * TransitionTuner — calibration panel for the route-transition timing.
 *
 * Ships behind a gate (dev build, or `?tune` in the URL) so the bundle
 * is always small in production. When active, writes to CSS custom
 * properties on `documentElement.style`:
 *
 *   --slide-duration    — duration of slide-out and slide-in
 *   --slide-pause       — delay before slide-in starts (the mid-gap)
 *   --slide-out-ease    — cubic-bezier for slide-out
 *   --slide-in-ease     — cubic-bezier for slide-in
 *   --backdrop-duration — duration of backdrop deck-fade-out
 *   --backdrop-ease     — cubic-bezier for backdrop
 *   --blog-stagger      — extra delay for the trailing column of the
 *                         two-column blog layout (sidebar vs article)
 *
 * These shadow the `:root` defaults declared in index.css at higher
 * specificity, so the tuner hot-swaps live. Values persist to
 * localStorage so a calibration survives reloads within a session.
 *
 * Preview buttons trigger `useViewTransition` across adjacent routes
 * (wrapping at the ends of NAV_ORDER) so you can hammer the slide
 * without actually going anywhere interesting. The panel itself is
 * pinned with view-transition-name:tuner and animation:none in CSS,
 * so it doesn't slide during the very transitions it's tuning.
 *
 * Bezier curves support overshoot: control-point y values outside
 * [0,1] are allowed (that's how `cubic-bezier(0.34, 1.56, 0.64, 1)`
 * gives you a "back-out" settle). The SVG preview extends its viewBox
 * above/below the unit square so overshoot is visible.
 */

const STORAGE_KEY = 'transition-tuner:v1';

// Baseline the tuner resets to. Matches the `:root` block in index.css
// so production (no-tuner) and "Reset" (tuner active) produce the same
// timing. Re-calibrated via the tuner and locked in.
const DEFAULTS = {
  slideDuration: 0.58,
  slidePause: 0.36,
  slideOutEase: [1.0, 0.34, 0.0, 0.34],
  slideInEase: [1.0, 0.75, 0.28, 0.73],
  backdropDuration: 2.0,
  backdropEase: [0.0, -0.02, 0.2, 1.0],
  blogStagger: 0.5,
};

// Named preset pairs. Tweak slide-out/slide-in together to keep the
// outgoing and incoming halves feeling coordinated.
const PRESETS = {
  'Standard': { slideOutEase: [0.4, 0, 0.2, 1], slideInEase: [0.4, 0, 0.2, 1] },
  'Material': { slideOutEase: [0.4, 0, 1, 1], slideInEase: [0, 0, 0.2, 1] },
  'iOS smooth': { slideOutEase: [0.32, 0.72, 0, 1], slideInEase: [0.32, 0.72, 0, 1] },
  'Snappy': { slideOutEase: [0.55, 0, 1, 0.45], slideInEase: [0, 0.55, 0.45, 1] },
  'Gentle swoop': { slideOutEase: [0.55, 0.06, 0.68, 0.19], slideInEase: [0.22, 0.61, 0.36, 1] },
  'Overshoot-in': { slideOutEase: [0.4, 0, 0.2, 1], slideInEase: [0.34, 1.56, 0.64, 1] },
  'Anticipate + bounce': { slideOutEase: [0.6, -0.28, 0.735, 0.045], slideInEase: [0.175, 0.885, 0.32, 1.275] },
  'Linear': { slideOutEase: [0, 0, 1, 1], slideInEase: [0, 0, 1, 1] },
};

const bezierString = (v) =>
  `cubic-bezier(${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)}, ${v[3].toFixed(2)})`;

const applyVars = (v) => {
  const root = document.documentElement;
  root.style.setProperty('--slide-duration', `${v.slideDuration}s`);
  root.style.setProperty('--slide-pause', `${v.slidePause}s`);
  root.style.setProperty('--slide-out-ease', bezierString(v.slideOutEase));
  root.style.setProperty('--slide-in-ease', bezierString(v.slideInEase));
  root.style.setProperty('--backdrop-duration', `${v.backdropDuration}s`);
  root.style.setProperty('--backdrop-ease', bezierString(v.backdropEase));
  root.style.setProperty('--blog-stagger', `${v.blogStagger}s`);
};

const clearVars = () => {
  const root = document.documentElement;
  ['--slide-duration', '--slide-pause', '--slide-out-ease', '--slide-in-ease', '--backdrop-duration', '--backdrop-ease', '--blog-stagger']
    .forEach((k) => root.style.removeProperty(k));
};

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
};

function isEnabled() {
  if (typeof window === 'undefined') return false;
  if (import.meta.env.DEV) return true;
  return window.location.search.includes('tune');
}

/* ── Bezier curve viz ──────────────────────────────────────────────────
   100×100 logical grid for the unit square [0..1, 0..1]. viewBox extends
   down/up so curves that dip below 0 (anticipate) or above 1 (overshoot)
   stay visible instead of clipping. SVG y is flipped so up = progress. */
function BezierViz({ bezier, color = '#72c2c2' }) {
  const [x1, y1, x2, y2] = bezier;
  const toY = (y) => 100 - y * 100;
  return (
    <svg
      viewBox="-10 -60 120 220"
      style={{
        width: '100%',
        height: 96,
        background: 'rgba(255,255,255,0.04)',
        borderRadius: 4,
      }}
    >
      {/* unit square reference */}
      <rect x="0" y="0" width="100" height="100" fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="0.6" />
      {/* start & end markers */}
      <circle cx="0" cy="100" r="1.5" fill="rgba(255,255,255,0.5)" />
      <circle cx="100" cy="0" r="1.5" fill="rgba(255,255,255,0.5)" />
      {/* control handles */}
      <line x1="0" y1={toY(0)} x2={x1 * 100} y2={toY(y1)} stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
      <line x1="100" y1={toY(1)} x2={x2 * 100} y2={toY(y2)} stroke="rgba(255,255,255,0.3)" strokeWidth="0.6" />
      {/* curve */}
      <path
        d={`M 0,${toY(0)} C ${x1 * 100},${toY(y1)} ${x2 * 100},${toY(y2)} 100,${toY(1)}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
      {/* control points */}
      <circle cx={x1 * 100} cy={toY(y1)} r="2.5" fill={color} />
      <circle cx={x2 * 100} cy={toY(y2)} r="2.5" fill={color} />
    </svg>
  );
}

/* ── Labeled numeric input with slider ────────────────────────────────
   Small helper that gives both a coarse range slider and a precise
   number input per value. Overshoot-capable: min/max/step are callers'
   choice. */
function NumberField({ label, value, onChange, min, max, step }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
      <span style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span>{label}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums', color: 'white' }}>{value.toFixed(2)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ accentColor: '#72c2c2', margin: 0 }}
      />
    </label>
  );
}

/* ── Bezier editor ───────────────────────────────────────────────────── */
function BezierEditor({ label, bezier, onChange, color }) {
  const update = (idx, val) => {
    const next = [...bezier];
    next[idx] = val;
    onChange(next);
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: 'white' }}>{label}</span>
        <code style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }}>
          {bezier.map((n) => n.toFixed(2)).join(', ')}
        </code>
      </div>
      <BezierViz bezier={bezier} color={color} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <NumberField label="P1 x" value={bezier[0]} onChange={(v) => update(0, v)} min={0} max={1} step={0.01} />
        <NumberField label="P1 y" value={bezier[1]} onChange={(v) => update(1, v)} min={-1} max={2} step={0.01} />
        <NumberField label="P2 x" value={bezier[2]} onChange={(v) => update(2, v)} min={0} max={1} step={0.01} />
        <NumberField label="P2 y" value={bezier[3]} onChange={(v) => update(3, v)} min={-1} max={2} step={0.01} />
      </div>
    </div>
  );
}

export default function TransitionTuner() {
  const [enabled] = useState(isEnabled);
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState(loadSaved);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const transitionNavigate = useViewTransition();

  // Push values to CSS + persist. Only when enabled — in plain
  // production we want the baseline CSS, untouched.
  useEffect(() => {
    if (!enabled) return;
    applyVars(values);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(values)); } catch {}
  }, [enabled, values]);

  // Clean up inline vars if the component unmounts (e.g. hot reload
  // during dev work on this file). Leaves :root defaults in effect.
  useEffect(() => {
    if (!enabled) return;
    return () => clearVars();
  }, [enabled]);

  const setField = useCallback((key, val) => {
    setValues((v) => ({ ...v, [key]: val }));
  }, []);

  const applyPreset = useCallback((name) => {
    const preset = PRESETS[name];
    if (!preset) return;
    setValues((v) => ({ ...v, ...preset }));
  }, []);

  const reset = useCallback(() => {
    setValues(DEFAULTS);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }, []);

  // Navigate to the adjacent route, wrapping. Slide direction is
  // decided by useViewTransition from the delta, so wrapping from
  // /toolbox (idx 4) to / (idx 0) still produces a valid left slide.
  const navByDelta = useCallback((delta) => {
    const currentIdx = getNavIndexForPath(location.pathname);
    const count = NAV_ORDER.length;
    const nextIdx = ((currentIdx + delta) % count + count) % count;
    transitionNavigate(NAV_ORDER[nextIdx].path);
  }, [location.pathname, transitionNavigate]);

  const cssBlock = `:root {
  --slide-duration: ${values.slideDuration}s;
  --slide-pause: ${values.slidePause}s;
  --slide-out-ease: ${bezierString(values.slideOutEase)};
  --slide-in-ease: ${bezierString(values.slideInEase)};
  --backdrop-duration: ${values.backdropDuration}s;
  --backdrop-ease: ${bezierString(values.backdropEase)};
  --blog-stagger: ${values.blogStagger}s;
}`;

  const copyCSS = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(cssBlock);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    } catch {
      // Clipboard API blocked — fall back to selecting the textarea
    }
  }, [cssBlock]);

  if (!enabled) return null;

  // Collapsed pill: small floating button that expands on click. Pinned
  // with viewTransitionName so route transitions don't drag it along.
  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        style={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          zIndex: 9999,
          viewTransitionName: 'tuner',
          background: 'rgba(14, 28, 49, 0.9)',
          color: 'white',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 999,
          padding: '8px 14px',
          fontSize: 12,
          fontFamily: 'Inter, sans-serif',
          fontWeight: 500,
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        }}
        aria-label="Open transition tuner"
      >
        ⚙ Tune transition
      </button>
    );
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 9999,
        viewTransitionName: 'tuner',
        width: 320,
        maxHeight: 'calc(100vh - 32px)',
        overflowY: 'auto',
        background: 'rgba(14, 28, 49, 0.95)',
        color: 'white',
        border: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 10,
        padding: 14,
        fontFamily: 'Inter, sans-serif',
        fontSize: 12,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong style={{ fontSize: 13, fontWeight: 700 }}>Transition tuner</strong>
        <button
          type="button"
          onClick={() => setOpen(false)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer',
            fontSize: 18,
            padding: 0,
            lineHeight: 1,
          }}
          aria-label="Close tuner"
        >
          ×
        </button>
      </div>

      {/* Preview buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <button type="button" onClick={() => navByDelta(-1)} style={btnStyle}>← Preview left</button>
        <button type="button" onClick={() => navByDelta(1)} style={btnStyle}>Preview right →</button>
      </div>

      {/* Timing sliders */}
      <section style={sectionStyle}>
        <h4 style={h4Style}>Timing</h4>
        <NumberField
          label="Slide duration (s)"
          value={values.slideDuration}
          onChange={(v) => setField('slideDuration', v)}
          min={0.05} max={1.2} step={0.01}
        />
        <NumberField
          label="Pause between out/in (s)"
          value={values.slidePause}
          onChange={(v) => setField('slidePause', v)}
          min={0} max={0.8} step={0.01}
        />
        <NumberField
          label="Backdrop duration (s)"
          value={values.backdropDuration}
          onChange={(v) => setField('backdropDuration', v)}
          min={0.1} max={2} step={0.01}
        />
        <NumberField
          label="Blog column stagger (s)"
          value={values.blogStagger}
          onChange={(v) => setField('blogStagger', v)}
          min={0} max={1.5} step={0.01}
        />
      </section>

      {/* Slide-out curve */}
      <section style={sectionStyle}>
        <BezierEditor
          label="Slide-out curve (outgoing)"
          bezier={values.slideOutEase}
          onChange={(v) => setField('slideOutEase', v)}
          color="#f59e0b"
        />
      </section>

      {/* Slide-in curve */}
      <section style={sectionStyle}>
        <BezierEditor
          label="Slide-in curve (incoming)"
          bezier={values.slideInEase}
          onChange={(v) => setField('slideInEase', v)}
          color="#72c2c2"
        />
      </section>

      {/* Backdrop curve */}
      <section style={sectionStyle}>
        <BezierEditor
          label="Backdrop fade curve"
          bezier={values.backdropEase}
          onChange={(v) => setField('backdropEase', v)}
          color="#8b5cf6"
        />
      </section>

      {/* Presets */}
      <section style={sectionStyle}>
        <h4 style={h4Style}>Presets (apply to both slide curves)</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {Object.keys(PRESETS).map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => applyPreset(name)}
              style={{
                ...btnStyle,
                padding: '4px 8px',
                fontSize: 11,
                flex: 'unset',
              }}
            >
              {name}
            </button>
          ))}
        </div>
      </section>

      {/* Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <button type="button" onClick={reset} style={btnStyle}>Reset</button>
        <button type="button" onClick={copyCSS} style={btnStyle}>
          {copied ? '✓ Copied' : 'Copy CSS'}
        </button>
      </div>

      {/* CSS preview */}
      <details>
        <summary style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
          CSS block
        </summary>
        <pre
          style={{
            marginTop: 6,
            padding: 8,
            background: 'rgba(0,0,0,0.3)',
            borderRadius: 4,
            fontSize: 10,
            lineHeight: 1.4,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            color: 'rgba(255,255,255,0.85)',
          }}
        >
          {cssBlock}
        </pre>
      </details>
    </div>
  );
}

const btnStyle = {
  background: 'rgba(255,255,255,0.1)',
  color: 'white',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 6,
  padding: '6px 10px',
  fontSize: 12,
  fontFamily: 'inherit',
  cursor: 'pointer',
  transition: 'background 0.15s',
};

const sectionStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  paddingTop: 10,
  borderTop: '1px solid rgba(255,255,255,0.1)',
};

const h4Style = {
  margin: 0,
  fontSize: 12,
  fontWeight: 600,
  color: 'white',
};
