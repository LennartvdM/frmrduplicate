/**
 * /neoflix — mounts the compiled frmrduplicate neoflix page verbatim,
 * wrapped in the same three context providers the real /frmrduplicate
 * site uses. See public/frmr-pages/bootstrap.mjs for the machinery.
 */
import React from 'react';
import FrmrPageMount from '../components/FrmrPageMount';

export default function NeoflixPage() {
  return <FrmrPageMount routeId="bzydBB85Y" cssFile="neoflix.ssr.css" />;
}
