import React from 'react';
import { Img, staticFile, useCurrentFrame } from 'remotion';
import { C, FPS, ramp, rng } from './kit';
import { Crew } from './crew';

// Animované planety: ilustrace z webu + vlastní pohyb podle produktu.
// Všechny ilustrace mají stejnou kompozici (koule a prstenec), souřadnice jsou v % obrázku.
const SPHERE = { cx: 50, cy: 61, r: 27.5 };
// Postavičky chodí po vnitřním oblouku (78 % poloměru koule) — po viditelném travnatém povrchu.
export const WALK = .78;
const RING = { cx: 50, cy: 63, rx: 40, ry: 13, rot: -14 };
const ringPoint = (theta: number) => {
  const x = RING.rx * Math.cos(theta), y = RING.ry * Math.sin(theta), a = RING.rot * Math.PI / 180;
  return { x: RING.cx + x * Math.cos(a) - y * Math.sin(a), y: RING.cy + x * Math.sin(a) + y * Math.cos(a), front: Math.sin(theta) > 0 };
};
// Bod na zadní polovině prstence, který je „za koulí“, se nekreslí.
const visible = (p: { x: number; y: number; front: boolean }) => p.front || Math.hypot(p.x - SPHERE.cx, p.y - SPHERE.cy) > SPHERE.r;

const Envelope: React.FC<{ x: number; y: number; s: number; o: number }> = ({ x, y, s, o }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
    <rect x={-3} y={-2} width={6} height={4} rx={.6} fill={C.lilac50} />
    <path d="M-3 -2 L0 .6 L3 -2" fill="none" stroke={C.pink} strokeWidth={.5} />
    <circle cx={0} cy={.9} r={.55} fill={C.hot} />
  </g>
);

export type FxName = string;
export const PlanetFx: React.FC<{ name: FxName; size: number; x: number; y: number; from: number; image?: string; brightness?: number; opacity?: number; crewGeo?: { cx: number; cy: number; r: number } }> =
  ({ name, size, x, y, from, image, brightness = 1, opacity = 1, crewGeo }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - from) / FPS;
  const float = Math.sin(t * Math.PI * 2 / 5) * size * .008; // jemné vznášení
  const left = x - size / 2, top = y - size / 2 + float;
  // SSL: zámek „cvakne“ — celá ilustrace se krátce rovnoměrně zhoupne (1 → 0,96 → 1,03 → 1).
  const click = name === 'ssl' ? (() => { const k = (t - 1.1) / .35; return k < 0 || k > 1 ? 1 : 1 - .04 * Math.sin(k * Math.PI) + .03 * Math.sin(k * Math.PI * 2) * (k > .5 ? 1 : 0); })() : 1;
  const theta = t * Math.PI * 2 / 3.2; // puls po prstenci
  const pulse = [0, .12, .24].map((d, i) => ({ p: ringPoint(theta - d), o: 1 - i * .35 }));
  const R = rng(name.length * 97 + name.charCodeAt(0));
  const leds = Array.from({ length: 18 }, () => ({ x: 36 + R() * 28, y: 12 + R() * 22, ph: R() * 6.28, c: R() > .5 ? C.hot : C.lilac50 }));
  return (
    <div style={{ position: 'absolute', left, top, width: size, height: size, opacity, transform: `scale(${click})` }}>
      {name === 'backups' && [1, 2, 3].map(i => {
        const k = ramp(frame, from + 10 + i * 10, from + 30 + i * 10);
        return <Img key={i} src={staticFile(`planets/${image ?? name}.webp`)} style={{ position: 'absolute', inset: 0, width: size, height: size, opacity: .38 * k / i, transform: `translate(${i * 9 * k}%, ${-i * 2 * k}%) scale(${1 - i * .12})`, filter: 'saturate(.6)' }} />;
      })}
      <Img src={staticFile(`planets/${image ?? name}.webp`)} style={{ position: 'absolute', inset: 0, width: size, height: size, filter: `${brightness < 1 ? `brightness(${brightness}) ` : ''}drop-shadow(0 24px 48px #12001Ecc)` }} />
      <svg viewBox="0 0 100 100" width={size} height={size} style={{ position: 'absolute', inset: 0, overflow: 'visible' }}>
        {/* Energie běží po prstenci každé planety. */}
        {pulse.map(({ p, o }, i) => visible(p) && <circle key={i} cx={p.x} cy={p.y} r={1.1 - i * .25} fill={i ? C.lilac50 : '#fff'} opacity={o * ramp(frame, from + 8, from + 20)} />)}
        {name === 'monitoring' && [0, 1, 2].map(i => {
          const k = ((t + i * .7) % 2.1) / 2.1;
          return <circle key={i} cx={58} cy={17} r={2 + k * 18} fill="none" stroke={C.pink} strokeWidth={.5} opacity={(1 - k) * .8} />;
        })}
        {name === 'support' && (() => {
          const ang = -18 + Math.sin(t * Math.PI * 2 / 4) * 22; // paprsek majáku se kývá
          return <g transform={`rotate(${ang} 39 18)`}><path d="M39 18 L95 6 L95 26 Z" fill="url(#beam)" opacity={.55 + .25 * Math.sin(t * 6)} /><defs><linearGradient id="beam" x1="0" x2="1"><stop offset="0" stopColor="#fff" stopOpacity=".9" /><stop offset="1" stopColor={C.lilac200} stopOpacity="0" /></linearGradient></defs></g>;
        })()}
        {name === 'ssl' && t > 1.1 && <circle cx={50} cy={29} r={2 + (t - 1.1) * 30} fill="none" stroke={C.lilac50} strokeWidth={.6} opacity={Math.max(0, 1 - (t - 1.1) * 1.4)} />}
        {name === 'mail' && [0, .33, .66].map((d, i) => { const p = ringPoint(t * Math.PI * 2 / 6 + d * Math.PI * 2 + 1); return visible(p) && <Envelope key={i} x={p.x} y={p.y} s={p.front ? 1.1 : .8} o={p.front ? 1 : .6} />; })}
        {(name === 'vps' || name === 'dedicated' || name === 'datacenter' || name === 'web' || name === 'colo') && leds.map((l, i) => <circle key={i} cx={l.x} cy={l.y} r={.55} fill={l.c} opacity={Math.max(0, Math.sin(t * 5 + l.ph)) * .9} />)}
        {name === 'database' && [0, 1].map(i => { const k = ((t + i) % 2) / 2; return <rect key={i} x={46} y={30 - k * 22} width={8} height={1.2} rx={.6} fill={C.lilac50} opacity={(1 - k) * .8} />; })}
        {name === 'domains' && [0, 1, 2].map(i => { const k = ((t * .7 + i / 3) % 1); const p = ringPoint(-1.2 + k * 2.4); return visible(p) && <path key={i} d={`M${p.x - 1.4} ${p.y} l1.4 -1 l1.4 1`} fill="none" stroke={C.hot} strokeWidth={.6} opacity={1 - k} transform={`rotate(90 ${p.x} ${p.y})`} />; })}
        {name === 'ai' && leds.slice(0, 10).map((l, i) => <circle key={i} cx={l.x - 6} cy={l.y - 4} r={.7} fill={C.lilac50} opacity={Math.max(0, Math.sin(t * 3 + l.ph))} />)}
      </svg>
      {name === 'game' && crewGeo && <Crew cx={crewGeo.cx / 100 * size} cy={crewGeo.cy / 100 * size} r={crewGeo.r * WALK / 100 * size} from={from} />}
    </div>
  );
};
