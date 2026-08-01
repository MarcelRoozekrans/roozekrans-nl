// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://roozekrans.nl',
  output: 'static',

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      // Without this, Shiki bakes one theme's colours in as inline style
      // declarations that no stylesheet can override. With it, it emits
      // per-token custom properties and leaves the choice to CSS.
      defaultColor: false,
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap()],
});