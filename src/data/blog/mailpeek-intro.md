---
title: "MailPeek: Stop Sending Test Emails to Real People"
description: "MailPeek is an in-memory fake SMTP server with a real-time web dashboard for ASP.NET Core. Capture every email your app sends during development."
date: 2026-03-10
tags: [".NET", "ASP.NET Core", "Testing", "Developer Tools", "open source"]
---

You know that sinking feeling when you realise the "welcome" email your app just sent went to a real customer because someone left a production SMTP connection string in `.env.local`? MailPeek exists to make that impossible.

[MailPeek](https://github.com/MarcelRoozekrans/MailPeek) is an in-memory fake SMTP server for ASP.NET Core. Your app thinks it's sending email. MailPeek catches every message and shows it in a real-time web dashboard — subject, body, headers, attachments, the works. Nothing leaves your machine.

## Setup

```bash
dotnet add package MailPeek
```

```csharp
// Program.cs
builder.Services.AddMailPeek();

app.UseMailPeek(); // serves dashboard at /mailpeek
```

That's it. MailPeek registers a fake `ISmtpClient` and intercepts any email sent through it. The dashboard auto-updates over SignalR — no polling, no refresh.

## Works with .NET Aspire

If you're using [.NET Aspire](https://learn.microsoft.com/en-us/dotnet/aspire/), MailPeek integrates with service discovery out of the box. Add it to your AppHost and it shows up alongside your other services in the dashboard.

## Why Not Just Log Emails?

Logging gives you text. MailPeek gives you a rendered preview of exactly what your users would see — HTML body, plain-text fallback, MIME structure. Useful when you're debugging template rendering or multipart encoding.

---

Available on [NuGet](https://www.nuget.org/packages/MailPeek) · Source on [GitHub](https://github.com/MarcelRoozekrans/MailPeek)
