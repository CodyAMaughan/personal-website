// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import netlify from '@astrojs/netlify';

import keystatic from '@keystatic/astro';

import markdoc from '@astrojs/markdoc';

// https://astro.build/config
export default defineConfig({
  site: 'https://codymaughan.com',
  output: 'static',
  integrations: [react(), keystatic(), markdoc()],
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  },

  adapter: netlify({
    imageCDN: false
  })
});