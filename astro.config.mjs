import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import fs from 'node:fs';
import path from 'node:path';

// Mapa de lastmod real por URL
const lastmodMap = new Map();

const casesDir = path.resolve('src/content/cases');
try {
  const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    const slug = file.replace('.json', '');
    const stats = fs.statSync(path.join(casesDir, file));
    const iso = stats.mtime.toISOString().split('T')[0];
    lastmodMap.set(`https://expostacker.com.br/pt/cases/${slug}/`, iso);
    lastmodMap.set(`https://expostacker.com.br/en/cases/${slug}/`, iso);
  }
} catch {
  // ignore
}

const pageFiles = {
  'https://expostacker.com.br/pt/': 'src/pages/[lang]/index.astro',
  'https://expostacker.com.br/en/': 'src/pages/[lang]/index.astro',
  'https://expostacker.com.br/pt/contato/': 'src/pages/[lang]/contato.astro',
  'https://expostacker.com.br/en/contato/': 'src/pages/[lang]/contato.astro',
};

for (const [url, file] of Object.entries(pageFiles)) {
  try {
    const stats = fs.statSync(path.resolve(file));
    lastmodMap.set(url, stats.mtime.toISOString().split('T')[0]);
  } catch {
    // ignore
  }
}

export default defineConfig({
  site: 'https://expostacker.com.br',
  output: 'static',
  trailingSlash: 'always',
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
  },
  integrations: [
    tailwind({ applyBaseStyles: true }),
    sitemap({
      filter: (page) => {
        // Exclui raiz (noindex) e preview-card
        if (page === 'https://expostacker.com.br/' || page === 'https://expostacker.com.br/preview-card/') {
          return false;
        }
        return true;
      },
      serialize: (item) => {
        const realLastmod = lastmodMap.get(item.url);
        return {
          ...item,
          lastmod: realLastmod ?? item.lastmod,
        };
      },
    }),
  ],
});
