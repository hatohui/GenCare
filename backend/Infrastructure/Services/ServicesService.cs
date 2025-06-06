
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class ServicesService(
    IServiceRepository serviceRepository,
    IMediaRepository mediaRepository
) : IServicesService
{
    public async Task<ViewServiceByPageResponse> SearchServiceAsync(ViewServicesByPageRequest request)
    {
        if (request.Page <= 0 || request.Count <= 0)
            throw new AppException(400, "Page and Count must be greater than zero.");

        var services = await serviceRepository.SearchServiceAsync(request.Page, request.Count);
        var response = new ViewServiceByPageResponse
        {
            response.Payload.Add(new ServicePayLoad()
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description ?? "",
                Price = s.Price,
                ImageUrl = image?.Url ?? string.Empty
            });
        }

        return response;
    }

    public async Task<ViewServiceResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request)
    {
        // Validate Id là Guid hợp lệ
        if (!Guid.TryParse(request.Id, out var guidId))
            throw new AppException(400,"Invalid id format.");

        // Gọi repository để lấy dữ liệu
        var service = await serviceRepository.SearchServiceByIdForStaffAsync(guidId);

        // Nếu không tìm thấy thì throw exception hoặc trả về null 
        if (service == null)
            throw new AppException(404,"Service not found.");
        var mediaService = await mediaRepository.GetAllMediaByServiceIdAsync(service.Id);
        
        var imUrls = mediaService?.Select(m  =>m.Url).ToList();         
        return new ViewServiceResponse()
        {
            Id = service.Id.ToString(),
            Name = service.Name,
            Description = service.Description ?? "",
            Price = service.Price,
            ImageUrls = imUrls,
            CreatedAt = service.CreatedAt,
            
        };
    }

    public async Task<CreateServiceResponse> CreateServiceAsync(CreateServiceRequest request, string accessToken)
    {
        var role = JwtHelper.GetRoleFromToken(accessToken);
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);

        // Validate quyền
        if (role != RoleNames.Admin && role != RoleNames.Admin)
            throw new UnauthorizedAccessException();
        // Validate not null
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new AppException(400,"Service name cannot be empty.");
        //check exists
        if (await serviceRepository.ExistsByNameAsync(request.Name))
            throw new AppException(400,"Service name already exists.");
        //price is not negative
        if (request.Price < 0)
            throw new AppException(400,"Service price cannot be negative.");
        Media? media = null;
        if (!string.IsNullOrWhiteSpace(request.UrlImage))
        {
            media = new Media()
            {
                Url = request.UrlImage,
                CreatedBy = accountId,
                UpdatedBy = accountId
            };
        }

        var service = new Service()
        {
            Name = request.Name,
            Description = request.Description,
            Price = request.Price,
            CreatedBy = accountId,
            Media = media is not null ? new List<Media> { media } : new List<Media>()
        };
        await serviceRepository.AddServiceAsync(service);
        return new CreateServiceResponse()
        {
            Id = service.Id.ToString(),
            Name = service.Name,
            Description = service.Description ?? "",
            Price = service.Price,
            UrlImage = media?.Url ?? "",
            IsDeleted = service.IsDeleted ,
            CreatedAt = service.CreatedAt,
            UpdatedAt = service.CreatedAt,
        };
    }

    public async Task<UpdateServiceResponse> UpdateServiceByIdAsync(UpdateServiceRequest request, string accessToken)
    {
        var role = JwtHelper.GetRoleFromToken(accessToken);
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);

        if (role != RoleNames.Admin && role != RoleNames.Admin)
            throw new AppException(403,"UNAUTHORIZED");

        if (request.Id == Guid.Empty)
            throw new AppException(400,"Guid cannot be empty.");

        var service = await serviceRepository.SearchServiceByIdForStaffAsync(request.Id);
        if (service == null)
            throw new AppException(404,"Service not found");

        service.UpdatedBy = accountId;
        

        if (!string.IsNullOrWhiteSpace(request.Name))
            service.Name = request.Name;

        if (request.Description != null && request.Description != service.Description)
            service.Description = request.Description;

        if (request.Price != service.Price)
            service.Price = request.Price;
        if (request.IsDeleted != service.IsDeleted)
            service.IsDeleted = request.IsDeleted;

        var newMedias = new List<Media?>();
        foreach (var url in request.ImageUrls)
        {
            if (!service.Media.Any(m => m.Url == url))
            {
                var media = new Media
                {
                    Url = url,
                    ServiceId = service.Id,
                    Type ="Image of service",
                    CreatedBy = accountId,
                };
                service.Media.Add(media);
                newMedias.Add(media);
            }
        }
        if (newMedias.Any())
            await mediaRepository.AddListOfMediaAsync(newMedias);
        var success = await serviceRepository.UpdateServiceByIdAsync(service);

        return new UpdateServiceResponse
        {
           Id = service.Id,
           Name = service.Name,
           Description = service.Description ?? "",
           Price = service.Price,
           IsDeleted = service.IsDeleted,
           CreatedAt = service.CreatedAt,
           UpdatedAt = service.CreatedAt,
        };
    }

  
   public async Task<DeleteServiceResponse> DeleteServiceByIdAsync(DeleteServiceRequest request, string accessToken)
   {
       var role = JwtHelper.GetRoleFromToken(accessToken);
       var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
   
       if (role != "admin" && role != "staff")
           throw new UnauthorizedAccessException();
   
       if (request.Id == Guid.Empty)
           throw new ArgumentException("Service id cannot be empty.");
   
       var service = await serviceRepository.SearchServiceByIdForStaffAsync(request.Id);
       if (service == null)
           throw new KeyNotFoundException("Service not found.");
   
       // Delete all media linked to this service
       var medias = await mediaRepository.GetAllMediaByServiceIdAsync(service.Id);
       if (medias != null && medias.Any())
       {
           await mediaRepository.DeleteAllByServiceIdAsync(request.Id);
       }
   
       // Delete the service (soft delete or hard delete)
       var success = await serviceRepository.DeleteServiceByIdAsync(request.Id);
   
       return new DeleteServiceResponse
       {
           Success = success,
           Message = success ? "Xóa dịch vụ và ảnh thành công" : "Xóa dịch vụ thất bại"
       };
   }
}