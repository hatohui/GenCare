using Application.Repositories;
using Domain.Abstractions;
using Domain.Entities;

namespace Infrastructure.Repositories;

public class MediaRepository(IApplicationDbContext dbContext) : IMediaRepository
{
    public async Task AddAsync(Media newMedia)
    {
        await dbContext.Media.AddAsync(new Domain.Entities.Media
        {
            Url = newMedia.Url,
        });
    }

    public async Task AddListOfMediaAsync(List<Media> media)
    {
        await dbContext.Media.AddRangeAsync(media);
        await dbContext.SaveChangesAsync();
    }

    public async Task SaveChangesAsync() => await dbContext.SaveChangesAsync();

    public async Task<Media?> GetNewestByServiceIdAsync(Guid serviceId)
    {
        return await dbContext.Media
             .Where(m => Guid.Equals(m.Url, serviceId))
             .OrderByDescending(m => m.CreatedAt)
             .FirstOrDefaultAsync();
    }

    public async Task<List<Media>?> GetAllMediaByServiceIdAsync(Guid serviceId)
    {
        return await dbContext.Media.Where(m => m.ServiceId == serviceId).OrderByDescending(m => m.CreatedAt).ToListAsync();
    }

    public async Task DeleteAllByServiceIdAsync(Guid serviceId)
    {
        var medias = await dbContext.Media
            .Where(m => m.ServiceId == serviceId)
            .ToListAsync();

        if (medias.Any())
        {
            dbContext.Media.RemoveRange(medias);
            await dbContext.SaveChangesAsync();
        }
    }

    public async Task<Media?> GetByIdAsync(Guid id)
    {
        return await dbContext.Media.FindAsync(id);
    }

    public async Task DeleteAsync(Media media)
    {
        dbContext.Media.Remove(media);
        await dbContext.SaveChangesAsync();
    }
}