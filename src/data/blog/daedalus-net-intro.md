---
title: "Daedalus.NET: A Reference Application for the Ralph Loop"
description: "A .NET 10 application for AI-driven task execution — two front ends over one CQRS stack, failures as values, and a Thalos agent layer, orchestrated with Aspire."
date: 2026-09-13
tags: [".NET", "AI", "Architecture", "Aspire", "open source"]
---

The Ralph Wiggum technique is the practice of feeding an AI agent the same prompt over and over until it signals that it is done. It sounds like a joke at the agent's expense, and it works far better than it has any right to — provided the loop around it is built properly. Clear completion criteria, tests and type checks as gates the agent cannot talk its way past, and expensive work pushed out to subagents so the scheduling context stays cheap.

[Daedalus.NET](https://github.com/MarcelRoozekrans/Daedalus.NET) is that loop built out as a working .NET 10 application rather than described in a blog post. Named after the craftsman who built the Labyrinth, which is either apt or a warning depending on the day.

## Two Front Ends, One Stack

There are two presentation layers over a single CQRS application and infrastructure stack. A Blazor WebAssembly front end sits behind a REST API for the things a person does — inspecting runs, reading output, intervening. A console worker polls the database directly on a five-second cycle for the things the loop does, skipping HTTP entirely because that latency is not worth paying on every iteration.

Both call the same handlers and the same repositories. The split is in how work arrives, not in what happens to it, which keeps the interesting logic in one place instead of in whichever layer happened to receive the request.

.NET Aspire wires the lot together over PostgreSQL with pgvector, with OpenTelemetry exporting over OTLP.

## Failures Are Values

The stack is Railway-Oriented throughout, so an operation returns a result that either carries a value or carries an error, and the error travels back along the same path everything else does. Nothing depends on an exception being thrown at the right depth and caught at the right one.

That matters more in an agent loop than in an ordinary request. Failures here are not exceptional — they are the input to the next iteration. A deterministic failure that arrives as a value is something the loop can read, feed back, and act on. The same failure as an unhandled exception is just a run that stopped.

## The Agent Layer

`Daedalus.Agents` is a [Thalos.NET](https://github.com/MarcelRoozekrans/Thalos.NET) composition root: agents defined in configuration, sessions and long-term memory persisted in Postgres, MCP tools read from `.mcp.json`, and AI.Sentinel scanning at the model boundary. Chat streams to the browser over SSE, and a Telegram channel makes the same agents reachable from a phone.

Tool authorization runs through a developer policy over ZeroAlloc.Authorization, so what an agent may call is a property of its definition rather than of whatever it managed to ask for.

## Why Build the Whole Thing

A reference application earns its keep by being made to work end to end, where the architecture either holds or visibly does not. The test surface runs from ArchUnit rules that fail the build when a layer reaches somewhere it should not, through unit tests per layer, up to Testcontainers integration tests against real pgvector and Playwright suites driving both the API and the browser.

None of that is interesting in isolation. It is interesting because it is what makes an agent loop safe to leave running unattended.

---

Source: [github.com/MarcelRoozekrans/Daedalus.NET](https://github.com/MarcelRoozekrans/Daedalus.NET)
