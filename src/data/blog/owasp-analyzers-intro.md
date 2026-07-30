---
title: "Catching the OWASP Top 10 at Compile Time"
description: "Owasp.Analyzers is a set of Roslyn analyzers covering the OWASP Top 10 2025 for C#, turning security review into a build step instead of a scanning pass."
date: 2026-04-01
tags: [".NET", "Roslyn", "Security", "OWASP", "open source"]
---

Most security tooling runs too late. A scanner in the pipeline finds a problem hours after you wrote it, in a report you read out of context, about code you have already stopped thinking about. By then fixing it is an interruption rather than part of writing the thing.

Roslyn analyzers run at the other end of that timeline — as you type. So I wrote [Owasp.Analyzers](https://github.com/MarcelRoozekrans/Owasp.Analyzers) to put the [OWASP Top 10 2025](https://owasp.org/Top10/2025/) there.

## What It Catches

Rules are organised by OWASP category with stable IDs, so `OWASPA01001` through `OWASPA01008` all sit under A01 Broken Access Control. That category alone covers a controller action missing an authorization attribute, hardcoded role strings, `IsInRole` called with a literal, CORS configured with a wildcard origin, and state-changing actions missing antiforgery tokens.

The severity is deliberately not uniform. Most rules are warnings — signals worth reading, occasionally worth suppressing. The SSRF rules are errors, because they are backed by taint analysis rather than pattern matching: the analyzer tracks whether untrusted input actually reaches an `HttpClient` or `WebClient` call. When it can prove the flow, a warning is too quiet.

## Installing It

```bash
dotnet add package Owasp.Analyzers
```

The package is marked `DevelopmentDependency`, so it never shows up as a transitive runtime dependency for anyone consuming your library. It analyses your code and stays out of your shipped graph.

Findings appear in the IDE while you write and fail the build in CI, which means the security review happens where the context still exists — in the editor, next to the code that caused it.

---

Full rule reference: [marcelroozekrans.github.io/Owasp.Analyzers](https://marcelroozekrans.github.io/Owasp.Analyzers/docs/intro)
