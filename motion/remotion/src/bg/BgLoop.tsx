import React, { useEffect, useState } from 'react';
import { AbsoluteFill, continueRender, delayRender, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import starData from './stars.json';

// Živá verze ilustrovaných pozadí webu (public/bg). Obraz zůstává 1:1 s původní ilustrací:
// žádný zoom, posun ani změna barvy — jen se mraky jemně vlní (feDisplacementMap), hvězdy třpytí a světlo dýchá.
// Šum se posouvá po kružnici s celým počtem oběhů za smyčku, takže poslední snímek navazuje na první.

type Zone = { cx: number; cy: number; rx: number; ry?: number; rot?: number };
type Cfg = {
  file: string;
  // Šum pro zvlnění: frekvence (x y), poloměr kroužení (px), síla posunu (px).
  freq: string; orbit: number; scale: number;
  // Maska zvlnění z rozmazaného jasu: alfa = gain·jas + bias (mraky ano, prázdný vesmír ne). null = celé (omezeno maskou).
  lum: { gain: number; bias: number } | null;
  // Oblasti, které zůstávají ostré a nehybné (planety, měsíce).
  keep: Zone[];
  // Volitelný kruh, uvnitř kterého se smí vlnit (povrch planety v horizon), poloměr zmenšený o okraj.
  inside?: { cx: number; cy: number; r: number };
  breathe: number; twinkle: number;
};

export const BG: Record<'nebula' | 'horizon' | 'deep', Cfg> = {
  nebula: {
    file: 'bg/bg-nebula.webp', freq: '0.0042 0.0052', orbit: 70, scale: 34,
    lum: { gain: 3.2, bias: -0.25 },
    keep: [
      { cx: 1506, cy: 118, rx: 165, ry: 100, rot: -22 }, { cx: 1508, cy: 120, rx: 100 },
      { cx: 121, cy: 89, rx: 40 }, { cx: 68, cy: 122, rx: 11 }, { cx: 139, cy: 710, rx: 52 },
      { cx: 208, cy: 743, rx: 12 }, { cx: 1366, cy: 113, rx: 12 }, { cx: 1628, cy: 158, rx: 14 },
    ],
    breathe: 0.05, twinkle: 0.9,
  },
  horizon: {
    file: 'bg/bg-horizon.webp', freq: '0.0018 0.006', orbit: 90, scale: 24,
    lum: null, keep: [], inside: { cx: 825, cy: 3298, r: 2631 - 22 },
    breathe: 0.06, twinkle: 0,
  },
  deep: {
    file: 'bg/bg-deep.webp', freq: '0.006 0.006', orbit: 60, scale: 22,
    lum: { gain: 9, bias: -0.55 },
    keep: [{ cx: 1490, cy: 755, rx: 145 }],
    breathe: 0.07, twinkle: 1,
  },
};

const TAU = Math.PI * 2;
// Deterministický pseudonáhodný generátor (stejný výsledek při každém renderu).
const hash = (i: number) => { const s = Math.sin(i * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const inZone = (x: number, y: number, z: Zone) => {
  const a = -((z.rot ?? 0) * Math.PI) / 180, dx = x - z.cx, dy = y - z.cy;
  const u = dx * Math.cos(a) - dy * Math.sin(a), v = dx * Math.sin(a) + dy * Math.cos(a);
  return (u / z.rx) ** 2 + (v / (z.ry ?? z.rx)) ** 2 < 1;
};

export const BgLoop: React.FC<{ name: keyof typeof BG }> = ({ name }) => {
  const cfg = BG[name];
  const frame = useCurrentFrame();
  const { width: W, height: H, durationInFrames } = useVideoConfig();
  const src = staticFile(cfg.file);
  const [ready, setReady] = useState(false);
  const [handle] = useState(() => delayRender(`load ${cfg.file}`));
  useEffect(() => {
    const img = new Image(); img.src = src;
    img.decode().then(() => setReady(true));
  }, [src]);
  useEffect(() => { if (ready) requestAnimationFrame(() => requestAnimationFrame(() => continueRender(handle))); }, [ready, handle]);

  const t = frame / durationInFrames; // 0 … <1, t=1 ≡ t=0
  const p = TAU * t;
  // Dvě vrstvy šumu: jedna obíhá 1× po směru, druhá 2× proti směru → organické proudění, perioda = smyčka.
  const o1 = { x: cfg.orbit * Math.cos(p), y: cfg.orbit * Math.sin(p) };
  const o2 = { x: cfg.orbit * 0.6 * Math.cos(-2 * p + 1.3), y: cfg.orbit * 0.6 * Math.sin(-2 * p + 1.3) };
  const breathe = 1 + cfg.breathe * Math.sin(p);
  const stars = (starData as Record<string, { stars: { x: number; y: number; r: number }[] }>)[name].stars
    .filter((s) => !cfg.keep.some((z) => inZone(s.x, s.y, { ...z, rx: z.rx + 6, ry: (z.ry ?? z.rx) + 6 })));
  const pad = 200;
  const zoneEl = (z: Zone, i: number, fill: string) => <ellipse key={i} cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry ?? z.rx} transform={`rotate(${z.rot ?? 0} ${z.cx} ${z.cy})`} fill={fill} />;

  if (!ready) return <AbsoluteFill style={{ background: '#12001E' }} />;
  return <AbsoluteFill style={{ background: '#12001E' }}>
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <filter id="warp" filterUnits="userSpaceOnUse" x={-pad} y={-pad} width={W + 2 * pad} height={H + 2 * pad} colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency={cfg.freq} numOctaves={3} seed={7} result="n1raw" />
          <feOffset in="n1raw" dx={o1.x} dy={o1.y} result="n1" />
          <feTurbulence type="fractalNoise" baseFrequency={cfg.freq} numOctaves={2} seed={23} result="n2raw" />
          <feOffset in="n2raw" dx={o2.x} dy={o2.y} result="n2" />
          <feComposite in="n1" in2="n2" operator="arithmetic" k2={0.5} k3={0.5} result="nmix" />
          {/* Neprůhledná mapa (alfa 1), aby posun nebyl ovlivněn alfou šumu. */}
          <feColorMatrix in="nmix" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1" result="map" />
          <feDisplacementMap in="SourceGraphic" in2="map" scale={cfg.scale} xChannelSelector="R" yChannelSelector="G" result="warped" />
          <feComponentTransfer in="warped" result="lit">
            <feFuncR type="linear" slope={breathe} /><feFuncG type="linear" slope={breathe} /><feFuncB type="linear" slope={breathe} />
          </feComponentTransfer>
          {cfg.lum ? <>
            <feGaussianBlur in="SourceGraphic" stdDeviation={18} result="soft" />
            <feColorMatrix in="soft" type="matrix" values={`0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  ${0.3 * cfg.lum.gain} ${0.59 * cfg.lum.gain} ${0.11 * cfg.lum.gain} 0 ${cfg.lum.bias}`} result="cloud" />
            <feComposite in="lit" in2="cloud" operator="in" />
          </> : <feMerge><feMergeNode in="lit" /></feMerge>}
        </filter>
        <filter id="feather" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation={10} /></filter>
        <mask id="warpMask" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          <g filter="url(#feather)">
            {cfg.inside ? <rect width={W} height={H} fill="black" /> : <rect width={W} height={H} fill="white" />}
            {cfg.inside && <circle cx={cfg.inside.cx} cy={cfg.inside.cy} r={cfg.inside.r} fill="white" />}
            {cfg.keep.map((z, i) => zoneEl({ ...z, rx: z.rx + 8, ry: (z.ry ?? z.rx) + 8 }, i, 'black'))}
            {/* Hvězdy se nevlní — jen třpytí na svém místě. */}
            {stars.map((s, i) => <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.r * 2.2 + 4} fill="black" />)}
          </g>
        </mask>
        <radialGradient id="glint"><stop offset="0" stopColor="white" /><stop offset=".55" stopColor="white" stopOpacity=".7" /><stop offset="1" stopColor="white" stopOpacity="0" /></radialGradient>
        <mask id="twinkleMask" maskUnits="userSpaceOnUse" x={0} y={0} width={W} height={H}>
          {stars.map((s, i) => {
            const cycles = 1 + Math.floor(hash(i) * 3); // 1–3 záblesky za smyčku → navazuje
            const a = Math.max(0, Math.sin(TAU * (cycles * t + hash(i + 99)))) ** 3;
            return <circle key={i} cx={s.x} cy={s.y} r={s.r * 2.6 + 3} fill="url(#glint)" opacity={a} />;
          })}
        </mask>
      </defs>
      <image href={src} width={W} height={H} />
      <g mask="url(#warpMask)"><image href={src} width={W} height={H} filter="url(#warp)" /></g>
      {cfg.twinkle > 0 && <g mask="url(#twinkleMask)" style={{ mixBlendMode: 'screen' }} opacity={cfg.twinkle}><image href={src} width={W} height={H} /></g>}
      {/* Okraj planety (horizon) jemně dýchá světlem. */}
      {cfg.inside && <circle cx={cfg.inside.cx} cy={cfg.inside.cy} r={cfg.inside.r + 22} fill="none" stroke="#f7a8ff" strokeWidth={6} opacity={0.16 * (0.5 - 0.5 * Math.cos(p))} style={{ mixBlendMode: 'screen', filter: 'blur(6px)' }} />}
    </svg>
  </AbsoluteFill>;
};
