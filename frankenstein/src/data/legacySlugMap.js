// Map from the old `PascalDashCase` slugs used in publications.js
// (routes like /toolbox/Beyond-The-Procedure) to the new path-based
// slugs that mirror docs-content/ (e.g. level-1-fundamentals/1.-preproduction/1.1-beyond-the-procedure).
//
// Keep this in sync with data/toolboxPages.js until publications.js
// has been rewritten to emit the new slugs directly.
const legacySlugMap = {
  // Welcome
  'Welcome': '',
  'Who-Is-This-For': 'welcome/who-is-this-for',
  'Quick-Start': 'welcome/quick-start',
  'FAQs': 'welcome/quick-start/faqs',
  'Neoflix': 'welcome/neoflix',
  'Every-Clinical-Encounter': 'welcome/neoflix/make-every-clinical-encounter-a-learning-opportunity',
  'Success-Story': 'welcome/neoflix/streamlining-neonatal-care-a-success-story',
  'How-It-Works': 'welcome/neoflix/how-it-works',

  // Level 1: Fundamentals
  'Level-1-Fundamentals': 'level-1-fundamentals/level-1-fundamentals',
  'Preproduction': 'level-1-fundamentals/1.-preproduction',
  'Beyond-The-Procedure': 'level-1-fundamentals/1.-preproduction/1.1-beyond-the-procedure',
  'Use-Cases': 'level-1-fundamentals/1.-preproduction/1.2-use-cases',
  'History-Of-Video': 'level-1-fundamentals/1.-preproduction/1.3-history-of-videorecording-in-healthcare',
  'Unburdening-The-Process': 'level-1-fundamentals/1.-preproduction/1.4-unburdening-the-process',
  'Planning-Your-Initiative': 'level-1-fundamentals/2.-planning-your-initiative',
  'Pioneer-Team': 'level-1-fundamentals/2.-planning-your-initiative/2.1-pioneer-team',
  'Gaining-Team-Buy-In': 'level-1-fundamentals/2.-planning-your-initiative/2.2-gaining-team-buy-in',
  'Resources': 'level-1-fundamentals/2.-planning-your-initiative/2.3-tips-and-tricks',
  'Safe-Simple-Small': 'level-1-fundamentals/3.-safe-simple-and-small',
  'Safe': 'level-1-fundamentals/3.-safe-simple-and-small/3.1-safe',
  'Simple': 'level-1-fundamentals/3.-safe-simple-and-small/3.2-simple',
  'Small': 'level-1-fundamentals/3.-safe-simple-and-small/3.3-small',
  'Learning-From-Success-Stories': 'level-1-fundamentals/4.-learning-from-success-stories',
  'NICU-Philadelphia': 'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-philadelphia-pennsylvania-usa',
  'NICU-Vienna': 'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-vienna-austria',
  'NICU-Melbourne': 'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-melbourne-australia',
  'NICU-Leiden': 'level-1-fundamentals/4.-learning-from-success-stories/nicu-in-leiden-the-netherlands',
  'Share-Your-Experience': 'level-1-fundamentals/4.-learning-from-success-stories/4.1-share-your-experience',

  // Level 2: In Action
  'Level-2-In-Action': 'level-2-in-action/level-2-in-action',
  'Record': 'level-2-in-action/record',
  'Preparation-And-Consent': 'level-2-in-action/5.-preparation-and-consent',
  'Obtain-Consent': 'level-2-in-action/5.-preparation-and-consent/5.1-obtain-consent',
  'Case-Selection': 'level-2-in-action/5.-preparation-and-consent/5.2-case-selection',
  'Privacy-Considerations': 'level-2-in-action/5.-preparation-and-consent/5.3-privacy-considerations',
  'Recording-Equipment': 'level-2-in-action/6.-recording-equipment',
  'Fixed-Cameras': 'level-2-in-action/6.-recording-equipment/6.1-fixed-cameras',
  'Mobile-Cameras': 'level-2-in-action/6.-recording-equipment/6.2-mobile-cameras',
  'Wearable-Cameras': 'level-2-in-action/6.-recording-equipment/6.3-wearable-cameras',
  'Patient-Monitoring-Systems': 'level-2-in-action/6.-recording-equipment/6.4-patient-monitoring-systems',
  'Motion-Detecting-Cameras': 'level-2-in-action/6.-recording-equipment/6.5-motion-detecting-cameras',
  'Creating-Footage': 'level-2-in-action/7.-creating-footage',
  'Steady-Footage': 'level-2-in-action/7.-creating-footage/7.1-steady-footage',
  'Clear-Audio': 'level-2-in-action/7.-creating-footage/7.2-clear-audio',
  'Lighting': 'level-2-in-action/7.-creating-footage/7.3-lighting',
  'Recording-During-Intervention': 'level-2-in-action/8.-recording-during-the-intervention',
  'Positioning': 'level-2-in-action/8.-recording-during-the-intervention/8.1-positioning',
  'Settings': 'level-2-in-action/8.-recording-during-the-intervention/8.2-settings',
  'During-Recording': 'level-2-in-action/8.-recording-during-the-intervention/8.3-during-recording',
  'After-The-Intervention': 'level-2-in-action/9.-after-the-intervention',
  'File-Transfer-And-Backup': 'level-2-in-action/9.-after-the-intervention/9.1-file-transfer-and-backup',
  'Simple-Video-Editing': 'level-2-in-action/9.-after-the-intervention/9.2-simple-video-editing',
  'Metadata-And-Archiving': 'level-2-in-action/9.-after-the-intervention/9.3-metadata-and-archiving',
  'Reflect': 'level-2-in-action/reflect',
  'Previewing': 'level-2-in-action/10.-previewing',
  'Questions-During-Previewing': 'level-2-in-action/10.-previewing/10.1-questions-to-ask-during-previewing',
  'Lets-Neoflix': 'level-2-in-action/11.-lets-neoflix',
  'Getting-The-Most-Out': 'level-2-in-action/11.-lets-neoflix/11.1-getting-the-most-out-of-your-neoflix-session',
  'Safe-Learning-Environment': 'level-2-in-action/11.-lets-neoflix/11.2-a-safe-learning-environment',
  'Tasks-Of-The-Chair': 'level-2-in-action/11.-lets-neoflix/11.3-tasks-of-the-chair',
  'Unlocking-Insights': 'level-2-in-action/11.-lets-neoflix/11.4-unlocking-insights',
  'Refine': 'level-2-in-action/refine',
  'Improving-Care': 'level-2-in-action/12.-improving-care-through-the-neoflix-approach',
  'Neoflix-Approach': 'level-2-in-action/13.1-the-neoflix-approach',
  'Protocol-Or-Equipment-Adjustment': 'level-2-in-action/13.1-the-neoflix-approach/13.1-protocol-or-equipment-adjustment',
  'Input-For-Research': 'level-2-in-action/13.1-the-neoflix-approach/13.2-input-for-research',
  'Learning-From-Variety': 'level-2-in-action/13.1-the-neoflix-approach/13.3-learning-from-variety-or-best-practices',
  'Training-Programs': 'level-2-in-action/13.1-the-neoflix-approach/13.4-development-of-training-programs-or-educational-material',
  'Education-And-Training': 'level-2-in-action/14.-education-and-training',
  'Recordings-For-Research': 'level-2-in-action/15.-recordings-for-research',
  'Implementing-New-Practices': 'level-2-in-action/16.-tool-for-implementing-new-practices',

  // Level 3: Growth
  'Level-3-Growth': 'level-3-growth/level-3-growth',
  'Continuous-Improvement': 'level-3-growth/17.-continuous-improvement',
  'Expanding-Your-Video-Program': 'level-3-growth/18.-expanding-your-video-program',
  'Join-The-Network': 'level-3-growth/18.-expanding-your-video-program/18.1-revolutionize-reflection-in-medical-care-join-the-network',
};

// Accept lowercase lookups for case-insensitive resolveSlug()
const ci = {};
for (const [k, v] of Object.entries(legacySlugMap)) ci[k.toLowerCase()] = v;
Object.assign(legacySlugMap, ci);

export default legacySlugMap;
