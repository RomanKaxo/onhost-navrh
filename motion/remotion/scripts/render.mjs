import './prepare-assets.mjs';
import { mkdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const project = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../../../public/media/', import.meta.url));
await mkdir(output, { recursive: true });
const compositions = {
  'power-on': ['PowerOn', 165],
  'power-on-portrait': ['PowerOnPortrait', 165],
  'power-on-loop': ['PowerOnLoop', 90],
  'power-on-loop-portrait': ['PowerOnLoopPortrait', 90],
  deploy: ['Deploy', 90],
  constellation: ['Constellation', 90],
};
const selected = process.argv[2] ? process.argv.slice(2) : Object.keys(compositions);
for (const name of selected) {
  if (!compositions[name]) throw Error(`Unknown composition: ${name}`);
  const [id, frame] = compositions[name];
  const common = ['src/index.tsx', id];
  const extra = process.env.REMOTION_BROWSER ? [`--browser-executable=${process.env.REMOTION_BROWSER}`] : [];
  const jobs = process.env.POSTER_ONLY ? ['png'] : ['png','webm','mp4'];
  for (const extension of jobs) {
    const args = extension === 'png'
      ? ['still', ...common, `${output}${name}.png`, `--frame=${frame}`, ...extra]
      : ['render', ...common, `${output}${name}.${extension}`, `--codec=${extension === 'webm' ? 'vp8' : 'h264'}`, '--concurrency=2', ...extra];
    const result = spawnSync(`${project}/node_modules/.bin/remotion`, args, { cwd: project, stdio: 'inherit' });
    if (result.error) throw result.error;
    if (result.status !== 0) process.exit(result.status || 1);
  }
}
