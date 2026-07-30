---
title: "Owasp.Analyzers"
description: "Roslyn analyzers covering the OWASP Top 10 2021 for C#/.NET projects — security findings at compile time, in the editor."
tags: [".NET", "Roslyn", "Security", "OWASP"]
github: "https://github.com/MarcelRoozekrans/Owasp.Analyzers"
nuget: "https://www.nuget.org/packages/Owasp.Analyzers"
featured: false
order: 11
packages: 1
---

Roslyn analyzers that flag OWASP Top 10 2021 categories as you type — injection, broken access control, cryptographic failures, insecure deserialization, and the rest. Findings surface in the IDE and fail the build in CI, so security review happens at compile time instead of in a separate scanning pass.
