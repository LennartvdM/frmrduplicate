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
    RECIPIENTS: 'cttt_email_recipients',
    SETTINGS: 'cttt_email_settings'
  };

  const GAS_URL = 'https://script.google.com/macros/s/AKfycbw3gcRqlbc9lH0WKiR5yEeM4whu_WFVAUg9lE8cf9Uyf6C-teYRfA5CQX2tCaZZiV-nlg/exec';
  const PROXY_URL = '/api/';

  const DEFAULT_SETTINGS = {
    subject: 'Monitoring Cultureel Talent naar de Top 2026',
    surveyUrl: 'https://monitorcultuur.nl/',
    previewUrl: 'https://monitorcultuur.nl/inkijkexemplaar',
    deadline: '',
    senderName: 'Commissie Monitoring Talent naar de Top',
    contactPerson: '',
    contactEmail: '',
    ccRecipients: '',
    bccRecipients: '',
    headerImageUrl: 'https://monitorcultuur.nl/images/email-header.png',
    // Editable mail text fields
    heading: 'Monitoring 2026',
    introText: 'Beste {naam}, de vragenlijst voor de Monitoring Cultureel Talent naar de Top 2026 staat voor u klaar. We hebben het formulier zo compact mogelijk gehouden — reken op 20 tot 30 minuten.',
    codeLabel: 'Uw toegangscode',
    ctaText: 'Vragenlijst openen',
    deadlineText: 'Graag invullen vóór {deadline}',
    previewLinkText: 'Liever eerst even doorkijken? Bekijk het inkijkexemplaar',
    praktischHeading: 'Goed om te weten',
    checklistItems: 'U kunt tussendoor stoppen en later verdergaan\nU kunt meerdere keren verzenden — de laatste versie telt\nHoud uw personeelscijfers bij de hand, dat scheelt zoektijd',
    privacyText: 'Uw voortgang wordt lokaal in uw browser opgeslagen en is gekoppeld aan uw apparaat, niet aan uw code. Op een ander apparaat begint u opnieuw.',
    contactText: 'Loopt u ergens tegenaan? {contactPerson} helpt u graag verder via {contactEmail}.',
    closingText: 'Met vriendelijke groet,',
    footerText: 'U ontvangt dit bericht omdat {naam} deelneemt aan de Monitoring Cultureel Talent naar de Top 2026.',
    // Attachments (embedded into the .eml at download time)
    attachVragenlijst: false,
    attachBlancoVragenlijst: false,
    attachHandleiding: false
  };

  const SEND_DELAY_MS = 1500; // Delay between consecutive sends to avoid rate-limiting

  // Seed row for the preview/demo only. Real access codes are generated
  // just-in-time when an .eml is downloaded, so the sheet only knows about
  // codes that actually correspond to an invitation that went out.
  const DEFAULT_CODES = [
    { code: 'YAW-PG7', name: 'Voorbeeldorganisatie', isExample: true }
  ];

  // Uppercase alphanumerics minus ambiguous glyphs (0/O, 1/I/L, 5/S).
  const CODE_CHARS = 'ABCDEFGHJKMNPQRTUVWXYZ23456789';

  function generateCode() {
    const existing = new Set(recipients.map(r => r.code).filter(Boolean));
    for (let attempt = 0; attempt < 100; attempt++) {
      let code = '';
      for (let i = 0; i < 3; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
      code += '-';
      for (let i = 0; i < 3; i++) code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
      if (!existing.has(code)) return code;
    }
    // 30^6 ≈ 729M combinations — this fallback should never fire in practice.
    return 'X' + Date.now().toString(36).slice(-5).toUpperCase();
  }

  // ---------------------------------------------------------------------------
  // State
  // ---------------------------------------------------------------------------

  let recipients = [];
  let settings = { ...DEFAULT_SETTINGS };
  let sendingInProgress = false;
  let pendingConfirmAction = null;
  let cachedHeaderImage = null;  // { base64, mimeType } for CID embedding in .eml
  let cachedHeaderImageUrl = null; // URL that was fetched
  // Attachment cache: { [url]: { base64, mimeType, filename } }
  const attachmentCache = {};
  const ATTACHMENT_SOURCES = {
    vragenlijst: { url: '/attachments/vragenlijst.pdf', filename: 'vragenlijst.pdf', mimeType: 'application/pdf' },
    blancoVragenlijst: { url: '/attachments/blanco-vragenlijst.pdf', filename: 'blanco-vragenlijst.pdf', mimeType: 'application/pdf' },
    handleiding: { url: '/attachments/handleiding.pdf', filename: 'handleiding.pdf', mimeType: 'application/pdf' }
  };

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

  function loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? { ...DEFAULT_SETTINGS, ...JSON.parse(data) } : { ...DEFAULT_SETTINGS };
    } catch { return { ...DEFAULT_SETTINGS }; }
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
  // Email HTML — delegates to shared window.EmailTemplate
  // ---------------------------------------------------------------------------

  function generateEmailHtml(recipient) {
    return window.EmailTemplate.buildEmailHtml(recipient, settings);
  }

  // ---------------------------------------------------------------------------
  // Recipient Management
  // ---------------------------------------------------------------------------

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  }

  function addRecipient(email, name) {
    email = (email || '').trim();
    name = (name || '').trim();

    if (!email) {
      showToast('Vul een e-mailadres in', 'error');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast('Ongeldig e-mailadres', 'error');
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

    // New row — code is generated when the .eml is actually downloaded.
    recipients.push({
      id: generateId(),
      email,
      name,
      code: '',
      status: 'pending',
      selected: false,
      error: null,
      isExample: false
    });

    saveRecipients();
    renderTable();
    updateCounts();
    updatePreview();
    return true;
  }

  function clearRecipientFields(id) {
    const r = recipients.find(r => r.id === id);
    if (!r) return;
    if (r.isExample) return; // demo row is protected
    recipients = recipients.filter(other => other.id !== id);
    saveRecipients();
    renderTable();
    updateCounts();
    updatePreview();
  }

  function clearAllRecipients() {
    recipients = [];
    saveRecipients();
    ensureDefaultCodes();
    renderTable();
    updateCounts();
    updatePreview();
    showToast('Lijst gereset \u2014 alle ontvangers verwijderd', 'info');
  }

  // ---------------------------------------------------------------------------
  // CSV Import / Export
  // ---------------------------------------------------------------------------

  function parseCSV(text) {
    const lines = text.split(/\r?\n/).filter(line => line.trim());
    const results = [];
    let skippedHeader = false;

    for (const line of lines) {
      // Split by comma, semicolon, or tab
      const parts = line.split(/[,;\t]/).map(p => p.trim().replace(/^["']|["']$/g, ''));

      if (parts.length < 2) continue;

      // Try to detect header row
      if (!skippedHeader) {
        const firstLower = parts[0].toLowerCase();
        if (firstLower === 'email' || firstLower === 'e-mail' || firstLower === 'e-mailadres' || firstLower === 'emailadres') {
          skippedHeader = true;
          continue;
        }
        skippedHeader = true;
      }

      // Expect: email, name, [code]. Code is optional; it'll be generated
      // at .eml-download time if absent.
      const email = parts[0];
      const name = parts[1];
      const code = parts[2] || '';

      if (email && name) {
        results.push({ email, name, code });
      }
    }

    return results;
  }

  function handleCSVImport(file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const parsed = parseCSV(e.target.result);
      if (parsed.length === 0) {
        showToast('Geen geldige rijen gevonden. Verwacht: email, naam (code optioneel)', 'error');
        return;
      }

      let added = 0;
      let updated = 0;
      let skipped = 0;
      for (const row of parsed) {
        const codeUpper = (row.code || '').trim().toUpperCase();

        // If a recipient already exists with the same code, refresh its
        // email/name in place.
        if (codeUpper) {
          const existingByCode = recipients.find(r => r.code === codeUpper && !r.isExample);
          if (existingByCode) {
            existingByCode.email = row.email.trim();
            existingByCode.name = row.name.trim() || existingByCode.name;
            updated++;
            continue;
          }
        }

        // Skip exact-duplicate emails (already in the list).
        const isDuplicate = row.email && recipients.some(r => r.email && r.email.toLowerCase() === row.email.toLowerCase());
        if (isDuplicate) {
          skipped++;
          continue;
        }

        recipients.push({
          id: generateId(),
          email: row.email.trim(),
          name: row.name.trim(),
          code: codeUpper, // may be '' — code is generated at .eml-download time
          status: 'pending',
          selected: false,
          error: null,
          isExample: false
        });
        added++;
      }

      saveRecipients();
      renderTable();
      updateCounts();
      updatePreview();

      const parts = [];
      if (added > 0) parts.push(`${added} ontvanger${added !== 1 ? 's' : ''} toegevoegd`);
      if (updated > 0) parts.push(`${updated} bestaande code${updated !== 1 ? 's' : ''} bijgewerkt`);
      if (skipped > 0) parts.push(`${skipped} duplica${skipped !== 1 ? 'ten' : 'at'} overgeslagen`);
      showToast(parts.join(', ') || 'Geen wijzigingen', parts.length > 0 ? 'success' : 'info');
    };
    reader.readAsText(file);
  }

  function exportCSV() {
    if (recipients.length === 0) {
      showToast('Geen ontvangers om te exporteren', 'error');
      return;
    }

    const header = 'email,naam,code,status';
    const rows = recipients.map(r =>
      `"${r.email}","${r.name}","${r.code}","${r.status}"`
    );
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
    const params = new URLSearchParams({
      action: 'sendEmail',
      to: recipient.email,
      naam: recipient.name,
      code: recipient.code,
      subject: settings.subject,
      surveyUrl: settings.surveyUrl
        ? settings.surveyUrl + (settings.surveyUrl.includes('?') ? '&' : '?') + 'code=' + encodeURIComponent(recipient.code)
        : '',
      previewUrl: settings.previewUrl || '',
      deadline: settings.deadline || '',
      contactPerson: settings.contactPerson || '',
      contactEmail: settings.contactEmail || '',
      senderName: settings.senderName || '',
      heading: settings.heading || DEFAULT_SETTINGS.heading,
      introText: settings.introText || DEFAULT_SETTINGS.introText,
      codeLabel: settings.codeLabel || DEFAULT_SETTINGS.codeLabel,
      ctaText: settings.ctaText || DEFAULT_SETTINGS.ctaText,
      deadlineText: settings.deadlineText !== undefined ? settings.deadlineText : DEFAULT_SETTINGS.deadlineText,
      previewLinkText: settings.previewLinkText || DEFAULT_SETTINGS.previewLinkText,
      praktischHeading: settings.praktischHeading || DEFAULT_SETTINGS.praktischHeading,
      checklistItems: settings.checklistItems || DEFAULT_SETTINGS.checklistItems,
      privacyText: settings.privacyText || DEFAULT_SETTINGS.privacyText,
      contactText: settings.contactText || DEFAULT_SETTINGS.contactText,
      closingText: settings.closingText || DEFAULT_SETTINGS.closingText,
      footerText: settings.footerText || DEFAULT_SETTINGS.footerText
    });

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

    const toSend = recipients.filter(r => recipientIds.includes(r.id) && r.status !== 'sent' && !r.isExample && r.email && r.name);
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
  // Header image cache for .eml CID embedding
  // ---------------------------------------------------------------------------

  async function fetchAndCacheHeaderImage() {
    const url = settings.headerImageUrl;
    if (url === cachedHeaderImageUrl) return; // already fetched this URL
    cachedHeaderImageUrl = url;
    if (!url || !window.EmailTemplate.fetchHeaderImage) {
      cachedHeaderImage = null;
      return;
    }
    cachedHeaderImage = await window.EmailTemplate.fetchHeaderImage(url);
  }

  /**
   * Fetch a PDF attachment from the site and cache its base64 encoding.
   * The .eml can then embed it inline without a second network round-trip
   * per recipient.
   */
  async function fetchAttachment(source) {
    if (!source || !source.url) return null;
    if (attachmentCache[source.url]) return attachmentCache[source.url];
    try {
      const response = await fetch(source.url);
      if (!response.ok) return null;
      const buffer = await response.arrayBuffer();
      const uint8 = new Uint8Array(buffer);
      let binary = '';
      // Build base64 in chunks to avoid hitting call-stack limits on large files.
      const chunk = 0x8000;
      for (let i = 0; i < uint8.length; i += chunk) {
        binary += String.fromCharCode.apply(null, uint8.subarray(i, i + chunk));
      }
      const entry = {
        base64: btoa(binary),
        mimeType: source.mimeType || 'application/octet-stream',
        filename: source.filename || 'attachment.bin'
      };
      attachmentCache[source.url] = entry;
      return entry;
    } catch (e) {
      console.warn('[EmailCMS] Attachment fetch failed:', source.url, e);
      return null;
    }
  }

  async function getActiveAttachments() {
    const out = [];
    if (settings.attachVragenlijst) {
      const a = await fetchAttachment(ATTACHMENT_SOURCES.vragenlijst);
      if (a) out.push(a);
    }
    if (settings.attachBlancoVragenlijst) {
      const a = await fetchAttachment(ATTACHMENT_SOURCES.blancoVragenlijst);
      if (a) out.push(a);
    }
    if (settings.attachHandleiding) {
      const a = await fetchAttachment(ATTACHMENT_SOURCES.handleiding);
      if (a) out.push(a);
    }
    return out;
  }

  function getEmlSettings(attachments) {
    const extra = {};
    if (cachedHeaderImage) extra.headerImageData = cachedHeaderImage;
    if (attachments && attachments.length) extra.attachments = attachments;
    return (cachedHeaderImage || (attachments && attachments.length))
      ? Object.assign({}, settings, extra)
      : settings;
  }

  // ---------------------------------------------------------------------------
  // .eml Download (manual send via Outlook)
  // ---------------------------------------------------------------------------

  async function downloadSingleEml(recipient) {
    // Ensure latest settings are captured
    syncSettingsFromUI();

    // JIT code generation: the sheet should only know about codes that have
    // actually been handed to an invitee. Generate on first .eml download.
    if (!recipient.isExample && !recipient.code) {
      recipient.code = generateCode();
      saveRecipients();
    }

    const attachments = await getActiveAttachments();
    const emlContent = window.EmailTemplate.buildEml(recipient, getEmlSettings(attachments));
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

    // Tie code creation to EML generation: only codes for which an .eml was
    // actually produced end up in the sheet. Prevents drift between sent
    // invitations and valid codes.
    registerCodeInSheet(recipient);
  }

  /**
   * Fire-and-forget: append this recipient's code to the sheet so it becomes
   * a valid login. Called from downloadSingleEml (which bulk download also
   * funnels through). Never blocks the download.
   */
  function registerCodeInSheet(recipient) {
    try {
      if (!recipient || !recipient.code || recipient.isExample) return;
      const url = PROXY_URL + '?action=registerCode'
        + '&code=' + encodeURIComponent(recipient.code)
        + '&orgName=' + encodeURIComponent(recipient.name || '')
        + '&email=' + encodeURIComponent(recipient.email || '')
        + '&createdAt=' + encodeURIComponent(new Date().toISOString());
      fetch(url, { method: 'GET', keepalive: true, cache: 'no-store' }).catch(function() {});
    } catch (e) { /* never block the EML download */ }
  }

  async function downloadBulkEml(recipientIds) {
    const toDownload = recipients.filter(r =>
      recipientIds.includes(r.id) && !r.isExample && r.email && r.name && r.status !== 'sent'
    );

    if (toDownload.length === 0) {
      showToast('Geen ontvangers om te downloaden', 'error');
      return;
    }

    // Download one by one with a short delay so the browser doesn't block them
    for (let i = 0; i < toDownload.length; i++) {
      await downloadSingleEml(toDownload[i]);
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
      if (r.isExample) {
        return `
      <tr data-id="${r.id}" class="ea-row-example">
        <td></td>
        <td class="ea-cell-email ea-cell-muted">voorbeeld@organisatie.nl</td>
        <td class="ea-cell-name ea-cell-muted">${esc(r.name)}</td>
        <td class="ea-cell-code">${esc(r.code)}</td>
        <td>${renderStatus(r)}</td>
        <td></td>
      </tr>`;
      }

      const isComplete = r.email && r.name;
      const rowClass = isComplete ? '' : 'ea-row-incomplete';

      return `
      <tr data-id="${r.id}" class="${rowClass}">
        <td><input type="checkbox" class="row-check" data-id="${r.id}" ${r.selected ? 'checked' : ''} ${!isComplete ? 'disabled' : ''}></td>
        <td class="ea-cell-email"><input type="text" inputmode="email" class="ea-inline-input" data-id="${r.id}" data-field="email" placeholder="E-mailadres" value="${esc(r.email)}" autocomplete="one-time-code" name="rcpt-email-${r.id}"></td>
        <td class="ea-cell-name"><input type="text" class="ea-inline-input" data-id="${r.id}" data-field="name" placeholder="Naam organisatie" value="${esc(r.name)}" autocomplete="one-time-code" name="rcpt-name-${r.id}"></td>
        <td class="ea-cell-code">${r.code ? esc(r.code) : '<span class="ea-cell-code-pending" title="Code wordt aangemaakt bij .eml-download">\u2014</span>'}</td>
        <td>${renderStatus(r)}</td>
        <td class="ea-cell-actions">
          <button class="ea-btn ea-btn-primary ea-btn-xs ea-btn-row-add ${isComplete ? 'ea-btn-row-added' : ''}" data-action="addRowRecipient" data-id="${r.id}" ${isComplete ? 'disabled' : ''}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
            ${isComplete ? 'Toegevoegd' : 'Toevoegen'}
          </button>
          ${isComplete ? `<button class="ea-btn-icon" data-action="downloadRowEml" data-id="${r.id}" title="Download .eml voor Outlook">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M14 10v2.667A1.333 1.333 0 0 1 12.667 14H3.333A1.334 1.334 0 0 1 2 12.667V10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M4.667 6.667 8 10l3.333-3.333" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 10V2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>` : ''}
          <button class="ea-btn-delete" data-action="deleteRecipient" data-id="${r.id}" title="Wissen">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 14h12M9.354 2.354a1 1 0 0 1 1.414 0l2.878 2.878a1 1 0 0 1 0 1.414L6.5 13.793 2.207 9.5l7.147-7.146Z" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/><path d="M8 3.707l4.293 4.293" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>
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
    if (r.isExample) {
      return '<span class="ea-status ea-status-example">Voorbeeld</span>';
    }
    if (!r.email || !r.name) {
      return '<span class="ea-status ea-status-incomplete">Onvolledig</span>';
    }
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
    const sendable = recipients.filter(r => !r.isExample && r.email && r.name);
    const selected = sendable.filter(r => r.selected);
    const pendingSel = selected.filter(r => r.status !== 'sent');
    const allPending = sendable.filter(r => r.status !== 'sent');

    const countEl = document.getElementById('recipientCount');
    const selCountEl = document.getElementById('selectedCount');
    const totalPendingEl = document.getElementById('totalPendingCount');
    const btn1 = document.getElementById('btnSendSelected');
    const btn2 = document.getElementById('btnSendAll');

    if (countEl) countEl.textContent = recipients.filter(r => !r.isExample).length;
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
    'subject', 'surveyUrl', 'previewUrl', 'deadline', 'senderName', 'contactPerson', 'contactEmail',
    'ccRecipients', 'bccRecipients',
    'headerImageUrl', 'heading', 'introText', 'codeLabel', 'ctaText', 'deadlineText', 'previewLinkText',
    'praktischHeading', 'checklistItems', 'privacyText', 'contactText', 'closingText', 'footerText'
  ];

  // Boolean checkbox fields — synced separately because `el.checked` has a
  // different contract from `el.value`.
  const ALL_SETTING_BOOL_FIELDS = [
    'attachVragenlijst', 'attachBlancoVragenlijst', 'attachHandleiding'
  ];

  function syncSettingsFromUI() {
    for (const field of ALL_SETTING_FIELDS) {
      const el = document.getElementById('setting-' + field);
      if (el) settings[field] = el.value;
    }
    for (const field of ALL_SETTING_BOOL_FIELDS) {
      const el = document.getElementById('setting-' + field);
      if (el) settings[field] = !!el.checked;
    }
    saveSettings();
  }

  function syncSettingsToUI() {
    for (const field of ALL_SETTING_FIELDS) {
      const el = document.getElementById('setting-' + field);
      if (el) el.value = settings[field] || '';
    }
    for (const field of ALL_SETTING_BOOL_FIELDS) {
      const el = document.getElementById('setting-' + field);
      if (el) el.checked = !!settings[field];
    }
  }

  function loadTemplatePreset(presetKey) {
    const presets = window.EmailTemplate && window.EmailTemplate.TEMPLATE_PRESETS;
    if (!presets || !presets[presetKey]) return;

    const preset = presets[presetKey].defaults;
    // Only overwrite text fields, preserve connection settings (URLs, deadline, contact, sender)
    const textFields = [
      'subject', 'heading', 'introText', 'codeLabel', 'ctaText', 'deadlineText', 'previewLinkText',
      'praktischHeading', 'checklistItems', 'privacyText', 'contactText', 'closingText', 'footerText'
    ];
    for (const field of textFields) {
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
        const nameEl = document.getElementById('add-name');
        if (addRecipient(emailEl.value, nameEl.value)) {
          emailEl.value = '';
          nameEl.value = '';
          emailEl.focus();
        }
        break;
      }

      case 'addRowRecipient': {
        const id = target.dataset.id || target.closest('[data-id]')?.dataset.id;
        if (id) {
          const r = recipients.find(r => r.id === id);
          if (!r) break;
          // Read current inline input values from the DOM
          const row = document.querySelector(`tr[data-id="${id}"]`);
          if (row) {
            const emailInput = row.querySelector('[data-field="email"]');
            const nameInput = row.querySelector('[data-field="name"]');
            if (emailInput) r.email = emailInput.value.trim();
            if (nameInput) r.name = nameInput.value.trim();
          }
          if (!r.email) {
            showToast('Vul een e-mailadres in', 'error');
            break;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(r.email)) {
            showToast('Ongeldig e-mailadres', 'error');
            break;
          }
          if (!r.name) {
            showToast('Vul een naam in', 'error');
            break;
          }
          // Check for duplicate email (exclude self)
          if (recipients.some(other => other.id !== id && other.email && other.email.toLowerCase() === r.email.toLowerCase())) {
            showToast('Dit e-mailadres is al toegevoegd', 'error');
            break;
          }
          saveRecipients();
          renderTable();
          updateCounts();
          updatePreview();
          showToast(`${r.name} toegevoegd`, 'success');
        }
        break;
      }

      case 'deleteRecipient': {
        const id = target.dataset.id || target.closest('[data-id]')?.dataset.id;
        if (id) clearRecipientFields(id);
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
        const selected = recipients.filter(r => r.selected && r.status !== 'sent' && !r.isExample && r.email && r.name);
        if (selected.length === 0) return;
        downloadBulkEml(selected.map(r => r.id));
        break;
      }

      case 'downloadAllEml': {
        const pending = recipients.filter(r => r.status !== 'sent' && !r.isExample && r.email && r.name);
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

      case 'resetAll':
        showConfirm(
          'Lijst resetten',
          'Alle ontvangers worden uit de lijst verwijderd. Reeds gegenereerde codes blijven geldig in de sheet. Weet u het zeker?',
          () => clearAllRecipients()
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

  function ensureDefaultCodes() {
    // Guarantee the example/demo row is present (prepended). It never
    // participates in sending, it only seeds the preview.
    const hasExample = recipients.some(r => r.isExample);
    if (!hasExample) {
      const entry = DEFAULT_CODES[0];
      recipients.unshift({
        id: generateId(),
        email: '',
        name: entry.name || '',
        code: entry.code,
        status: 'pending',
        selected: false,
        error: null,
        isExample: true
      });
      saveRecipients();
    }
  }

  function migrateStaleSlots() {
    // Earlier versions of this tool pre-populated ~30 empty-slot rows
    // (no email/name, just a code reserved for later). That model is gone:
    // codes are generated at .eml-download time. Purge any leftover
    // pre-allocated rows so the sheet and this list can't drift apart.
    const before = recipients.length;
    recipients = recipients.filter(r => r.isExample || r.email || r.name);
    if (recipients.length !== before) saveRecipients();
  }

  function init() {
    // Load persisted state
    recipients = loadRecipients();
    settings = loadSettings();

    // One-time migration away from the pre-baked empty-slot model
    migrateStaleSlots();

    // Ensure the example/demo row is present
    ensureDefaultCodes();

    // Sync settings to UI
    syncSettingsToUI();

    // Pre-fetch header image for .eml embedding
    fetchAndCacheHeaderImage();

    // Pre-fetch any attachments the user has already toggled on, so the
    // first .eml download doesn't have to wait on a round-trip.
    if (settings.attachVragenlijst) fetchAttachment(ATTACHMENT_SOURCES.vragenlijst);
    if (settings.attachBlancoVragenlijst) fetchAttachment(ATTACHMENT_SOURCES.blancoVragenlijst);
    if (settings.attachHandleiding) fetchAttachment(ATTACHMENT_SOURCES.handleiding);

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

    // Inline edit handler for table email/name inputs
    let inlineTimer;
    document.addEventListener('input', function (e) {
      if (e.target.classList.contains('ea-inline-input')) {
        const id = e.target.dataset.id;
        const field = e.target.dataset.field;
        const r = recipients.find(r => r.id === id);
        if (r && (field === 'email' || field === 'name')) {
          r[field] = e.target.value.trim();
          clearTimeout(inlineTimer);
          inlineTimer = setTimeout(() => {
            saveRecipients();
            updateCounts();
            // Update the row class without full re-render (avoids losing focus)
            const row = e.target.closest('tr');
            if (row) {
              const isComplete = r.email && r.name;
              row.className = isComplete ? '' : 'ea-row-incomplete';
              // Update status cell
              const statusCell = row.querySelector('td:nth-child(5)');
              if (statusCell) statusCell.innerHTML = renderStatus(r);
              // Update checkbox disabled state
              const checkbox = row.querySelector('.row-check');
              if (checkbox) checkbox.disabled = !isComplete;
            }
          }, 300);
        }
      }
    });

    // Settings debounced save + preview update (covers all .ea-grid containers)
    let settingsTimer;
    const settingsContainers = document.querySelectorAll('.ea-grid');
    for (const container of settingsContainers) {
      const handler = function () {
        clearTimeout(settingsTimer);
        settingsTimer = setTimeout(() => {
          syncSettingsFromUI();
          updatePreview();
          fetchAndCacheHeaderImage();
          // Kick off attachment prefetch when a toggle flips on so the
          // first .eml download after the toggle is snappy.
          if (settings.attachVragenlijst) fetchAttachment(ATTACHMENT_SOURCES.vragenlijst);
          if (settings.attachBlancoVragenlijst) fetchAttachment(ATTACHMENT_SOURCES.blancoVragenlijst);
          if (settings.attachHandleiding) fetchAttachment(ATTACHMENT_SOURCES.handleiding);
        }, 400);
      };
      container.addEventListener('input', handler);
      container.addEventListener('change', handler);
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
