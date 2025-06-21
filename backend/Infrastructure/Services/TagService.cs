using Application.DTOs.Tag.Request;
using Application.DTOs.Tag.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;

public class TagService(ITagRepository tagRepository) : ITagService
{
    public async Task<CreateTagResponse> CreateTagAsync(CreateTagRequest request)
    {
        // Check if the tag name already exists
        var exists = await tagRepository.CheckNameTagExists(request.Tittle);
        if (exists)
        {
            return new CreateTagResponse
            {
                Success = false,
                Message = "Tag name already exists."
            };
        }

        // Add the new tag
        var tag = new Tag()
        {
            Title = request.Tittle,
        };

        await tagRepository.Add(tag);

        return new CreateTagResponse
        {
            Success = true,
            Message = "Tag created successfully."
        };
    }

    public async Task<UpdateTagResponse> UpdateTagAsync(UpdateTagRequest request)
    {
        //check tag is exist
        var tag = await tagRepository.GetById(request.TagId);
        //check if tag name exist 
        await tagRepository.CheckNameTagExists(request.Title!);
        if (tag == null)
        {
            return new UpdateTagResponse
            {
                Success = false,
                Message = "Tag not found."
            };
        }

        if (!string.IsNullOrWhiteSpace(request.Title) && request.Title != tag.Title)
        {
            if (await tagRepository.CheckNameTagExists(request.Title!))
            {
                return new UpdateTagResponse
                {
                    Success = false,
                    Message = "Tag name already exists."
                };
            }

            tag.Title = request.Title;
        }
        //update new title tag
        await tagRepository.Update(tag);
        return new UpdateTagResponse
        {
            Success = true,
            Message = "Tag updated successfully."
        };
    }
}