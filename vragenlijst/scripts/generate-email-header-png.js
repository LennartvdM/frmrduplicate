/**
 * Generate email header PNG — matches the login screen header layout.
 *
 * Visual: logo icon → "Monitoring Cultureel Talent / naar de Top" → "2026" badge
 * Gradient: 135° diagonal (#8caef4 → #111162), rounded top corners.
 * Background color (#f3ece2) baked into corners for Outlook transparency compat.
 *
 * Usage:  node scripts/generate-email-header-png.js
 * Output: images/email-header.png (1200 × auto, 2× retina for 600px email)
 *
 * Requires: npm install canvas (use the browser-based tools/generate-email-header.html
 * if the canvas package is unavailable)
 */
import { createCanvas, loadImage } from 'canvas';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '..', 'images');
const OUT = join(OUT_DIR, 'email-header.png');

// ---------------------------------------------------------------------------
// Dimensions (1× values, drawn at 2× retina)
// ---------------------------------------------------------------------------

const W = 1200;
const SCALE = W / 600;
const CORNER_R = Math.round(16 * SCALE);

const PAD_TOP     = 40;   // matches .login-header padding
const LOGO_W      = 56;   // .logo-icon width
const LOGO_H      = 64;   // .logo-icon height
const LOGO_R      = 12;   // .logo-icon border-radius
const GAP_LOGO    = 16;   // .logo-icon margin-bottom
const H1_SIZE     = 20;   // .login-header h1 font-size
const H1_LH       = 1.3;  // .login-header h1 line-height
const GAP_HEADING = 8;    // .login-header h1 margin-bottom
const BADGE_SIZE  = 14;   // .year-badge font-size
const BADGE_PV    = 6;    // .year-badge padding vertical
const BADGE_PH    = 18;   // .year-badge padding horizontal
const BADGE_R     = 20;   // .year-badge border-radius
const PAD_BOTTOM  = 40;   // matches .login-header padding

const lineH = Math.round(H1_SIZE * H1_LH);
const badgeH = BADGE_SIZE + BADGE_PV * 2;
const H = Math.round((PAD_TOP + LOGO_H + GAP_LOGO + lineH * 2 + GAP_HEADING + badgeH + PAD_BOTTOM) * SCALE);

// ---------------------------------------------------------------------------
// Colors
// ---------------------------------------------------------------------------

const GRAD_LEFT  = '#8caef4';   // --salmon (periwinkle blue)
const GRAD_RIGHT = '#111162';   // --terracotta (deep navy)
const BG_COLOR   = '#f3ece2';   // --sandLight (email body background)
const BADGE_FG   = '#1d1d30';   // --text (badge text color)

// Logo SVG viewBox (for aspect ratio calculation)
const SVG_VB = { w: 57.614, h: 67.051 };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function pill(ctx, x, y, w, h) {
  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + r, r, Math.PI / 2, -Math.PI / 2);
  ctx.closePath();
}

// ---------------------------------------------------------------------------
// Logo SVG as inline data URI (for loadImage — Path2D not available in node-canvas)
// ---------------------------------------------------------------------------

const LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 57.614 67.051" width="58" height="68">
  <g transform="translate(-741 -4156)">
    <path d="M48.72,105.206,30.284,91.174a2.438,2.438,0,0,0-2.951,0L8.9,105.205a3.1,3.1,0,0,1-4.337-.588L.634,99.459a3.094,3.094,0,0,1,.587-4.338l24.1-18.347a5.748,5.748,0,0,1,6.964,0l24.1,18.347a3.094,3.094,0,0,1,.59,4.336h0l-3.927,5.16a3.094,3.094,0,0,1-4.336.589h0" transform="translate(740.999 4117.211)" fill="rgba(255,255,255,0.87)"/>
    <path d="M48.719,67.465,34.359,56.536a9.17,9.17,0,0,0-11.106,0L8.9,67.465a3.094,3.094,0,0,1-4.337-.588L.632,61.718a3.094,3.094,0,0,1,.587-4.336h0L16.239,45.95a20.75,20.75,0,0,1,25.136,0L56.394,57.384a3.1,3.1,0,0,1,.588,4.336h0l-3.924,5.157a3.1,3.1,0,0,1-4.337.588" transform="translate(741 4134.599)" fill="rgba(255,255,255,0.87)"/>
    <path d="M58.5,12.356A12.355,12.355,0,1,1,46.143,0h0A12.355,12.355,0,0,1,58.5,12.356" transform="translate(723.664 4155.999)" fill="rgba(255,255,255,0.87)"/>
  </g>
</svg>`;

// ---------------------------------------------------------------------------
// Draw (async for loadImage)
// ---------------------------------------------------------------------------

async function generate() {

const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// 1. Background (baked into rounded corners for Outlook)
ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, W, H);

// 2. Gradient rounded-top rect
ctx.beginPath();
ctx.moveTo(CORNER_R, 0);
ctx.lineTo(W - CORNER_R, 0);
ctx.quadraticCurveTo(W, 0, W, CORNER_R);
ctx.lineTo(W, H);
ctx.lineTo(0, H);
ctx.lineTo(0, CORNER_R);
ctx.quadraticCurveTo(0, 0, CORNER_R, 0);
ctx.closePath();

const grad = ctx.createLinearGradient(0, 0, W, H);
grad.addColorStop(0, GRAD_LEFT);
grad.addColorStop(1, GRAD_RIGHT);
ctx.fillStyle = grad;
ctx.fill();

// 3. Logo icon box (frosted white rounded rect)
const lbW = LOGO_W * SCALE;
const lbH = LOGO_H * SCALE;
const lbX = (W - lbW) / 2;
const lbY = PAD_TOP * SCALE;

ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
roundedRect(ctx, lbX, lbY, lbW, lbH, LOGO_R * SCALE);
ctx.fill();

// 4. Logo SVG inside the icon box (loaded as image — Path2D unavailable in node-canvas)
const svgTargetH = 38 * SCALE;               // CSS: .logo-icon svg { height: 38px }
const svgRatio = SVG_VB.w / SVG_VB.h;
const svgTargetW = svgTargetH * svgRatio;
const svgX = lbX + (lbW - svgTargetW) / 2;
const svgY = lbY + (lbH - svgTargetH) / 2;

const logoDataUri = 'data:image/svg+xml;base64,' + Buffer.from(LOGO_SVG).toString('base64');
const logoImg = await loadImage(logoDataUri);
ctx.drawImage(logoImg, svgX, svgY, svgTargetW, svgTargetH);

// 5. Heading — two lines, matching .login-header h1
const h1px = Math.round(H1_SIZE * SCALE);
ctx.font = `600 ${h1px}px "Inter", "Segoe UI", Helvetica, Arial, sans-serif`;
ctx.fillStyle = 'rgba(255, 255, 255, 0.87)';
ctx.textAlign = 'center';
ctx.textBaseline = 'top';

const headY = (PAD_TOP + LOGO_H + GAP_LOGO) * SCALE;
ctx.fillText('Monitoring Cultureel Talent', W / 2, headY);
ctx.fillText('naar de Top', W / 2, headY + lineH * SCALE);

// 6. Year badge pill
const bdPx = Math.round(BADGE_SIZE * SCALE);
ctx.font = `600 ${bdPx}px "Inter", "Segoe UI", Helvetica, Arial, sans-serif`;
const bdTW = ctx.measureText('2026').width;
const bdW = bdTW + BADGE_PH * 2 * SCALE;
const bdH = badgeH * SCALE;
const bdX = (W - bdW) / 2;
const bdY = (PAD_TOP + LOGO_H + GAP_LOGO + lineH * 2 + GAP_HEADING) * SCALE;

// Badge shadow (matches .year-badge box-shadow)
ctx.save();
ctx.shadowColor = 'rgba(0, 0, 0, 0.08)';
ctx.shadowOffsetX = 0;
ctx.shadowOffsetY = 4 * SCALE;
ctx.shadowBlur = 12 * SCALE;
ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
pill(ctx, bdX, bdY, bdW, bdH);
ctx.fill();
ctx.restore();

// Badge text
ctx.fillStyle = BADGE_FG;
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('2026', W / 2, bdY + bdH / 2);

// ---------------------------------------------------------------------------
// Write PNG
// ---------------------------------------------------------------------------

mkdirSync(OUT_DIR, { recursive: true });
const buf = canvas.toBuffer('image/png');
writeFileSync(OUT, buf);
console.log(`✓ ${OUT} (${W}×${H}, ${(buf.length / 1024).toFixed(1)} KB)`);

} // end generate()

generate().catch(e => { console.error(e); process.exit(1); });
