import { getCosmos } from './cosmos.js';
export function bindPower(button) {
  const host = document.getElementById(button.dataset.cosmosTarget);
  if (!host) return () => {};
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let animation;
  const sync = () => {
    const on = getCosmos(host)?.on ?? (host.dataset.power !== 'off' || reduced.matches);
    button.setAttribute('aria-pressed', String(on));
    button.querySelector('[data-power-state]').textContent = on ? 'ON' : 'OFF';
  };
  const click = () => {
    const cosmos = getCosmos(host);
    if (!cosmos) return;
    animation?.cancel();
    if (!reduced.matches) animation = button.querySelector('img').animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(.94)' }, { transform: 'scale(1)' }],
      { duration: 220, easing: 'cubic-bezier(.2,.8,.2,1)' });
    cosmos.setPower(!cosmos.on, { duration: 1600 });
  };
  const preference = () => { if (reduced.matches) animation?.cancel(); };
  reduced.addEventListener('change', preference);
  sync(); host.addEventListener('cosmos:power', sync); button.addEventListener('click', click);
  return () => { reduced.removeEventListener('change', preference); animation?.cancel(); host.removeEventListener('cosmos:power', sync); button.removeEventListener('click', click); };
}
