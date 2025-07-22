using Application.DTOs.BirthControl.Request;
using Application.Repositories;
using Domain.Entities;
using Domain.Exceptions;
using Infrastructure.Services;
using Moq;
using Xunit;

namespace Test.Services;

public class BirthControlServiceTests
{
    private readonly Mock<IBirthControlRepository> _mockRepo;
    private readonly BirthControlService _service;
    private readonly Guid _testAccountId = Guid.NewGuid();

    public BirthControlServiceTests()
    {
        _mockRepo = new Mock<IBirthControlRepository>();
        _service = new BirthControlService(_mockRepo.Object);
    }

    #region ViewBirthControlAsync Tests

    [Fact]
    public async Task ViewBirthControlAsync_ReturnsCorrectResponse_WhenExists()
    {
        // Arrange
        var startDate = new DateTime(2024, 1, 1);
        var birthControl = new BirthControl
        {
            AccountId = _testAccountId,
            StartDate = startDate,
            EndDate = startDate.AddDays(27),
            StartUnsafeDate = startDate.AddDays(9),
            EndUnsafeDate = startDate.AddDays(16)
        };

        _mockRepo.Setup(x => x.GetBirthControlAsync(_testAccountId))
                 .ReturnsAsync(birthControl);

        // Act
        var result = await _service.ViewBirthControlAsync(_testAccountId);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(startDate, result.StartDate);
        Assert.Equal(startDate.AddDays(4), result.MenstrualEndDate);
        Assert.Equal(startDate.AddDays(9), result.StartUnsafeDate);
        Assert.Equal(startDate.AddDays(16), result.EndUnsafeDate);
    }

    [Fact]
    public async Task ViewBirthControlAsync_ThrowsException_WhenNotFound()
    {
        // Arrange
        _mockRepo.Setup(x => x.GetBirthControlAsync(_testAccountId))
                 .ReturnsAsync((BirthControl)null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AppException>(() => _service.ViewBirthControlAsync(_testAccountId));
        Assert.Equal(404, ex.StatusCode);
        Assert.Equal("Birth control not found for this account.", ex.Message);
    }

    #endregion

    #region AddBirthControlAsync Tests

    [Fact]
    public async Task AddBirthControlAsync_ReturnsSuccess_WhenValid()
    {
        // Arrange
        var request = new CreateBirthControlRequest
        {
            AccountId = _testAccountId,
            StartDate = new DateTime(2024, 1, 1),
            EndDate = new DateTime(2024, 1, 28)
        };

        _mockRepo.Setup(x => x.CheckBirthControlExistsAsync(_testAccountId))
                 .ReturnsAsync(false);

        // Act
        var result = await _service.AddBirthControlAsync(request);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Birth control added successfully.", result.Message);
        _mockRepo.Verify(x => x.AddBirthControlAsync(It.IsAny<BirthControl>()), Times.Once);
    }

    [Fact]
    public async Task AddBirthControlAsync_Uses28DayCycle_WhenEndDateNull()
    {
        // Arrange
        var startDate = new DateTime(2024, 1, 1);
        var request = new CreateBirthControlRequest
        {
            AccountId = _testAccountId,
            StartDate = startDate,
            EndDate = null
        };

        _mockRepo.Setup(x => x.CheckBirthControlExistsAsync(_testAccountId))
                 .ReturnsAsync(false);

        // Act
        var result = await _service.AddBirthControlAsync(request);

        // Assert
        Assert.True(result.Success);
        _mockRepo.Verify(x => x.AddBirthControlAsync(It.Is<BirthControl>(
            bc => bc.EndDate == startDate.Date.AddDays(27))), Times.Once);
    }

    [Fact]
    public async Task AddBirthControlAsync_ThrowsException_WhenAlreadyExists()
    {
        // Arrange
        var request = new CreateBirthControlRequest
        {
            AccountId = _testAccountId,
            StartDate = new DateTime(2024, 1, 1),
            EndDate = new DateTime(2024, 1, 28)
        };

        _mockRepo.Setup(x => x.CheckBirthControlExistsAsync(_testAccountId))
                 .ReturnsAsync(true);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AppException>(() => _service.AddBirthControlAsync(request));
        Assert.Equal(404, ex.StatusCode);
        Assert.Equal("Birth control already exists for this account.", ex.Message);
    }

    [Fact]
    public async Task AddBirthControlAsync_ThrowsException_WhenStartAfterEnd()
    {
        // Arrange
        var request = new CreateBirthControlRequest
        {
            AccountId = _testAccountId,
            StartDate = new DateTime(2024, 1, 15),
            EndDate = new DateTime(2024, 1, 10)
        };

        _mockRepo.Setup(x => x.CheckBirthControlExistsAsync(_testAccountId))
                 .ReturnsAsync(false);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AppException>(() => _service.AddBirthControlAsync(request));
        Assert.Equal(402, ex.StatusCode);
        Assert.Equal("Start date cannot be after end date.", ex.Message);
    }

    #endregion

    #region UpdateBirthControlAsync Tests

    [Fact]
    public async Task UpdateBirthControlAsync_ReturnsSuccess_WhenValid()
    {
        // Arrange
        var request = new UpdateBirthControlRequest
        {
            AccountId = _testAccountId.ToString(),
            StartDate = new DateTime(2024, 2, 1),
            EndDate = new DateTime(2024, 2, 28)
        };

        var existingBirthControl = new BirthControl
        {
            AccountId = _testAccountId,
            StartDate = new DateTime(2024, 1, 1)
        };

        var updatedBirthControl = new BirthControl
        {
            AccountId = _testAccountId,
            StartDate = request.StartDate.Value,
            EndDate = request.EndDate.Value,
            StartUnsafeDate = request.StartDate.Value.AddDays(9),
            EndUnsafeDate = request.StartDate.Value.AddDays(16)
        };

        _mockRepo.SetupSequence(x => x.GetBirthControlAsync(_testAccountId))
                 .ReturnsAsync(existingBirthControl)
                 .ReturnsAsync(updatedBirthControl);

        // Act
        var result = await _service.UpdateBirthControlAsync(request);

        // Assert
        Assert.True(result.Success);
        Assert.Equal("Birth control updated successfully.", result.Message);
        Assert.Equal(request.StartDate, result.StartDate);
        Assert.Equal(request.EndDate, result.EndDate);
    }

    [Fact]
    public async Task UpdateBirthControlAsync_ThrowsException_WhenInvalidGuid()
    {
        // Arrange
        var request = new UpdateBirthControlRequest
        {
            AccountId = "invalid-guid",
            StartDate = new DateTime(2024, 2, 1),
            EndDate = new DateTime(2024, 2, 28)
        };

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AppException>(() => _service.UpdateBirthControlAsync(request));
        Assert.Equal(400, ex.StatusCode);
        Assert.Equal("Invalid AccountId format.", ex.Message);
    }

    [Fact]
    public async Task UpdateBirthControlAsync_ThrowsException_WhenNotFound()
    {
        // Arrange
        var request = new UpdateBirthControlRequest
        {
            AccountId = _testAccountId.ToString(),
            StartDate = new DateTime(2024, 2, 1),
            EndDate = new DateTime(2024, 2, 28)
        };

        _mockRepo.Setup(x => x.GetBirthControlAsync(_testAccountId))
                 .ReturnsAsync((BirthControl)null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AppException>(() => _service.UpdateBirthControlAsync(request));
        Assert.Equal(404, ex.StatusCode);
        Assert.Equal("Birth control not found.", ex.Message);
    }

    [Fact]
    public async Task UpdateBirthControlAsync_ThrowsException_WhenStartAfterOrEqualEnd()
    {
        // Arrange
        var request = new UpdateBirthControlRequest
        {
            AccountId = _testAccountId.ToString(),
            StartDate = new DateTime(2024, 2, 15),
            EndDate = new DateTime(2024, 2, 15) // Equal dates
        };

        var existingBirthControl = new BirthControl { AccountId = _testAccountId };
        _mockRepo.Setup(x => x.GetBirthControlAsync(_testAccountId))
                 .ReturnsAsync(existingBirthControl);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<AppException>(() => _service.UpdateBirthControlAsync(request));
        Assert.Equal(403, ex.StatusCode);
        Assert.Equal("Start date cannot be after end date.", ex.Message);
    }

    #endregion

    #region RemoveBirthControlAsync Tests

    [Fact]
    public async Task RemoveBirthControlAsync_ReturnsTrue_WhenSuccessful()
    {
        // Arrange
        _mockRepo.Setup(x => x.RemoveBirthControlAsync(_testAccountId))
                 .ReturnsAsync(true);

        // Act
        var result = await _service.RemoveBirthControlAsync(_testAccountId);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task RemoveBirthControlAsync_ReturnsFalse_WhenFailed()
    {
        // Arrange
        _mockRepo.Setup(x => x.RemoveBirthControlAsync(_testAccountId))
                 .ReturnsAsync(false);

        // Act
        var result = await _service.RemoveBirthControlAsync(_testAccountId);

        // Assert
        Assert.False(result);
    }

    #endregion
}