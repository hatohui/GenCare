using Domain.Entities;

namespace Application.Repositories;

public interface IPurchaseRepository
{
    Task AddAsync(Purchase purchase);
}