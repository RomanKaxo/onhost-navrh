// Node 22+ native TypeScript stripping; no test dependency required.
import assert from 'node:assert/strict';
import { globeLocation, projectGlobePoint } from '../src/lib/globe-lasers.ts';

const view = { phi: 0, theta: 0, scale: 1, offset: [0, 0], pixelRatio: 2 };
const close = (actual, expected) => assert.ok(Math.abs(actual - expected) < 1e-8, `${actual} != ${expected}`);
const front = projectGlobePoint(globeLocation(0, -90), view, 600, 600);
close(front.x, 300); close(front.y, 300); assert.equal(front.visible, true);
assert.equal(projectGlobePoint(globeLocation(0, 90), view, 600, 600).visible, false);
const north = projectGlobePoint(globeLocation(90, 0), view, 600, 600);
close(north.y, 60);
// Far-side points disappear inside Earth, while elevated arcs can clear its rim.
assert.equal(projectGlobePoint([0.9, 0, -0.3], view, 600, 600).visible, false);
assert.equal(projectGlobePoint([1.1, 0, -0.3], view, 600, 600).visible, true);

let roundtrips = 0;
for (const phi of [0, 1.4, 4.46, 7]) for (const theta of [-0.4, 0, 0.55]) {
  for (const location of [[50.08, 14.43], [40.71, -74.01], [1.35, 103.82]]) {
    const world = globeLocation(...location);
    const projected = projectGlobePoint(world, { ...view, phi, theta }, 600, 480);
    // Reconstruct world coordinates using COBE's fragment shader l * J(theta, phi).
    const x = (projected.x - 300) / 192, y = (240 - projected.y) / 192;
    if (!projected.visible) continue;
    const z = Math.sqrt(Math.max(0, 1 - x * x - y * y));
    const cp = Math.cos(phi), sp = Math.sin(phi), ct = Math.cos(theta), st = Math.sin(theta);
    const reconstructed = [cp * x + sp * st * y - sp * ct * z,
      ct * y + st * z, sp * x - cp * st * y + cp * ct * z];
    reconstructed.forEach((value, i) => close(value, world[i]));
    roundtrips++;
  }
}
const shifted = projectGlobePoint(globeLocation(0, -90), { ...view, scale: 1.2, offset: [20, 40] }, 600, 600);
close(shifted.x, 306); close(shifted.y, 312);
console.log(`Projection verified: ${roundtrips} shader roundtrips, cardinal points, horizon occlusion, scale and offset.`);
