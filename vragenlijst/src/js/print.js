/**
 * Print / PDF generation module
 *
 * Generates a standalone, styled print document from the survey data. The
 * output is designed for paper/PDF — A4 portrait, brand-aligned typography
 * and colors, page breaks that keep questions together, and a layout that
 * stays intact when fields are empty.
 *
 * Empty fields render as labelled blank spaces so a printed copy can be
 * circulated internally and filled in by hand. Conditional branches are
 * shown whenever the parent is unanswered (blank-form mode) and otherwise
 * only when the trigger value matches (filled-form mode).
 */

import * as state from './state.js';
import { showErrorModal } from './modals.js';

import { SURVEY_STEPS, LIKERT_OPTIONS } from '../../survey/survey-questions.js';

const LIKERT_LABELS = LIKERT_OPTIONS.map(o => o.label);

// ─── Helpers ─────────────────────────────────────────────────────────

function collectFormValues() {
  const form = document.getElementById('monitoringForm');
  if (!form) return {};
  const data = {};
  new FormData(form).forEach((v, k) => { data[k] = v; });

  form.querySelectorAll('[contenteditable="true"]').forEach(el => {
    const hidden = el.parentElement?.querySelector('input[type="hidden"]');
    if (hidden && hidden.name) {
      data[hidden.name] = hidden.value || el.textContent;
    }
  });

  return data;
}

function esc(str) {
  if (str === null || str === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/** Strip inline HTML from a label but keep its text. */
function labelText(html) {
  if (!html) return '';
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || '';
}

/** True when a field has a non-empty user value. */
function hasValue(v) {
  return v !== undefined && v !== null && String(v).trim() !== '';
}

// ─── Document generator ──────────────────────────────────────────────

function generatePrintDocument(values, orgName, orgCode) {
  const now = new Date();
  const dateStr = now.toLocaleDateString('nl-NL', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  let html = '';

  // Header / title block (same layout regardless of fill state)
  html += `
    <header class="p-header">
      <div class="p-header-eyebrow">Talent naar de Top &middot; Charter-monitoring</div>
      <h1 class="p-header-title">Monitoring Cultureel Talent naar de Top 2026</h1>
      <div class="p-header-meta">
        <div class="p-meta-row">
          <span class="p-meta-label">Organisatie</span>
          <span class="p-meta-value${orgName ? '' : ' p-meta-blank'}">${orgName ? esc(orgName) : ''}</span>
        </div>
        <div class="p-meta-row">
          <span class="p-meta-label">Charter-code</span>
          <span class="p-meta-value${orgCode ? '' : ' p-meta-blank'}">${orgCode ? esc(orgCode) : ''}</span>
        </div>
        <div class="p-meta-row">
          <span class="p-meta-label">Afgedrukt op</span>
          <span class="p-meta-value">${dateStr}</span>
        </div>
      </div>
      <p class="p-header-note">
        Dit document is bedoeld om intern rond te sturen. Noteer aanvullingen in de lege
        ruimte en verwerk de definitieve antwoorden in het online formulier.
      </p>
    </header>
  `;

  // Steps
  for (const step of SURVEY_STEPS) {
    if (step.id > 13) continue; // skip review / success
    html += renderStep(step, values);
  }

  // Signature / footer block
  html += `
    <footer class="p-footer">
      <div class="p-footer-mark">Monitoring Cultureel Talent naar de Top 2026</div>
      <div class="p-footer-note">
        Werkversie voor interne afstemming &middot; definitieve antwoorden invullen via het online formulier
      </div>
    </footer>
  `;

  return wrapInPage(html);
}

// ─── Step renderer ───────────────────────────────────────────────────

function renderStep(step, values) {
  // Welcome step: single text field, render as a compact intro card.
  if (step.type === 'welcome') {
    return `
      <section class="p-section p-section-welcome">
        <div class="p-section-header">
          <span class="p-section-kicker">Start</span>
          <h2 class="p-section-title">${esc(step.title)}</h2>
        </div>
        <p class="p-lede">${esc(step.content?.intro || '')}</p>
        ${step.fields ? renderFields(step.fields, values) : ''}
      </section>
    `;
  }

  // Intro step (step 4): informational only.
  if (step.type === 'intro') {
    return `
      <section class="p-section p-section-intro">
        <div class="p-section-header">
          ${step.sectionNum ? `<span class="p-section-num">${esc(step.sectionNum)}</span>` : ''}
          <h2 class="p-section-title">${esc(step.title.replace(/\s*\(intro\)\s*/i, ''))}</h2>
        </div>
        ${step.content?.text ? `<p class="p-lede">${esc(step.content.text)}</p>` : ''}
      </section>
    `;
  }

  let html = '<section class="p-section">';

  // Section header
  html += `
    <div class="p-section-header">
      ${step.sectionNum ? `<span class="p-section-num">${esc(step.sectionNum)}</span>` : ''}
      <h2 class="p-section-title">${esc(step.title)}</h2>
    </div>
  `;
  if (step.subtitle) {
    html += `<p class="p-section-sub">${esc(step.subtitle)}</p>`;
  }
  if (step.introText) {
    html += `<p class="p-section-intro">${esc(step.introText)}</p>`;
  }

  // Likert step
  if (step.likert) {
    html += renderLikert(step.likert, values);
  }

  // Regular fields
  if (step.fields) {
    html += renderFields(step.fields, values);
  }

  // Toelichting (optional explanation textarea)
  if (step.toelichting) {
    html += renderTextarea('Toelichting (optioneel)', values[step.toelichting], 3);
  }

  html += '</section>';
  return html;
}

// ─── Field renderers ─────────────────────────────────────────────────

function renderFields(fields, values) {
  let html = '';
  let openGroup = null;

  for (const field of fields) {
    // Close/open field groups (e.g. werknemers / top / subtop)
    if (field.group !== openGroup) {
      if (openGroup) html += '</div>';
      if (field.group) html += `<div class="p-group" data-group="${esc(field.group)}">`;
      openGroup = field.group || null;
    }
    html += renderField(field, values);
  }
  if (openGroup) html += '</div>';
  return html;
}

function renderField(field, values) {
  const val = values[field.name];

  switch (field.type) {
    case 'text':
      return renderInlineInput(field, val, 'text');
    case 'number':
      return renderInlineInput(field, val, 'number');
    case 'date':
      return renderInlineInput(field, val, 'date');
    case 'textarea':
      return renderTextarea(labelText(field.label), val, 3);
    case 'checkbox':
      return renderCheckbox(field, val);
    case 'radio-cards':
      return renderRadioCards(field, values);
    case 'radio':
      return renderRadioList(field, values);
    case 'info-block':
      return renderInfoBlock(field);
    case 'group':
      return renderFieldGroup(field, values);
    default:
      return '';
  }
}

/** Short inline input (text / number / date). Empty values show a ruled blank. */
function renderInlineInput(field, val, kind) {
  const indentClass = field.indent ? ' p-indent' : '';
  const compactClass = field.compact ? ' p-field-compact' : '';
  const filled = hasValue(val);
  const hint = field.hint ? `<span class="p-hint">${esc(field.hint)}</span>` : '';
  const valueHtml = filled
    ? `<span class="p-value">${esc(val)}</span>`
    : `<span class="p-blank p-blank-${kind}"></span>`;

  return `
    <div class="p-field p-field-inline${indentClass}${compactClass}">
      <div class="p-field-label">${labelText(field.label)}</div>
      <div class="p-field-input">${valueHtml}</div>
      ${hint}
    </div>
  `;
}

/** Block textarea. Always reserves multiple ruled lines. */
function renderTextarea(label, val, minLines = 3) {
  const filled = hasValue(val);
  const body = filled
    ? `<div class="p-textarea-filled">${esc(val).replace(/\n/g, '<br>')}</div>`
    : `<div class="p-textarea-blank" data-lines="${minLines}">${'<span class="p-rule"></span>'.repeat(minLines)}</div>`;

  return `
    <div class="p-field p-field-block">
      <div class="p-field-label">${esc(label)}</div>
      ${body}
    </div>
  `;
}

/** Checkbox. Always rendered whether ticked or not. */
function renderCheckbox(field, val) {
  const indentClass = field.indent ? ' p-indent' : '';
  const checked = val === 'on' || val === true || val === 'true';
  const mark = checked ? '<span class="p-check-mark">&#10003;</span>' : '';
  return `
    <div class="p-field p-checkbox${indentClass}">
      <span class="p-check-box${checked ? ' p-check-box-on' : ''}">${mark}</span>
      <span class="p-check-label">${labelText(field.label)}</span>
    </div>
  `;
}

/** Radio-cards (rich, option cards with optional descriptions). */
function renderRadioCards(field, values) {
  const val = values[field.name];
  const filled = hasValue(val);
  let html = '<div class="p-question">';
  if (field.label) {
    html += `<div class="p-question-label">${labelText(field.label)}</div>`;
  }
  html += '<div class="p-cards">';

  for (const opt of field.options) {
    const selected = filled && val === opt.value;
    html += `
      <div class="p-card${selected ? ' p-card-selected' : ''}">
        <span class="p-card-radio${selected ? ' p-card-radio-on' : ''}"></span>
        <div class="p-card-body">
          <div class="p-card-title">${esc(opt.label)}</div>
          ${opt.description ? `<div class="p-card-desc">${esc(opt.description)}</div>` : ''}
        </div>
      </div>
    `;
  }
  html += '</div>';

  // Conditional sub-fields:
  //   - parent filled & trigger matches → show with values
  //   - parent empty                    → show as blank fill-space (working copy)
  //   - parent filled & trigger misses  → hide
  if (field.conditional) {
    const trig = field.conditional.trigger;
    const showConditional = !filled || val === trig;
    if (showConditional) {
      html += '<div class="p-conditional">';
      for (const sub of field.conditional.fields) {
        html += renderField(sub, values);
      }
      html += '</div>';
    }
  }

  html += '</div>';
  return html;
}

/** Simple radio list (stacked options). */
function renderRadioList(field, values) {
  const val = values[field.name];
  const filled = hasValue(val);
  let html = '<div class="p-question">';
  if (field.label) {
    html += `<div class="p-question-label">${labelText(field.label)}</div>`;
  }
  html += '<div class="p-radio-list">';

  for (const opt of field.options) {
    const selected = filled && (val === opt.value || (typeof val === 'string' && val.toLowerCase() === String(opt.value).toLowerCase()));
    html += `
      <div class="p-radio-row${selected ? ' p-radio-row-selected' : ''}">
        <span class="p-radio-dot${selected ? ' p-radio-dot-on' : ''}"></span>
        <span class="p-radio-text">${esc(opt.label)}</span>
      </div>
    `;
  }
  html += '</div>';

  if (field.conditional) {
    const trig = field.conditional.trigger;
    const matches = filled && (val === trig || (typeof val === 'string' && val.toLowerCase() === String(trig).toLowerCase()));
    if (!filled || matches) {
      html += '<div class="p-conditional">';
      for (const sub of field.conditional.fields) {
        html += renderField(sub, values);
      }
      html += '</div>';
    }
  }

  html += '</div>';
  return html;
}

/** Nested field group (e.g. multi-question group with its own label). */
function renderFieldGroup(field, values) {
  let html = '<div class="p-question">';
  if (field.label) {
    html += `<div class="p-question-label">${labelText(field.label)}</div>`;
  }
  html += '<div class="p-conditional">';
  for (const sub of field.fields) {
    html += renderField(sub, values);
  }
  html += '</div></div>';
  return html;
}

/** Info block with paragraphs and optional numbered list. */
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

// ─── Likert renderer ─────────────────────────────────────────────────

function renderLikert(likert, values) {
  let html = '<table class="p-likert">';
  html += '<thead><tr><th class="p-likert-head-q">Stelling</th>';
  for (const label of LIKERT_LABELS) {
    html += `<th class="p-likert-head-opt">${esc(label)}</th>`;
  }
  html += '</tr></thead><tbody>';

  for (let i = 0; i < likert.questions.length; i++) {
    const qName = `${likert.prefix}_${i + 1}`;
    const selected = values[qName];
    const answered = hasValue(selected);

    html += `<tr${answered ? ' class="p-likert-answered"' : ''}>`;
    html += `<td class="p-likert-q"><span class="p-likert-num">${i + 1}</span> ${esc(likert.questions[i])}</td>`;

    for (const opt of LIKERT_OPTIONS) {
      const isSelected = answered && String(selected) === String(opt.value);
      html += `<td class="p-likert-opt"><span class="p-likert-cell${isSelected ? ' p-likert-cell-on' : ''}"></span></td>`;
    }

    html += '</tr>';
  }

  html += '</tbody></table>';
  return html;
}

// ─── Page wrapper with embedded styles ───────────────────────────────

function wrapInPage(body) {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8">
<title>Monitoring Cultureel Talent naar de Top 2026</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
  :root {
    --navy: #111162;
    --navy-deep: #07072f;
    --blue: #8caef4;
    --blue-soft: #c5d6f8;
    --sand: #e1e9f4;
    --sand-light: #f1f4f8;
    --ink: #1d1d30;
    --ink-soft: #3c3c5d;
    --ink-mute: #6b6b85;
    --line: #d9dfeb;
    --line-soft: #ebeff6;
    --cream: #fafbfc;
  }

  @page {
    size: A4 portrait;
    margin: 18mm 18mm 20mm;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  html, body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    font-size: 10pt;
    line-height: 1.55;
    color: var(--ink);
    background: #fff;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  /* ── Header ── */
  .p-header {
    padding: 0 0 14pt;
    margin-bottom: 18pt;
    border-bottom: 1.2pt solid var(--navy);
    page-break-after: avoid;
    break-after: avoid;
  }
  .p-header-eyebrow {
    font-size: 8pt;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--navy);
    margin-bottom: 6pt;
  }
  .p-header-title {
    font-size: 18pt;
    font-weight: 700;
    line-height: 1.2;
    color: var(--navy-deep);
    margin-bottom: 12pt;
    letter-spacing: -0.01em;
  }
  .p-header-meta {
    display: table;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 10pt;
  }
  .p-meta-row {
    display: table-row;
  }
  .p-meta-label, .p-meta-value {
    display: table-cell;
    padding: 3pt 0;
    font-size: 9pt;
    vertical-align: baseline;
  }
  .p-meta-label {
    width: 30mm;
    color: var(--ink-mute);
    font-weight: 500;
  }
  .p-meta-value {
    color: var(--ink);
    font-weight: 600;
    border-bottom: 0.5pt dotted var(--line);
  }
  .p-meta-value.p-meta-blank {
    min-height: 12pt;
  }
  .p-meta-value.p-meta-blank::before {
    content: '\\00a0';
  }
  .p-header-note {
    margin-top: 12pt;
    padding: 8pt 12pt;
    background: var(--sand-light);
    border-left: 2pt solid var(--blue);
    font-size: 8.5pt;
    color: var(--ink-soft);
    line-height: 1.5;
    border-radius: 0 3pt 3pt 0;
  }

  /* ── Section ── */
  .p-section {
    margin-bottom: 16pt;
    page-break-inside: auto;
  }
  .p-section + .p-section {
    margin-top: 16pt;
  }
  .p-section-header {
    display: flex;
    align-items: baseline;
    gap: 10pt;
    margin-bottom: 4pt;
    padding-bottom: 4pt;
    border-bottom: 0.75pt solid var(--line);
    page-break-after: avoid;
    break-after: avoid;
  }
  .p-section-num, .p-section-kicker {
    display: inline-block;
    min-width: 18pt;
    padding: 2pt 6pt;
    background: var(--navy);
    color: #fff;
    font-size: 8.5pt;
    font-weight: 700;
    border-radius: 2pt;
    letter-spacing: 0.02em;
    text-align: center;
  }
  .p-section-kicker {
    background: var(--blue);
    color: var(--navy-deep);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 7.5pt;
  }
  .p-section-title {
    font-size: 13pt;
    font-weight: 700;
    color: var(--navy-deep);
    letter-spacing: -0.005em;
    line-height: 1.25;
  }
  .p-section-sub {
    font-size: 10pt;
    color: var(--ink-soft);
    margin: 6pt 0 10pt;
    font-weight: 500;
  }
  .p-section-intro {
    font-size: 9.5pt;
    color: var(--ink-soft);
    margin: 4pt 0 10pt;
    line-height: 1.55;
  }
  .p-lede {
    font-size: 10pt;
    color: var(--ink-soft);
    margin: 4pt 0 10pt;
    line-height: 1.6;
  }

  /* ── Fields ── */
  .p-field { margin-bottom: 8pt; page-break-inside: avoid; break-inside: avoid; }
  .p-field-inline {
    display: flex;
    align-items: baseline;
    gap: 10pt;
    flex-wrap: wrap;
  }
  .p-field-inline .p-field-label {
    flex: 0 0 auto;
    max-width: 60%;
  }
  .p-field-inline .p-field-input {
    flex: 1 1 50mm;
    min-width: 40mm;
  }
  .p-field-label {
    font-size: 9pt;
    font-weight: 600;
    color: var(--ink-soft);
    line-height: 1.4;
  }
  .p-field-block .p-field-label {
    margin-bottom: 4pt;
  }
  .p-indent {
    padding-left: 16pt;
  }
  .p-field-compact .p-field-input {
    flex: 0 0 30mm;
    min-width: 24mm;
  }
  .p-hint {
    flex: 1 1 100%;
    font-size: 8pt;
    color: var(--ink-mute);
    font-style: italic;
    line-height: 1.4;
  }

  /* Values & blanks */
  .p-value {
    display: inline-block;
    min-width: 100%;
    padding: 2pt 6pt;
    background: var(--sand-light);
    border-bottom: 1pt solid var(--navy);
    font-size: 10pt;
    font-weight: 500;
    color: var(--ink);
    word-break: break-word;
  }
  .p-blank {
    display: inline-block;
    width: 100%;
    min-height: 14pt;
    border-bottom: 0.75pt solid var(--line);
  }
  .p-blank-number { width: 30mm; }
  .p-blank-date { width: 40mm; }

  /* ── Textareas ── */
  .p-textarea-filled {
    padding: 8pt 10pt;
    background: var(--sand-light);
    border-left: 2pt solid var(--blue);
    border-radius: 0 3pt 3pt 0;
    font-size: 10pt;
    color: var(--ink);
    line-height: 1.55;
    white-space: pre-wrap;
  }
  .p-textarea-blank {
    padding: 6pt 0 2pt;
  }
  .p-textarea-blank .p-rule {
    display: block;
    border-bottom: 0.75pt solid var(--line);
    height: 16pt;
  }

  /* ── Checkboxes ── */
  .p-checkbox {
    display: flex;
    align-items: baseline;
    gap: 8pt;
    font-size: 9.5pt;
    color: var(--ink);
  }
  .p-check-box {
    flex: 0 0 auto;
    display: inline-block;
    width: 10pt;
    height: 10pt;
    border: 1pt solid var(--navy);
    border-radius: 2pt;
    background: #fff;
    position: relative;
    top: 1.5pt;
  }
  .p-check-box-on {
    background: var(--navy);
  }
  .p-check-mark {
    color: #fff;
    font-size: 8pt;
    line-height: 10pt;
    position: absolute;
    top: -1pt;
    left: 1pt;
    font-weight: 700;
  }
  .p-check-label {
    color: var(--ink-soft);
  }

  /* ── Questions (radio-cards / radio / group) ── */
  .p-question {
    margin-bottom: 10pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .p-question-label {
    font-size: 10pt;
    font-weight: 600;
    color: var(--ink);
    margin-bottom: 6pt;
    line-height: 1.45;
  }

  /* Radio cards */
  .p-cards {
    display: flex;
    flex-direction: column;
    gap: 4pt;
    margin-bottom: 4pt;
  }
  .p-card {
    display: flex;
    align-items: flex-start;
    gap: 8pt;
    padding: 6pt 10pt;
    border: 0.75pt solid var(--line);
    border-radius: 4pt;
    background: #fff;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .p-card-selected {
    border-color: var(--navy);
    background: var(--sand-light);
    box-shadow: inset 2pt 0 0 var(--navy);
  }
  .p-card-radio {
    flex: 0 0 auto;
    width: 10pt;
    height: 10pt;
    border: 1pt solid var(--ink-mute);
    border-radius: 50%;
    background: #fff;
    position: relative;
    top: 2pt;
  }
  .p-card-radio-on {
    border-color: var(--navy);
    background: radial-gradient(circle, var(--navy) 45%, #fff 46%, #fff 60%, var(--navy) 61%);
  }
  .p-card-body { flex: 1 1 auto; }
  .p-card-title {
    font-size: 10pt;
    font-weight: 600;
    color: var(--ink);
    line-height: 1.3;
  }
  .p-card-selected .p-card-title {
    color: var(--navy-deep);
  }
  .p-card-desc {
    font-size: 8.5pt;
    color: var(--ink-mute);
    margin-top: 1pt;
    line-height: 1.4;
  }

  /* Plain radio list */
  .p-radio-list {
    display: flex;
    flex-direction: column;
    gap: 3pt;
  }
  .p-radio-row {
    display: flex;
    align-items: flex-start;
    gap: 8pt;
    padding: 3pt 8pt;
    border-radius: 3pt;
    font-size: 9.5pt;
    color: var(--ink-soft);
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .p-radio-row-selected {
    background: var(--sand-light);
    color: var(--navy-deep);
    font-weight: 600;
  }
  .p-radio-dot {
    flex: 0 0 auto;
    width: 9pt;
    height: 9pt;
    border: 1pt solid var(--ink-mute);
    border-radius: 50%;
    background: #fff;
    position: relative;
    top: 2pt;
  }
  .p-radio-dot-on {
    border-color: var(--navy);
    background: radial-gradient(circle, var(--navy) 40%, #fff 42%, #fff 58%, var(--navy) 60%);
  }
  .p-radio-text { flex: 1 1 auto; line-height: 1.4; }

  /* ── Conditional sub-block ── */
  .p-conditional {
    margin: 6pt 0 6pt 10pt;
    padding: 8pt 12pt;
    border-left: 1.5pt solid var(--blue);
    background: linear-gradient(90deg, rgba(140,174,244,0.10) 0%, rgba(140,174,244,0) 100%);
    border-radius: 0 3pt 3pt 0;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .p-conditional .p-field:last-child { margin-bottom: 0; }

  /* ── Field groups (shared block background) ── */
  .p-group {
    margin-bottom: 10pt;
    padding: 8pt 10pt;
    background: var(--sand-light);
    border-radius: 4pt;
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .p-group .p-field:last-child { margin-bottom: 0; }

  /* ── Info block ── */
  .p-info {
    margin: 6pt 0 10pt;
    padding: 10pt 12pt;
    background: var(--cream);
    border: 0.5pt solid var(--line);
    border-radius: 3pt;
    font-size: 8.5pt;
    color: var(--ink-soft);
    line-height: 1.55;
  }
  .p-info p + p, .p-info p + ol, .p-info ol + p { margin-top: 5pt; }
  .p-info ol { padding-left: 14pt; }
  .p-info li { margin-bottom: 2pt; }
  .p-info strong { color: var(--navy-deep); }

  /* ── Likert ── */
  .p-likert {
    width: 100%;
    border-collapse: collapse;
    margin: 6pt 0 12pt;
    font-size: 9pt;
  }
  .p-likert thead { display: table-header-group; }
  .p-likert th {
    padding: 6pt 4pt;
    font-weight: 600;
    text-transform: none;
    color: var(--navy-deep);
    background: var(--sand-light);
    border-bottom: 1pt solid var(--navy);
  }
  .p-likert-head-q {
    text-align: left;
    width: 58%;
    padding-left: 6pt;
    font-size: 9pt;
  }
  .p-likert-head-opt {
    text-align: center;
    width: 10.5%;
    font-size: 8pt;
  }
  .p-likert tbody tr {
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .p-likert tbody tr:nth-child(even) {
    background: #fafcff;
  }
  .p-likert td {
    padding: 6pt 4pt;
    border-bottom: 0.5pt solid var(--line-soft);
    vertical-align: middle;
    line-height: 1.4;
  }
  .p-likert-q {
    text-align: left;
    padding-left: 6pt;
    color: var(--ink);
  }
  .p-likert-num {
    display: inline-block;
    min-width: 12pt;
    margin-right: 4pt;
    color: var(--navy);
    font-weight: 700;
  }
  .p-likert-opt { text-align: center; }
  .p-likert-cell {
    display: inline-block;
    width: 11pt;
    height: 11pt;
    border: 0.75pt solid var(--ink-mute);
    border-radius: 50%;
    background: #fff;
    vertical-align: middle;
  }
  .p-likert-cell-on {
    border-color: var(--navy);
    background: radial-gradient(circle, var(--navy) 42%, #fff 44%, #fff 58%, var(--navy) 60%);
  }
  .p-likert-answered .p-likert-q {
    color: var(--navy-deep);
    font-weight: 500;
  }

  /* ── Footer ── */
  .p-footer {
    margin-top: 24pt;
    padding-top: 10pt;
    border-top: 0.75pt solid var(--line);
    text-align: center;
  }
  .p-footer-mark {
    font-size: 9pt;
    font-weight: 600;
    color: var(--navy);
  }
  .p-footer-note {
    font-size: 8pt;
    color: var(--ink-mute);
    margin-top: 2pt;
  }

  /* Page layout tweaks for print */
  @media print {
    .p-header { page-break-after: avoid; }
    .p-section { page-break-inside: auto; }
    h2.p-section-title, .p-section-sub, .p-section-intro { page-break-after: avoid; }
    .p-question-label, .p-field-label { page-break-after: avoid; }
    tr, .p-card, .p-radio-row, .p-field, .p-conditional, .p-group {
      page-break-inside: avoid;
    }
  }

  /* Screen preview (when the print tab is open but not yet printed) */
  @media screen {
    html, body { background: #eef1f6; }
    body {
      max-width: 210mm;
      margin: 18mm auto;
      padding: 18mm;
      background: #fff;
      box-shadow: 0 4px 24px rgba(17, 17, 98, 0.10);
      border-radius: 3px;
    }
  }
</style>
</head>
<body>${body}</body>
</html>`;
}

// ─── Print actions ───────────────────────────────────────────────────

function openPrintWindow(htmlContent) {
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) {
    showErrorModal('Pop-up geblokkeerd', 'Sta pop-ups toe voor deze website om te kunnen afdrukken.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Wait for fonts to settle, then trigger the print dialog.
  const triggerPrint = () => {
    setTimeout(() => {
      try { printWindow.focus(); } catch (_) {}
      printWindow.print();
    }, 350);
  };

  if (printWindow.document.fonts && printWindow.document.fonts.ready) {
    printWindow.document.fonts.ready.then(triggerPrint, triggerPrint);
  } else {
    printWindow.onload = triggerPrint;
  }
}

export function printForm() {
  const values = collectFormValues();
  const orgName = state.session?.orgName || values.organisatie || '';
  const orgCode = state.session?.orgCode || '';

  const doc = generatePrintDocument(values, orgName, orgCode);
  openPrintWindow(doc);
}

export function printArchivedForm(formId) {
  const archivedForm = window.Storage.getSubmittedFormById(formId);
  if (!archivedForm) {
    showErrorModal('Niet gevonden', 'Het formulier kon niet worden gevonden.');
    return;
  }

  const data = archivedForm.data || {};
  const orgName = data.organisatie || archivedForm.orgName || '';
  const orgCode = archivedForm.orgCode || data.orgCode || '';

  const doc = generatePrintDocument(data, orgName, orgCode);
  openPrintWindow(doc);
}
