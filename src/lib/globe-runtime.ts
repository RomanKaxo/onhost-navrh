import createGlobe, { type COBEOptions } from "cobe";
export type { COBEOptions } from "cobe";

/** Adapter used only by the verbatim 21st.dev component (see astro.config.mjs).
 * Keep its markup/utility classes intact while respecting motion and visibility.
 */
export default function createOnhostGlobe(canvas: HTMLCanvasElement, options: COBEOptions) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let visible = true;
  let destroyed = false;
  let phi = options.phi;
  let pointerX: number | null = null;
  let drag = 0;
  let lastDrag = 0;
  // COBE probes WebGL before applying context options; create it with preservation first.
  // A stopped reduced-motion canvas must retain its pixels after compositing/readback.
  const context = { alpha: true, ...options.context, preserveDrawingBuffer: true };
  canvas.getContext("webgl2", context) ?? canvas.getContext("webgl", context);
  let instance: ReturnType<typeof createGlobe> | undefined;
  instance = createGlobe(canvas, {
    mapBaseBrightness: 0,
    ...options,
    context,
    onRender(state) {
      options.onRender(state);
      // The supplied callback closes over stale React state; keep drag in this boundary.
      if (!motion.matches && pointerX === null) phi += 0.005;
      state.phi = phi + drag;
      state.width = canvas.offsetWidth * options.devicePixelRatio;
      state.height = canvas.offsetHeight * options.devicePixelRatio;
      // COBE 0.6.5 sets NEAREST after its embedded map texture has loaded.
      // Wait for that observable state before stopping on a fully rendered poster.
      const gl = instance?.gl;
      if (motion.matches && gl && gl.getTexParameter(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER) === gl.NEAREST) {
        queueMicrotask(() => { if (!destroyed) instance?.toggle(false); });
      }
    },
  });
  const sync = () => {
    if (!destroyed) instance?.toggle(visible && !document.hidden);
  };
  const resize = new ResizeObserver(() => {
    if (!destroyed && visible && !document.hidden) {
      instance?.resize();
      instance?.toggle(true);
    }
  });
  resize.observe(canvas);
  const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); });
  observer.observe(canvas);
  const down = (event: PointerEvent) => { pointerX = event.clientX; lastDrag = drag; };
  const move = (event: PointerEvent) => {
    if (pointerX !== null && !motion.matches) drag = lastDrag + (event.clientX - pointerX) / 200;
  };
  const up = () => { pointerX = null; };
  canvas.addEventListener("pointerdown", down);
  window.addEventListener("pointermove", move);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", up);
  motion.addEventListener("change", sync);
  document.addEventListener("visibilitychange", sync);
  sync();
  return {
    ...instance,
    destroy() {
      destroyed = true;
      resize.disconnect();
      observer.disconnect();
      canvas.removeEventListener("pointerdown", down);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      motion.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
      instance?.destroy();
    },
  };
}
