---
title: "ZeroAlloc.NET"
description: "A 96-package .NET ecosystem where every dispatch, registration, and validation rule is wired at compile time by Roslyn source generators — no reflection, no boxing, Native AOT safe."
tags: [".NET", "Source Generators", "Performance", "Native AOT"]
github: "https://github.com/ZeroAlloc-Net"
nuget: "https://www.nuget.org/profiles/ZeroAlloc.NET"
docs: "https://zeroalloc.net"
featured: true
order: 1
packages: 96
---

A cohesive ecosystem of zero-allocation .NET libraries built on Roslyn source generators. Every dispatch, registration, mapping, and validation rule is resolved at compile time — no reflection, no boxing, no runtime dictionaries — which keeps the hot path allocation-free and the whole surface Native AOT safe.

The suite spans the full application stack: [Mediator](https://github.com/ZeroAlloc-Net/ZeroAlloc.Mediator) and [Pipeline](https://github.com/ZeroAlloc-Net/ZeroAlloc.Pipeline) for dispatch, [Inject](https://github.com/ZeroAlloc-Net/ZeroAlloc.Inject) for compile-time DI, [ORM](https://github.com/ZeroAlloc-Net/ZeroAlloc.ORM) and [Rest](https://github.com/ZeroAlloc-Net/ZeroAlloc.Rest) for data and HTTP access, [EventSourcing](https://github.com/ZeroAlloc-Net/ZeroAlloc.EventSourcing), [Saga](https://github.com/ZeroAlloc-Net/ZeroAlloc.Saga), and [Outbox](https://github.com/ZeroAlloc-Net/ZeroAlloc.Outbox) for distributed workflows, plus [Results](https://github.com/ZeroAlloc-Net/ZeroAlloc.Results), [Validation](https://github.com/ZeroAlloc-Net/ZeroAlloc.Validation), [ValueObjects](https://github.com/ZeroAlloc-Net/ZeroAlloc.ValueObjects), [StateMachine](https://github.com/ZeroAlloc-Net/ZeroAlloc.StateMachine), [Collections](https://github.com/ZeroAlloc-Net/ZeroAlloc.Collections), and [Analyzers](https://github.com/ZeroAlloc-Net/ZeroAlloc.Analyzers) to keep allocations out of your own code.

[ZeroAlloc.Templates](https://github.com/ZeroAlloc-Net/ZeroAlloc.Templates) wires ten of the packages into a `dotnet new` Clean Architecture Web API template with EF Core, JWT, OpenTelemetry, architecture boundary tests, and benchmarks already in place.
