/**
 * Neoflix Section Data
 * CMS-ready structure for the Neoflix page content
 */
import { assetUrl } from '../utils/assetUrl';

// Section definitions — content sourced from neoflixexporttest (source of truth)
export const sections = [
  {
    id: 'preface',
    title: 'Preface',
    content: `When I started my PhD trajectory on the Department of Neonatology, I learned about the complexities of caring for the tiniest and most vulnerable patients, the infants who are admitted to the NICU. Caring for prematurely born or severely ill infants is challenging. They often have multiple issues, requiring a multidisciplinary approach with various skilled professionals. The care can be emergent due to imminent deliveries and the critical condition of the patients.

The goal of every medical team is to provide optimal care for their patients. Therefore, medical teams strive to continuously learn and improve the quality of care they provide. However, in the context of medical procedures that are emergent, complex and time-sensitive, this can be challenging. Current methods for learning from these moments include debriefing. Nevertheless, recall bias and incomplete documentation limits the value of debriefing.

As a solution, providers can document intricate emergent procedures. By recording medical procedures and reflecting on them with colleagues in an interprofessional manner, a comprehensive view of the procedure emerges. We called this type of interprofessional video review, Neoflix. The approach used in Neoflix is simple but powerful and brings a new level of thoughtfulness to reflection. Video review, if implemented carefully, can rejuvenate routines, sharpen decision-making, and improve care as a whole.

What stood out for me was the remarkable dedication of medical and nursing staff to patient care and their openness to Neoflix. Their active participation and enthusiasm during video review were sources of inspiration. It felt like we were holding something incredibly positive and powerful. For the first time, healthcare providers had the opportunity to engage in in-depth discussions about acute procedures, leading to numerous learning and improvement points. Healthcare providers were empowered through Neoflix to then also address these areas for improvement.

We considered that other departments could adopt our Neoflix approach as well. In various fields in healthcare, precision is crucial, and Neoflix gives healthcare providers the opportunity to return to the fundamentals of good medicine: observation, reflection, and improvement. This guide was created as a tool to learn from daily practice, and to foster small, intelligent changes for better care. It consists of practical steps, real-life examples, and straightforward advice.

We encourage you to use Neoflix to take time, to pause and consider how each action and decision affects patients. This guide invites healthcare providers to join a movement back to the heart of healthcare, where each procedure is an opportunity to learn and provide compassionate and competent care.

Let's embark on this journey together, improving one step and one patient at a time. — Veerle`,
  },
  {
    id: 'narrative',
    title: 'Narrative Review',
    content: `Video recording emergency care and video-reflection to improve patient care; a narrative review and case-study of a neonatal intensive care unit.

This narrative review explores the growing body of evidence supporting the use of video recording and video-reflection in emergency and critical care settings. Drawing on published literature and a detailed case study from a neonatal intensive care unit (NICU), we examine how structured video review can enhance clinical performance, team communication, and patient safety.

The review highlights that video-based reflection enables healthcare teams to observe their own actions and interactions from a new perspective. Unlike traditional debriefing methods that rely on memory, video provides an objective record of events, capturing details that are often missed or misremembered in high-pressure situations.

Our case study from the NICU demonstrates the practical application of these principles, showing how a systematic approach to video recording and reflection was implemented, the challenges encountered, and the measurable improvements in care quality that resulted from this initiative.`,
  },
  {
    id: 'provider',
    title: "Provider's Perspective",
    content: `Using the providers' perspective on video review of neonatal procedures to create a roadmap: a qualitative study

This qualitative study captures the voices and experiences of healthcare providers who participated in video review of neonatal procedures. Through in-depth interviews and focus groups, we explored providers' attitudes, concerns, and suggestions regarding the implementation of video review in their clinical practice.

The findings reveal a complex landscape of emotions and perspectives. While many providers initially expressed apprehension about being recorded, the majority recognized the educational and quality improvement potential of video review after participating in the process.

Key themes emerged around the importance of creating a psychologically safe environment for review, the value of structured facilitation, and the need for clear protocols regarding consent, data storage, and confidentiality. Providers emphasized that the success of video review depends heavily on organizational culture and leadership support.

Based on these insights, we developed a practical roadmap for implementing video review programs that addresses the concerns and leverages the enthusiasm of clinical staff.`,
  },
  {
    id: 'reflect',
    title: 'Record, Reflect, Refine',
    content: `Record, reflect and refine: using video review as an initiative to improve neonatal care.

This study presents a comprehensive framework for using video review as a quality improvement tool in neonatal care. The Record, Reflect, and Refine approach provides a structured methodology that healthcare teams can follow to systematically analyze and improve their clinical practice.

The Record phase focuses on the practical aspects of capturing video footage during neonatal procedures, including equipment selection, positioning, and consent processes. The Reflect phase guides teams through structured review sessions, using evidence-based facilitation techniques to promote constructive discussion and learning.

The Refine phase translates insights from video review into concrete action plans for improving care. This includes protocol adjustments, targeted training interventions, and changes to equipment or workflow that address identified areas for improvement.

Our experience demonstrates that this iterative cycle of recording, reflecting, and refining leads to sustained improvements in both individual performance and team dynamics, ultimately benefiting patient outcomes.`,
  },
  {
    id: 'guidance',
    title: 'Practical Guidance',
    content: `Quality improvement initiative: implementing and re-defining video review of real-time neonatal procedures using action research

This paper describes a quality improvement initiative that used action research methodology to implement and continuously refine a video review program for neonatal procedures. Action research, with its cyclical process of planning, acting, observing, and reflecting, proved to be an ideal framework for developing a program that needed to be responsive to the complex and evolving needs of a clinical environment.

Over multiple cycles of implementation, we identified key factors that contribute to the success of video review programs. These include strong leadership engagement, dedicated time for review sessions, clear governance structures, and ongoing training for facilitators.

The action research approach allowed us to address challenges as they arose, adapting our methods based on feedback from participants and observations of the process. This iterative refinement resulted in a program that was well-integrated into the clinical workflow and valued by staff at all levels.

The practical guidance offered in this paper is intended to help other institutions navigate the complexities of setting up their own video review programs, learning from both our successes and our challenges.`,
  },
  {
    id: 'research',
    title: 'Driving Research',
    content: `The vocal cords are predominantly closed in preterm infants <30 weeks gestation during transition after birth; an observational study

This observational study demonstrates one of the most compelling applications of video recording in neonatal care: its use as a research tool to generate new clinical knowledge. By analyzing video recordings of preterm infants during the critical transition period after birth, we made an important discovery about vocal cord behavior.

Our findings showed that in preterm infants born before 30 weeks of gestation, the vocal cords are predominantly in a closed position during the transition after birth. This observation has significant implications for respiratory support strategies used during neonatal resuscitation.

This study illustrates how video recordings, originally captured for quality improvement purposes, can become valuable research datasets. The detailed visual information captured in these recordings allows researchers to observe phenomena that cannot be detected through other means, opening new avenues for understanding neonatal physiology and improving clinical interventions.

The success of this research highlights the dual benefit of video recording programs: improving current practice through reflection while simultaneously advancing medical knowledge through research.`,
  },
  {
    id: 'collab',
    title: 'International Collaboration',
    content: `We embarked on a pioneering multicenter video review initiative. By sharing and analyzing video recordings of neonatal procedures across two centers, we aimed to foster interprofessional collaboration and identify opportunities for improvement.

Multicenter video review sparked insightful discussions among healthcare providers from different institutions. The analysis revealed notable variations in procedural practices between the two centers, highlighting potential areas for standardization and optimization. The shared learning experience empowered healthcare providers to gain new perspectives on their own performance, leading to adaptations in local guidelines at both centers.

This study provides a roadmap for implementing multicenter video review initiatives in neonatology. By fostering collaboration, sharing best practices, and promoting continuous learning, we can collectively advance the quality of care for newborns.

We value your feedback and are eager to hear your thoughts! Whether you have suggestions for improvement or need assistance with our toolbox, we are here to help.

For any questions, feedback, or ideas, please feel free to contact:

**Dr. Veerle Heesters**
Former PhD Student, Department of Neonatology
Leiden University Medical Center, the Netherlands

**Email:** [info@neoflix.care](mailto:info@neoflix.care)

This toolbox was developed under the guidance of **Professor Arjan te Pas** and **Dr. Ruben Witlox**.`,
  },
];

// Video backdrop mapping
export const sectionToVideo = {
  preface: assetUrl('/videos/blurteam.mp4'),
  narrative: assetUrl('/videos/blururgency.mp4'),
  provider: assetUrl('/videos/blurteam.mp4'),
  reflect: assetUrl('/videos/blursskills.mp4'),
  guidance: assetUrl('/videos/blurperspectives.mp4'),
  research: assetUrl('/videos/blurfocus.mp4'),
  collab: assetUrl('/videos/blurcoordination.mp4'),
};

// Video deck sources (bottom to top order)
export const deckSources = [
  assetUrl('/videos/blurcoordination.mp4'),
  assetUrl('/videos/blurfocus.mp4'),
  assetUrl('/videos/blurperspectives.mp4'),
  assetUrl('/videos/blursskills.mp4'),
  assetUrl('/videos/blurteam.mp4'),
  assetUrl('/videos/blururgency.mp4'),
];

// Animation timing config
export const animationConfig = {
  sidebar: {
    // Calculated based on section count
    delay: 2.9, // ~last section finish - 0.8s
    duration: 1.1,
    stiffness: 120,
    damping: 30,
  },
  section: {
    initialDelay: 0.5,
    stagger: 0.3,
    duration: 1.8,
    firstSectionDelay: 0.5,
  },
};

// Page-level styling
export const pageStyle = {
  backgroundColor: '#483226',
  sidebarClassName: 'bg-[#112038]',
  sectionStyle: {
    background: 'linear-gradient(135deg, rgba(250,250,249,0.85), rgba(253,244,255,0.85))',
  },
};
