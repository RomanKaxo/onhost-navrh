// Natural Earth 50m land via world-atlas (ISC). Offline, deterministic build data.
// Output: a constellation of land dots (blue-noise sampled, denser around Prague),
// thin links that never leave land or cross each other, distance bands for the
// reveal wave and a few illustrative traffic arcs from Praha. The arc endpoints
// are regions of traffic, not infrastructure locations.
import {readFileSync, writeFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {feature} from 'topojson-client';
const require = createRequire(import.meta.url);
const topo = JSON.parse(readFileSync(require.resolve('world-atlas/land-50m.json')));
const land = feature(topo, 'land');
const polygons = land.features.flatMap(f => f.geometry.type === 'MultiPolygon' ? f.geometry.coordinates : [f.geometry.coordinates])
  .map(rings => {
    const outer = rings[0]; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (const [x, y] of outer) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
    return {rings, box: [x0, y0, x1, y1]};
  });
function insideRing(x, y, ring) {
  let yes = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [a, b] = ring[i], [c, d] = ring[j];
    if ((b > y) !== (d > y) && x < (c - a) * (y - b) / (d - b) + a) yes = !yes;
  }
  return yes;
}
const onLand = (lon, lat) => polygons.some(({rings, box}) => lon >= box[0] && lon <= box[2] && lat >= box[1] && lat <= box[3]
  && insideRing(lon, lat, rings[0]) && !rings.slice(1).some(r => insideRing(lon, lat, r)));

let seed = 713; const random = () => ((seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0) / 4294967296);
// Same plate carrée-like frame as before so the 1000×520 viewBox stays stable.
const SX = 2.63, SY = 3.45, LAT_TOP = 78, LAT_BOTTOM = -56;
const project = (lon, lat) => [26 + (lon + 180) * SX, 24 + (LAT_TOP - lat) * SY];
const unproject = (x, y) => [(x - 26) / SX - 180, LAT_TOP - (y - 24) / SY];
const r1 = v => Math.round(v * 10) / 10;
const PRAHA = project(14.43, 50.08);
const distP = (x, y) => Math.hypot(x - PRAHA[0], y - PRAHA[1]);

// Smooth value noise for organic density and brightness variation.
const lattice = new Map();
const hash = (i, j) => { const k = `${i}:${j}`; if (!lattice.has(k)) lattice.set(k, random()); return lattice.get(k); };
const smooth = t => t * t * (3 - 2 * t);
function noise(x, y, scale) {
  const u = x / scale, v = y / scale, i = Math.floor(u), j = Math.floor(v), fu = smooth(u - i), fv = smooth(v - j);
  const a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), d = hash(i + 1, j + 1);
  return a + (b - a) * fu + (c - a) * fv + (a - b - c + d) * fu * fv;
}
const focus = (x, y) => Math.exp(-((distP(x, y) / 165) ** 2));
const spacing = (x, y) => {
  const [, lat] = unproject(x, y);
  const north = lat > 58 ? 1 + (lat - 58) / 70 : 1;          // calm the stretched far north
  return 11.2 * (1 - .4 * focus(x, y)) * (.82 + .38 * noise(x, y, 60)) * north;
};

// Variable-radius dart throwing (blue noise), grid accelerated.
const W = 1000, H = 520, CELL = 6, cols = Math.ceil(W / CELL), grid = new Map();
const points = [{x: r1(PRAHA[0]), y: r1(PRAHA[1]), s: spacing(...PRAHA), origin: true}];
const put = (p, i) => { const k = `${Math.floor(p.x / CELL)}:${Math.floor(p.y / CELL)}`; (grid.get(k) ?? grid.set(k, []).get(k)).push(i); };
put(points[0], 0);
const yTop = project(0, LAT_TOP)[1], yBottom = project(0, LAT_BOTTOM)[1];
for (let n = 0; n < 90000; n++) {
  const x = 26 + random() * 360 * SX, y = yTop + random() * (yBottom - yTop), s = spacing(x, y);
  const gx = Math.floor(x / CELL), gy = Math.floor(y / CELL), reach = Math.ceil(26 / CELL);
  let ok = true;
  for (let i = gx - reach; ok && i <= gx + reach; i++) for (let j = gy - reach; ok && j <= gy + reach; j++)
    for (const q of grid.get(`${i}:${j}`) ?? []) if (Math.hypot(points[q].x - x, points[q].y - y) < Math.min(s, points[q].s) * (q === 0 ? 1.6 : 1)) { ok = false; break; }
  if (!ok || !onLand(...unproject(x, y))) continue;
  points.push({x: r1(x), y: r1(y), s}); put(points.at(-1), points.length - 1);
}

// Links: Kruskal spanning forest over short all-land candidates, then sparse extras
// (denser near Prague). Nothing crosses water or another link.
const landLink = (p, q) => { for (let t = 1; t < 12; t++) { const f = t / 12; if (!onLand(...unproject(p.x + (q.x - p.x) * f, p.y + (q.y - p.y) * f))) return false; } return true; };
const candidates = [];
points.forEach((p, i) => {
  const gx = Math.floor(p.x / CELL), gy = Math.floor(p.y / CELL), reach = Math.ceil(36 / CELL);
  for (let a = gx - reach; a <= gx + reach; a++) for (let b = gy - reach; b <= gy + reach; b++) for (const j of grid.get(`${a}:${b}`) ?? []) {
    if (j <= i) continue;
    const q = points[j], d = Math.hypot(p.x - q.x, p.y - q.y);
    if (d < 1.9 * Math.max(p.s, q.s) && landLink(p, q)) candidates.push({a: i, b: j, d});
  }
});
candidates.sort((u, v) => u.d - v.d);
const cross = (e, f) => {
  if (e.a === f.a || e.a === f.b || e.b === f.a || e.b === f.b) return false;
  const [p, q, r, s] = [points[e.a], points[e.b], points[f.a], points[f.b]];
  const o = (u, v, w) => Math.sign((v.x - u.x) * (w.y - u.y) - (v.y - u.y) * (w.x - u.x));
  return o(p, q, r) !== o(p, q, s) && o(r, s, p) !== o(r, s, q);
};
const edges = [], degree = points.map(() => 0), root = points.map((_, i) => i);
const find = i => root[i] === i ? i : (root[i] = find(root[i]));
const tryAdd = e => { if (degree[e.a] >= 4 || degree[e.b] >= 4 || edges.some(f => cross(e, f))) return false; edges.push(e); degree[e.a]++; degree[e.b]++; return true; };
for (const e of candidates) if (find(e.a) !== find(e.b) && tryAdd(e)) root[find(e.a)] = find(e.b);
const tree = new Set(edges);
for (const e of candidates) if (!tree.has(e)) {
  const p = points[e.a], q = points[e.b], f = focus((p.x + q.x) / 2, (p.y + q.y) / 2);
  if (random() < .3 + .5 * f) tryAdd(e);
}

// Dot size classes: mostly faint specks, some mid stars, few bright ones.
points.forEach((p, i) => {
  const v = .55 * noise(p.x + 400, p.y, 45) + .45 * random() + .25 * focus(p.x, p.y);
  p.size = i === 0 ? 'lg' : v > .78 ? 'lg' : v > .5 ? 'md' : 'sm';
  p.band = Math.floor(distP(p.x, p.y) / 30);
});
const bandCount = Math.max(...points.map(p => p.band)) + 1;
const dotPath = list => list.map(p => `M${p.x} ${p.y}h0`).join('');
const bands = Array.from({length: bandCount}, (_, band) => {
  const inBand = points.filter((p, i) => i > 0 && p.band === band);
  return {
    band,
    dots: Object.fromEntries(['sm', 'md', 'lg'].map(size => [size, dotPath(inBand.filter(p => p.size === size))])),
    edges: edges.filter(e => Math.min(points[e.a].band, points[e.b].band) === band)
      .map(e => { const [p, q] = distP(points[e.a].x, points[e.a].y) <= distP(points[e.b].x, points[e.b].y) ? [points[e.a], points[e.b]] : [points[e.b], points[e.a]]; return `M${p.x} ${p.y}L${q.x} ${q.y}`; }).join(''),
  };
}).filter(b => b.edges || Object.values(b.dots).some(Boolean));

const twinkles = points.filter((p, i) => i > 0 && p.size !== 'sm' && random() < .1).map(p => ({x: p.x, y: p.y, r: p.size === 'lg' ? 1.6 : 1.2, delay: r1(random() * 9), dur: r1(4 + random() * 5)}));

// Illustrative traffic regions (not datacenters): arcs from Praha bowed upward.
const regions = [[-74, 40.7], [139.7, 35.7], [-46.6, -23.5], [103.8, 1.35], [-122.2, 37.6], [28, -26.2], [72.9, 19.1], [151.2, -33.9]];
const routes = regions.map(([lon, lat]) => {
  const [tx, ty] = project(lon, lat);
  const end = points.slice(1).reduce((best, p) => Math.hypot(p.x - tx, p.y - ty) < Math.hypot(best.x - tx, best.y - ty) ? p : best);
  const [x0, y0] = PRAHA, dx = end.x - x0, dy = end.y - y0, len = Math.hypot(dx, dy);
  let nx = -dy / len, ny = dx / len; if (ny > 0) { nx = -nx; ny = -ny; }
  const lift = .2 * len, cx = (x0 + end.x) / 2 + nx * lift, cy = (y0 + end.y) / 2 + ny * lift;
  return {d: `M${r1(x0)} ${r1(y0)}Q${r1(cx)} ${r1(cy)} ${end.x} ${end.y}`, len: Math.round(len), end: {x: end.x, y: end.y}};
});

const result = {width: W, height: H, source: 'Natural Earth 50m / world-atlas 2.0.2 (ISC); network illustration, not infrastructure locations',
  origin: {x: r1(PRAHA[0]), y: r1(PRAHA[1])}, bands, twinkles, routes};
writeFileSync(new URL('../src/data/world-network.json', import.meta.url), JSON.stringify(result));
console.log(`${points.length} land points, ${edges.length} links, ${bands.length} bands, ${twinkles.length} twinkles, ${routes.length} routes`);
