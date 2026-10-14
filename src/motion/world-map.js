import {onPage} from './lifecycle.js';

// Mapa sítě: smyčky (záblesky, pulzy, sonar) běží jen když je mapa vidět.
// Bez JS nebo IntersectionObserveru animace prostě běží; nic se neskrývá.
onPage(() => {
  const maps = [...document.querySelectorAll('[data-world-map]')];
  if (!maps.length || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) =>
    target.classList.toggle('is-paused', !isIntersecting)), {rootMargin: '80px 0px'});
  maps.forEach(map => io.observe(map));
  return () => io.disconnect();
});
