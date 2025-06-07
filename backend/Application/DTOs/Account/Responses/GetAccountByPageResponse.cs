namespace Application.DTOs.Account.Responses;

public class GetAccountByPageResponse
{
    public List<AccountViewModel> Accounts { get; set; } = [];
    public int TotalCount { get; set; }
}