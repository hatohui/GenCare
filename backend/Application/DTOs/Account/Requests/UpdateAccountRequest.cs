namespace Application.DTOs.Account.Requests;

public class UpdateAccountRequest
{
    public AccountUpdateDTO Account { get; set; } = null!;
    public StaffInfoUpdateDTO? StaffInfo { get; set; }
}