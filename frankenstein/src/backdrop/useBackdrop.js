import { useContext, useEffect } from 'react';
import { BackdropContext } from './context';

/**
 * Public API for publishing into the backdrop.
 *
 * Two shapes, matched to how callers actually produce their data:
 *
 *   useBackdropTarget(id, target) — declarative. Each render publishes
 *     the current target for this id; unmount clears it. Use for state-
 *     driven contributions (a medical section publishes its current
 *     carousel index; a blog page publishes its active scroll-spy
 *     section). Re-publishes only when the target's shape actually
 *     changes, so inline object literals don't thrash.
 *
 *   useBackdropPublisher() — imperative. Returns stable setter functions
 *     for callers that publish from a scroll listener or a rAF tick and
 *     must not re-render on every update. ScrollSnap uses this to push
 *     Home's scroll progress from its existing scroll handler without
 *     re-rendering itself on every frame.
 */

export function useBackdropTarget(id, target) {
  const { setTarget } = useContext(BackdropContext);
  // Break the target into primitive deps so callers can pass an inline
  // object literal on every render without re-firing the effect. Deck
  // arrays are stable references imported from decks.js, so reference
  // identity is the right comparison for the deck itself.
  const kind = target?.kind ?? null;
  const deck = target?.deck ?? null;
  const topIdx = target?.topIdx ?? null;
  useEffect(() => {
    if (kind === null) {
      setTarget(id, null);
    } else {
      setTarget(id, { kind, deck, topIdx });
    }
    return () => setTarget(id, null);
  }, [id, kind, deck, topIdx, setTarget]);
}

export function useBackdropPublisher() {
  return useContext(BackdropContext);
}
