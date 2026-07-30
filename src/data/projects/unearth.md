---
title: "Unearth"
description: "A dependency-light, read-only data-recovery and disk-forensics toolkit in pure Rust — filesystem-aware undelete, signature carving of 150+ formats, and an MCP interface for AI agents."
tags: ["Rust", "Forensics", "CLI", "MCP"]
github: "https://github.com/MarcelRoozekrans/Unearth"
featured: false
order: 9
---

A read-only recovery and disk-forensics toolkit written in pure Rust. Two complementary strategies: `undelete` reads the directory entries that survive deletion on FAT, exFAT, NTFS, ext2/3/4, and HFS+ to restore files with their original names, paths, and timestamps; `scan` falls back to signature carving across 150+ formats when the filesystem itself is damaged, formatted, or its partition table is gone.

Beyond file recovery it handles lost-partition detection, bad-sector-tolerant imaging, volume triage across roughly 28 filesystems, and runtime-extensible custom carvers. Drive it from the shell, or let an AI agent drive it over MCP.
