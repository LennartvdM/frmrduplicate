import React from 'react';
import IntroSection from '../components/sections/IntroSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div>
      {/* Hero / Intro — full viewport height */}
      <IntroSection />

      {/* Footer — from neoflixexporttest (unique to this version) */}
      <Footer />
    </div>
  );
};

export default Home;
