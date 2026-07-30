---
title: "Unearth: Data Recovery in Rust, Drivable by an Agent"
description: "A read-only recovery and disk-forensics toolkit — filesystem-aware undelete, signature carving of 150+ formats, lost-partition recovery, and an MCP interface."
date: 2026-07-10
tags: ["Rust", "Forensics", "CLI", "MCP", "open source"]
---

Almost everything I write is .NET. [Unearth](https://github.com/MarcelRoozekrans/Unearth) is not, and the reason is the problem domain: a recovery tool reads damaged disks, walks half-corrupt structures, and must never write to the thing it is inspecting. Rust's guarantees are worth a lot when a bug means overwriting the data you were asked to save.

## Two Strategies, Not One

Recovery tools usually pick a side. Unearth ships both, because they fail in opposite conditions.

`undelete` is filesystem-aware. On FAT12/16/32, exFAT, NTFS, ext2/3/4 and HFS+, deletion does not erase a file — on FAT it overwrites a single byte of the directory entry and frees the cluster chain. Enough survives to reconstruct the file **with its original name, folder path, size and timestamps**. That only works while the filesystem metadata is intact.

`scan` is signature carving. It ignores the filesystem entirely and looks for the byte patterns that start and end known formats — over 150 of them. It cannot recover names, because names live in metadata that is gone. But it works after a format, or when the partition table has vanished.

The rule of thumb is: reach for `undelete` first, because names and paths are worth a great deal, and fall back to `scan` when there is no metadata left to read. These are the same general techniques behind PhotoRec, foremost, scalpel and testdisk.

## Beyond Single Files

Filesystem type is auto-detected across bare volumes and GPT, MBR, APM and BSD partition tables. Beyond individual file recovery it handles lost-partition detection, bad-sector-tolerant imaging, volume triage across roughly 28 filesystems, and custom carvers you can define at runtime rather than by recompiling.

## Why It Speaks MCP

Recovery is a diagnostic loop: look at the volume, decide which strategy fits, try it, look at what came back. That is a conversation, and it is the shape of work an agent is genuinely good at — provided it can run the commands.

So Unearth exposes its operations over MCP as well as the shell. Every operation is read-only by construction, which is what makes handing the wheel to an agent a reasonable thing to do at all.

---

Source: [github.com/MarcelRoozekrans/Unearth](https://github.com/MarcelRoozekrans/Unearth)
