// Živá pozadí webu (npm run render:bg [nebula|horizon|deep]): Remotion vyrenderuje 2× supersampling master (PNG snímky → H.264 CRF 8),
// ffmpeg ho zmenší na rozměr zdroje (1664×936) a zakóduje smyčky pro web do ../../public/bg/.
import './prepare-assets.mjs';
import './find-stars.mjs';
import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const project = fileURLToPath(new URL('../', import.meta.url));
const web = fileURLToPath(new URL('../../../public/bg/', import.meta.url));
const tmp = `${project}out/`;
await mkdir(tmp, { recursive: true });
const all = { nebula: 'BgNebula', horizon: 'BgHorizon', deep: 'BgDeep' };
// Kvalita/velikost: cíl ≤ ~1.5 MB na 10 s smyčku.
const crf = { nebula: { h264: 22, vp9: 33 }, horizon: { h264: 20, vp9: 31 }, deep: { h264: 20, vp9: 31 } };
const run = (cmd, args) => { const r = spawnSync(cmd, args, { cwd: project, stdio: 'inherit' }); if (r.error) throw r.error; if (r.status !== 0) process.exit(r.status || 1); };
const extra = process.env.REMOTION_BROWSER ? [`--browser-executable=${process.env.REMOTION_BROWSER}`] : [];
for (const name of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(all)) {
  const master = `${tmp}bg-${name}-master.mp4`;
  // ENCODE_ONLY=1 přeskočí Remotion a jen znovu zakóduje existující master.
  if (!process.env.ENCODE_ONLY) run(`${project}node_modules/.bin/remotion`, ['render', 'src/index.tsx', all[name], master, '--codec=h264', '--crf=8', '--image-format=png', '--scale=2', '--concurrency=6', ...extra]);
  const vf = ['-vf', 'scale=1664:936:flags=lanczos,format=yuv420p'];
  run('ffmpeg', ['-y', '-v', 'error', '-i', master, ...vf, '-c:v', 'libx264', '-preset', 'veryslow', '-crf', String(crf[name].h264), '-profile:v', 'high', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', `${web}bg-${name}.mp4`]);
  const vp9 = [...vf, '-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', String(crf[name].vp9), '-row-mt', '1', '-tile-columns', '2', '-deadline', 'good', '-cpu-used', '1', '-an'];
  run('ffmpeg', ['-y', '-v', 'error', '-i', master, ...vp9, '-pass', '1', '-passlogfile', `${tmp}vp9-${name}`, '-f', 'webm', '/dev/null']);
  run('ffmpeg', ['-y', '-v', 'error', '-i', master, ...vp9, '-pass', '2', '-passlogfile', `${tmp}vp9-${name}`, `${web}bg-${name}.webm`]);
}
