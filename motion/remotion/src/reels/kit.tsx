import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';

// Barvy jen z brandmanuálu.
export const C = {
  space: '#12001E', deep: '#2C0A3E', brand: '#3C096C', pink: '#E91E7A', hot: '#F72585',
  lilac: '#BB88EB', lilac200: '#E0BEFF', lilac50: '#F1E2FF',
};
export const FPS = 30;
// Scény jsou kreslené v prostoru na výšku 1080×1920. Na šířku (1920×1080) se vizuál posune doprava
// a titulky jdou vlevo; vesmír a horizont se roztáhnou přes celý snímek.
export const W = 1080, H = 1920;
export const useLayout = () => { const { width, height } = useVideoConfig(); return { landscape: width > height, width, height }; };
export const STAGE_SHIFT = { x: 800, y: -220 };
export const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { landscape } = useLayout();
  return landscape ? <AbsoluteFill style={{ width: W, height: H, transform: `translate(${STAGE_SHIFT.x}px, ${STAGE_SHIFT.y}px)` }}>{children}</AbsoluteFill> : <>{children}</>;
};
const ease = Easing.bezier(.2, .8, .2, 1);
// Hodnota z [a, b) snímků do [from, to] s brandovou křivkou; mimo interval drží krajní hodnoty.
export const ramp = (frame: number, a: number, b: number, from = 0, to = 1) =>
  interpolate(frame, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: ease });

// Deterministický generátor (stejný snímek = stejný obraz, nezávisle na pořadí renderu).
export const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// Hvězdné pole a mlhovina; power 0..1 = vesmír vypnutý/zapnutý. Hvězdy se rozsvěcují od středu ven.
const starRand = rng(11);
const STARS = Array.from({ length: 300 }, () => {
  const x = starRand() * 1920, y = starRand() * 1920;
  const c = [C.lilac50, '#ffffff', C.lilac200, C.lilac, C.hot][Math.floor(starRand() ** 2.4 * 5)];
  return { x, y, r: .6 + starRand() ** 3 * 2.4, c, phase: starRand() * 6.28 };
});
export const Universe: React.FC<{ ignite: number }> = ({ ignite }) => {
  const frame = useCurrentFrame();
  const { width, height, landscape } = useLayout();
  const cx = landscape ? 1340 : W / 2, cy = landscape ? 540 : 760;
  const power = ramp(frame, ignite, ignite + 40);
  return (
    <AbsoluteFill style={{ background: C.space }}>
      <AbsoluteFill style={{ opacity: power, background: `radial-gradient(${landscape ? '44% 60% at 70% 50%' : '60% 34% at 50% 38%'}, ${C.brand}cc, transparent 72%), radial-gradient(44% 26% at 18% 72%, ${C.pink}22, transparent 70%), radial-gradient(50% 30% at 88% 14%, ${C.brand}88, transparent 70%)` }} />
      <svg width={width} height={height} style={{ position: 'absolute', inset: 0 }}>
        {STARS.filter(s => s.x < width && s.y < height).map((s, i) => {
          const dist = Math.hypot(s.x - cx, s.y - cy) / 1300;
          const on = ramp(frame, ignite + dist * 26, ignite + dist * 26 + 14);
          const twinkle = .72 + .28 * Math.sin(frame / 22 + s.phase);
          const drift = (frame * .06 * (s.r / 3)) % H;
          return <circle key={i} cx={s.x} cy={(s.y - drift + height) % height} r={s.r} fill={s.c} opacity={(.06 + .94 * on) * twinkle} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Symbol ONhostu: jen průhlednost a rovnoměrné měřítko (stisk 1 → 0,94 → 1). Nic jiného.
export const Symbol: React.FC<{ size: number; y: number; opacity: number; scale?: number }> = ({ size, y, opacity, scale = 1 }) => (
  <Img src={staticFile('brand/onhost-symbol.svg')} style={{ position: 'absolute', left: W / 2 - size / 2, top: y - size / 2, width: size, height: size, opacity, transform: `scale(${scale})` }} />
);

// Titulek: slova vyjíždějí zpod masky, na konci se rozplyne. Text drží bezpečnou zónu Reels (ne v horních 14 % a dolních 20 %).
export const Caption: React.FC<{ lines: { text: string; color?: string }[]; from: number; to: number; y?: number; size?: number; center?: boolean; ly?: number }> = ({ lines, from, to, y = 1150, size = 86, center = false, ly }) => {
  const frame = useCurrentFrame();
  const { landscape } = useLayout();
  // Na šířku: titulek vlevo vedle vizuálu (nebo na střed u závěru).
  const box: React.CSSProperties = landscape ? (center ? { left: 160, right: 160, top: ly ?? 600, textAlign: 'center' } : { left: 150, width: 900, top: ly ?? 400, textAlign: 'left' }) : { left: 90, right: 90, top: y, textAlign: 'center' };
  const out = 1 - ramp(frame, to - 12, to);
  let word = 0;
  return (
    <div style={{ position: 'absolute', ...box, opacity: out, fontFamily: 'League Spartan', fontWeight: 700, fontSize: landscape ? size * .84 : size, lineHeight: 1.06, letterSpacing: -1.5 }}>
      {lines.map((line, li) => (
        <div key={li} style={{ color: line.color ?? '#fff' }}>
          {line.text.split(' ').map((w, wi) => {
            const start = from + (word++) * 3;
            const p = ramp(frame, start, start + 16);
            // Maska s rezervou nahoře i dole, aby diakritika ani ocásky písmen nevykukovaly ani se neořízly.
            return <span key={wi} style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top', padding: '18px 0 18px', margin: '-18px .24em -18px 0' }}>
              <span style={{ display: 'inline-block', transform: `translateY(${(1 - p) * 130}%)`, opacity: Math.min(1, p * 3) }}>{w}</span>
            </span>;
          })}
        </div>
      ))}
    </div>
  );
};

// Malý popisek (Inter), např. „kontrola každou minutu“.
export const Label: React.FC<{ text: string; y: number; opacity: number; color?: string; size?: number; spacing?: number }> = ({ text, y, opacity, color = C.lilac200, size = 30, spacing = 4 }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: y, textAlign: 'center', fontFamily: 'Inter Variable', fontWeight: 600, fontSize: size, letterSpacing: spacing, textTransform: 'uppercase', color, opacity }}>{text}</div>
);
