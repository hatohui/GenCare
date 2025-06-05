using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;

namespace Application.Services;

public interface IServicesService
{
    Task<ViewServiceByPageResponse> SearchServiceAsync(ViewServicesByPageRequest request);
    Task<ViewSearchWithIdResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request);
    Task<CreateServiceResponse> CreateServiceAsync(CreateServiceRequest request, string accessToken);
    Task<UpdateServiceByIdResponse> UpdateServiceByIdAsync(UpdateServiceByIdRequest request, string accessToken);
    Task<DeleteServiceByIdResponse> DeleteServiceByIdAsync(DeleteServiceByIdRequest request, string accessToken);
}