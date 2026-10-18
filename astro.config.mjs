import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://midec26.xyz',
  integrations: [sitemap()],
});
