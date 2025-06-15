using Application.DTOs.TestTracker.Request;
using Application.DTOs.TestTracker.Response;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class TestTrackerService(ITestTrackerRepository testTrackerRepository) : ITestTrackerService
{
    // Hàm xử lý DateTimeKind
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }
    public async Task<ViewTestResultResponse?> ViewTestResultAsync(Guid orderDetailId)
    {
        var testResult = await testTrackerRepository.ViewTestTrackerAsync(orderDetailId)?? 
                         throw new InvalidOperationException("Test result not found.");
        
        return new ViewTestResultResponse
        {
            OrderDate = testResult.OrderDate,
            SampleDate = testResult.SampleDate,
            ResultDate = testResult.ResultDate,
            Status = testResult.Status,
            ResultData = testResult.ResultData,
            UpdatedAt = testResult.UpdatedAt
        };
        
    }

    public async Task<UpdateTestResultResponse> UpdateTestResultAsync(UpdateTestResultRequest request)
    {
        var testResult = await testTrackerRepository.ViewTestTrackerAsync(request.OrderDetailId)
                         ?? throw new InvalidOperationException("Test result not found.");

        bool isChanged = false;

        if (ToUnspecified(testResult.OrderDate) != ToUnspecified(request.OrderDate))
        {
            testResult.OrderDate = ToUnspecified(request.OrderDate);
            isChanged = true;
        }
        if (ToUnspecified(testResult.SampleDate.GetValueOrDefault()) != ToUnspecified(request.SampleDate.GetValueOrDefault()))
        {
            testResult.SampleDate = request.SampleDate.HasValue ? ToUnspecified(request.SampleDate.Value) : (DateTime?)null;
            isChanged = true;
        }
        if (ToUnspecified(testResult.ResultDate.GetValueOrDefault()) != ToUnspecified(request.ResultDate.GetValueOrDefault()))
        {
            testResult.ResultDate = request.ResultDate.HasValue ? ToUnspecified(request.ResultDate.Value) : (DateTime?)null;
            isChanged = true;
        }
        if (testResult.Status != request.Status)
        {
            testResult.Status = request.Status;
            isChanged = true;
        }
        if (testResult.ResultData != request.ResultData)
        {
            testResult.ResultData = request.ResultData;
            isChanged = true;
        }

        if (isChanged)
        {
            testResult.UpdatedAt = ToUnspecified(DateTime.UtcNow);
            await testTrackerRepository.UpdateTestTrackerAsync(testResult);
        }

        return new UpdateTestResultResponse
        {
            Success = isChanged,
            Message = isChanged ? "Updated successfully." : "No changes detected."
        };
    }



    public async Task<DeleteTestResultResponse> DeleteTestTrackerAsync(DeleteTestResultRequest request)
    {
        if (!await testTrackerRepository.CheckTestTrackerExistsAsync(request.OrderDetailId))
            throw new InvalidOperationException("Test tracker not found.");        

        var deleted = await testTrackerRepository.DeleteTestTrackerAsync(request.OrderDetailId);
        return new DeleteTestResultResponse
        {
            Success = deleted,
            Message = deleted ? "Deleted successfully." : "Failed to delete test result."
        };
    }
}