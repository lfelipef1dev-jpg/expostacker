import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://expostacker.com.br',
  output: 'static',
  trailingSlash: 'always',
  integrations: [tailwind({ applyBaseStyles: false })],
});
