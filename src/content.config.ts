import {defineCollection} from 'astro:content';
import {glob} from 'astro/loaders';
import {z} from 'astro/zod';

// Obsah všech stránek: src/content/pages/<slug>.md (schéma popisuje docs/brief.md).
const link = z.object({label: z.string(), href: z.string()});
const pages = defineCollection({
  loader: glob({pattern: '**/*.md', base: './src/content/pages'}),
  schema: z.object({
    slug: z.string(),
    kind: z.enum(['home', 'product', 'feature', 'listing', 'article', 'company', 'legal', 'support']),
    title: z.string(),
    description: z.string(),
    eyebrow: z.string().optional(),
    lead: z.string().optional(),
    planet: z.string().optional(),
    highlights: z.array(z.object({title: z.string(), text: z.string()})).optional(),
    plans: z.array(z.object({
      name: z.string(), price: z.string(), period: z.string().optional(),
      features: z.array(z.string()).default([]), featured: z.boolean().default(false),
    })).optional(),
    faq: z.array(z.object({q: z.string(), a: z.string()})).optional(),
    cta: z.object({title: z.string(), text: z.string().optional(), primary: link.optional(), secondary: link.optional()}).optional(),
    date: z.string().optional(),
    sample: z.boolean().default(false),
  }),
});

export const collections = {pages};
