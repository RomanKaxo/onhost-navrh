// @ts-check
import {defineConfig} from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import {fileURLToPath} from 'node:url';
import {satteri} from '@astrojs/markdown-satteri';

const base = '/onhost-navrh';

// Návrh běží na GitHub Pages pod /onhost-navrh; odkazy vždy přes import.meta.env.BASE_URL.
export default defineConfig({
  integrations: [react()],
  vite: {
    plugins: [tailwindcss(), {
      name: 'onhost-globe-runtime',
      // Keep the supplied component verbatim; adapt its COBE lifecycle at the boundary.
      enforce: 'pre',
      resolveId(source, importer) {
        if (source === 'cobe' && importer?.replaceAll('\\', '/').endsWith('/components/ui/globe.tsx')) {
          return fileURLToPath(new URL('./src/lib/globe-runtime.ts', import.meta.url));
        }
      },
    }],
  },
  site: 'https://romankaxo.github.io',
  base,
  trailingSlash: 'ignore',
  markdown: {
    processor: satteri({mdastPlugins: [{
      name: 'onhost-base-links',
      link(node, ctx) {
        if (/^\/(?!\/)/.test(node.url) && node.url !== base && !node.url.startsWith(`${base}/`)) {
          ctx.setProperty(node, 'url', `${base}${node.url}`);
        }
      },
    }]}),
  },
  output: 'static',
});
