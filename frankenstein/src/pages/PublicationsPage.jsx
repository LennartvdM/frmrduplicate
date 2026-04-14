/**
 * /publications — mounts the compiled frmrduplicate Publications page
 * verbatim, wrapped in the same three context providers the real
 * /frmrduplicate site uses. See public/frmr-pages/bootstrap.mjs for
 * the machinery.
 */
import React from 'react';
import FrmrPageMount from '../components/FrmrPageMount';

export default function PublicationsPage() {
  return <FrmrPageMount routeId="aLuYbVoBY" cssFile="publications.ssr.css" />;
}
