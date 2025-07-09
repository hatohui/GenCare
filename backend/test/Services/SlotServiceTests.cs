using Xunit;
using Application.Services;
using Application.Repositories;
using Domain.Entities;
using Infrastructure.Services;
using Moq;
using Application.DTOs.Slot.Request;

namespace Test.Services
{
    // Minimal DTO mocks for test compilation
    public class CreateSlotRequest {
        public int No { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class UpdateSlotRequest {
        public Guid SlotId { get; set; }
        public int? No { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public bool? IsDeleted { get; set; }
    }

    public class SlotServiceTests
    {
        private readonly Mock<ISlotRepository> _mockSlotRepository;
        private readonly SlotService _service;

        public SlotServiceTests()
        {
            _mockSlotRepository = new Mock<ISlotRepository>();
            _service = new SlotService(_mockSlotRepository.Object);
        }

        // [Fact]
        // public async Task CreateSlot_ShouldCreateSlot_WhenValidRequest()
        // {
        //     // Arrange
        //     var request = new CreateSlotRequest
        //     {
        //         No = 1,
        //         StartTime = DateTime.Now.AddHours(1),
        //         EndTime = DateTime.Now.AddHours(2),
        //         IsDeleted = false
        //     };
        //
        //     _mockSlotRepository.Setup(r => r.CheckTimeExist(It.IsAny<DateTime>(), It.IsAny<DateTime>()))
        //                       .ReturnsAsync(false);
        //     _mockSlotRepository.Setup(r => r.CheckNoExist(request.No))
        //                       .ReturnsAsync(false);
        //
        //     // Act
        //     var response = await _service.CreateSlot(request);
        //
        //     // Assert
        //     Assert.NotNull(response);
        //     Assert.True(response.Success);
        // }

        // [Fact]
        // public async Task UpdateSlot_ShouldUpdateSlot_WhenValidRequest()
        // {
        //     // Arrange
        //     var slotId = Guid.NewGuid();
        //     var request = new UpdateSlotRequest
        //     {
        //         SlotId = slotId,
        //         No = 2,
        //         StartTime = DateTime.Now.AddHours(2),
        //         EndTime = DateTime.Now.AddHours(3),
        //         IsDeleted = false
        //     };
        //
        //     var existingSlot = new Slot
        //     {
        //         Id = slotId,
        //         No = 1,
        //         StartAt = DateTime.Now.AddHours(1),
        //         EndAt = DateTime.Now.AddHours(2),
        //         IsDeleted = false
        //     };
        //
        //     _mockSlotRepository.Setup(r => r.GetById(slotId)).ReturnsAsync(existingSlot);
        //     _mockSlotRepository.Setup(r => r.CheckNoExist(request.No.Value)).ReturnsAsync(false);
        //     _mockSlotRepository.Setup(r => r.CheckTimeExist(It.IsAny<DateTime>(), It.IsAny<DateTime>(), slotId))
        //                       .ReturnsAsync(false);
        //
        //     // Act
        //     var response = await _service.UpdateSlot(request);
        //
        //     // Assert
        //     Assert.NotNull(response);
        //     Assert.True(response.Success);
        // }

        [Fact]
        public async Task DeleteSlot_ShouldDeleteSlot_WhenValidRequest()
        {
            // Arrange
            var slotId = Guid.NewGuid();
            var existingSlot = new Slot
            {
                Id = slotId,
                No = 1,
                StartAt = DateTime.Now.AddHours(1),
                EndAt = DateTime.Now.AddHours(2),
                IsDeleted = false
            };

            _mockSlotRepository.Setup(r => r.GetById(slotId)).ReturnsAsync(existingSlot);

            // Act
            var response = await _service.DeleteSlot(slotId);

            // Assert
            Assert.NotNull(response);
            Assert.True(response.Success);
        }

        [Fact]
        public async Task ViewAllSlot_ShouldReturnAllSlots()
        {
            // Arrange
            var slots = new List<Slot>
            {
                new Slot { Id = Guid.NewGuid(), No = 1, StartAt = DateTime.Now, EndAt = DateTime.Now.AddHours(1) },
                new Slot { Id = Guid.NewGuid(), No = 2, StartAt = DateTime.Now.AddHours(1), EndAt = DateTime.Now.AddHours(2) }
            };

            _mockSlotRepository.Setup(r => r.ViewAllSlot()).ReturnsAsync(slots);

            // Act
            var response = await _service.ViewAllSlot();

            // Assert
            Assert.NotNull(response);
            Assert.Equal(2, response.Slots.Count);
        }
    }
} 