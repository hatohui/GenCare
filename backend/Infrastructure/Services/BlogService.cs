using System;
using System.Collections.Generic;

using Application.DTOs.Blog.Request;
using Application.DTOs.Blog.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;
public class BlogService(IBlogRepository blogRepository,
       ITagRepository tagRepository) : IBlogService
{
    public async Task AddBlogAsync(BlogCreateRequest request, string accountId)
    {
        //process tag
        List<Tag> tags = new();
        //get tag list from tag id list in request
        if (request.TagId != null && request.TagId.Count > 0)
        {
            foreach (var tagId in request.TagId)
            {
                var tmp = await tagRepository.GetById(tagId);
                if(tmp != null) tags.Add(tmp);
            }
        }
        //process media
        List<Media> medias = new();
        //create media list from media url list in request
        if (request.MediaUrl != null && request.MediaUrl.Count > 0)
        {
            foreach (var mediaUrl in request.MediaUrl)
            {
                medias.Add(new Media()
                {
                    Url = mediaUrl,
                    CreatedBy = Guid.Parse(accountId),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                    //Blog = blog
                });
            }
        }
        //create blog tag list from tag list and blog
        List<BlogTag> blogTags = new();

        if (tags != null && tags.Count > 0)
        {
            foreach (var tag in tags)
            {
                blogTags.Add(new BlogTag()
                {
                    //Blog = blog,
                    Tag = tag,
                    CreatedBy = Guid.Parse(accountId),
                    CreatedAt = DateTime.Now,
                    UpdatedAt = DateTime.Now,
                });
            }
        }

        //process blog
        var blog = new Blog()
        {
            Title = request.Title,
            Content = request.Content,
            Author = request.Author,
            CreatedBy = Guid.Parse(accountId),
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now,
            BlogTags = blogTags,
            Media = medias
        };
        ////add blog to media list
        //foreach (var media in medias)
        //{
        //    media.Blog = blog;
        //}

        //await blogTagRepository.AddRange(blogTags);
        //await mediaRepository.AddListOfMediaAsync(medias);
        await blogRepository.Add(blog);
    }

    public async Task<List<AllBlogViewResponse>> GetAllBlogsAsync()
    {
        var list = await blogRepository.GetAll();
        List<AllBlogViewResponse> rs = new();
        foreach (var blog in list)
        {
            rs.Add(new AllBlogViewResponse()
            {
                Id = blog.Id.ToString("D"),
                Title = blog.Title,
                Content = blog.Content,
                Author = blog.Author,
                CreatedAt = blog.CreatedAt,
                PublishedAt = blog.PublishedAt,
                CreatedBy = blog.CreatedBy?.ToString("D"),
                UpdatedAt = blog.UpdatedAt,
                UpdatedBy = blog.UpdatedBy?.ToString("D"),
                DeletedAt = blog.DeletedAt,
                DeletedBy = blog.DeletedBy?.ToString("D"),
                IsDeleted = blog.IsDeleted
            });
        }
        return rs;
    }
}
