import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FPS } from './kit';

// Kostičkové postavičky (stejné jako na webu, src/components/VoxelCrew.astro), animované po snímcích:
// chodí tam a zpět po oblouku kolem středu koule, kývají rukama a nohama, jedna občas vyskočí, druhá máchne mečem.
type Look = { hair: string; shirt: string; pants: string; skin: string; item: 'sword' | 'block'; period: number; phase: number; arc: number; center: number; jump?: boolean };
const CREW: Look[] = [
  { hair: '#3C096C', shirt: '#E91E7A', pants: '#2C0A3E', skin: '#F1E2FF', item: 'sword', period: 6.4, phase: 0, arc: 20, center: -24 },
  { hair: '#F72585', shirt: '#BB88EB', pants: '#3C096C', skin: '#E0BEFF', item: 'block', period: 8, phase: 2.2, arc: 10, center: -13, jump: true },
];

const Figure: React.FC<{ look: Look; t: number }> = ({ look: c, t }) => {
  const step = Math.sin(t * Math.PI * 2 / .6) * 28; // kyvadlo končetin (stupně)
  const bob = Math.abs(Math.sin(t * Math.PI * 2 / .6)) * -.8;
  const slashT = (t % 5) / 5; // máchnutí mečem každých 5 s
  const slash = c.item === 'sword' && slashT > .84 ? (slashT < .9 ? -150 * (slashT - .84) / .06 : -150 + 170 * Math.min(1, (slashT - .9) / .06)) : 0;
  const limb = (deg: number, x: number, y: number) => `rotate(${deg} ${x} ${y})`;
  return (
    <g transform={`translate(0 ${bob})`}>
      <g transform={limb(-step, 10, 26)}><rect x="8" y="26" width="4" height="12" fill={c.pants} /><rect x="8" y="36" width="4" height="2" fill="#12001E" opacity=".5" /></g>
      <g transform={limb(step, 4, 14)}><rect x="2" y="14" width="4" height="12" fill={c.shirt} opacity=".75" /><rect x="2" y="24" width="4" height="2" fill={c.skin} opacity=".8" /></g>
      <rect x="6" y="14" width="12" height="12" fill={c.shirt} />
      <rect x="6" y="14" width="12" height="3" fill="#fff" opacity=".12" />
      <rect x="6" y="2" width="12" height="12" fill={c.skin} /><rect x="6" y="2" width="12" height="4" fill={c.hair} /><rect x="6" y="2" width="3" height="8" fill={c.hair} />
      <rect x="12" y="8" width="2" height="2" fill="#12001E" /><rect x="15" y="8" width="2" height="2" fill="#12001E" />
      <g transform={limb(step, 14, 26)}><rect x="12" y="26" width="4" height="12" fill={c.pants} /><rect x="12" y="36" width="4" height="2" fill="#12001E" opacity=".5" /></g>
      <g transform={limb(-step + slash, 20, 14)}>
        <rect x="18" y="14" width="4" height="12" fill={c.shirt} /><rect x="18" y="24" width="4" height="2" fill={c.skin} />
        {c.item === 'sword'
          ? <g><rect x="19" y="10" width="2" height="16" fill="#F1E2FF" /><rect x="17" y="24" width="6" height="2" fill="#3C096C" /><rect x="19" y="26" width="2" height="3" fill="#3C096C" /></g>
          : <g><rect x="17" y="23" width="7" height="7" fill="#BB88EB" /><rect x="17" y="23" width="7" height="2" fill="#F1E2FF" opacity=".6" /></g>}
      </g>
    </g>
  );
};

// cx, cy, r = střed koule a poloměr dráhy chůze v pixelech (dráha vede po viditelném povrchu před arénou).
export const Crew: React.FC<{ cx: number; cy: number; r: number; from: number; opacity?: number }> = ({ cx, cy, r, from, opacity = 1 }) => {
  const frame = useCurrentFrame();
  const t = Math.max(0, frame - from) / FPS;
  const h = r * .42 * (40 / 24); // výška postavičky
  return (
    <svg style={{ position: 'absolute', inset: 0, overflow: 'visible', opacity }} width="100%" height="100%">
      {CREW.map((c, i) => {
        const tt = t + c.phase;
        const angle = c.center + c.arc * Math.sin(tt * Math.PI * 2 / c.period);
        const facing = Math.cos(tt * Math.PI * 2 / c.period) >= 0 ? 1 : -1; // čelem po směru chůze
        const jT = (tt % 4.2) / 4.2;
        const jump = c.jump && jT > .7 && jT < .9 ? Math.sin((jT - .7) / .2 * Math.PI) * h * .6 : 0;
        const s = h / 40;
        return (
          <g key={i} transform={`rotate(${angle} ${cx} ${cy})`}>
            <g transform={`translate(${cx} ${cy - r - jump}) scale(${facing * s} ${s}) translate(-12 -40)`}>
              <Figure look={c} t={tt} />
            </g>
          </g>
        );
      })}
    </svg>
  );
};
