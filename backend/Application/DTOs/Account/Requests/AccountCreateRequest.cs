namespace Application.DTOs.Account.Requests;

public class AccountCreateRequest
{
    public AccountCreateModel AccountRequest { get; set; } = null!;
    public StaffInfoCreateModel? StaffInfoRequest { get; set; }
}