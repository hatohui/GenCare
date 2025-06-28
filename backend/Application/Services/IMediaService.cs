using Application.DTOs;

namespace Application.Services;

public interface IMediaService

{
    Task<DeleteMediaResponse> DeleteMediaAsync(Guid id);
}