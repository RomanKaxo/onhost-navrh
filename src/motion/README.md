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
  <Cosmos id="hero-cosmos" on={false} dpr={1.5} />
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

For standalone mounting, `createCosmos(host, {on, dpr})` returns `{on, setPower, destroy}`. Call `destroy()` before removing its host. Use `bindPower(button)`, `observeOrbits(elements)` and `reveal(elements)` for custom wrappers; each returns a cleanup function. `onPage(setup)` supplies Astro document lifecycle handling.

Preview at `/onhost-navrh/motion-lab`. Video source, scripts and licence note are in `../../motion/remotion/README.md`.
