/**
 * publicationRecords.js — the bibliographic facts about each paper.
 *
 * Separate from publicationsPage.js because the build scripts read this
 * too, and they run in plain Node: nothing here may import assetUrl,
 * touch import.meta.env, or use a Vite glob.
 *
 * This exists so machines can read the work without downloading it. The
 * papers themselves are 1.5–3.5MB of two-column PDF; a crawler spends
 * all of that to recover text that comes back out as "video-reﬂecti"
 * and "re- time", which is no basis for a citation. The same facts as
 * structured data cost a couple of KB and are unambiguous.
 *
 * DOIs were read out of the PDFs themselves. Author lists are the full
 * bylines, not the "et al." of the display citations, because a
 * citation tool needs every name.
 *
 * Keyed by section id in publicationsPage.js.
 */
export const publicationRecords = {
  narrative: {
    title:
      'Video recording emergency care and video-reflection to improve patient care; a narrative review and case-study of a Neonatal Intensive Care Unit',
    authors: [
      'Veerle Heesters',
      'Ruben Witlox',
      'Henriette A. van Zanten',
      'Sophie J. Jansen',
      'Remco Visser',
      'Veerle Heijstek',
      'Arjan B. te Pas',
    ],
    journal: 'Frontiers in Pediatrics',
    year: 2022,
    doi: '10.3389/fped.2022.931055',
    licence: 'CC BY',
  },
  providers: {
    title:
      'Using the providers’ perspective on video review of neonatal procedures to create a roadmap: a qualitative study',
    authors: [
      'Veerle Heesters',
      'Henriëtte A. van Zanten',
      'Maria C. den Boer',
      'Arjan B. te Pas',
      'Ruben S. G. M. Witlox',
    ],
    journal: 'Archives of Disease in Childhood — Fetal and Neonatal Edition',
    year: 2024,
    doi: '10.1136/archdischild-2023-326528',
    licence: null,
  },
  recordreflectrefine: {
    title:
      'Record, reflect and refine: using video review as an initiative to improve neonatal care',
    authors: [
      'Veerle Heesters',
      'Henriette A. van Zanten',
      'Veerle Heijstek',
      'Arjan B. te Pas',
      'Ruben S. G. M. Witlox',
    ],
    journal: 'Pediatric Research',
    year: 2024,
    doi: '10.1038/s41390-024-03083-w',
    licence: null,
  },
  practicalguidance: {
    title:
      'Quality improvement initiative: implementing and redefining video review of real-time neonatal procedures using action research',
    authors: [
      'Veerle Heesters',
      'Henriette A. van Zanten',
      'Linsey C. C. de Boer',
      'Remco Visser',
      'Veerle Heijstek',
      'Arjan B. te Pas',
      'Ruben S. G. M. Witlox',
    ],
    journal: 'BMJ Open Quality',
    year: 2024,
    doi: '10.1136/bmjoq-2023-002588',
    licence: 'CC BY-NC',
  },
  drivingresearch: {
    title:
      'The vocal cords are predominantly closed in preterm infants <30 weeks gestation during transition after birth; an observational study',
    authors: [
      'Veerle Heesters',
      'Janneke Dekker',
      'Timothy J. R. Panneflek',
      'Kristel L. A. M. Kuypers',
      'Stuart B. Hooper',
      'Remco Visser',
      'Arjan B. te Pas',
    ],
    journal: 'Resuscitation',
    year: 2024,
    doi: '10.1016/j.resuscitation.2023.110053',
    licence: 'CC BY',
  },
  internationalcollab: {
    title:
      'International Multicenter Video Review on Neonatal Procedures: Lessons Learned from a Collaborative Study',
    authors: [
      'Veerle Heesters',
      'Hannah Schwarz',
      'Henriette A. van Zanten',
      'Katharina Bibl',
      'Tobias Werther',
      'Katrin Klebermass-Schrehof',
      'Angelika Berger',
      'Sophie Jansen',
      'Arjan B. te Pas',
      'Ruben Witlox',
      'Michael Wagner',
    ],
    journal: 'Children',
    year: 2026,
    doi: '10.3390/children13060816',
    licence: 'CC BY',
  },
};

/** Ordered the way the page presents them. */
export const publicationOrder = [
  'narrative',
  'providers',
  'recordreflectrefine',
  'practicalguidance',
  'drivingresearch',
  'internationalcollab',
];

export function doiUrl(record) {
  return record?.doi ? `https://doi.org/${record.doi}` : null;
}

/** "Heesters V, Witlox R, van Zanten HA, et al." — display form. */
export function shortAuthors(record, max = 3) {
  const names = record?.authors || [];
  const initials = names.slice(0, max).map((name) => {
    const parts = name.split(' ').filter(Boolean);
    const surname = parts.pop();
    return `${surname} ${parts.map((p) => p[0]).join('')}`;
  });
  return names.length > max ? `${initials.join(', ')}, et al.` : initials.join(', ');
}
