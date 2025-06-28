using Application.DTOs;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class MediaService(IMediaRepository mediaRepository) : IMediaService
{
    public async Task<DeleteMediaResponse> DeleteMediaAsync(Guid id)
    {
        var media = await mediaRepository.GetByIdAsync(id);
        if (media == null)
        {
            return new DeleteMediaResponse
            {
                Success = false,
                Message = "Media not found"
            };
        }

        await mediaRepository.DeleteAsync(media); // XÓA HẲN

        return new DeleteMediaResponse
        {
            Success = true,
            Message = "Media deleted successfully"
        };
    }
}