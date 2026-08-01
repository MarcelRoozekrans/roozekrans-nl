# UI Review: Phase 3.1 — Design System Adoption & Light Theme

**Date:** 2026-08-01
**Contract:** [2026-08-01-design-system-adoption-ui-contract.md](2026-08-01-design-system-adoption-ui-contract.md)
**Branch:** `feat/design-system-adoption` @ `08fc0f0` (43 commits from `b655cca`)
**Verdict:** **PARTIAL**

No contracted criterion is missing. Three deviate from the written contract, none of them
user-blocking. The phase's headline goals — zero raw palette utilities, a working light
theme, and the nine drift items — are all met and independently verified.

---

## Method

- Production build (`npm run build`) served via `astro preview`, driven through Playwright.
- **42 full-page screenshots**: 7 routes × 3 viewports (1920×1080, 768×1024, 375×812) × 2 colour schemes.
- Colour scheme verified per capture by reading `getComputedStyle(document.documentElement).backgroundColor` — `rgb(9,9,11)` dark, `rgb(250,250,250)` light, matching on all 42. All 21 dark/light pairs MD5-compared to confirm none is a mislabelled duplicate.
- Console errors, failed network requests, document overflow, page titles and `<h1>` text recorded per route via explicit `console` / `pageerror` / `response` / `requestfailed` listeners.
- Contrast and interaction figures cross-checked against the pre-merge code review, which measured them independently in-browser rather than computing them from source.

**Scope note.** 2 of 13 blog posts were captured (`post-code`, `post-table`). The other 11
share the article layout exactly and differ only in prose content. Viewport-only shots were
not captured separately — at a given width the full-page image contains the same above-fold
rendering plus below-fold content.

**Phase 2 (existing tests) was skipped:** this repo has no test framework, deliberately. CI
runs `astro check` and `astro build`, plus the token guard added by this phase.

---

## Screenshots

`docs/regression-screenshots/2026-08-01-ui-review/` — 42 files, `{route}-{viewport}-{scheme}.png`.

| | Dark | Light |
|---|---|---|
| Home, desktop | [home-desktop-dark.png](../regression-screenshots/2026-08-01-ui-review/home-desktop-dark.png) | [home-desktop-light.png](../regression-screenshots/2026-08-01-ui-review/home-desktop-light.png) |
| About, desktop | [about-desktop-dark.png](../regression-screenshots/2026-08-01-ui-review/about-desktop-dark.png) | [about-desktop-light.png](../regression-screenshots/2026-08-01-ui-review/about-desktop-light.png) |
| Article + code, desktop | [post-code-desktop-dark.png](../regression-screenshots/2026-08-01-ui-review/post-code-desktop-dark.png) | [post-code-desktop-light.png](../regression-screenshots/2026-08-01-ui-review/post-code-desktop-light.png) |
| Article + table, mobile | [post-table-mobile-dark.png](../regression-screenshots/2026-08-01-ui-review/post-table-mobile-dark.png) | [post-table-mobile-light.png](../regression-screenshots/2026-08-01-ui-review/post-table-mobile-light.png) |
| Projects, mobile | [projects-mobile-dark.png](../regression-screenshots/2026-08-01-ui-review/projects-mobile-dark.png) | [projects-mobile-light.png](../regression-screenshots/2026-08-01-ui-review/projects-mobile-light.png) |

---

## Contract Adherence

| Criterion | Status | Notes |
|---|---|---|
| Design system colours | ✅ Pass | Guard reports zero raw palette utilities across 46 scanned files, enforced in CI. Visually confirmed: chips step **up** from the card in dark, **down** in light — the inversion the `chip` token exists for. |
| Typography | ⚠️ Partial | Scale is applied, but MASTER's spec is not fully in force — see D1. |
| Component coverage | ✅ Pass | All 8 contracted components/layouts present and migrated. |
| Layout — desktop | ✅ Pass | Matches contracted structure on all 7 routes. About's `h1` now aligns with the nav wordmark at x=152, closing the shell-misalignment defect. |
| Layout — tablet | ⚠️ Partial | Stats band uses `lg:grid-cols-4`, not the 2-column tablet band the responsive spec describes — see D2. |
| Layout — mobile | ✅ Pass | `scrollWidth === clientWidth` on all 7 routes at both 375 and 320. Nav wraps rather than staying horizontal; the contract's original assumption was measured false and is recorded as such. |
| Loading states | n/a | Static build, no runtime fetching. The contract says so explicitly rather than inventing states. |
| Empty states | ✅ Pass | Blog empty state with CTA, projects empty state, featured-projects guard. All are dead code while content exists — verified by markup injection, not by claim. |
| Error states | ✅ Pass | `/404` renders correctly in both themes. See caveat E1 — this run did not exercise a real 404 response. |
| ARIA roles | ✅ Pass | Landmarks intact, `aria-current="page"` on nav, `aria-hidden` on all 6 decorative glyphs, `aria-label` giving each card link a distinct accessible name. |
| Keyboard navigation | ✅ Pass | Skip link is first tab stop, visible on focus, and moves `activeElement` to `<main id="main" tabindex="-1">`. Focus ring present on every tab stop in both themes. |
| Colour contrast | ✅ Pass | Full-DOM audit across 9 routes × 2 themes: **zero failures**. Page `h1` went 1.04:1 → **16.97:1** in light. |
| Reduced motion | ✅ Pass | Card lift suppressed (`translate: none`, 0.000px movement) with `reduce`; still animates −4.000px without it. Falsification-tested both ways. |
| Light theme | ✅ Pass | Hero glow `transparent` in light and visible in dark; shadow ladder present in light and `none` in dark. Both confirmed visually and by computed style. |
| No new client-side JS | ✅ Pass | Zero `.js` in `dist/_astro`. One inline script site-wide — the pre-existing copyright year. |
| Console / network clean | ✅ Pass | Zero console errors, zero page errors, zero 4xx/5xx, zero failed loads across all 7 routes. |

---

## Findings

### D1 — Typography spec is not fully in force ⚠️

MASTER's type scale specifies `h1` at line-height 1.2 with `-0.02em` tracking. Measured:
`h1` line-height is 40px on index pages and 45px on posts (neither is 1.2 × 36px = 43.2px),
and `letter-spacing` computes `normal` everywhere. Article `h2` renders **25.5px** (prose
`1.5em × 17px`) against 24px on every other page — one role, two sizes.

There are also two treatments for the same eyebrow role: `font-mono text-accent text-sm` on
home and 404, versus `text-xs uppercase tracking-widest` on About. MASTER defines exactly one
`label` slot and neither implementation matches it.

Not user-visible as damage, but it is precisely the drift a token system exists to prevent,
and it is measurable against a written spec.

### D2 — Stats band breakpoint contradicts the contract's own responsive table ⚠️

The responsive spec defines Tablet as 768–1279px with the stats grid at 2 columns; the code
uses `lg:grid-cols-4`, restoring 4 columns at 1024px. This is recorded in the contract's
**Accepted Deviations** section (#4) with a sound reason — four 156px columns at exactly
768px made one label wrap while its siblings didn't. Graded Partial rather than Pass because
the contract now says two different things in two different sections; the responsive table
should be corrected to match the accepted deviation.

### D3 — Two body-text measures on one page ⚠️ *(new — not found by any prior review)*

On `/about`, the intro prose is correctly constrained to `--measure-text` (608px, ~75
characters), but the **sponsor card's paragraph runs the full shell width** — roughly 950px,
about 130 characters. Same page, same kind of body copy, two measures differing by 56%.

MASTER calls the measure *"non-negotiable — the single biggest readability lever"*. The
narrowing decision was applied to the block the contract named and not to the other prose on
the same page. Visible in [about-desktop-light.png](../regression-screenshots/2026-08-01-ui-review/about-desktop-light.png):
the intro paragraphs and the sponsor paragraph have visibly different line lengths.

This is the only finding in this review that no earlier review caught, and it is a coherence
defect rather than a token defect — which is why eight rounds of code review missed it and
looking at a rendered page did not.

**Fix applied** in `a8f1e0c`: `max-w-[var(--measure-text)]` added to the sponsor card's `<p>`.
The screenshots above predate the fix and still show the wide measure — kept as the evidence
the finding was based on.

### E1 — `/404` was not exercised as a real 404 ⚠️ *(caveat, not a defect)*

`astro preview` serves the prerendered page at `/404` with **HTTP 200**. The page renders
correctly at all three viewports in both themes, but this run did not test what the
production host returns for a genuinely unknown path. Worth one manual check against the
deployed Cloudflare site after merge.

### O1 — Wide tables clip on mobile with no scroll affordance

Visible evidence for the follow-up already recorded in the contract. In
[post-table-mobile-dark.png](../regression-screenshots/2026-08-01-ui-review/post-table-mobile-dark.png)
the third column is cut mid-token at the viewport edge with nothing indicating the table
scrolls. The page itself does not overflow — the fix worked — but a reader has no cue that
content continues. Already recorded as Known Follow-up #1; this review confirms it is real
rather than theoretical.

---

## Regression check against the pre-branch baseline

Dark mode is the pre-existing user-visible state, so anything worse in dark is a regression
regardless of how good light mode is. Three were found during the phase and all are fixed:

| Regression | Status |
|---|---|
| Secondary button hover became a no-op in dark (`border-strong` and `text-disabled` resolved to the same value) | Fixed — hovers to accent, 4.12:1 → 11.01:1 |
| Inline code receded in dark where tag chips lift | Fixed — routed to the `chip` token |
| Card lift snapped instead of easing under reduced motion | Fixed — lift suppressed outright |

---

## Verdict Rationale

**PARTIAL** — zero ❌ Missing criteria; three ⚠️ deviations (D1, D2, D3), none of which
blocks a merge or damages a user-facing surface.

Per the contract's own verdict logic, PARTIAL is the correct grade: everything contracted is
implemented, and the deviations are spec-versus-implementation gaps rather than absences.

D3 is the one worth fixing before merge — it is a two-word change and it undercuts the
readability decision that was the most deliberated call in the phase.

## Recommended actions

1. **Fix D3** — constrain the sponsor card's prose to the measure. One class.
2. **Correct D2 in the contract** — make the responsive table agree with Accepted Deviation #4.
3. **Schedule D1** — the type-scale drift is a genuine follow-up and belongs on the list with the other eight.
4. **After deploy, verify E1** — confirm the production host returns a real 404 status.
