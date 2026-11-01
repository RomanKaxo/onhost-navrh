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
  const setExpanded = (trigger, open) => {
    trigger.setAttribute('aria-expanded', String(open));
    const menu = document.getElementById(trigger.getAttribute('aria-controls'));
    if (menu) menu.inert = !open;
  };
  const closeAll = except => triggers.forEach(t => t !== except && setExpanded(t, false));
  triggers.forEach(trigger => listen(trigger, 'click', () => {
    const open = trigger.getAttribute('aria-expanded') === 'true';
    closeAll(trigger); setExpanded(trigger, !open);
  }));
  triggers.forEach(trigger => listen(trigger, 'keydown', e => {
    if (e.key !== 'ArrowDown') return;
    e.preventDefault(); closeAll(trigger); setExpanded(trigger, true);
    trigger.nextElementSibling?.querySelector('a')?.focus();
  }));
  listen(document, 'keydown', e => {
    if (e.key !== 'Escape') return;
    const active = triggers.find(t => t.getAttribute('aria-expanded') === 'true');
    if (active?.parentElement.contains(document.activeElement)) active.focus();
    closeAll();
    if (toggle?.getAttribute('aria-expanded') === 'true') { closeMobile(); toggle.focus(); }
  });
  listen(document, 'click', e => {if (!e.target.closest?.('.site-nav__group')) closeAll();});
  listen(document, 'focusin', e => {
    if (!e.target.closest?.('.site-nav__group')) closeAll();
    if (panel && !panel.hidden && !header?.contains(e.target)) closeMobile();
  });
  const toggle = document.querySelector('[data-menu-toggle]'), panel = document.getElementById('mobile-nav');
  const sizeMobile = () => panel?.style.setProperty('--mobile-nav-height', `${Math.max(0, innerHeight - panel.getBoundingClientRect().top)}px`);
  const closeMobile = () => { if (toggle && panel) { toggle.setAttribute('aria-expanded', 'false'); panel.hidden = true; } };
  if (toggle && panel) listen(toggle, 'click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open)); panel.hidden = open;
    if (!open) sizeMobile();
  });
  listen(window, 'resize', () => { closeAll(); if (innerWidth > 1080) closeMobile(); else sizeMobile(); });

  // Karty: jemné světlo sleduje ukazatel (jen myš, ne dotyk).
  listen(document, 'pointermove', e => {
    if (e.pointerType !== 'mouse') return;
    const card = e.target.closest?.('.card');
    if (!card) return;
    const box = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - box.left}px`);
    card.style.setProperty('--my', `${e.clientY - box.top}px`);
  }, {passive: true});

  // Čísla se při prvním zobrazení napočítají od nuly (jen když pohyb nevadí).
  const counters = [...document.querySelectorAll('[data-count]')];
  if (counters.length && !matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    const format = (el, v) => `${el.dataset.prefix}${v.toLocaleString('cs-CZ', {minimumFractionDigits: +el.dataset.decimals, maximumFractionDigits: +el.dataset.decimals})}${el.dataset.suffix}`;
    const io = new IntersectionObserver(entries => entries.forEach(({target, isIntersecting}) => {
      if (!isIntersecting) return;
      io.unobserve(target);
      const end = +target.dataset.count, start = performance.now(), duration = 1400;
      const step = now => {
        const p = Math.min(1, (now - start) / duration), eased = 1 - Math.pow(1 - p, 3);
        target.textContent = format(target, end * eased);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }), {threshold: .6});
    counters.forEach(el => { el.textContent = format(el, 0); io.observe(el); });
    cleanups.push(() => io.disconnect());
  }
  cleanups.push(reveal([...document.querySelectorAll('[data-reveal]')]));
  return () => cleanups.forEach(fn => fn());
});
