# New Projects & Blog Posts Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 3 new project cards and 5 blog posts to roozekrans.nl, dated to release dates with deep links to GitHub, NuGet, VS Code Marketplace, and docs sites.

**Architecture:** Content is plain Markdown files in `src/data/projects/` and `src/data/blog/`. No build step required — Astro picks them up automatically. Project cards use frontmatter fields: title, description, tags, github, nuget (optional), marketplace (optional), docs (optional), featured, order. Blog posts use: title, description, date, tags.

**Tech Stack:** Astro 4.x, Markdown content collections, Tailwind CSS dark theme (zinc-950 / cyan-400).

---

## Task 1: Add AdoNet.Async project card

**Files:**
- Create: `src/data/projects/adonet-async.md`

**Step 1: Create the file**

```markdown
---
title: "AdoNet.Async"
description: "Async-first interfaces and base classes for ADO.NET — drop-in replacement with async/await, IAsyncEnumerable, and ValueTask support for System.Data."
tags: [".NET", "ADO.NET", "Async", "NuGet"]
github: "https://github.com/MarcelRoozekrans/AdoNet.Async"
nuget: "https://www.nuget.org/packages/AdoNet.Async"
featured: false
order: 14
---

Async-first interfaces and base classes for ADO.NET. A drop-in replacement that brings modern `async/await`, `IAsyncEnumerable`, and `ValueTask` support to `System.Data`. Wrap any `DbConnection` with `.AsAsync()` and stream rows with `await foreach` — no breaking changes to your existing provider.
```

**Step 2: Verify it renders**

Run the dev server (`npm run dev`) and navigate to `/projects`. Confirm "AdoNet.Async" card appears with the correct tags and GitHub link.

**Step 3: Commit**

```bash
git add src/data/projects/adonet-async.md
git commit -m "feat: add AdoNet.Async project card"
```

---

## Task 2: Add Lucent Code project card

**Files:**
- Create: `src/data/projects/lucent-code.md`

**Step 1: Create the file**

```markdown
---
title: "Lucent Code"
description: "AI chat & completions for VS Code — semantic code intelligence via your language server. Any model, any provider."
tags: ["VS Code", "AI", "LSP", "TypeScript"]
github: "https://github.com/lucent-org/lucent-code"
marketplace: "https://marketplace.visualstudio.com/items?itemName=lucentcode.lucent-code"
docs: "https://docs.lucentcode.dev"
featured: true
order: 15
---

AI coding assistant for VS Code that understands your codebase the same way your editor does — through the language server, not file search. Resolves symbols, follows definitions, reads live diagnostics, and supports any model via OpenRouter, Anthropic, or NVIDIA NIM. Includes inline completions, a streaming chat panel, slash-command skills, MCP support, and git worktree isolation.
```

**Step 2: Check if the project card component renders `marketplace` and `docs` fields**

Read `src/components/` to find the project card component. If it doesn't render `marketplace` or `docs` links, add them alongside the existing `nuget` link pattern. The field is optional — only render when present.

**Step 3: Verify it renders**

Navigate to `/projects`. Confirm "Lucent Code" card appears with VS Code Marketplace and docs links.

**Step 4: Commit**

```bash
git add src/data/projects/lucent-code.md src/components/
git commit -m "feat: add Lucent Code project card with marketplace and docs links"
```

---

## Task 3: Add ZeroAlloc Suite project card

**Files:**
- Create: `src/data/projects/zeroalloc-suite.md`

**Step 1: Create the file**

```markdown
---
title: "ZeroAlloc Suite"
description: "A suite of zero-allocation .NET libraries — Mediator, DI, Results, Validation, ValueObjects, Specification — all wired at compile time via Roslyn source generators."
tags: [".NET", "Source Generators", "Performance", "NuGet"]
github: "https://github.com/ZeroAlloc-Net"
featured: false
order: 16
---

A cohesive suite of zero-allocation .NET libraries built on Roslyn source generators. Every dispatch, registration, and validation rule is wired at compile time — no reflection, no boxing, no dictionaries. Covers the full domain model stack: [Mediator](https://github.com/ZeroAlloc-Net/ZeroAlloc.Mediator), [Inject](https://github.com/ZeroAlloc-Net/ZeroAlloc.Inject), [Results](https://github.com/ZeroAlloc-Net/ZeroAlloc.Results), [Validation](https://github.com/ZeroAlloc-Net/ZeroAlloc.Validation), [ValueObjects](https://github.com/ZeroAlloc-Net/ZeroAlloc.ValueObjects), and [Specification](https://github.com/ZeroAlloc-Net/ZeroAlloc.Specification). Native AOT compatible.
```

**Step 2: Verify it renders**

Navigate to `/projects`. Confirm the ZeroAlloc Suite card appears with the org GitHub link and inline links in the body render correctly.

**Step 3: Commit**

```bash
git add src/data/projects/zeroalloc-suite.md
git commit -m "feat: add ZeroAlloc Suite project card"
```

---

## Task 4: Blog post — Roslyn CodeLens MCP

**Files:**
- Create: `src/data/blog/roslyn-codelens-mcp-intro.md`

**Step 1: Create the file**

```markdown
---
title: "Giving AI Agents Eyes Into Your .NET Codebase"
description: "Roslyn CodeLens MCP gives AI coding assistants semantic .NET code understanding — type hierarchies, call graphs, DI registrations — without grep."
date: 2026-03-06
tags: [".NET", "Roslyn", "MCP", "AI", "open source"]
---

When I started using AI coding assistants seriously, I kept running into the same wall: the AI would confidently suggest a refactor, get the type hierarchy wrong, and send me chasing a bug it introduced. Not because it was bad at coding — but because it was reading my codebase the way a text editor from 1995 would: as flat files, searched by pattern.

That's why I built [Roslyn CodeLens MCP](https://github.com/MarcelRoozekrans/roslyn-codelens-mcp).

## What It Does

Roslyn CodeLens MCP is a [Model Context Protocol](https://modelcontextprotocol.io) server that gives AI agents real semantic understanding of .NET codebases. Instead of grep, it uses the Roslyn compiler API — the same engine that powers Visual Studio's IntelliSense, refactoring, and diagnostics.

That means an AI agent can:

- **`find_implementations`** — see every class implementing an interface, not just ones with obvious names
- **`find_callers`** — know every call site before suggesting a rename
- **`get_type_hierarchy`** — walk base classes and derived types correctly
- **`get_di_registrations`** — understand the DI graph without running the app
- **`get_diagnostics`** — read compiler errors and Roslyn analyzer warnings
- **`apply_code_action`** — execute Roslyn refactorings with a diff preview before writing to disk

Over 30 tools in total, from dead code detection to cyclomatic complexity analysis.

## Why MCP?

MCP lets any supporting AI client — Claude Code, VS Code Copilot, Cursor — connect to the server and call its tools during a conversation. The AI decides when to call `find_callers` before proposing a rename, or `get_diagnostics` after generating code. You don't have to prompt it; the tool availability shifts how it reasons.

## Getting Started

Install as a .NET global tool:

```bash
dotnet tool install -g RoslynCodeLens.Mcp
```

Or install as a Claude Code plugin:

```bash
claude install gh:MarcelRoozekrans/roslyn-codelens-mcp
```

The server is also listed on [Glama.ai](https://glama.ai/mcp/servers/MarcelRoozekrans/roslyn-codelens-mcp) and available on [NuGet](https://www.nuget.org/packages/RoslynCodeLens.Mcp).

---

Source and full tool reference: [github.com/MarcelRoozekrans/roslyn-codelens-mcp](https://github.com/MarcelRoozekrans/roslyn-codelens-mcp)
```

**Step 2: Verify it renders**

Navigate to `/blog` and then to the post detail. Confirm date shows as 2026-03-06, code blocks are syntax-highlighted, and links work.

**Step 3: Commit**

```bash
git add src/data/blog/roslyn-codelens-mcp-intro.md
git commit -m "feat: add Roslyn CodeLens MCP blog post"
```

---

## Task 5: Blog post — MailPeek

**Files:**
- Create: `src/data/blog/mailpeek-intro.md`

**Step 1: Create the file**

```markdown
---
title: "MailPeek: Stop Sending Test Emails to Real People"
description: "MailPeek is an in-memory fake SMTP server with a real-time web dashboard for ASP.NET Core. Capture every email your app sends during development."
date: 2026-03-10
tags: [".NET", "ASP.NET Core", "Testing", "Developer Tools", "open source"]
---

You know that sinking feeling when you realise the "welcome" email your app just sent went to a real customer because someone left a production SMTP connection string in `.env.local`? MailPeek exists to make that impossible.

[MailPeek](https://github.com/MarcelRoozekrans/MailPeek) is an in-memory fake SMTP server for ASP.NET Core. Your app thinks it's sending email. MailPeek catches every message and shows it in a real-time web dashboard — subject, body, headers, attachments, the works. Nothing leaves your machine.

## Setup

```bash
dotnet add package MailPeek
```

```csharp
// Program.cs
builder.Services.AddMailPeek();

app.UseMailPeek(); // serves dashboard at /mailpeek
```

That's it. MailPeek registers a fake `ISmtpClient` and intercepts any email sent through it. The dashboard auto-updates over SignalR — no polling, no refresh.

## Works with .NET Aspire

If you're using [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/), MailPeek integrates with service discovery out of the box. Add it to your AppHost and it shows up alongside your other services in the dashboard.

## Why Not Just Log Emails?

Logging gives you text. MailPeek gives you a rendered preview of exactly what your users would see — HTML body, plain-text fallback, MIME structure. Useful when you're debugging template rendering or multipart encoding.

---

Available on [NuGet](https://www.nuget.org/packages/MailPeek) · Source on [GitHub](https://github.com/MarcelRoozekrans/MailPeek)
```

**Step 2: Verify it renders**

Navigate to `/blog`. Confirm post appears with date 2026-03-10.

**Step 3: Commit**

```bash
git add src/data/blog/mailpeek-intro.md
git commit -m "feat: add MailPeek blog post"
```

---

## Task 6: Blog post — ZeroAlloc Suite

**Files:**
- Create: `src/data/blog/zeroalloc-suite-intro.md`

**Step 1: Create the file**

```markdown
---
title: "Building Zero-Allocation .NET with Source Generators"
description: "The ZeroAlloc suite wires mediator dispatch, DI registration, validation, and more at compile time — no reflection, no boxing, no dictionaries at runtime."
date: 2026-03-13
tags: [".NET", "Source Generators", "Performance", "Roslyn", "open source"]
---

Every time your mediator looks up a handler, it's probably doing a dictionary lookup, a virtual dispatch, and maybe a bit of reflection. For most apps that's fine. For hot paths — message queues, game loops, real-time systems — it adds up.

The [ZeroAlloc suite](https://github.com/ZeroAlloc-Net) takes a different approach: do all that wiring at compile time using Roslyn source generators, and eliminate the runtime overhead entirely.

## What's In the Suite

**[ZeroAlloc.Mediator](https://github.com/ZeroAlloc-Net/ZeroAlloc.Mediator)** — compile-time mediator. The source generator scans your assemblies, finds every `IRequestHandler<TRequest, TResponse>`, and emits a static dispatch switch. No dictionary, no reflection, no virtual dispatch. Handler resolution costs zero allocations at runtime.

**[ZeroAlloc.Inject](https://github.com/ZeroAlloc-Net/ZeroAlloc.Inject)** — compile-time DI container. Instead of a runtime-built service graph, the generator emits a typed container with direct constructor calls. Native AOT compatible, 5 ns startup.

**[ZeroAlloc.Results](https://github.com/ZeroAlloc-Net/ZeroAlloc.Results)** — `Result<T, E>` with full `CSharpFunctionalExtensions` API parity and zero boxing.

**[ZeroAlloc.Validation](https://github.com/ZeroAlloc-Net/ZeroAlloc.Validation)** — validation rules wired at compile time. Write your rules as types; the generator builds the evaluation pipeline.

**[ZeroAlloc.ValueObjects](https://github.com/ZeroAlloc-Net/ZeroAlloc.ValueObjects)** — source-generated equality for value objects, eliminating the boxing that `GetEqualityComponents()` normally causes.

**[ZeroAlloc.Specification](https://github.com/ZeroAlloc-Net/ZeroAlloc.Specification)** — source-generated specification pattern for .NET 8+.

## How It Works

Each library follows the same pattern. You write normal C# — interfaces, attributes, partial classes. The source generator reads your code through the Roslyn compilation model, emits concrete implementations, and the compiler weaves them in. You get IntelliSense, compile-time errors, and zero reflection at runtime.

```csharp
// You write this
[GenerateDispatcher]
public partial class Dispatcher : IMediator { }

// Generator emits something like this
public partial class Dispatcher
{
    public TResponse Send<TResponse>(IRequest<TResponse> request) =>
        request switch {
            CreateOrderCommand cmd => _createOrderHandler.Handle(cmd),
            GetOrderQuery q => _getOrderHandler.Handle(q),
            _ => throw new InvalidOperationException()
        };
}
```

No dictionaries. No `Activator.CreateInstance`. No allocations.

---

All libraries are available on NuGet under the [ZeroAlloc-Net](https://github.com/ZeroAlloc-Net) organisation. Native AOT compatible.
```

**Step 2: Verify it renders**

Navigate to `/blog`. Confirm post appears dated 2026-03-13.

**Step 3: Commit**

```bash
git add src/data/blog/zeroalloc-suite-intro.md
git commit -m "feat: add ZeroAlloc suite blog post"
```

---

## Task 7: Blog post — Lucent Code

**Files:**
- Create: `src/data/blog/lucent-code-intro.md`

**Step 1: Create the file**

```markdown
---
title: "Lucent Code: AI That Reads Your Code Like Your IDE Does"
description: "Lucent Code is a VS Code AI assistant that uses your language server for code intelligence — not file search. Any model, any provider."
date: 2026-03-21
tags: ["VS Code", "AI", "LSP", "Developer Tools", "open source"]
---

Most AI coding tools work by searching your files. They glob for relevant-looking paths, grep for the symbol name, and hope the context window fits. It works surprisingly often — until it doesn't, and the AI confidently suggests a change that breaks three things it couldn't see.

[Lucent Code](https://marketplace.visualstudio.com/items?itemName=lucentcode.lucent-code) takes a different approach: it reads your code the same way VS Code does, through the language server.

## LSP-First Intelligence

When you ask Lucent Code about a symbol, it doesn't grep your files. It calls `executeDefinitionProvider`, `executeHoverProvider`, and `executeReferenceProvider` — the same APIs your editor uses for go-to-definition and find-all-references. The result is accurate type information, resolved references, and live diagnostics, not pattern-matched guesses.

| | Grep-based tools | Lucent Code |
|---|---|---|
| Symbol resolution | Regex | `executeDefinitionProvider` |
| Type info | Guessed | `executeHoverProvider` |
| References | File scan | `executeReferenceProvider` |
| Diagnostics | None | Live from language server |

## Any Model, Any Provider

Lucent Code supports three provider backends out of the box:

- **[OpenRouter](https://openrouter.ai)** — 500+ models including Claude, GPT-4o, Gemini, Mistral, Llama. Free tier available.
- **[Anthropic](https://console.anthropic.com)** — native Claude access without a proxy hop.
- **[NVIDIA NIM](https://build.nvidia.com)** — direct GPU inference for Nemotron and other NVIDIA models.

Switch providers in one click from the model selector in the status bar.

## What Else Is In There

- **Streaming chat panel** — markdown rendering, syntax-highlighted code, copy/insert buttons
- **Inline completions** — ghost-text suggestions, auto or manual (`Alt+\`)
- **Slash-command skills** — `/code-review`, `/refactor`, `/debugging`, `/tests`, `/commit`, and more. Load your own from GitHub or npm.
- **AI editor tools** — rename symbols, insert code, apply quick fixes — with an approval card for destructive operations
- **Git worktrees** — isolate AI sessions so your main workspace stays clean
- **MCP support** — connect external tools via Model Context Protocol

## Getting Started

Install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=lucentcode.lucent-code). Add an API key for your preferred provider and you're running in under two minutes.

Full documentation at [docs.lucentcode.dev](https://docs.lucentcode.dev) · Source on [GitHub](https://github.com/lucent-org/lucent-code)
```

**Step 2: Verify it renders**

Navigate to `/blog`. Confirm post appears dated 2026-03-21 and the comparison table renders correctly.

**Step 3: Commit**

```bash
git add src/data/blog/lucent-code-intro.md
git commit -m "feat: add Lucent Code blog post"
```

---

## Task 8: Blog post — AdoNet.Async

**Files:**
- Create: `src/data/blog/adonet-async-intro.md`

**Step 1: Create the file**

```markdown
---
title: "AdoNet.Async: Bringing `await foreach` to ADO.NET"
description: "AdoNet.Async adds async-first interfaces and base classes to System.Data — IAsyncEnumerable rows, ValueTask operations, and a drop-in .AsAsync() adapter."
date: 2026-03-22
tags: [".NET", "ADO.NET", "Async", "NuGet", "open source"]
---

ADO.NET has had `ExecuteReaderAsync` since .NET 4.5. But the interfaces — `IDbConnection`, `IDbCommand`, `IDataReader` — are still synchronous. If you want to mock or abstract your database layer, you're stuck returning `Task` from wrapper methods or writing your own interfaces from scratch.

[AdoNet.Async](https://github.com/MarcelRoozekrans/AdoNet.Async) fixes that.

## What It Adds

Three NuGet packages:

**`AdoNet.Async`** — the core async interfaces: `IAsyncDbConnection`, `IAsyncDbCommand`, `IAsyncDataReader`, `IAsyncDataRecord`. Zero dependencies.

**`AdoNet.Async.DataSet`** — async `DataTable`, `DataSet`, `DataAdapter`, plus JSON converters.

**`AdoNet.Async.Adapters`** — adapter wrappers so you can wrap any existing `DbConnection` without changing your provider.

## Drop-In Migration

You don't need to rewrite your provider. Wrap your existing connection with `.AsAsync()`:

```csharp
using System.Data.Async.Adapters;

DbConnection sqlConnection = new SqlConnection(connectionString);
IAsyncDbConnection connection = sqlConnection.AsAsync();

await connection.OpenAsync();
IAsyncDbCommand cmd = connection.CreateCommand();
cmd.CommandText = "SELECT Id, Name FROM Users";
IAsyncDataReader reader = await cmd.ExecuteReaderAsync();
```

## Stream Rows with `await foreach`

`IAsyncDataReader` implements `IAsyncEnumerable<IAsyncDataRecord>`, so you can stream results naturally:

```csharp
await foreach (var row in reader)
{
    Console.WriteLine(row.GetString("Name"));
}
```

No `while (reader.Read())`. No manual disposal loops.

## Why Not Just Use Dapper / EF Core?

If you're already on Dapper or EF Core, you probably don't need this. AdoNet.Async targets codebases that use ADO.NET directly — legacy systems, high-performance query layers, or anything where the ORM overhead isn't acceptable. It makes those codebases testable without pulling in a full ORM.

---

Available on NuGet: [`AdoNet.Async`](https://www.nuget.org/packages/AdoNet.Async) · [`AdoNet.Async.DataSet`](https://www.nuget.org/packages/AdoNet.Async.DataSet) · [`AdoNet.Async.Adapters`](https://www.nuget.org/packages/AdoNet.Async.Adapters)

Source on [GitHub](https://github.com/MarcelRoozekrans/AdoNet.Async)
```

**Step 2: Verify it renders**

Navigate to `/blog`. Confirm post appears dated 2026-03-22.

**Step 3: Commit**

```bash
git add src/data/blog/adonet-async-intro.md
git commit -m "feat: add AdoNet.Async blog post"
```

---

## Task 9: Check if project card supports `marketplace` / `docs` fields

**Files:**
- Read: `src/components/` (find the project card component)
- Possibly modify: the project card `.astro` component

**Step 1: Find the card component**

Look in `src/components/` for a file like `ProjectCard.astro` or similar.

**Step 2: Check the rendered links section**

Find where `nuget` is rendered. It will look something like:

```astro
{nuget && <a href={nuget}>NuGet</a>}
```

**Step 3: Add `marketplace` and `docs` if missing**

Add after the nuget link:

```astro
{marketplace && (
  <a href={marketplace} target="_blank" rel="noopener noreferrer">
    VS Code Marketplace
  </a>
)}
{docs && (
  <a href={docs} target="_blank" rel="noopener noreferrer">
    Docs
  </a>
)}
```

Also update the props/type definition if the component uses TypeScript props.

**Step 4: Verify Lucent Code card shows all three links**

Navigate to `/projects` and confirm the Lucent Code card shows GitHub, VS Code Marketplace, and Docs links.

**Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add marketplace and docs link support to project card"
```

---

## Task 10: Final check — blog list and ordering

**Step 1: Navigate to `/blog`**

Confirm all 6 posts (hello-world + 5 new) appear, sorted by date descending. The order should be:

1. AdoNet.Async (2026-03-22)
2. Lucent Code (2026-03-21)
3. ZeroAlloc Suite (2026-03-13)
4. MailPeek (2026-03-10)
5. Roslyn CodeLens MCP (2026-03-06)
6. Hello World (2026-03-13 — may tie with ZeroAlloc, check sort stability)

**Step 2: Navigate to `/projects`**

Confirm all 16 cards render, including the 3 new ones (AdoNet.Async, Lucent Code, ZeroAlloc Suite).

**Step 3: Check home page**

Navigate to `/`. Confirm "Latest Posts" section shows the 3 most recent posts (AdoNet.Async, Lucent Code, ZeroAlloc Suite).

**Step 4: Commit design docs**

```bash
git add docs/plans/
git commit -m "docs: add projects and blog posts design and implementation plan"
```
