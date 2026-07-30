---
title: "BlazorNative: Blazor Without the WebView"
description: "Rendering Blazor components as real native iOS and Android widgets through NativeAOT — no WebView, no JavaScript bridge, Yoga for layout."
date: 2026-07-19
tags: [".NET", "Blazor", "Mobile", "Native AOT", "open source"]
---

The usual way to get Blazor onto a phone is to put a WebView there. It works, and it always feels like it. Scrolling is not quite right, the keyboard behaves oddly, and the whole thing carries the weight of a browser engine to render a list.

[BlazorNative](https://github.com/MarcelRoozekrans/BlazorNative) takes the other route: keep the component model, drop the browser.

## How It Works

Blazor's renderer is an abstraction. The component tree, the diffing, the lifecycle — none of it inherently requires HTML. What it requires is something to apply the diff to.

BlazorNative supplies a renderer that applies it to native platform widgets instead of DOM nodes. A component tree becomes real UIKit and Android views, compiled through NativeAOT. There is no WebView, and there is no JavaScript interop bridge in the middle, which removes both the memory overhead and the marshalling cost per interaction.

Layout is handled by Yoga, the same flexbox engine React Native uses. That is what keeps the two platforms honest — flexbox semantics behave the same on iOS and Android, so a layout is not something you tune twice.

## Package Layout

The surface is split so an app takes only the parts it uses: the renderer and core, the component library, device APIs, HTTP, analyzers, and `dotnet new` templates to get a project started.

## Where It Is

BlazorNative is early — the current release is 0.8.0 and the API is still moving. It is worth a look if you write Blazor and have ever been unsatisfied with the WebView answer, and worth waiting on if you need a stable API today.

One naming note: the packages are `BlazorNative.Core`, `BlazorNative.Renderer` and so on. The bare `BlazorNative` package on NuGet belongs to an unrelated project.

---

Documentation: [marcelroozekrans.github.io/BlazorNative](https://marcelroozekrans.github.io/BlazorNative/) · Source: [github.com/MarcelRoozekrans/BlazorNative](https://github.com/MarcelRoozekrans/BlazorNative)
