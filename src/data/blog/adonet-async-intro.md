---
title: "AdoNet.Async: Bringing `await foreach` to ADO.NET"
description: "AdoNet.Async adds async-first interfaces and base classes to System.Data — IAsyncEnumerable rows, ValueTask operations, and a drop-in .AsAsync() adapter."
date: 2026-03-22
tags: [".NET", "ADO.NET", "Async", "NuGet", "open source"]
---

ADO.NET has had `ExecuteReaderAsync` since .NET 4.5. But the interfaces — `IDbConnection`, `IDbCommand`, `IDataReader` — are still synchronous. If you want to mock or abstract your database layer, you're stuck returning `Task` from wrapper methods or writing your own interfaces from scratch.

[AdoNet.Async](https://github.com/MarcelRoozekrans/AdoNet.Async) fixes that.

## What It Adds

Three NuGet packages:

**`AdoNet.Async`** — the core async interfaces: `IAsyncDbConnection`, `IAsyncDbCommand`, `IAsyncDataReader`, `IAsyncDataRecord`. Zero dependencies.

**`AdoNet.Async.DataSet`** — async `DataTable`, `DataSet`, `DataAdapter`, plus JSON converters.

**`AdoNet.Async.Adapters`** — adapter wrappers so you can wrap any existing `DbConnection` without changing your provider.

## Drop-In Migration

You don't need to rewrite your provider. Wrap your existing connection with `.AsAsync()`:

```csharp
using System.Data.Async.Adapters;

DbConnection sqlConnection = new SqlConnection(connectionString);
IAsyncDbConnection connection = sqlConnection.AsAsync();

await connection.OpenAsync();
IAsyncDbCommand cmd = connection.CreateCommand();
cmd.CommandText = "SELECT Id, Name FROM Users";
IAsyncDataReader reader = await cmd.ExecuteReaderAsync();
```

## Stream Rows with `await foreach`

`IAsyncDataReader` implements `IAsyncEnumerable<IAsyncDataRecord>`, so you can stream results naturally:

```csharp
await foreach (var row in reader)
{
    Console.WriteLine(row.GetString("Name"));
}
```

No `while (reader.Read())`. No manual disposal loops.

## Why Not Just Use Dapper / EF Core?

If you're already on Dapper or EF Core, you probably don't need this. AdoNet.Async targets codebases that use ADO.NET directly — legacy systems, high-performance query layers, or anything where the ORM overhead isn't acceptable. It makes those codebases testable without pulling in a full ORM.

---

Available on NuGet: [`AdoNet.Async`](https://www.nuget.org/packages/AdoNet.Async) · [`AdoNet.Async.DataSet`](https://www.nuget.org/packages/AdoNet.Async.DataSet) · [`AdoNet.Async.Adapters`](https://www.nuget.org/packages/AdoNet.Async.Adapters)

Source on [GitHub](https://github.com/MarcelRoozekrans/AdoNet.Async)
