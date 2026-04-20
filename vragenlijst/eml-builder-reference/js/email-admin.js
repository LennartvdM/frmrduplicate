/**
 * Email CMS — Monitoring Cultureel Talent naar de Top 2026
 *
 * Standalone admin tool for composing and bulk-sending styled invitation emails.
 * Uses localStorage for recipient persistence and Google Apps Script for sending.
 * Version 3 deployment — updated 2026-02-17
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Constants
  // ---------------------------------------------------------------------------

  const STORAGE_KEYS = {
    RECIPIENTS: 'esc_email_recipients',
    SETTINGS: 'esc_email_settings'
  };

  // Admin mode — protects destructive bulk actions behind a passphrase
  const ADMIN_HASH = '353520d54228f96771fee865439e7e865c366480fc39a5ae80a5408ac0289672';
  let adminUnlocked = false;

  async function checkAdminPassphrase(input) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex === ADMIN_HASH;
  }

  function setAdminMode(unlocked) {
    adminUnlocked = unlocked;
    document.querySelectorAll('.ea-admin-only').forEach(el => {
      el.hidden = !unlocked;
    });
    const toggle = document.getElementById('adminToggle');
    if (toggle) {
      toggle.title = unlocked ? 'Admin-modus vergrendelen' : 'Admin-modus ontgrendelen';
      toggle.innerHTML = unlocked
        ? '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 7V5a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="7" width="10" height="7" rx="1.5" stroke="currentColor" stroke-width="1.3"/><path d="M5 7V5a3 3 0 0 1 6 0v2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';
    }
  }

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3gcRqlbc9lH0WKiR5yEeM4whu_WFVAUg9lE8cf9Uyf6C-teYRfA5CQX2tCaZZiV-nlg/exec';
  const SURVEY_GAS_URL = 'https://script.google.com/macros/s/AKfycbzOq9Mn0UKwrhvPWRZaJkV2b9qH1uPtuYCOp4C9QDchaWcYk3-JJUz6LF0z9WQHb7dh/exec';
  const PROXY_URL = '/api/';

  const DEFAULT_SETTINGS = {
    subject: 'Monitor Executive Search \u2014 Talent naar de Top',
    surveyUrl: 'https://monitortalent.nl/',
    webVersionUrl: '',
    deadline: '28 april',
    jaar: '2025',
    senderName: 'Commissie Monitoring Talent naar de Top',
    contactPerson: 'Ellen Stoop',
    contactEmail: 'ellen.stoop@talentnaardetop.nl',
    contactPhone: '06 83562954',
    ccRecipients: '',
    bccRecipients: '',
    // Editable mail text fields
    heading: 'Monitor Executive Search',
    headerImageUrl: 'https://monitortalent.nl/images/email-header.png',
    greeting: 'Beste {naam}',
    bodyText: 'Elk jaar brengen we in kaart hoe het staat met diversiteit in executive search bij ondertekenaars van de Executive Search Code. Hierbij nodigen wij u uit om de Monitor Executive Search over 2025 in te vullen.\n\nDe vragenlijst is ingekort en vernieuwd. Invullen kost ongeveer 15\u201320 minuten. Uw antwoorden worden automatisch opgeslagen, dus u kunt gerust tussendoor stoppen en later verder gaan. Mocht u achteraf iets willen wijzigen, dan vult u de vragenlijst gewoon opnieuw in. Uw laatst ingevulde antwoorden tellen.\n\nWilt u de vragen vooraf bekijken? [Bekijk het overzicht.]({inkijkUrl})',
    ctaText: 'Naar de vragenlijst',
    ctaNote: '',
    deadlineContactText: 'Invullen kan tot en met **{deadline}**. Uw input is zeer waardevol en wij zien de resultaten graag tegemoet, alvast dank.',
    section2Heading: 'Wat levert het op?',
    section2Text: 'Na afloop wordt er een rapportage gemaakt met de resultaten van alle Code-ondertekenaars, waarin te zien is hoe de sector als geheel presteert. Uw individuele gegevens worden uiteraard niet gedeeld, alleen de totaalresultaten.',
    section3Heading: '',
    section3ImageUrl: '',
    section3Text: '',
    closingText: '',
    signer1Name: '',
    signer1Title: '',
    signer2Name: '',
    signer2Title: '',
    address: 'Sandbergplein 24\n1181 ZX Amstelveen',
    phone: '',
    website: 'talentnaardetop.nl',
    socialTwitter: '',
    socialLinkedin: 'https://linkedin.com/company/talentnaardetop',
    socialInstagram: 'https://instagram.com/talentnaardetop',
    socialYoutube: '',
    footerText: 'U ontvangt deze e-mail omdat uw organisatie deelneemt aan de Monitor Executive Search.',
    unsubscribeUrl: '',
    profileUrl: '',
    privacyUrl: ''
  };

  const SEND_DELAY_MS = 1500; // Delay between consecutive sends to avoid rate-limiting

  // Characters used for code generation (no ambiguous chars: 0/O, 1/I/L)
  const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  let recipients = [];
  let settings = { ...DEFAULT_SETTINGS };
  let sendingInProgress = false;
  let pendingConfirmAction = null;

  // ---------------------------------------------------------------------------
  // localStorage helpers
  // ---------------------------------------------------------------------------

  function saveRecipients() {
    try {
      localStorage.setItem(STORAGE_KEYS.RECIPIENTS, JSON.stringify(recipients));
    } catch (e) {
      console.warn('Failed to save recipients:', e);
    }
  }

  function loadRecipients() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.RECIPIENTS);
      return data ? JSON.parse(data) : [];
    } catch { return []; }
  }

  function saveSettings() {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings:', e);
    }
  }

  const SETTINGS_VERSION = 8;

  function loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (!data) return { ...DEFAULT_SETTINGS, _v: SETTINGS_VERSION };
      const saved = JSON.parse(data);
      // Clear stale settings from older versions
      if (!saved._v || saved._v < SETTINGS_VERSION) {
        localStorage.removeItem(STORAGE_KEYS.SETTINGS);
        return { ...DEFAULT_SETTINGS, _v: SETTINGS_VERSION };
      }
      // Don't let empty saved values override non-empty defaults
      const merged = { ...DEFAULT_SETTINGS, _v: SETTINGS_VERSION };
      for (const key of Object.keys(saved)) {
        if (saved[key] !== '' && saved[key] !== undefined) {
          merged[key] = saved[key];
        }
      }
      return merged;
    } catch { return { ...DEFAULT_SETTINGS, _v: SETTINGS_VERSION }; }
  }

  // ---------------------------------------------------------------------------
  // HTML Escape
  // ---------------------------------------------------------------------------

  function esc(str) {
    const el = document.createElement('span');
    el.textContent = str || '';
    return el.innerHTML;
  }

  // ---------------------------------------------------------------------------
  // Email HTML Template
  // ---------------------------------------------------------------------------

  function replaceTextPlaceholders(text, vars) {
    return text
      .replace(/\{naam\}/g, vars.naam)
      .replace(/\{jaar\}/g, vars.jaar)
      .replace(/\{deadline\}/g, vars.deadline)
      .replace(/\{contactPerson\}/g, vars.contactPerson)
      .replace(/\{contactEmail\}/g, vars.contactEmail)
      .replace(/\{contactPhone\}/g, vars.contactPhone)
      .replace(/\{code\}/g, vars.code);
  }

  function generateEmailHtml(recipient) {
    // Delegate to shared template builder
    if (window.EmailTemplate && window.EmailTemplate.buildEmailHtml) {
      return window.EmailTemplate.buildEmailHtml(recipient, settings);
    }
    // Fallback: simple text
    return '<html><body><p>Template niet geladen.</p></body></html>';
  }

  // ---------------------------------------------------------------------------
  // Recipient Management
  // ---------------------------------------------------------------------------

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  /**
   * Generate a unique XXX-XXX access code.
   */
  function generateCode() {
    const existingCodes = new Set(recipients.map(r => r.code));
    let code;
    do {
      let part1 = '', part2 = '';
      for (let i = 0; i < 3; i++) {
        part1 += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
        part2 += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
      }
      code = part1 + '-' + part2;
    } while (existingCodes.has(code));
    return code;
  }

  /**
   * Register a code in the survey Google Sheet so it's valid before the email is sent.
   * Uses checkCode with organisatie param — GAS auto-creates if not found.
   */
  /**
   * Make a single request to one endpoint. Returns parsed JSON or null.
   */
  async function fetchEndpoint(url, label, timeoutMs) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs || 15000);
      const response = await fetch(url, { method: 'GET', signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[CMS] ${label} HTTP ${response.status}`);
        return null;
      }

      const text = await response.text();
      // GAS sometimes returns HTML (auth redirect) — skip
      if (text.trim().startsWith('<!DOCTYPE') || text.trim().startsWith('<html')) {
        console.warn(`[CMS] ${label} returned HTML (auth redirect)`);
        return null;
      }

      return JSON.parse(text);
    } catch (err) {
      console.warn(`[CMS] ${label} error:`, err.message);
      return null;
    }
  }

  /**
   * Try both endpoints (direct GAS + proxy). Returns first successful JSON or null.
   */
  async function fetchDualEndpoint(params, timeoutMs) {
    const endpoints = [
      { url: SURVEY_GAS_URL + '?' + params, label: 'direct' },
      { url: PROXY_URL + '?' + params, label: 'proxy' }
    ];
    for (const ep of endpoints) {
      const data = await fetchEndpoint(ep.url, ep.label, timeoutMs);
      if (data) return data;
    }
    return null;
  }

  /**
   * Register a code in the backend with retry + exponential backoff.
   * Tries up to 3 times, each attempt tries both endpoints.
   * Returns true on success, false on failure.
   */
  async function registerCodeInBackend(code, organisatie) {
    const params = 'action=checkCode&code=' + encodeURIComponent(code) + '&organisatie=' + encodeURIComponent(organisatie);
    const MAX_RETRIES = 3;
    const BACKOFF = [0, 1500, 3000]; // ms before each attempt

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      if (attempt > 0) {
        console.log(`[CMS] Retry ${attempt}/${MAX_RETRIES - 1} for ${code} (${organisatie})`);
        await sleep(BACKOFF[attempt]);
      }

      const data = await fetchDualEndpoint(params, 15000);
      if (data && data.success) {
        console.log('[CMS] Code registered:', code, organisatie, `(attempt ${attempt + 1})`);
        return true;
      }
      if (data) {
        // Got a response but success=false — don't retry, it's a logical error
        console.warn('[CMS] Registration rejected:', code, data.error);
        return false;
      }
      // data === null means network/timeout — retry
    }

    console.error('[CMS] All retries exhausted for:', code, organisatie);
    return false;
  }

  /**
   * Verify a code exists in the backend (read-only check, no organisatie param).
   * Returns { exists: true/false, organisatie?: string }.
   */
  async function verifyCodeInBackend(code) {
    const params = 'action=checkCode&code=' + encodeURIComponent(code);
    const data = await fetchDualEndpoint(params, 10000);
    if (data && data.success) {
      return { exists: true, organisatie: data.organisatie || '' };
    }
    // If we got a response with success=false, the code doesn't exist (or is invalid)
    if (data && !data.success) {
      return { exists: false };
    }
    // null = network error, can't determine
    return { exists: null };
  }

  function addRecipient(email, name, email2) {
    email = (email || '').trim();
    name = (name || '').trim();
    email2 = (email2 || '').trim();

    if (!email) {
      showToast('Vul een e-mailadres in', 'error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Ongeldig e-mailadres', 'error');
      return false;
    }
    if (email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email2)) {
      showToast('Ongeldig tweede e-mailadres', 'error');
      return false;
    }
    if (!name) {
      showToast('Vul een naam in', 'error');
      return false;
    }

    // Check for duplicate email
    if (recipients.some(r => r.email && r.email.toLowerCase() === email.toLowerCase())) {
      showToast('Dit e-mailadres is al toegevoegd', 'error');
      return false;
    }

    const code = generateCode();

    const recipient = {
      id: generateId(),
      email: email,
      email2: email2 || '',
      name: name,
      code: code,
      status: 'pending',
      selected: false,
      error: null,
      codeRegistered: undefined
    };

    recipients.push(recipient);
    saveRecipients();
    renderTable();
    updateCounts();
    updatePreview();

    // Auto-register code in backend immediately
    registerCodeInBackend(code, name).then(ok => {
      recipient.codeRegistered = ok;
      saveRecipients();
      renderTable();
      updateCounts();
      if (ok) {
        showToast(`Code ${code} geregistreerd voor ${name}`, 'success');
      } else {
        showToast(`Code registratie mislukt voor ${name} — gebruik "Codes verifiëren" om te controleren`, 'error');
      }
    });

    return true;
  }

  function removeRecipient(id) {
    recipients = recipients.filter(r => r.id !== id);
    saveRecipients();
    renderTable();
    updateCounts();
    updatePreview();
  }

  function clearAllRecipients() {
    recipients = [];
    saveRecipients();
    renderTable();
    updateCounts();
    updatePreview();
    showToast('Lijst gereset', 'info');
  }

  /**
   * Register codes in the backend for all recipients that haven't been registered yet.
   * Does NOT regenerate codes that are already registered.
   */
  async function registerAllCodes() {
    if (recipients.length === 0) {
      showToast('Geen ontvangers om te registreren', 'error');
      return;
    }

    // Only process recipients that haven't been registered yet
    const toRegister = recipients.filter(r => r.codeRegistered !== true);

    if (toRegister.length === 0) {
      showToast('Alle codes zijn al geregistreerd \u2713', 'success');
      return;
    }

    const total = toRegister.length;
    const alreadyDone = recipients.length - total;
    let registered = 0;
    let failed = 0;

    // Use the send progress bar for visual feedback
    const progressEl = document.getElementById('sendProgress');
    const fillEl = document.getElementById('progressFill');
    const textEl = document.getElementById('progressText');
    progressEl.style.display = 'flex';
    fillEl.style.width = '0%';
    textEl.textContent = `${alreadyDone} / ${recipients.length} geregistreerd (${total} resterend)`;

    for (const r of toRegister) {
      // Register in backend via dual-endpoint
      const ok = await registerCodeInBackend(r.code, r.name);
      if (ok) {
        r.codeRegistered = true;
        registered++;
      } else {
        r.codeRegistered = false;
        failed++;
      }

      // Update progress bar
      const done = registered + failed;
      const totalDone = alreadyDone + registered;
      fillEl.style.width = Math.round(((alreadyDone + done) / recipients.length) * 100) + '%';
      textEl.textContent = `${totalDone} / ${recipients.length} geregistreerd${failed > 0 ? ` (${failed} mislukt)` : ''}`;

      // Update table live so user sees each checkmark appear
      saveRecipients();
      renderTable();

      // Brief pause to avoid rate-limiting
      if (done < total) {
        await sleep(400);
      }
    }

    updateCounts();

    const parts = [`${registered} code${registered !== 1 ? 's' : ''} geregistreerd`];
    if (alreadyDone > 0) parts.push(`${alreadyDone} al eerder geregistreerd`);
    if (failed > 0) parts.push(`${failed} mislukt`);
    showToast(parts.join(', '), failed > 0 ? 'error' : 'success');

    // Hide progress after a delay
    setTimeout(() => {
      progressEl.style.display = 'none';
      fillEl.style.width = '0%';
    }, 3000);
  }

  /**
   * Re-generate ALL codes (including registered ones) and register in backend.
   * WARNING: This creates orphans in the backend for previously registered codes.
   */
  async function reshuffleAllCodes() {
    if (recipients.length === 0) {
      showToast('Geen ontvangers', 'error');
      return;
    }

    const total = recipients.length;
    let registered = 0;
    let failed = 0;

    const progressEl = document.getElementById('sendProgress');
    const fillEl = document.getElementById('progressFill');
    const textEl = document.getElementById('progressText');
    progressEl.style.display = 'flex';
    fillEl.style.width = '0%';
    textEl.textContent = `0 / ${total} nieuwe codes`;

    for (const r of recipients) {
      r.code = generateCode();
      r.codeRegistered = false;

      const ok = await registerCodeInBackend(r.code, r.name);
      if (ok) {
        r.codeRegistered = true;
        registered++;
      } else {
        failed++;
      }

      const done = registered + failed;
      fillEl.style.width = Math.round((done / total) * 100) + '%';
      textEl.textContent = `${done} / ${total} nieuwe codes${failed > 0 ? ` (${failed} mislukt)` : ''}`;

      saveRecipients();
      renderTable();

      if (done < total) {
        await sleep(400);
      }
    }

    updateCounts();

    const parts = [`${registered} nieuwe code${registered !== 1 ? 's' : ''} geregistreerd`];
    if (failed > 0) parts.push(`${failed} mislukt`);
    showToast(parts.join(', '), failed > 0 ? 'error' : 'success');

    setTimeout(() => {
      progressEl.style.display = 'none';
      fillEl.style.width = '0%';
    }, 3000);
  }

  /**
   * Verify all codes against the backend — checks which codes actually exist
   * without creating anything new. Updates codeRegistered status per recipient.
   */
  async function verifyAllCodes() {
    if (recipients.length === 0) {
      showToast('Geen ontvangers om te controleren', 'error');
      return;
    }

    const total = recipients.length;
    let verified = 0;
    let missing = 0;
    let errors = 0;

    const progressEl = document.getElementById('sendProgress');
    const fillEl = document.getElementById('progressFill');
    const textEl = document.getElementById('progressText');
    progressEl.style.display = 'flex';
    fillEl.style.width = '0%';
    textEl.textContent = `0 / ${total} gecontroleerd`;

    for (const r of recipients) {
      const result = await verifyCodeInBackend(r.code);

      if (result.exists === true) {
        r.codeRegistered = true;
        verified++;
      } else if (result.exists === false) {
        r.codeRegistered = false;
        missing++;
      } else {
        // null = network error, leave status as-is
        errors++;
      }

      const done = verified + missing + errors;
      fillEl.style.width = Math.round((done / total) * 100) + '%';
      textEl.textContent = `${done} / ${total} gecontroleerd`;

      saveRecipients();
      renderTable();

      if (done < total) {
        await sleep(300);
      }
    }

    updateCounts();

    const parts = [];
    if (verified > 0) parts.push(`${verified} \u2713 bevestigd`);
    if (missing > 0) parts.push(`${missing} \u2717 niet gevonden`);
    if (errors > 0) parts.push(`${errors} onbekend (netwerk)`);
    showToast(parts.join(', '), missing > 0 || errors > 0 ? 'error' : 'success');

    setTimeout(() => {
      progressEl.style.display = 'none';
      fillEl.style.width = '0%';
    }, 3000);
  }

  // ---------------------------------------------------------------------------
  // CSV Import / Export
  // ---------------------------------------------------------------------------

  /**
   * Split a CSV line respecting quoted fields (handles commas inside quotes).
   */
  function splitCSVLine(line) {
    const parts = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
        else { inQuotes = !inQuotes; }
      } else if ((ch === ',' || ch === ';' || ch === '\t') && !inQuotes) {
        parts.push(current.trim().replace(/^["']|["']$/g, ''));
        current = '';
      } else {
        current += ch;
      }
    }
    parts.push(current.trim().replace(/^["']|["']$/g, ''));
    return parts;
  }

  /**
   * Auto-detect column indices by scanning header names.
   * Falls back to content sniffing (look for @ in cells) if no header match.
   */
  function detectColumns(headerParts, allRows) {
    const mapping = { name: -1, email: -1, email2: -1, code: -1 };

    // Try header-based detection
    for (let i = 0; i < headerParts.length; i++) {
      const h = headerParts[i].toLowerCase().replace(/[^a-z0-9 -]/g, '');
      if (h.includes('e-mail -1') || h.includes('email -1') || h === 'email' || h === 'e-mail' || h === 'emailadres' || h === 'e-mailadres') {
        if (mapping.email === -1) mapping.email = i;
        else if (mapping.email2 === -1) mapping.email2 = i;
      } else if (h.includes('e-mail -2') || h.includes('email -2') || h.includes('2e e-mail') || h === 'email2') {
        mapping.email2 = i;
      } else if (h.includes('executive search bureau') || h.includes('naam') || h.includes('organisatie') || h === 'bureau' || h === 'name') {
        mapping.name = i;
      } else if (h === 'code' || h === 'toegangscode') {
        mapping.code = i;
      }
    }

    // If we found both email and name from headers, we're done
    if (mapping.email !== -1 && mapping.name !== -1) {
      return mapping;
    }

    // Fallback: scan first few data rows to find columns with @ (emails) and text
    const sampleRows = allRows.slice(0, Math.min(5, allRows.length));
    const colScores = {};
    for (const row of sampleRows) {
      for (let i = 0; i < row.length; i++) {
        if (!colScores[i]) colScores[i] = { emailHits: 0, textHits: 0 };
        const val = row[i] || '';
        if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || /<[^\s@]+@[^\s@]+\.[^\s@]+>/.test(val)) {
          colScores[i].emailHits++;
        } else if (val.length > 2 && !/^\d+$/.test(val) && !/^\d{1,2}[\/\-]/.test(val) && !/^\d+%?$/.test(val)) {
          colScores[i].textHits++;
        }
      }
    }

    // Pick email columns (highest email hit counts)
    const emailCols = Object.entries(colScores)
      .filter(([, s]) => s.emailHits > 0)
      .sort((a, b) => b[1].emailHits - a[1].emailHits)
      .map(([i]) => parseInt(i));

    if (emailCols.length >= 1 && mapping.email === -1) mapping.email = emailCols[0];
    if (emailCols.length >= 2 && mapping.email2 === -1) mapping.email2 = emailCols[1];

    // Pick name column (highest text hits, not an email column)
    if (mapping.name === -1) {
      const nameCandidates = Object.entries(colScores)
        .filter(([i, s]) => s.textHits > 0 && !emailCols.includes(parseInt(i)))
        .sort((a, b) => b[1].textHits - a[1].textHits);
      if (nameCandidates.length > 0) mapping.name = parseInt(nameCandidates[0][0]);
    }

    return mapping;
  }

  /**
   * Extract a clean email address from strings like "Name <email@example.com>" or plain emails.
   */
  function extractEmail(raw) {
    if (!raw) return '';
    const match = raw.match(/<([^\s@]+@[^\s@]+\.[^\s@]+)>/);
    if (match) return match[1];
    const trimmed = raw.trim();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed) ? trimmed : '';
  }

  /**
   * Split CSV text into logical lines, respecting multi-line quoted fields.
   */
  function splitCSVIntoLines(text) {
    const lines = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
        current += ch;
      } else if ((ch === '\n' || ch === '\r') && !inQuotes) {
        if (ch === '\r' && text[i + 1] === '\n') i++; // skip \r\n
        if (current.trim()) lines.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
    if (current.trim()) lines.push(current);
    return lines;
  }

  function parseCSV(text) {
    const lines = splitCSVIntoLines(text);
    if (lines.length < 2) return [];

    // Parse all lines
    const allParts = lines.map(line => splitCSVLine(line));
    const headerParts = allParts[0];

    // Detect whether first row is a header (contains keywords, no emails)
    const firstRowHasEmail = headerParts.some(p => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.trim()));
    const dataRows = firstRowHasEmail ? allParts : allParts.slice(1);

    // Detect column mapping
    const cols = detectColumns(headerParts, dataRows);

    // If we still can't find email + name, fall back to legacy: col 0 = email, col 1 = name
    if (cols.email === -1) cols.email = 0;
    if (cols.name === -1) cols.name = 1;

    const results = [];
    for (const parts of dataRows) {
      const email = extractEmail(parts[cols.email] || '');
      const name = (parts[cols.name] || '').trim();
      const email2 = cols.email2 !== -1 ? extractEmail(parts[cols.email2] || '') : '';
      const code = cols.code !== -1 ? (parts[cols.code] || '').trim() : '';

      // Must have a valid email and a non-empty name
      if (email && name && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        results.push({ email, name, code, email2 });
      }
    }

    return results;
  }

  function handleCSVImport(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const parsed = parseCSV(e.target.result);
      if (parsed.length === 0) {
        showToast('Geen geldige rijen gevonden. Verwacht: email, naam', 'error');
        return;
      }

      let added = 0;
      let skipped = 0;
      for (const row of parsed) {
        // Check for duplicate email
        const isDuplicate = row.email && recipients.some(r => r.email && r.email.toLowerCase() === row.email.toLowerCase());
        if (isDuplicate) {
          skipped++;
          continue;
        }

        const code = row.code ? row.code.trim().toUpperCase() : generateCode();
        const name = row.name.trim();

        recipients.push({
          id: generateId(),
          email: row.email.trim(),
          email2: (row.email2 || '').trim(),
          name: name,
          code: code,
          status: 'pending',
          selected: false,
          error: null,
          codeRegistered: undefined  // not yet attempted
        });
        added++;
      }

      saveRecipients();
      renderTable();
      updateCounts();
      updatePreview();

      const parts = [];
      if (added > 0) parts.push(`${added} ontvanger${added !== 1 ? 's' : ''} toegevoegd`);
      if (skipped > 0) parts.push(`${skipped} duplica${skipped !== 1 ? 'ten' : 'at'} overgeslagen`);
      if (added > 0) parts.push('klik \u201cCodes registreren\u201d om ze in de backend te zetten');
      showToast(parts.join(' \u2014 ') || 'Geen wijzigingen', parts.length > 0 ? 'success' : 'info');
    };
    reader.readAsText(file);
  }

  function exportCSV() {
    if (recipients.length === 0) {
      showToast('Geen ontvangers om te exporteren', 'error');
      return;
    }

    const header = 'email,naam,code,email2,status,backend';
    const rows = recipients.map(r => {
      const regStatus = r.codeRegistered === true ? 'ja' : r.codeRegistered === false ? 'nee' : '';
      return `"${r.email}","${r.name}","${r.code}","${r.email2 || ''}","${r.status}","${regStatus}"`;
    });
    const csv = [header, ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-ontvangers.csv';
    a.click();
    URL.revokeObjectURL(url);

    showToast('CSV ge\u00EBxporteerd', 'success');
  }

  // ---------------------------------------------------------------------------
  // Sending Emails via GAS
  // ---------------------------------------------------------------------------

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function sendSingleEmail(recipient) {
    // Build params — send all settings fields to GAS
    const paramObj = {
      action: 'sendEmail',
      to: recipient.email,
      recipientCc: recipient.email2 || '',
      naam: recipient.name,
      code: recipient.code,
      subject: settings.subject,
      surveyUrl: settings.surveyUrl
        ? settings.surveyUrl + (settings.surveyUrl.includes('?') ? '&' : '?') + 'code=' + encodeURIComponent(recipient.code)
        : '',
      deadline: settings.deadline || '',
      jaar: settings.jaar || '',
      contactPerson: settings.contactPerson || '',
      contactEmail: settings.contactEmail || '',
      contactPhone: settings.contactPhone || '',
      senderName: settings.senderName || ''
    };
    // Add all text fields
    const textFieldKeys = [
      'heading', 'headerImageUrl', 'greeting', 'bodyText', 'ctaText', 'ctaNote',
      'deadlineContactText', 'section2Heading', 'section2Text',
      'section3Heading', 'section3ImageUrl', 'section3Text',
      'closingText', 'signer1Name', 'signer1Title', 'signer2Name', 'signer2Title',
      'address', 'phone', 'website', 'footerText',
      'webVersionUrl', 'unsubscribeUrl', 'profileUrl', 'privacyUrl',
      'socialTwitter', 'socialLinkedin', 'socialInstagram', 'socialYoutube',
      'ccRecipients', 'bccRecipients'
    ];
    for (const key of textFieldKeys) {
      paramObj[key] = settings[key] || DEFAULT_SETTINGS[key] || '';
    }
    const params = new URLSearchParams(paramObj);

    // Try direct GAS first, fall back to proxy
    const endpoints = [
      { url: GAS_URL + '?' + params.toString(), label: 'direct' },
      { url: PROXY_URL + '?' + params.toString(), label: 'proxy' }
    ];

    console.log('[EmailCMS] ─── SEND EMAIL ───');
    console.log('[EmailCMS]   To:', recipient.email);
    console.log('[EmailCMS]   Params:', Object.fromEntries(params));

    for (const endpoint of endpoints) {
      try {
        console.log(`[EmailCMS]   Trying ${endpoint.label}: ${endpoint.url.substring(0, 120)}...`);
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 20000);

        const response = await fetch(endpoint.url, { method: 'GET', signal: controller.signal });
        clearTimeout(timeoutId);

        console.log(`[EmailCMS]   ${endpoint.label} response: status=${response.status}, type=${response.type}, url=${response.url}`);

        if (!response.ok) {
          console.warn(`[EmailCMS]   ${endpoint.label} HTTP error: ${response.status} ${response.statusText}`);
          continue;
        }

        const text = await response.text();
        console.log(`[EmailCMS]   ${endpoint.label} body:`, text.substring(0, 500));

        if (text.includes('accounts.google.com') || text.includes('ServiceLogin')) {
          console.error('[EmailCMS]   Redirected to Google login!');
          throw new Error('GAS requires reauthorization');
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch (parseErr) {
          console.error(`[EmailCMS]   ${endpoint.label} JSON parse failed:`, parseErr.message);
          console.error(`[EmailCMS]   Raw body:`, text.substring(0, 300));
          continue;
        }

        console.log(`[EmailCMS]   ${endpoint.label} parsed:`, data);

        if (data.success) {
          console.log('[EmailCMS]   ✓ Email sent successfully');
          return { success: true };
        }
        console.warn(`[EmailCMS]   ${endpoint.label} returned success=false:`, data.error);
        return { success: false, error: data.error || 'Onbekende fout' };
      } catch (err) {
        console.error(`[EmailCMS]   ${endpoint.label} error:`, err.name, err.message);
        if (err.message === 'GAS requires reauthorization') throw err;
        // Try next endpoint
        continue;
      }
    }

    console.error('[EmailCMS] ─── BOTH ENDPOINTS FAILED ───');

    throw new Error('Beide endpoints niet bereikbaar');
  }

  async function sendBulk(recipientIds) {
    if (sendingInProgress) return;
    sendingInProgress = true;

    const toSend = recipients.filter(r => recipientIds.includes(r.id) && r.status !== 'sent' && r.email && r.name);
    const total = toSend.length;
    let completed = 0;
    let succeeded = 0;
    let failed = 0;

    const progressEl = document.getElementById('sendProgress');
    const fillEl = document.getElementById('progressFill');
    const textEl = document.getElementById('progressText');
    progressEl.style.display = 'flex';

    disableSendButtons(true);

    for (const recipient of toSend) {
      recipient.status = 'sending';
      recipient.error = null;
      renderTable();

      try {
        const result = await sendSingleEmail(recipient);
        if (result.success) {
          recipient.status = 'sent';
          succeeded++;
        } else {
          recipient.status = 'error';
          recipient.error = result.error;
          failed++;
        }
      } catch (err) {
        recipient.status = 'error';
        recipient.error = err.message;
        failed++;
      }

      completed++;
      const pct = Math.round((completed / total) * 100);
      fillEl.style.width = pct + '%';
      textEl.textContent = `${completed} / ${total} verzonden`;

      saveRecipients();
      renderTable();
      updateCounts();

      // Delay between sends
      if (completed < total) {
        await sleep(SEND_DELAY_MS);
      }
    }

    sendingInProgress = false;
    disableSendButtons(false);

    let msg = `${succeeded} e-mail${succeeded !== 1 ? 's' : ''} verzonden`;
    if (failed > 0) msg += `, ${failed} mislukt`;
    showToast(msg, failed > 0 ? 'error' : 'success');

    // Hide progress after a delay
    setTimeout(() => {
      progressEl.style.display = 'none';
      fillEl.style.width = '0%';
    }, 3000);
  }

  function disableSendButtons(disabled) {
    const btn1 = document.getElementById('btnSendSelected');
    const btn2 = document.getElementById('btnSendAll');
    if (disabled) {
      btn1.disabled = true;
      btn2.disabled = true;
    } else {
      updateCounts();
    }
  }

  // ---------------------------------------------------------------------------
  // .eml Download (manual send via Outlook)
  // ---------------------------------------------------------------------------

  function downloadSingleEml(recipient) {
    // Ensure latest settings are captured
    syncSettingsFromUI();
    const emlContent = window.EmailTemplate.buildEml(recipient, settings);
    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    const safeName = (recipient.name || recipient.email || 'email')
      .replace(/[^a-zA-Z0-9À-ÿ\s-]/g, '')
      .replace(/\s+/g, '-')
      .toLowerCase()
      .slice(0, 50);
    a.download = safeName + '.eml';
    a.click();
    URL.revokeObjectURL(url);
  }

  async function downloadBulkEml(recipientIds) {
    const toDownload = recipients.filter(r =>
      recipientIds.includes(r.id) && r.email && r.name && r.status !== 'sent'
    );

    if (toDownload.length === 0) {
      showToast('Geen ontvangers om te downloaden', 'error');
      return;
    }

    // Download one by one with a short delay so the browser doesn't block them
    for (let i = 0; i < toDownload.length; i++) {
      downloadSingleEml(toDownload[i]);
      if (i < toDownload.length - 1) {
        await sleep(300);
      }
    }

    showToast(`${toDownload.length} .eml-bestand${toDownload.length !== 1 ? 'en' : ''} gedownload`, 'success');
  }

  // ---------------------------------------------------------------------------
  // UI Rendering
  // ---------------------------------------------------------------------------

  function renderTable() {
    const tbody = document.getElementById('recipientTableBody');
    if (!tbody) return;

    tbody.innerHTML = recipients.map(r => {
      return `
      <tr data-id="${r.id}">
        <td><input type="checkbox" class="row-check" data-id="${r.id}" ${r.selected ? 'checked' : ''}></td>
        <td class="ea-cell-email">${esc(r.email)}</td>
        <td class="ea-cell-email2">${esc(r.email2 || '')}</td>
        <td class="ea-cell-name">${esc(r.name)}</td>
        <td class="ea-cell-code">${esc(r.code)}${r.codeRegistered === true ? ' <span class="ea-code-ok" title="Geregistreerd in backend">\u2713</span>' : r.codeRegistered === false ? ' <span class="ea-code-fail" title="Niet geregistreerd">\u2717</span>' : ''}</td>
        <td>${renderStatus(r)}</td>
        <td class="ea-cell-actions">
          <button class="ea-btn-icon" data-action="downloadRowEml" data-id="${r.id}" title="Download .eml voor Outlook">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 10v2.667A1.333 1.333 0 0 1 12.667 14H3.333A1.334 1.334 0 0 1 2 12.667V10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.667 6.667 8 10l3.333-3.333" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10V2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
          <button class="ea-btn-delete" data-action="deleteRecipient" data-id="${r.id}" title="Verwijderen">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 4h12M5.333 4V2.667A1.333 1.333 0 0 1 6.667 1.333h2.666A1.333 1.333 0 0 1 10.667 2.667V4M12.667 4v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </td>
      </tr>`;
    }).join('');

    // Show/hide empty state
    const emptyEl = document.getElementById('emptyState');
    const tableScroll = document.querySelector('.ea-table-scroll');
    if (recipients.length === 0) {
      if (emptyEl) emptyEl.style.display = '';
      if (tableScroll) tableScroll.style.display = 'none';
    } else {
      if (emptyEl) emptyEl.style.display = 'none';
      if (tableScroll) tableScroll.style.display = '';
    }
  }

  function renderStatus(r) {
    switch (r.status) {
      case 'pending':
        return '<span class="ea-status ea-status-pending">Wachtrij</span>';
      case 'sending':
        return '<span class="ea-status ea-status-sending">Verzenden\u2026</span>';
      case 'sent':
        return '<span class="ea-status ea-status-sent">\u2713 Verzonden</span>';
      case 'error':
        return `<span class="ea-status ea-status-error" title="${esc(r.error || '')}">\u2717 Mislukt</span>`;
      default:
        return '';
    }
  }

  function updateCounts() {
    const sendable = recipients.filter(r => r.email && r.name);
    const selected = sendable.filter(r => r.selected);
    const pendingSel = selected.filter(r => r.status !== 'sent');
    const allPending = sendable.filter(r => r.status !== 'sent');

    const countEl = document.getElementById('recipientCount');
    const regCountEl = document.getElementById('registeredCount');
    const selCountEl = document.getElementById('selectedCount');
    const totalPendingEl = document.getElementById('totalPendingCount');
    const btn1 = document.getElementById('btnSendSelected');
    const btn2 = document.getElementById('btnSendAll');

    if (countEl) countEl.textContent = recipients.length;

    // Registration counter
    if (regCountEl) {
      const regCount = recipients.filter(r => r.codeRegistered === true).length;
      const total = recipients.length;
      if (total === 0) {
        regCountEl.textContent = '';
        regCountEl.className = 'ea-badge ea-badge-reg';
      } else if (regCount === total) {
        regCountEl.textContent = `${regCount}/${total} geregistreerd`;
        regCountEl.className = 'ea-badge ea-badge-reg ea-badge-ok';
      } else if (regCount === 0) {
        regCountEl.textContent = `0/${total} geregistreerd`;
        regCountEl.className = 'ea-badge ea-badge-reg ea-badge-warn';
      } else {
        regCountEl.textContent = `${regCount}/${total} geregistreerd`;
        regCountEl.className = 'ea-badge ea-badge-reg ea-badge-partial';
      }
    }
    if (selCountEl) selCountEl.textContent = pendingSel.length;
    if (totalPendingEl) totalPendingEl.textContent = allPending.length;

    if (btn1 && !sendingInProgress) btn1.disabled = pendingSel.length === 0;
    if (btn2 && !sendingInProgress) btn2.disabled = allPending.length === 0;

    // .eml download buttons
    const selEmlCountEl = document.getElementById('selectedEmlCount');
    const totalEmlCountEl = document.getElementById('totalEmlCount');
    const btnDlSel = document.getElementById('btnDownloadSelected');
    const btnDlAll = document.getElementById('btnDownloadAll');

    if (selEmlCountEl) selEmlCountEl.textContent = pendingSel.length;
    if (totalEmlCountEl) totalEmlCountEl.textContent = allPending.length;
    if (btnDlSel) btnDlSel.disabled = pendingSel.length === 0;
    if (btnDlAll) btnDlAll.disabled = allPending.length === 0;
  }

  function updatePreview() {
    const iframe = document.getElementById('emailPreview');
    if (!iframe) return;

    const sampleRecipient = recipients.length > 0 ? recipients[0] : null;
    const html = generateEmailHtml(sampleRecipient);

    iframe.srcdoc = html;
  }

  // ---------------------------------------------------------------------------
  // Settings Sync
  // ---------------------------------------------------------------------------

  const ALL_SETTING_FIELDS = [
    'subject', 'surveyUrl', 'webVersionUrl', 'deadline', 'jaar', 'senderName', 'contactPerson', 'contactEmail', 'contactPhone', 'ccRecipients', 'bccRecipients',
    'heading', 'headerImageUrl', 'greeting', 'bodyText', 'ctaText', 'ctaNote',
    'deadlineContactText', 'section2Heading', 'section2Text',
    'section3Heading', 'section3ImageUrl', 'section3Text',
    'closingText', 'signer1Name', 'signer1Title', 'signer2Name', 'signer2Title',
    'address', 'phone', 'website', 'socialTwitter', 'socialLinkedin', 'socialInstagram', 'socialYoutube',
    'footerText', 'unsubscribeUrl', 'profileUrl', 'privacyUrl'
  ];

  function syncSettingsFromUI() {
    for (const field of ALL_SETTING_FIELDS) {
      const el = document.getElementById('setting-' + field);
      if (el) settings[field] = el.value;
    }
    saveSettings();
  }

  function syncSettingsToUI() {
    for (const field of ALL_SETTING_FIELDS) {
      const el = document.getElementById('setting-' + field);
      if (el) el.value = settings[field] || '';
    }
  }

  function loadTemplatePreset(presetKey) {
    const presets = window.EmailTemplate && window.EmailTemplate.TEMPLATE_PRESETS;
    if (!presets || !presets[presetKey]) return;

    const preset = presets[presetKey].defaults;
    // Overwrite text fields + settings that the preset provides
    const presetFields = [
      'subject', 'senderName', 'deadline', 'jaar',
      'contactPerson', 'contactEmail', 'contactPhone',
      'heading', 'greeting', 'bodyText', 'ctaText', 'ctaNote',
      'deadlineContactText', 'section2Heading', 'section2Text',
      'section3Heading', 'section3ImageUrl', 'section3Text',
      'closingText', 'signer1Name', 'signer1Title', 'signer2Name', 'signer2Title',
      'address', 'phone', 'website', 'socialTwitter', 'socialLinkedin', 'socialInstagram', 'socialYoutube',
      'footerText', 'unsubscribeUrl', 'profileUrl', 'privacyUrl'
    ];
    for (const field of presetFields) {
      if (preset[field] !== undefined) {
        settings[field] = preset[field];
      }
    }
    saveSettings();
    syncSettingsToUI();
    updatePreview();

    // Update active state on preset buttons
    document.querySelectorAll('.ea-preset-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === presetKey);
    });

    showToast(`Template "${presets[presetKey].label}" geladen`, 'success');
  }

  // ---------------------------------------------------------------------------
  // Toast Notifications
  // ---------------------------------------------------------------------------

  function showToast(message, type) {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `ea-toast ea-toast-${type || 'info'}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('removing');
      setTimeout(() => toast.remove(), 200);
    }, 4000);
  }

  // ---------------------------------------------------------------------------
  // Confirmation Modal
  // ---------------------------------------------------------------------------

  function showConfirm(title, message, onConfirm) {
    const overlay = document.getElementById('confirmModal');
    const titleEl = document.getElementById('confirmTitle');
    const msgEl = document.getElementById('confirmMessage');

    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    pendingConfirmAction = onConfirm;
    if (overlay) overlay.style.display = '';
  }

  function hideConfirm() {
    const overlay = document.getElementById('confirmModal');
    if (overlay) overlay.style.display = 'none';
    pendingConfirmAction = null;
  }

  // ---------------------------------------------------------------------------
  // Copy HTML to Clipboard
  // ---------------------------------------------------------------------------

  async function copyEmailHtml() {
    const sampleRecipient = recipients.length > 0 ? recipients[0] : null;
    const html = generateEmailHtml(sampleRecipient);

    try {
      await navigator.clipboard.writeText(html);
      showToast('E-mail HTML gekopieerd naar klembord', 'success');
    } catch {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = html;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast('E-mail HTML gekopieerd naar klembord', 'success');
    }
  }

  // ---------------------------------------------------------------------------
  // Event Handling
  // ---------------------------------------------------------------------------

  function handleAction(action, target) {
    switch (action) {
      case 'addRecipient': {
        const emailEl = document.getElementById('add-email');
        const email2El = document.getElementById('add-email2');
        const nameEl = document.getElementById('add-name');
        if (addRecipient(emailEl.value, nameEl.value, email2El.value)) {
          emailEl.value = '';
          email2El.value = '';
          nameEl.value = '';
          emailEl.focus();
        }
        break;
      }

      case 'deleteRecipient': {
        const id = target.dataset.id || target.closest('[data-id]')?.dataset.id;
        if (id) removeRecipient(id);
        break;
      }

      case 'downloadRowEml': {
        const id = target.dataset.id || target.closest('[data-id]')?.dataset.id;
        const r = recipients.find(r => r.id === id);
        if (r && r.email && r.name) {
          downloadSingleEml(r);
          showToast(`${r.name}.eml gedownload`, 'success');
        }
        break;
      }

      case 'downloadSelectedEml': {
        const selected = recipients.filter(r => r.selected && r.status !== 'sent' && r.email && r.name);
        if (selected.length === 0) return;
        downloadBulkEml(selected.map(r => r.id));
        break;
      }

      case 'downloadAllEml': {
        const pending = recipients.filter(r => r.status !== 'sent' && r.email && r.name);
        if (pending.length === 0) return;
        downloadBulkEml(pending.map(r => r.id));
        break;
      }

      case 'copyHtml':
        copyEmailHtml();
        break;

      case 'exportCsv':
        exportCSV();
        break;

      case 'sendSelected': {
        const selected = recipients.filter(r => r.selected && r.status !== 'sent');
        if (selected.length === 0) return;
        showConfirm(
          'E-mails verzenden',
          `${selected.length} e-mail${selected.length !== 1 ? 's' : ''} verzenden naar de geselecteerde ontvangers?`,
          () => sendBulk(selected.map(r => r.id))
        );
        break;
      }

      case 'sendAll': {
        const pending = recipients.filter(r => r.status !== 'sent');
        if (pending.length === 0) return;
        showConfirm(
          'Alle e-mails verzenden',
          `${pending.length} e-mail${pending.length !== 1 ? 's' : ''} verzenden naar alle ontvangers?`,
          () => sendBulk(pending.map(r => r.id))
        );
        break;
      }

      case 'proceedConfirm':
        if (pendingConfirmAction) pendingConfirmAction();
        hideConfirm();
        break;

      case 'cancelConfirm':
        hideConfirm();
        break;

      case 'toggleAdminMode':
        if (adminUnlocked) {
          setAdminMode(false);
          showToast('Admin-modus vergrendeld', 'info');
        } else {
          const pass = prompt('Voer het admin-wachtwoord in:');
          if (pass !== null) {
            checkAdminPassphrase(pass).then(ok => {
              if (ok) {
                setAdminMode(true);
                showToast('Admin-modus ontgrendeld', 'success');
              } else {
                showToast('Onjuist wachtwoord', 'error');
              }
            });
          }
        }
        break;

      case 'resetAll':
        if (!adminUnlocked) { showToast('Ontgrendel admin-modus eerst', 'error'); break; }
        showConfirm(
          'Lijst resetten',
          'Alle e-mailadressen en namen worden gewist. De toegangscodes blijven behouden. Weet u het zeker?',
          () => clearAllRecipients()
        );
        break;

      case 'registerCodes': {
        if (!adminUnlocked) { showToast('Ontgrendel admin-modus eerst', 'error'); break; }
        const unregistered = recipients.filter(r => r.codeRegistered !== true).length;
        if (unregistered === 0) {
          showToast('Alle codes zijn al geregistreerd \u2713', 'success');
        } else {
          showConfirm(
            'Codes registreren',
            `${unregistered} van ${recipients.length} codes zijn nog niet geregistreerd in de backend. Nu registreren? (al geregistreerde codes blijven ongewijzigd)`,
            () => registerAllCodes()
          );
        }
        break;
      }

      case 'reshuffleCodes':
        if (!adminUnlocked) { showToast('Ontgrendel admin-modus eerst', 'error'); break; }
        showConfirm(
          'Alle codes herschudden',
          `Let op: alle ${recipients.length} ontvangers krijgen een NIEUWE code. De oude codes in de backend worden niet verwijderd (handmatig opruimen). Doorgaan?`,
          () => reshuffleAllCodes()
        );
        break;

      case 'verifyCodes':
        showConfirm(
          'Codes verifi\u00EBren',
          `Alle ${recipients.length} codes worden gecontroleerd tegen de backend. Dit wijzigt niets \u2014 alleen de status wordt bijgewerkt. Doorgaan?`,
          () => verifyAllCodes()
        );
        break;

      case 'toggleSection': {
        const targetId = target.closest('[data-target]')?.dataset.target;
        if (!targetId) return;
        const body = document.getElementById(targetId);
        const header = target.closest('.ea-card-header');
        if (body) body.classList.toggle('collapsed');
        if (header) header.classList.toggle('collapsed');
        break;
      }

      case 'loadPreset': {
        const presetKey = target.dataset.preset;
        if (presetKey) loadTemplatePreset(presetKey);
        break;
      }


      default:
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Initialization
  // ---------------------------------------------------------------------------

  function init() {
    // Load persisted state
    recipients = loadRecipients();
    settings = loadSettings();

    // Strip legacy isExample rows from older localStorage data
    const hadExamples = recipients.some(r => r.isExample);
    if (hadExamples) {
      recipients = recipients.filter(r => !r.isExample);
      saveRecipients();
    }

    // Sync settings to UI
    syncSettingsToUI();

    // Initial render
    renderTable();
    updateCounts();
    updatePreview();

    // Event delegation for data-action buttons
    document.addEventListener('click', function (e) {
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        e.preventDefault();
        handleAction(actionEl.dataset.action, actionEl);
      }
    });

    // Row checkbox changes
    document.addEventListener('change', function (e) {
      if (e.target.classList.contains('row-check')) {
        const id = e.target.dataset.id;
        const r = recipients.find(r => r.id === id);
        if (r) {
          r.selected = e.target.checked;
          saveRecipients();
          updateCounts();
        }
      }

      if (e.target.id === 'selectAll') {
        const checked = e.target.checked;
        recipients.forEach(r => { r.selected = checked; });
        saveRecipients();
        renderTable();
        updateCounts();
        // Re-check the selectAll after render
        const sa = document.getElementById('selectAll');
        if (sa) sa.checked = checked;
      }
    });

    // Settings debounced save + preview update (covers all .ea-grid containers)
    let settingsTimer;
    const settingsContainers = document.querySelectorAll('.ea-grid');
    for (const container of settingsContainers) {
      container.addEventListener('input', function () {
        clearTimeout(settingsTimer);
        settingsTimer = setTimeout(() => {
          syncSettingsFromUI();
          updatePreview();
        }, 400);
      });
    }

    // CSV import
    const csvInput = document.getElementById('csvImport');
    if (csvInput) {
      csvInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
          handleCSVImport(this.files[0]);
          this.value = ''; // Reset so same file can be imported again
        }
      });
    }

    // Enter key in add form
    const addForm = document.querySelector('.ea-add-form');
    if (addForm) {
      addForm.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAction('addRecipient', e.target);
        }
      });
    }

    // Escape to close modal
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') hideConfirm();
    });

    // Close modal on backdrop click
    const modal = document.getElementById('confirmModal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) hideConfirm();
      });
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();
