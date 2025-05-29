using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
public interface IRefreshTokenRepository
{
    Task<RefreshToken?> GetRefreshTokenByAccountIdAsync(Guid accountId);
    Task<RefreshToken?> GetRefreshTokenByTokenAsync(string token);
    Task AddAsync(RefreshToken refreshToken);
}
