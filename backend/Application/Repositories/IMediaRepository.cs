using Domain.Entities;

namespace Application.Repositories;

public interface IMediaRepository
{
    Task AddAsync(Media media);
    Task AddAsync1(List<Media> media);
    Task SaveChangesAsync();
    Task<Media?> GetNewestByServiceIdAsync(Guid serviceId);
    Task<List<Media>?> GetAllMediaByServiceIdAsync(Guid serviceId);
    Task DeleteAllByServiceIdAsync(Guid serviceId);
}