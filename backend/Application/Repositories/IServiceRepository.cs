using Domain.Entities;

namespace Application.Repositories;

public interface IServiceRepository
{
    Task<List<Service>> SearchServiceAsync(int page, int count);

    Task<Service?> SearchServiceByIdAsync(Guid idService);

    Task<Service> AddServiceAsync(Service newService);

    Task<bool> UpdateServiceByIdAsync(Service service);

    Task<bool> ExistsByNameAsync(string name);

    Task<bool> ExistsByIdAsync(Guid idService);

    public Task<Service?> SearchServiceByIdForStaffAsync(Guid idService);

    Task<bool> DeleteServiceByIdAsync(Guid idService);
    Task<List<Service?>>SearchServiceIncludeDeletedAsync(int page, int count);
    Task<int> CountServicesIncludeDeletedAsync();
    Task<int> CountServicesAsync();
}