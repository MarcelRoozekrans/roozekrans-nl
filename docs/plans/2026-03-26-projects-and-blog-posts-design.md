# roozekrans.nl — New Projects & Blog Posts Design

**Date:** 2026-03-26
**Status:** Approved

## Overview

Add 3 missing project cards and 5 blog posts covering software releases across MarcelRoozekrans, ZeroAlloc-Net, and lucent-org GitHub orgs. Blog posts are dated to the first/major release of each project and include deep links to GitHub, NuGet, VS Code Marketplace, and docs sites.

## New Project Cards

### AdoNet.Async
- **File:** `src/data/projects/adonet-async.md`
- **GitHub:** https://github.com/MarcelRoozekrans/AdoNet.Async
- **NuGet:** https://www.nuget.org/packages/AdoNet.Async (+ DataSet + Adapters)
- **Tags:** .NET, ADO.NET, Async, NuGet
- **Order:** 14, featured: false

### Lucent Code
- **File:** `src/data/projects/lucent-code.md`
- **GitHub:** https://github.com/lucent-org/lucent-code
- **Marketplace:** https://marketplace.visualstudio.com/items?itemName=lucentcode.lucent-code
- **Docs:** https://docs.lucentcode.dev
- **Tags:** VS Code, AI, LSP, TypeScript
- **Order:** 15, featured: true

### ZeroAlloc Suite
- **File:** `src/data/projects/zeroalloc-suite.md`
- **GitHub:** https://github.com/ZeroAlloc-Net
- **Tags:** .NET, Source Generators, Performance, NuGet
- **Order:** 16, featured: false
- Covers: Inject, Results, Validation, ValueObjects, Specification, Pipeline

## Blog Posts

### 1. Roslyn CodeLens MCP Intro
- **File:** `src/data/blog/roslyn-codelens-mcp-intro.md`
- **Date:** 2026-03-06
- **Links:** GitHub, Glama.ai MCP listing, NuGet (RoslynCodeLens.Mcp)
- **Angle:** Why AI agents need semantic code understanding, not just file search

### 2. MailPeek Intro
- **File:** `src/data/blog/mailpeek-intro.md`
- **Date:** 2026-03-10
- **Links:** GitHub, NuGet
- **Angle:** Stop sending test emails to real people; fake SMTP with live dashboard

### 3. ZeroAlloc Suite Intro
- **File:** `src/data/blog/zeroalloc-suite-intro.md`
- **Date:** 2026-03-13
- **Links:** ZeroAlloc-Net GitHub org, individual NuGet packages
- **Angle:** Why zero-allocation matters, how source generators eliminate runtime overhead

### 4. Lucent Code Intro
- **File:** `src/data/blog/lucent-code-intro.md`
- **Date:** 2026-03-21
- **Links:** VS Code Marketplace, docs.lucentcode.dev, GitHub
- **Angle:** LSP-first AI coding vs grep-based tools; multi-provider support

### 5. AdoNet.Async Intro
- **File:** `src/data/blog/adonet-async-intro.md`
- **Date:** 2026-03-22
- **Links:** GitHub, NuGet (3 packages)
- **Angle:** Why ADO.NET never got proper async interfaces, and how to fix that

## Out of Scope

- Blog posts for every ZeroAlloc sub-library individually
- Changelog-style posts (posts are intro/motivation, not release notes)
- CMS or dynamic content fetching from GitHub API at build time
