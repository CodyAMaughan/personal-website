// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), keystatic()],

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: netlify()
});