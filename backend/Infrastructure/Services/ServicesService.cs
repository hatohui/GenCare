
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Entities;

namespace Infrastructure.Services;

public class ServicesService(
    IServicesRepository servicesRepository,
    IMediaRepository mediaRepository
) : IServicesService
{
    public async Task<ViewServiceByPageResponse> SearchServiceAsync(ViewServicesByPageRequest request)
    {
        var services = await servicesRepository.SearchServiceAsync(request.Page, request.Count);
        ViewServiceByPageResponse response = new ViewServiceByPageResponse();
        response.Page = request.Page;
        response.Count = request.Count;
        
        services.ForEach(s =>
        {
            response.Payload.Add(new ServicePayload()
            {
                Id = s.Id,
                Name = s.Name,
                Description = s.Description ?? "",
                Price = s.Price,
                ImageUrl = mediaRepository.GetNewestByServiceIdAsync(s.Id).Result?.Url ?? string.Empty
            });
        });
        return response;
    }

    public async Task<ViewSearchWithIdResponse> SearchServiceByIdAsync(ViewServiceWithIdRequest request)
    {
        // Validate Id là Guid hợp lệ
        if (!Guid.TryParse(request.Id, out var guidId))
            throw new ArgumentException("Invalid id format.");

        // Gọi repository để lấy dữ liệu
        var service = await servicesRepository.SearchServiceByIdAsync1(guidId);

        // Nếu không tìm thấy thì throw exception hoặc trả về null 
        if (service == null)
            throw new KeyNotFoundException("Service not found.");
        var mediaService = await mediaRepository.GetAllMediaByServiceIdAsync(service.Id);
        
        var imUrls = mediaService?.Select(m  =>m.Url).ToList();         
        return new ViewSearchWithIdResponse()
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
        var accountId = JwtHelper.GetAccountIdFromToken1(accessToken);

        // Validate quyền
        if (role != "admin" && role != "staff")
            throw new UnauthorizedAccessException();
        // Validate not null
        if (string.IsNullOrWhiteSpace(request.Name))
            throw new ArgumentException("Service name cannot be empty.");
        //check exists
        if (await servicesRepository.ExistsByNameAsync(request.Name))
            throw new InvalidOperationException("Service name already exists.");
        //price is not negative
        if (request.Price < 0)
            throw new ArgumentException("Service price cannot be negative.");
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
        await servicesRepository.AddServiceAsync(service);
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

    public async Task<UpdateServiceByIdResponse> UpdateServiceByIdAsync(UpdateServiceByIdRequest request, string accessToken)
    {
        var role = JwtHelper.GetRoleFromToken(accessToken);
        var accountId = JwtHelper.GetAccountIdFromToken1(accessToken);

        if (role != "admin" && role != "staff")
            throw new UnauthorizedAccessException();

        if (request.Id == Guid.Empty)
            throw new ArgumentException("Service id cannot be empty.");

        var service = await servicesRepository.SearchServiceByIdAsync1(request.Id);
        if (service == null)
            throw new Exception("Service not found");

        service.UpdatedBy = accountId;
        if (service == null)
            throw new Exception("Service not found");

        if (!string.IsNullOrWhiteSpace(request.Name))
            service.Name = request.Name;

        if (request.Description != null && request.Description != service.Description)
            service.Description = request.Description;

        if (request.Price != service.Price)
            service.Price = request.Price;
        if (request.IsDeleted != service.IsDeleted)
            service.IsDeleted = request.IsDeleted;

        var newMedias = new List<Media>();
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
            await mediaRepository.AddAsync1(newMedias);
        var success = await servicesRepository.UpdateServiceByIdAsync(service);

        return new UpdateServiceByIdResponse
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

  
   public async Task<DeleteServiceByIdResponse> DeleteServiceByIdAsync(DeleteServiceByIdRequest request, string accessToken)
   {
       var role = JwtHelper.GetRoleFromToken(accessToken);
       var accountId = JwtHelper.GetAccountIdFromToken1(accessToken);
   
       if (role != "admin" && role != "staff")
           throw new UnauthorizedAccessException();
   
       if (request.Id == Guid.Empty)
           throw new ArgumentException("Service id cannot be empty.");
   
       var service = await servicesRepository.SearchServiceByIdAsync1(request.Id);
       if (service == null)
           throw new KeyNotFoundException("Service not found.");
   
       // Delete all media linked to this service
       var medias = await mediaRepository.GetAllMediaByServiceIdAsync(service.Id);
       if (medias != null && medias.Any())
       {
           await mediaRepository.DeleteAllByServiceIdAsync(request.Id);
       }
   
       // Delete the service (soft delete or hard delete)
       var success = await servicesRepository.DeleteServiceByIdAsync(request.Id);
   
       return new DeleteServiceByIdResponse
       {
           Success = success,
           Message = success ? "Xóa dịch vụ và ảnh thành công" : "Xóa dịch vụ thất bại"
       };
   }
}