---
title: "Owasp.Analyzers"
description: "Roslyn analyzers covering the OWASP Top 10 2025 for C#/.NET projects — security findings at compile time, in the editor."
tags: [".NET", "Roslyn", "Security", "OWASP"]
github: "https://github.com/MarcelRoozekrans/Owasp.Analyzers"
nuget: "https://www.nuget.org/packages/Owasp.Analyzers"
featured: false
order: 11
packages: 1
---

Roslyn analyzers that flag OWASP Top 10 2025 categories as you type — broken access control, injection, cryptographic failures, and the rest. Rules carry stable IDs per category (`OWASPA01001`, `OWASPA01002`, …), and the heavier checks such as SSRF detection use taint analysis rather than pattern matching, so they escalate to errors rather than warnings.

Findings surface in the IDE and fail the build in CI, so security review happens at compile time instead of in a separate scanning pass. The package ships as a `DevelopmentDependency`, so it never leaks into your consumers' transitive graph.
