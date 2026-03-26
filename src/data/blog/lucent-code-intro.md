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
