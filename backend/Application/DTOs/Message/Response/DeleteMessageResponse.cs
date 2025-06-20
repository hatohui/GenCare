namespace Application.DTOs.Message.Response;

public class DeleteMessageResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
}