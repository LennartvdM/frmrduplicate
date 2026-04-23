/**
 * Publications Page Data
 */
import { assetUrl } from '../utils/assetUrl';

// All 7 publication sections
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
    title: '1. Narrative Review',
    content: `**[Video recording emergency care and video-reflection to improve patient care; a narrative review and case-study of a neonatal intensive care unit.](https://www.frontiersin.org/articles/10.3389/fped.2022.931055/full)**

*Heesters V, Witlox R, van Zanten HA, et al. Front Pediatr. 2022;10:931055. Published 2022 Aug 4*

---

### Video: A Powerful Tool for Quality Improvement in Emergency Medicine

Video recordings offer a uniquely insightful and objective lens for evaluating and enhancing the quality of care within the fast-paced world of emergency medicine. This review explores the transformative applications of video in clinical settings, highlighting its potential to improve patient safety and outcomes.

**Key Applications of Video:**

- **Demystifying Care Delivery:** Video provides a granular view of how care unfolds in real-time. This detailed perspective allows for direct comparison with established guidelines, facilitating the identification of improvement areas and promoting adherence to best practices.
- **Evaluating the Intangibles:** Emergency medicine relies on both technical expertise and critical 'soft' skills. Video analysis offers an unparalleled way to assess teamwork, communication, and leadership – the often-overlooked elements that are essential to positive patient outcomes.
- **Empowering Caregivers Through Reflection:** Video-facilitated self-review fosters increased self-awareness in healthcare providers, sparking thoughtful reflection on their actions. Combining this with skills training leads to significant professional growth.
- **Driving Collaborative Improvement:** Collective analysis of video footage by staff members offers a multi-faceted understanding of processes and systems. These insights act as potent catalysts for continuous quality improvement initiatives across the team.

### Real-World Success: NICU Case Study

Our Neonatal Intensive Care Unit (NICU) has successfully integrated video review into neonatal stabilization procedures. The results have been positive, including enhanced skills, improved adherence to protocols, and a strengthened culture of feedback. We are now expanding our approach, focusing on multidisciplinary reflexivity sessions, incorporating eye-tracking technology, and adding audio for comprehensive evaluations. Our goal is to develop sustainable models for implementing insights gained from video analysis and to provide guidance for other departments.

### The Potential of Video-Driven Transformation

Video in emergency care is evolving rapidly, transitioning from a research tool to a powerful force for positive change. While optimal implementation practices continue to be refined, ongoing research underscores the undeniable value of video-reflection in driving improvements in patient care.`,
  },
  {
    id: 'providers',
    title: "2. Provider's Perspective",
    content: `**[Using the providers' perspective on video review of neonatal procedures to create a roadmap: a qualitative study](https://fn.bmj.com/content/early/2024/02/07/archdischild-2023-326528)**

*Heesters V, van Zanten HA, den Boer MC, Te Pas AB, Witlox RS. Arch Dis Child Fetal Neonatal Ed. Published online February 7, 2024.*

---

### Exploring the Power of Video in the NICU

Video review offers a unique lens for examining how we provide healthcare, especially in the dynamic environment of the neonatal intensive care unit (NICU). It has the potential to reveal opportunities for improvement, but its success depends on how healthcare providers embrace it and whether it's implemented thoughtfully.

We wanted to understand how healthcare providers responded to an expanded video review program within our tertiary level NICU. Our program started with a focus on neonatal stabilization, and we broadened it to include:

- **Wider Applications:** Incorporating delivery room procedures and other important NICU processes.
- **Enhanced Insights:** Adding audio recordings for a more complete view of interactions.
- **Fostering Teamwork:** Emphasizing multidisciplinary participation in review sessions.

### Our Study: Learning from Experience

We interviewed 28 diverse NICU providers to learn about their experiences with video review. Their honest feedback, analyzed carefully, revealed key factors that can contribute to successful implementation:

- **Empowering Reflection:** Providers appreciated how video review encouraged self-awareness and a desire to learn and grow.
- **Breaking Down Barriers:** Video review created a shared platform for professionals from different disciplines to understand each other better, strengthening teamwork and collaboration.
- **Trust and Safety Matter:** Emphasizing consent and creating a non-judgmental space were essential for making providers feel comfortable with the process.

### Sharing What We've Learned

Our study offers insights that can help other healthcare settings adopt video review effectively. We believe it's a powerful tool, and we're excited to share our experiences to support continuous improvement in patient care.`,
  },
  {
    id: 'recordreflectrefine',
    title: '3. Record, Reflect, Refine',
    content: `**[Record, reflect and refine: using video review as an initiative to improve neonatal care](https://www.nature.com/articles/s41390-024-03083-w)**

*Heesters V, van Zanten HA, Heijstek V, Te Pas AB, Witlox RSGM. Pediatr Res. Published online February 14, 2024.*

---

### Video Review: Where Insight Meets Innovation

In the world of neonatal care, every moment counts. Imagine having a tool that could give you an inside look at those critical procedures, dissecting not just what was done, but the how and the why behind the actions of your healthcare team. Video review offers this unique perspective, creating a powerful catalyst for continuous improvement and innovation.

We embarked on a study to explore how video review could elevate our approach to patient care in the neonatal setting. Our focus was on enhancing a broad range of procedures crucial for our smallest patients—from stabilization at birth to intricate intubations and sterile line insertions.

**How We Did It:**
- **Capturing Real-World Practice:** Over nine months, we video-recorded numerous neonatal procedures.
- **Collaborative Insights:** Biweekly review sessions brought together medical and nursing staff to analyze recordings, pinpointing areas where we could do even better.
- **Turning Knowledge into Action:** Guided by an action research approach, we translated our observations into targeted improvements.

### What We Discovered: The Potential of Video Review

- **Unveiling Improvement Pathways:** We identified an impressive 120 opportunities for improvement – spanning protocol refinements, equipment adjustments, knowledge sharing, and sparks for new research.
- **Learning from Expertise:** Remarkably, 70% of these potential improvements touched on clinical scenarios where strict guidelines are less clear-cut, highlighting the immense value of learning from each other's experiences.
- **Fostering a Culture of Collaboration:** Video review created a space for doctors and nurses to come together, building a shared commitment to continuous quality improvement.

### Implications for Healthcare

- **Video Review: A Tool for Continuous Growth:** Regular video review sessions offer a structured way to improve guideline adherence, spread best practices, and solidify the teamwork essential for exceptional care.
- **The Key to Meaningful Change:** Successful implementation requires a clear framework for turning video review insights into action. Our study offers a blueprint for similar initiatives across various healthcare settings.

Video review empowers healthcare providers to become drivers of positive change. It's about analyzing, learning, and collaborating to continuously enhance care.`,
  },
  {
    id: 'practicalguidance',
    title: '4. Practical Guidance',
    content: `**[Quality improvement initiative: implementing and re-defining video review of real-time neonatal procedures using action research](https://docs.google.com/viewerng/viewer?url=https://bmjopenquality.bmj.com/content/bmjqir/13/2/e002588.full.pdf)**

*Heesters V, van Zanten HA, Heijstek V, Te Pas AB, Witlox RSGM. Practical guidance (PDF).*

---

### The Challenge: Optimizing NICU Care Through Video Review

The Neonatal Intensive Care Unit (NICU) is a complex environment where even subtle changes in care can impact infant outcomes. Video review of real-time procedures offers a powerful tool for self-reflection and team learning. However, effectively implementing such a program requires a delicate balance between constructive feedback and a supportive learning culture.

### A Collaborative Approach to Video Review

To enhance our NICU's video review program, we embarked on a comprehensive initiative. Our goals were to expand the scope of recorded procedures, involve both medical and nursing staff, and foster a non-judgmental, collaborative learning environment. Through an action research approach, we continuously refined our process based on real-time feedback and observation.

**Key achievements:**
- **Engagement:** Conducted 18 well-attended sessions with active participation from medical and nursing staff.
- **Acceptance:** Fostered a culture of openness and trust, enabling providers to share perspectives freely.
- **Practical Guideline:** Developed a robust, actionable guideline through collaborative efforts.

### The Power of a Supportive Learning Culture

- **Beyond critique:** Prioritized a collaborative learning environment focused on improvement.
- **Team empowerment:** Encouraged input from all team members, valuing diverse perspectives.
- **Action-oriented feedback:** Facilitated the translation of observations into tangible improvements in patient care.

### A Model for High-Stakes Healthcare

Our refined guideline provides a blueprint for other healthcare organizations seeking to leverage video review. By emphasizing a safe and supportive learning environment, video review can become a catalyst for continuous quality improvement in the NICU and other emergency care settings.`,
  },
  {
    id: 'drivingresearch',
    title: '5. Driving Research',
    content: `**[The vocal cords are predominantly closed in preterm infants <30 weeks gestation during transition after birth; an observational study](https://www.sciencedirect.com/science/article/pii/S030095722300789X)**

*Heesters, V., Dekker, J., Panneflek, T. J., Kuypers, K. L., Hooper, S. B., Visser, R., & te Pas, A. B. (2024). Resuscitation, 194, 110053.*

---

This observational study was conducted to assess the feasibility of using ultrasound to visualize vocal cord movement in preterm infants during non-invasive respiratory support. Previous studies, using video analysis, pinpointed specific areas of neonatal stabilization where knowledge was lacking. These observations became the foundation for the research question: do the vocal cords obstruct non-invasive ventilation when an infant <30 weeks is apneic at birth?

### Key Findings

- Ultrasound visualization of the vocal cords was feasible in all 20 preterm infants studied.
- In breathing infants, the vocal cords closed between breaths and during breath holds, significantly impacting respiratory efficiency.
- In apneic infants receiving positive pressure ventilation, the vocal cords were closed for a substantial majority of the time.

### Implications

These findings highlight the potential importance of considering vocal cord function in the management of preterm infants. The closure of the vocal cords can impair the effectiveness of non-invasive respiratory support. Further research is needed to explore the clinical implications of these findings and to develop strategies to optimize respiratory support in preterm infants. These strategies, grounded in the video-supported research, can subsequently be evaluated using the same video review methodology. This creates a continuous cycle of refinement informed by both research and ongoing practice observation.`,
  },
  {
    id: 'internationalcollab',
    title: '6. International Collaboration',
    content: `*PENDING PUBLICATION*

---

### The Challenge

Video recording and review of medical procedures is a valuable tool for enhancing neonatal care. However, its potential for collaborative, multicenter learning has yet to be fully realized.

### Our Approach

We embarked on a pioneering multicenter video review initiative to address this gap. By sharing and analyzing video recordings of neonatal procedures across two centers, we aimed to foster interprofessional collaboration and identify opportunities for improvement.

### Key Findings

- **Rich Interprofessional Dialogue:** Multicenter video review sparked insightful discussions among healthcare providers from different institutions.
- **Identifying Procedural Variations:** The analysis revealed notable variations in procedural practices between the two centers, highlighting potential areas for standardization and optimization.
- **Enhancing Clinical Practice:** The shared learning experience empowered healthcare providers to gain new perspectives on their own performance, leading to adaptations in local guidelines at both centers.

### Impact and Future Directions

This study provides a roadmap for implementing multicenter video review initiatives in neonatology. By fostering collaboration, sharing best practices, and promoting continuous learning, we can collectively advance the quality of care for newborns.

This innovative approach holds the potential to revolutionize neonatal care by driving evidence-based practice, improving patient outcomes, and enhancing the overall quality of care.`,
  },
];

// Video backdrop mapping — same videos as neoflix page
export const sectionToVideo = {
  preface: assetUrl('/videos/blurteam.mp4'),
  narrative: assetUrl('/videos/blururgency.mp4'),
  providers: assetUrl('/videos/blurteam.mp4'),
  recordreflectrefine: assetUrl('/videos/blursskills.mp4'),
  practicalguidance: assetUrl('/videos/blurperspectives.mp4'),
  drivingresearch: assetUrl('/videos/blurfocus.mp4'),
  internationalcollab: assetUrl('/videos/blurcoordination.mp4'),
};

// Video deck sources for preloading
export const deckSources = [
  assetUrl('/videos/blurcoordination.mp4'),
  assetUrl('/videos/blurfocus.mp4'),
  assetUrl('/videos/blurperspectives.mp4'),
  assetUrl('/videos/blursskills.mp4'),
  assetUrl('/videos/blurteam.mp4'),
  assetUrl('/videos/blururgency.mp4'),
];

// Page styling — matches frmrduplicate's Publications design
export const pageStyle = {
  backgroundColor: '#00333b',
  sidebarClassName: 'bg-[#1c3664]',
  sectionStyle: {
    background: 'rgba(245,249,252,0.8)',
  },
};
