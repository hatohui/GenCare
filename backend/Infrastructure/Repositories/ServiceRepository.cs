using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class ServiceRepository(IApplicationDbContext dbContext) : IServiceRepository
{
    public async Task<(List<Service> services, int totalCount)> SearchServiceAsync(int page, int count, string? name, bool? orderByPrice,bool? sortByAlphabetical)
    {
        // Choose all services that are not deleted
        var query = dbContext.Services.Where(s => s.IsDeleted != true);

        // Validate name and choose services that contain the name
        if (!string.IsNullOrEmpty(name))
        {
            query = query.Where(s => s.Name.ToLower().Contains(name.ToLower()));
        }

        // Apply sorting 
        if (sortByAlphabetical.HasValue && sortByAlphabetical.Value)
        {
            // Sort by alphabetical order if sortByAlphabetical is true
            query = query.OrderBy(s => s.Name);
        }
        else if (orderByPrice.HasValue)
        {
            // Sort by price if orderByPrice is provided
            query = orderByPrice.Value
                ? query.OrderBy(s => s.Price)
                : query.OrderByDescending(s => s.Price);
        }
        else
        {
            // Default sorting by new service if no other sorting is specified
            query = query.OrderByDescending(s => s.Id);
        }
       

        // Apply pagination
        var totalCount = await query.CountAsync();
        var services = await query.Skip((page - 1) * count)
            .Take(count)
            .ToListAsync();

        return (services, totalCount);
    }

    public async Task<(List<Service>? services, int totalCount)> SearchServiceIncludeDeletedAsync(int page, int count, string? name, bool? orderByPrice ,bool? includeDeleted ,bool? sortByUpdateAt,bool? sortByAlphabetical)
    {
        var query = dbContext.Services.AsQueryable();

        // Filter by name if provided
        if (!string.IsNullOrWhiteSpace(name))
        {
            query = query.Where(s => s.Name.ToLower().Contains(name.ToLower()));
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
        else if (sortByAlphabetical.HasValue && sortByAlphabetical.Value)
        {
            query = query.OrderBy(s => s.Name);
        }
        else if (orderByPrice.HasValue)
        {
            query = orderByPrice.Value
                ? query.OrderBy(s => s.Price)
                : query.OrderByDescending(s => s.Price);
        }
        
        else
        {
            // Default sorting by CreatedAt
            query = query.OrderByDescending(s => s.Id); 
        }
        //total count of services match search criteria
        var totalCount = await query.CountAsync();


        // Apply pagination
        var services = await query
            .Skip((page - 1) * count)
            .Take(count)
            .ToListAsync();
        return (services, totalCount);
    }

    public async Task<int> CountServicesAsync()
    {
        return await dbContext.Services
            .CountAsync(s => !s.IsDeleted);
    }

    public async Task<List<Service>> GetByIdsAsync(List<Guid> ids)
      => await dbContext.Services
            .Where(s => ids.Contains(s.Id) && !s.IsDeleted)
            .ToListAsync();

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

    public async Task<List<Service>> GetAll()
    {
        return await dbContext.Services
            .ToListAsync();
    }
}