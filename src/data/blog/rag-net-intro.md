---
title: "Rag.NET: A RAG Pipeline That Isn't Tied to One Vendor"
description: "A modular retrieval-augmented generation library for .NET built on Microsoft.Extensions.AI — parsers, chunking, vector stores, reranking, and evaluation as swappable stages."
date: 2026-07-29
tags: [".NET", "AI", "RAG", "open source"]
---

Most RAG libraries are a vendor's SDK with a pipeline wrapped around it. That is fine until you want to change the embedding model, or move off a hosted vector store, and discover the choice was baked in three layers down.

[Rag.NET](https://github.com/MarcelRoozekrans/Rag.NET) is built on the Microsoft.Extensions.AI abstractions instead, so the model and the store are configuration rather than architecture.

## The Stages

Ingestion is a single pipeline call — parse, chunk, embed, store — with each stage replaceable. Parsers cover text, Markdown, PDF, HTML, Word, Excel, PowerPoint, CSV and JSON. Vector stores cover PostgreSQL with pgvector, Qdrant, and Azure AI Search. Retrieval is semantic search with configurable top-K and a minimum score threshold, and chat comes in both `AskAsync` and streaming `AskStreamingAsync` forms.

## The Parts That Actually Move the Needle

Naive RAG is easy and mediocre. Most of the quality lives in what happens between retrieval and the prompt, so those bits are first-class here:

- **Token-aware chunking** splits by token count rather than characters, so chunks respect the embedding model's real limit instead of an approximation of it.
- **Lost-in-the-Middle reordering** places the highest-scoring chunks at the extremes of the context window, where models attend to them most reliably.
- **A redundancy filter** drops near-duplicate chunks by cosine similarity before they reach the LLM, so three phrasings of the same paragraph do not crowd out the passage that answers the question.
- **Cross-encoder reranking** rescores results with ONNX cross-encoder models, trading a little latency for a lot of precision.
- **Header-aware metadata** propagates Markdown and HTML heading hierarchy into chunks as breadcrumbs, so a retrieved fragment carries the context it came from.

`Rag.NET.Evaluation` scores answer quality by embedding cosine similarity, because "it seems better" is not a way to tune a pipeline.

## Getting Started

The API is a fluent builder over `Microsoft.Extensions.DependencyInjection`, and the extension points are the obvious ones: implement `IDocumentParser`, `IVectorStore` or `IChunkingStrategy` to plug in your own.

Progress reporting runs through `IProgress<IngestionProgress>`, which matters more than it sounds once you are ingesting a corpus large enough to wonder whether it is still working.

---

Source: [github.com/MarcelRoozekrans/Rag.NET](https://github.com/MarcelRoozekrans/Rag.NET)
