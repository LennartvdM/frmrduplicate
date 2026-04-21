import React, { useEffect, useRef } from 'react';
import { renderMapInto } from '../../../frmr-map/bootstrap.mjs';

/**
 * Slide 4 mounts the original frmrduplicate MapComponent.
 *
 * The Framer chunks in src/frmr-map/ are patched to externalize React
 * and ReactDOM — their internal `x` and `un` vars redirect to npm copies
 * imported via Vite's build graph. One React instance, one fiber tree;
 * the SDK shares context with the host app while the compiled Panzoom
 * and variant state machine stay bit-for-bit identical to /frmrduplicate/.
 */
export default function WorldMapSection() {
  const mountRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return undefined;
    cleanupRef.current = renderMapInto(mountRef.current);
    return () => {
      if (cleanupRef.current) {
        cleanupRef.current();
        cleanupRef.current = null;
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="w-full h-full"
      style={{
        background:
          'linear-gradient(180deg, rgb(211, 227, 227) 0%, rgb(82, 156, 156) 100%)',
      }}
    />
  );
}
