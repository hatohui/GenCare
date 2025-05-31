using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;

namespace Application.Repositories;

public interface  IServicesRepository
{
    Task<List<SearchServicesResponse>> SearchServiceAsync(SearchServicesRequest request);
}