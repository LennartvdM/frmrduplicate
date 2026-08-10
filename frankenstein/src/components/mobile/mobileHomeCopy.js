/**
 * Homepage narrative copy.
 *
 * Lifted out of MobileHome.jsx so two consumers can share one source of truth:
 * the mobile homepage that renders it, and scripts/prerender.mjs, which needs
 * the same sentences to put real content in the prerendered "/" document. Left
 * inline, the homepage was the thinnest of all 78 prerendered pages — a
 * headline and a tagline, 33 words, while its actual argument lived only in
 * JavaScript that non-rendering crawlers never run.
 *
 * Each panel's `label` is the full sentence; `lines` is the same sentence split
 * for the staggered per-word reveal. Keep them in step.
 *
 * Plain data with one import, so Node can read this file directly.
 */
import { assetUrl } from '../../utils/assetUrl.js';

export const INTRO_BLUR_VIDEO = assetUrl('/videos/mobile/neoflix_intro_blur_montage.mp4');
export const INTRO_BLUR_POSTER = assetUrl('/videos/mobile/neoflix_intro_blur_montage_poster.png');

export const MOBILE_PANELS = [
  {
    id: 'intro',
    video: INTRO_BLUR_VIDEO,
    poster: INTRO_BLUR_POSTER,
    logo: assetUrl('/favicon.svg'),
    label: 'Neoflix helps teams record, reflect, and refine care.',
    intro: true,
    lines: [
      [{ text: 'Record.' }],
      [{ text: 'Reflect.', accent: true }],
      [{ text: 'Refine.' }],
    ],
  },
  {
    id: 'moment',
    video: INTRO_BLUR_VIDEO,
    poster: INTRO_BLUR_POSTER,
    label: 'In the moment, only the patient matters.',
    chapter: true,
    chapterHeader: {
      line1: 'In the moment,',
      line2prefix: '',
      line2highlight: 'only',
      line2suffix: ' the patient',
      line3: 'matters',
    },
    lines: [
      [{ text: 'In the moment,' }],
      [{ text: 'only', accent: true }, { text: ' the patient' }],
      [{ text: 'matters' }],
    ],
  },
  {
    id: 'urgency',
    video: assetUrl('/videos/mobile/urgency.mp4'),
    target: 'time-sensitive',
    label: 'Medical interventions demand precision and urgency.',
    lines: [
      [{ text: 'Medical interventions demand', delay: 0 }],
      [{ text: 'precision and urgency', accent: true, delay: 260 }, { text: '.', delay: 260 }],
    ],
  },
  {
    id: 'coordination',
    video: assetUrl('/videos/mobile/coordination.mp4'),
    target: 'like-a-dance',
    label: 'Which makes coordination within teams vital for success.',
    lines: [
      [{ text: 'Which makes ', delay: 0 }, { text: 'coordination', accent: true, delay: 180 }],
      [{ text: 'within teams vital for success.', delay: 360 }],
    ],
  },
  {
    id: 'tunnelvision',
    video: assetUrl('/videos/mobile/tunnelvision.mp4'),
    target: 'cost',
    label: 'Task-driven focus can lead to tunnel vision and misalignment.',
    lines: [
      [{ text: 'Task-driven focus', delay: 0 }, { text: ' can lead to', delay: 180 }],
      [{ text: 'tunnel vision', accent: true, delay: 360 }, { text: ' and misalignment.', delay: 360 }],
    ],
  },
  {
    id: 'next',
    video: INTRO_BLUR_VIDEO,
    poster: INTRO_BLUR_POSTER,
    label: 'Yet, reflection strengthens the next.',
    chapter: true,
    chapterHeader: {
      line1: 'Yet,',
      line1suffix: ' ',
      line2prefix: '',
      line2highlight: 'reflection',
      line2suffix: '',
      line3: 'strengthens',
      line4: 'the next',
    },
    lines: [
      [{ text: 'Yet, ' }, { text: 'reflection', accent: true }],
      [{ text: 'strengthens' }],
      [{ text: 'the next' }],
    ],
  },
  {
    id: 'reflection',
    video: assetUrl('/videos/mobile/reflection.mp4'),
    target: 'sharpening',
    label: 'Quiet reflection allows for sharpening skills.',
    lines: [
      [{ text: 'Quiet ', delay: 0 }, { text: 'reflection', accent: true, delay: 180 }, { text: ' allows for', delay: 180 }],
      [{ text: 'sharpening skills.', delay: 360 }],
    ],
  },
  {
    id: 'cohesion',
    video: assetUrl('/videos/mobile/cohesion.mp4'),
    target: 'team-dynamics',
    label: 'Further video debriefs foster cohesion amongst peers.',
    lines: [
      [{ text: 'Further video debriefs', delay: 0 }, { text: ' foster', delay: 180 }],
      [{ text: 'cohesion', accent: true, delay: 360 }, { text: ' amongst peers.', delay: 360 }],
    ],
  },
  {
    id: 'alignment',
    video: assetUrl('/videos/mobile/alignment.mp4'),
    target: 'perspectives',
    label: 'Shared understanding enhances decisiveness.',
    lines: [
      [{ text: 'Shared ', delay: 0 }, { text: 'understanding', accent: true, delay: 180 }],
      [{ text: 'enhances ', delay: 360 }, { text: 'decisiveness.', delay: 520 }],
    ],
  },
];
