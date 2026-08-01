# Design System Adoption & Light Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Retrofit every existing page and component onto semantic design tokens, resolve nine documented drift items (two of them WCAG AA failures), and honour `prefers-color-scheme: light` — with zero added client-side JavaScript.

**Architecture:** All themed values become runtime CSS custom properties on `:root`, overridden inside a `prefers-color-scheme: light` media query. Tailwind v4's `@theme inline` maps those variables to utility classes, so component markup references only semantic names (`bg-surface`, `text-muted`) and never a palette value. An executable guard script enforces this and runs in CI, which is what stops the system re-drifting.

**Tech Stack:** Astro 7 (static output), Tailwind CSS v4 via `@tailwindcss/vite` (CSS-first config — there is no `tailwind.config.js` and you must not create one), `@tailwindcss/typography`, Shiki (built into Astro), Node 24.

**Contract:** [2026-08-01-design-system-adoption-ui-contract.md](2026-08-01-design-system-adoption-ui-contract.md)
**Design system:** [docs/design/MASTER.md](../design/MASTER.md)

---

## Read This First

**There is no test framework in this repo.** No vitest, no playwright, no jest. CI runs exactly two commands: `npm run check` (`astro check`) and `npm run build`. Do not add a test framework — that is out of scope for this phase.

TDD still applies, but the executable assertion for a token retrofit is a **guard script**, not a unit test. Task 1 writes a script that fails against the current codebase (68+ violations), and every subsequent task drives that number down. That is a genuine red-green loop. Where a change is purely visual and no script can assert it, the plan says so explicitly rather than inventing a fake test.

**Baseline, verified 2026-08-01 before any work:**

- `npm run check` → `0 errors, 0 warnings, 0 hints` across 15 files
- 71 lines containing raw palette utilities, across 11 files (10 `.astro` + `global.css`)

Note the guard reports **matches**, not lines, and several lines carry more than one
violation (`about.astro:71` alone has five). Its count is therefore substantially higher
than 71 — treat the file list, not the number, as the thing to reconcile against. What
matters at the start: the guard fails, and it names all 11 files.

### Token name mapping

MASTER.md names tokens conceptually; Tailwind generates utilities from CSS variable names. These are the bindings — **use the right-hand column in markup**:

| MASTER.md token | CSS variable | Tailwind utility |
|---|---|---|
| `background` | `--color-background` | `bg-background` |
| `surface` | `--color-surface` | `bg-surface` |
| `surface-subtle` | `--color-surface-subtle` | `bg-surface-subtle` |
| `border` | `--color-border` | `border-border` |
| `border-strong` | `--color-border-strong` | `border-border-strong` |
| `text-primary` | `--color-foreground` | `text-foreground` |
| `text-body` | `--color-body` | `text-body` |
| `text-muted` | `--color-muted` | `text-muted` |
| `text-disabled` | `--color-disabled` | `text-disabled` |
| `accent` | `--color-accent` | `text-accent` |
| `accent-hover` | `--color-accent-hover` | `hover:text-accent-hover` |
| `accent-solid` | `--color-accent-solid` | `bg-accent-solid` |
| `accent-foreground` | `--color-accent-foreground` | `text-accent-foreground` |
| `accent-border` | `--color-accent-border` | `border-accent-border` |
| `sponsor` | `--color-sponsor` | `text-sponsor` |
| `sponsor-subtle` | `--color-sponsor-subtle` | `bg-sponsor-subtle` |

`border-border` reads oddly but is the standard Tailwind convention for a color token named `border` — do not rename it.

**Shadows and section spacing are consumed as arbitrary values** (`shadow-[var(--shadow-card)]`, `py-[var(--spacing-section)]`) rather than named theme entries. This is deliberate: it sidesteps any ambiguity in how Tailwind v4 resolves themed `--shadow-*` / `--spacing-*` namespaces, and works identically in every v4 release.

---

## Task 1: Token guard script (the failing test)

**Files:**
- Create: `scripts/check-tokens.mjs`
- Modify: `package.json` (scripts block)

**Step 1: Write the guard**

Create `scripts/check-tokens.mjs`:

```js
#!/usr/bin/env node
// Fails the build when component markup reaches past the semantic design tokens
// into raw Tailwind palette utilities. See docs/design/MASTER.md — the whole
// point of declaring a token is that nothing bypasses it.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// fileURLToPath (not URL.pathname) — pathname yields "/C:/..." on Windows.
const SRC = fileURLToPath(new URL('../src/', import.meta.url));
const SCANNED = /\.(astro|css)$/;

const RULES = [
  {
    re: /\b(?:bg|text|border|from|via|to|ring|divide|placeholder|decoration|outline|shadow|caret|fill|stroke)-(?:zinc|cyan|pink|slate|gray|neutral|stone)-\d{2,3}\b/g,
    msg: 'raw palette color — use a semantic token',
  },
  {
    re: /\b(?:text|bg|border)-(?:white|black)\b/g,
    msg: 'raw black/white — use text-foreground / bg-surface',
  },
  {
    re: /\bprose-(?:invert|cyan)\b/g,
    msg: 'theme-locked prose modifier — prose colors come from tokens',
  },
  {
    re: /\baccent-dark\b/g,
    msg: 'retired token — use accent-hover',
  },
];

async function* walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(path);
    else if (SCANNED.test(entry.name)) yield path;
  }
}

const violations = [];
for await (const path of walk(SRC)) {
  const lines = (await readFile(path, 'utf8')).split(/\r?\n/);
  lines.forEach((line, i) => {
    for (const { re, msg } of RULES) {
      for (const match of line.matchAll(re)) {
        violations.push({
          file: path.slice(SRC.length).replace(/\\/g, '/'),
          line: i + 1,
          text: match[0],
          msg,
        });
      }
    }
  });
}

if (violations.length === 0) {
  console.log('check-tokens: OK — no raw palette utilities in src/');
  process.exit(0);
}

const byFile = new Map();
for (const v of violations) {
  if (!byFile.has(v.file)) byFile.set(v.file, []);
  byFile.get(v.file).push(v);
}
for (const [file, list] of [...byFile].sort()) {
  console.error(`\n  ${file}`);
  for (const v of list) console.error(`    ${v.line}: ${v.text} — ${v.msg}`);
}
console.error(
  `\ncheck-tokens: FAILED — ${violations.length} violation(s) in ${byFile.size} file(s)\n`,
);
process.exit(1);
```

**Step 2: Wire up the npm script**

In `package.json`, add to `"scripts"` (leave every existing script untouched):

```json
"check:tokens": "node scripts/check-tokens.mjs",
```

**Step 3: Run it and verify it FAILS**

Run: `npm run check:tokens`

Expected: exit code 1, a per-file listing, and a final line reading roughly
`check-tokens: FAILED — 70 violation(s) in 11 file(s)`.

Actual at the time of writing: `109 violation(s) in 11 file(s), 13 files scanned`. The count is
higher than the 71-line baseline because several lines carry multiple violations. What matters:
**it is non-zero and it lists all 10 component files plus `styles/global.css`.** If it reports 0,
the script is not scanning correctly — fix it before continuing.

**Step 4: Commit**

The guard is deliberately NOT added to CI yet — it would make every intermediate commit red. Task 14 wires it in, once it passes.

```bash
git add scripts/check-tokens.mjs package.json
git commit -m "test(design): add token guard script

Fails while component markup uses raw palette utilities instead of
semantic tokens. Currently failing by design — Tasks 2-13 drive it
to zero, Task 14 wires it into CI."
```

---

## Task 2: Theme foundation in global.css

The keystone task. Everything after it is mechanical substitution.

**Files:**
- Modify: `src/styles/global.css`

**Step 1: Replace everything from `@theme` to end of file**

Keep the `@import`, `@plugin`, and all four `@font-face` blocks exactly as they are. Replace from the `@theme {` line onward with:

```css
/* ---------------------------------------------------------------------------
   Runtime theme variables.

   Dark is canonical and applies with no media query and no JS. Light is an
   equal-status alternative, not an inversion — the accent is re-derived
   (#22d3ee measures ~1.7:1 on an off-white canvas) and the elevation model
   flips from border-led to shadow-led. See docs/design/MASTER.md.

   If a manual theme toggle is ever added, guard the light block with
   :root:not([data-theme='dark']) and add explicit [data-theme] blocks. Not
   needed today — a toggle costs a render-blocking script on a zero-JS site.
   --------------------------------------------------------------------------- */
:root {
  color-scheme: dark;

  --canvas: #09090b;
  --surface: #18181b;
  --surface-subtle: #0d0d10;
  --line: #27272a;
  --line-strong: #3f3f46;

  --fg: #ffffff;
  --fg-body: #d4d4d8;
  --fg-muted: #a1a1aa;
  --fg-disabled: #71717a;

  --brand: #22d3ee;
  --brand-hover: #67e8f9;
  --brand-solid: #06b6d4;
  --brand-solid-hover: #22d3ee;
  --brand-on-solid: #09090b;
  --brand-border: rgb(34 211 238 / 0.4);

  --sponsor-fg: #f472b6;
  --sponsor-bg: rgb(236 72 153 / 0.1);
  --sponsor-line: rgb(236 72 153 / 0.4);

  --ok: #4ade80;
  --warn: #fbbf24;
  --err: #f87171;
  --info-fg: #60a5fa;

  /* Dark elevation is border-led: shadows are invisible on near-black. */
  --shadow-card: none;
  --shadow-card-hover: none;
  --shadow-sticky: none;

  --hero-glow: rgb(34 211 238 / 0.08);

  --spacing-section: clamp(4rem, 10vw, 7rem);

  /* Article measure. Deliberately NOT in `ch` — `ch` is the advance of the `0`
     glyph, which in Inter is ~32% wider than average lowercase, so `68ch` reads
     as ~90 characters rather than 68. 38rem is ~75 characters at the 17px prose
     size: the top of the comfortable 45-75 range, and wide enough that code
     samples stay readable on a technical blog. */
  --measure: 38rem;
}

@media (prefers-color-scheme: light) {
  :root {
    color-scheme: light;

    --canvas: #fafafa;
    --surface: #ffffff;
    --surface-subtle: #f4f4f5;
    --line: #e4e4e7;
    --line-strong: #d4d4d8;

    --fg: #18181b;
    --fg-body: #27272a;
    --fg-muted: #52525b;
    --fg-disabled: #a1a1aa;

    --brand: #0e7490;
    --brand-hover: #155e75;
    --brand-solid: #0e7490;
    --brand-solid-hover: #155e75;
    --brand-on-solid: #ffffff;
    --brand-border: rgb(14 116 144 / 0.35);

    --sponsor-fg: #be185d;
    --sponsor-bg: rgb(190 24 93 / 0.08);
    --sponsor-line: rgb(190 24 93 / 0.35);

    --ok: #15803d;
    --warn: #b45309;
    --err: #b91c1c;
    --info-fg: #1d4ed8;

    /* Light elevation is shadow-led: a white card on off-white separated only
       by a hairline reads as flat paper. Tinted with the canvas neutral, never
       pure black — black shadows go muddy on a neutral canvas. */
    --shadow-card: 0 1px 2px rgb(9 9 11 / 0.04), 0 1px 3px rgb(9 9 11 / 0.06);
    --shadow-card-hover: 0 4px 6px rgb(9 9 11 / 0.05), 0 10px 15px rgb(9 9 11 / 0.08);
    --shadow-sticky: 0 1px 3px rgb(9 9 11 / 0.08);

    /* A glow on white reads as dirt, not light. Removed, not adapted. */
    --hero-glow: transparent;
  }
}

/* ---------------------------------------------------------------------------
   Token -> utility bindings. `inline` makes the generated utilities reference
   the runtime variable directly, so the media query above can override them.
   --------------------------------------------------------------------------- */
@theme inline {
  --color-background: var(--canvas);
  --color-surface: var(--surface);
  --color-surface-subtle: var(--surface-subtle);
  --color-border: var(--line);
  --color-border-strong: var(--line-strong);

  --color-foreground: var(--fg);
  --color-body: var(--fg-body);
  --color-muted: var(--fg-muted);
  --color-disabled: var(--fg-disabled);

  --color-accent: var(--brand);
  --color-accent-hover: var(--brand-hover);
  --color-accent-solid: var(--brand-solid);
  --color-accent-solid-hover: var(--brand-solid-hover);
  --color-accent-foreground: var(--brand-on-solid);
  --color-accent-border: var(--brand-border);

  --color-sponsor: var(--sponsor-fg);
  --color-sponsor-subtle: var(--sponsor-bg);
  --color-sponsor-border: var(--sponsor-line);

  --color-success: var(--ok);
  --color-warning: var(--warn);
  --color-error: var(--err);
  --color-info: var(--info-fg);
}

@theme {
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Menlo, monospace;
}

@layer base {
  html {
    background-color: var(--canvas);
    color: var(--fg-body);
    scroll-behavior: smooth;
  }

  body {
    @apply font-sans antialiased;
  }

  h1, h2, h3, h4 {
    @apply font-semibold;
    color: var(--fg);
    /* Clears the sticky nav when jumped to via anchor. */
    scroll-margin-top: 5rem;
  }

  /* The site had no focus styling at all. This is the primary keyboard
     affordance across every page — never remove it. */
  :focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 2px;
    border-radius: inherit;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
}

/* ---------------------------------------------------------------------------
   Article prose. Driven entirely from tokens, which is what lets one rule set
   serve both themes — the inverted-prose modifier is deleted outright, rather
   than made theme-conditional.

   Note: the token guard scans comments too (deliberately — see the header of
   scripts/check-tokens.mjs), so avoid writing retired utility names literally
   in comments here.
   --------------------------------------------------------------------------- */
@layer components {
  .prose {
    --tw-prose-body: var(--fg-body);
    --tw-prose-headings: var(--fg);
    --tw-prose-lead: var(--fg-muted);
    --tw-prose-links: var(--brand);
    --tw-prose-bold: var(--fg);
    --tw-prose-counters: var(--fg-muted);
    --tw-prose-bullets: var(--line-strong);
    --tw-prose-hr: var(--line);
    --tw-prose-quotes: var(--fg-body);
    --tw-prose-quote-borders: var(--line);
    --tw-prose-captions: var(--fg-muted);
    --tw-prose-code: var(--brand);
    --tw-prose-pre-code: var(--fg-body);
    --tw-prose-pre-bg: var(--surface);
    --tw-prose-th-borders: var(--line);
    --tw-prose-td-borders: var(--line);

    font-size: 1.0625rem;   /* 17px — reading-optimized */
    line-height: 1.7;
    max-width: var(--measure);
  }

  /* Colour alone is insufficient to identify a link in body copy. */
  .prose :where(a):not(:where([class~='not-prose'] *)) {
    text-decoration-line: underline;
    text-underline-offset: 2px;
  }

  .prose :where(code):not(:where(pre *)) {
    background-color: var(--surface-subtle);
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    font-weight: 400;
  }

  .prose :where(code):not(:where(pre *))::before,
  .prose :where(code):not(:where(pre *))::after {
    content: none;
  }

  .prose :where(pre) {
    border: 1px solid var(--line);
  }
}

@media (prefers-color-scheme: light) {
  /* Code lifts above the page in dark mode and recedes in light mode. */
  .prose {
    --tw-prose-pre-bg: var(--surface-subtle);
  }
}
```

**Step 2: Verify the build compiles**

Run: `npm run build`
Expected: completes with no errors. If Tailwind errors on `@theme inline`, see the fallback note below before proceeding.

**Step 3: Prove the theming indirection actually works**

This is the one thing worth verifying before migrating ten files on top of it.

Run:

```bash
node -e "const fs=require('fs'),p='dist/_astro';const f=fs.readdirSync(p).find(n=>n.endsWith('.css'));const c=fs.readFileSync(p+'/'+f,'utf8');console.log('inline binding:',/--color-accent:\s*var\(--brand\)|var\(--brand\)/.test(c));console.log('light block:',/prefers-color-scheme:\s*light/.test(c));console.log('focus ring:',/:focus-visible/.test(c));"
```

Expected: all three print `true`.

If `inline binding` is false, `@theme inline` is not behaving as assumed in the installed Tailwind version (`^4.2.1`). **Fallback:** drop the `inline` keyword — a plain `@theme` block emitting `--color-accent: var(--brand)` still resolves at use-time because CSS custom properties are late-bound. Re-run this step to confirm before continuing. Do not proceed past this task until all three are `true`.

**Step 4: Verify the guard dropped**

Run: `npm run check:tokens`
Expected: still FAILS, but `styles/global.css` no longer appears in the listing and the count
is 3 lower (it currently contributes the `--color-accent-dark` declaration plus `bg-zinc-950`
and `text-white` in the `@apply`).

The guard deliberately scans comments as well as code — an earlier attempt at comment
stripping was removed because a hand-rolled stripper could silently blank a whole file and
turn the gate into a no-op with a passing build. A false positive on a comment is noisy and
self-announcing; a stripper that fails silently is not. So: keep retired utility names out
of comments, and never weaken a rule to make this pass.

**Step 5: Commit**

```bash
git add src/styles/global.css
git commit -m "feat(design): add runtime theme tokens and light theme foundation

Themed values become :root custom properties overridden under
prefers-color-scheme: light, bound to utilities via @theme inline.
Adds the site's first :focus-visible styling and reduced-motion
guard, and drives prose colours from tokens so prose-invert can be
retired."
```

---

## Task 3: BaseLayout — color-scheme, skip link, main landmark

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

**Step 1: Add the color-scheme meta**

After the `viewport` meta (line ~35), add:

```astro
    <meta name="color-scheme" content="dark light" />
```

Without this, form controls, scrollbars, and browser chrome stay dark in light mode.

**Step 2: Add the skip link and main landmark**

Replace the `<body>` block:

```astro
  <body class="min-h-screen flex flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-accent-solid focus:px-4 focus:py-2 focus:text-accent-foreground focus:font-medium"
    >
      Skip to content
    </a>
    <Nav />
    <main id="main" class="flex-1">
      <slot />
    </main>
    <Footer />
  </body>
```

**Step 3: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors, build succeeds.

**Step 4: Manual verification (no script can assert this)**

Run `npm run dev`, load `http://localhost:4321`, press `Tab` once. Expected: a visible "Skip to content" button appears top-left. Press `Enter` — focus moves past the nav.

**Step 5: Commit**

```bash
git add src/layouts/BaseLayout.astro
git commit -m "feat(a11y): add skip link, main landmark, and color-scheme meta"
```

---

## Task 4: Nav

**Files:**
- Modify: `src/components/Nav.astro`

**Step 1: Replace the markup block** (everything from `<header>` down)

```astro
<header class="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur shadow-[var(--shadow-sticky)]">
  <nav class="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
    <a href="/" class="font-mono text-lg font-semibold text-accent hover:text-accent-hover transition-colors">
      roozekrans.nl
    </a>
    <ul class="flex gap-6">
      {navLinks.map(({ href, label }) => {
        const isCurrent = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
          <li>
            <a
              href={href}
              aria-current={isCurrent ? 'page' : undefined}
              class={`text-sm font-medium transition-colors py-2 ${
                isCurrent
                  ? 'text-accent border-b border-accent'
                  : 'text-muted hover:text-foreground'
              }`}
            >
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  </nav>
</header>
```

Three fixes here beyond tokenisation:

- `hover:text-accent-dark` darkened the wordmark on hover, *lowering* contrast against the near-black canvas. Now lightens via `accent-hover`.
- Non-current links hovered to `accent`, competing with the current-page signal. Hover now goes to `text-foreground`; accent means "you are here".
- `aria-current="page"` added — the current page was previously conveyed by colour and a border alone.

`py-2` raises the link touch target toward 44px on mobile.

**Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "feat(design): migrate Nav to tokens, fix hover direction, add aria-current"
```

---

## Task 5: Footer

**Files:**
- Modify: `src/components/Footer.astro`

**Step 1: Replace the `<footer>` element**

```astro
<footer class="border-t border-border py-8 mt-[var(--spacing-section)]">
  <div class="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-between gap-4 text-muted text-sm">
    <span>&copy; <span id="copyright-year">{buildYear}</span> Marcel Roozekrans</span>
    <div class="flex flex-wrap gap-4">
      <a href="https://github.com/MarcelRoozekrans" target="_blank" rel="noopener" class="hover:text-accent transition-colors">GitHub</a>
      <a href="https://www.nuget.org/profiles/MarcelRoozekrans" target="_blank" rel="noopener" class="hover:text-accent transition-colors">NuGet</a>
      <a href="https://www.linkedin.com/in/marcelroozekrans/" target="_blank" rel="noopener" class="hover:text-accent transition-colors">LinkedIn</a>
      <a href="https://github.com/sponsors/MarcelRoozekrans" target="_blank" rel="noopener" class="text-sponsor hover:opacity-80 transition-opacity">Sponsor</a>
    </div>
  </div>
</footer>
```

Leave the `<script is:inline>` block below it **untouched**. It is the site's only client-side JS and it solves a real problem (a statically built site going months between deploys would otherwise show a stale copyright). The zero-JS goal in this phase applies to *new* JS.

`flex-wrap` + `gap-4` added because five items in a row overflow at 375px.

**Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 3: Commit**

```bash
git add src/components/Footer.astro
git commit -m "feat(design): migrate Footer to tokens, add sponsor token, fix mobile wrap"
```

---

## Task 6: ProjectCard

**Files:**
- Modify: `src/components/ProjectCard.astro`

**Step 1: Replace the `<article>` block** (leave the frontmatter unchanged)

```astro
<article class="group rounded-xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:border-accent-border hover:shadow-[var(--shadow-card-hover)] transition-all duration-200">
  <h3 class="font-semibold text-foreground text-lg mb-2">{title}</h3>
  <p class="text-muted text-sm mb-4 leading-relaxed">{description}</p>
  <div class="flex flex-wrap gap-2 mb-4">
    {tags.map(tag => (
      <span class="font-mono text-xs bg-surface-subtle text-accent px-2 py-0.5 rounded">{tag}</span>
    ))}
  </div>
  <div class="flex flex-wrap gap-3 text-sm">
    {github && (
      <a href={github} target="_blank" rel="noopener" class="text-muted hover:text-accent transition-colors">
        GitHub <span aria-hidden="true">&rarr;</span>
      </a>
    )}
    {nuget && (
      <a href={nuget} target="_blank" rel="noopener" class="text-muted hover:text-accent transition-colors">
        NuGet <span aria-hidden="true">&rarr;</span>
      </a>
    )}
    {marketplace && (
      <a href={marketplace} target="_blank" rel="noopener" class="text-muted hover:text-accent transition-colors">
        Marketplace <span aria-hidden="true">&rarr;</span>
      </a>
    )}
    {docs && (
      <a href={docs} target="_blank" rel="noopener" class="text-muted hover:text-accent transition-colors">
        Docs <span aria-hidden="true">&rarr;</span>
      </a>
    )}
  </div>
</article>
```

**Do not convert this to a whole-card link.** It carries up to four co-equal external destinations and no canonical one — a card-wide link would produce an unpredictable click target. This is a deliberate exception recorded in MASTER.md; the `group` hover lift signals "interactive content within", not "click anywhere".

**Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 3: Commit**

```bash
git add src/components/ProjectCard.astro
git commit -m "feat(design): migrate ProjectCard to tokens with light-mode shadows"
```

---

## Task 7: BlogCard

**Files:**
- Modify: `src/components/BlogCard.astro`

**Step 1: Replace the `<a>` block**

```astro
<a href={`/blog/${id}`} class="group block rounded-xl border border-border bg-surface p-6 shadow-[var(--shadow-card)] hover:-translate-y-1 hover:border-accent-border hover:shadow-[var(--shadow-card-hover)] transition-all duration-200">
  <time datetime={date.toISOString()} class="font-mono text-xs text-muted">{formattedDate}</time>
  <h3 class="font-semibold text-foreground text-lg mt-1 mb-2 group-hover:text-accent transition-colors">{title}</h3>
  <p class="text-muted text-sm leading-relaxed mb-3">{description}</p>
  <div class="flex flex-wrap gap-2">
    {tags.map(tag => (
      <span class="font-mono text-xs bg-surface-subtle text-accent px-2 py-0.5 rounded">{tag}</span>
    ))}
  </div>
</a>
```

Two fixes beyond tokenisation: the date moves off `zinc-500` (**4.3:1 — a WCAG AA failure**) onto `text-muted`, and `<time>` gains a machine-readable `datetime`.

**Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 3: Commit**

```bash
git add src/components/BlogCard.astro
git commit -m "fix(a11y): raise BlogCard date contrast above AA, add datetime attribute"
```

---

## Task 8: Home page

**Files:**
- Modify: `src/pages/index.astro`

**Step 1: Replace the three `<section>` blocks** (leave the frontmatter and the JSON-LD `<Fragment>` untouched)

```astro
  <!-- Hero -->
  <section class="relative overflow-hidden border-b border-border">
    <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--hero-glow)_0%,_transparent_70%)]" />
    <div class="relative mx-auto max-w-5xl px-6 py-28">
      <p class="font-mono text-accent text-sm mb-4">Hi, I'm</p>
      <h1 class="text-[clamp(2.5rem,6vw,3.5rem)] font-bold text-foreground mb-4 tracking-tight leading-[1.1]">Marcel Roozekrans</h1>
      <p class="text-xl text-muted max-w-xl leading-relaxed">
        Software Engineer · Open Source Developer · .NET enthusiast building tools, libraries, and the occasional side project.
      </p>
      <div class="flex flex-wrap gap-4 mt-8">
        <a href="/projects" class="bg-accent-solid text-accent-foreground font-semibold px-5 py-2.5 rounded-lg hover:bg-accent-solid-hover transition-colors text-sm">
          View Projects
        </a>
        <a href="/blog" class="border border-border-strong text-body font-medium px-5 py-2.5 rounded-lg hover:border-disabled transition-colors text-sm">
          Read Blog
        </a>
      </div>
    </div>
  </section>

  <!-- Open source at a glance -->
  <section class="border-b border-border bg-surface-subtle">
    <dl class="mx-auto max-w-5xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
      {stats.map(({ value, label }) => (
        <div>
          <dt class="sr-only">{label}</dt>
          <dd>
            <span class="block font-mono text-3xl font-bold text-accent tabular-nums">{value}</span>
            <span class="block text-muted text-sm mt-1">{label}</span>
          </dd>
        </div>
      ))}
    </dl>
  </section>

  <!-- Featured Projects -->
  <section class="mx-auto max-w-5xl px-6 py-16">
    <div class="flex items-center justify-between mb-8">
      <h2 class="text-2xl font-bold text-foreground">Featured Projects</h2>
      <a href="/projects" class="text-sm text-accent hover:text-accent-hover transition-colors">All projects <span aria-hidden="true">&rarr;</span></a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      {featuredProjects.map(project => (
        <ProjectCard
          title={project.data.title}
          description={project.data.description}
          tags={project.data.tags}
          github={project.data.github}
          nuget={project.data.nuget}
          marketplace={project.data.marketplace}
          docs={project.data.docs}
        />
      ))}
    </div>
  </section>

  <!-- Latest Posts -->
  {latestPosts.length > 0 && (
    <section class="mx-auto max-w-5xl px-6 py-16 border-t border-border">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-2xl font-bold text-foreground">Latest Posts</h2>
        <a href="/blog" class="text-sm text-accent hover:text-accent-hover transition-colors">All posts <span aria-hidden="true">&rarr;</span></a>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        {latestPosts.map(post => (
          <BlogCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            tags={post.data.tags}
            id={post.id}
          />
        ))}
      </div>
    </section>
  )}
```

The hero glow now reads `var(--hero-glow)`, which resolves to `transparent` in light mode — the glow disappears with no conditional markup. The hero `h1` moves to the `display` clamp.

**Step 2: Guard the featured-projects section**

Per the contract, mirror the posts guard. Wrap the Featured Projects `<section>` in `{featuredProjects.length > 0 && ( ... )}` so an empty `featured` set renders nothing rather than a heading over an empty grid.

**Step 3: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 4: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(design): migrate home page to tokens, theme-aware hero glow"
```

---

## Task 9: Projects and Blog index pages

**Files:**
- Modify: `src/pages/projects.astro`
- Modify: `src/pages/blog/index.astro`

**Step 1: projects.astro** — replace the wrapper `<div>` contents:

```astro
  <div class="mx-auto max-w-5xl px-6 py-16">
    <h1 class="text-4xl font-bold text-foreground mb-4">Projects</h1>
    <p class="text-muted mb-12">Open source libraries and tools I've built for the .NET ecosystem and beyond.</p>
```

Leave the grid and `ProjectCard` mapping untouched.

**Step 2: blog/index.astro** — replace the wrapper `<div>` contents:

```astro
  <div class="mx-auto max-w-5xl px-6 py-16">
    <h1 class="text-4xl font-bold text-foreground mb-4">Blog</h1>
    <p class="text-muted mb-12">Thoughts on .NET, open source, and building software.</p>

    {posts.length === 0 ? (
      <div class="rounded-xl border border-border bg-surface p-8 text-center">
        <p class="text-muted mb-4">No posts yet — the first one is in progress.</p>
        <a href="/projects" class="text-accent hover:text-accent-hover transition-colors text-sm">
          Browse the projects instead <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    ) : (
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {posts.map(post => (
          <BlogCard
            title={post.data.title}
            description={post.data.description}
            date={post.data.date}
            tags={post.data.tags}
            id={post.id}
          />
        ))}
      </div>
    )}
  </div>
```

The empty state moves off failing `zinc-500` and gains the CTA the contract requires.

**Step 3: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 4: Commit**

```bash
git add src/pages/projects.astro src/pages/blog/index.astro
git commit -m "feat(design): migrate index pages to tokens, add blog empty-state CTA"
```

---

## Task 10: About page

**Files:**
- Modify: `src/pages/about.astro`

**Step 1: Replace the wrapper `<div>` and its contents** (leave the frontmatter arrays unchanged)

```astro
  <div class="mx-auto max-w-[var(--measure)] px-6 py-16">
    <h1 class="text-4xl font-bold text-foreground mb-8">About Me</h1>

    <div class="mb-12">
      <p class="text-body text-lg leading-relaxed mb-4">
        Hi! I'm Marcel — a software engineer based in Heemstede, the Netherlands. I run
        <strong class="text-foreground">Roozekrans IT-Solutions</strong> and have extensive experience in
        website and software development, with a deep focus on the .NET ecosystem.
      </p>
      <p class="text-body text-lg leading-relaxed mb-4">
        I enjoy building open source libraries that make other developers' lives easier, with a particular
        interest in performance, source generators, and developer tooling. I studied Information Engineering
        at the Hogeschool van Amsterdam.
      </p>
      <p class="text-body text-lg leading-relaxed">
        When I'm not writing code, you'll probably find me underwater — I'm a certified dive instructor (KSS3)
        and active member of Onderwatersport Vereniging Haarlem. I believe in writing software that
        is simple, fast, and well-tested.
      </p>
    </div>

    <h2 class="text-2xl font-bold text-foreground mb-6">Skills &amp; Tech</h2>
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
      {skills.map(({ category, items }) => (
        <div>
          <h3 class="font-mono text-accent text-xs uppercase tracking-widest mb-3">{category}</h3>
          <ul class="space-y-1">
            {items.map(item => (
              <li class="text-body text-sm">{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    <h2 class="text-2xl font-bold text-foreground mb-6">Certifications</h2>
    <ul class="space-y-2 mb-12">
      {certifications.map(cert => (
        <li class="text-body text-sm flex items-center gap-2">
          <span class="text-accent" aria-hidden="true">&#9670;</span> {cert}
        </li>
      ))}
    </ul>

    <h2 class="text-2xl font-bold text-foreground mb-6">Sponsor My Work</h2>
    <div class="rounded-xl border border-border bg-surface p-6 mb-12 shadow-[var(--shadow-card)]">
      <p class="text-body text-sm leading-relaxed mb-4">
        Everything I build is open source and free to use. Sponsorship is what lets me spend time on
        it instead of client work — it funds continued maintenance of the ZeroAlloc.NET packages,
        .NET version upgrades across every project, and more MCP servers and AI tooling for .NET developers.
      </p>
      <a href="https://github.com/sponsors/MarcelRoozekrans" target="_blank" rel="noopener"
         class="inline-flex items-center gap-2 bg-sponsor-subtle border border-sponsor-border text-sponsor px-4 py-2 rounded-lg hover:border-sponsor transition-colors text-sm font-medium">
        <span aria-hidden="true">&#10084;</span> Become a sponsor
      </a>
    </div>

    <h2 class="text-2xl font-bold text-foreground mb-6">Find Me</h2>
    <div class="flex flex-wrap gap-4">
      {[
        { href: 'https://github.com/MarcelRoozekrans', label: 'GitHub' },
        { href: 'https://www.nuget.org/profiles/MarcelRoozekrans', label: 'NuGet' },
        { href: 'https://www.linkedin.com/in/marcelroozekrans/', label: 'LinkedIn' },
        { href: 'https://keybase.io/marcelroozekrans', label: 'Keybase' },
      ].map(({ href, label }) => (
        <a href={href} target="_blank" rel="noopener"
           class="flex items-center gap-2 border border-border-strong text-body px-4 py-2 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm">
          {label}
        </a>
      ))}
    </div>
  </div>
```

The four "Find Me" buttons were four near-identical copies of the same markup — collapsed to a mapped array (DRY). The `◆` glyph is now `aria-hidden`; screen readers were announcing it as content.

**Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 3: Commit**

```bash
git add src/pages/about.astro
git commit -m "feat(design): migrate About to tokens, scope sponsor colour, DRY link list"
```

---

## Task 11: 404 page

**Files:**
- Modify: `src/pages/404.astro`

**Step 1: Replace the wrapper `<div>`**

```astro
  <div class="mx-auto max-w-5xl px-6 py-32 text-center">
    <p class="font-mono text-accent text-sm mb-4">404</p>
    <h1 class="text-4xl font-bold text-foreground mb-4">Page not found</h1>
    <p class="text-muted mb-8">This page doesn't exist.</p>
    <a href="/" class="text-accent hover:text-accent-hover transition-colors"><span aria-hidden="true">&larr;</span> Back home</a>
  </div>
```

**Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat(design): migrate 404 page to tokens"
```

---

## Task 12: BlogPostLayout — tokens and prose

Split across two commits. The measure change is visible on every existing post, so it lands separately and reverts cleanly.

**Files:**
- Modify: `src/layouts/BlogPostLayout.astro`

**Step 1: Replace the `<article>` block** (leave the frontmatter and JSON-LD untouched)

```astro
  <article class="mx-auto max-w-[var(--measure)] px-6 py-16">
    <header class="mb-10">
      <div class="flex flex-wrap gap-2 mb-4">
        {tags.map(tag => (
          <span class="font-mono text-xs bg-surface-subtle text-accent px-2 py-0.5 rounded">{tag}</span>
        ))}
      </div>
      <h1 class="text-4xl font-bold text-foreground mb-4 leading-tight">{title}</h1>
      <time datetime={date.toISOString()} class="font-mono text-sm text-muted">{formattedDate}</time>
    </header>

    <div class="prose">
      <slot />
    </div>
  </article>
```

Four fixes here, all contracted:

- `prose-headings:text-cyan-400` is **gone**. Accent-coloured headings destroyed the "accent = interactive" signal that the whole system rests on. Headings are `--tw-prose-headings` → `--fg`, set in `global.css`.
- `prose-invert prose-cyan` deleted — prose colours come from tokens and serve both themes.
- The long `prose-*` modifier chain is deleted; those rules now live in `global.css`.
- Date moves off failing `zinc-500`; `<time>` gains `datetime`.

**Do not add `max-w-none`.** The `.prose` rules in `global.css` are unlayered, which is what
makes them beat the typography plugin — but it also means no utility class can override them,
`max-w-none` included. `.prose` therefore sets no `max-width` at all; the `article` wrapper
owns the measure via `max-w-[var(--measure)]`, and adding `max-w-none` would be inert.

**Step 2: Verify and commit the token work**

Run: `npm run check && npm run build`
Expected: 0 errors.

```bash
git add src/layouts/BlogPostLayout.astro
git commit -m "feat(design): migrate BlogPostLayout to tokens, drop accent headings

prose-headings:text-cyan-400 made every article heading read as
interactive, which is exactly what the accent is reserved for.
Headings are now foreground; prose colour comes from tokens, so
prose-invert is no longer needed for the light theme."
```

**Step 3: Confirm the measure change visually**

Run `npm run dev` and open any post, e.g. `http://localhost:4321/blog/hello-world`.
Expected: the text column is noticeably narrower (~608px vs the previous 768px).

This is the one change a returning reader will notice. It is already committed above as part of the wrapper replacement — if it needs reverting, revert only the `max-w-[var(--measure)]` value back to `max-w-3xl` and update MASTER.md's measure spec to match, so the doc and code stay in agreement.

---

## Task 13: Shiki light/dark pairing

**Files:**
- Modify: `astro.config.mjs`

**Step 1: Add the theme pair**

```js
export default defineConfig({
  site: 'https://roozekrans.nl',
  output: 'static',

  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), sitemap()],
});
```

Astro's dual-theme Shiki output is driven by CSS variables and switches on `prefers-color-scheme` automatically — no extra CSS needed. `wrap: true` prevents horizontal page overflow from long code lines on mobile.

**Step 2: Verify**

Run: `npm run check && npm run build`
Expected: 0 errors.

**Step 3: Confirm both themes render**

Run `npm run dev`, open a post containing a fenced code block (`/blog/adonet-async-intro`). Toggle your OS between light and dark appearance. Expected: the code block re-themes without a reload.

**Step 4: Commit**

```bash
git add astro.config.mjs
git commit -m "feat(design): pair Shiki light/dark themes and wrap long code lines"
```

---

## Task 14: Guard passes, wire into CI, full verification

**Files:**
- Modify: `.github/workflows/ci.yml`
- Modify: `package.json`

**Step 1: The guard must now pass (GREEN)**

Run: `npm run check:tokens`
Expected: `check-tokens: OK — no raw palette utilities in src/`

If any violations remain, fix them now — do not weaken the script's rules to make it pass. That would defeat the entire purpose of the phase.

**Step 2: Wire it into CI**

In `.github/workflows/ci.yml`, add a step between `npm ci` and `npm run check`:

```yaml
      - run: npm run check:tokens
```

**Step 3: Make it part of the local check**

In `package.json`, update the `check` script so the guard runs by default:

```json
"check": "node scripts/check-tokens.mjs && astro check",
```

Keep `check:tokens` as a separate entry for running the guard alone.

**Step 4: Full verification**

Run: `npm run check && npm run build`
Expected: token guard OK, `0 errors, 0 warnings, 0 hints`, build succeeds.

**Step 5: Verify no new client-side JavaScript**

Run:

```bash
grep -rn "<script" src/ --include=*.astro
```

Expected: exactly one hit — the copyright-year script in `Footer.astro`. Any other `<script>` tag means the zero-JS constraint was broken. (JSON-LD `<script type="application/ld+json">` blocks are data, not JS, and will also appear — there are three, in `BaseLayout`, `index`, and `BlogPostLayout`. Only executable `<script>` tags count.)

**Step 6: Manual cross-theme sweep**

No script can assert this. Run `npm run dev` and check every route — `/`, `/about`, `/projects`, `/blog`, a post, `/404` — at 1920px, 768px, and 375px, in **both** OS colour schemes. Confirm:

- No element stays dark-on-dark or light-on-light
- The hero glow is absent in light mode
- Cards have visible shadows in light mode and none in dark
- `Tab` through each page shows a visible focus ring on every interactive element
- Nav current-page state is visible and distinct from hover

**Step 7: Commit**

```bash
git add .github/workflows/ci.yml package.json
git commit -m "ci: enforce design token usage on every build

The guard now passes; wiring it into CI and the local check script
is what stops the token system re-drifting."
```

---

## Task 15: Update MASTER.md — close out the drift list

**Files:**
- Modify: `docs/design/MASTER.md`

**Step 1: Replace the "Known Drift to Resolve" section**

All nine items are resolved. Replace the section body with:

```markdown
## Drift — Resolved

All nine items resolved in phase 3.1 (2026-08-01), see
[the UI contract](../plans/2026-08-01-design-system-adoption-ui-contract.md).
Enforcement is now automated: `scripts/check-tokens.mjs` runs in CI and fails
the build on any raw palette utility, retired token, or theme-locked prose
modifier in `src/`.

If new drift appears, add a rule to that script rather than only noting it here
— a documented convention with no enforcement is how the first nine happened.
```

**Step 2: Add the token mapping table**

Add to the "Stack-Specific Notes" section, so the doc names and the utility names can never silently diverge:

```markdown
### Token name bindings

MASTER.md names tokens conceptually; Tailwind derives utility names from CSS
variables. The bindings live in the implementation plan's mapping table and in
the `@theme inline` block of `global.css`. Where a doc name would produce an
awkward utility (`text-primary` → `text-text-primary`), the utility uses the
shorter conventional form (`text-foreground`). Both names refer to one value —
never introduce a third.
```

**Step 3: Commit**

```bash
git add docs/design/MASTER.md
git commit -m "docs(design): close out drift list, record token name bindings"
```

---

## Done Criteria

- [ ] `npm run check` passes — token guard OK, 0 astro errors
- [ ] `npm run build` succeeds
- [ ] `npm run check:tokens` reports zero violations
- [ ] CI runs the guard on every push and PR
- [ ] All nine MASTER.md drift items resolved
- [ ] No text below 4.5:1 in either theme
- [ ] Visible focus ring on every interactive element, both themes
- [ ] Hero glow absent in light mode; card shadows present in light, absent in dark
- [ ] No new client-side JavaScript (Footer copyright script is the only one)
- [ ] `--color-accent-dark` no longer exists anywhere

## Follow-up (explicitly NOT this phase)

- `ui-review` with `regression-test` for screenshot evidence at all three viewports × two themes
- Manual theme toggle — deliberately deferred; costs a render-blocking script on a zero-JS site
- Automated contrast assertion — the guard checks token *usage*, not computed contrast. A future axe/pa11y pass in CI would close that gap.
