// Rychlá kontrola obsahu bez buildu: node scripts/check-content.mjs [soubory…]
import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';

const root = 'src/content/pages';
const walk = dir => fs.readdirSync(dir, {withFileTypes: true})
  .flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : e.name.endsWith('.md') ? [path.join(dir, e.name)] : []);
const files = process.argv.length > 2 ? process.argv.slice(2) : walk(root);
const kinds = ['home', 'product', 'feature', 'listing', 'article', 'company', 'legal', 'support'];
const known = new Set(walk(root).map(f => path.relative(root, f).replace(/\.md$/, '')));
const pairs = (v, a, b) => Array.isArray(v) && v.every(x => x && typeof x[a] === 'string' && typeof x[b] === 'string');
let failed = 0;
for (const file of files) {
  const errors = [];
  const match = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---\n?/);
  let d = {};
  try {d = match ? parse(match[1]) : (errors.push('chybí frontmatter'), {});} catch (e) {errors.push(`YAML: ${e.message.split('\n')[0]}`);}
  const expected = path.relative(root, file).replace(/\.md$/, '');
  if (d.slug !== expected) errors.push(`slug "${d.slug}" ≠ "${expected}"`);
  if (!kinds.includes(d.kind)) errors.push(`kind "${d.kind}"`);
  for (const k of ['title', 'description']) if (typeof d[k] !== 'string' || !d[k]) errors.push(`chybí ${k}`);
  for (const k of ['headline', 'eyebrow', 'lead', 'planet', 'priceNote', 'date']) if (d[k] !== undefined && typeof d[k] !== 'string') errors.push(`${k} musí být text`);
  if (d.description?.length > 170) errors.push(`description má ${d.description.length} znaků`);
  for (const [k, a, b] of [['highlights', 'title', 'text'], ['steps', 'title', 'text'], ['specs', 'label', 'value'], ['faq', 'q', 'a']])
    if (d[k] !== undefined && !pairs(d[k], a, b)) errors.push(`${k}: položky potřebují ${a} a ${b} (text)`);
  for (const k of ['included', 'related']) if (d[k] !== undefined && !(Array.isArray(d[k]) && d[k].every(x => typeof x === 'string'))) errors.push(`${k} musí být seznam textů`);
  for (const slug of d.related || []) if (!known.has(slug)) errors.push(`related: neznámý slug ${slug}`);
  for (const p of d.plans || []) if (typeof p.name !== 'string' || typeof p.price !== 'string' || !Array.isArray(p.features || [])) errors.push(`plán ${p.name}: name/price/features`);
  if (d.cta && typeof d.cta.title !== 'string') errors.push('cta.title');
  if (errors.length) {failed++; console.log(`✗ ${file}\n  ${errors.join('\n  ')}`);}
}
console.log(failed ? `${failed} souborů s chybou` : `OK ${files.length} souborů`);
process.exit(failed ? 1 : 0);
