using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;

namespace Application.Services;

public interface IServicesService
{
    Task<List<SearchServicesResponse>> SearchServiceAsync(SearchServicesRequest request);
}