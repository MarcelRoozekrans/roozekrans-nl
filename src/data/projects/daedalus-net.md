---
title: "Daedalus.NET"
description: "A .NET 10 reference application for AI-driven task execution — Railway-Oriented Programming, dual Blazor and console front ends, and a Thalos agent stack orchestrated with Aspire."
tags: [".NET", "AI", "Aspire", "Blazor"]
github: "https://github.com/MarcelRoozekrans/Daedalus.NET"
featured: false
order: 8
---

A .NET 10 application that drives AI task execution through repeated LLM iteration loops, built as a working reference for the architecture rather than as a library to depend on. Two presentation layers — a Blazor WebAssembly front end over a REST API, and a console worker that bypasses HTTP to poll the database directly on a five-second cycle — share one CQRS application and infrastructure stack, orchestrated by .NET Aspire over PostgreSQL with pgvector.

The agent side is a Thalos.NET composition root: sessions and memory persisted in Postgres, MCP tools read from `.mcp.json`, AI.Sentinel at the model boundary, SSE chat and a Telegram channel. Failures travel as values through Railway-Oriented Programming rather than as exceptions, and the test surface runs from ArchUnit rules and layer unit tests up through Testcontainers integration tests to Playwright browser and API suites.
