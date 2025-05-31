using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Repositories;
using Domain.Abstractions;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ServicesRepository(IApplicationDbContext dbContext): IServicesRepository
{
    public async Task<List<SearchServicesResponse>> SearchServiceAsync(SearchServicesRequest request)
    {
        var query = dbContext.Services.AsQueryable();

        if (!string.IsNullOrEmpty(request.Name))
        {
            query = query.Where(s => s.Name.Contains(request.Name));
        }
        if (request.Price.HasValue)
        {
            query = query.Where(s => s.Price == request.Price.Value);
        }

        var result = await query
            .Select(s => new SearchServicesResponse
            {
                Name = s.Name,
                Description = s.Description,
                Price = s.Price
            })
            .ToListAsync();

        return result;
    }
}