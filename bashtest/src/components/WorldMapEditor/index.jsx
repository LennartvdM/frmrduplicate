import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Copy, Upload, Download, Trash2, Crosshair, Move3D, Target, Play, Square } from 'lucide-react';
import { cities as seedCities, zoomLevels as seedZoomLevels } from './mapLocations';

/**
 * Click-to-place world-map editor + preview player.
 *
 * View controls (editor-only, never persisted):
 *   - Mouse wheel        → zoom the editor viewBox around the cursor.
 *   - Drag on empty map  → pan the editor viewBox.
 *   - "Fit" button       → reset to the full 1440×700 map.
 *
 * City operations:
 *   - Click on empty map → place a new city at cursor position.
 *   - Drag a city        → nudge its position.
 *   - Click a city       → select it.
 *   - Sidebar trash      → remove.
 *
 * Preview mode:
 *   - "Play" steps through the cities with the same two-phase animation
 *     the runtime will use: pan + zoom-out to the next location, then
 *     zoom in, dwell, repeat. The dot strip under the map highlights
 *     the current city; click any dot to jump there.
 *   - Any manual interaction (wheel / pan / drag) stops the preview.
 *
 * One-way design: the editor only writes to localStorage, the clipboard,
 * or a JSON file download. Nothing is sent to the server, nothing
 * modifies the repo. Export payload is a single JSON document with
 * { cities, zoomLevels, locationPairs }.
 *
 * Data shape per city: { id, name, x, y, lat, lon }. (x, y) in SVG
 * viewBox units (1440 × 700). lat/lon are optional — filled only for
 * calibration anchors so a later pass can fit lat/lon → (x, y).
 */

const SVG_WIDTH = 1440;
const SVG_HEIGHT = 700;
const MIN_VIEW_WIDTH = 40;
const MOVE_THRESHOLD_PX = 3;
const STORAGE_KEY = 'worldMapEditor.cities.v2';
const ZOOM_STORAGE_KEY = 'worldMapEditor.zoomLevels.v2';

// Preview animation constants — the same two-phase pan+zoom pattern the
// runtime worldmap uses. pan_ms covers "zoom out while moving to next
// location"; zoom_in_ms covers "zoom in at destination"; dwell_ms is the
// pause before moving on.
const PREVIEW_PAN_MS = 1500;
const PREVIEW_ZOOM_IN_MS = 1000;
const PREVIEW_DWELL_MS = 2000;

// Matches the teal gradient used by the runtime worldmap section and
// /frmrduplicate/ — land masses from the SVG render white on top of this.
const MAP_GRADIENT = 'linear-gradient(to bottom, #D3E3E3, #529C9C)';

// Prefix with Vite's base URL so the map loads correctly whether the site
// deploys at `/` or at a subpath (e.g. `/bashtest/`).
const WORLDMAP_URL = `${(import.meta.env.BASE_URL || '/').replace(/\/+$/, '')}/worldmap.svg`;

const fullViewBox = () => ({ x: 0, y: 0, w: SVG_WIDTH, h: SVG_HEIGHT });

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function loadCities() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedCities;
}

function loadZoom() {
  try {
    const raw = localStorage.getItem(ZOOM_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedZoomLevels;
}

function clampViewBox(vb) {
  const w = Math.min(SVG_WIDTH, Math.max(MIN_VIEW_WIDTH, vb.w));
  const h = w * (SVG_HEIGHT / SVG_WIDTH);
  const x = Math.min(SVG_WIDTH - w, Math.max(0, vb.x));
  const y = Math.min(SVG_HEIGHT - h, Math.max(0, vb.y));
  return { x, y, w, h };
}

function roundCoord(n) {
  return Math.round(n * 10) / 10;
}

export default function WorldMapEditor() {
  const [cities, setCities] = useState(loadCities);
  const [viewBox, setViewBox] = useState(fullViewBox);
  const [cursorSvg, setCursorSvg] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [zoomLevels, setZoomLevels] = useState(loadZoom);
  const [toast, setToast] = useState(null);
  const [previewIdx, setPreviewIdx] = useState(null);

  const svgRef = useRef(null);
  const panRef = useRef(null);
  const dragRef = useRef(null);
  const previewRunRef = useRef(null);
  const previewTimerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }, [cities]);

  useEffect(() => {
    localStorage.setItem(ZOOM_STORAGE_KEY, JSON.stringify(zoomLevels));
  }, [zoomLevels]);

  useEffect(() => {
    if (!toast) return;
    const id = setTimeout(() => setToast(null), 2000);
    return () => clearTimeout(id);
  }, [toast]);

  const screenToSvg = useCallback((clientX, clientY) => {
    const svg = svgRef.current;
    if (!svg) return null;
    const rect = svg.getBoundingClientRect();
    const relX = (clientX - rect.left) / rect.width;
    const relY = (clientY - rect.top) / rect.height;
    return {
      x: viewBox.x + relX * viewBox.w,
      y: viewBox.y + relY * viewBox.h,
    };
  }, [viewBox]);

  const handleWheel = useCallback((e) => {
    e.preventDefault();
    if (previewRunRef.current) { previewRunRef.current.cancelled = true; setPreviewIdx(null); }
    const factor = Math.exp(e.deltaY * 0.0015);
    const at = screenToSvg(e.clientX, e.clientY);
    if (!at) return;
    setViewBox((vb) => {
      const nextW = Math.min(SVG_WIDTH, Math.max(MIN_VIEW_WIDTH, vb.w * factor));
      const scale = nextW / vb.w;
      return clampViewBox({
        x: at.x - (at.x - vb.x) * scale,
        y: at.y - (at.y - vb.y) * scale,
        w: nextW,
        h: nextW * (SVG_HEIGHT / SVG_WIDTH),
      });
    });
  }, [screenToSvg]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return undefined;
    const wheelHandler = (e) => handleWheel(e);
    svg.addEventListener('wheel', wheelHandler, { passive: false });
    return () => svg.removeEventListener('wheel', wheelHandler);
  }, [handleWheel]);

  const beginPan = useCallback((e) => {
    if (previewRunRef.current) { previewRunRef.current.cancelled = true; setPreviewIdx(null); }
    panRef.current = {
      startClient: { x: e.clientX, y: e.clientY },
      startVB: { ...viewBox },
      moved: false,
    };
  }, [viewBox]);

  const beginCityDrag = useCallback((e, city) => {
    e.stopPropagation();
    if (previewRunRef.current) { previewRunRef.current.cancelled = true; setPreviewIdx(null); }
    setSelectedId(city.id);
    dragRef.current = {
      id: city.id,
      startClient: { x: e.clientX, y: e.clientY },
      startPos: { x: city.x, y: city.y },
      moved: false,
    };
  }, []);

  const handleMouseMove = useCallback((e) => {
    const pt = screenToSvg(e.clientX, e.clientY);
    setCursorSvg(pt);

    if (dragRef.current) {
      const d = dragRef.current;
      const dx = e.clientX - d.startClient.x;
      const dy = e.clientY - d.startClient.y;
      if (!d.moved && Math.abs(dx) + Math.abs(dy) > MOVE_THRESHOLD_PX) {
        d.moved = true;
      }
      if (d.moved && pt) {
        setCities((cs) => cs.map((c) => (
          c.id === d.id ? { ...c, x: roundCoord(pt.x), y: roundCoord(pt.y) } : c
        )));
      }
      return;
    }

    if (panRef.current) {
      const p = panRef.current;
      const dx = e.clientX - p.startClient.x;
      const dy = e.clientY - p.startClient.y;
      if (!p.moved && Math.abs(dx) + Math.abs(dy) > MOVE_THRESHOLD_PX) {
        p.moved = true;
      }
      if (p.moved) {
        const svg = svgRef.current;
        const rect = svg.getBoundingClientRect();
        const svgDx = (dx / rect.width) * p.startVB.w;
        const svgDy = (dy / rect.height) * p.startVB.h;
        setViewBox(clampViewBox({
          ...p.startVB,
          x: p.startVB.x - svgDx,
          y: p.startVB.y - svgDy,
        }));
      }
    }
  }, [screenToSvg]);

  const handleMouseUp = useCallback((e) => {
    if (dragRef.current) {
      const d = dragRef.current;
      dragRef.current = null;
      if (!d.moved) {
        setSelectedId(d.id);
      }
      return;
    }
    if (panRef.current) {
      const p = panRef.current;
      panRef.current = null;
      if (!p.moved && e.button === 0) {
        const pt = screenToSvg(e.clientX, e.clientY);
        if (!pt) return;
        const newCity = {
          id: `c${Date.now()}`,
          name: `City ${cities.length + 1}`,
          x: roundCoord(pt.x),
          y: roundCoord(pt.y),
          lat: null,
          lon: null,
        };
        setCities((cs) => [...cs, newCity]);
        setSelectedId(newCity.id);
      }
    }
  }, [cities.length, screenToSvg]);

  useEffect(() => {
    const up = (e) => handleMouseUp(e);
    const move = (e) => handleMouseMove(e);
    window.addEventListener('mouseup', up);
    window.addEventListener('mousemove', move);
    return () => {
      window.removeEventListener('mouseup', up);
      window.removeEventListener('mousemove', move);
    };
  }, [handleMouseMove, handleMouseUp]);

  const renameCity = (id, name) => {
    setCities((cs) => cs.map((c) => (c.id === id ? { ...c, name } : c)));
  };
  const setCityLat = (id, value) => {
    setCities((cs) => cs.map((c) => (c.id === id ? { ...c, lat: value === '' ? null : Number(value) } : c)));
  };
  const setCityLon = (id, value) => {
    setCities((cs) => cs.map((c) => (c.id === id ? { ...c, lon: value === '' ? null : Number(value) } : c)));
  };
  const removeCity = (id) => {
    setCities((cs) => cs.filter((c) => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const centerOn = (city) => {
    setSelectedId(city.id);
    setViewBox((vb) => clampViewBox({
      ...vb,
      x: city.x - vb.w / 2,
      y: city.y - vb.h / 2,
    }));
  };

  // Preview: scripted two-phase animation through the city list. Each
  // iteration is (pan + zoom-out to next city) → (zoom-in) → (dwell).
  // Any manual interaction (wheel / pan / drag) stops the run.
  const stopPreview = useCallback(() => {
    if (previewRunRef.current) previewRunRef.current.cancelled = true;
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
      previewTimerRef.current = null;
    }
    previewRunRef.current = null;
    setPreviewIdx(null);
  }, []);

  const tweenViewBox = useCallback((from, to, durationMs, run) => (
    new Promise((resolve) => {
      const start = performance.now();
      const step = (now) => {
        if (run.cancelled) { resolve(false); return; }
        const t = Math.min(1, (now - start) / durationMs);
        const e = easeInOutCubic(t);
        setViewBox({
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          w: from.w + (to.w - from.w) * e,
          h: from.h + (to.h - from.h) * e,
        });
        if (t < 1) requestAnimationFrame(step);
        else resolve(true);
      };
      requestAnimationFrame(step);
    })
  ), []);

  const sleepPreview = useCallback((ms, run) => (
    new Promise((resolve) => {
      previewTimerRef.current = setTimeout(() => {
        previewTimerRef.current = null;
        resolve(!run.cancelled);
      }, ms);
    })
  ), []);

  const runPreviewFrom = useCallback(async (startIdx, startVB) => {
    if (cities.length === 0) return;
    const run = { cancelled: false };
    previewRunRef.current = run;

    let idx = startIdx;
    let currentVB = startVB;
    setPreviewIdx(idx);

    while (!run.cancelled) {
      const city = cities[idx];
      const w = SVG_WIDTH / zoomLevels.out;
      const outVB = clampViewBox({
        x: city.x - w / 2,
        y: city.y - (w * SVG_HEIGHT / SVG_WIDTH) / 2,
        w,
        h: w * SVG_HEIGHT / SVG_WIDTH,
      });
      const iw = SVG_WIDTH / zoomLevels.in;
      const inVB = clampViewBox({
        x: city.x - iw / 2,
        y: city.y - (iw * SVG_HEIGHT / SVG_WIDTH) / 2,
        w: iw,
        h: iw * SVG_HEIGHT / SVG_WIDTH,
      });

      if (!(await tweenViewBox(currentVB, outVB, PREVIEW_PAN_MS, run))) return;
      if (!(await tweenViewBox(outVB, inVB, PREVIEW_ZOOM_IN_MS, run))) return;
      currentVB = inVB;
      if (!(await sleepPreview(PREVIEW_DWELL_MS, run))) return;

      idx = (idx + 1) % cities.length;
      if (!run.cancelled) setPreviewIdx(idx);
    }
  }, [cities, zoomLevels, tweenViewBox, sleepPreview]);

  const startPreview = useCallback(() => {
    if (cities.length === 0) return;
    stopPreview();
    runPreviewFrom(0, viewBox);
  }, [cities.length, stopPreview, runPreviewFrom, viewBox]);

  const jumpToCity = useCallback((idx) => {
    const wasPlaying = previewRunRef.current && !previewRunRef.current.cancelled;
    stopPreview();
    if (wasPlaying) {
      runPreviewFrom(idx, viewBox);
    } else {
      centerOn(cities[idx]);
    }
  }, [cities, stopPreview, runPreviewFrom, viewBox]);

  useEffect(() => () => {
    if (previewRunRef.current) previewRunRef.current.cancelled = true;
    if (previewTimerRef.current) clearTimeout(previewTimerRef.current);
  }, []);

  // Editor is a one-way street: it only emits JSON to the user's clipboard
  // or a file download. Nothing touches the server or the repo. Whoever
  // reaches the editor can tinker with their own local state, copy JSON,
  // and walk away — the deployed site is never modified.
  const exportJson = useMemo(() => () => {
    const pairs = cities.map((c, i) => ({
      id: i + 1,
      name: c.name,
      out: { x: c.x, y: c.y, zoom: zoomLevels.out },
      in: { x: c.x, y: c.y, zoom: zoomLevels.in },
    }));
    return JSON.stringify(
      { cities, zoomLevels, locationPairs: pairs },
      null,
      2
    );
  }, [cities, zoomLevels]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportJson());
      setToast({ kind: 'ok', text: 'JSON copied to clipboard' });
    } catch {
      setToast({ kind: 'err', text: 'Clipboard write failed' });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportJson()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `worldmap-cities-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setToast({ kind: 'ok', text: 'JSON downloaded' });
  };

  const handleImport = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      const parsed = JSON.parse(txt);
      const nextCities = Array.isArray(parsed)
        ? parsed
        : Array.isArray(parsed?.cities)
          ? parsed.cities
          : null;
      if (!nextCities) {
        setToast({ kind: 'err', text: 'Clipboard has no cities array' });
        return;
      }
      setCities(nextCities);
      if (parsed?.zoomLevels) setZoomLevels(parsed.zoomLevels);
      setToast({ kind: 'ok', text: `Imported ${nextCities.length} cities` });
    } catch {
      setToast({ kind: 'err', text: 'Import failed — clipboard is not valid JSON' });
    }
  };

  const playing = previewIdx !== null;

  return (
    <div className="absolute inset-0 bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      <Toolbar
        cityCount={cities.length}
        zoomLevels={zoomLevels}
        setZoomLevels={setZoomLevels}
        onFit={() => setViewBox(fullViewBox())}
        onCopy={handleCopy}
        onDownload={handleDownload}
        onImport={handleImport}
        onPlay={startPreview}
        onStop={stopPreview}
        playing={playing}
        disablePlay={cities.length === 0}
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          cities={cities}
          selectedId={selectedId}
          previewIdx={previewIdx}
          onSelect={centerOn}
          onRename={renameCity}
          onLat={setCityLat}
          onLon={setCityLon}
          onRemove={removeCity}
        />

        <div className="relative flex-1 min-w-0" style={{ background: MAP_GRADIENT }}>
          <svg
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full cursor-crosshair select-none"
            style={{ touchAction: 'none' }}
            onMouseDown={(e) => { if (e.button === 0) beginPan(e); }}
          >
            <foreignObject x={0} y={0} width={SVG_WIDTH} height={SVG_HEIGHT} style={{ pointerEvents: 'none' }}>
              <img
                src={WORLDMAP_URL}
                alt=""
                width={SVG_WIDTH}
                height={SVG_HEIGHT}
                draggable={false}
                style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none', userSelect: 'none' }}
              />
            </foreignObject>

            {cities.map((c, i) => {
              const isSelected = c.id === selectedId;
              const isPlaying = i === previewIdx;
              // Scale markers with zoom so a dot stays ~constant screen size
              // instead of covering half of Europe when zoomed in.
              const r = Math.max(1.2, 9 * viewBox.w / SVG_WIDTH);
              return (
                <g key={c.id} style={{ cursor: 'grab' }}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={r}
                    fill={isPlaying ? '#f59e0b' : isSelected ? '#facc15' : '#0c4a6e'}
                    stroke="#ffffff"
                    strokeWidth={r * 0.35}
                    onMouseDown={(e) => beginCityDrag(e, c)}
                  />
                  <text
                    x={c.x + r * 1.4}
                    y={c.y + r * 0.45}
                    fill={isPlaying || isSelected ? '#7c2d12' : '#0f172a'}
                    fontSize={Math.max(8, r * 2)}
                    fontFamily="system-ui, sans-serif"
                    fontWeight={700}
                    style={{ pointerEvents: 'none', paintOrder: 'stroke' }}
                    stroke="#ffffff"
                    strokeWidth={r * 0.5}
                    strokeLinejoin="round"
                  >
                    {c.name}
                  </text>
                </g>
              );
            })}
          </svg>

          {cities.length > 0 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/35 backdrop-blur-sm rounded-full px-3 py-2">
              {cities.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => jumpToCity(i)}
                  className={`rounded-full transition-all ${
                    i === previewIdx
                      ? 'w-3 h-3 bg-amber-300 ring-2 ring-amber-100'
                      : 'w-2 h-2 bg-white/70 hover:bg-white'
                  }`}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>
          )}

          <ReadoutPanel cursor={cursorSvg} viewBox={viewBox} />

          {toast && (
            <div
              className={`absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-lg text-sm shadow-lg ${
                toast.kind === 'ok' ? 'bg-green-600' : 'bg-red-600'
              }`}
            >
              {toast.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toolbar({
  cityCount,
  zoomLevels,
  setZoomLevels,
  onFit,
  onCopy,
  onDownload,
  onImport,
  onPlay,
  onStop,
  playing,
  disablePlay,
}) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-2 bg-gray-900 border-b border-gray-800 text-sm">
      <div className="flex items-center gap-2 shrink-0">
        <Crosshair size={18} className="text-sky-400" />
        <span className="font-semibold">World Map Editor</span>
        <span className="text-gray-400">— {cityCount} {cityCount === 1 ? 'city' : 'cities'}</span>
      </div>

      {/* Play / Stop anchored next to the title so the primary action
          never gets pushed off-screen on narrow layouts. */}
      {playing ? (
        <button onClick={onStop} className="flex items-center gap-1 px-3 py-1 bg-amber-600 hover:bg-amber-500 rounded shrink-0">
          <Square size={16} /> Stop
        </button>
      ) : (
        <button
          onClick={onPlay}
          disabled={disablePlay}
          className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 rounded disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          <Play size={16} /> Play
        </button>
      )}

      <div className="ml-auto flex flex-wrap items-center gap-x-3 gap-y-2">
        <label className="flex items-center gap-2 text-gray-300 shrink-0">
          zoom out
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={zoomLevels.out}
            onChange={(e) => setZoomLevels({ ...zoomLevels, out: Number(e.target.value) })}
            className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded"
          />
        </label>
        <label className="flex items-center gap-2 text-gray-300 shrink-0">
          zoom in
          <input
            type="number"
            step="0.1"
            min="0.1"
            value={zoomLevels.in}
            onChange={(e) => setZoomLevels({ ...zoomLevels, in: Number(e.target.value) })}
            className="w-16 px-2 py-1 bg-gray-800 border border-gray-700 rounded"
          />
        </label>
        <button onClick={onFit} className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded shrink-0">
          <Target size={16} /> Fit
        </button>
        <button onClick={onImport} className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded shrink-0">
          <Upload size={16} /> Import
        </button>
        <button onClick={onCopy} className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded shrink-0">
          <Copy size={16} /> Copy
        </button>
        <button onClick={onDownload} className="flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-500 rounded shrink-0">
          <Download size={16} /> Download
        </button>
      </div>
    </div>
  );
}

function Sidebar({ cities, selectedId, previewIdx, onSelect, onRename, onLat, onLon, onRemove }) {
  return (
    <aside className="w-80 bg-gray-950 border-r border-gray-800 flex flex-col min-h-0">
      <div className="px-4 py-3 border-b border-gray-800 flex items-center gap-2 text-sm">
        <Plus size={16} className="text-sky-400" />
        <span className="text-gray-300">Click the map to place a city.</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        {cities.length === 0 && (
          <div className="p-4 text-sm text-gray-500">No cities yet.</div>
        )}
        {cities.map((city, i) => {
          const isSelected = city.id === selectedId;
          const isPlaying = i === previewIdx;
          return (
            <div
              key={city.id}
              className={`px-3 py-2 border-b border-gray-800 text-sm ${
                isPlaying ? 'bg-amber-500/10 border-l-2 border-l-amber-400' : isSelected ? 'bg-gray-900' : 'hover:bg-gray-900/60'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => onSelect(city)}
                  className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-sky-400"
                  title="Center on map"
                >
                  <Move3D size={14} />
                </button>
                <input
                  value={city.name}
                  onChange={(e) => onRename(city.id, e.target.value)}
                  className="flex-1 bg-transparent focus:bg-gray-900 border border-transparent focus:border-gray-700 px-2 py-1 rounded"
                />
                <button
                  onClick={() => onRemove(city.id)}
                  className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-red-400"
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                <div>
                  <div className="text-gray-500">SVG x, y</div>
                  <div className="font-mono text-gray-300">{city.x.toFixed(1)}, {city.y.toFixed(1)}</div>
                </div>
                <div className="flex gap-1">
                  <label className="flex-1">
                    <div className="text-gray-500">lat</div>
                    <input
                      type="number"
                      step="0.0001"
                      value={city.lat ?? ''}
                      onChange={(e) => onLat(city.id, e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-1 py-0.5 font-mono text-gray-200"
                      placeholder="—"
                    />
                  </label>
                  <label className="flex-1">
                    <div className="text-gray-500">lon</div>
                    <input
                      type="number"
                      step="0.0001"
                      value={city.lon ?? ''}
                      onChange={(e) => onLon(city.id, e.target.value)}
                      className="w-full bg-gray-900 border border-gray-800 rounded px-1 py-0.5 font-mono text-gray-200"
                      placeholder="—"
                    />
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

function ReadoutPanel({ cursor, viewBox }) {
  return (
    <div className="absolute bottom-2 right-2 bg-gray-900/90 border border-gray-800 text-xs font-mono text-gray-300 rounded px-3 py-2 pointer-events-none">
      <div>
        cursor: {cursor ? `${cursor.x.toFixed(1)}, ${cursor.y.toFixed(1)}` : '—'}
      </div>
      <div className="text-gray-500">
        view: {viewBox.x.toFixed(0)}, {viewBox.y.toFixed(0)} · {viewBox.w.toFixed(0)} × {viewBox.h.toFixed(0)}
      </div>
    </div>
  );
}
