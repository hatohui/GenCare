namespace Application.DTOs.Account.Responses;

public class DeleteAccountResponse
{
    public Guid Id { get; set; }
    public string Email { get; set; } = null!;
    public DateTime DeletedAt { get; set; }
    public string DeletedBy { get; set; } = null!;
    public bool IsDeleted { get; set; }

}