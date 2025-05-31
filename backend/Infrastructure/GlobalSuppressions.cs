// This file is used by Code Analysis to maintain SuppressMessage
// attributes that are applied to this project.
// Project-level suppressions either have no target or are given
// a specific target and scoped to a namespace, type, member, etc.

using System.Diagnostics.CodeAnalysis;

[assembly: SuppressMessage("Async/await", "CRR0030:Redundant 'await'", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Data.Context.GenCareDbContext.SaveChangesAsync~System.Threading.Tasks.Task{System.Int32}")]
[assembly: SuppressMessage("Async/await", "CRR0039:The 'await' expression is missing a cancellation token", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Data.Context.GenCareDbContext.SaveChangesAsync~System.Threading.Tasks.Task{System.Int32}")]
[assembly: SuppressMessage("Critical Code Smell", "S1186:Methods should not be empty", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Data.Context.GenCareDbContext.OnConfiguring(Microsoft.EntityFrameworkCore.DbContextOptionsBuilder)")]
[assembly: SuppressMessage("Async/await", "CRR0039:The 'await' expression is missing a cancellation token", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Repositories.AccountRepository.GetAccountByEmailPasswordAsync(System.String,System.String)~System.Threading.Tasks.Task{Domain.Entities.Account}")]
[assembly: SuppressMessage("Async/await", "CRR0030:Redundant 'await'", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Repositories.AccountRepository.GetByEmailAsync(System.String)~System.Threading.Tasks.Task{Domain.Entities.Account}")]
[assembly: SuppressMessage("Async/await", "CRR0039:The 'await' expression is missing a cancellation token", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Repositories.AccountRepository.GetByEmailAsync(System.String)~System.Threading.Tasks.Task{Domain.Entities.Account}")]
[assembly: SuppressMessage("Async/await", "CRR0039:The 'await' expression is missing a cancellation token", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Repositories.RefreshTokenRepository.AddAsync(Domain.Entities.RefreshToken)~System.Threading.Tasks.Task")]
[assembly: SuppressMessage("Async/await", "CRR0030:Redundant 'await'", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Repositories.RoleRepository.GetRoleByNameAsync(System.String)~System.Threading.Tasks.Task{Domain.Entities.Role}")]
[assembly: SuppressMessage("Async/await", "CRR0039:The 'await' expression is missing a cancellation token", Justification = "<Pending>", Scope = "member", Target = "~M:Infrastructure.Repositories.RoleRepository.GetRoleByNameAsync(System.String)~System.Threading.Tasks.Task{Domain.Entities.Role}")]