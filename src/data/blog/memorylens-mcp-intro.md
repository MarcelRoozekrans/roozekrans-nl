---
title: "MemoryLens MCP: Letting AI Read a Memory Profile"
description: "An MCP server that wraps JetBrains dotMemory and turns snapshots into concrete, AI-actionable code fixes instead of a wall of retention graphs."
date: 2026-03-09
tags: [".NET", "MCP", "Performance", "AI", "open source"]
---

Memory profiling in .NET has a discoverability problem. The tooling is excellent — dotMemory will tell you exactly which objects are surviving and who is holding them — but reading a retention graph is a skill, and the gap between "this `List<T>` is retained by an event handler" and "here is the line to change" is where most people give up.

I wanted my AI assistant to close that gap. So I built [MemoryLens MCP](https://github.com/MarcelRoozekrans/memorylens-mcp).

## What It Does

MemoryLens is an MCP server that wraps JetBrains dotMemory and exposes profiling as tools an agent can call: attach to a process, take a snapshot, analyse it, and compare two snapshots to see what grew between them.

The important part is what happens after the snapshot. Raw dotMemory output is a graph of object retention. MemoryLens runs it through a heuristic rule engine that maps common retention shapes onto their usual causes — undisposed subscriptions, static caches without eviction, closures capturing more than intended — and reports them as concrete suggestions rather than as a data structure to interpret.

## Why an MCP Server

The point is not to make profiling faster. It is to make it something an agent will reach for unprompted.

When "take a snapshot and tell me what leaked" is a tool call rather than a separate application, a debugging conversation can include real measurements instead of speculation about what the allocation profile probably looks like. That changes the quality of the answer considerably.

## Getting Started

Install as a .NET global tool:

```bash
dotnet tool install -g MemoryLens.Mcp
```

It is also published on [npm](https://www.npmjs.com/package/memorylens-mcp) and listed on [Glama.ai](https://glama.ai/mcp/servers/MarcelRoozekrans/memorylens-mcp). A local dotMemory installation is required — MemoryLens drives it, it does not replace it.

---

Source and tool reference: [github.com/MarcelRoozekrans/memorylens-mcp](https://github.com/MarcelRoozekrans/memorylens-mcp)
