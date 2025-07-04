﻿using Domain.Entities;

namespace Application.Repositories;

public interface IMediaRepository
{
    Task AddAsync(Media media);

    Task AddListOfMediaAsync(List<Media> media);

    Task SaveChangesAsync();

    Task<Media?> GetNewestByServiceIdAsync(Guid serviceId);

    Task<List<Media>?> GetAllMediaByServiceIdAsync(Guid serviceId);

    Task DeleteAllByServiceIdAsync(Guid serviceId);
    
    Task<Media?> GetByIdAsync(Guid id);
    Task DeleteAsync(Media media);
    Task<List<string>>GetImageUrlsByBlogIdAsync(Guid blogId);

}