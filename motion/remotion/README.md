# ONhost motion

Separate Remotion **4.0.535** project. All Remotion packages use the same exact version. React and fonts are local dependencies; SVGs are copied unchanged from `../../public/brand` by `prepare:assets`. No city names, service metrics, audio or external assets.

```sh
cd motion/remotion
rtk npm ci
rtk npm run studio
rtk npm run typecheck
rtk npm run render                 # all compositions, PNG + WebM + MP4
rtk npm run render:power-on
rtk npm run render:power-on-portrait
rtk npm run render:power-on-loop
rtk npm run render:power-on-loop-portrait
rtk npm run render:deploy
rtk npm run render:constellation
```

Output goes to the website's `public/media/<name>.{png,webm,mp4}`. Optional `POSTER_ONLY=1` renders just the PNG. If a system Chromium is needed, set `REMOTION_BROWSER=/absolute/path/to/chromium`. Default render concurrency is 2. The Remotion CLI may download its Chromium headless shell on first use.

| Composition | Name | Dimensions | Frames at 30 fps |
| --- | --- | --- | --- |
| PowerOn | power-on | 1920×1080 | 210 (7 s) |
| PowerOnPortrait | power-on-portrait | 1080×1920 | 210 (7 s) |
| PowerOnLoop | power-on-loop | 1920×1080 | 240 (8 s) |
| PowerOnLoopPortrait | power-on-loop-portrait | 1080×1920 | 240 (8 s) |
| Deploy | deploy | 1920×1080 | 240 (8 s) |
| Constellation | constellation | 1920×1080 | 240 (8 s) |

PowerOn: symbol press at frames 12–24 (uniform 1 → .94 → 1), ignition 20–72, separate orbit draws 40–90, horizontal logo fades in 126–150. Loop variant fades universe and horizontal logo out and restores the symbol 204–240. Frame 240 equals frame 0 conceptually; the final sampled frame is 239. Deploy and Constellation use periodic scenery and fade their one-way launch/drawing action out before the wrap. Logo images never rotate, stretch, recolour or receive visual effects; rings have generous separation from the symbol.

Self-hosted League Spartan 600/700 and Inter Variable match the website. Browser fonts are loaded by bundled CSS; no network font loading. All animation is deterministic from the current frame.

When integrating videos, use `preload="none"`, a poster, and no autoplay for `prefers-reduced-motion: reduce`. Start playback only while visible; pause on hidden tabs. Posters are the default reduced-motion presentation.

**Licence:** Remotion is free only for individuals and companies with up to **3 employees**. A company licence may be needed for ONhost or the team; confirm applicability before commercial use.

## Live section backgrounds (BgNebula, BgHorizon, BgDeep)

`rtk npm run render:bg [nebula|horizon|deep]` renders the website's illustrated backgrounds (`public/bg/bg-*.webp`) as 10 s loops at 24 fps, 1664×936 (source size, rendered at `--scale=2` and downscaled), and writes `public/bg/bg-<name>.webm` (VP9) and `.mp4` (H.264, faststart). `ENCODE_ONLY=1` re-encodes the existing master in `out/`. `scripts/find-stars.mjs` detects the stars to twinkle (`src/bg/stars.json`). The image is never zoomed, panned or recoloured: clouds are warped by fractal noise whose offset travels a full circle per loop (frame 240 ≡ frame 0), planets stay sharp and static, stars twinkle 1–3× per loop. The site shows them via `src/components/BgVideo.astro`; the still webp stays the fallback and the reduced-motion view.
