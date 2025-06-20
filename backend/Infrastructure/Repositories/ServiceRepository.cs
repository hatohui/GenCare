using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class ServiceRepository(IApplicationDbContext dbContext) : IServiceRepository
{
    public async Task<List<Service>> SearchServiceAsync(int page, int count, string? name, bool? orderByPrice)
    {
        //choose all services that are not deleted
        var query = dbContext.Services.Where(s => s.IsDeleted != true);

        // validate name and choose services that contain the name
        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(s => s.Name.ToLower().Contains(name.ToLower()));
        }

        //sort by price if orderByPrice is true
        if (orderByPrice.HasValue)
        {
            // Sắp xếp theo giá tăng dần hoặc giảm dần
            query = orderByPrice.Value
                ? query.OrderBy(s => s.Price)
                : query.OrderByDescending(s => s.Price);
        }
        else
        {
            //query to sort by name if orderByPrice is not provided
            query = query.OrderBy(s => s.Name); 
        }
        // Apply pagination
        query = query.Skip((page - 1) * count).Take(count);

        return await query.ToListAsync();
    }

    public async Task<List<Service>?> SearchServiceIncludeDeletedAsync(int page, int count, string? name, bool? orderByPrice ,bool? includeDeleted ,bool? sortByUpdateAt)
    {
        var query = dbContext.Services.AsQueryable();

        // Filter by name if provided
        if (!string.IsNullOrWhiteSpace(name))
        {
            query = query.Where(s => s.Name.Contains(name.ToLower()));
        }

        // Filter by deleted status
        if (includeDeleted.HasValue)
        {
            if (includeDeleted.Value)
            {
                // Include only deleted services
                query = query.Where(s => s.IsDeleted == true);
            }
            else
            {
                // Include only non-deleted services  
                query = query.Where(s => s.IsDeleted == false || s.IsDeleted == null);
            }
        }
        // If includeDeleted is null, include both deleted and non-deleted services

        // Apply sorting
        if (sortByUpdateAt.HasValue && sortByUpdateAt.Value)
        {
            query = query.OrderByDescending(s => s.UpdatedAt);
        }
        else if (orderByPrice.HasValue && orderByPrice.Value)
        {
            query = query.OrderBy(s => s.Price);
        }
        else
        {
            // Default sorting by CreatedAt
            query = query.OrderByDescending(s => s.Price);
        }

        // Apply pagination
        return await query
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
            .ExecuteUpdateAsync(s => s.SetProperty(x => x.IsDeleted, true));

        return affectedRows > 0;
    }
}