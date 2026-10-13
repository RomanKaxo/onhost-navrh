import React, { useEffect, useState } from 'react';
import { AbsoluteFill, Img, continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';
import { C, H, W, ramp, rng, useLayout } from './kit';
import { PlanetFx } from './planetfx';

// ── Horizont datové planety: body na kouli (Fibonacciho mřížka), ortografický pohled na horní okraj.
// Světla „měst“ se rozsvěcují od jednoho místa (Praha) a spojují se tenkými linkami.
const N = 2600, R = 1520;
const sphere = Array.from({ length: N }, (_, i) => {
  const y = 1 - (i + .5) / N * 2, r = Math.sqrt(1 - y * y), th = i * 2.399963;
  return { x: Math.cos(th) * r, y, z: Math.sin(th) * r };
});
const cityRand = rng(5);
const lit = sphere.map(() => cityRand() < .5);
const tilt = -1.02; // náklon k divákovi: vidíme horní čepičku koule
const project = (p: { x: number; y: number; z: number }, spin: number) => {
  const x1 = p.x * Math.cos(spin) + p.z * Math.sin(spin), z1 = -p.x * Math.sin(spin) + p.z * Math.cos(spin);
  const y2 = p.y * Math.cos(tilt) - z1 * Math.sin(tilt), z2 = p.y * Math.sin(tilt) + z1 * Math.cos(tilt);
  return { x: x1, y: y2, z: z2 };
};
export const Horizon: React.FC<{ enter: number; exit: number; ignite: number }> = ({ enter, exit, ignite }) => {
  const frame = useCurrentFrame();
  const { width: FW, height: FH, landscape } = useLayout();
  const CX = landscape ? 1240 : W / 2;
  const rise = ramp(frame, enter, enter + 50) * (1 - ramp(frame, exit - 30, exit));
  const cy = FH + R - FH * .365 * rise + 120; // okraj planety vyjede zespodu (na výšku horní okraj kolem y≈1340)
  const spin = frame / 900;
  const origin = { x: CX + 120, y: cy - R + 90 };
  const pts = sphere.map((p, i) => {
    const q = project(p, spin);
    return { i, sx: CX + q.x * R, sy: cy - q.y * R, z: q.z, lit: lit[i] };
  }).filter(p => p.z > 0 && p.sy < FH + 10 && p.sy > cy - R - 10 && p.sx > -10 && p.sx < FW + 10);
  const wave = (p: { sx: number; sy: number }) => { const d = Math.hypot(p.sx - origin.x, p.sy - origin.y) / 9; return ramp(frame, ignite + d, ignite + d + 12); };
  const litPts = pts.filter(p => p.lit);
  // Každé světlo se spojí se dvěma nejbližšími sousedy (síť mezi „městy“).
  const links: [typeof litPts[number], typeof litPts[number]][] = [];
  litPts.forEach((a, k) => {
    const near = litPts.map((b, j) => ({ b, j, d: Math.hypot(a.sx - b.sx, a.sy - b.sy) })).filter(x => x.j > k && x.d < 90).sort((x, y) => x.d - y.d).slice(0, 2);
    near.forEach(x => links.push([a, x.b]));
  });
  if (rise <= 0) return null;
  return (
    <AbsoluteFill>
      <svg width={FW} height={FH}>
        <defs>
          <radialGradient id="body" cx="50%" cy="0%" r="70%"><stop offset="0" stopColor={C.deep} /><stop offset=".5" stopColor="#1a0330" /><stop offset="1" stopColor={C.space} /></radialGradient>
          <filter id="glow"><feGaussianBlur stdDeviation="18" /></filter>
        </defs>
        <circle cx={CX} cy={cy} r={R + 10} fill="none" stroke={C.lilac} strokeWidth={30} opacity={.35 * rise} filter="url(#glow)" />
        <circle cx={CX} cy={cy} r={R} fill="url(#body)" />
        <circle cx={CX} cy={cy} r={R} fill="none" stroke={C.lilac200} strokeWidth={2.5} opacity={.8 * rise} />
        {pts.map(p => <circle key={p.i} cx={p.sx} cy={p.sy} r={1.2 + p.z * 1.4} fill={C.lilac} opacity={.18 + .3 * p.z} />)}
        {links.map(([a, b], k) => <line key={k} x1={a.sx} y1={a.sy} x2={b.sx} y2={b.sy} stroke={C.pink} strokeWidth={1.4} opacity={.55 * Math.min(wave(a), wave(b))} />)}
        {litPts.map(p => { const w = wave(p); return <circle key={`l${p.i}`} cx={p.sx} cy={p.sy} r={2 + p.z * 2.4} fill={p.i % 4 ? C.hot : C.lilac50} opacity={w * (.6 + .4 * p.z)} />; })}
        <circle cx={origin.x} cy={origin.y} r={7} fill={C.pink} opacity={ramp(frame, ignite - 6, ignite + 6)} />
      </svg>
    </AbsoluteFill>
  );
};

// ── Monitoring: EKG linka s běžícím pulzem a „živá“ tečka.
export const Monitor: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const show = ramp(frame, from, from + 14) * (1 - ramp(frame, to - 12, to));
  return <AbsoluteFill style={{ opacity: show }}><PlanetFx name="monitoring" size={600} x={W / 2} y={620} from={from} /></AbsoluteFill>;
};

// ── Zálohy: 14 nocí jako body na ose, poslední (dnešní) růžová.
export const Backups: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const show = 1 - ramp(frame, to - 12, to);
  const x0 = 150, step = (W - 300) / 13, dy = 950;
  return (
    <AbsoluteFill style={{ opacity: show * ramp(frame, from, from + 14) }}>
      <PlanetFx name="backups" size={560} x={W / 2 - 60} y={600} from={from} />
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <line x1={x0} x2={W - x0} y1={dy} y2={dy} stroke={C.lilac} strokeOpacity={.3 * ramp(frame, from, from + 20)} strokeWidth={2} />
        {Array.from({ length: 14 }, (_, i) => {
          const p = ramp(frame, from + 6 + i * 4, from + 16 + i * 4);
          const today = i === 13;
          return <g key={i}>
            <circle cx={x0 + i * step} cy={dy} r={(today ? 14 : 9) * p} fill={today ? C.pink : C.lilac} />
            {today && <circle cx={x0 + i * step} cy={dy} r={26 + 6 * Math.sin(frame / 6)} fill="none" stroke={C.pink} strokeOpacity={.5 * p} strokeWidth={2} />}
          </g>;
        })}
      </svg>
    </AbsoluteFill>
  );
};

// Ilustrace planety z webu (public/planets, průhledné pozadí); bez obrázku záložní koule.
export const PlanetImg: React.FC<{ name: string; size: number; x: number; y: number; opacity?: number; brightness?: number }> = ({ name, size, x, y, opacity = 1, brightness = 1 }) => {
  const [ok, setOk] = useState(true);
  const style: React.CSSProperties = { position: 'absolute', left: x - size / 2, top: y - size / 2, width: size, height: size, opacity,
    filter: `${brightness < 1 ? `brightness(${brightness}) ` : ''}drop-shadow(0 24px 48px #12001Ecc)` }; // ilustrace mají průhledné pozadí
  return ok ? <Img src={staticFile(`planets/${name}.webp`)} style={style} onError={() => setOk(false)} />
    : <div style={{ ...style, borderRadius: '50%', background: `radial-gradient(circle at 34% 30%, ${C.lilac200}, ${C.brand} 55%, ${C.space})` }} />;
};

// ── SSL: planeta a soustředné prstence, které se sevřou jako zámek.
export const Ssl: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const show = ramp(frame, from, from + 16) * (1 - ramp(frame, to - 12, to));
  const close = ramp(frame, from + 8, from + 40);
  return (
    <AbsoluteFill style={{ opacity: show }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        {[0, 1, 2].map(i => <circle key={i} cx={W / 2} cy={740} r={(330 + i * 36) * (1.5 - .5 * close)} fill="none" stroke={i === 0 ? C.pink : C.lilac} strokeOpacity={(.6 - i * .18) * close} strokeWidth={i === 0 ? 3 : 1.5} />)}
      </svg>
      <PlanetFx name="ssl" size={720} x={W / 2} y={740} from={from} brightness={.35 + .65 * close} />
    </AbsoluteFill>
  );
};

// ── Mapa sítě: souhvězdí světa z dat webu, Praha jako růžová hvězda, linky se kreslí podle vzdálenosti od Prahy.
type World = { width: number; height: number; points: { x: number; y: number; hop?: number }[]; edges: { a: number; b: number; hop: number }[]; routes: number[][] };
export const WorldNet: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const [world, setWorld] = useState<World | null>(null);
  const [handle] = useState(() => delayRender('world-network'));
  useEffect(() => { fetch(staticFile('data/world-network.json')).then(r => r.json()).then(d => { setWorld(d); continueRender(handle); }).catch(() => continueRender(handle)); }, [handle]);
  if (!world) return null;
  const show = ramp(frame, from, from + 12) * (1 - ramp(frame, to - 12, to));
  const s = 1500 / world.width, ox = (W - world.width * s) / 2 - 180, oy = 520; // zoom na Evropu
  const maxHop = Math.max(...world.edges.map(e => e.hop), 1);
  const P = (i: number) => ({ x: ox + world.points[i].x * s, y: oy + world.points[i].y * s });
  const o = P(0);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0, opacity: show }}>
      {world.edges.map((e, k) => {
        const p = ramp(frame, from + 4 + (e.hop / maxHop) * 60, from + 14 + (e.hop / maxHop) * 60);
        if (p <= 0) return null;
        const a = P(e.a), b = P(e.b);
        return <line key={k} x1={a.x} y1={a.y} x2={a.x + (b.x - a.x) * p} y2={a.y + (b.y - a.y) * p} stroke={C.lilac} strokeOpacity={.4} strokeWidth={1.4} />;
      })}
      {world.points.map((pt, i) => { const q = P(i); return <circle key={i} cx={q.x} cy={q.y} r={2.2} fill={C.lilac50} opacity={.75 * ramp(frame, from + 4 + ((pt.hop ?? 0) / maxHop) * 60, from + 14 + ((pt.hop ?? 0) / maxHop) * 60)} />; })}
      {world.routes.slice(0, 8).map((route, k) => {
        const t = ((frame - from - 30 - k * 9) / 70);
        if (t < 0) return null;
        const pos = (t % 1) * (route.length - 1), i = Math.floor(pos), f = pos - i;
        const a = P(route[i]), b = P(route[Math.min(i + 1, route.length - 1)]);
        return <circle key={`r${k}`} cx={a.x + (b.x - a.x) * f} cy={a.y + (b.y - a.y) * f} r={5} fill={k % 2 ? C.lilac200 : C.hot} />;
      })}
      <circle cx={o.x} cy={o.y} r={26 + 8 * Math.sin(frame / 8)} fill={C.pink} opacity={.18} />
      <circle cx={o.x} cy={o.y} r={11} fill={C.pink} />
    </svg>
  );
};

// ── Podpora: karta urgentního požadavku a kruhový odpočet „do 1 hodiny“.
export const Support: React.FC<{ from: number; to: number }> = ({ from, to }) => {
  const frame = useCurrentFrame();
  const show = ramp(frame, from, from + 14) * (1 - ramp(frame, to - 12, to));
  return <AbsoluteFill style={{ opacity: show }}><PlanetFx name="support" size={640} x={W / 2} y={640} from={from} /></AbsoluteFill>;
};

// ── Produkty: planety obíhají kolem symbolu po elipse (přední polovina větší a jasnější).
export const ProductOrbit: React.FC<{ from: number; to: number; names: string[] }> = ({ from, to, names }) => {
  const frame = useCurrentFrame();
  const show = ramp(frame, from, from + 16) * (1 - ramp(frame, to - 12, to));
  const items = names.map((name, i) => {
    const a = (i / names.length) * Math.PI * 2 + (frame - from) / 70;
    const depth = (Math.sin(a) + 1) / 2; // 0 vzadu, 1 vpředu
    return { name, i, a, depth };
  }).sort((p, q) => p.depth - q.depth);
  return (
    <AbsoluteFill style={{ opacity: show }}>
      <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
        <ellipse cx={W / 2} cy={760} rx={420} ry={250} fill="none" stroke={C.lilac} strokeOpacity={.3} strokeWidth={1.5} strokeDasharray="6 10" />
      </svg>
      {items.map(({ name, i, a, depth }) => (
        <PlanetFx key={name} name={name} size={150 + depth * 80} x={W / 2 + Math.cos(a) * 420} y={760 + Math.sin(a) * 250} from={from} brightness={.5 + .5 * depth} opacity={ramp(frame, from + i * 3, from + 14 + i * 3)} />
      ))}
    </AbsoluteFill>
  );
};

export const Outro: React.FC<{ from: number }> = ({ from }) => {
  const frame = useCurrentFrame();
  const show = ramp(frame, from, from + 20);
  const { width, landscape } = useLayout();
  return <Img src={staticFile('brand/onhost-horizontal.svg')} style={{ position: 'absolute', left: width / 2 - 330, top: landscape ? 330 : 700, width: 660, height: 'auto', opacity: show, transform: `scale(${.96 + .04 * show})` }} />;
};

// ── Gamehosting: herní planeta (bez postav) a po ní chodí kostičkové postavičky.
export const GameScene: React.FC<{ from: number; to: number; geo: { cx: number; cy: number; r: number }; image: string }> = ({ from, to, geo, image }) => {
  const frame = useCurrentFrame();
  const show = ramp(frame, from, from + 16) * (1 - ramp(frame, to - 12, to));
  return <AbsoluteFill style={{ opacity: show }}><PlanetFx name="game" image={image} crewGeo={geo} size={760} x={W / 2} y={740} from={from} /></AbsoluteFill>;
};
