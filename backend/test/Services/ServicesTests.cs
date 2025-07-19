
using Application.DTOs.Service.Requests;
using Application.Helpers;
using Application.Repositories;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.Services;
using Moq;
using Xunit;

namespace Test.Services;

public class ServicesTests
{
    static ServicesTests()
    {
        // ✅ Config JWT environment variables
        Environment.SetEnvironmentVariable("JWT_KEY", "THIS_IS_A_SECURE_32BYTE_KEY_EXAMPLE!!");
        Environment.SetEnvironmentVariable("JWT_ISSUER", "testissuer");
        Environment.SetEnvironmentVariable("JWT_AUDIENCE", "testaudience");
    }

    private string CreateTokenWithRole(string role)
    {
        // ✅ Sử dụng JwtHelper để tạo token đúng format
        var user = new Account
        {
            Id = Guid.NewGuid(),
            Email = "test@email.com",
            Role = new Role { Name = role }
        };

        var (token, _) = JwtHelper.GenerateAccessToken(user);
        return token;
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

        await Assert.ThrowsAsync<AppException>(() =>
            sut.SearchServiceAsync(new ViewServicesByPageRequest { Page = 0, Count = 10 }));
        await Assert.ThrowsAsync<AppException>(() =>
            sut.SearchServiceAsync(new ViewServicesByPageRequest { Page = 1, Count = 0 }));
    }

    [Fact]
    public async Task SearchServiceIncludeDeletedAsync_ThrowsAppException_WhenServicesIsNull()
    {
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        serviceRepo.Setup(r => r.SearchServiceIncludeDeletedAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<string>(),
                It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>(), It.IsAny<bool>()))
            .ReturnsAsync((null, 0));
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        await Assert.ThrowsAsync<AppException>(() =>
            sut.SearchServiceIncludeDeletedAsync(new ViewServiceForStaffRequest { Page = 1, Count = 1 }));
    }

    [Fact]
    public async Task SearchServiceByIdAsync_ThrowsAppException_WhenIdIsInvalid()
    {
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        await Assert.ThrowsAsync<AppException>(() =>
            sut.SearchServiceByIdAsync(new ViewServiceWithIdRequest { Id = "not-a-guid" }));
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

    [Fact]
    public async Task UpdateServiceByIdAsync_ThrowsAppException_WhenUnauthorized()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var userToken = CreateTokenWithRole("user"); // Role không có quyền
        var serviceId = Guid.NewGuid();

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new UpdateServiceRequest { Name = "Updated Name", Price = 20 };

        // Act & Assert
        await Assert.ThrowsAsync<AppException>(() =>
            sut.UpdateServiceByIdAsync(req, userToken, serviceId));
    }

    [Fact]
    public async Task UpdateServiceByIdAsync_ThrowsAppException_WhenServiceIdIsEmpty()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var emptyServiceId = Guid.Empty;

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new UpdateServiceRequest { Name = "Updated Name" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<AppException>(() =>
            sut.UpdateServiceByIdAsync(req, adminToken, emptyServiceId));

        Assert.Equal(400, exception.StatusCode);
        Assert.Equal("Guid cannot be empty.", exception.Message);
    }

    [Fact]
    public async Task UpdateServiceByIdAsync_ThrowsAppException_WhenServiceNotFound()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var serviceId = Guid.NewGuid();

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync((Service)null); // Service not found

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new UpdateServiceRequest { Name = "Updated Name" };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<AppException>(() =>
            sut.UpdateServiceByIdAsync(req, adminToken, serviceId));

        Assert.Equal(404, exception.StatusCode);
        Assert.Equal("Service not found", exception.Message);
    }

    [Fact]
    public async Task UpdateServiceByIdAsync_UpdatesService_WhenValid()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var accountId = JwtHelper.GetAccountIdFromToken(adminToken);
        var serviceId = Guid.NewGuid();

        var existingService = new Service
        {
            Id = serviceId,
            Name = "Old Name",
            Description = "Old Description",
            Price = 10,
            IsDeleted = false,
            CreatedAt = DateTime.UtcNow.AddDays(-1),
            UpdatedAt = DateTime.UtcNow.AddDays(-1),
            Media = new List<Media>
            {
                new Media { Url = "existing-url.jpg", ServiceId = serviceId }
            }
        };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(existingService);

        // ✅ FIX: ReturnsAsync(true) thay vì Returns(Task.CompletedTask)
        serviceRepo.Setup(r => r.UpdateServiceByIdAsync(It.IsAny<Service>()))
            .ReturnsAsync(true); // ← Task<bool> với giá trị true

        mediaRepo.Setup(r => r.AddListOfMediaAsync(It.IsAny<List<Media>>()))
            .Returns(Task.CompletedTask); // ← Task (void) OK

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        var req = new UpdateServiceRequest
        {
            Name = "Updated Name",
            Description = "Updated Description",
            Price = 25,
            IsDeleted = true,
            ImageUrls = new List<string> { "existing-url.jpg", "new-url.jpg" }
        };

        // Act
        var result = await sut.UpdateServiceByIdAsync(req, adminToken, serviceId);

        // Assert
        Assert.Equal(serviceId, result.Id);
        Assert.Equal("Updated Name", result.Name);
        Assert.Equal("Updated Description", result.Description);
        Assert.Equal(25, result.Price);
        Assert.True(result.IsDeleted);

        // Verify calls
        serviceRepo.Verify(r => r.UpdateServiceByIdAsync(It.Is<Service>(s =>
            s.Name == "Updated Name" &&
            s.Description == "Updated Description" &&
            s.Price == 25 &&
            s.IsDeleted == true &&
            s.UpdatedBy == accountId)), Times.Once);


        mediaRepo.Verify(r => r.AddListOfMediaAsync(It.Is<List<Media>>(medias =>
            medias.Count == 1 &&
            medias[0].Url == "new-url.jpg")), Times.Once);
    }

    [Fact]
    public async Task UpdateServiceByIdAsync_OnlyUpdatesProvidedFields()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var serviceId = Guid.NewGuid();

        var existingService = new Service
        {
            Id = serviceId,
            Name = "Old Name",
            Description = "Old Description",
            Price = 10,
            IsDeleted = false,
            Media = new List<Media>()
        };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(existingService);

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);

        // Only update name, keep other fields unchanged
        var req = new UpdateServiceRequest
        {
            Name = "Updated Name Only",
            // Description = null, Price = 10, IsDeleted = false (defaults)

            ImageUrls = new List<string>()
        };

        // Act
        var result = await sut.UpdateServiceByIdAsync(req, adminToken, serviceId);

        // Assert
        Assert.Equal("Updated Name Only", result.Name);
        Assert.Equal("Old Description", result.Description); // Unchanged
        Assert.Equal(10, result.Price); // Unchanged because req.Price = 0 = default
        Assert.False(result.IsDeleted); // Unchanged
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_ThrowsUnauthorizedAccessException_WhenUserRole()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var userToken = CreateTokenWithRole("user"); // user can not delete service

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = Guid.NewGuid() };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            sut.DeleteServiceByIdAsync(req, userToken));
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_ThrowsUnauthorizedAccessException_WhenManagerRole()
    {
        // Arrange  
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var managerToken = CreateTokenWithRole("manager"); // manager cannot delete service

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = Guid.NewGuid() };

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            sut.DeleteServiceByIdAsync(req, managerToken));
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_ThrowsArgumentException_WhenServiceIdIsEmpty()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = Guid.Empty };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<ArgumentException>(() =>
            sut.DeleteServiceByIdAsync(req, adminToken));

        Assert.Equal("Service id cannot be empty.", exception.Message);
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_ThrowsKeyNotFoundException_WhenServiceNotFound()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var serviceId = Guid.NewGuid();

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync((Service)null); // ✅ Service not found

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = serviceId };

        // Act & Assert
        var exception = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            sut.DeleteServiceByIdAsync(req, adminToken));

        Assert.Equal("Service not found.", exception.Message);
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_DeletesServiceAndMedia_WhenAdminRole()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin"); //only admin can delete service
        var serviceId = Guid.NewGuid();

        var service = new Service
        {
            Id = serviceId,
            Name = "Test Service",
            Price = 10
        };

        var medias = new List<Media>
        {
            new Media { Id = Guid.NewGuid(), ServiceId = serviceId, Url = "image1.jpg" },
            new Media { Id = Guid.NewGuid(), ServiceId = serviceId, Url = "image2.jpg" }
        };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(service);

        mediaRepo.Setup(r => r.GetAllMediaByServiceIdAsync(serviceId))
            .ReturnsAsync(medias); // Service have media

        mediaRepo.Setup(r => r.DeleteAllByServiceIdAsync(serviceId))
            .Returns(Task.CompletedTask);

        serviceRepo.Setup(r => r.DeleteServiceByIdAsync(serviceId))
            .ReturnsAsync(true); //delete service success

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = serviceId };

        // Act
        var result = await sut.DeleteServiceByIdAsync(req, adminToken);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Service and images deleted successfully.", result.Message);

        //  Verify media deletion was called
        mediaRepo.Verify(r => r.DeleteAllByServiceIdAsync(serviceId), Times.Once);

        // Verify service deletion was called
        serviceRepo.Verify(r => r.DeleteServiceByIdAsync(serviceId), Times.Once);
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_DeletesServiceAndMedia_WhenStaffRole()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var staffToken = CreateTokenWithRole("staff"); // ✅ Staff có quyền
        var serviceId = Guid.NewGuid();

        var service = new Service { Id = serviceId, Name = "Test Service" };
        var medias = new List<Media>
        {
            new Media { ServiceId = serviceId, Url = "image.jpg" }
        };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(service);

        mediaRepo.Setup(r => r.GetAllMediaByServiceIdAsync(serviceId))
            .ReturnsAsync(medias);

        mediaRepo.Setup(r => r.DeleteAllByServiceIdAsync(serviceId))
            .Returns(Task.CompletedTask);

        serviceRepo.Setup(r => r.DeleteServiceByIdAsync(serviceId))
            .ReturnsAsync(true);

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = serviceId };

        // Act
        var result = await sut.DeleteServiceByIdAsync(req, staffToken);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Service and images deleted successfully.", result.Message);
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_DeletesServiceOnly_WhenNoMedia()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var serviceId = Guid.NewGuid();

        var service = new Service { Id = serviceId, Name = "Test Service" };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(service);

        mediaRepo.Setup(r => r.GetAllMediaByServiceIdAsync(serviceId))
            .ReturnsAsync(new List<Media>());

        serviceRepo.Setup(r => r.DeleteServiceByIdAsync(serviceId))
            .ReturnsAsync(true);

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = serviceId };

        // Act
        var result = await sut.DeleteServiceByIdAsync(req, adminToken);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Service and images deleted successfully.", result.Message);

        //  Verify media deletion was NOT called (no media to delete)
        mediaRepo.Verify(r => r.DeleteAllByServiceIdAsync(It.IsAny<Guid>()), Times.Never);

        //  Verify service deletion was called
        serviceRepo.Verify(r => r.DeleteServiceByIdAsync(serviceId), Times.Once);
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_DeletesServiceOnly_WhenMediaIsNull()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var serviceId = Guid.NewGuid();

        var service = new Service { Id = serviceId, Name = "Test Service" };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(service);

        mediaRepo.Setup(r => r.GetAllMediaByServiceIdAsync(serviceId))
            .ReturnsAsync((List<Media>)null); //  Media = null

        serviceRepo.Setup(r => r.DeleteServiceByIdAsync(serviceId))
            .ReturnsAsync(true);

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = serviceId };

        // Act
        var result = await sut.DeleteServiceByIdAsync(req, adminToken);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Service and images deleted successfully.", result.Message);

        // ✅ Media deletion should not be called when media is null
        mediaRepo.Verify(r => r.DeleteAllByServiceIdAsync(It.IsAny<Guid>()), Times.Never);
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_ReturnsFailure_WhenServiceDeletionFails()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var serviceId = Guid.NewGuid();

        var service = new Service { Id = serviceId, Name = "Test Service" };
        var medias = new List<Media>
        {
            new Media { ServiceId = serviceId, Url = "image.jpg" }
        };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(service);

        mediaRepo.Setup(r => r.GetAllMediaByServiceIdAsync(serviceId))
            .ReturnsAsync(medias);

        mediaRepo.Setup(r => r.DeleteAllByServiceIdAsync(serviceId))
            .Returns(Task.CompletedTask); // Media deletion thành công

        serviceRepo.Setup(r => r.DeleteServiceByIdAsync(serviceId))
            .ReturnsAsync(false); //  Service deletion fail

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = serviceId };

        // Act
        var result = await sut.DeleteServiceByIdAsync(req, adminToken);

        // Assert
        Assert.False(result.Success);
        Assert.Equal("Failed to delete the service.", result.Message);

        // media deletion should still be called
        mediaRepo.Verify(r => r.DeleteAllByServiceIdAsync(serviceId), Times.Once);
        serviceRepo.Verify(r => r.DeleteServiceByIdAsync(serviceId), Times.Once);
    }

    [Fact]
    public async Task DeleteServiceByIdAsync_HandlesMediaDeletionException()
    {
        // Arrange
        var serviceRepo = new Mock<IServiceRepository>();
        var mediaRepo = new Mock<IMediaRepository>();
        var adminToken = CreateTokenWithRole("admin");
        var serviceId = Guid.NewGuid();

        var service = new Service { Id = serviceId, Name = "Test Service" };
        var medias = new List<Media>
        {
            new Media { ServiceId = serviceId, Url = "image.jpg" }
        };

        serviceRepo.Setup(r => r.SearchServiceByIdForStaffAsync(serviceId))
            .ReturnsAsync(service);

        mediaRepo.Setup(r => r.GetAllMediaByServiceIdAsync(serviceId))
            .ReturnsAsync(medias);

        mediaRepo.Setup(r => r.DeleteAllByServiceIdAsync(serviceId))
            .ThrowsAsync(new Exception("Database error")); // Media deletion throw exception

        var sut = new ServicesService(serviceRepo.Object, mediaRepo.Object);
        var req = new DeleteServiceRequest { Id = serviceId };

        // Act & Assert
        await Assert.ThrowsAsync<Exception>(() =>
            sut.DeleteServiceByIdAsync(req, adminToken));

        // ✅ Service deletion should not be called if media deletion fails
        serviceRepo.Verify(r => r.DeleteServiceByIdAsync(It.IsAny<Guid>()), Times.Never);
    }
}