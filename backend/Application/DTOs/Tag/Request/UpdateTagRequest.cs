namespace Application.DTOs.Tag.Request;

public class UpdateTagRequest

{
    public Guid TagId { get; set; }
    public string? Title { get; set; }
}