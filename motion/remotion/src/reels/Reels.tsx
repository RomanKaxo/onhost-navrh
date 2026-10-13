import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, Caption, Label, Symbol, Universe, ramp, W } from './kit';
import { Backups, Horizon, Monitor, Outro, ProductOrbit, Ssl, Support, WorldNet } from './scenes';

// Reels „Zapněte svůj web“ — 1080×1920, 30 fps, 1080 snímků (36 s). Scénář: docs/reels-scenar.md.
// Intervaly scén [od, do) ve snímcích kompozice:
const S = {
  dark: [0, 90], press: [90, 150], night: [150, 300], monitor: [300, 420], backups: [420, 540],
  ssl: [540, 660], world: [660, 780], support: [780, 900], products: [900, 990], outro: [990, 1080],
} as const;
const PRESS = 96; // snímek stisku vypínače
export const REELS_FRAMES = 1080;

export const Reels: React.FC = () => {
  const frame = useCurrentFrame();
  // Symbol: vynoří se z tmy, stisk = 1 → 0,94 → 1, pak odjede nahoru a zmizí; v produktech se vrátí doprostřed oběžné dráhy.
  const press = frame < PRESS ? 1 : frame < PRESS + 4 ? 1 - .06 * ((frame - PRESS) / 4) : frame < PRESS + 8 ? .94 + .06 * ((frame - PRESS - 4) / 4) : 1;
  const symbolIn = ramp(frame, 12, 60);
  const symbolAway = ramp(frame, S.night[0], S.night[0] + 30);
  const symbolBack = ramp(frame, S.products[0], S.products[0] + 18) * (1 - ramp(frame, S.outro[0] - 10, S.outro[0] + 6));
  const symbolOpacity = Math.max(symbolIn * (1 - symbolAway), symbolBack);
  const symbolY = frame < S.products[0] ? 760 - 120 * symbolAway : 760;
  const symbolSize = frame < S.products[0] ? 240 : 180;
  const ring = ramp(frame, PRESS + 4, PRESS + 40) * (1 - symbolAway);
  const end = 1 - ramp(frame, REELS_FRAMES - 16, REELS_FRAMES - 1); // poslední snímky se vrací do tmy → plynulá smyčka
  return (
    <AbsoluteFill style={{ background: C.space }}>
      <AbsoluteFill style={{ opacity: end }}>
        <Universe ignite={PRESS} />
        <Horizon enter={S.night[0]} exit={S.ssl[0] + 20} ignite={S.night[0] + 40} />
        <svg width={W} height={1920} style={{ position: 'absolute', inset: 0 }}>
          <circle cx={W / 2} cy={760} r={250 + 40 * ring} fill="none" stroke={C.lilac} strokeOpacity={.35 * ring} strokeWidth={2} />
          <circle cx={W / 2} cy={760} r={330 + 60 * ring} fill="none" stroke={C.lilac} strokeOpacity={.18 * ring} strokeWidth={1.5} strokeDasharray="8 12" />
        </svg>
        <Symbol size={symbolSize} y={symbolY} opacity={symbolOpacity} scale={press} />
        <Label text={frame < PRESS ? 'OFF' : 'ON'} y={940} opacity={symbolIn * (1 - symbolAway)} color={frame < PRESS ? C.lilac200 : C.hot} size={32} spacing={14} />
        <Caption lines={[{ text: 'Zapnuto.' }]} from={PRESS + 12} to={S.press[1]} y={1080} />

        <Caption lines={[{ text: 'Je 3:00 ráno.' }, { text: 'Váš web běží.', color: C.lilac200 }]} from={S.night[0] + 30} to={S.night[1]} y={560} />
        <Monitor from={S.monitor[0]} to={S.monitor[1]} />
        <Caption lines={[{ text: 'Dostupnost hlídáme' }, { text: 'každou minutu.', color: C.lilac200 }]} from={S.monitor[0] + 6} to={S.monitor[1]} y={1000} />
        <Backups from={S.backups[0]} to={S.backups[1]} />
        <Caption lines={[{ text: 'Zálohujeme každou noc.' }, { text: '14 dní zpátky.', color: C.lilac200 }]} from={S.backups[0] + 6} to={S.backups[1]} y={1000} />

        <Ssl from={S.ssl[0]} to={S.ssl[1]} />
        <Caption lines={[{ text: 'SSL certifikát zdarma.' }, { text: 'Obnoví se sám.', color: C.lilac200 }]} from={S.ssl[0] + 10} to={S.ssl[1]} y={1200} />
        <WorldNet from={S.world[0]} to={S.world[1]} />
        <Caption lines={[{ text: 'Vlastní infrastruktura.' }, { text: 'Tier III, Praha.', color: C.lilac200 }]} from={S.world[0] + 10} to={S.world[1]} y={1200} />
        <Support from={S.support[0]} to={S.support[1]} />
        <Caption lines={[{ text: 'Výpadek? Reagujeme' }, { text: 'do hodiny. Česky.', color: C.lilac200 }]} from={S.support[0] + 8} to={S.support[1]} y={1000} />

        <ProductOrbit from={S.products[0]} to={S.products[1]} names={['web', 'vps', 'domains', 'mail', 'database', 'game']} />
        <Caption lines={[{ text: 'Od 49 Kč měsíčně' }, { text: 'bez DPH.', color: C.lilac200 }]} from={S.products[0] + 8} to={S.products[1]} y={1170} />

        <Outro from={S.outro[0]} />
        <Caption lines={[{ text: 'Zapněte svůj web.' }]} from={S.outro[0] + 14} to={REELS_FRAMES + 40} y={980} size={80} />
        <Label text="onhost.cz" y={1120} opacity={ramp(frame, S.outro[0] + 30, S.outro[0] + 50)} color={C.lilac200} size={34} spacing={6} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
