import { useSyncExternalStore } from 'react';

/**
 * Viewport/layout mode, served from ONE module-level store.
 *
 * This hook used to register three window listeners, a debounce timer
 * and its own state per call site. It is called by ~10 components
 * directly and by useTransitionNavigate, which renders once per docs
 * sidebar row — on /toolbox that added up to ~150–180 live listeners
 * and as many independent setStates per resize. Now the window is
 * observed exactly once and every caller subscribes to the same
 * snapshot via useSyncExternalStore.
 *
 * Behavior notes, preserved from the old implementation:
 * - 150ms debounce on resize/orientation events.
 * - While <html> carries the `is-resizing` class (rotation in
 *   flight), the reported `mode` stays frozen at its pre-rotation
 *   value and `isRotating` is true; dimensions update only after the
 *   rotation settles. (The old per-instance version froze to the
 *   mode captured at mount — a stale closure; freezing to the current
 *   mode is what it always meant to do.)
 */

const DEBOUNCE_MS = 150;

const detectTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0 ||
    (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
  );
};

const detectLayoutMode = () => {
  if (typeof window === 'undefined') {
    return { mode: 'desktop', isPortrait: true, width: 1024, height: 768, isTouchDevice: false };
  }

  const width = window.visualViewport?.width ?? window.innerWidth;
  const height = window.visualViewport?.height ?? window.innerHeight;
  const isTouchDevice = detectTouchDevice();

  let isPortrait = height > width;
  if (window.matchMedia) {
    isPortrait = window.matchMedia('(orientation: portrait)').matches;
  }

  const isMobileSize = width < 600;
  const isTabletSize = width >= 600 && width <= 1400;
  const isMobileDevice = isTouchDevice && isMobileSize;
  const isTabletDevice = isTouchDevice && isTabletSize;

  let mode = 'desktop';
  if (isMobileDevice) {
    mode = 'mobile';
  } else if (isTabletDevice) {
    mode = isPortrait ? 'tablet-portrait' : 'tablet-landscape';
  }

  return { mode, isPortrait, width, height, isTouchDevice };
};

// The snapshot handed to every subscriber. Must be referentially stable
// between changes (useSyncExternalStore contract), so it is rebuilt
// only inside publish().
function buildSnapshot(layout, effectiveMode, isRotating) {
  return {
    mode: effectiveMode,
    isDesktop: effectiveMode === 'desktop',
    isMobile: effectiveMode === 'mobile',
    isTabletPortrait: effectiveMode === 'tablet-portrait',
    isTabletLandscape: effectiveMode === 'tablet-landscape',
    isTablet: effectiveMode.startsWith('tablet'),
    width: layout.width,
    height: layout.height,
    isPortrait: layout.isPortrait,
    isRotating,
    isTouchDevice: layout.isTouchDevice,
  };
}

let layout = detectLayoutMode();
let frozenMode = null;
let snapshot = buildSnapshot(layout, layout.mode, false);
const listeners = new Set();
let started = false;
let debounceTimer = null;

function publish(nextLayout, effectiveMode, isRotating) {
  layout = nextLayout;
  snapshot = buildSnapshot(nextLayout, effectiveMode, isRotating);
  for (const l of listeners) l();
}

function update() {
  const rotating =
    typeof document !== 'undefined' &&
    document.documentElement.classList.contains('is-resizing');

  if (rotating) {
    if (frozenMode == null) frozenMode = snapshot.mode;
    if (!snapshot.isRotating) publish(layout, frozenMode, true);
    // Rotation still in flight — check again shortly.
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(update, DEBOUNCE_MS);
    return;
  }

  frozenMode = null;
  const next = detectLayoutMode();
  publish(next, next.mode, false);
}

function debouncedUpdate() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(update, DEBOUNCE_MS);
}

function ensureStarted() {
  if (started || typeof window === 'undefined') return;
  started = true;
  window.addEventListener('resize', debouncedUpdate, { passive: true });
  window.addEventListener('orientationchange', debouncedUpdate, { passive: true });
  const mq = window.matchMedia?.('(orientation: portrait)');
  if (mq?.addEventListener) mq.addEventListener('change', debouncedUpdate);
  // Listeners stay for the lifetime of the page — the store is a
  // singleton, there is nothing to tear down.
}

function subscribe(listener) {
  ensureStarted();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return snapshot;
}

const SERVER_SNAPSHOT = buildSnapshot(
  { mode: 'desktop', isPortrait: true, width: 1024, height: 768, isTouchDevice: false },
  'desktop',
  false
);

function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function useTabletLayout() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useTabletLayout;
