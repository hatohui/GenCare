using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;

namespace Application.Services;

public interface IServicesService
{
    Task<ViewServiceByPageResponse> SearchServiceAsync(ViewServicesByPageRequest request);
    Task<ViewServiceResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request);
    Task<CreateServiceResponse> CreateServiceAsync(CreateServiceRequest request, string accessToken);
    Task<UpdateServiceResponse> UpdateServiceByIdAsync(UpdateServiceRequest request, string accessToken);
    Task<DeleteServiceResponse> DeleteServiceByIdAsync(DeleteServiceRequest request, string accessToken);
}