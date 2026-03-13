# roozekrans.nl — Personal Website Design

**Date:** 2026-03-13
**Status:** Approved

## Overview

Personal website for Marcel Roozekrans combining a developer portfolio and blog. Hosted on Netlify, built with Astro + Tailwind CSS.

## Architecture

- **Framework:** Astro 4.x, `output: 'static'`
- **Styling:** Tailwind CSS v3 with custom dark theme
- **Content:** Astro Content Collections (Blog + Projects)
- **Deployment:** Netlify, auto-deploy on push to `main` via `@astrojs/netlify`
- **Repo:** `roozekrans-nl`

### Page Structure

```
/                → Home (hero + featured projects + latest posts)
/about           → About page
/projects        → All projects grid
/blog            → Blog post list
/blog/[slug]     → Blog post detail
```

## Design & Visual Style

- **Background:** `zinc-950` (#09090b)
- **Accent:** `cyan-400` (#22d3ee)
- **Text:** white (body), `zinc-400` (muted)
- **Typography:** Inter or Geist (body), JetBrains Mono or Geist Mono (code/labels)
- **Hero:** Full-width, large name, one-liner tagline, subtle animated gradient/grid background
- **Cards:** `zinc-900` surface, cyan accent border, hover lift effect
- **Nav:** Sticky top, name/logo left, links right, cyan active underline
- **Blog posts:** ~65ch reading width, Shiki syntax highlighting (dark theme), cyan headings

## Content & Features

### Home
- Hero: name + tagline ("Software Engineer · Open Source")
- Featured Projects: 3 pinned cards
- Latest Posts: 3 most recent blog posts

### About
- Short bio
- Skills / tech stack list
- Links: GitHub, LinkedIn, NuGet

### Projects
- Grid of cards from content collection
- Each card: name, description, tech tags, GitHub link, NuGet badge if applicable
- Pre-populated with: ZMediator, Blazor.BroadcastChannel, MailPeek, SSH.NET.Fork.Abstractions, System.Reflection.Abstractions, ZeroAlloc.Analyzers, LongtermMemory-MCP, roslyn-codelens-mcp

### Blog
- Post list sorted by date
- Tag filtering
- MDX posts with frontmatter: `title`, `date`, `tags`, `description`
- Written in VS Code, no CMS

### SEO
- `<meta>` tags per page
- Open Graph image per page
- Sitemap via `@astrojs/sitemap`

## Out of Scope

- CMS / admin UI
- Comments system
- Analytics (can be added later)
- Project detail pages (link directly to GitHub)
