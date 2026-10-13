import { mkdir, copyFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const project = new URL('../', import.meta.url);
await mkdir(new URL('public/brand/', project), { recursive: true });
for (const name of ['onhost-symbol.svg', 'onhost-horizontal.svg']) {
  await copyFile(new URL(`../../public/brand/${name}`, project), new URL(`public/brand/${name}`, project));
}
console.log('Copied original ONhost SVGs from ../../public/brand.');
