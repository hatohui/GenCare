using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class ServicesService(IServicesRepository servicesRepository): IServicesService
{
    public async Task<List<SearchServicesResponse>> SearchServiceAsync(SearchServicesRequest request)
    {
        //call the repository to perform the search operation
        return await servicesRepository.SearchServiceAsync(request);
    }
}