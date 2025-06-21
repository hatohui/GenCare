using Application.DTOs.Tag.Request;
using Application.DTOs.Tag.Response;

namespace Application.Services;

public interface ITagService
{
    Task<CreateTagResponse> CreateTagAsync(CreateTagRequest request);
    Task<UpdateTagResponse> UpdateTagAsync(UpdateTagRequest request);
}