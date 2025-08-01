﻿namespace Application.DTOs.Blog.Response;

public class ModelOfBlogResponse
{
    public string Id { get; set; } = null!;
    public string Title { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string Author { get; set; } = null!;
    public DateTime? PublishedAt { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
    public DateTime? DeletedAt { get; set; }
    public string? DeletedBy { get; set; }
    public bool IsDeleted { get; set; }
    public int Likes { get; set; }
    public int Comments { get; set;}
    public List<string> TagTitles { get; set; } = new List<string>();
    public List<string> ImageUrls { get; set; } = new List<string>();
}