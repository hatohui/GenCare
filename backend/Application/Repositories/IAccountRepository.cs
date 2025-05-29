using Domain.Entities;

namespace Application.Repositories;

public interface IAccountRepository
{
 Task<Account?> GetAccountByEmailPasswordAsync(string email, string password);

}