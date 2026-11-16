# AGENTS.md: roozekrans-nl

The personal site at roozekrans.nl: an Astro 7 static site with Tailwind CSS v4, Markdown and MDX content
collections for the blog and the project list. It builds to `dist/` and ships as Cloudflare Workers static
assets. There is no server code and no test suite.

## Layout

- `src/data/projects/*.md` is the project list, and the source for the homepage, the projects page and
  the homepage stats. The weekly site-refresh routine opens PRs that edit these files. Frontmatter is
  validated by the Zod schemas in `src/content.config.ts`; a missing or mistyped field fails the build.
  `group` is `zeroalloc`, `ai` or `other`; `featured` plus `order` pick the homepage entries; `packages`
  feeds the homepage package count.
- `src/data/blog/` holds the posts; `draft: true` hides one.
- `docs/design/MASTER.md` is the design system. `docs/plans/` and `docs/regression-screenshots/` are
  historical; they are not shipped. Older plans there still mention Netlify and Astro 4, which is no
  longer true.
- `dist/`, `.astro/` and `.wrangler/` are generated and git-ignored. `worker-configuration.d.ts`, from
  `npm run generate-types`, is not tracked.

## Build and test

Node `>=22.12.0` is required by `package.json`; CI runs Node 26. There is no test script.

```bash
# CI job "Type-check & build" in .github/workflows/ci.yml
npm ci
npm run check:tokens
npm run check
npm run build
```

Inner loop: `npm run dev` serves `localhost:4321`. `npm run preview` builds and serves through
`wrangler dev`.

## Deployment

CI only checks and builds; it does not deploy. Cloudflare Workers Builds, a Git integration on the
Cloudflare side that shows up as a `Workers Builds: roozekrans-nl` check run, builds each push. A merge to
`master` therefore deploys the site (`wrangler.jsonc`: assets from `./dist`, `404-page` handling). Do not
run `npm run deploy` from an agent session; it is the manual `wrangler deploy` path.

## Conventions and gotchas

- Exception to the org rule on releases: this repo has no release-please, no `release-please-config.json`
  and no changelog. Commit types still follow Conventional Commits, but none of them opens a release PR;
  a merge to `master` deploys instead.
- Exception to the org rule on the default branch: it is `master`, not `main`.
- Exception to the org CI rule: there is no `ci-baseline` workflow, no coverage gate and no Codecov. This
  is not a .NET repo, and the gate is `npm run check:tokens`, `npm run check` and `npm run build`.
- `scripts/check-tokens.mjs` fails the build when `.astro`, `.css`, `.md`, `.mdx` or `.ts` files under
  `src/` use raw Tailwind palette utilities, or hex colours in arbitrary-value utilities and inline styles. Use the semantic tokens from
  `docs/design/MASTER.md` such as `text-body`, `text-muted`, `bg-surface`. Comments are scanned too, so
  reword a comment that trips it. Exit code 1 is a violation, 2 means the guard itself broke.
- Fonts are self-hosted in `public/fonts/`; do not add a Google Fonts or other third-party CDN request.
- `public/og-default.svg` is the source of `public/og-default.png`; regenerate the PNG at 1200x630 after
  editing the SVG.
- Renovate holds `typescript` below 7 (`renovate.json`) because `@astrojs/check` does not support it yet.

<!-- org-core:start sha256=08a88996bc9165f888fc0260607cfd0670cae128c323e16707c6b452ee66222d (generated from docker-nuc scripts/agents-md/org-core-personal.md; do not edit here) -->
## Org rules

These rules hold in every public MarcelRoozekrans repo.

### Commits and releases

- Conventional Commits. release-please reads them on the default branch, and the changelog sections
  in `release-please-config.json` decide which types count. The standard: `feat`, `fix`, `perf`,
  `deps` and `revert` open or update the release PR; `docs`, `test`, `refactor`, `build`, `ci`,
  `chore` and `style` do not, unless the commit is breaking or has a `Release-As:` footer. The
  release happens when that PR merges. A breaking change needs `!` or a `BREAKING CHANGE:` footer.
- A commit body never contains nested parentheses. release-please cannot parse them and silently
  drops the whole commit from the changelog, while the workflow still reports success.
- After merging a commit that should release, check that it appears in the release-please PR.

### Branches and pull requests

- Every change goes through a branch and a pull request. Never push to the default branch directly.
- A PR body says what the diff does, and nothing the diff does not do.
- Fix review findings in the PR under review, including small ones. File an issue only for a finding
  that belongs to other code, needs a design decision, is its own piece of work, or waits on
  something external.

### CI

- The .NET repos call the shared workflows of `MarcelRoozekrans/ci-baseline`, pinned to `@v1`, never
  `@main`.
- Its coverage gate fails the build when line coverage drops below the floor of 80%, and Codecov
  fails a PR that lowers project coverage by more than 1 percentage point. New code comes with
  tests.
- A repo with a lower floor documents the reason and links the issue that raises it.
<!-- org-core:end -->
