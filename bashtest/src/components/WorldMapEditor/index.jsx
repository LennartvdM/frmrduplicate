import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Copy, Upload, Trash2, Crosshair, Move3D, Target } from 'lucide-react';
import { cities as seedCities, zoomLevels as seedZoomLevels } from './mapLocations';

/**
 * Click-to-place world-map editor.
 *
 * View controls (editor-only, never persisted):
 *   - Mouse wheel        → zoom the editor viewBox around the cursor.
 *   - Drag on empty map  → pan the editor viewBox.
 *   - "Fit" button       → reset to the full 1440×700 map.
 *
 * City operations (persisted to localStorage, exportable):
 *   - Click on empty map → place a new city at cursor position.
 *   - Drag a city        → nudge its position.
 *   - Click a city       → select it (sidebar scrolls to it).
 *   - Sidebar X / Delete → remove.
 *
 * Data shape captured per city: { id, name, x, y, lat, lon }. (x, y) are
 * in SVG viewBox units (1440×700). lat/lon are optional — filled only for
 * calibration anchors so a later pass can fit a lat/lon → SVG transform
 * and auto-place additional cities.
 *
 * Access gate: localhost OR `?editor=true`. The access-code fallback from
 * the previous drag-based editor is preserved.
 */

const SVG_WIDTH = 1440;
const SVG_HEIGHT = 700;
const MIN_VIEW_WIDTH = 40;
const MOVE_THRESHOLD_PX = 3;
const STORAGE_KEY = 'worldMapEditor.cities.v2';
const ZOOM_STORAGE_KEY = 'worldMapEditor.zoomLevels.v2';

const fullViewBox = () => ({ x: 0, y: 0, w: SVG_WIDTH, h: SVG_HEIGHT });

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
  const [gateOpen, setGateOpen] = useState(() => {
    if (typeof window === 'undefined') return false;
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const editor = new URLSearchParams(window.location.search).get('editor') === 'true';
    return isLocalhost || editor;
  });
  const [accessCode, setAccessCode] = useState('');

  const [cities, setCities] = useState(loadCities);
  const [viewBox, setViewBox] = useState(fullViewBox);
  const [cursorSvg, setCursorSvg] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [zoomLevels, setZoomLevels] = useState(loadZoom);
  const [toast, setToast] = useState(null);

  const svgRef = useRef(null);
  const panRef = useRef(null);
  const dragRef = useRef(null);

  useEffect(() => {
    if (!gateOpen) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }, [cities, gateOpen]);

  useEffect(() => {
    if (!gateOpen) return;
    localStorage.setItem(ZOOM_STORAGE_KEY, JSON.stringify(zoomLevels));
  }, [zoomLevels, gateOpen]);

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
    panRef.current = {
      startClient: { x: e.clientX, y: e.clientY },
      startVB: { ...viewBox },
      moved: false,
    };
  }, [viewBox]);

  const beginCityDrag = useCallback((e, city) => {
    e.stopPropagation();
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

  const exportCitiesSource = useMemo(() => () => {
    const citiesOut = JSON.stringify(cities, null, 2);
    const pairs = cities.map((c, i) => ({
      id: i + 1,
      name: c.name,
      out: { x: c.x, y: c.y, zoom: zoomLevels.out },
      in: { x: c.x, y: c.y, zoom: zoomLevels.in },
    }));
    const pairsOut = JSON.stringify(pairs, null, 2);
    return (
`// Paste into src/components/WorldMapEditor/mapLocations.js
export const cities = ${citiesOut};

export const zoomLevels = ${JSON.stringify(zoomLevels, null, 2)};

// Drop-in for src/components/sections/worldmap/WorldMapSection.jsx locationPairs:
export const locationPairs = ${pairsOut};
`
    );
  }, [cities, zoomLevels]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(exportCitiesSource());
      setToast({ kind: 'ok', text: 'Copied to clipboard' });
    } catch {
      setToast({ kind: 'err', text: 'Clipboard write failed' });
    }
  };

  const handleImport = async () => {
    try {
      const txt = await navigator.clipboard.readText();
      const match = txt.match(/export const cities\s*=\s*(\[[\s\S]*?\]);/);
      if (!match) {
        setToast({ kind: 'err', text: 'No cities array found in clipboard' });
        return;
      }
      const parsed = JSON.parse(match[1]);
      setCities(parsed);
      setToast({ kind: 'ok', text: `Imported ${parsed.length} cities` });
    } catch {
      setToast({ kind: 'err', text: 'Import failed — check clipboard format' });
    }
  };

  if (!gateOpen) {
    return (
      <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
        <div className="bg-white text-gray-900 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
          <h2 className="text-2xl font-bold mb-2">Map Editor Access</h2>
          <p className="mb-4 text-gray-600">Enter the access code to use the editor.</p>
          <input
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg mb-4"
            placeholder="Access code"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (accessCode === 'map2024') setGateOpen(true);
                else alert('Invalid access code');
              }
            }}
          />
          <div className="flex gap-2">
            <button
              onClick={() => (accessCode === 'map2024' ? setGateOpen(true) : alert('Invalid access code'))}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Enter
            </button>
            <button
              onClick={() => { window.location.href = '/'; }}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gray-900 text-gray-100 flex flex-col overflow-hidden">
      <Toolbar
        cityCount={cities.length}
        zoomLevels={zoomLevels}
        setZoomLevels={setZoomLevels}
        onFit={() => setViewBox(fullViewBox())}
        onCopy={handleCopy}
        onImport={handleImport}
      />

      <div className="flex-1 flex min-h-0">
        <Sidebar
          cities={cities}
          selectedId={selectedId}
          onSelect={centerOn}
          onRename={renameCity}
          onLat={setCityLat}
          onLon={setCityLon}
          onRemove={removeCity}
        />

        <div className="relative flex-1 bg-gray-800 min-w-0">
          <svg
            ref={svgRef}
            viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.w} ${viewBox.h}`}
            preserveAspectRatio="xMidYMid meet"
            className="absolute inset-0 w-full h-full cursor-crosshair select-none"
            style={{ touchAction: 'none' }}
            onMouseDown={(e) => { if (e.button === 0) beginPan(e); }}
          >
            <rect x={0} y={0} width={SVG_WIDTH} height={SVG_HEIGHT} fill="#0f172a" />
            <image
              href="/worldmap.svg"
              x={0}
              y={0}
              width={SVG_WIDTH}
              height={SVG_HEIGHT}
              preserveAspectRatio="xMidYMid meet"
              style={{ pointerEvents: 'none' }}
            />

            {cities.map((c) => {
              const isSelected = c.id === selectedId;
              const r = Math.max(3, 6 * (SVG_WIDTH / viewBox.w) ** 0.5);
              return (
                <g key={c.id} style={{ cursor: 'grab' }}>
                  <circle
                    cx={c.x}
                    cy={c.y}
                    r={r}
                    fill={isSelected ? '#facc15' : '#38bdf8'}
                    stroke="#0f172a"
                    strokeWidth={r * 0.25}
                    onMouseDown={(e) => beginCityDrag(e, c)}
                  />
                  <text
                    x={c.x + r * 1.2}
                    y={c.y + r * 0.4}
                    fill={isSelected ? '#facc15' : '#e5e7eb'}
                    fontSize={Math.max(9, r * 1.8)}
                    fontFamily="system-ui, sans-serif"
                    fontWeight={600}
                    style={{ pointerEvents: 'none', paintOrder: 'stroke' }}
                    stroke="#0f172a"
                    strokeWidth={r * 0.45}
                  >
                    {c.name}
                  </text>
                </g>
              );
            })}
          </svg>

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

function Toolbar({ cityCount, zoomLevels, setZoomLevels, onFit, onCopy, onImport }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 border-b border-gray-800 text-sm">
      <div className="flex items-center gap-2">
        <Crosshair size={18} className="text-sky-400" />
        <span className="font-semibold">World Map Editor</span>
        <span className="text-gray-400">— {cityCount} {cityCount === 1 ? 'city' : 'cities'}</span>
      </div>

      <div className="flex-1" />

      <label className="flex items-center gap-2 text-gray-300">
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
      <label className="flex items-center gap-2 text-gray-300">
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

      <button onClick={onFit} className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded">
        <Target size={16} /> Fit
      </button>
      <button onClick={onImport} className="flex items-center gap-1 px-3 py-1 bg-gray-800 hover:bg-gray-700 rounded">
        <Upload size={16} /> Import
      </button>
      <button onClick={onCopy} className="flex items-center gap-1 px-3 py-1 bg-sky-600 hover:bg-sky-500 rounded">
        <Copy size={16} /> Copy export
      </button>
    </div>
  );
}

function Sidebar({ cities, selectedId, onSelect, onRename, onLat, onLon, onRemove }) {
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
        {cities.map((city) => {
          const isSelected = city.id === selectedId;
          return (
            <div
              key={city.id}
              className={`px-3 py-2 border-b border-gray-800 text-sm ${
                isSelected ? 'bg-gray-900' : 'hover:bg-gray-900/60'
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
