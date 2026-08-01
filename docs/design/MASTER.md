# Design System

**Product type:** Marketing / portfolio site (content-led)
**Tech stack:** Astro 7 + Tailwind CSS v4 (`@tailwindcss/vite`, CSS-first config)
**Brand feel:** Clean & minimal
**Primary audience:** Developers and technical readers
**Themes:** Dark (canonical) · Light (alternative — see [Light Theme](#light-theme-alternative))
**Generated:** 2026-08-01

## Design Thesis

A dark, near-monochrome canvas with **exactly one accent hue**. The accent is an
interaction signal, not decoration — if something is cyan, it is either a link, a
control, or a deliberate number worth reading. Everything else is neutral. This
is what makes a minimal system stay minimal as pages get added.

Brand constraints were left open. The dark zinc canvas and the cyan accent are
kept deliberately rather than by default: they already carry the site's identity,
they clear WCAG AA comfortably on near-black, and cyan does not collide with any
of the four semantic colors. What is new here is everything around them — a
defined neutral ramp, a reading-optimized type scale, a section rhythm, and
component specs that removed the original token drift (see
[Drift — Resolved](#drift--resolved)).

**No secondary hue.** A second brand color is the most common way a "clean &
minimal" system degrades. Depth comes from surface elevation and border weight
instead.

## Color Palette

### Primary

| Token | Hex | Usage |
|---|---|---|
| `accent` | `#22D3EE` | Links, inline emphasis, eyebrow text, stat figures, focus rings. Contrast on `background` ≈ 10.5:1. |
| `accent-hover` | `#67E8F9` | Hover state for accent **text** — moves lighter, not darker, on a dark canvas. |
| `accent-solid` | `#06B6D4` | Filled surfaces only (primary button). Never used for text. |
| `accent-solid-hover` | `#22D3EE` | Hover for filled surfaces. |
| `accent-foreground` | `#09090B` | Text/icons on top of `accent-solid`. Contrast ≈ 7.1:1. |
| `accent-subtle` | `rgba(34,211,238,0.08)` | Hero glow, hover washes. Decorative only — never the sole carrier of meaning. |
| `accent-border` | `rgba(34,211,238,0.40)` | Card hover borders, active tab underline. |

### Semantic

Dark-canvas variants (the 400-weight family). The 500/600 weights used on light
UIs go muddy on `#09090B` and are not part of this system.

| Token | Hex | Usage |
|---|---|---|
| `success` | `#4ADE80` | Build passing, published, shipped badges. |
| `warning` | `#FBBF24` | Deprecated / preview / archived project markers. |
| `error` | `#F87171` | Form errors, broken-link and 404 messaging. |
| `info` | `#60A5FA` | Neutral notices. Distinct in hue from `accent` — do not swap the two. |

**These four are currently reserved, not used.** They are defined for both themes
and generate utilities, but no component consumes them — the site has no status
surfaces yet. They are kept because 404 messaging, deprecated-project markers and
build-status badges are all foreseeable. If they are still unused at the next
review, delete them: a system with a third of its colour slots dormant is how
tokens start drifting back to raw utilities.

Semantic colors must always pair with a text label or icon. Color alone never
conveys state.

### Sponsor (sanctioned exception)

| Token | Hex | Usage | Contrast |
|---|---|---|---|
| `sponsor` | `#F472B6` | GitHub Sponsors CTA text and border. `pink-400`. | 7.5:1 on `background` |
| `sponsor-hover` | `#F9A8D4` | Hover for sponsor text. Light counterpart `#9D174D`. | 11.0:1 dark / 7.6:1 light |
| `sponsor-subtle` | `rgba(236,72,153,0.10)` | Sponsor CTA fill. | — |

A hover token is mandatory for any colour used as text. The first cut of this
system defined `sponsor` without one, and the implementation reached for
`hover:opacity-80` instead — which measured 4.32:1 in light mode, below AA.
**Never express a hover state as reduced opacity on text.** It lowers contrast
by construction, and it is a weaker affordance than a hue change.

The one hue besides the accent. It is **not** a second brand color: it is a
borrowed affordance for an external service, scoped to sponsor CTAs and nowhere
else. Adding a third hue, or reusing `sponsor` for anything that is not a
GitHub Sponsors link, breaks the system. Light-mode value is `#BE185D`
(`pink-700`, 5.8:1) — `pink-400` fails on an off-white canvas.

### Neutrals

| Token | Hex | Tailwind | Usage |
|---|---|---|---|
| `background` | `#09090B` | `zinc-950` | Page canvas. |
| `surface` | `#18181B` | `zinc-900` | Cards, panels, code blocks. |
| `surface-subtle` | `#141418` | — | Banded sections (stats row). The original `zinc-900/30` composited to a 4/255 step off the canvas — measured 1.025:1, which read as an ordinary hairline-separated section rather than a band. A tint still, but a perceptible one. |
| `border` | `#27272A` | `zinc-800` | Default hairlines, card and section dividers. |
| `border-strong` | `#71717A` | `zinc-500` | Secondary button outline, input borders, prose bullets. **Identical in both themes** — see note below. |
| `text-primary` | `#FFFFFF` | `white` | Headings, card titles, emphasis. |
| `text-body` | `#D4D4D8` | `zinc-300` | Long-form prose. |
| `text-muted` | `#A1A1AA` | `zinc-400` | Descriptions, metadata, dates. Contrast ≈ 8.0:1. |
| `text-disabled` | `#71717A` | `zinc-500` | **Decorative and disabled states only** — contrast ≈ 4.3:1, below AA for body text. Never use for content a reader needs. |

### Elevation

No shadows. On a near-black canvas, shadows are invisible and cost paint time.
Elevation is expressed as: `background` → `surface` fill → `border` hairline →
`accent-border` on hover. That is the entire ladder.

This rule is theme-specific and **inverts in light mode**, where borders alone
read flat and a shadow ladder does the work instead. See
[Light Theme → Elevation](#elevation-inverts).

## Typography

### Font Pairing

Both families are self-hosted variable WOFF2 (latin + latin-ext subsets) in
`public/fonts/`, declared with `font-display: swap`. **No third-party font
requests.** Keep it that way — an external font request is a render-blocking
dependency and a privacy leak on a personal site.

- **Display / Headings / Body:** Inter (weights 400–700)
- **Mono:** JetBrains Mono (weights 400–500) — code, tags, dates, stat figures, eyebrow text

Single-family sans is the minimal choice. Mono carries the technical register,
which is what a developer audience reads as credible — it does more work here
than a display face would.

### Type Scale

| Token | Size | Weight | Line-height | Tracking | Usage |
|---|---|---|---|---|---|
| `display` | `clamp(2.5rem, 6vw, 3.5rem)` | 700 | 1.1 | `-0.02em` | Hero headline — one per page, largest element on it. |
| `h1` | `2.25rem` / 36px | 700 | 1.2 | `-0.02em` | Page titles, article titles. |
| `h2` | `1.5rem` / 24px | 700 | 1.3 | `-0.01em` | Section titles. |
| `h3` | `1.25rem` / 20px | 600 | 1.4 | `-0.01em` | Subsections. |
| `h4` | `1.125rem` / 18px | 600 | 1.4 | — | Card titles. |
| `body-lg` | `1.25rem` / 20px | 400 | 1.6 | — | Hero subheading, article lead. |
| `body` | `1.0625rem` / 17px | 400 | 1.7 | — | Long-form prose. Reading-optimized. |
| `body-sm` | `0.875rem` / 14px | 400 | 1.6 | — | Card descriptions, secondary text. |
| `label` | `0.75rem` / 12px | 500 | 1.4 | `0.02em` | Badges, tags, overlines. |
| `mono` | `0.875rem` / 14px | 400 | 1.6 | — | Inline code, dates, tags. |
| `mono-stat` | `1.875rem` / 30px | 700 | 1.1 | — | Stat figures. Always `tabular-nums`. |

Headings scale by ratio ~1.2 and never exceed four levels on a page.

### Prose Rules

- Article body: `body` token (17px / 1.7) — the `@tailwindcss/typography` plugin's defaults are overridden to match.
- Measure: **`--measure`, 41rem** — applied to the *padded article wrapper*. Preflight sets `box-sizing: border-box`, so the wrapper's `px-6` gutters come out of it: 41rem − 3rem = **≈608px of text, ~75 characters**. Non-negotiable — it is the single biggest readability lever on a blog.
  - Expressed in `rem`, **not `ch`**, deliberately. `1ch` is the advance of the `0` glyph, which in Inter runs ~32% wider than average lowercase — so `68ch` renders ~90 characters, not 68. Specifying a measure in `ch` quietly means something ~30% wider than it reads as.
  - `.prose` itself sets `max-width: none`. Exactly one element decides the measure and it is the wrapper — the typography plugin otherwise imposes its own `65ch` (~86 characters).
- Paragraph spacing: `space-6` (24px). No first-line indents.
- Links in prose: `accent`, underlined with `underline-offset-2`. Underline is required in body copy; color alone is insufficient.
- Code blocks: `code-bg` fill, `border` hairline, `radius-lg`, `space-4` padding, Shiki highlighting (built into Astro — no client-side highlighter).
- Inline code: `chip` fill, matching tag badges. Not `surface-subtle` — that recedes in both themes, which in dark makes an inline code span read as a hole rather than a raised label.

### Wide content

Anything wider than the measure — code blocks, tables — **scrolls inside its own box**. The
page body never scrolls horizontally at any viewport.

Specifically **not** soft-wrapping. Shiki's `wrap: true` was tried and removed: it emits
`white-space: pre-wrap; word-wrap: break-word` as an inline style that no stylesheet can
override, so no block can opt out; it broke identifiers mid-token; and once the measure
narrowed it began wrapping mid-expression on a 1920px desktop, not just on mobile.
Horizontal scroll preserves indentation and line structure, which is what a developer
audience expects of code, and it matches how wide tables already behave.

Known cost: overlay scrollbars mean a cut-off table or code block gives no visual hint that
it scrolls. That is a real usability gap and is recorded as a follow-up, not solved here.

## Spacing Scale

Base unit: 4px.

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps, tag padding-y. |
| `space-2` | 8px | Tight internal padding, icon gaps. |
| `space-3` | 12px | Compact component padding. |
| `space-4` | 16px | Default component padding, grid gaps. |
| `space-6` | 24px | Card padding, paragraph rhythm. |
| `space-8` | 32px | Sub-section gaps, header-to-content. |
| `space-12` | 48px | Large in-section gaps. |
| `space-16` | 64px | Section padding (mobile). |
| `space-24` | 96px | Section padding (desktop). |

### Section Rhythm

```css
--spacing-section: clamp(4rem, 10vw, 7rem);   /* 64px → 112px */
--spacing-section-hero: clamp(5rem, 12vw, 9rem);
```

**Partially implemented.** `--spacing-section` is currently consumed in exactly
one place (the footer's top margin); every section uses a flat `py-16` instead,
and `--spacing-section-hero` was never added. The clamped rhythm described here
is therefore aspirational rather than in force. Either wire it through or reduce
this section to what is real — but do not leave it ambiguous.

Sections are separated by a `border` hairline, not by a background change. The
stats band is the one exception — `surface-subtle` marks it as a distinct kind of
content, and it earns that by being the only banded section on the page.

### Layout

| Container | Width | Usage |
|---|---|---|
| Page shell | `max-w-5xl` (1024px) | All pages. Tighter than a typical 1200px marketing shell — intentional, it reads as considered rather than corporate. |
| Prose column | `var(--measure)` — 41rem incl. gutters (≈608px of text) | Article bodies. |
| Gutters | `px-6` (24px) | All breakpoints — except the nav, which drops to `px-4` below `sm` so five items fit at 320px without wrapping to a third row. |

Grid: 3 columns desktop → 2 tablet → 1 mobile, `gap-4`. Page-level layout uses
CSS Grid; component-level uses Flexbox.

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Tags, inline code. |
| `radius-md` | 6px | Inputs. |
| `radius-lg` | 8px | Buttons, code blocks. |
| `radius-xl` | 12px | Cards, panels. |
| `radius-full` | 9999px | Avatar, dot indicators. |

Cards are one step rounder than buttons — this is deliberate and is the existing
convention on the site. Keep it consistent.

## Light Theme (Alternative)

Dark remains canonical — it is the site's identity and what a developer audience
defaults to. Light is a **complete parallel token set**, not a fallback: it exists
so the site respects `prefers-color-scheme` for readers who genuinely read light
UIs better (bright ambient light, and astigmatism, for which light-on-dark text
measurably degrades legibility).

**It is not an inversion.** Two rules from the dark theme actively break when
flipped, and getting these wrong is what makes a bolted-on light mode look cheap:

1. The accent cannot survive it. `#22D3EE` on `#FAFAFA` is ~1.7:1 — illegible. Light mode needs a genuinely darker accent, not a tint adjustment.
2. The no-shadow rule reverses. See [Elevation](#elevation-inverts) below.

### Neutrals

| Token | Hex | Tailwind | Usage | Contrast on canvas |
|---|---|---|---|---|
| `background` | `#FAFAFA` | `zinc-50` | Page canvas. Off-white, not pure white — reduces glare on large fills. | — |
| `surface` | `#FFFFFF` | `white` | Cards, panels, code blocks. Lifts *toward* light, mirroring the dark theme's logic. | — |
| `surface-subtle` | `#F4F4F5` | `zinc-100` | Banded sections (stats row). | — |
| `border` | `#E4E4E7` | `zinc-200` | Hairlines, dividers. | — |
| `border-strong` | `#71717A` | `zinc-500` | Secondary button outline, inputs. Same value as dark. | 4.63:1 |
| `text-primary` | `#18181B` | `zinc-900` | Headings, card titles. Not pure black — pure black on off-white is harsh. | 16.8:1 |
| `text-body` | `#27272A` | `zinc-800` | Long-form prose. | 14.3:1 |
| `text-muted` | `#52525B` | `zinc-600` | Descriptions, metadata, dates. | 7.3:1 |
| `text-disabled` | `#A1A1AA` | `zinc-400` | **Decorative and disabled only** — 2.5:1, far below AA. | 2.5:1 |

Note that `zinc-400` is *muted* text in dark mode and *disabled* in light mode.
The neutral ramp is not symmetric, which is precisely why the two themes need
separate token tables rather than a computed inversion.

### Primary

| Token | Hex | Usage | Contrast |
|---|---|---|---|
| `accent` | `#0E7490` | Links, eyebrow text, stat figures, focus rings. cyan-700. | 5.2:1 — AA |
| `accent-hover` | `#155E75` | Hover for accent **text** — moves *darker* here, the reverse of dark mode. | 7.0:1 — AAA |
| `accent-solid` | `#0E7490` | Filled surfaces (primary button). | — |
| `accent-solid-hover` | `#155E75` | Hover for filled surfaces. | — |
| `accent-foreground` | `#FFFFFF` | Text on `accent-solid`. | 5.4:1 — AA |
| `accent-subtle` | `rgba(14,116,144,0.06)` | Hover washes. Decorative only. | — |
| `accent-border` | `rgba(14,116,144,0.35)` | Card hover borders, active tab underline. | — |

`cyan-600` (`#0891B2`) is deliberately excluded: at 3.7:1 it fails AA for body
text and for white-on-fill. It is only usable for large display text, and
allowing it as a token invites misuse.

### Semantic

The 700-weight family. All clear AA on `background`.

| Token | Hex | Contrast |
|---|---|---|
| `success` | `#15803D` | 4.8:1 |
| `warning` | `#B45309` | 4.8:1 |
| `error` | `#B91C1C` | 6.2:1 |
| `info` | `#1D4ED8` | 6.4:1 |

### Elevation (inverts)

Where dark mode forbids shadows, light mode **requires** them — a white card on
an off-white canvas separated only by a `zinc-200` hairline reads as flat paper.
The ladder here is shadow-led, borders secondary:

```css
--shadow-card:       0 1px 2px  rgba(9, 9, 11, 0.04),
                     0 1px 3px  rgba(9, 9, 11, 0.06);
--shadow-card-hover: 0 4px 6px  rgba(9, 9, 11, 0.05),
                     0 10px 15px rgba(9, 9, 11, 0.08);
--shadow-sticky:     0 1px 3px  rgba(9, 9, 11, 0.08);  /* nav, once scrolled */
```

Shadows are tinted with the canvas neutral (`zinc-950`), never pure black —
black shadows on a neutral canvas grey out muddy. Keep them low-opacity and
tight; heavy drop shadows contradict "clean & minimal" faster than anything else
in this system.

### What changes in components

| Component | Light-mode delta |
|---|---|
| Card | Gains `--shadow-card`; hover swaps to `--shadow-card-hover` **in addition to** `-translate-y-1`. Border drops to a secondary role. |
| Hero | The `accent-subtle` radial glow is removed entirely — a glow on white is dirt, not light. Use plain `background` with the section hairline instead. |
| Tag / Badge | `chip` fill resolves to `#F4F4F5` — a step *down* from the white card, inverting the dark-mode relationship. Handled by the token; no per-theme markup. |
| Nav | Carries `--shadow-sticky` unconditionally, alongside the hairline. Not scroll-conditional: that would require a scroll listener, and this site ships no client-side JS. The shadow token is `none` in dark, so the rule costs nothing there. |
| Code block | `code-bg` resolves to `surface-subtle` — code recedes from body copy in light, whereas in dark it lifts. **Shiki must be configured with `defaultColor: false`**, otherwise it writes colours as inline styles that no stylesheet can override, and `code-bg` has no effect at all. |
| Secondary button | Border `border-strong`; hover darkens border to `text-disabled`, fill stays transparent. |

Everything else — the type scale, spacing, radii, layout widths, motion rules,
and the article measure — is theme-independent and carries over unchanged.

### Implementation

Tailwind v4 resolves `@theme` values at build time, so a media query cannot
override them directly. Use `@theme inline` to make the generated utilities
reference a runtime custom property, then override that property per theme:

```css
@theme inline {
  --color-background: var(--canvas);
  --color-surface:    var(--surface);
  --color-accent:     var(--accent);
  /* …one line per semantic token */
}

/* Dark is the default — it applies with no media query and no JS. */
:root {
  --canvas:  #09090b;
  --surface: #18181b;
  --accent:  #22d3ee;
}

@media (prefers-color-scheme: light) {
  :root:not([data-theme='dark']) {
    --canvas:  #fafafa;
    --surface: #ffffff;
    --accent:  #0e7490;
  }
}

/* Explicit opt-in, only needed if a manual toggle is added. */
:root[data-theme='light'] { /* light values */ }
:root[data-theme='dark']  { /* dark values  */ }
```

Verify `@theme inline` against the installed Tailwind version before relying on
it — it is v4-specific and the directive set is still moving.

Also set `<meta name="color-scheme" content="dark light">` in
[BaseLayout.astro](../../src/layouts/BaseLayout.astro) so form controls,
scrollbars, and the browser's own chrome follow the theme.

### On adding a manual toggle

The `prefers-color-scheme` version above costs **zero JavaScript** and is the
recommended scope. A manual toggle is a different proposition: to avoid a
flash of the wrong theme on first paint, it needs a render-blocking inline
script in `<head>` that reads `localStorage` before the body renders. On a site
that currently ships no client-side JS at all, that is a real architectural
concession — worth making only if you actually want readers overriding their
system preference. Recommendation: ship the media-query version, skip the toggle.

## Component Patterns

> Specs below describe the **dark** theme. Light-mode deltas are tabulated in
> [Light Theme → What changes in components](#what-changes-in-components).

### Primary Button / CTA

- Height 44px (`py-2.5 px-5`), `radius-lg`, `body-sm` at weight 600
- `accent-solid` fill, `accent-foreground` text; hover → `accent-solid-hover`
- 44px minimum touch target — do not shrink below this on mobile
- Copy is action-oriented: "View Projects", "Read Blog" — never "Submit" or "Click here"

### Secondary Button

- Same box metrics as primary
- Transparent fill, `border-strong` outline, `text-body` label
- Hover: border **and** label → `accent`; fill stays transparent
- **Not** `text-disabled`. That rule was unsatisfiable: this same section requires the border to clear 3:1, while `text-disabled` is documented three sections above as 2.5:1 in light. It also collided exactly with `border-strong` in dark once both became `#71717A`, making the hover a silent no-op. A hover must change hue and keep contrast — the same rule that governs every other link on the site.
- **`border-strong` is the only affordance on this control** — no fill, no accent label, no underline. That is why it carries the same value in both themes (`#71717A`, dark 4.12:1 / light 4.63:1) rather than a per-theme neutral: WCAG 1.4.11 requires 3:1 for a UI component boundary that is the sole indicator, and per-theme values of `zinc-700`/`zinc-300` measured **1.91:1 and 1.42:1**. Do not "harmonise" this token back into the neutral ramp.

Never more than two CTAs at the same visual level in one section.

### Card (Project / Blog)

- `surface` fill, `border` hairline, `radius-xl`, `space-6` padding
- Title `h4` in `text-primary`; description `body-sm` in `text-muted`, clamped to 3 lines
- Hover: `-translate-y-1` + border → `accent-border`, plus the shadow step in light mode. `duration-200`, with the transition property list named explicitly — never `transition-all`. Never animate layout properties.
- **Whole-card linking applies only when the card has one canonical destination.** BlogCard does (the post), so it is a single `<a>` wrapping the content. ProjectCard does *not* — it carries 2–4 co-equal external destinations (GitHub, NuGet, Marketplace, Docs) and no primary one, so it stays a non-link `<article>` with discrete link targets. Do not force a whole-card link where there is no single obvious target; that produces an unpredictable click.
- Cards that are not links still get the hover lift, driven by `group-hover`. The lift signals "interactive content within", not "click anywhere".

### Tag / Badge

- `mono` at `label` size, `space-1`/`space-2` padding, `radius-sm`
- `chip` fill, `accent` text. The `chip` token exists precisely because the step direction inverts: it sits **above** the card in dark (`#27272A` on `#18181B`) and **below** it in light (`#F4F4F5` on `#FFFFFF`). `surface-subtle` cannot serve this — it recedes in both themes, which in dark makes a chip read as a hole punched in the card.
- Tags are metadata, not controls — do not add hover states unless they filter

### Stat Figure

- `mono-stat`, `accent`, `tabular-nums` — tabular is required so figures align across the row
- Label `body-sm` in `text-muted` beneath
- Marked up as `<dl>`/`<dt>`/`<dd>` with an `sr-only` `<dt>`

### Navigation

- Max 5 top-level items; sticky with a `border` bottom hairline
- Rest `text-muted`; hover `text-primary`; current page `accent` with `aria-current="page"`

### Focus State (applies to everything interactive)

```css
:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  border-radius: inherit;
}
```

Never remove focus outlines. The accent ring on near-black is high-contrast and
is the primary keyboard affordance across the whole site.

### Motion

- Duration 150–200ms, `ease-out`. Transition an **explicit property list** — never `transition-all`, which sweeps up `background-color`, `filter`, `outline-color` and anything else that happens to change.
- Permitted properties: `translate`/`transform`, `color`, `border-color`, `opacity`, and `box-shadow`.
  - `box-shadow` is permitted **only** because light mode's elevation ladder is shadow-led, and only on single-element hover. It remains banned on anything that animates many elements at once — it forces a non-composited paint.
- All motion respects `prefers-reduced-motion: reduce` — transitions collapse to `0.01ms`.
- No scroll-triggered animation, no parallax.

## Stack-Specific Notes

### Tailwind v4 token definitions

This project uses `@tailwindcss/vite` with CSS-first config — there is no
`tailwind.config.js` and there should not be one. Tokens live in the `@theme`
block in [global.css](../../src/styles/global.css):

```css
@theme {
  --color-accent: #22d3ee;
  --color-accent-hover: #67e8f9;
  --color-accent-solid: #06b6d4;
  --color-accent-foreground: #09090b;

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', Menlo, monospace;

}

/* Runtime values live in :root, NOT @theme — they must be overridable by the
   light media query, and @theme resolves at build time. */
:root {
  --spacing-section: clamp(4rem, 10vw, 7rem);
  --measure: 41rem;
}
```

Every token declared in `@theme` generates a utility automatically (`text-accent`,
`bg-accent-solid`). **Use the semantic utility, not the raw palette value** — `text-accent`,
never `text-cyan-400`. That is the whole point of declaring the token.

Tokens declared in `:root` generate **no** utility and must be consumed as arbitrary values
(`py-[var(--spacing-section)]`). There is no `py-section`.

**Source scanning is restricted to `src/`.** `global.css` carries `@source not` directives
excluding `docs/` and `scripts/`. Without them Tailwind scans the whole repo — which meant
the class names quoted in this document, and the replacement-hint table inside the token
guard itself, were being generated into the production stylesheet. The guard was shipping
the utilities it exists to forbid, at a cost of 21% of the total CSS. If you add a directory
containing class-name-like strings, exclude it.

### Astro conventions

- Global styles imported once in [BaseLayout.astro](../../src/layouts/BaseLayout.astro); page-level `<style>` blocks are auto-scoped and preferred over new global rules.
- Content-first: interactive islands are exceptions. This site currently ships zero client-side JS — treat adding any as a decision that needs justifying.
- Images require explicit `width`/`height` to prevent CLS.
- Syntax highlighting via Shiki at build time (already configured through `@astrojs/mdx`).

### Token name bindings

This document names tokens conceptually; Tailwind derives utility names from CSS
variables. The bindings live in the `@theme inline` block of
[global.css](../../src/styles/global.css). Where a conceptual name would produce
an awkward utility (`text-primary` → `text-text-primary`), the utility uses the
shorter conventional form (`text-foreground`). Both names refer to one value —
never introduce a third.

**Four** tokens are consumed as arbitrary values rather than named utilities, because they
are declared in `:root` rather than `@theme` — they have to be overridable per theme, and
`@theme` resolves at build time:

| Token | Consumed as | Consumers |
|---|---|---|
| `--measure` | `max-w-[var(--measure)]` | article wrapper |
| `--measure-text` | `max-w-[var(--measure-text)]` | About intro block |
| `--shadow-card` / `--shadow-card-hover` | `shadow-[var(--shadow-card)]` | both cards, sponsor panel |
| `--shadow-sticky` | `shadow-[var(--shadow-sticky)]` | nav |
| `--spacing-section` | `mt-[var(--spacing-section)]` | footer |
| `--hero-glow` | inside `bg-[radial-gradient(…)]` | home hero |

This table has been wrong twice — first counting two, then four. If you add a `:root` token,
add its row here in the same commit.

`--measure` is the padded-wrapper width; `--measure-text` is the same measure for an element
already inside a padded container. Using the wrong one is a ~6-character error in either
direction. If any gains a fourth consumer, promote it to a real `@theme` entry so it
generates a utility the guard can reason about.

## Drift — Resolved

All nine items resolved in phase 3.1 (2026-08-01); see
[the UI contract](../plans/2026-08-01-design-system-adoption-ui-contract.md). Kept as a
per-item checklist rather than a summary line: an earlier edit replaced the list with
"all nine resolved" while item 5 was **still open**, which deleted the only thing a
reviewer could check against. Claims of completion need to stay auditable.

| # | Original item | Resolution |
|---|---|---|
| 1 | `text-cyan-400` and `text-accent` both in use for the same role | All raw palette utilities removed; enforced by `check-tokens.mjs` in CI |
| 2 | `--color-accent-dark` darkened the accent on hover, lowering contrast | Token retired; nav wordmark hovers to `accent-hover` (lighter) |
| 3 | Hero CTA used a raw palette fill | `accent-solid` with `accent-foreground` |
| 4 | Card hover used a raw palette border | `accent-border` token |
| 5 | No `prefers-reduced-motion` guard for the card lift | `translate: none !important` in the reduced-motion block. **Collapsing `transition-duration` alone was not enough** — it turned a 4px ease into a 4px snap, which is worse for a motion-sensitive reader than the unguarded original |
| 6 | Sponsor pink used as a raw utility | Scoped `sponsor` / `sponsor-hover` tokens |
| 7 | Article headings were accent-coloured | Headings are `foreground`; the accent means "interactive" again |
| 8 | `zinc-500` carried real content at 4.3:1 | All meta text on `text-muted` (≥7.4:1 both themes) |
| 9 | No `:focus-visible` styling anywhere | Global 2px accent ring, `offset-2`, verified on every tab stop |

Enforcement is now automated: `scripts/check-tokens.mjs` runs in CI and fails the
build on any raw palette utility, retired token, or theme-locked prose modifier
under `src/`. It deliberately scans comments as well as code — an earlier attempt
at comment stripping was removed because a hand-rolled stripper could silently
blank a whole file and turn the gate into a no-op with a passing build. A false
positive on a comment is noisy and self-announcing; a stripper that fails
silently is not.

If new drift appears, add a rule to that script rather than only noting it here.
A documented convention with no enforcement is exactly how the first nine
happened.

## Anti-Patterns

1. **A second accent hue.** Cyan plus violet/amber/orange is the fastest way to lose "clean & minimal". Depth comes from surfaces and borders. The single sanctioned exception is [`sponsor`](#sponsor-sanctioned-exception), scoped to GitHub Sponsors CTAs — treat it as closed, not as precedent.
2. **Raw palette utilities over tokens.** `text-cyan-400` instead of `text-accent` silently forks the system — the next accent change then misses half the site.
3. **`text-disabled` (`zinc-500`) for real content.** It fails AA at 4.3:1. Muted text is `zinc-400`.
4. **Prose wider than `--measure`.** Full-width article text is the single most damaging readability regression available on a blog. Related: never re-express a measure in `ch` — it reads as a character count and is not one.
5. **Client-side JS for visual effect.** Scroll animation, parallax, and animation libraries all violate the content-first premise on a zero-JS static site — and parallax is an accessibility problem besides.
6. **App-shell layout.** No sidebars. This is a content site; the shell is nav → main → footer.
7. **Inverting the dark theme to get the light one.** The accent goes illegible (1.7:1), the no-shadow rule reverses, and `zinc-400` changes role from muted to disabled. Use the [Light Theme](#light-theme-alternative) token table — do not compute it.
8. **Hard-coding a theme's hex where a runtime token belongs.** Anything themed must go through the `@theme inline` var indirection, or it will be stuck in dark mode forever.
