import {onPage} from './lifecycle.js';
import {reveal} from './reveal.js';

// Chování společné všem stránkám. Spouští se po každé navigaci (přechody stránek) a před výměnou se uklidí.
onPage(() => {
  const cleanups = [];
  const listen = (target, type, fn, options) => {target.addEventListener(type, fn, options); cleanups.push(() => target.removeEventListener(type, fn, options));};

  // Hlavička: průhledná nahoře, se sklem po odrolování.
  const header = document.querySelector('[data-header]');
  const scrolled = () => header?.classList.toggle('is-scrolled', scrollY > 24);
  listen(window, 'scroll', scrolled, {passive: true}); scrolled();

  // Rozbalovací skupiny navigace: klik, Escape a klik mimo zavírají.
  const triggers = [...document.querySelectorAll('.site-nav__trigger')];
  const closeAll = except => triggers.forEach(t => t !== except && t.setAttribute('aria-expanded', 'false'));
  triggers.forEach(trigger => listen(trigger, 'click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    closeAll(trigger); trigger.setAttribute('aria-expanded', String(!open));
  }));
  listen(document, 'keydown', e => {if (e.key === 'Escape') closeAll();});
  listen(document, 'click', e => {if (!e.target.closest?.('.site-nav__group')) closeAll();});
  const toggle = document.querySelector('[data-menu-toggle]'), panel = document.getElementById('mobile-nav');
  if (toggle && panel) listen(toggle, 'click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open)); panel.hidden = open;
  });

  // Karty: jemné světlo sleduje ukazatel (jen myš, ne dotyk).
  listen(document, 'pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const card = e.target.closest?.('.card');
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - box.left}px`);
    card.style.setProperty('--my', `${e.clientY - box.top}px`);
  }, {passive: true});

  cleanups.push(reveal([...document.querySelectorAll('[data-reveal]')]));
  return () => cleanups.forEach(fn => fn());
});
