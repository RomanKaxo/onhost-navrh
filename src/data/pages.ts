import {getCollection, type CollectionEntry} from 'astro:content';
import {nav, url} from './nav';

export type Page = CollectionEntry<'pages'>;
export const allPages = async () => (await getCollection('pages')).sort((a, b) => a.data.slug.localeCompare(b.data.slug, 'cs'));

// Odkaz z obsahu: externí nechá být, kotvu taky, jinak přidá base.
export const link = (href: string) => /^(https?:|mailto:|tel:|#)/.test(href) ? href : url(href.replace(/^\//, ''));

// Drobečková navigace: Úvod › skupina z navigace (nebo rodič vnořené stránky) › stránka.
const parents: Record<string, {label: string; href: string}> = {
  blog: {label: 'Blog', href: 'blog'},
  'znalostni-baze': {label: 'Znalostní báze', href: 'znalostni-baze'},
};
export function crumbs(slug: string, title: string) {
  const trail = [{label: 'Úvod', href: url()}];
  const [head, child] = slug.split('/');
  if (child && parents[head]) trail.push({label: parents[head].label, href: url(parents[head].href)});
  else {
    const group = nav.find(g => g.items.some(i => i.href === slug));
    if (group && group.label !== 'Podpora') trail.push({label: group.label, href: url(group.items[0].href)});
  }
  return [...trail, {label: title, href: ''}];
}

// Krátký popisek stránky do karet (poznámka z navigace, jinak eyebrow).
export const noteFor = (page: Page) => nav.flatMap(g => g.items).find(i => i.href === page.data.slug)?.note ?? page.data.eyebrow ?? '';

export const readingTime = (body = '') => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 200));
