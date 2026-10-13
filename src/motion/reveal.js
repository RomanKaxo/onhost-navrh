/** Progressive enhancement: content stays visible if JS or observers fail. */
export function reveal(elements) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const clean = () => elements.forEach(el => el.classList.remove('reveal-pending'));
  if (reduced.matches || !('IntersectionObserver' in window)) return clean;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(({ target, isIntersecting }) => {
      if (isIntersecting) { target.classList.remove('reveal-pending'); observer.unobserve(target); }
    });
  }, { threshold: .12 });
  elements.forEach(el => { el.classList.add('reveal-pending'); observer.observe(el); });
  reduced.addEventListener('change', clean);
  return () => { observer.disconnect(); reduced.removeEventListener('change', clean); clean(); };
}
