// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Cambia 'ro-potion-calc' por el nombre de tu repo en GitHub
  site: 'https://tebancl.github.io',
  base: '/ro-brew-calc',
  integrations: [react()],
});