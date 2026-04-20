# EML Builder — Migration Guide for Another Claude Instance

This folder is a self-contained copy of the EML email builder from the "Monitor Executive Search" survey tool. Your job is to adapt it for a different survey tool with a different data model. This guide tells you everything you need to know.

## File Map

```
eml-builder-reference/
├── js/
│   ├── email-template.js    ← THE CORE. All rendering + EML generation lives here.
│   ├── email-admin.js       ← Admin UI: bulk send via GAS backend, CSV import, code registration
│   └── email-manual.js      ← Manual UI: download .eml files, open as drafts in Outlook/Mail.app
├── css/
│   └── email-admin.css      ← Styles for both HTML pages (shared)
├── html-pages/
│   ├── email-admin.html     ← Admin panel page (loads email-template.js + email-admin.js)
│   └── email-manual.html    ← Manual sender page (loads email-template.js + email-manual.js)
├── scripts/
│   ├── gas-email-function.js      ← Google Apps Script server-side email sender
│   ├── generate-email-header-png.js  ← Node script to generate header banner PNG
│   └── generate-email-header.html    ← Browser tool to generate header banner PNG
├── data/
│   └── email-recipients-executive-search.csv  ← Sample recipient list
└── images/
    └── email-header.png     ← Pre-generated email header image (1200x184, 2x retina)
```

## Architecture (3 layers)

1. **`email-template.js`** — Pure rendering. Takes a `recipient` + `settings` object, outputs HTML string, plain text string, or complete `.eml` file. Exposes `window.EmailTemplate` with `buildEmailHtml()`, `buildPlainText()`, `buildEml()`. **This is the file you care about most.**

2. **`email-admin.js` / `email-manual.js`** — UI controllers. They manage recipient lists, CSV import/export, settings forms, and call into `window.EmailTemplate` for rendering. You probably want only ONE of these (manual is simpler, no backend needed).

3. **`gas-email-function.js`** — Server-side GAS equivalent. Duplicates the HTML template in Apps Script syntax for server-side sending via `MailApp.sendEmail()`. Only needed if you want server-side sending.

## Input Data Shape

### Recipient object
```js
{
  id: "lz3k8f2a",           // internal ID (Date.now base36 + random)
  email: "person@org.nl",   // primary recipient
  email2: "cc@org.nl",      // optional CC address (merged into CC header)
  name: "Organisation Name", // used in greeting + filename
  code: "ABC-DEF",          // survey access code (appended to survey URL as ?code=)
  status: "pending",        // "pending" | "sending" | "sent" | "error"
  selected: false,          // checkbox state for bulk ops
  error: null,              // error message if status=error
  codeRegistered: undefined // backend registration state (admin only)
}
```

### Settings object (~40 fields)
```js
{
  // Envelope
  subject: "Monitor Executive Search — Talent naar de Top",
  senderName: "Commissie Monitoring Talent naar de Top",
  contactEmail: "ellen.stoop@talentnaardetop.nl",  // also used as From in .eml
  ccRecipients: "",    // global CC (comma-separated)
  bccRecipients: "",   // global BCC

  // Content
  surveyUrl: "https://monitortalent.nl/",  // ?code={code} appended automatically
  deadline: "28 april",
  jaar: "2025",
  heading: "Monitor Executive Search",
  headerImageUrl: "https://monitortalent.nl/images/email-header.png",
  greeting: "Beste {naam}",        // supports placeholders
  bodyText: "Markdown-like text",   // supports **bold**, [link](url), \n\n for paragraphs
  ctaText: "Naar de vragenlijst",
  ctaNote: "",                      // italic note below CTA
  deadlineContactText: "...",
  section2Heading: "", section2Text: "",  // optional second section
  section3Heading: "", section3Text: "", section3ImageUrl: "",  // optional third section
  closingText: "",
  signer1Name: "", signer1Title: "",
  signer2Name: "", signer2Title: "",

  // Footer
  address: "Street\nCity",
  phone: "", website: "example.nl",
  contactPerson: "", contactPhone: "",
  socialTwitter: "", socialLinkedin: "", socialInstagram: "", socialYoutube: "",
  footerText: "U ontvangt deze e-mail omdat...",
  webVersionUrl: "", unsubscribeUrl: "", profileUrl: "", privacyUrl: ""
}
```

### Template placeholders
These are replaced in all text fields via `replaceTextPlaceholders()`:
`{naam}`, `{jaar}`, `{deadline}`, `{contactPerson}`, `{contactEmail}`, `{contactPhone}`, `{code}`, `{surveyUrl}`, `{inkijkUrl}`

## Output Formats

### `buildEmailHtml(recipient, settings)` → HTML string
Full `<!DOCTYPE html>` email. Can be previewed in an iframe, pasted into a mail client, or used as the HTML part of an EML.

### `buildPlainText(recipient, settings)` → plain text string
Strips markdown (`**bold**` → `bold`, `[text](url)` → `text (url)`). Used as the text/plain MIME alternative.

### `buildEml(recipient, settings)` → RFC 2822 .eml file content
Complete MIME message with:
- RFC 2047 encoded headers (UTF-8 subject/names)
- `X-Unsent: 1` header (opens as draft in Outlook/Thunderbird/Apple Mail)
- `multipart/alternative` with text/plain + text/html parts
- Quoted-Printable body encoding (76-char line wrapping)
- Unique Message-ID and boundary per file

## Email Rendering Quirks That Were Solved

### 1. Outlook VML header (the biggest pain)
Outlook doesn't support CSS `border-radius` or `linear-gradient`. The template has TWO header paths:
- **If `headerImageUrl` is set**: Uses a pre-rendered PNG image. This is the recommended approach — it looks identical everywhere.
- **If no image**: Uses VML (`v:shape` with `v:fill type="gradient"`) wrapped in `<!--[if mso]>` conditionals, with a CSS fallback in `<!--[if !mso]><!-->`

The VML path uses `v:shape` with a `path` attribute to draw rounded top corners and `v:fill type="gradient"` for the diagonal gradient. This was extremely painful to get right. **Recommendation: just use the PNG header image approach and skip VML entirely.**

### 2. Outlook VML CTA button
Same problem for the call-to-action button. Uses `v:roundrect` for Outlook, regular `<table>` button for everything else. Both are wrapped in conditional comments.

### 3. Outlook PNG transparency
Outlook doesn't render PNG transparency properly. The header image generator (`generate-email-header-png.js`) **bakes the background color (`#e1e9f4`)** into the PNG corners so the rounded corners are visible even without transparency support.

### 4. All inline CSS
No `<style>` block in the body (except a minimal reset). Everything is inline `style=""` attributes because Gmail strips `<style>` blocks. The only `<style>` block is in `<head>` for basic resets (`margin:0`, `border-collapse`, `-webkit-text-size-adjust`).

### 5. Tables all the way down
Layout is 100% `<table role="presentation">`. No `<div>` layout. Email width fixed at `600px` with `max-width:600px` for responsive scaling. Every section is a `<tr><td>` with inline padding.

### 6. Font stack
`'Inter', 'Segoe UI', Helvetica, Arial, sans-serif` — Inter won't load in most email clients, so Segoe UI (Windows) and Helvetica (Mac) are the real fonts. Inter is included for web preview.

### 7. Social links are text, not images
Social media links use plain text ("LinkedIn", "Instagram") instead of icon images. Icons require hosted images and break often. Text links are stacked vertically in `<tr>` rows for Outlook compatibility (inline-block doesn't work in Outlook).

### 8. Quoted-Printable encoding
The `encodeQuotedPrintable()` function handles UTF-8 properly: converts to raw UTF-8 bytes first via `unescape(encodeURIComponent(str))`, then encodes non-ASCII as `=XX` hex. Soft line breaks (`=\r\n`) inserted at 76-char boundary. `\n` is normalized to `\r\n` for RFC compliance.

### 9. RFC 2047 header encoding
Subject and sender name use Base64 RFC 2047 encoding (`=?UTF-8?B?...?=`) because they contain non-ASCII characters (Dutch: "ë", "—", etc.).

### 10. Markdown-like text formatting
`textToHtml()` supports a minimal subset: `**bold**` → `<strong>`, `[text](url)` → `<a>`, `\n\n` → new `<p>`, `\n` → `<br>`. HTML-escapes everything else first, then applies formatting. This is intentionally limited — full Markdown would be dangerous in email HTML.

## Hardcoded Assumptions to Watch For

1. **Survey URL pattern**: `surveyUrl + "?code=" + recipient.code`. If your app uses a different URL scheme, change `buildEmailHtml()` lines ~158-159 and `buildPlainText()` lines ~553-555.

2. **`inkijkUrl`**: Auto-derived as `surveyUrl.replace(/\/?$/, '/inkijkexemplaar')`. This is a "preview copy" URL specific to this survey. Remove or change this.

3. **Color palette `C`**: Hardcoded at line ~134. `primary: '#111162'`, `sand: '#e1e9f4'`, etc. Change these to match your brand.

4. **DEFAULTS and RESET_DEFAULTS objects**: Lines ~53-128 in `email-template.js`. All default text, contact info, addresses, social links. Replace entirely with your content.

5. **Template presets**: `TEMPLATE_PRESETS` at line ~125 has two presets: "uitnodiging" (invitation) and "reset" (password reset). Add/remove as needed.

6. **localStorage keys**: `esc_email_recipients` and `esc_email_settings`. The prefix `esc_` is for "Executive Search Code". Change if you want namespace isolation.

7. **Message-ID domain**: `@monitoringtalent.local` in `buildEml()` line ~696. Cosmetic but should match your domain.

8. **GAS URL**: `email-admin.js` line ~47 has hardcoded Google Apps Script URLs. Replace with your own.

9. **Code format**: `XXX-XXX` (3 chars, dash, 3 chars from `CODE_CHARS`). If your survey uses different codes, adjust `generateCode()` in `email-admin.js`.

10. **Dutch language**: All UI text, toasts, status labels, and default email content is in Dutch. Translate as needed.

11. **Admin passphrase hash**: `email-admin.js` line ~22 has a SHA-256 hash for admin mode. Set your own.

12. **`SETTINGS_VERSION`**: Both admin and manual JS files have `SETTINGS_VERSION = 8`. This is used to invalidate stale localStorage. Bump when you change settings shape.

## Recommended Integration Approach

### If you just need .eml file generation (simplest):
1. Copy `js/email-template.js` into your project
2. Replace the `DEFAULTS` object with your content
3. Replace the `C` color palette with your brand colors
4. Adjust `buildEmailHtml()` to match your URL scheme
5. Call `window.EmailTemplate.buildEml(recipient, settings)` → Blob → download

### If you need a full send/manage UI:
1. Start from `email-manual.html` + `email-manual.js` (simpler, no backend)
2. Adapt the HTML form fields in the settings panel to match your settings shape
3. Adjust CSV import columns to match your recipient data
4. Keep `email-template.js` as a dependency

### If you need server-side sending:
1. Also copy `scripts/gas-email-function.js`
2. Note: the GAS version does NOT generate .eml files — it uses `MailApp.sendEmail()` directly
3. The GAS version has its own copy of the HTML template (not shared with client-side). Keep them in sync manually, or consolidate.

### Key integration points:
```js
// Generate and download an .eml file
const emlContent = window.EmailTemplate.buildEml(recipient, settings);
const blob = new Blob([emlContent], { type: 'message/rfc822' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'email.eml';
a.click();
URL.revokeObjectURL(url);

// Preview in iframe
const html = window.EmailTemplate.buildEmailHtml(recipient, settings);
iframe.srcdoc = html;

// Copy as rich text (paste into Gmail/Outlook)
const blob = new Blob([html], { type: 'text/html' });
const item = new ClipboardItem({ 'text/html': blob });
navigator.clipboard.write([item]);
```

## What NOT to change (unless you know what you're doing)

- The MIME structure in `buildEml()` — it's RFC-compliant and tested across Outlook, Gmail, Apple Mail, Thunderbird
- The Quoted-Printable encoder — it handles UTF-8 edge cases correctly
- The `<!--[if mso]>` conditional blocks — these are the only way to style things in Outlook
- The `role="presentation"` on layout tables — accessibility requirement
- The `<meta http-equiv="X-UA-Compatible" content="IE=edge">` — needed for Outlook rendering engine
- The `mso-table-lspace:0pt; mso-table-rspace:0pt` — prevents Outlook from adding phantom spacing
