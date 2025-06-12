using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class ServiceRepository(IApplicationDbContext dbContext) : IServiceRepository
{
    public async Task<List<Service>> SearchServiceAsync(int page, int count, string? name,bool? orderByPrice, bool? includeDeleted)
    {
        var query = dbContext.Services.AsQueryable();

        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(s => s.Name.Contains(name) || s.Name.Contains(name));
        }

        if (includeDeleted.HasValue)
        {
            if (!includeDeleted.Value)
                query = query.Where(s => !s.IsDeleted);
            // if true, include all
        }

        if (orderByPrice.HasValue)
        {
            query = orderByPrice.Value
                ? query.OrderBy(s => s.Price)
                : query.OrderByDescending(s => s.Price);
        }

        query = query.Skip((page - 1) * count).Take(count);

        return await query.ToListAsync();

    }
    public async Task<List<Service>>? SearchServiceIncludeDeletedAsync(int page, int count)
    {
        return await dbContext.Services
            .OrderByDescending(s => s.CreatedAt)
            .Skip((page - 1) * count)
            .Take(count)
            .ToListAsync();
    }
    public async Task<int> CountServicesAsync()
    {
        return await dbContext.Services
            .CountAsync(s => !s.IsDeleted);
    }
    public async Task<int> CountServicesIncludeDeletedAsync()
    {
        return await dbContext.Services
            .CountAsync();
    }

    public async Task<Service?> SearchServiceByIdAsync(Guid idService)
    {
        return await dbContext.Services
            .FirstOrDefaultAsync(s => s.Id == idService && !s.IsDeleted);
    }

    public async Task<Service?> SearchServiceByIdForStaffAsync(Guid idService)
    {
        return await dbContext.Services
            .FirstOrDefaultAsync(s => s.Id == idService);
    }

    public async Task<Service> AddServiceAsync(Service service)
    {
        await dbContext.Services.AddAsync(service);
        await dbContext.SaveChangesAsync();
        return service;
    }

    public async Task<bool> UpdateServiceByIdAsync(Service service)
    {
        var affectedRows = await dbContext.Services
            .Where(s => s.Id == service.Id)
            .ExecuteUpdateAsync(setters => setters
                .SetProperty(e => e.Name, service.Name)
                .SetProperty(e => e.Description, service.Description)
                .SetProperty(e => e.Price, service.Price)
                .SetProperty(e => e.UpdatedBy, service.UpdatedBy)
                .SetProperty(e => e.IsDeleted, service.IsDeleted)
            );
        return affectedRows > 0;
    }

    public async Task<bool> ExistsByNameAsync(string name)
    {
        return await dbContext.Services
            .AnyAsync(s => s.Name == name && !s.IsDeleted);
    }

    public async Task<bool> ExistsByIdAsync(Guid idService)
    {
        return await dbContext.Services
            .AnyAsync(s => s.Id == idService && !s.IsDeleted);
    }

    public async Task<bool> DeleteServiceByIdAsync(Guid idService)
    {
        var affectedRows = await dbContext.Services
            .Where(s => s.Id == idService && !s.IsDeleted)
            .ExecuteDeleteAsync();

        return affectedRows > 0;
    }
}