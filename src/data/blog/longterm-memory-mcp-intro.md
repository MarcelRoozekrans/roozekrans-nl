---
title: "Giving AI Agents a Memory That Never Leaves Your Machine"
description: "LongtermMemory-MCP is a fully local MCP server for persistent semantic memory — SQLite, a local transformer for embeddings, and no API keys anywhere."
date: 2026-04-28
tags: ["AI", "MCP", "SQLite", "TypeScript", "open source"]
---

Every agent memory system I looked at wanted the same two things: a database I had to host and an API key I had to pay for. That is a reasonable trade for a product. It is a poor trade for a developer tool that mostly needs to remember what I told it last week.

[LongtermMemory-MCP](https://github.com/MarcelRoozekrans/LongtermMemory-MCP) does the same job with neither.

## Local All the Way Down

The design goal was that nothing leaves the machine. That shaped every choice:

- **Storage** is SQLite, running through sql.js compiled to WASM — no server, no connection string, just a file.
- **Embeddings** come from `all-MiniLM-L6-v2` running locally, not from an embeddings API.
- **Vector search** is in-process cosine similarity. At the scale a personal memory store actually reaches, a dedicated vector database is a lot of infrastructure to solve a loop over some floats.
- **LLM dependency** is none at all.

The project was inspired by [mcp-mem0](https://github.com/coleam00/mcp-mem0), which does the same thing against PostgreSQL or Supabase with OpenAI embeddings. Setup there is a database plus API keys. Setup here is `npx longterm-memory-mcp`.

## The Tools

The core is what you would expect — `save_memory`, `search_memory`, `update_memory`, `delete_memory`, `memory_stats` — with search as the interesting half. Memories carry a type (`fact`, `preference`, `conversation`, `task`, `ephemeral`, `general`), tags, and an importance score, so retrieval can be filtered rather than purely semantic: `search_by_type`, `search_by_tags`, `search_by_date_range`.

That distinction matters more than it sounds. "What did I decide about auth?" is a semantic query. "What are this user's standing preferences?" is a type filter. Making the agent choose keeps recall precise.

## Getting Started

```bash
npx longterm-memory-mcp
```

No database, no keys, no account.

---

Source and full tool list: [github.com/MarcelRoozekrans/LongtermMemory-MCP](https://github.com/MarcelRoozekrans/LongtermMemory-MCP)
