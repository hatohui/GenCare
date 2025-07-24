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
                       IMediaRepository mediaRepository,
                       ICommentRepository commentRepository) : IBlogService
{
    public async Task AddBlogAsync(BlogCreateRequest request, string accountId)
    {
        //process tag
        List<Tag> tags = new(); //mảng để xíu tạo blog tag
        //get tag list from tag title list in request
        if (request.TagTitle != null && request.TagTitle.Count > 0)
        {
            foreach (var tagTitle in request.TagTitle)
            {
                var tmp = await tagRepository.GetByTitle(tagTitle);
                //nếu không tồn tại thì tạo mới tag
                if(tmp is null)
                {
                    tmp = new()
                    {
                        Title = tagTitle.Trim(),
                    };
                    tags.Add(tmp);
                }
                else
                //tồn tại r thì thêm vào mảng
                {
                    tags.Add(tmp);
                }
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

    public async Task<List<ModelOfBlogResponse>> GetListOfBlogsAsync(ListOfBlogRequest request)
    {
        List<Blog> blogs;
        //check if request has tags or search query
        if (!string.IsNullOrWhiteSpace(request.Tags))
        {
            blogs = await blogRepository.SearchBlogByTag(request.Tags);
        }
        // check if request has search query search
        else if (!string.IsNullOrWhiteSpace(request.Search))
        {
            blogs = await blogRepository.SearchBlogsAsync(request.Search);
        }
        //if no tags or search query, get all blogs
        else
        {
            blogs = await blogRepository.GetListOfBlogsAsync();
        }
        //if pagination is not provided, default to page 1 and count 10
        int page = request.Page ?? 1;
        int count = request.Count ?? 10;
        //pagination logic
        var pagedBlogs = blogs
            .OrderByDescending(b => b.CreatedAt)
            .Skip((page - 1) * count)
            .Take(count)
            .ToList();

        var responses = new List<ModelOfBlogResponse>();

        foreach (var blog in pagedBlogs)
        {
            var tagTitles = await tagRepository.GetTagTitlesByBlogIdAsync(blog.Id);
            var imageUrls = await mediaRepository.GetImageUrlsByBlogIdAsync(blog.Id);
            var likes = await commentRepository.GetLikesCountByBlogIdAsync(blog.Id);
            var comments = await commentRepository.GetCommentsCountByBlogIdAsync(blog.Id);
            responses.Add(new ModelOfBlogResponse
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
                TagTitles = tagTitles!,
                ImageUrls = imageUrls,
                Comments = comments,
                Likes = likes
            });
        }

        return responses;
    }

    public async Task<ModelOfBlogResponse> GetBlogByIdAsync(string blogId)
    {
        //get blog by id
        var blog = await blogRepository.GetById(blogId);
        if (blog == null)
        {
            throw new AppException(404, "Blog is not found");
        }

        //get tag titles by blog id
        var tagTitles = await tagRepository.GetTagTitlesByBlogIdAsync(blog.Id);
        //get image urls by blog id
        var imageUrls = await mediaRepository.GetImageUrlsByBlogIdAsync(blog.Id);
        var likes = await commentRepository.GetLikesCountByBlogIdAsync(blog.Id);
        var comments = await commentRepository.GetCommentsCountByBlogIdAsync(blog.Id);
        return new ModelOfBlogResponse()
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
            IsDeleted = blog.IsDeleted,
            TagTitles = tagTitles,
            ImageUrls = imageUrls,
            Likes = likes,
            Comments = comments
            
        };
    }

    public async Task LikeBlogAsync(Guid id, string accountId)
    {
        //get comment by id
        var blog = await blogRepository.GetById(id.ToString("D"));
        if (blog is null)
        {
            throw new AppException(404, "Comment not found");
        }
        //check if account already liked this comment
        if (blog.Likes > 0)
        {
            throw new AppException(400, "You have already liked this comment");
        }
        //like comment
        blog.Likes++;
        await blogRepository.Update(blog);
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
