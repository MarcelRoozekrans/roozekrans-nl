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
        light: 'github-light-high-contrast',
        dark: 'github-dark-high-contrast',
      },
      // Without this, Shiki bakes one theme's colours in as inline style
      // declarations that no stylesheet can override. With it, it emits
      // per-token custom properties and leaves the choice to CSS.
      // No `wrap`. It is emitted as an inline style on every <pre>, so no code
      // block can opt out, and its word-wrap: break-word splits identifiers
      // mid-token. Code blocks scroll inside their own box instead, matching
      // the treatment wide tables already get, and preserving indentation.
      defaultColor: false,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap()],
});