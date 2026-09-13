import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Adresse canonique : elle sert au sitemap et aux métadonnées de partage.
  site: 'https://laurentnyssen.be',
  // Le harness de preview injecte PORT ; Astro ne le lit pas seul.
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [react(), tailwind({ applyBaseStyles: false }), sitemap()],
});
