using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class AccountService(IAccountRepository authRepo) : IAccountService
{
}