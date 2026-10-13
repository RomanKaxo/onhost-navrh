import { mkdir, copyFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
// Remotion čte jen svůj public/: zkopíruj originální logo, ilustrace planet a data mapy z webu.
const project = new URL('../', import.meta.url);
const web = new URL('../../', project);
await mkdir(new URL('public/brand/', project), { recursive: true });
for (const name of ['onhost-symbol.svg', 'onhost-horizontal.svg']) {
  await copyFile(new URL(`public/brand/${name}`, web), new URL(`public/brand/${name}`, project));
}
const planets = new URL('public/planets/', web);
if (existsSync(planets)) {
  await mkdir(new URL('public/planets/', project), { recursive: true });
  for (const name of await readdir(planets)) await copyFile(new URL(name, planets), new URL(`public/planets/${name}`, project));
}
const world = new URL('src/data/world-network.json', web);
if (existsSync(world)) {
  await mkdir(new URL('public/data/', project), { recursive: true });
  await copyFile(world, new URL('public/data/world-network.json', project));
}
console.log('Assets copied (logo, planets, world network).');
