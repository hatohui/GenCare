using System.Runtime.InteropServices.JavaScript;
using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Application.Helpers;
using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories;

public class ServicesRepository(IApplicationDbContext dbContext): IServicesRepository
{
    public async Task<ViewServiceByPageResponse> SearchServiceAsync(ViewServicesByPageRequest request)
    {
        var query = dbContext.Services
            .Where(s => !s.IsDeleted); // chỉ lấy service chưa xoá

        var totalCount = await query.CountAsync();

        var items = await query
            .OrderBy(s => s.Id)
            .Skip((request.Page - 1) * request.Count)
            .Take(request.Count)
            .Select(s => new ViewServiceByPageResponse.ServicePayload()
            {
                Id = s.Id.ToString(),
                Name = s.Name,
                Description = s.Description ?? "",
                Price = s.Price 
            })
            .ToListAsync();

        return new ViewServiceByPageResponse
        {
            Page = request.Page,
            Count = totalCount,
            Payload = items
        };
    }

    public async Task<ViewSearchWithIdResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request)
    {
        var guidId = Guid.Parse(request.Id);
        
        var service =  await dbContext.Services
            .Where(s => s.Id == guidId)
            .Select(s => new ViewSearchWithIdResponse
            {
                Id = s.Id.ToString(),
                Name = s.Name,
                Description = s.Description ?? "",
                Price = s.Price,
                CreatedAt = s.CreatedAt,
                UpdatedAt = s.UpdatedAt,
                IsDeleted = s.IsDeleted ? "true" : "false"
            })
            .FirstOrDefaultAsync();
        //throw khi service null
        if (service == null)  throw new Exception("Service not found!");
        
        return service;
    }

    public async Task<CreateServiceResponse> CreateServiceAsync(CreateServiceRequest request, string accessToken )
    {
        var accountId = JwtHelper.GetAccountIdFromToken1(accessToken);
        //db tự sinh time nhưng mún lấy h để đồng bộ CreatedAt == UpdatedAt
        Console.WriteLine(accountId);
        var now = DateTime.SpecifyKind(DateTime.Now, DateTimeKind.Unspecified);
        //ng Createdseavice == UpdatedBy
        //CreatedAt == UpdatedAt
        var newService = new Service
        {
            Name = request.Name,
            Description = request.Description ?? "",
            Price = request.Price,
            CreatedBy = accountId,
            UpdatedBy = accountId,
            CreatedAt = now,
            UpdatedAt = now,
        };

        dbContext.Services.Add(newService);
        await dbContext.SaveChangesAsync();

        return new CreateServiceResponse
        {
            Id = newService.Id.ToString(),
            Name = newService.Name,
            Description = newService.Description,
            Price = newService.Price,
            IsDeleted = newService.IsDeleted ? "true" : "false"
        };
    }

    public  Task<bool> ExistsByNameAsync(string name) =>  dbContext.Services
        .AnyAsync(s => s.Name == name && !s.IsDeleted);
    
}