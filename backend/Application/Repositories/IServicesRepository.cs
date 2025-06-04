using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;

namespace Application.Repositories;

public interface  IServicesRepository
{
    Task<ViewServiceByPageResponse> SearchServiceAsync(ViewServicesByPageRequest request);
    Task<ViewSearchWithIdResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request);
    Task<CreateServiceResponse> CreateServiceAsync(CreateServiceRequest request , string accessToken);
    Task<bool> ExistsByNameAsync(string name);
}