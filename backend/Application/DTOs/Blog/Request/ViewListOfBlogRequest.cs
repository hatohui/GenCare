namespace Application.DTOs.Blog.Request;

public class ViewListOfBlogRequest
{
    public int? Page { get; set; }
    public int? Count { get; set; }
    public string? Tags { get; set; }
    public string? Search { get; set; }

}