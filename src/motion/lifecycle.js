/** Set up each new Astro document and dispose before a view-transition swap. */
export function onPage(setup) {
  let dispose;
  const run = () => { dispose?.(); dispose = setup(); };
  document.addEventListener('astro:page-load', run);
  document.addEventListener('astro:before-swap', () => { dispose?.(); dispose = undefined; });
  run();
}
