---
title: "BlazorNative"
description: "Blazor components rendered as native mobile widgets via NativeAOT — no WebView, no JavaScript bridge."
tags: [".NET", "Blazor", "Mobile", "Native AOT"]
github: "https://github.com/MarcelRoozekrans/BlazorNative"
nuget: "https://www.nuget.org/packages/BlazorNative.Core"
docs: "https://marcelroozekrans.github.io/BlazorNative/"
featured: false
order: 8
packages: 8
---

Write your UI once as Blazor components and render it as genuine native widgets on iOS and Android — no WebView, no JavaScript interop bridge. The renderer maps the Blazor component tree onto platform controls through NativeAOT, with Yoga handling layout so flexbox semantics behave the same on both platforms.

Split across focused packages — renderer, components, device APIs, HTTP, analyzers, and project templates — so a mobile app pulls in only the surface it uses.
