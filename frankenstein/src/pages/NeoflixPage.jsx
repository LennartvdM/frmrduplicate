/**
 * /neoflix — mounts the compiled frmrduplicate neoflix page verbatim.
 * The chunk brings its own React, navbar, backdrop, sidebar and
 * content. See public/frmr-pages/ for the raw chunks.
 */
import React from 'react';
import FrmrPageMount from '../components/FrmrPageMount';

export default function NeoflixPage() {
  return (
    <FrmrPageMount
      chunkFile="r-i-lvusp0upuyen_-noede9lquwyi4ivhta2kytius.3x4mi74y.mjs"
      cssFile="neoflix.ssr.css"
    />
  );
}
