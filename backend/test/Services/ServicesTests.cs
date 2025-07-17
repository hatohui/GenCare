using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.DTOs.Service.Requests;
using Application.DTOs.Service.Responses;
using Application.Helpers;
using Application.Repositories;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.Services;
using Microsoft.IdentityModel.Tokens;
using Moq;
using NSubstitute;
using Xunit;

namespace Test.Services;

public class ServicesTests
{
    public ServicesTests()
    {
        // ✅ QUAN TRỌNG: Config JWT secret key
        Environment.SetEnvironmentVariable("JWT_SECRET", "your-actual-production-jwt-secret-key!!");
    }
    [Fact]
    public async Task SearchServiceAsync_ReturnsServices_WhenRequestIsValid()
    {
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var services = new List<Service> { new Service { Id = Guid.NewGuid(), Name = "Test", Price = 10 } };
        serviceRepo.Setup(r => r.SearchServiceAsync(
            It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool?>(), It.IsAny<bool?>()
        )).ReturnsAsync(ValueTuple.Create(services, 1));
        mediaRepo.Setup(r => r.GetAllMediaByServiceIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync(new List<Media>());
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        var result = await sut.SearchServiceAsync(new ViewServicesByPageRequest { Page = 1, Count = 10 });

        Assert.Single(result.Services);
        Assert.Equal(1, result.TotalCount);
    }
    [Fact]
    public async Task SearchServiceAsync_ThrowsAppException_WhenPageOrCountIsInvalid()
    {
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        await Assert.ThrowsAsync<AppException>(() => sut.SearchServiceAsync(new ViewServicesByPageRequest { Page = 0, Count = 10 }));
        await Assert.ThrowsAsync<AppException>(() => sut.SearchServiceAsync(new ViewServicesByPageRequest { Page = 1, Count = 0 }));
    }

    [Fact]
    public async Task SearchServiceIncludeDeletedAsync_ThrowsAppException_WhenServicesIsNull()
    {
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        serviceRepo.Setup(r => r.SearchServiceIncludeDeletedAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>()))
            .ReturnsAsync((null, 0));
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        await Assert.ThrowsAsync<AppException>(() => sut.SearchServiceIncludeDeletedAsync(new ViewServiceForStaffRequest { Page = 1, Count = 1 }));
    }

    [Fact]
    public async Task SearchServiceByIdAsync_ThrowsAppException_WhenIdIsInvalid()
    {
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        await Assert.ThrowsAsync<AppException>(() => sut.SearchServiceByIdAsync(new ViewServiceWithIdRequest { Id = "not-a-guid" }));
    }
 [Fact]
    public async Task CreateServiceAsync_ThrowsAppException_WhenUnauthorized()
    {
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();

        var userToken = CreateTokenWithRole("user"); // Role không có quyền
        
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new CreateServiceRequest { Name = "Test", Price = 10 };
        
        await Assert.ThrowsAsync<AppException>(() => sut.CreateServiceAsync(req, userToken));
    }

    [Fact]
    public async Task CreateServiceAsync_ReturnsService_WhenValid()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
    
        var adminToken = CreateTokenWithRole("admin");
    
        serviceRepo.Setup(r => r.ExistsByNameAsync(It.IsAny<string>())).ReturnsAsync(false);
    
        // ✅ FIX: Return Service object thay vì Task.CompletedTask
        serviceRepo.Setup(r => r.AddServiceAsync(It.IsAny<Service>()))
            .ReturnsAsync(new Service 
            { 
                Id = Guid.NewGuid(), 
                Name = "Test",
                Price = 10,
                Description = "desc",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsDeleted = false,
                Media = new List<Media>()
            });
    
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
    
        // Act
        var req = new CreateServiceRequest 
        { 
            Name = "Test", 
            Price = 10, 
            Description = "desc", 
            ImageUrls = new List<string> { "url1" } 
        };
    
        var result = await sut.CreateServiceAsync(req, adminToken);
    
        // Assert
        Assert.Equal(req.Name, result.Name);
        Assert.Equal(req.Price, result.Price);
        Assert.Contains("url1", result.ImageUrls);
    }
    private string CreateTokenWithRole(string role)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes("your-actual-production-jwt-secret-key!!"); // ✅ CÙNG KEY VỚI PRODUCTION
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim("http://schemas.microsoft.com/ws/2008/06/identity/claims/role", role),
                new Claim("sub", Guid.NewGuid().ToString())
            }),
            Expires = DateTime.UtcNow.AddHours(1),
            Issuer = "api.gencare.site",
            Audience = "www.gencare.site",
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}