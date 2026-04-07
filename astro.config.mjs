import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  // Cambia 'ro-potion-calc' por el nombre de tu repo en GitHub
  site: 'https://tebancl.github.io',
  base: '/ro-brew-calc/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});