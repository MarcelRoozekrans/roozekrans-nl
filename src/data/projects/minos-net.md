---
title: "Minos.NET"
description: "Unofficial .NET client for TypeSafe's Jev decision models — declare typed questions as a C# type, get calibrated answers back. Source-generated and Native AOT safe."
tags: [".NET", "AI", "Source Generators", "Native AOT"]
github: "https://github.com/MarcelRoozekrans/Minos.NET"
nuget: "https://www.nuget.org/packages/Minos.NET.SystemOne"
docs: "https://marcelroozekrans.github.io/Minos.NET/"
featured: true
order: 4
group: ai
packages: 10
---

An unofficial .NET client for decision models: send a `state` and a set of typed questions — Noul, Choice, and Score — and get calibrated, typed answers back. It speaks the `/v1/systemone` protocol of TypeSafe's Jev, directly, through OpenRouter, or against a server you run yourself, and a separate package targets OpenAI's Decisions API.

Questions are declared as a C# type marked `[Questions]`, and a source generator writes the request and the answer parsing at compile time, so the client needs no reflection and runs under Native AOT. Caching and rate limiting ship as optional pipeline stages, alongside dependency injection, OpenTelemetry traces and metrics, a set of analyzers with code fixes, and a conformance suite you can point at any decision endpoint. Since 1.3 a recording stage keeps every decision for later labelling, and calibration and report tooling helps you pick a provider and a confidence threshold. At 1.x, with all ten packages on NuGet.
