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
