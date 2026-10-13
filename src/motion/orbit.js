/** Pause CSS orbit motion outside the viewport and in hidden tabs. */
export function observeOrbits(orbits) {
  const visible = new WeakMap();
  const update = () => orbits.forEach(orbit => {
    const running = visible.get(orbit) && !document.hidden && orbit.dataset.paused !== 'true';
    orbit.querySelectorAll('.orbit-ring').forEach(ring => { ring.style.animationPlayState = running ? 'running' : 'paused'; });
  });
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => visible.set(entry.target, entry.isIntersecting)); update();
  });
  orbits.forEach(orbit => observer.observe(orbit)); update();
  document.addEventListener('visibilitychange', update);
  return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update); };
}
