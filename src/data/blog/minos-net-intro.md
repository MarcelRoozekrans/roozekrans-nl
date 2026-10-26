---
title: "Minos.NET: Asking a Model a Question It Can Answer With a Number"
description: "An unofficial .NET client for TypeSafe's Jev decision models: typed questions declared as a C# type, calibrated answers back, source-generated and Native AOT safe."
date: 2026-10-13
tags: [".NET", "AI", "Source Generators", "Native AOT", "open source"]
---

Most of what an application asks a language model is not open-ended. Is this message urgent? Which queue should it go to? How annoyed is the customer? The usual answer is a prompt that begs for JSON, a parser that hopes it got some, and a string comparison on `"yes"`. What it never gives you is how sure the model was, and that is the one number you need to decide whether to act on the answer without a person checking it.

TypeSafe's Jev models answer exactly that kind of question, and they answer it with probabilities. [Minos.NET](https://github.com/MarcelRoozekrans/Minos.NET) is an unofficial .NET client for them. It is named after Minos, the judge of the dead in Greek myth, which seemed fitting for a library whose whole job is passing judgement.

## Three Kinds of Question

Jev answers three shapes of question, and Minos gives each one its own type:

- A **Noul** is a yes/no question. The answer is a single probability that the answer is yes. There is no separate confidence, because the probability *is* the confidence.
- A **Choice** picks one option out of several. You get the pick, a confidence, and the probability of every option, so the runner-up is one lookup away.
- A **Score** is a Choice over ordered levels, such as a rubric from worst to best. Besides the most likely level, it gives the probability-weighted expected level, which moves smoothly where the top pick jumps. That makes it the better input for a threshold or a weighted sum.

Every answer is a small struct, so reading one never allocates.

## Questions Are a Type

You declare the questions as a C# type, and the options as enums:

```csharp
public enum Lane
{
    [Criterion("Payments, invoices and refunds")]
    Billing,

    [Criterion("Bugs, outages and integrations")]
    Technical,
}

[Questions]
public partial record Triage
{
    [Noul("Does this convey urgency?")]
    public partial Noul IsUrgent { get; }

    [Choice("Which queue should handle this?")]
    public partial Choice<Lane> Queue { get; }
}
```

A source generator writes the request and the answer parsing at compile time. `EvaluateAsync<Triage>` then returns a `Triage` with typed answers, or a typed error: a rejected key, a rate limit, a time-out and an unreadable response are all values rather than exceptions. Because nothing is discovered by reflection, the client runs under Native AOT, and the AOT smoke test in CI exercises every public entry point to keep it that way.

When the questions are not known until run time, a builder makes a question set from data and reads the answers through handles, through the same protocol path the generated code uses.

## The Answer Picks the Action, the Confidence Decides If It Runs

The pattern the library is built around is confidence routing. The answer says what to do; the confidence says whether to do it on its own, ask for a check, or hand it to a person. Each action gets its own threshold, sized to what being wrong costs: showing where a parcel is can be wrong and nobody is hurt, while a refund sent by mistake is money gone.

The guide works through it alongside three other patterns: asking every question you might need in one request and reading only the answers that matter, breaking a judgement into small Scores you weight yourself, and a cheap first decision that routes a request to code, a model, or a person.

## Not Tied to One Vendor

The core is provider-neutral. Questions and answers are a neutral model behind an `IDecisionClient`, and each wire protocol is an adapter. `Minos.NET.SystemOne` speaks Jev's `/v1/systemone` protocol, either to TypeSafe directly, through OpenRouter, or to a server you run yourself, such as a vLLM Semantic Router. `Minos.NET.OpenAI` targets OpenAI's Decisions API, which is in public beta; it is built from OpenAI's guide and has not yet been run against the live API, and the library says so rather than letting you find out.

A conformance suite checks any decision endpoint's shapes, probabilities, errors and models, so a self-hosted server can be held to the same standard as the hosted ones.

The rest is what a .NET host expects: dependency injection with keyed clients, caching and rate limiting as optional pipeline stages, OpenTelemetry traces and metrics, and analyzers with code fixes that catch a malformed question set at compile time.

## Recording Decisions

Since 1.3, `Minos.NET.Recording` keeps a record of every decision your app makes. One pipeline stage hands each decision to a recorder, and the recorder writes it to a JSONL file, to memory or to a store of your own. Later you attach what actually happened, such as the answer a reviewer confirmed, by the decision's id, and you erase a customer's records by a key you chose.

Those records are what you turn into a labelled dataset, so you can measure a model on your own traffic instead of someone else's benchmark. The stage returns the inner client's result unchanged, so it never makes a decision fail. It runs your redaction before anything is kept, and it never puts the state, a decision id or an erasure key in a log, a trace or a metric.

## Choosing a Provider and a Threshold

A confidence is only useful once you know where to cut. The guide has a page that runs a Banking77 sample against TypeSafe, Clef Flash and a local model and compares how accurate, how well calibrated, how costly and how fast each one was, then walks through picking a threshold from those results. The `minos` dotnet tool runs the same calibration and report against a dataset of your own.

## On NuGet

Minos.NET is at 1.x: the public API is stable and follows semantic versioning. All nine packages are on NuGet: the provider-neutral core with the source generator and analyzers, the `/v1/systemone` and OpenAI clients, dependency injection, the caching and rate-limiting stages, labelled datasets, recording, and the `minos` tool with `calibrate`, `report` and `conformance`.

```shell
dotnet add package Minos.NET.SystemOne
dotnet add package Minos.NET.DependencyInjection
```

The [guide](https://marcelroozekrans.github.io/Minos.NET/) is public, and the samples replay recorded answers, so they run offline without an API key.

Minos is not affiliated with TypeSafe, which publishes official SDKs for Python and JavaScript.

---

Source: [github.com/MarcelRoozekrans/Minos.NET](https://github.com/MarcelRoozekrans/Minos.NET)
