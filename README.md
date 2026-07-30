# roozekrans.nl

[![CI](https://github.com/MarcelRoozekrans/roozekrans-nl/actions/workflows/ci.yml/badge.svg)](https://github.com/MarcelRoozekrans/roozekrans-nl/actions/workflows/ci.yml)
[![GitHub Sponsors](https://img.shields.io/github/sponsors/MarcelRoozekrans?style=flat&logo=githubsponsors&color=ea4aaa&label=Sponsor)](https://github.com/sponsors/MarcelRoozekrans)

Personal site of Marcel Roozekrans — projects, blog, and about. Built with
[Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com), statically
generated and deployed to Cloudflare Workers static assets.

## Project structure

```text
/
├── .github/workflows/    CI: type-check + build on push and PR
├── public/               Static assets (favicons, OG image, self-hosted fonts, robots.txt)
├── src/
│   ├── components/       BlogCard, ProjectCard, Nav, Footer
│   ├── data/
│   │   ├── blog/         Blog posts (markdown, frontmatter validated by content.config.ts)
│   │   └── projects/     Project entries (markdown + frontmatter)
│   ├── layouts/          BaseLayout (meta/OG/JSON-LD), BlogPostLayout
│   ├── pages/            Routes — index, about, projects, blog/, 404
│   ├── styles/           global.css (Tailwind theme + @font-face)
│   └── content.config.ts Zod schemas for the blog and projects collections
├── astro.config.mjs
└── wrangler.jsonc        Cloudflare Workers assets config
```

## Adding content

Drop a markdown file into `src/data/blog/` or `src/data/projects/`. The filename becomes
the slug. Frontmatter is validated at build time against the schemas in
[`src/content.config.ts`](src/content.config.ts) — a missing or mistyped field fails the build.

Blog posts need `title`, `description`, and `date`; `tags` and `draft` are optional.
Projects need `title` and `description`; `tags`, `github`, `nuget`, `marketplace`, `docs`,
`featured`, and `order` are optional. Featured projects appear on the homepage, sorted by `order`.

## Commands

All commands are run from the root of the project:

| Command                 | Action                                                  |
| :---------------------- | :------------------------------------------------------ |
| `npm install`           | Install dependencies                                    |
| `npm run dev`           | Start the dev server at `localhost:4321`                |
| `npm run check`         | Type-check `.astro` and `.ts` files                     |
| `npm run build`         | Build the production site to `./dist/`                  |
| `npm run preview`       | Build, then serve locally through `wrangler dev`        |
| `npm run deploy`        | Build and deploy to Cloudflare                          |
| `npm run generate-types`| Regenerate `worker-configuration.d.ts` from wrangler     |

## Fonts

Inter and JetBrains Mono are self-hosted from `public/fonts/` (latin + latin-ext variable
woff2 subsets) rather than loaded from Google's CDN — this removes a render-blocking
third-party request and keeps visitor IPs out of Google's logs.

## Social preview image

`public/og-default.png` is the image referenced by `og:image`. It is rasterized from
`public/og-default.svg`, which is the editable source. After changing the SVG, regenerate
the PNG at 1200×630 — SVG is not accepted as an `og:image` by any major social platform.
