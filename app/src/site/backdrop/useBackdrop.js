import { useContext, useEffect } from 'react';
import { BackdropContext } from './context';

/**
 * Public API for publishing into the backdrop.
 *
 * Two shapes, matched to how callers actually produce their data:
 *
 *   useBackdropTarget(id, target) — declarative. Each render publishes
 *     the current target for this id. Passing `target === null`
 *     actively clears it; unmount does NOT clear (see note below).
 *     Use for state-driven contributions (a medical section publishes
 *     its current carousel index; a blog page publishes its active
 *     scroll-spy section). Re-publishes only when the target's shape
 *     actually changes, so inline object literals don't thrash.
 *
 *   useBackdropPublisher() — imperative. Returns stable setter functions
 *     for callers that publish from a scroll listener or a rAF tick and
 *     must not re-render on every update. ScrollSnap uses this to push
 *     Home's scroll progress from its existing scroll handler without
 *     re-rendering itself on every frame.
 *
 * Why unmount doesn't clear: route transitions run two concurrent
 * trees through AnimatePresence — the exiting page and the entering
 * page are both mounted for the slide's duration. When both publish to
 * the same id ('blog' for /neoflix, /publications, /contact), the new
 * page's mount-effect fires once and the old page's unmount-cleanup
 * fires at slide end. If cleanup nulled, it would wipe the new page's
 * value, leaving the backdrop blank. Separately, the BackdropProvider
 * crossfades for 2s but the page unmounts at ~0.45s — the exiting
 * HomeBackdrop still renders for the remaining 1.55s and would lose
 * its medical targets mid-fade. Both are fixed by leaving stale values
 * alone; the next publisher overwrites on mount, and callers that want
 * to actively blank a cell pass `target === null` explicitly.
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
  }, [id, kind, deck, topIdx, setTarget]);
}

export function useBackdropPublisher() {
  return useContext(BackdropContext);
}
