/**
 * Generate email header PNG — gradient with top-only rounded corners.
 *
 * Usage:  node scripts/generate-email-header-png.js
 * Output: images/email-header.png (1200×184, 2× retina for 600px email)
 */
import { createCanvas, registerFont } from 'canvas';
import { writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'images', 'email-header.png');

// --- Config ---
const W = 1200;          // 2× retina for 600px email width
const SCALE = W / 600;
const H = Math.round(92 * SCALE);  // ~184px
const RADIUS = Math.round(16 * SCALE);  // matches CSS border-radius:16px

const COLOR_LEFT  = '#8caef4';  // --accent (top-left)
const COLOR_RIGHT = '#111162';  // --primary (bottom-right)

const LINE1 = 'Commissie Monitoring Talent naar de Top';
const LINE2 = 'Monitor Executive Search';

// --- Draw ---
const canvas = createCanvas(W, H);
const ctx = canvas.getContext('2d');

// Fill entire canvas with email body background color first.
// Outlook doesn't render PNG transparency properly, so we bake the
// background into the corners so rounding is visible everywhere.
const BG_COLOR = '#e1e9f4';  // --sand (email body background)
ctx.fillStyle = BG_COLOR;
ctx.fillRect(0, 0, W, H);

// Rounded-top rectangle path (bottom corners square)
ctx.beginPath();
ctx.moveTo(RADIUS, 0);
ctx.lineTo(W - RADIUS, 0);
ctx.quadraticCurveTo(W, 0, W, RADIUS);
ctx.lineTo(W, H);
ctx.lineTo(0, H);
ctx.lineTo(0, RADIUS);
ctx.quadraticCurveTo(0, 0, RADIUS, 0);
ctx.closePath();

// 135° diagonal gradient
const grad = ctx.createLinearGradient(0, 0, W, H);
grad.addColorStop(0, COLOR_LEFT);
grad.addColorStop(1, COLOR_RIGHT);
ctx.fillStyle = grad;
ctx.fill();

// Line 1 — sender name (smaller, cold off-white for contrast on gradient)
const fontSize1 = Math.round(14 * SCALE);
ctx.font = `500 ${fontSize1}px "Inter", "Segoe UI", Helvetica, Arial, sans-serif`;
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText(LINE1, W / 2, H * 0.38);

// Line 2 — heading (larger, bold, white)
const fontSize2 = Math.round(26 * SCALE);
ctx.font = `700 ${fontSize2}px "Inter", "Segoe UI", Helvetica, Arial, sans-serif`;
ctx.fillStyle = '#ffffff';
ctx.fillText(LINE2, W / 2, H * 0.68);

// Write PNG
const buf = canvas.toBuffer('image/png');
writeFileSync(OUT, buf);
console.log(`✓ ${OUT} (${W}×${H}, ${(buf.length / 1024).toFixed(1)} KB)`);
