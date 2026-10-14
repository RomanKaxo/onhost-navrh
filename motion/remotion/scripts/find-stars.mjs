// Najde v ilustraci pozadí jasné bodové hvězdy (lokální maxima na tmavém okolí) → src/bg/stars.json.
// Kompozice BgLoop je pak nechá jemně třpytit, zbytek obrazu zůstává 1:1.
import { spawnSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
const web = fileURLToPath(new URL('../../../', import.meta.url));
const out = {};
for (const name of ['nebula', 'horizon', 'deep']) {
  const file = `${web}public/bg/bg-${name}.webp`;
  const probe = spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'stream=width,height', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  const [W, H] = probe.stdout.trim().split(',').map(Number);
  const raw = spawnSync('ffmpeg', ['-v', 'error', '-i', file, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { maxBuffer: 64e6 }).stdout;
  const L = new Float32Array(W * H);
  for (let i = 0; i < W * H; i++) L[i] = 0.2126 * raw[i * 3] + 0.7152 * raw[i * 3 + 1] + 0.0722 * raw[i * 3 + 2];
  const at = (x, y) => L[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
  const stars = [];
  for (let y = 4; y < H - 4; y++) for (let x = 4; x < W - 4; x++) {
    const v = at(x, y);
    if (v < 120) continue;
    let max = true;
    for (let dy = -3; dy <= 3 && max; dy++) for (let dx = -3; dx <= 3; dx++) if ((dx || dy) && at(x + dx, y + dy) > v) { max = false; break; }
    if (!max) continue;
    // Okolí (prstenec) musí být tmavé — vyloučí mraky, planety a prstence. Větší hvězdy se zkouší s větším prstencem.
    let found = null;
    for (const [R, win, lim] of [[11, 6, 60], [22, 12, 260]]) {
      let ring = 0, ringMax = 0;
      for (let a = 0; a < 48; a++) { const s = at(Math.round(x + R * Math.cos(a / 48 * 2 * Math.PI)), Math.round(y + R * Math.sin(a / 48 * 2 * Math.PI))); ring += s; ringMax = Math.max(ringMax, s); }
      ring /= 48;
      if (ring > 55 || ringMax > 95 || v - ring < 70) continue;
      let bright = 0;
      for (let dy = -win; dy <= win; dy++) for (let dx = -win; dx <= win; dx++) if (at(x + dx, y + dy) > ring + (v - ring) * 0.35) bright++;
      if (bright > lim) continue;
      found = Math.max(2.5, Math.sqrt(bright / Math.PI) * 1.6); break;
    }
    if (found === null || stars.some(s => Math.hypot(s.x - x, s.y - y) < 10)) continue;
    stars.push({ x, y, r: Math.round(found * 10) / 10, v: Math.round(v) });
  }
  out[name] = { width: W, height: H, stars };
  console.log(name, W, H, stars.length);
}
writeFileSync(fileURLToPath(new URL('../src/bg/stars.json', import.meta.url)), JSON.stringify(out));
