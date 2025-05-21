﻿// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Async/await", "CRR0029:ConfigureAwait(true) is called implicitly", Justification = "<Pending>")]
[assembly: SuppressMessage("Async/await", "CRR0039:The 'await' expression is missing a cancellation token", Justification = "<Pending>", Scope = "member", Target = "~M:API.Middlewares.RateLimitMiddleware.InvokeAsync(Microsoft.AspNetCore.Http.HttpContext,Microsoft.AspNetCore.Http.RequestDelegate)~System.Threading.Tasks.Task")]

