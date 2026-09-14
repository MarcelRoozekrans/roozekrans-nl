---
title: "Thalos.NET"
description: "A ZeroAlloc-native agent framework for .NET on Microsoft Agent Framework, with tool authorization, curated long-term memory, agent skills, and AI.Sentinel at the model boundary."
tags: [".NET", "AI", "Agents", "MCP"]
github: "https://github.com/MarcelRoozekrans/Thalos.NET"
nuget: "https://www.nuget.org/packages/Thalos.NET"
featured: false
order: 7
packages: 11
---

An agent framework for .NET built on Microsoft Agent Framework, where the parts that usually get bolted on afterwards — tool authorization, long-term memory, procedure documents, transport — are ports in the runtime instead. Agents declare their tools as a glob allow-list over qualified `{source}__{tool}` names, and authorization is enforced at the function boundary, before the tool runs, rather than by reading the chat stream once it already has.

Eleven packages let you take only the surface you need: MCP servers as tool sources, an Anthropic chat-client provider, AI.Sentinel scanning at the model boundary, pgvector-backed memory through Rag.NET, `SKILL.md` procedures resolved by in-process cosine search, and channel hosting with a Telegram transport. Targets `net8.0` and `net10.0`, and ships a testing package with contract tests for anyone implementing their own store.
