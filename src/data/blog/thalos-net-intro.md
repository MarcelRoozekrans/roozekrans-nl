---
title: "Thalos.NET: Checking the Tool Call Before It Runs"
description: "A ZeroAlloc-native agent framework for .NET on Microsoft Agent Framework, where tool authorization, curated memory, and model-boundary scanning are runtime ports rather than afterthoughts."
date: 2026-09-14
tags: [".NET", "AI", "Agents", "MCP", "open source"]
---

Give an agent a tool and you have given it a capability. Most frameworks are relaxed about that — the list of tools handed to the model *is* the boundary, and whatever comes back gets invoked. It holds up until one agent has an MCP server that can write to the repository and another has no business doing so, at which point "they share a tool catalog" stops being a detail.

[Thalos.NET](https://github.com/MarcelRoozekrans/Thalos.NET) is built the other way round. It is named after Talos, the bronze guardian of Crete, spelled with an h because `Talos.*` was already taken on nuget.org.

## Tools Are Named, Then Gated

Every tool the model can see is qualified as `{source}__{tool}` — `roslyn__find_callers`, `memory__recall`. An agent declares what it may reach as globs over those qualified names, and the host can require a policy for a pattern:

```csharp
.RequireToolPolicy("roslyn__apply_*", "developer")
```

The check runs at the function boundary, before the tool executes. That ordering is the whole point. Inspecting the chat stream afterwards tells you what an agent did; it does not stop it.

## Memory That Is Curated Rather Than Accumulated

`Thalos.NET.Memory` keeps records and vectors apart. The store holds the truth — text, tags, importance, timestamps — and the vector index is a rebuildable cache in front of it, so a failed embedding leaves the record marked `IndexPending` and the write still succeeds.

Two details matter more than the storage shape. Every memory belongs to an owner taken from the turn's security context and never from a tool argument, so an agent cannot talk its way into another user's recollections. And when recalled memories are appended to the instructions for a run, they arrive inside a delimited block with any `memories` tag spelling inside the text escaped, so a memory cannot close its own block and start issuing instructions. Recall also never fails a turn — an error is logged and surfaces as an event.

## The Part Worth Not Papering Over

`Thalos.NET.Sentinel` wires [AI.Sentinel](https://github.com/MarcelRoozekrans/AI.Sentinel) in at the model boundary, and its security detectors — prompt injection, jailbreak, exfiltration — are semantic. Without an embedding generator configured, they return *Clean* and only the lexical and operational detectors run.

So `UseAISentinel()` on its own is not prompt-injection protection. It is worth saying plainly, because a security feature that quietly does nothing is worse than one you know you have not switched on yet.

## Taking Only What You Need

Eleven packages ship separately: MCP servers as tool sources, an Anthropic provider, pgvector-backed memory through [Rag.NET](https://github.com/MarcelRoozekrans/Rag.NET), `SKILL.md` procedure documents resolved by in-process cosine search, and channel hosting with a Telegram transport built on long-polling. A testing package carries contract tests, so a host implementing its own session or memory store can check it behaves like the ones that ship.

Targets `net8.0` and `net10.0`. There is a runnable REPL in `samples/`.

---

Source: [github.com/MarcelRoozekrans/Thalos.NET](https://github.com/MarcelRoozekrans/Thalos.NET)
