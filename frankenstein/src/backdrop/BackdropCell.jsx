import React, { useEffect, useRef, useState } from 'react';

/**
 * One backdrop cell — either a video deck or a camo fill.
 *
 * Deck-fade rule (rule 0): opacity of card idx = (idx >= topIdx ? 1 : 0).
 * Cards at-or-below topIdx stay opaque; cards above fade out. That means
 * the new top card is already opaque under the old top before the old top
 * fades — never a 50% crossfade valley. Bashtest's MedicalCarousel has
 * the same comment: "This is NOT a crossfade - it's a sequential card
 * removal system. DO NOT 'fix' this to crossfade."
 *
 * Load stagger (rule 1): only the idx-0 card gets its src on mount; the
 * rest wait 500ms (deckLoaded flag) so the page doesn't fire a parallel
 * fetch burst while the initial paint is happening.
 *
 * Decode budget (rule 2): only (current top) and (base idx 2) actively
 * play(). Everything between them stays paused — buffered but not
 * decoding. Cuts GPU decode ~66%.
 *
 * Section-wide freeze (rule 3): when `decodeState !== 'active'` every
 * video in this cell is paused. Nothing decodes when this cell isn't the
 * one the user is looking at.
 */
export default function BackdropCell({
  kind = 'video',          // 'video' | 'camo'
  deck = [],               // array of URLs, index 0 is the topmost card
  topIdx = 0,              // which card is currently the "top" of this cell
  decodeState = 'idle',    // 'idle' | 'active' — active = play rule-2 videos
  fadeDuration = 0.6,      // deck-fade opacity duration in seconds
  style,                   // positioning/transform from parent
}) {
  if (kind === 'camo') {
    return (
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#1c3424', ...style }}
        aria-hidden="true"
      />
    );
  }

  return (
    <VideoDeck
      deck={deck}
      topIdx={topIdx}
      decodeState={decodeState}
      fadeDuration={fadeDuration}
      style={style}
    />
  );
}

function VideoDeck({ deck, topIdx, decodeState, fadeDuration, style }) {
  const videoRefs = useRef([]);
  const [deckLoaded, setDeckLoaded] = useState(false);

  // Rule 1: hold lower-deck srcs for 500ms after mount. The top card
  // (idx 0) gets its src immediately; everything else waits.
  useEffect(() => {
    const t = setTimeout(() => setDeckLoaded(true), 500);
    return () => clearTimeout(t);
  }, []);

  // Rules 2 + 3: decide which videos actually decode.
  //   decodeState === 'active': play topIdx + base (last idx). Pause rest.
  //   decodeState !== 'active': pause everything in this cell.
  // The topIdx + base pair is the "2-decoder" budget — the active top is
  // what the user sees, the base is always-on so its final reveal (all
  // upper cards faded out) is instant and never lands on a black frame.
  useEffect(() => {
    const baseIdx = deck.length - 1;
    videoRefs.current.forEach((v, idx) => {
      if (!v) return;
      const shouldPlay =
        decodeState === 'active' && (idx === topIdx || idx === baseIdx);
      try {
        if (shouldPlay) {
          v.playbackRate = 0.5;
          if (v.paused) v.play().catch(() => {});
        } else if (!v.paused) {
          v.pause();
        }
      } catch {}
    });
  }, [deck, topIdx, decodeState, deckLoaded]);

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ backgroundColor: '#1c3424', ...style }}
    >
      {deck.map((src, idx) => {
        const isTop = idx === topIdx;
        const isBase = idx === deck.length - 1;
        const isVisible = idx >= topIdx; // rule 0: staircase
        // Top card always loads its src. Base always loads its src
        // (so the final reveal has something to show). Middle cards
        // wait for the 500ms deckLoaded grace.
        const srcGated = isTop || isBase || deckLoaded ? src : undefined;
        return (
          <video
            key={src}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            className="absolute inset-0 w-full h-full object-cover"
            src={srcGated}
            muted
            loop
            playsInline
            preload={isTop ? 'auto' : 'metadata'}
            tabIndex={-1}
            aria-hidden="true"
            draggable="false"
            onLoadedData={(e) => {
              try {
                e.target.playbackRate = 0.5;
              } catch {}
            }}
            style={{
              opacity: isVisible ? 1 : 0,
              transition: `opacity ${fadeDuration}s cubic-bezier(0.4,0,0.2,1)`,
              willChange: 'opacity',
              transform: 'scale(1.06)',
              // Lower idx (higher in deck) sits on top.
              zIndex: deck.length - idx,
            }}
          />
        );
      })}
      {/* Subtle vignette matches the old SharedVideoBackdrop. */}
      <div className="absolute inset-0 bg-slate-900/20" aria-hidden="true" />
    </div>
  );
}
