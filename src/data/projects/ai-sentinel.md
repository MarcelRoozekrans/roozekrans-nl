---
title: "AI.Sentinel"
description: "Security monitoring middleware for IChatClient — 55 detectors for prompt injection, hallucination, PII leakage, and operational anomalies, with an intervention engine and audit forwarders."
tags: [".NET", "AI Security", "OWASP", "MCP"]
github: "https://github.com/MarcelRoozekrans/AI.Sentinel"
nuget: "https://www.nuget.org/packages/AI.Sentinel"
docs: "https://marcelroozekrans.github.io/AI.Sentinel/"
featured: true
order: 5
packages: 15
---

Drop-in security middleware for any `IChatClient` built on Microsoft.Extensions.AI. 55 detectors cover the OWASP LLM Top 10 — prompt injection, jailbreaks, PII leakage, hallucination signals, and operational anomalies — and feed an intervention engine that can block, redact, or escalate a call before it reaches the model.

Ships an embedded dashboard, approval workflows backed by SQLite or Entra PIM, and audit forwarders to Azure Sentinel and OpenTelemetry. Integrations for ASP.NET Core, Claude Code, GitHub Copilot, and MCP are separate packages, so you take only what you need. Native AOT clean throughout.
