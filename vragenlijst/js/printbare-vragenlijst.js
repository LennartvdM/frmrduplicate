/**
 * Printable blank survey renderer.
 *
 * Loaded as an ES module by tools/printbare-vragenlijst.html. Reads
 * SURVEY_STEPS / LIKERT_OPTIONS from /survey/survey-questions.js and
 * renders an A4-friendly static HTML document with ruled blanks.
 */

import { SURVEY_STEPS, LIKERT_OPTIONS } from '/survey/survey-questions.js';

const LIKERT_LABELS = LIKERT_OPTIONS.map(o => o.label);

function esc(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

function labelText(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

function renderInlineInput(field, kind) {
  const indentClass = field.indent ? ' p-indent' : '';
  const compactClass = field.compact ? ' p-field-compact' : '';
  const hint = field.hint ? `<span class="p-hint">${esc(field.hint)}</span>` : '';
  return `
    <div class="p-field p-field-inline${indentClass}${compactClass}">
      <div class="p-field-label">${labelText(field.label)}</div>
      <div class="p-field-input"><span class="p-blank p-blank-${kind}"></span></div>
      ${hint}
    </div>
  `;
}

function renderTextarea(label, minLines = 3) {
  return `
    <div class="p-field p-field-block">
      <div class="p-field-label">${esc(label)}</div>
      <div class="p-textarea-blank" data-lines="${minLines}">${'<span class="p-rule"></span>'.repeat(minLines)}</div>
    </div>
  `;
}

function renderCheckbox(field) {
  const indentClass = field.indent ? ' p-indent' : '';
  return `
    <div class="p-field p-checkbox${indentClass}">
      <span class="p-check-box"></span>
      <span class="p-check-label">${labelText(field.label)}</span>
    </div>
  `;
}

function renderRadioCards(field, opts = {}) {
  const breakClass = opts.forcePageBreak ? ' p-question-break' : '';
  let html = `<div class="p-question${breakClass}">`;
  if (field.label) {
    html += `<div class="p-question-label">${labelText(field.label)}</div>`;
  }
  html += '<div class="p-cards">';
  for (const opt of field.options) {
    html += `
      <div class="p-card">
        <span class="p-card-radio"></span>
        <div class="p-card-body">
          <div class="p-card-title">${esc(opt.label)}</div>
          ${opt.description ? `<div class="p-card-desc">${esc(opt.description)}</div>` : ''}
        </div>
      </div>
    `;
  }
  html += '</div>';

  if (field.conditional) {
    html += '<div class="p-conditional">';
    for (const sub of field.conditional.fields) {
      html += renderField(sub);
    }
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderRadioList(field) {
  let html = '<div class="p-question">';
  if (field.label) {
    html += `<div class="p-question-label">${labelText(field.label)}</div>`;
  }
  html += '<div class="p-radio-list">';
  for (const opt of field.options) {
    html += `
      <div class="p-radio-row">
        <span class="p-radio-dot"></span>
        <span class="p-radio-text">${esc(opt.label)}</span>
      </div>
    `;
  }
  html += '</div>';

  if (field.conditional) {
    html += '<div class="p-conditional">';
    for (const sub of field.conditional.fields) {
      html += renderField(sub);
    }
    html += '</div>';
  }

  html += '</div>';
  return html;
}

function renderFieldGroup(field) {
  let html = '<div class="p-question">';
  if (field.label) {
    html += `<div class="p-question-label">${labelText(field.label)}</div>`;
  }
  html += '<div class="p-conditional">';
  for (const sub of field.fields) {
    html += renderField(sub);
  }
  html += '</div></div>';
  return html;
}

function renderInfoBlock(field) {
  const raw = field.content || '';
  const paragraphs = raw.split('\n\n').map(p => {
    const lines = p.split('\n');
    if (lines.length > 1 && /^\d+\./.test(lines[0])) {
      return `<ol>${lines.map(l => `<li>${l.replace(/^\d+\.\s*/, '')}</li>`).join('')}</ol>`;
    }
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');
  return `<aside class="p-info">${paragraphs}</aside>`;
}

// Putting "Wijkt uw definitie af..." on a new page cleans up page 2.
const FORCE_BREAK_BEFORE_FIELDS = new Set(['definitie_afwijking']);

function renderField(field) {
  const forcePageBreak = field.name && FORCE_BREAK_BEFORE_FIELDS.has(field.name);
  switch (field.type) {
    case 'text':        return renderInlineInput(field, 'text');
    case 'number':      return renderInlineInput(field, 'number');
    case 'date':        return renderInlineInput(field, 'date');
    case 'textarea':    return renderTextarea(labelText(field.label), 3);
    case 'checkbox':    return renderCheckbox(field);
    case 'radio-cards': return renderRadioCards(field, { forcePageBreak });
    case 'radio':       return renderRadioList(field);
    case 'info-block':  return renderInfoBlock(field);
    case 'group':       return renderFieldGroup(field);
    default: return '';
  }
}

function renderFields(fields) {
  let html = '';
  let openGroup = null;
  for (const field of fields) {
    if (field.group !== openGroup) {
      if (openGroup) html += '</div>';
      if (field.group) html += `<div class="p-group" data-group="${esc(field.group)}">`;
      openGroup = field.group || null;
    }
    html += renderField(field);
  }
  if (openGroup) html += '</div>';
  return html;
}

function renderLikert(likert) {
  let html = '<table class="p-likert">';
  html += '<thead><tr><th class="p-likert-head-q">Stelling</th>';
  for (const label of LIKERT_LABELS) {
    html += `<th class="p-likert-head-opt">${esc(label)}</th>`;
  }
  html += '</tr></thead><tbody>';
  for (let i = 0; i < likert.questions.length; i++) {
    html += '<tr>';
    html += `<td class="p-likert-q"><span class="p-likert-num">${i + 1}</span> ${esc(likert.questions[i])}</td>`;
    for (const _opt of LIKERT_OPTIONS) {
      html += `<td class="p-likert-opt"><span class="p-likert-cell"></span></td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table>';
  return html;
}

// Step 4 is the "Kwalitatief" (section 3) intro — force onto its own page.
const FORCE_BREAK_BEFORE_STEPS = new Set([4]);

function renderStep(step) {
  const breakClass = FORCE_BREAK_BEFORE_STEPS.has(step.id) ? ' p-section-break' : '';

  if (step.type === 'welcome') {
    // Skip the org-name field: printable form is devoid of personal info.
    return `
      <section class="p-section p-section-welcome${breakClass}">
        <div class="p-section-header">
          <span class="p-section-kicker">Start</span>
          <h2 class="p-section-title">${esc(step.title)}</h2>
        </div>
        <p class="p-lede">${esc(step.content?.intro || '')}</p>
      </section>
    `;
  }

  if (step.type === 'intro') {
    return `
      <section class="p-section p-section-intro-step${breakClass}">
        <div class="p-section-header">
          ${step.sectionNum ? `<span class="p-section-num">${esc(step.sectionNum)}</span>` : ''}
          <h2 class="p-section-title">${esc(step.title.replace(/\s*\(intro\)\s*/i, ''))}</h2>
        </div>
        ${step.content?.text ? `<p class="p-lede">${esc(step.content.text)}</p>` : ''}
      </section>
    `;
  }

  let html = `<section class="p-section${breakClass}">`;
  html += `
    <div class="p-section-header">
      ${step.sectionNum ? `<span class="p-section-num">${esc(step.sectionNum)}</span>` : ''}
      <h2 class="p-section-title">${esc(step.title)}</h2>
    </div>
  `;
  if (step.subtitle) html += `<p class="p-section-sub">${esc(step.subtitle)}</p>`;
  if (step.introText) html += `<p class="p-section-intro">${esc(step.introText)}</p>`;
  if (step.likert) html += renderLikert(step.likert);
  if (step.fields) html += renderFields(step.fields);
  if (step.toelichting) html += renderTextarea('Toelichting (optioneel)', 3);
  html += '</section>';
  return html;
}

function render() {
  let html = `
    <header class="p-header">
      <div class="p-header-eyebrow">Talent naar de Top &middot; Charter-monitoring</div>
      <h1 class="p-header-title">Monitoring Cultureel Talent naar de Top 2026</h1>
      <p class="p-header-lede">
        Printbare werkversie van de vragenlijst. Gebruik dit exemplaar om de vragen vooraf door te nemen of
        intern rond te sturen. De definitieve antwoorden vult u in via het online formulier.
      </p>
    </header>
  `;

  for (const step of SURVEY_STEPS) {
    if (step.id > 13) continue; // skip review / success
    html += renderStep(step);
  }

  html += `
    <footer class="p-footer">
      <div class="p-footer-mark">Monitoring Cultureel Talent naar de Top 2026</div>
      <div class="p-footer-note">Printbare werkversie &middot; definitieve antwoorden invullen via het online formulier</div>
    </footer>
  `;

  document.getElementById('printRoot').innerHTML = html;
}

render();

const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => window.print());
}

const closeBtn = document.getElementById('closeBtn');
if (closeBtn) {
  closeBtn.addEventListener('click', () => window.close());
}
