// Výchozí planety a nadpisy sekcí pro stránky, které je v obsahu nemají.
export const defaultPlanet: Record<string, string> = {
  'funkce/ai-asistent': 'ai', 'funkce/monitoring': 'monitoring', 'funkce/zalohy': 'backups',
  blog: 'company', 'znalostni-baze': 'knowledge', 'o-nas': 'company', kontakt: 'support', podpora: 'support', faq: 'support',
};
export const planetOf = (slug: string, planet?: string) => planet ?? defaultPlanet[slug] ?? (slug.startsWith('znalostni-baze/') ? 'knowledge' : 'company');

// Nadpis sekce výhod podle druhu stránky (stejné role = stejná slova napříč webem).
export const highlightsHead = (kind: string, slug: string, title: string) => {
  if (slug === 'kontakt') return {eyebrow: 'Kontakt', title: 'Jak nás zastihnete'};
  if (kind === 'support') return {eyebrow: 'Podpora', title: 'Jak vám pomůžeme'};
  if (kind === 'company') return {eyebrow: 'ONhost', title: 'Na čem stavíme'};
  if (kind === 'feature') return {eyebrow: title, title: 'Jak to funguje'};
  return {eyebrow: title, title: 'Co dostanete'};
};
export const stepsTitle = (count: number) => count === 3 ? 'Zapnuto ve třech krocích' : 'Jak začít';
