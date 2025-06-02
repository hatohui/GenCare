using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class ServicesService(IServicesRepository servicesRepository) : IServicesService
{
    public async Task<ViewServiceByPageResponse> SearchServiceAsync(ViewServicesByPageRequest request)
    {
        //call the repository to perform the search operation
        return await servicesRepository.SearchServiceAsync(request);
    }

    public async Task<ViewSearchWithIdResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request)
    {
        // Validate Id là Guid hợp lệ
        if (!Guid.TryParse(request.Id, out var guidId))
            throw new ArgumentException("Invalid id format.");

        // Gọi repository để lấy dữ liệu
        var service = await servicesRepository.SearchServiceByIdAsync(request);

        // Nếu không tìm thấy thì throw exception hoặc trả về null (tùy bạn muốn xử lý 404 ở đâu)
        if (service == null)
            throw new KeyNotFoundException("Service not found.");

        return service;
    }

    public async Task<CreateServiceResponse> CreateServiceAsync(CreateServiceRequest request, string accessToken)
    {
        var role = JwtHelper.GetRoleFromToken(accessToken);

        if (role != "admin" && role != "staff")
        {
            throw new UnauthorizedAccessException();
        }

        if (string.IsNullOrWhiteSpace(request.Name)) throw new ArgumentException("Service name cannot be empty.");


        // Kiểm tra trùng tên dịch vụ (chỉ check các dịch vụ chưa bị xoá)
        if (await servicesRepository.ExistsByNameAsync(request.Name))
            throw new InvalidOperationException("Service name already exists.");


        // giá không được âm
        if (request.Price < 0) throw new ArgumentException("Service price cannot be negative.");


        // Nếu qua hết validate thì tạo mới
        return await servicesRepository.CreateServiceAsync(request, accessToken);
    }
}