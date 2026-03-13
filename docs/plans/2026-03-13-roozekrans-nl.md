# roozekrans.nl Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build and deploy a personal portfolio + blog website at roozekrans.nl using Astro 4.x + Tailwind CSS, hosted on Netlify.

**Architecture:** Static Astro site with Content Collections for Blog and Projects. Pages: Home, About, Projects, Blog, Blog post detail. No server-side logic — pure static output.

**Tech Stack:** Astro 4.x, Tailwind CSS v3, MDX, @astrojs/sitemap, @astrojs/netlify, Shiki (syntax highlighting), Netlify hosting.

---

## Prerequisites

- Node.js 18+ installed
- Git installed
- Netlify account (free tier is fine)
- A folder to work in, e.g. `C:/Users/MarcelRoozekrans/projects/roozekrans-nl`

---

### Task 1: Scaffold the Astro project

**Files:**
- Create: `roozekrans-nl/` (new project folder)

**Step 1: Create project with Astro CLI**

```bash
cd C:/Users/MarcelRoozekrans/projects
npm create astro@latest roozekrans-nl -- --template minimal --install --no-git
cd roozekrans-nl
```

When prompted: choose "A few best practices" or just accept defaults.

**Step 2: Install Tailwind integration**

```bash
npx astro add tailwind --yes
```

**Step 3: Install MDX integration**

```bash
npx astro add mdx --yes
```

**Step 4: Install sitemap integration**

```bash
npx astro add sitemap --yes
```

**Step 5: Install additional dependencies**

```bash
npm install @astrojs/rss
```

**Step 6: Verify dev server starts**

```bash
npm run dev
```

Expected: `http://localhost:4321` loads a blank page with no errors.

**Step 7: Init git**

```bash
git init
git add .
git commit -m "chore: scaffold Astro project with Tailwind, MDX, sitemap"
```

---

### Task 2: Configure Astro and Tailwind

**Files:**
- Modify: `astro.config.mjs`
- Modify: `tailwind.config.mjs`
- Modify: `src/styles/global.css`

**Step 1: Update `astro.config.mjs`**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://roozekrans.nl',
  output: 'static',
  integrations: [
    tailwind({ applyBaseStyles: false }),
    mdx(),
    sitemap(),
  ],
});
```

**Step 2: Update `tailwind.config.mjs`**

```js
// tailwind.config.mjs
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#22d3ee', // cyan-400
          dark: '#06b6d4',    // cyan-500
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [],
};
```

**Step 3: Create `src/styles/global.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

@layer base {
  html {
    @apply bg-zinc-950 text-white scroll-smooth;
  }

  body {
    @apply font-sans antialiased;
  }

  h1, h2, h3, h4 {
    @apply font-semibold;
  }
}
```

**Step 4: Verify dev server still works**

```bash
npm run dev
```

Expected: no errors, background is now near-black.

**Step 5: Commit**

```bash
git add .
git commit -m "chore: configure Tailwind dark theme with cyan accent"
```

---

### Task 3: Define Content Collections

**Files:**
- Create: `src/content/config.ts`
- Create: `src/content/projects/` (directory)
- Create: `src/content/blog/` (directory)

**Step 1: Create `src/content/config.ts`**

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()).default([]),
    github: z.string().url().optional(),
    nuget: z.string().url().optional(),
    featured: z.boolean().default(false),
    order: z.number().default(99),
  }),
});

export const collections = { blog, projects };
```

**Step 2: Create a sample blog post `src/content/blog/hello-world.md`**

```markdown
---
title: "Hello World"
description: "Welcome to my blog."
date: 2026-03-13
tags: ["meta"]
---

Welcome to my blog! I'm Marcel, a software engineer focused on the .NET ecosystem.
I'll be writing about open source, .NET, and whatever I'm building.
```

**Step 3: Create project entries — `src/content/projects/zmediator.md`**

```markdown
---
title: "ZMediator"
description: "A lightweight, source-generated mediator for .NET with zero reflection and minimal allocations."
tags: [".NET", "Source Generators", "MediatR alternative"]
github: "https://github.com/MarcelRoozekrans/ZMediator"
nuget: "https://www.nuget.org/packages/ZMediator"
featured: true
order: 1
---

ZMediator is a mediator implementation for .NET that uses source generators to eliminate reflection overhead at runtime.
```

**Step 4: Create `src/content/projects/blazor-broadcast-channel.md`**

```markdown
---
title: "Blazor.BroadcastChannel"
description: "BroadcastChannel API bindings for Blazor WebAssembly, enabling cross-tab communication."
tags: ["Blazor", ".NET", "WebAssembly"]
github: "https://github.com/MarcelRoozekrans/Blazor.BroadcastChannel"
nuget: "https://www.nuget.org/packages/Blazor.BroadcastChannel"
featured: true
order: 2
---

Blazor.BroadcastChannel brings the browser's BroadcastChannel API to Blazor WASM for easy cross-tab messaging.
```

**Step 5: Create `src/content/projects/mailpeek.md`**

```markdown
---
title: "MailPeek"
description: "A local SMTP server and email viewer for development, so you never send test emails to real addresses."
tags: [".NET", "SMTP", "Developer Tools"]
github: "https://github.com/MarcelRoozekrans/MailPeek"
featured: true
order: 3
---

MailPeek is a lightweight local SMTP server with a web UI to view emails during development.
```

**Step 6: Create remaining project entries**

Create `src/content/projects/zerroalloc-analyzers.md`:
```markdown
---
title: "ZeroAlloc.Analyzers"
description: "Roslyn analyzers to detect heap allocations and help write zero-allocation .NET code."
tags: [".NET", "Roslyn", "Performance"]
github: "https://github.com/MarcelRoozekrans/ZeroAlloc.Analyzers"
nuget: "https://www.nuget.org/packages/ZeroAlloc.Analyzers"
featured: false
order: 4
---

Roslyn analyzers that flag unnecessary heap allocations, helping you write high-performance .NET code.
```

Create `src/content/projects/ssh-net-abstractions.md`:
```markdown
---
title: "SSH.NET.Fork.Abstractions"
description: "Interface abstractions over SSH.NET for testable SSH/SFTP client code."
tags: [".NET", "SSH", "Abstractions"]
github: "https://github.com/MarcelRoozekrans/SSH.NET.Fork.Abstractions"
nuget: "https://www.nuget.org/packages/SSH.NET.Fork.Abstractions"
featured: false
order: 5
---

Provides interfaces for SSH.NET types so you can mock SSH/SFTP in unit tests.
```

Create `src/content/projects/reflection-abstractions.md`:
```markdown
---
title: "System.Reflection.Abstractions"
description: "Interfaces over System.Reflection to make reflection-heavy code unit testable."
tags: [".NET", "Reflection", "Abstractions"]
github: "https://github.com/MarcelRoozekrans/System.Reflection.Abstractions"
nuget: "https://www.nuget.org/packages/System.Reflection.Abstractions"
featured: false
order: 6
---

Wraps System.Reflection types in interfaces so you can swap them out in tests.
```

**Step 7: Verify build**

```bash
npm run build
```

Expected: build completes with no type errors.

**Step 8: Commit**

```bash
git add .
git commit -m "feat: define content collections and add project/blog content"
```

---

### Task 4: Create shared Layout and Navigation

**Files:**
- Create: `src/layouts/BaseLayout.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

**Step 1: Create `src/components/Nav.astro`**

```astro
---
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
];

const pathname = Astro.url.pathname;
---

<header class="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
    <a href="/" class="font-mono text-lg font-semibold text-accent hover:text-accent-dark transition-colors">
      roozekrans.nl
    </a>
    <ul class="flex gap-6">
      {navLinks.map(({ href, label }) => (
        <li>
          <a
            href={href}
            class={`text-sm font-medium transition-colors hover:text-accent ${
              pathname === href || (href !== '/' && pathname.startsWith(href))
                ? 'text-accent border-b border-accent pb-0.5'
                : 'text-zinc-400'
            }`}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  </nav>
</header>
```

**Step 2: Create `src/components/Footer.astro`**

```astro
---
const year = new Date().getFullYear();
---

<footer class="border-t border-zinc-800 py-8 mt-20">
  <div class="mx-auto max-w-5xl px-6 flex items-center justify-between text-zinc-400 text-sm">
    <span>© {year} Marcel Roozekrans</span>
    <div class="flex gap-4">
      <a href="https://github.com/MarcelRoozekrans" target="_blank" rel="noopener" class="hover:text-accent transition-colors">GitHub</a>
      <a href="https://www.nuget.org/profiles/MarcelRoozekrans" target="_blank" rel="noopener" class="hover:text-accent transition-colors">NuGet</a>
    </div>
  </div>
</footer>
```

**Step 3: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';

interface Props {
  title: string;
  description?: string;
  ogImage?: string;
}

const {
  title,
  description = 'Marcel Roozekrans — Software Engineer & Open Source Developer',
  ogImage = '/og-default.png',
} = Astro.props;

const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={canonicalURL} />
    <meta property="og:type" content="website" />
    <link rel="canonical" href={canonicalURL} />
    <link rel="sitemap" href="/sitemap-index.xml" />
    <title>{title} · Marcel Roozekrans</title>
  </head>
  <body class="min-h-screen flex flex-col">
    <Nav />
    <main class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add BaseLayout, Nav, and Footer components"
```

---

### Task 5: Build the Home page

**Files:**
- Modify: `src/pages/index.astro`
- Create: `src/components/ProjectCard.astro`
- Create: `src/components/BlogCard.astro`

**Step 1: Create `src/components/ProjectCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  tags: string[];
  github?: string;
  nuget?: string;
}

const { title, description, tags, github, nuget } = Astro.props;
---

<article class="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:-translate-y-1 hover:border-cyan-400/40 transition-all duration-200">
  <h3 class="font-semibold text-white text-lg mb-2">{title}</h3>
  <p class="text-zinc-400 text-sm mb-4 leading-relaxed">{description}</p>
  <div class="flex flex-wrap gap-2 mb-4">
    {tags.map(tag => (
      <span class="font-mono text-xs bg-zinc-800 text-cyan-400 px-2 py-0.5 rounded">{tag}</span>
    ))}
  </div>
  <div class="flex gap-3 text-sm">
    {github && (
      <a href={github} target="_blank" rel="noopener" class="text-zinc-400 hover:text-accent transition-colors">
        GitHub →
      </a>
    )}
    {nuget && (
      <a href={nuget} target="_blank" rel="noopener" class="text-zinc-400 hover:text-accent transition-colors">
        NuGet →
      </a>
    )}
  </div>
</article>
```

**Step 2: Create `src/components/BlogCard.astro`**

```astro
---
interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
  slug: string;
}

const { title, description, date, tags, slug } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<a href={`/blog/${slug}`} class="group block rounded-xl border border-zinc-800 bg-zinc-900 p-6 hover:-translate-y-1 hover:border-cyan-400/40 transition-all duration-200">
  <time class="font-mono text-xs text-zinc-500">{formattedDate}</time>
  <h3 class="font-semibold text-white text-lg mt-1 mb-2 group-hover:text-accent transition-colors">{title}</h3>
  <p class="text-zinc-400 text-sm leading-relaxed mb-3">{description}</p>
  <div class="flex flex-wrap gap-2">
    {tags.map(tag => (
      <span class="font-mono text-xs bg-zinc-800 text-cyan-400 px-2 py-0.5 rounded">{tag}</span>
    ))}
  </div>
</a>
```

**Step 3: Replace `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import BlogCard from '../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const featuredProjects = (await getCollection('projects', ({ data }) => data.featured))
  .sort((a, b) => a.data.order - b.data.order);

const latestPosts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
  .slice(0, 3);
---

<BaseLayout title="Home" description="Marcel Roozekrans — Software Engineer & Open Source Developer in the .NET ecosystem.">
  <!-- Hero -->
  <section class="relative overflow-hidden border-b border-zinc-800">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(34,211,238,0.08)_0%,_transparent_70%)]" />
    <div class="relative mx-auto max-w-5xl px-6 py-28">
      <p class="font-mono text-cyan-400 text-sm mb-4">Hi, I'm</p>
      <h1 class="text-5xl font-bold text-white mb-4 tracking-tight">Marcel Roozekrans</h1>
      <p class="text-xl text-zinc-400 max-w-xl leading-relaxed">
        Software Engineer · Open Source Developer · .NET enthusiast building tools, libraries, and the occasional side project.
      </p>
      <div class="flex gap-4 mt-8">
        <a href="/projects" class="bg-cyan-400 text-zinc-950 font-semibold px-5 py-2.5 rounded-lg hover:bg-cyan-300 transition-colors text-sm">
          View Projects
        </a>
        <a href="/blog" class="border border-zinc-700 text-zinc-300 font-medium px-5 py-2.5 rounded-lg hover:border-zinc-500 transition-colors text-sm">
          Read Blog
        </a>
      </div>
    </div>
  </section>

  <!-- Featured Projects -->
  <section class="mx-auto max-w-5xl px-6 py-16">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-white">Featured Projects</h2>
      <a href="/projects" class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">All projects →</a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {featuredProjects.map(project => (
        <ProjectCard
          title={project.data.title}
          description={project.data.description}
          tags={project.data.tags}
          github={project.data.github}
          nuget={project.data.nuget}
        />
      ))}
    </div>
  </section>

  <!-- Latest Posts -->
  {latestPosts.length > 0 && (
    <section class="mx-auto max-w-5xl px-6 py-16 border-t border-zinc-800">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-white">Latest Posts</h2>
        <a href="/blog" class="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">All posts →</a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {latestPosts.map(post => (
          <BlogCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            tags={post.data.tags}
            slug={post.slug}
          />
        ))}
      </div>
    </section>
  )}
</BaseLayout>
```

**Step 4: Check it renders**

```bash
npm run dev
```

Expected: hero section with your name, featured projects grid, latest posts.

**Step 5: Commit**

```bash
git add .
git commit -m "feat: build home page with hero, featured projects, latest posts"
```

---

### Task 6: Build the About page

**Files:**
- Create: `src/pages/about.astro`

**Step 1: Create `src/pages/about.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';

const skills = [
  { category: 'Languages', items: ['C#', 'TypeScript', 'JavaScript', 'SQL'] },
  { category: 'Frameworks', items: ['.NET 8/9', 'ASP.NET Core', 'Blazor', 'Astro'] },
  { category: 'Tooling', items: ['Roslyn', 'Source Generators', 'Docker', 'Git'] },
  { category: 'Interests', items: ['Open Source', 'Performance', 'Developer Tools', 'Clean Architecture'] },
];
---

<BaseLayout title="About" description="About Marcel Roozekrans — software engineer and open source developer.">
  <div class="mx-auto max-w-3xl px-6 py-16">
    <h1 class="text-4xl font-bold text-white mb-8">About Me</h1>

    <div class="prose prose-invert max-w-none mb-12">
      <p class="text-zinc-300 text-lg leading-relaxed mb-4">
        Hi! I'm Marcel — a software engineer based in the Netherlands, focused on the .NET ecosystem.
        I enjoy building open source libraries that make other developers' lives easier, with a particular
        interest in performance, source generators, and developer tooling.
      </p>
      <p class="text-zinc-300 text-lg leading-relaxed">
        When I'm not writing code, I'm probably reading about it. I believe in writing software that
        is simple, fast, and well-tested.
      </p>
    </div>

    <h2 class="text-2xl font-bold text-white mb-6">Skills & Tech</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {skills.map(({ category, items }) => (
        <div>
          <h3 class="font-mono text-cyan-400 text-xs uppercase tracking-widest mb-3">{category}</h3>
          <ul class="space-y-1">
            {items.map(item => (
              <li class="text-zinc-300 text-sm">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <h2 class="text-2xl font-bold text-white mb-6">Find Me</h2>
    <div class="flex flex-wrap gap-4">
      <a href="https://github.com/MarcelRoozekrans" target="_blank" rel="noopener"
         class="flex items-center gap-2 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg hover:border-cyan-400 hover:text-cyan-400 transition-colors text-sm">
        GitHub
      </a>
      <a href="https://www.nuget.org/profiles/MarcelRoozekrans" target="_blank" rel="noopener"
         class="flex items-center gap-2 border border-zinc-700 text-zinc-300 px-4 py-2 rounded-lg hover:border-cyan-400 hover:text-cyan-400 transition-colors text-sm">
        NuGet
      </a>
    </div>
  </div>
</BaseLayout>
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add About page"
```

---

### Task 7: Build the Projects page

**Files:**
- Create: `src/pages/projects.astro`

**Step 1: Create `src/pages/projects.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import ProjectCard from '../components/ProjectCard.astro';
import { getCollection } from 'astro:content';

const projects = (await getCollection('projects'))
  .sort((a, b) => a.data.order - b.data.order);
---

<BaseLayout title="Projects" description="Open source projects by Marcel Roozekrans.">
  <div class="mx-auto max-w-5xl px-6 py-16">
    <h1 class="text-4xl font-bold text-white mb-4">Projects</h1>
    <p class="text-zinc-400 mb-12">Open source libraries and tools I've built for the .NET ecosystem and beyond.</p>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map(project => (
        <ProjectCard
          title={project.data.title}
          description={project.data.description}
          tags={project.data.tags}
          github={project.data.github}
          nuget={project.data.nuget}
        />
      ))}
    </div>
  </div>
</BaseLayout>
```

**Step 2: Commit**

```bash
git add .
git commit -m "feat: add Projects page"
```

---

### Task 8: Build the Blog list and post pages

**Files:**
- Create: `src/pages/blog/index.astro`
- Create: `src/pages/blog/[slug].astro`
- Create: `src/layouts/BlogPostLayout.astro`

**Step 1: Create `src/layouts/BlogPostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';

interface Props {
  title: string;
  description: string;
  date: Date;
  tags: string[];
}

const { title, description, date, tags } = Astro.props;

const formattedDate = date.toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---

<BaseLayout title={title} description={description}>
  <article class="mx-auto max-w-3xl px-6 py-16">
    <header class="mb-10">
      <div class="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => (
          <span class="font-mono text-xs bg-zinc-800 text-cyan-400 px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>
      <h1 class="text-4xl font-bold text-white mb-4 leading-tight">{title}</h1>
      <time class="font-mono text-sm text-zinc-500">{formattedDate}</time>
    </header>

    <div class="prose prose-invert prose-cyan max-w-none
                prose-headings:text-cyan-400
                prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:underline
                prose-code:text-cyan-300 prose-code:bg-zinc-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none
                prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800">
      <slot />
    </div>
  </article>
</BaseLayout>
```

**Step 2: Install Tailwind Typography for blog prose**

```bash
npm install -D @tailwindcss/typography
```

Update `tailwind.config.mjs` to add the plugin:

```js
// tailwind.config.mjs
import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#22d3ee',
          dark: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
    },
  },
  plugins: [typography],
};
```

**Step 3: Create `src/pages/blog/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import BlogCard from '../../components/BlogCard.astro';
import { getCollection } from 'astro:content';

const posts = (await getCollection('blog', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---

<BaseLayout title="Blog" description="Articles by Marcel Roozekrans on .NET, open source, and software engineering.">
  <div class="mx-auto max-w-5xl px-6 py-16">
    <h1 class="text-4xl font-bold text-white mb-4">Blog</h1>
    <p class="text-zinc-400 mb-12">Thoughts on .NET, open source, and building software.</p>

    {posts.length === 0 ? (
      <p class="text-zinc-500">No posts yet. Check back soon!</p>
    ) : (
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(post => (
          <BlogCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            tags={post.data.tags}
            slug={post.slug}
          />
        ))}
      </div>
    )}
  </div>
</BaseLayout>
```

**Step 4: Create `src/pages/blog/[slug].astro`**

```astro
---
import BlogPostLayout from '../../layouts/BlogPostLayout.astro';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft);
  return posts.map(post => ({
    params: { slug: post.slug },
    props: { post },
  }));
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<BlogPostLayout
  title={post.data.title}
  description={post.data.description}
  date={post.data.date}
  tags={post.data.tags}
>
  <Content />
</BlogPostLayout>
```

**Step 5: Verify blog works**

```bash
npm run dev
```

Navigate to `http://localhost:4321/blog` and click the "Hello World" post.
Expected: post renders with correct typography and syntax highlighting.

**Step 6: Commit**

```bash
git add .
git commit -m "feat: add Blog list and post detail pages with typography"
```

---

### Task 9: Add a default OG image placeholder

**Files:**
- Create: `public/og-default.png` (placeholder)

**Step 1: Create a simple placeholder**

For now, add any 1200×630 image as `public/og-default.png`. You can create one later with a proper design. A quick option:

```bash
# Download a placeholder or just copy any PNG to public/og-default.png
# You can also skip this and remove the ogImage meta tag for now
```

If skipping: remove `ogImage` from `BaseLayout.astro` meta tag for now.

**Step 2: Commit**

```bash
git add .
git commit -m "chore: add placeholder OG image"
```

---

### Task 10: Configure Netlify deployment

**Files:**
- Create: `netlify.toml`

**Step 1: Create `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/*"
  to = "/404"
  status = 404
```

**Step 2: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="404 — Not Found">
  <div class="mx-auto max-w-5xl px-6 py-32 text-center">
    <p class="font-mono text-cyan-400 text-sm mb-4">404</p>
    <h1 class="text-4xl font-bold text-white mb-4">Page not found</h1>
    <p class="text-zinc-400 mb-8">This page doesn't exist.</p>
    <a href="/" class="text-cyan-400 hover:text-cyan-300 transition-colors">← Back home</a>
  </div>
</BaseLayout>
```

**Step 3: Build and verify**

```bash
npm run build
```

Expected: `dist/` folder created with all HTML files.

**Step 4: Commit**

```bash
git add .
git commit -m "feat: add Netlify config and 404 page"
```

---

### Task 11: Push to GitHub and deploy on Netlify

**Step 1: Create GitHub repo**

Go to [github.com/new](https://github.com/new), create a public repo named `roozekrans-nl`.

**Step 2: Push**

```bash
git remote add origin https://github.com/MarcelRoozekrans/roozekrans-nl.git
git branch -M main
git push -u origin main
```

**Step 3: Deploy on Netlify**

1. Go to [app.netlify.com](https://app.netlify.com) → "Add new site" → "Import an existing project"
2. Connect GitHub → select `roozekrans-nl`
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click "Deploy site"

**Step 4: Set custom domain**

In Netlify → Domain settings → Add custom domain → `roozekrans.nl`

Update your DNS at your domain registrar:
- Add a CNAME record: `www` → `<your-netlify-subdomain>.netlify.app`
- Or follow Netlify's DNS instructions for apex domain (`roozekrans.nl`)

**Step 5: Verify**

Visit `https://roozekrans.nl` — site should load with HTTPS.

---

## Done

The site is live. Next steps (optional, whenever you want):
- Write real blog posts in `src/content/blog/`
- Add a LinkedIn link to About and Footer once confirmed
- Design a proper OG image (1200×630 dark background with your name)
- Add RSS feed using `@astrojs/rss` (endpoint at `/rss.xml`)
