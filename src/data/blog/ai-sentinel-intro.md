---
title: "AI.Sentinel: Security Middleware for Your LLM Calls"
description: "Drop-in monitoring for any IChatClient — detectors for prompt injection, PII leakage and hallucination signals, with an intervention engine and audit forwarding."
date: 2026-04-29
tags: [".NET", "AI Security", "OWASP", "open source"]
---

We spent two decades learning to distrust user input, and then wired a text box straight into a model that follows instructions. The [OWASP LLM Top 10](https://owasp.org/www-project-top-10-for-large-language-model-applications/) exists because that turned out badly in predictable ways.

The awkward part in .NET is that there is nowhere obvious to put the check. `IChatClient` from Microsoft.Extensions.AI gave me the seam I wanted: it is an interface every provider implements, which means it is a place middleware can sit.

That is what [AI.Sentinel](https://github.com/MarcelRoozekrans/AI.Sentinel) is.

## What It Does

Wrap any `IChatClient` and calls flow through a detector pipeline on the way out and the way back. The detectors cover prompt injection and jailbreak attempts, PII leakage, hallucination signals, and operational anomalies — the categories that map onto the OWASP LLM Top 10.

Detection alone is only half of it. Findings feed an intervention engine that decides what to actually do: let the call through, redact part of it, block it, or escalate for approval. Approvals are backed by SQLite or by Entra PIM if you already run privileged access management.

Everything it observes can be forwarded — to Azure Sentinel, or over OpenTelemetry into whatever you already use — so LLM traffic ends up in the same place as the rest of your security telemetry rather than in a silo.

## Take Only What You Need

The surface is deliberately split across separate packages rather than shipped as one dependency. The core is `AI.Sentinel`; ASP.NET Core integration, the Azure Sentinel and OpenTelemetry forwarders, SQLite and Entra PIM approvals, the detector SDK, the MCP server, and the Claude Code and Copilot integrations each live on their own.

A console app that wants injection detection and nothing else pulls one package. It is Native AOT clean throughout.

## Getting Started

```bash
dotnet add package AI.Sentinel
```

Then wrap your existing client — the rest of your calling code does not change.

---

Documentation: [marcelroozekrans.github.io/AI.Sentinel](https://marcelroozekrans.github.io/AI.Sentinel/) · Source: [github.com/MarcelRoozekrans/AI.Sentinel](https://github.com/MarcelRoozekrans/AI.Sentinel)
