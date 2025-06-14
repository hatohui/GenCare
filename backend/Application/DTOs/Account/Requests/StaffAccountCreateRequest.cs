namespace Application.DTOs.Account.Requests;

public class StaffAccountCreateRequest
{
    public StaffAccountCreateModel AccountRequest { get; set; } = null!;
    public StaffInfoCreateModel StaffInfoRequest { get; set; } = null!;
}