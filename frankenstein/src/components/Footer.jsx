import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-[#e7dfd7] bg-[#1c3424] text-white/70">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
        style={{ fontFamily: '"Inter", sans-serif' }}
      >
        <p className="text-white/70">
          Learn more about Neoflix through our{' '}
          <a href="/publications" className="text-[#48c1c4] underline underline-offset-2 hover:text-[#6dd4d4] transition-colors">
            Publications
          </a>
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-white/50">
          <span>
            Developed by{' '}
            <a
              href="mailto:lennartvandermolen@gmail.com"
              className="text-white/70 font-semibold hover:text-white transition-colors"
            >
              Lennart vd Molen
            </a>
          </span>
          <span>
            Supported by the{' '}
            <span className="text-white/70 font-semibold">KNAW Van Walree Fund</span>
          </span>
        </div>
      </div>

      <div className="text-center text-white/40 text-xs pb-4">
        &copy; 2024 Neoflix
      </div>
    </footer>
  );
}
