// @ts-check
import {defineConfig} from 'astro/config';

// Návrh běží na GitHub Pages pod /onhost-navrh; odkazy vždy přes import.meta.env.BASE_URL.
export default defineConfig({
  site: 'https://romankaxo.github.io',
  base: '/onhost-navrh',
  trailingSlash: 'ignore',
  output: 'static',
});
