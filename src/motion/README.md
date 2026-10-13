# Motion integration

Vanilla JS; no GSAP or WebGL libraries enter these bundles. `Base.astro` includes `PageTransitions.astro` once in its head (Astro `ClientRouter`, swap fallback). All URLs use the configured `/onhost-navrh` base.

```astro
---
import Cosmos from '../components/motion/Cosmos.astro';
import PowerSwitch from '../components/motion/PowerSwitch.astro';
import Orbit from '../components/motion/Orbit.astro';
import Reveal from '../components/motion/Reveal.astro';
---
<section class="hero">
  <Cosmos id="hero-cosmos" on={false} dpr={1.5} planet />
  <div class="foreground">
    <Orbit size="min(76vw, 440px)" rings={2} duration={48}>
      <PowerSwitch target="hero-cosmos" size={100} label="Napájení vesmíru" />
    </Orbit>
  </div>
</section>
<Reveal delay={90}><article>…</article></Reveal>
<style>
  .hero { position: relative; min-height: 650px; }
  .foreground { position: relative; z-index: 1; }
</style>
```

- **Cosmos:** required unique `id`; `on=true`; `dpr=1.5` (capped at 2); optional `class`. Absolutely fills its positioned parent. Decorative and hidden from assistive technology. No-JS / unavailable-WebGL fallback is a static CSS gradient. Reduced motion initializes lit even with `on=false` and draws without requesting animation frames. Explicit user power changes then apply instantly. WebGL1 is preferred, WebGL2 is supported. Context loss switches to CSS. Pointer parallax is attached to the surrounding section, not the pointer-transparent canvas. ResizeObserver handles backing resolution.
- **PowerSwitch:** required `target` equals Cosmos ID; `label="Zapnout vesmír"`; `size=96` (minimum 50); optional `class`. Native button supports Enter/Space, `aria-pressed`, `aria-controls`, visible ON/OFF text and keyboard focus. On dark brand backgrounds, original SVG renders approved white/pink. Press is uniform `scale(1) → scale(.94) → scale(1)` over 220 ms; no rotation, effects or colour changes. Keep ample clear space around the logo when customizing sizes.
- **Orbit:** `size="min(100%, 360px)"`, `duration=48` seconds, `rings=2` (1–4), `paused=false`, optional `class`. Default slot stays stationary, named `planets` slot accepts custom stationary decorations positioned by your own CSS. Built-in planets move on rotating decorative rings; no rotation is applied to slot content. Rings stop offscreen/hidden and under reduced motion. Around a logo, use a large enough orbit that every ring stays outside the logo's protective zone.
- **Reveal:** `delay=0` milliseconds (0–500), optional `class`; default slot. Once-per-document IntersectionObserver reveal; no-JS content remains visible. Reduced motion shows content immediately without transforms. You can also use `data-reveal` on elements when the Reveal component script is present, or initialize `reveal(elements)` yourself.
- **PageTransitions:** included in Base. Do not mount a second ClientRouter. Motion setup is repeated on `astro:page-load` and cleaned up on `astro:before-swap`; RAF, observers, GPU objects, listeners and press animations are disposed. Reduced motion disables root view-transition animations.

Programmatic control after component initialization:

```js
import { getCosmos } from './cosmos.js';
getCosmos(document.getElementById('hero-cosmos'))?.setPower(true, { duration: 1600 });
// duration in milliseconds; 0 means immediate. `.on` gives the target power state.
```

For standalone mounting, `createCosmos(host, {on, dpr, planet})` returns `{on, setPower, destroy}`. Call `destroy()` before removing its host. Use `bindPower(button)`, `observeOrbits(elements)` and `reveal(elements)` for custom wrappers; each returns a cleanup function. `onPage(setup)` supplies Astro document lifecycle handling.

Preview at `/onhost-navrh/motion-lab`. Video source, scripts and licence note are in `../../motion/remotion/README.md`.


## Power planet

Opt in with `<Cosmos id="hero-cosmos" on={false} planet />`, or use
`planet={{ x: .5, y: 1.68, radius: 1 }}`. Default is `false`, preserving the
starfield-only scene. `x` and `y` are center fractions measured from the top-left;
`radius` is in canvas heights. The radius expands on wide canvases while preserving
`y - radius` (the upper limb height), keeping the default horizon at 68% on portrait
and ultrawide screens. The component serializes this option in `data-planet`.

The same full-screen triangle shades the orthographic ray/sphere intersection,
three-octave procedural terrain, upper-left terminator, thin lilac/pink atmosphere,
and sparse jittered city nodes with faint connections. Surface rotation takes
approximately 12 minutes per revolution; planet parallax is 24% of star parallax.
`setPower(on, {duration})` keeps its existing contract: stars/terrain transition over
that duration, ignition spreads from one surface origin over 1500 ms, and shutdown
city lights fade over 1.35 times the duration. Rapid toggles retain current brightness;
`duration: 0` applies the complete state immediately.

Reduced motion initializes one static lit frame, with instant explicit power changes.
Off scenes stop their RAF once the lights finish fading; hidden/offscreen scenes pause
both rotation and ignition. CSS fallback retains a radial-gradient horizon even after
context loss. This is an abstract brand-colour planet, not geographic Earth imagery.

Performance budget: default DPR 1.5, capped at 2, low-power context, one draw call,
no textures or external rendering library. Browser RAF measurements describe frame
pacing on the measured renderer; validate on a physical integrated GPU before claiming
hardware-specific 60 fps.


Measured in headless Chromium / ANGLE SwiftShader (software Vulkan), 180 RAF samples
per viewport at browser DPR 1: 1440×900 mean 35.19 ms, p95 50.0 ms;
390×844 mean 16.67 ms, p95 16.8 ms. These are full-page frame intervals, not GPU
execution timings; physical integrated-GPU 60 fps remains unverified. The lab loads
27,799 bytes of JS across its entrypoints and shared chunks (11,204 bytes summed gzip);
the Cosmos renderer chunk is 8,737 bytes (3,895 gzip).

Verified: build; Chromium WebGL1 and forced WebGL2; no horizontal overflow at the
required viewports; 2560×900 composition; no-JS / no-WebGL horizon; context-loss
fallback; reduced-motion lit initialization with zero RAF requests; fully-off,
offscreen and hidden-tab loop suspension; resume on reentry. Required OFF and ON
(after 2500 ms) screenshots, ignition samples and JSON measurement reports are in
`/tmp/claude-1000/-home-roman/0769163a-bb85-4963-bd8a-0534bc2582b6/scratchpad/codex-planet/`.
