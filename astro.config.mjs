import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  // Le harness de preview injecte PORT ; Astro ne le lit pas seul.
  server: { port: Number(process.env.PORT) || 4321 },
  integrations: [react(), tailwind({ applyBaseStyles: false })],
});
