# UI Design Contract: Design System Adoption & Light Theme

> **Purpose:** Defines the visual and interaction specification for the `design-system-adoption` frontend phase.
> Produced by `ui-phase` before implementation; used by `ui-review` to audit the result.

**Date:** 2026-08-01
**Phase:** 3.1 — Design System Adoption & Light Theme
**Design system:** Sourced from [docs/design/MASTER.md](../design/MASTER.md) — no colors or typography were re-elicited.
**Plan:** to be produced by `writing-plans` after this contract is approved.

---

## Phase Intent

This is a **retrofit phase, not a feature phase**. No new pages, routes, or content.
The entire site already exists and works; this phase makes it conform to the design
system and adds the light theme.

Three outcomes:

1. Every themed value routes through a semantic `@theme` token — no raw palette utilities.
2. The nine drift items in [MASTER.md → Drift](../design/MASTER.md#drift--resolved) are resolved, including two genuine accessibility defects.
3. `prefers-color-scheme: light` is honoured, with zero added client-side JavaScript.

**Explicit non-goals:** no manual theme toggle (see MASTER.md rationale — it costs a
render-blocking script on a currently zero-JS site), no new components, no content changes,
no layout redesign. Where this contract changes a layout value it is to match the design
system, not to redesign.

---

## Design System

Sourced wholesale from [MASTER.md](../design/MASTER.md). Reproduced here only as the audit
target — MASTER.md remains authoritative if the two ever disagree.

### Colors — token contract

Implementation is via `@theme inline` indirection so both themes resolve at runtime.
Component code references **only** the left column.

| Token | Dark | Light | Usage |
|---|---|---|---|
| `background` | `#09090B` | `#FAFAFA` | Page canvas |
| `surface` | `#18181B` | `#FFFFFF` | Cards, panels |
| `surface-subtle` | `zinc-900/30` | `#F4F4F5` | Stats band, light-mode code blocks |
| `border` | `#27272A` | `#E4E4E7` | Hairlines |
| `border-strong` | `#3F3F46` | `#D4D4D8` | Secondary button, inputs |
| `text-primary` | `#FFFFFF` | `#18181B` | Headings, card titles |
| `text-body` | `#D4D4D8` | `#27272A` | Prose |
| `text-muted` | `#A1A1AA` | `#52525B` | Descriptions, dates, metadata |
| `text-disabled` | `#71717A` | `#A1A1AA` | Decorative/disabled **only** — fails AA |
| `accent` | `#22D3EE` | `#0E7490` | Links, eyebrows, stat figures, focus ring |
| `accent-hover` | `#67E8F9` | `#155E75` | Accent text hover (lighter in dark, darker in light) |
| `accent-solid` | `#06B6D4` | `#0E7490` | Filled button surface |
| `accent-foreground` | `#09090B` | `#FFFFFF` | Text on `accent-solid` |
| `accent-border` | `cyan/40` | `cyan-700/35` | Card hover border |
| `success` / `warning` / `error` / `info` | 400-family | 700-family | State signals — always paired with a label |
| `sponsor` | `#F472B6` | `#BE185D` | GitHub Sponsors CTA **only** — scoped exception, not a second accent |
| `sponsor-subtle` | `pink-500/10` | `pink-700/08` | Sponsor CTA fill |

**Retired tokens:** `--color-accent-dark` is removed. Its single consumer (nav wordmark hover)
moves to `accent-hover`.

### Typography

Per MASTER.md type scale. Both families already self-hosted — **this phase adds no font requests.**

| Role | Font | Size | Weight | Line-height |
|---|---|---|---|---|
| `display` (hero h1) | Inter | `clamp(2.5rem, 6vw, 3.5rem)` | 700 | 1.1 |
| `h1` (page/article) | Inter | 36px | 700 | 1.2 |
| `h2` | Inter | 24px | 700 | 1.3 |
| `h3` | Inter | 20px | 600 | 1.4 |
| `h4` (card title) | Inter | 18px | 600 | 1.4 |
| `body-lg` | Inter | 20px | 400 | 1.6 |
| `body` (prose) | Inter | 17px | 400 | 1.7 |
| `body-sm` | Inter | 14px | 400 | 1.6 |
| `label` | Inter | 12px | 500 | 1.4 |
| `mono` | JetBrains Mono | 14px | 400 | 1.6 |
| `mono-stat` | JetBrains Mono | 30px | 700 | 1.1 + `tabular-nums` |

### Spacing & Radius

4px base. Section rhythm `--spacing-section: clamp(4rem, 10vw, 7rem)`.
Radius: cards `12px`, buttons/code `8px`, tags `4px`.

### Component Library

- [x] **Tailwind CSS v4** (`@tailwindcss/vite`, CSS-first config — no `tailwind.config.js`)
- [x] `@tailwindcss/typography` for article prose
- [ ] No component library — all components are hand-authored `.astro` files

---

## Components

Eight existing components/layouts are in scope. **No new components.**

### Component: `Nav`

**Purpose:** Sticky site header with wordmark and four top-level links.
**File:** [src/components/Nav.astro](../../src/components/Nav.astro)
**Props API:** none (reads `Astro.url.pathname`).

**Required changes:**

| Change | From | To |
|---|---|---|
| Wordmark hover | `hover:text-accent-dark` (darkens — lowers contrast) | `hover:text-accent-hover` |
| Rest link color | `text-zinc-400` | `text-muted` |
| Hover link color | `hover:text-accent` | `hover:text-text-primary` — accent is reserved for the *current* page |
| Current page | `text-accent` + border, no ARIA | add `aria-current="page"` |
| Backdrop | `bg-zinc-950/90` | `bg-background/90` (must follow theme) |

**States:** rest, hover, current, focus-visible. No loading/empty/error — nav is static.
**Visual notes:** Light mode adds `--shadow-sticky` on scroll; dark mode relies on the hairline alone. Sticky offset must not obscure focused elements — apply `scroll-margin-top` to headings.

### Component: `ProjectCard`

**Purpose:** Summarises one open-source project with its external destinations.
**File:** [src/components/ProjectCard.astro](../../src/components/ProjectCard.astro)

**Props API:** unchanged.

| Prop | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | Yes | Project name |
| `description` | `string` | Yes | One-line summary |
| `tags` | `string[]` | Yes | Tech tags |
| `github` / `nuget` / `marketplace` / `docs` | `string` | No | External URLs |

**Required changes:** `bg-zinc-900` → `surface`; `border-zinc-800` → `border`;
`hover:border-cyan-400/40` → `accent-border`; tag `bg-zinc-800 text-cyan-400` →
`surface-subtle` + `text-accent`; link `text-zinc-400 hover:text-accent` → `text-muted`.

**Explicitly NOT changed:** this card **stays a non-link `<article>`**. It has 2–4 co-equal
external destinations and no canonical one, so a whole-card link would produce an
unpredictable click target. The hover lift signals "interactive content within".

**States:** rest, hover (lift + accent border), focus-within. Cards render from a build-time
content collection — there is no loading or error state, and `getCollection` cannot return
partial data.
**Visual notes:** `radius-xl`, `space-6` padding, `duration-200`, transform + color only. Light mode adds `--shadow-card` / `--shadow-card-hover`. Lift must be suppressed under `prefers-reduced-motion`.

### Component: `BlogCard`

**Purpose:** Summarises one post; links to it.
**File:** [src/components/BlogCard.astro](../../src/components/BlogCard.astro)

**Props API:** `title`, `description`, `date` (`Date`), `tags`, `id` — all required.

**Required changes:**

| Change | From | To | Reason |
|---|---|---|---|
| Date color | `text-zinc-500` | `text-muted` | **4.3:1 fails WCAG AA** |
| Card fill/border | `zinc-900` / `zinc-800` / `cyan-400/40` | `surface` / `border` / `accent-border` | Tokenisation |
| Tag | `bg-zinc-800 text-cyan-400` | `surface-subtle` + `text-accent` | Tokenisation |
| Title hover | `group-hover:text-accent` | unchanged (correct) | — |

**Stays a whole-card `<a>`** — one canonical destination. Correct as built.
**States:** rest, hover, focus-visible (ring on the card, `radius-xl`).
**Visual notes:** `<time>` needs a machine-readable `datetime` attribute.

### Component: `Footer`

**Purpose:** Copyright and external profile links.
**File:** [src/components/Footer.astro](../../src/components/Footer.astro)

**Required changes:** `border-zinc-800` → `border`; `text-zinc-400` → `text-muted`;
arbitrary `mt-20` → `space-24` / section rhythm; `text-pink-400 hover:text-pink-300` →
`text-sponsor` (theme-aware — the raw pink fails on the light canvas).

**Note:** the inline `<script>` rewriting the copyright year is the site's only client-side
JS. It is **retained** — the phase's zero-JS goal applies to *new* JS, and this script solves
a real staleness problem on a statically built site.

### Component: `StatFigure` (inline, in `index.astro`)

**Purpose:** Four open-source metrics in a banded row.
**Required changes:** `text-accent` already correct; keep `tabular-nums`; `text-zinc-400` →
`text-muted`; band `bg-zinc-900/30` → `surface-subtle`.
**States:** static. Values derive from the projects collection at build time.
**Visual notes:** stays `<dl>`/`<dt class="sr-only">`/`<dd>`. This is the one section permitted a background band.

### Layout: `BaseLayout`

**File:** [src/layouts/BaseLayout.astro](../../src/layouts/BaseLayout.astro)

**Required additions:**

1. `<meta name="color-scheme" content="dark light">` — so form controls, scrollbars and browser chrome follow the theme.
2. A skip-to-content link as the first focusable element (`sr-only`, visible on focus).
3. `id="main"` on `<main>` as the skip target.

### Layout: `BlogPostLayout`

**File:** [src/layouts/BlogPostLayout.astro](../../src/layouts/BlogPostLayout.astro)

The largest visual change in the phase.

| Change | From | To | Reason |
|---|---|---|---|
| Heading colour | `prose-headings:text-cyan-400` | `text-primary` | **Core thesis violation** — cyan headings destroy the "accent = interactive" signal |
| Measure | `max-w-3xl` (768px, ~94 chars) | `var(--measure)` — 41rem incl. gutters ≈ 608px of text, ~75 chars | Readability spec |
| Body size | typography default (16px) | `body` — 17px / 1.7 | Reading-optimised |
| Date | `text-zinc-500` | `text-muted` | **Fails AA** |
| Prose links | `no-underline`, underline on hover | **always underlined**, `underline-offset-2` | Colour alone is insufficient in body copy |
| `prose-invert` | unconditional | theme-conditional | Must not stay inverted in light mode |
| Code block | `bg-zinc-900` | `surface` (dark) / `surface-subtle` (light) | Code lifts in dark, recedes in light |

**Visual notes:** Shiki needs a paired light theme configured (`themes: { light, dark }`) — currently single-theme. Article `<h1>` uses the `h1` token, not `display`; `display` is reserved for the home hero.

### Page: `index` / `projects` / `blog` / `about` / `404`

No structural changes. Per-page token substitutions only:

- **index** — hero eyebrow/CTAs to tokens; CTA `bg-cyan-400` → `accent-solid` with `accent-foreground`; hero radial glow must be **removed in light mode** (a glow on white reads as dirt).
- **projects / blog** — headings, intro copy, grid gaps to tokens. Blog empty state: `text-zinc-500` → `text-muted`, and add a CTA per the empty-state spec below.
- **about** — `text-cyan-400` category headings and `◆` bullets → `text-accent`; `max-w-3xl` prose → `var(--measure)`; "Find Me" buttons → secondary-button spec; sponsor CTA `bg-pink-500/10 border-pink-500/40 text-pink-400` → `sponsor-subtle` / `sponsor` tokens.
- **404** — `text-cyan-400` / `hover:text-cyan-300` → `accent` / `accent-hover`.

---

## Layout Specification

Layout is **unchanged** from the current implementation except where noted. Documented here
so `ui-review` has a target at each breakpoint.

### Desktop (≥1280px)

```text
┌──────────────────────────────────────────────┐
│ Nav — sticky, hairline bottom, max-w-5xl     │
├──────────────────────────────────────────────┤
│  Hero — display h1, sub, 2 CTAs              │
│  (radial accent glow: DARK ONLY)             │
├──────────────────────────────────────────────┤
│  Stats band — surface-subtle, 4 columns      │
├──────────────────────────────────────────────┤
│  Featured Projects — 3-col grid, gap-4       │
├──────────────────────────────────────────────┤
│  Latest Posts — 3-col grid, gap-4            │
├──────────────────────────────────────────────┤
│ Footer — hairline top                        │
└──────────────────────────────────────────────┘
```

Shell `max-w-5xl` (1024px), gutters `px-6`. Article pages: single centred `var(--measure)` column.

### Tablet (768–1279px)

- Nav stays horizontal — 4 items fit; **no hamburger** at any breakpoint.
- Projects grid 3 → 2 columns; blog grid stays 2; stats 4 → 2 columns.
- Section padding follows `clamp()` — no discrete breakpoint needed.

### Mobile (<768px)

- All grids → single column; stats → 2 columns (not 1 — four single-column stats read as a list, not a summary).
- Nav **wraps** below `sm`. The original assumption — "wordmark + 4 short labels fit at 375px" — was **falsified by measurement**: `document.scrollWidth` was 401px at both 375px and 320px, clipping "Blog" off-screen. The nav container and its list both carry `flex-wrap`, and the wordmark drops to `text-base` below `sm`. Still no hamburger at any breakpoint.
- Touch targets ≥44×44px. The `py-2.5` CTAs pass at 44px. Nav links measured **33–34px** and were corrected to `min-h-11`, with the current-page underline moved onto an inner `<span>` so it hugs the text rather than sitting at the bottom of a 44px box.
- Hero `display` clamp bottoms out at 2.5rem/40px.

---

## Interaction States

### Page-level

This is a **static build with no runtime data fetching**. Loading, error, and success states
in the template's default sense do not apply, and inventing them would be dishonest scope.
The states that genuinely exist:

| State | Trigger | UI |
|---|---|---|
| Empty — blog list | Zero non-draft posts | `text-muted` message + link to `/projects`. Currently exists but uses failing `zinc-500` and has no CTA. |
| Empty — featured projects | No project has `featured: true` | Section renders no heading rather than an empty grid. Already handled for posts; mirror for projects. |
| Not found | Unknown route | `/404` page — the only error surface in the site. |
| Reduced motion | `prefers-reduced-motion: reduce` | All transitions collapse to `0.01ms`; card lift suppressed. |
| Light theme | `prefers-color-scheme: light` | Full light token set; hero glow removed; shadow ladder active. |

### Form behavior

**Not applicable** — the site contains no forms or inputs. If a contact form is added later
it needs its own contract.

---

## Accessibility Requirements

Two current defects and several gaps. All are in scope.

| Requirement | Current | Target |
|---|---|---|
| **Text contrast ≥4.5:1** | ❌ `zinc-500` dates at 4.3:1 (3 sites) | All body/meta text ≥4.5:1 in **both** themes |
| **Visible focus ring** | ❌ Absent site-wide | Global `:focus-visible` — 2px `accent`, `offset-2`, `border-radius: inherit` |
| **Reduced motion** | ❌ Absent | `@media (prefers-reduced-motion: reduce)` collapsing all transitions |
| **Current page in nav** | ⚠️ Colour + border only | `aria-current="page"` |
| **Skip link** | ❌ Absent | First focusable element, `sr-only` until focused |
| **Landmarks** | ✅ `<header>`/`<nav>`/`<main>`/`<footer>` present | Add `id="main"`; no redundant `role=` on native elements |
| **Link purpose** | ⚠️ "GitHub →" repeated across cards | Cards: link text stays terse but each card is inside an `<article>` with a heading, giving context. Verify with a screen-reader link list. |
| **Prose link identification** | ❌ Colour-only until hover | Persistent underline in article body |
| **Machine-readable dates** | ⚠️ `<time>` without `datetime` | Add `datetime` attribute |
| **Semantic emphasis** | ⚠️ `◆` glyph as list bullet | Mark decorative glyphs `aria-hidden="true"` |
| **Theme parity** | n/a | Every contrast requirement must hold in light mode too — this doubles the audit surface |

Contrast figures in MASTER.md were computed by hand from the WCAG relative-luminance
formula. `success` and `warning` in light mode land at 4.8:1 — close enough to the
threshold that implementation must verify them with a contrast tool rather than trusting
the table.

---

## Open Questions

All resolved 2026-08-01. No blockers remain — implementation may proceed.

1. **Pink sponsor accent** — ✅ **Resolved: scoped `sponsor` token.** Pink is admitted as a
   narrowly-scoped semantic token rather than a second brand accent, on the grounds that it
   is a borrowed affordance for an external service confined to two sponsor CTAs. Recorded in
   [MASTER.md → Sponsor](../design/MASTER.md#sponsor-sanctioned-exception) as a *closed*
   exception — it is not precedent for further hues. Light value `#BE185D` (5.8:1); the
   existing `pink-400` stays as the dark value (7.5:1).

2. **Blog article measure** — ✅ **Resolved: narrow to `--measure` (41rem on the padded
   wrapper ≈ 608px of text, ~75 characters).** Accepted as a visible change to every existing post. This is the one change
   in the phase a returning reader will notice, so it should land in its own commit for easy
   revert.

   *Revised 2026-08-01 during Task 2.* This was originally resolved as "68ch (~680px)" —
   both figures were wrong and they were not equivalent. Measured with Inter loaded at the
   17px prose size, `1ch` is the advance of the `0` glyph (10.7px) while average lowercase is
   8.1px, so `68ch` renders ~90 characters at ~729px — barely narrower than the 768px it was
   meant to replace, and outside the 45–75 comfortable range. The measure is now expressed in
   `rem` so it cannot drift with glyph metrics again.

3. **Shiki theme pairing** — ✅ **Resolved: `github-dark-high-contrast` /
   `github-light-high-contrast`.**

   *Revised 2026-08-01 during Task 13.* Originally resolved as plain `github-dark` /
   `github-light`, chosen for legibility and then not measured. They fail AA: keyword
   `#D73A49` measures **4.16:1** on the light code surface, and comment `#6A737D` measures
   4.38:1 light / **3.68:1** dark. Syntax tokens are text, so 4.5:1 applies. The
   high-contrast variants of the same family clear it — worst case is now the light comment
   at 4.58:1, which is only 2% of headroom, so darkening `code-bg` or lightening that token
   would break AA silently.

   Also requires `defaultColor: false`, without which Shiki writes colours as inline styles
   that outrank every stylesheet and `--code-bg` has no effect at all. And `wrap: true` was
   tried and **removed** — see [MASTER → Wide content](../design/MASTER.md#wide-content).

---

## Deployment Constraint

**This branch must not be deployed until Tasks 8–13 land.** Task 3–7 is the commit
after which a partial deploy becomes user-visible breakage: it makes the light theme
reachable in real components, while every page heading is still `text-white` — measured
at **1.04:1** on `/`, `/projects`, `/blog`, `/about` and every post. Effectively invisible.

This matters more than it might appear, because light is the majority path: per Media
Queries L5, `prefers-color-scheme: light` matches both an explicit light preference *and*
no active preference. The phase is all-or-nothing; there is no safe intermediate merge point.

## Accepted Deviations from This Contract

Recorded because the contract said "no structural changes, per-page token substitutions
only", and these exceed that. Each was a deliberate call, not drift:

1. **About's page shell widened `max-w-3xl` → `max-w-5xl`.** The largest desktop layout
   change in the phase — the skills grid goes 720px → 976px and the `h1` moves 128px left.
   It makes About consistent with every other page and matches MASTER's "page shell =
   `max-w-5xl`, all pages". The prose measure is applied to the intro block instead, which
   is what the readability decision actually needed. After the article measure, this is the
   change a returning reader notices second.
2. **`/projects` gained an empty state**, and `/blog`'s was given panel chrome beyond the
   specified "muted message + link". Both bring the three index pages to one policy; the
   contract had specified only the blog one.
3. **`aria-label` added to ProjectCard's external links.** This reverses the contract's
   explicit decision to keep link text terse and rely on the surrounding `<article>` for
   context. Verification showed a screen-reader link list of ~19 undifferentiated entries
   reading "GitHub", "NuGet", "Docs". The visible label is preserved inside the accessible
   name, so WCAG 2.5.3 holds.
4. **Stats band uses `lg:grid-cols-4`**, not the 2-column tablet band the contract's
   responsive spec describes — four 156px columns at exactly 768px made one label wrap
   while its siblings didn't.
5. **Footer top margin is `--spacing-section` (112px)**, not the contracted `space-24`
   (96px). It uses the section rhythm token rather than a fixed step.

## Known Follow-ups (not defects in this phase)

Surfaced by review during execution, deliberately left for a later pass:

1. **Wide prose tables scroll with no visible affordance on mobile.** The page no longer
   overflows, but Chrome's overlay scrollbars mean the cut-off third column gives the reader
   no indication it can be scrolled. Needs a `scrollbar-gutter` or edge-fade treatment — a
   design decision, not a defect fix.
2. **A scrolling table no longer fills its column on desktop.** `display: block` makes the
   table shrink to content (≈493px inside the 608px measure), so its rules stop short of the
   text edge. Reads as tidy rather than broken, but it is a visible change.
3. **`transition-colors` includes `outline-color`**, so a focus ring fades in from the
   element's text colour before settling on the accent. Cosmetic, but it reintroduces exactly
   the un-named-property animation the motion policy exists to prevent.
4. **Two eyebrow treatments for one role** — `font-mono text-accent text-sm` on the home and
   404 pages, `text-xs uppercase tracking-widest` on About. MASTER defines one `label` slot and
   neither matches it.
5. **Button heights vary by role** — nav and footer links and CTAs are now 44px, but the
   design system has no single button primitive, so a sixth variant is one page away.

## Audit Target Summary

`ui-review` should verify, at 1920×1080 / 768×1024 / 375×812, in **both** colour schemes:

- Zero raw `cyan-*` / `zinc-*` / `pink-*` utilities remain in `src/` (grep-checkable — the `sponsor` token is the only sanctioned route to pink)
- `--color-accent-dark` no longer exists
- All nine MASTER.md drift items resolved
- Focus ring visible on every interactive element via keyboard
- No text below 4.5:1 in either theme
- Hero glow absent in light mode; shadow ladder present in light, absent in dark
- No new client-side JavaScript beyond the existing copyright-year script
