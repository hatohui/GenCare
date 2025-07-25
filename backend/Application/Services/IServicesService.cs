﻿using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;

namespace Application.Services;

public interface IServicesService
{
    Task<ViewServiceResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request);

    Task<CreateServiceResponse> CreateServiceAsync(CreateServiceRequest request, string accessToken);

    Task<UpdateServiceResponse> UpdateServiceByIdAsync(UpdateServiceRequest request, string accessToken,Guid serviceId);

    Task<DeleteServiceResponse> DeleteServiceByIdAsync(DeleteServiceRequest request, string accessToken);

    Task<ViewServiceForUserResponse> SearchServiceAsync(ViewServicesByPageRequest request);

    Task<ViewServiceByPageResponse> SearchServiceIncludeDeletedAsync(ViewServiceForStaffRequest request);
}