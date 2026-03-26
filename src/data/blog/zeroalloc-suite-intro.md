---
title: "Building Zero-Allocation .NET with Source Generators"
description: "The ZeroAlloc suite wires mediator dispatch, DI registration, validation, and more at compile time — no reflection, no boxing, no dictionaries at runtime."
date: 2026-03-13
tags: [".NET", "Source Generators", "Performance", "Roslyn", "open source"]
---

Every time your mediator looks up a handler, it's probably doing a dictionary lookup, a virtual dispatch, and maybe a bit of reflection. For most apps that's fine. For hot paths — message queues, game loops, real-time systems — it adds up.

The [ZeroAlloc suite](https://github.com/ZeroAlloc-Net) takes a different approach: do all that wiring at compile time using Roslyn source generators, and eliminate the runtime overhead entirely.

## What's In the Suite

**[ZeroAlloc.Mediator](https://github.com/ZeroAlloc-Net/ZeroAlloc.Mediator)** — compile-time mediator. The source generator scans your assemblies, finds every `IRequestHandler<TRequest, TResponse>`, and emits a static dispatch switch. No dictionary, no reflection, no virtual dispatch. Handler resolution costs zero allocations at runtime.

**[ZeroAlloc.Inject](https://github.com/ZeroAlloc-Net/ZeroAlloc.Inject)** — compile-time DI container. Instead of a runtime-built service graph, the generator emits a typed container with direct constructor calls. Native AOT compatible, 5 ns startup.

**[ZeroAlloc.Results](https://github.com/ZeroAlloc-Net/ZeroAlloc.Results)** — `Result<T, E>` with full `CSharpFunctionalExtensions` API parity and zero boxing.

**[ZeroAlloc.Validation](https://github.com/ZeroAlloc-Net/ZeroAlloc.Validation)** — validation rules wired at compile time. Write your rules as types; the generator builds the evaluation pipeline.

**[ZeroAlloc.ValueObjects](https://github.com/ZeroAlloc-Net/ZeroAlloc.ValueObjects)** — source-generated equality for value objects, eliminating the boxing that `GetEqualityComponents()` normally causes.

**[ZeroAlloc.Specification](https://github.com/ZeroAlloc-Net/ZeroAlloc.Specification)** — source-generated specification pattern for .NET 8+.

## How It Works

Each library follows the same pattern. You write normal C# — interfaces, attributes, partial classes. The source generator reads your code through the Roslyn compilation model, emits concrete implementations, and the compiler weaves them in. You get IntelliSense, compile-time errors, and zero reflection at runtime.

```csharp
// You write this
[GenerateDispatcher]
public partial class Dispatcher : IMediator { }

// Generator emits something like this
public partial class Dispatcher
{
    public TResponse Send<TResponse>(IRequest<TResponse> request) =>
        request switch {
            CreateOrderCommand cmd => _createOrderHandler.Handle(cmd),
            GetOrderQuery q => _getOrderHandler.Handle(q),
            _ => throw new InvalidOperationException()
        };
}
```

No dictionaries. No `Activator.CreateInstance`. No allocations.

---

All libraries are available on NuGet under the [ZeroAlloc-Net](https://github.com/ZeroAlloc-Net) organisation. Native AOT compatible.
