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

  return (
    <Suspense fallback={null}>
      {useMobileHome ? <MobileHome /> : <DesktopHome />}
    </Suspense>
  );
};

export default Home;
