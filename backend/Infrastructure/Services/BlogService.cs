using System;
using System.Collections.Generic;

using Application.DTOs.Blog.Request;
using Application.DTOs.Blog.Response;
using Application.Repositories;
using Application.Services;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;
public class BlogService(IBlogRepository blogRepository,
       ITagRepository tagRepository,
       IMediaRepository mediaRepository) : IBlogService
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

    public async Task DeleteBlogAsync(string blogId, string accountId)
    {
        //find blog
        var blog = await blogRepository.GetById(blogId);
        if (blog == null)
            throw new AppException(404, "Blog is not found");
        //set deleted info
        blog.IsDeleted = true;
        blog.DeletedBy = Guid.Parse(accountId);
        blog.DeletedAt = DateTime.Now;
        await blogRepository.Update(blog);
    }

    public async Task<List<ListOfBlogResponse>> GetListOfBlogsAsync(ListOfBlogRequest request)
    {
        List<Blog> blogs;

        // Ưu tiên lọc tag trước nếu có
        if (!string.IsNullOrWhiteSpace(request.Tags))
        {
            blogs = await blogRepository.SearchBlogByTag(request.Tags);
        }
        else if (!string.IsNullOrWhiteSpace(request.Search))
        {
            blogs = await blogRepository.SearchBlogsAsync(request.Search);
        }
        else
        {
            blogs = await blogRepository.GetListOfBlogsAsync();
        }
        
        int page = request.Page ?? 1;
        int count = request.Count ?? 10;

        var pagedBlogs = blogs
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * count)
            .Take(count)
            .ToList();

        var responses = new List<ListOfBlogResponse>();

        foreach (var blog in pagedBlogs)
        {
            var tagTitles = await tagRepository.GetTagTitlesByBlogIdAsync(blog.Id);
            var imageUrls = await mediaRepository.GetImageUrlsByBlogIdAsync(blog.Id);

            responses.Add(new ListOfBlogResponse
            {
                Id = blog.Id.ToString(),
                Title = blog.Title,
                Content = blog.Content,
                Author = blog.Author,
                PublishedAt = blog.PublishedAt,
                CreatedAt = blog.CreatedAt,
                CreatedBy = blog.CreatedBy?.ToString(),
                UpdatedAt = blog.UpdatedAt,
                UpdatedBy = blog.UpdatedBy?.ToString(),
                DeletedAt = blog.DeletedAt,
                DeletedBy = blog.DeletedBy?.ToString(),
                IsDeleted = blog.IsDeleted,
                TagTitles = tagTitles,
                ImageUrls = imageUrls
            });
        }

        return responses;
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

    public async Task UpdateBlogAsync(BlogUpdateRequest request, string accountId, string blogId)
    {
        //get blog
        var blog = await blogRepository.GetById(blogId);
        if (blog == null)
        {
            throw new AppException(404, "Blog is not found");
        }
        //update blog
        blog.Title = request.Title ?? blog.Title;
        blog.Content = request.Content ?? blog.Content;
        blog.Author = request.Author ?? blog.Author;
        blog.UpdatedBy = Guid.Parse(accountId);
        blog.UpdatedAt = DateTime.Now;

        //save to db
        await blogRepository.Update(blog);
    }

    
}
