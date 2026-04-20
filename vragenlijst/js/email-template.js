/**
 * Shared Email Template Builder — Monitoring Cultureel Talent naar de Top 2026
 *
 * Exposes window.EmailTemplate with buildEmailHtml(), buildPlainText(), buildEml().
 * Used by both email-admin.js and email-manual.js.
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  function esc(str) {
    const el = document.createElement('span');
    el.textContent = str || '';
    return el.innerHTML;
  }

  /**
   * Build a magic link with the recipient's code and name attached. On arrival
   * the landing page auto-submits the login form and seeds the org name in
   * the sidebar, so the recipient skips the "type your code" step entirely.
   */
  function buildMagicLink(baseUrl, code, name) {
    const sep = baseUrl.includes('?') ? '&' : '?';
    let link = baseUrl + sep + 'code=' + encodeURIComponent(code);
    const trimmedName = (name || '').trim();
    if (trimmedName) {
      link += '&name=' + encodeURIComponent(trimmedName);
    }
    return link;
  }

  function replaceTextPlaceholders(text, vars) {
    return text
      .replace(/\{naam\}/g, vars.naam)
      .replace(/\{deadline\}/g, vars.deadline)
      .replace(/\{contactPerson\}/g, vars.contactPerson)
      .replace(/\{contactEmail\}/g, vars.contactEmail)
      .replace(/\{code\}/g, vars.code);
  }

  // ---------------------------------------------------------------------------
  // Default text fields
  // ---------------------------------------------------------------------------

  const DEFAULTS = {
    subject: 'Monitoring Cultureel Talent naar de Top 2026',
    senderName: 'Commissie Monitoring Talent naar de Top',
    heading: 'Monitoring 2026',
    introText: 'Beste {naam}, de vragenlijst voor de Monitoring Cultureel Talent naar de Top 2026 staat voor u klaar. We hebben het formulier zo compact mogelijk gehouden \u2014 reken op 20 tot 30 minuten.',
    codeLabel: 'Uw toegangscode',
    ctaText: 'Vragenlijst openen',
    deadlineText: 'Graag invullen v\u00f3\u00f3r {deadline}',
    previewLinkText: 'Liever eerst even doorkijken? Bekijk het inkijkexemplaar',
    praktischHeading: 'Goed om te weten',
    checklistItems: 'U kunt tussendoor stoppen en later verdergaan\nU kunt meerdere keren verzenden \u2014 de laatste versie telt\nHoud uw personeelscijfers bij de hand, dat scheelt zoektijd',
    privacyText: 'Uw voortgang wordt lokaal in uw browser opgeslagen en is gekoppeld aan uw apparaat, niet aan uw code. Op een ander apparaat begint u opnieuw.',
    contactText: 'Loopt u ergens tegenaan? {contactPerson} helpt u graag verder via {contactEmail}.',
    closingText: 'Met vriendelijke groet,',
    footerText: 'U ontvangt dit bericht omdat {naam} deelneemt aan de Monitoring Cultureel Talent naar de Top 2026.'
  };

  const RESET_DEFAULTS = {
    subject: 'Uw vragenlijst is gereset \u2014 Monitoring Cultureel Talent naar de Top 2026',
    senderName: 'Commissie Monitoring Talent naar de Top',
    heading: 'Uw vragenlijst is gereset',
    introText: 'Geachte {naam}, uw eerdere inzending voor de Monitoring Cultureel Talent naar de Top is gereset. U kunt de vragenlijst opnieuw invullen v\u00f3\u00f3r {deadline}.',
    codeLabel: 'Uw toegangscode',
    ctaText: 'Vragenlijst opnieuw invullen \u2192',
    deadlineText: 'Graag opnieuw invullen v\u00f3\u00f3r {deadline}',
    previewLinkText: 'Bekijk inkijkexemplaar \u2192',
    praktischHeading: 'Praktisch',
    checklistItems: 'Uw eerdere antwoorden zijn gewist, u begint met een schone lei\nDuurt 20\u201330 minuten, u kunt tussendoor stoppen\nU kunt meerdere keren verzenden, de laatste versie telt\nVoortgang gekoppeld aan uw apparaat, niet aan uw code',
    privacyText: 'Uw antwoorden worden lokaal in uw browser opgeslagen. Op een ander apparaat begint u opnieuw. Wist u uw browsergegevens, dan zijn conceptantwoorden weg.',
    contactText: 'Vragen? {contactPerson} via {contactEmail}',
    closingText: 'Met vriendelijke groet,',
    footerText: 'U ontvangt deze e-mail omdat de inzending van uw organisatie is gereset voor de Monitoring Cultureel Talent naar de Top 2026.'
  };

  const TEMPLATE_PRESETS = {
    uitnodiging: { label: 'Uitnodiging', defaults: DEFAULTS },
    reset: { label: 'Reset', defaults: RESET_DEFAULTS }
  };

  // ---------------------------------------------------------------------------
  // Brand colors
  // ---------------------------------------------------------------------------

  const C = {
    primary: '#111162',       // deep navy
    primaryLight: '#8caef4',  // periwinkle blue
    sand: '#e1e9f4',          // light blue-gray
    sandLight: '#f3ece2',     // body background (void)
    cream: '#fafbfc',         // card surface
    white: '#ffffff',
    text: '#1d1d30',          // dark navy text
    textLight: '#3c3c5d',     // medium navy text
    textMuted: '#7a7a96',     // muted blue-gray
    codeBg: '#f1f4f8',        // code box / info block background
    dotInactive: '#adbcd2'    // inactive progress dots
  };

  // ---------------------------------------------------------------------------
  // Build HTML email
  // ---------------------------------------------------------------------------

  /**
   * @param {Object} recipient  { name, code }
   * @param {Object} settings   Full settings object (subject, surveyUrl, previewUrl, deadline, senderName, contactPerson, contactEmail, heading, introText, ...)
   * @returns {string} Complete HTML email string
   */
  function buildEmailHtml(recipient, settings) {
    const s = settings || {};
    const naam = esc(recipient?.name || '[naam]');
    const rawCode = recipient?.code || 'ABC-DEF';
    const rawName = recipient?.name || '';
    const code = esc(rawCode);
    const deadline = esc(s.deadline || '[deadline]');
    const baseSurveyUrl = s.surveyUrl || 'https://monitorcultuur.nl/';
    const surveyUrl = esc(buildMagicLink(baseSurveyUrl, rawCode, rawName));
    const previewUrl = esc(s.previewUrl || 'https://monitorcultuur.nl/inkijkexemplaar');
    const contactPerson = esc(s.contactPerson || '[contactpersoon]');
    const contactEmail = esc(s.contactEmail || '[email]');
    const senderName = esc(s.senderName || DEFAULTS.senderName);
    const headerImageUrl = esc(s.headerImageUrl || '');

    const vars = { naam, deadline, contactPerson, contactEmail, code };

    const heading = esc(s.heading || DEFAULTS.heading);
    const introHtml = esc(replaceTextPlaceholders(s.introText || DEFAULTS.introText, vars));
    const codeLabel = esc(s.codeLabel || DEFAULTS.codeLabel);
    const ctaText = esc(s.ctaText || DEFAULTS.ctaText);
    const previewLinkText = esc(s.previewLinkText || DEFAULTS.previewLinkText);
    const praktischHeading = esc(s.praktischHeading || DEFAULTS.praktischHeading);
    const privacyText = esc(s.privacyText || DEFAULTS.privacyText);
    const closingText = esc(s.closingText || DEFAULTS.closingText);
    const footerText = esc(replaceTextPlaceholders(s.footerText || DEFAULTS.footerText, vars));

    // Build contact HTML with mailto link
    const contactRaw = s.contactText || DEFAULTS.contactText;
    const contactHtml = esc(replaceTextPlaceholders(contactRaw, vars))
      .replace(esc(contactEmail), `<a href="mailto:${contactEmail}" style="color:${C.primary}; font-weight:500; text-decoration:none;">${contactEmail}</a>`);

    // Build deadline notice (rendered between CTA and preview link).
    // The deadline value itself is bolded in primary color for emphasis.
    // Empty deadlineText (or empty deadline with no literal fallback) → row is skipped.
    const deadlineRaw = s.deadlineText !== undefined ? s.deadlineText : DEFAULTS.deadlineText;
    const deadlineNoticeHtml = deadlineRaw
      ? esc(replaceTextPlaceholders(deadlineRaw, vars))
          .replace(deadline, `<strong style="color:${C.primary}; font-weight:600;">${deadline}</strong>`)
      : '';

    // Build checklist rows
    const checklistRaw = s.checklistItems || DEFAULTS.checklistItems;
    const checklistLines = checklistRaw.split('\n').map(l => l.trim()).filter(Boolean);
    const checklistHtml = checklistLines.map((item, i) => {
      const padding = i === checklistLines.length - 1 ? '3px 28px 16px 46px' : '3px 28px 3px 46px';
      const rendered = esc(replaceTextPlaceholders(item, vars));
      return `<tr><td style="padding:${padding}; color:${C.textLight}; font-size:13px; line-height:1.6;"><span style="color:${C.primary}; font-weight:700; margin-left:-18px; margin-right:8px;">&#10003;</span>${rendered}</td></tr>`;
    }).join('\n                      ');

    return `<!DOCTYPE html>
<html lang="nl" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${esc(s.subject || DEFAULTS.subject)}</title>
  <!--[if mso]>
  <noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
  <![endif]-->
  <style>
    body, table, td { margin: 0; padding: 0; }
    body { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table { border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { border: 0; display: block; }
  </style>
</head>
<body style="margin:0; padding:0; background-color:${C.sandLight}; font-family: 'Inter', 'Segoe UI', Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${C.sandLight};">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        ${headerImageUrl ? `
        <!-- Header (PNG image) -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding:0; font-size:0; line-height:0;">
              <img src="${headerImageUrl}" width="600" alt="${heading} — ${senderName}" style="display:block; width:100%; max-width:600px; height:auto; border:0;" />
            </td>
          </tr>
        </table>
        <!-- Content card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:${C.cream}; border-radius:0 0 18px 18px; box-shadow: 0 8px 32px rgba(8,9,30,0.15), 0 2px 8px rgba(8,9,30,0.1);">
          <tr>
            <td style="padding-top:28px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        ` : `
        <!-- .container outline stroke -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; background-color:${C.cream}; border-radius:18px; box-shadow: 0 8px 32px rgba(8,9,30,0.15), 0 2px 8px rgba(8,9,30,0.1);">
          <tr>
            <td style="padding: 6px;">

              <!-- .container inner — sidebar + content -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-radius:12px; overflow:hidden;">
                <tr>

                  <!-- .index sidebar strip (decorative) -->
                  <td width="48" style="width:48px; background: linear-gradient(180deg, rgba(140,174,244,0.2) 0%, rgba(225,233,244,0.35) 100%); vertical-align:top; border-radius:12px 0 0 12px;">
                    &nbsp;
                  </td>

                  <!-- .content area -->
                  <td style="background-color:${C.cream}; vertical-align:top; border-radius:0 12px 12px 0;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">

                      <!-- Content header with progress dots -->
                      <tr>
                        <td style="padding: 20px 28px 0;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
                            <td style="font-size:0; line-height:0;">
                              <span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.primary};margin-right:4px;">&nbsp;</span><!--
                              --><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.dotInactive};margin-right:4px;">&nbsp;</span><!--
                              --><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.dotInactive};margin-right:4px;">&nbsp;</span><!--
                              --><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.dotInactive};margin-right:4px;">&nbsp;</span><!--
                              --><span style="display:inline-block;width:6px;height:6px;border-radius:50%;background:${C.dotInactive};">&nbsp;</span>
                            </td>
                          </tr></table>
                        </td>
                      </tr>

                      <!-- Step heading — h1 style -->
                      <tr>
                        <td style="padding: 20px 28px 12px;">
                          <h1 style="margin:0; color:${C.text}; font-family:'Inter','Segoe UI',Helvetica,Arial,sans-serif; font-size:24px; font-weight:600; line-height:1.3; letter-spacing:-0.3px;">
                            ${heading}
                          </h1>
                        </td>
                      </tr>
        `}

                      <!-- Subtitle -->
                      <tr>
                        <td style="padding: 0 28px 24px;">
                          <p style="margin:0; color:${C.textMuted}; font-size:15px; line-height:1.55; letter-spacing:0.01em;">
                            ${introHtml}
                          </p>
                        </td>
                      </tr>

                      <!-- Code box -->
                      <tr>
                        <td style="padding: 0 28px 24px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="border:2px solid ${C.primary}; border-radius:10px; background-color:${C.codeBg}; padding:20px; text-align:center; box-shadow:0 4px 16px rgba(17,17,98,0.15);">
                                <p style="margin:0 0 6px; color:${C.textMuted}; font-size:12px; font-weight:500; text-transform:uppercase; letter-spacing:1px;">${codeLabel}</p>
                                <p style="margin:0; color:${C.primary}; font-size:26px; font-weight:700; letter-spacing:5px; font-family:'SF Mono','Fira Code','Courier New',monospace;">${code}</p>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- CTA button -->
                      <tr>
                        <td style="padding: 0 28px ${deadlineNoticeHtml ? '10' : '16'}px;" align="center">
                          <!--[if mso]>
                          <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${surveyUrl}" style="height:42px;v-text-anchor:middle;width:220px;" arcsize="24%" strokecolor="${C.primary}" fillcolor="${C.primary}">
                            <w:anchorlock/>
                            <center style="color:#ffffff;font-family:'Inter','Segoe UI',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;">${ctaText}</center>
                          </v:roundrect>
                          <![endif]-->
                          <!--[if !mso]><!-->
                          <table role="presentation" cellpadding="0" cellspacing="0">
                            <tr>
                              <td bgcolor="${C.primary}" style="background-color:${C.primary}; background-image:linear-gradient(135deg, ${C.primaryLight} 0%, ${C.primary} 100%); border-radius:10px; box-shadow:0 4px 12px rgba(17,17,98,0.3); mso-padding-alt:0;">
                                <a href="${surveyUrl}" target="_blank" style="display:inline-block; padding:12px 28px; color:#ffffff; text-decoration:none; font-size:14px; font-weight:600; font-family:'Inter','Segoe UI',Helvetica,Arial,sans-serif;">${ctaText}</a>
                              </td>
                            </tr>
                          </table>
                          <!--<![endif]-->
                        </td>
                      </tr>
${deadlineNoticeHtml ? `
                      <!-- Deadline notice -->
                      <tr>
                        <td style="padding: 0 28px 18px;" align="center">
                          <p style="margin:0; color:${C.textLight}; font-size:13px; line-height:1.5; font-weight:500;">
                            ${deadlineNoticeHtml}
                          </p>
                        </td>
                      </tr>
` : ''}
                      <!-- Preview link -->
                      <tr>
                        <td style="padding: 0 28px 24px;" align="center">
                          <a href="${previewUrl}" target="_blank" style="color:${C.textLight}; font-size:12px; text-decoration:underline;">${previewLinkText}</a>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr><td style="padding:0 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${C.sand}; font-size:0;">&nbsp;</td></tr></table></td></tr>

                      <!-- Praktisch heading -->
                      <tr>
                        <td style="padding: 20px 28px 10px;">
                          <p style="margin:0; color:${C.text}; font-size:14px; font-weight:600;">${praktischHeading}</p>
                        </td>
                      </tr>

                      <!-- Checklist items -->
                      ${checklistHtml}

                      <!-- Privacy info block -->
                      <tr>
                        <td style="padding: 8px 28px 24px;">
                          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                            <tr>
                              <td style="background:linear-gradient(135deg, ${C.codeBg} 0%, ${C.sand} 100%); border-left:3px solid ${C.primary}; border-radius:0 8px 8px 0; padding:12px 16px; font-size:13px; color:${C.textLight}; line-height:1.6;">
                                ${privacyText}
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>

                      <!-- Contact -->
                      <tr>
                        <td style="padding: 0 28px 16px;">
                          <p style="margin:0; color:${C.textMuted}; font-size:12px; line-height:1.6;">
                            ${contactHtml}
                          </p>
                        </td>
                      </tr>

                      <!-- Divider -->
                      <tr><td style="padding:0 28px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td style="border-top:1px solid ${C.sand}; font-size:0;">&nbsp;</td></tr></table></td></tr>

                      <!-- Closing -->
                      <tr>
                        <td style="padding: 16px 28px 24px;">
                          <p style="margin:0 0 4px; color:${C.textLight}; font-size:13px; line-height:1.6;">${closingText}</p>
                          <p style="margin:0; color:${C.text}; font-size:13px; font-weight:600; line-height:1.6;">${senderName}</p>
                        </td>
                      </tr>

        ${headerImageUrl ? `
              </table>
            </td>
          </tr>
        </table>
        <!-- /.content card -->
        ` : `
                    </table>
                  </td>

                </tr>
              </table>
              <!-- /.container inner -->

            </td>
          </tr>
        </table>
        <!-- /.container outline stroke -->
        `}

        <!-- Footer outside card -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;">
          <tr>
            <td style="padding:16px 20px; text-align:center;">
              <p style="margin:0; color:${C.textMuted}; font-size:11px; line-height:1.5;">
                ${footerText}
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
  }

  // ---------------------------------------------------------------------------
  // Build plain-text email (for mailto: links)
  // ---------------------------------------------------------------------------

  /**
   * @param {Object} recipient  { name, code }
   * @param {Object} settings   Full settings object
   * @returns {string} Plain-text email body
   */
  function buildPlainText(recipient, settings) {
    const s = settings || {};
    const naam = recipient?.name || '[naam]';
    const rawCode = recipient?.code || 'ABC-DEF';
    const rawName = recipient?.name || '';
    const deadline = s.deadline || '[deadline]';
    const baseSurveyUrl = s.surveyUrl || 'https://monitorcultuur.nl/';
    const surveyUrl = buildMagicLink(baseSurveyUrl, rawCode, rawName);
    const previewUrl = s.previewUrl || '';
    const contactPerson = s.contactPerson || '[contactpersoon]';
    const contactEmail = s.contactEmail || '[email]';
    const senderName = s.senderName || DEFAULTS.senderName;

    const vars = { naam, deadline, contactPerson, contactEmail, code: rawCode };

    const introText = replaceTextPlaceholders(s.introText || DEFAULTS.introText, vars);
    const closingText = s.closingText || DEFAULTS.closingText;
    const deadlineRaw = s.deadlineText !== undefined ? s.deadlineText : DEFAULTS.deadlineText;
    const deadlineLine = deadlineRaw ? replaceTextPlaceholders(deadlineRaw, vars) : '';

    // Build checklist
    const checklistRaw = s.checklistItems || DEFAULTS.checklistItems;
    const checklistLines = checklistRaw.split('\n').map(l => l.trim()).filter(Boolean);
    const checklistText = checklistLines.map(item => '- ' + replaceTextPlaceholders(item, vars)).join('\n');

    // Build contact line
    const contactRaw = s.contactText || DEFAULTS.contactText;
    const contactLine = replaceTextPlaceholders(contactRaw, vars);

    let text = introText + '\n\n';
    text += (s.codeLabel || DEFAULTS.codeLabel) + ': ' + rawCode + '\n\n';
    if (surveyUrl) {
      text += 'Start de vragenlijst: ' + surveyUrl + '\n';
    }
    if (deadlineLine) {
      text += deadlineLine + '\n';
    }
    if (previewUrl) {
      text += 'Inkijkexemplaar: ' + previewUrl + '\n';
    }
    text += '\n';
    text += (s.praktischHeading || DEFAULTS.praktischHeading) + ':\n';
    text += checklistText + '\n\n';
    text += contactLine + '\n\n';
    text += closingText + '\n';
    text += senderName;

    return text;
  }

  // ---------------------------------------------------------------------------
  // Fetch header image for inline embedding
  // ---------------------------------------------------------------------------

  /**
   * Fetch an image URL and return its base64 data + MIME type for CID embedding.
   * @param {string} url  Image URL to fetch
   * @returns {Promise<{base64: string, mimeType: string}|null>}
   */
  async function fetchHeaderImage(url) {
    if (!url) return null;
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      const contentType = response.headers.get('content-type') || 'image/png';
      const mimeType = contentType.split(';')[0].trim();
      const arrayBuffer = await response.arrayBuffer();
      const uint8 = new Uint8Array(arrayBuffer);
      let binary = '';
      for (let i = 0; i < uint8.length; i++) {
        binary += String.fromCharCode(uint8[i]);
      }
      return { base64: btoa(binary), mimeType };
    } catch (e) {
      return null;
    }
  }

  /**
   * Wrap a base64 string at 76 characters per line (RFC 2045).
   */
  function wrapBase64(str) {
    let result = '';
    for (let i = 0; i < str.length; i += 76) {
      result += str.slice(i, i + 76) + '\r\n';
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // Build .eml file (RFC 2822 + MIME)
  // ---------------------------------------------------------------------------

  /**
   * Encode a UTF-8 string as RFC 2047 encoded-word for email headers.
   */
  function encodeRfc2047(str) {
    return '=?UTF-8?B?' + btoa(unescape(encodeURIComponent(str))) + '?=';
  }

  /**
   * Encode a UTF-8 string as quoted-printable (RFC 2045).
   * More compatible with email clients than base64 for HTML content —
   * ASCII passes through unchanged so links remain intact.
   */
  function encodeQuotedPrintable(str) {
    const utf8 = unescape(encodeURIComponent(str));
    let result = '';
    let lineLen = 0;

    for (let i = 0; i < utf8.length; i++) {
      const c = utf8.charCodeAt(i);

      // Hard line break: \r\n or lone \n → CRLF
      if (c === 0x0D && i + 1 < utf8.length && utf8.charCodeAt(i + 1) === 0x0A) {
        result += '\r\n';
        lineLen = 0;
        i++;
        continue;
      }
      if (c === 0x0A) {
        result += '\r\n';
        lineLen = 0;
        continue;
      }

      // Printable ASCII (33-126) except '=' passes through; tab and space too
      let encoded;
      if ((c >= 33 && c <= 126 && c !== 61) || c === 9 || c === 32) {
        encoded = String.fromCharCode(c);
      } else {
        encoded = '=' + c.toString(16).toUpperCase().padStart(2, '0');
      }

      // Soft line break at 75 chars (leave room for trailing =)
      if (lineLen + encoded.length >= 76) {
        result += '=\r\n';
        lineLen = 0;
      }

      result += encoded;
      lineLen += encoded.length;
    }

    return result;
  }

  /**
   * Format a Date object as RFC 2822 date string for email headers.
   */
  function formatRfc2822Date(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const pad = n => n < 10 ? '0' + n : '' + n;
    const offset = -date.getTimezoneOffset();
    const sign = offset >= 0 ? '+' : '-';
    const absOff = Math.abs(offset);
    const tz = sign + pad(Math.floor(absOff / 60)) + pad(absOff % 60);
    return days[date.getDay()] + ', ' + date.getDate() + ' ' + months[date.getMonth()] + ' ' +
      date.getFullYear() + ' ' + pad(date.getHours()) + ':' + pad(date.getMinutes()) + ':' +
      pad(date.getSeconds()) + ' ' + tz;
  }

  /**
   * Build a .eml file string that Outlook/Thunderbird/Apple Mail can open
   * as a ready-to-send draft with full HTML formatting.
   *
   * @param {Object} recipient  { name, email, email2, code }
   * @param {Object} settings   Full settings object. Optional:
   *                              headerImageData: { base64, mimeType }
   *                              attachments: [{ base64, mimeType, filename }]
   * @returns {string} Complete .eml file content
   */
  function buildEml(recipient, settings) {
    const s = settings || {};
    const subject = s.subject || DEFAULTS.subject;
    const toEmail = recipient?.email || '';
    const toName = recipient?.name || '';
    const senderName = s.senderName || DEFAULTS.senderName;
    const contactEmail = s.contactEmail || '';
    const headerImageData = s.headerImageData; // { base64, mimeType } from fetchHeaderImage
    const attachments = Array.isArray(s.attachments) ? s.attachments.filter(Boolean) : [];
    const hasAttachments = attachments.length > 0;

    // If we have pre-fetched image data, swap the URL for a CID reference in HTML
    const emlSettings = headerImageData
      ? Object.assign({}, s, { headerImageUrl: 'cid:header-image' })
      : s;

    const htmlBody = buildEmailHtml(recipient, emlSettings);
    const textBody = buildPlainText(recipient, s);

    const uid = Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
    const messageId = '<' + Date.now().toString(36) + '.' + Math.random().toString(36).slice(2, 10) + '@monitorcultuur.local>';

    // Format "To" with display name if available
    const toHeader = toName
      ? encodeRfc2047(toName) + ' <' + toEmail + '>'
      : toEmail;

    // Format "From" — use contact email if available, otherwise placeholder
    const fromEmail = contactEmail || 'noreply@monitorcultuur.local';
    const fromHeader = senderName
      ? encodeRfc2047(senderName) + ' <' + fromEmail + '>'
      : fromEmail;

    // CC / BCC — comma-separated email addresses from settings
    // Merge per-recipient secondary email (email2) into CC
    const ccParts = [];
    const recipientCc = (recipient?.email2 || '').trim();
    if (recipientCc) ccParts.push(recipientCc);
    const settingsCc = (s.ccRecipients || '').trim();
    if (settingsCc) ccParts.push(settingsCc);
    const ccRaw = ccParts.join(', ');
    const bccRaw = (s.bccRecipients || '').trim();

    // Build headers
    const headers = [
      'Date: ' + formatRfc2822Date(new Date()),
      'From: ' + fromHeader,
      'To: ' + toHeader,
    ];
    if (ccRaw) headers.push('Cc: ' + ccRaw);
    if (bccRaw) headers.push('Bcc: ' + bccRaw);
    headers.push(
      'Subject: ' + encodeRfc2047(subject),
      'Message-ID: ' + messageId,
      'MIME-Version: 1.0',
      'X-Unsent: 1'
    );

    // ── Build the inner body part (what lives "inside" attachments) ─────
    // Without attachments the .eml top-level Content-Type is whatever the
    // inner body turns out to be (alternative or related). With
    // attachments we wrap the inner body in a multipart/mixed envelope.

    const altBoundary = '----=_Alt_' + uid;
    const relBoundary = '----=_Rel_' + uid;
    const mixedBoundary = '----=_Mix_' + uid;

    const altPart = [
      '--' + altBoundary,
      'Content-Type: text/plain; charset="utf-8"',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      encodeQuotedPrintable(textBody),
      '',
      '--' + altBoundary,
      'Content-Type: text/html; charset="utf-8"',
      'Content-Transfer-Encoding: quoted-printable',
      '',
      encodeQuotedPrintable(htmlBody),
      '',
      '--' + altBoundary + '--'
    ].join('\r\n');

    let innerContentType;
    let innerBody;

    if (headerImageData) {
      const ext = headerImageData.mimeType === 'image/jpeg' ? 'jpg'
        : headerImageData.mimeType === 'image/gif' ? 'gif' : 'png';

      innerContentType = 'multipart/related; boundary="' + relBoundary + '"';
      innerBody = [
        '--' + relBoundary,
        'Content-Type: multipart/alternative; boundary="' + altBoundary + '"',
        '',
        altPart,
        '',
        '--' + relBoundary,
        'Content-Type: ' + headerImageData.mimeType,
        'Content-Transfer-Encoding: base64',
        'Content-ID: <header-image>',
        'Content-Disposition: inline; filename="email-header.' + ext + '"',
        '',
        wrapBase64(headerImageData.base64),
        '--' + relBoundary + '--'
      ].join('\r\n');
    } else {
      innerContentType = 'multipart/alternative; boundary="' + altBoundary + '"';
      innerBody = altPart;
    }

    let mimeBody;

    if (hasAttachments) {
      // multipart/mixed wraps the message body and all file attachments.
      headers.push('Content-Type: multipart/mixed; boundary="' + mixedBoundary + '"');

      const parts = [
        '',
        'This is a multi-part message in MIME format.',
        '',
        '--' + mixedBoundary,
        'Content-Type: ' + innerContentType,
        '',
        innerBody,
        ''
      ];

      for (const att of attachments) {
        const mime = att.mimeType || 'application/octet-stream';
        const filename = (att.filename || 'attachment').replace(/"/g, '');
        parts.push(
          '--' + mixedBoundary,
          'Content-Type: ' + mime + '; name="' + filename + '"',
          'Content-Transfer-Encoding: base64',
          'Content-Disposition: attachment; filename="' + filename + '"',
          '',
          wrapBase64(att.base64),
          ''
        );
      }

      parts.push('--' + mixedBoundary + '--', '');
      mimeBody = parts.join('\r\n');
    } else {
      headers.push('Content-Type: ' + innerContentType);
      mimeBody = '\r\n' +
        'This is a multi-part message in MIME format.\r\n' +
        '\r\n' +
        innerBody +
        '\r\n';
    }

    return headers.join('\r\n') + mimeBody;
  }

  // ---------------------------------------------------------------------------
  // Expose on window
  // ---------------------------------------------------------------------------

  window.EmailTemplate = {
    buildEmailHtml: buildEmailHtml,
    buildPlainText: buildPlainText,
    buildEml: buildEml,
    fetchHeaderImage: fetchHeaderImage,
    DEFAULTS: DEFAULTS,
    RESET_DEFAULTS: RESET_DEFAULTS,
    TEMPLATE_PRESETS: TEMPLATE_PRESETS
  };

})();
