import React from 'react';
import WorldMapEditor from '../../WorldMapEditor';

/**
 * Prototype — slide 4 is the click-to-place editor itself. Treating
 * the slide as the editor lets you add / tweak city coordinates on the
 * deployed site without bouncing to `/map-editor`. The editor is
 * absolutely positioned so it fills the ScrollSection's relative
 * container without leaking out of the scroll-snap.
 *
 * The animated runtime map (959-line WorldMapSection predecessor) is
 * preserved in git history and can be restored once the city set is
 * finalised.
 */
export default function WorldMapSection() {
  return <WorldMapEditor />;
}
