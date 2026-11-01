/** Decorative availability illustration, never infrastructure locations.
 * Projection matches the pinned COBE 0.6.5 shader's J(theta, phi) and radius .8.
 */
type Vector = readonly [number, number, number];
type View = { phi: number; theta: number; scale: number; offset: readonly [number, number]; pixelRatio: number };
const radians = Math.PI / 180;
export function globeLocation(latitude: number, longitude: number): Vector {
  const lat = latitude * radians, lon = longitude * radians;
  return [Math.cos(lat) * Math.cos(lon), Math.sin(lat), -Math.cos(lat) * Math.sin(lon)];
}

export function projectGlobePoint(point: Vector, view: View, width: number, height: number) {
  const [x, y, z] = point;
  const cp = Math.cos(view.phi), sp = Math.sin(view.phi);
  const ct = Math.cos(view.theta), st = Math.sin(view.theta);
  const px = cp * x + sp * z;
  const py = sp * st * x + ct * y - cp * st * z;
  const depth = -sp * ct * x + st * y + cp * ct * z;
  const radius = height * 0.4 * view.scale;
  return {
    x: width / 2 + radius * px + view.offset[0] * view.scale / (2 * view.pixelRatio),
    y: height / 2 - radius * py + view.offset[1] * view.scale / (2 * view.pixelRatio),
    // Elevated arcs may remain visible beyond the silhouette, but never through Earth.
    visible: depth >= 0 || px * px + py * py > 1.002,
  };
}

const origin = globeLocation(50.08, 14.43);
// Illustrative destinations only. No labels or persistent destination markers.
const destinations = [[51.51, -0.13], [40.71, -74.01], [48.86, 2.35], [1.35, 103.82],
  [41.9, 12.5], [59.33, 18.07], [40.42, -3.7], [52.52, 13.41]];
const routes = destinations.map(([lat, lon]) => {
  const end = globeLocation(lat, lon);
  const angle = Math.acos(Math.max(-1, Math.min(1, origin.reduce((sum, v, i) => sum + v * end[i], 0))));
  const lift = 0.12 + angle * 0.16;
  return Array.from({ length: 65 }, (_, i): Vector => {
    const t = i / 64;
    const a = Math.sin((1 - t) * angle) / Math.sin(angle);
    const b = Math.sin(t * angle) / Math.sin(angle);
    const height = 1 + Math.sin(Math.PI * t) * lift;
    return [(a * origin[0] + b * end[0]) * height,
      (a * origin[1] + b * end[1]) * height, (a * origin[2] + b * end[2]) * height];
  });
});

export function createGlobeLasers(globe: HTMLCanvasElement) {
  const canvas = document.createElement('canvas');
  canvas.className = 'network-globe__lasers';
  canvas.setAttribute('aria-hidden', 'true');
  globe.parentElement?.append(canvas);
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, pixelRatio = 0;
  let elapsed = 0;

  return {
    render(view: View, delta: number, reducedMotion: boolean) {
      if (!ctx) return;
      const w = globe.offsetWidth, h = globe.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      if (w !== width || h !== height || dpr !== pixelRatio) {
        width = w; height = h; pixelRatio = dpr;
        canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      ctx.clearRect(0, 0, width, height);
      if (reducedMotion || !width || !height) return;
      elapsed += delta;
      ctx.lineCap = 'round';
      const cycle = 6.8;
      routes.forEach((route, index) => {
        const age = (elapsed - index * 0.72) % cycle;
        if (age < 0 || age > 2.25) return;
        const head = Math.min(age / 1.65, 1);
        const fade = Math.min(age / 0.15, 1) * Math.min((2.25 - age) / 0.45, 1);
        const points = route.map(point => projectGlobePoint(point, view, width, height));
        // A dim trail and a short, bright moving pulse share the same clipped path.
        for (const glow of [true, false]) {
          for (let i = 1; i < points.length; i++) {
            const t = i / 64;
            if (t > head || !points[i - 1].visible || !points[i].visible) continue;
            const pulse = Math.max(0, 1 - (head - t) / 0.2);
            ctx.strokeStyle = glow ? `rgba(180,82,255,${(0.08 + pulse * 0.25) * fade})`
              : `rgba(255,${Math.round(80 + pulse * 140)},${Math.round(175 + pulse * 65)},${(0.17 + pulse * 0.8) * fade})`;
            ctx.lineWidth = glow ? 5 : 1.25;
            ctx.beginPath(); ctx.moveTo(points[i - 1].x, points[i - 1].y);
            ctx.lineTo(points[i].x, points[i].y); ctx.stroke();
          }
        }
        const tip = points[Math.min(64, Math.floor(head * 64))];
        if (tip.visible && age < 1.65) {
          ctx.fillStyle = '#ffe5f5';
          ctx.beginPath(); ctx.arc(tip.x, tip.y, 1.8, 0, Math.PI * 2); ctx.fill();
        }
        const impact = (age - 1.65) / 0.6;
        const end = points[64];
        if (impact >= 0 && impact <= 1 && end.visible) {
          ctx.strokeStyle = `rgba(255,130,212,${(1 - impact) * 0.8})`;
          ctx.lineWidth = 1.3;
          ctx.beginPath(); ctx.arc(end.x, end.y, 2 + impact * 9, 0, Math.PI * 2); ctx.stroke();
          ctx.fillStyle = `rgba(255,224,247,${1 - impact})`;
          ctx.beginPath(); ctx.arc(end.x, end.y, 2.5 * (1 - impact), 0, Math.PI * 2); ctx.fill();
        }
      });
    },
    destroy() { canvas.remove(); },
  };
}
