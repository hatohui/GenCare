using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Domain.Entities;

namespace Application.Repositories;

public interface  IServiceRepository
{
    Task<List<Service>> SearchServiceAsync(int page,int count);
    Task<Service?> SearchServiceByIdAsync(Guid idService);
    Task<Service> AddServiceAsync(Service newService);
    Task <bool> UpdateServiceByIdAsync(Service service);
    Task<bool> ExistsByNameAsync(string name);
    Task<bool> ExistsByIdAsync(Guid idService);
    public Task<Service?> SearchServiceByIdForStaffAsync(Guid idService);
    Task<bool> DeleteServiceByIdAsync(Guid idService);
}