namespace Application.DTOs.Tag.Response;

public class ViewAllTagResponse
{
    public int Count { get; set; }
    public List<TagPayLoad> TagPayLoads { get; set; }
}