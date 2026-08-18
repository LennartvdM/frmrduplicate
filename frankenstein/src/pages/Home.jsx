import React, { lazy, Suspense } from 'react';
import useTabletLayout from '../hooks/useTabletLayout';

// The two experiences are separate chunks so a phone never downloads the
// desktop scroll-snap tree (and vice versa). useTabletLayout measures
// synchronously on first render, so the branch is stable and only one
// chunk is ever requested.
const DesktopHome = lazy(() => import('./DesktopHome'));
const MobileHome = lazy(() => import('../components/mobile/MobileHome'));

const Home = () => {
  const { width } = useTabletLayout();
  const useMobileHome = width > 0 && width < 600;

  // Same rule as the route-level fallback in App.jsx: while the tree's
  // chunk loads, paint what it will paint — the intro's light gradient
  // on desktop, the phone home's near-black ground on mobile — so the
  // backdrop's green cell-0 camo never flashes through the gap.
  return (
    <Suspense
      fallback={
        <div
          style={{
            width: '100%',
            minHeight: '100vh',
            background: useMobileHome
              ? '#07110f'
              : 'linear-gradient(to top, #FFFFFF, #F5F9FC)',
          }}
        />
      }
    >
      {useMobileHome ? <MobileHome /> : <DesktopHome />}
    </Suspense>
  );
};

export default Home;
