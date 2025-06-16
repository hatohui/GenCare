using Application.DTOs.TestTracker.Request;
using Application.DTOs.TestTracker.Response;
using Application.Repositories;
using Application.Services;

namespace Infrastructure.Services;

public class TestTrackerService(ITestTrackerRepository testTrackerRepository) : ITestTrackerService
{
    /// <summary>
    /// Converts a DateTime to Unspecified kind (removes timezone information).
    /// </summary>
    /// <param name="dt">Input DateTime value.</param>
    /// <returns>DateTime with Kind = Unspecified.</returns>
    private static DateTime ToUnspecified(DateTime dt)
    {
        return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
    }

    /// <summary>
    /// Gets test result information by OrderDetailId.
    /// </summary>
    /// <param name="orderDetailId">ID of the test order detail.</param>
    /// <returns>Test result information or throws if not found.</returns>
    public async Task<ViewTestResultResponse?> ViewTestResultAsync(Guid orderDetailId)
    {
        var testResult = await testTrackerRepository.ViewTestTrackerAsync(orderDetailId) ??
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

    /// <summary>
    /// Updates a test result based on the provided information.
    /// Only updates fields that are supplied (non-null), following PATCH semantics.
    /// </summary>
    /// <param name="request">Update request for the test result.</param>
    /// <returns>Update result (success/failure, message).</returns>
    public async Task<UpdateTestResultResponse> UpdateTestResultAsync(UpdateTestResultRequest request)
    {
        var testResult = await testTrackerRepository.ViewTestTrackerAsync(request.OrderDetailId)
                         ?? throw new InvalidOperationException("Test result not found.");

        bool isChanged = false;

        if (request.OrderDate != null && ToUnspecified(testResult.OrderDate) != ToUnspecified(request.OrderDate.Value))
        {
            testResult.OrderDate = ToUnspecified(request.OrderDate.Value);
            isChanged = true;
        }
        if (request.SampleDate != null && ToUnspecified(testResult.SampleDate.GetValueOrDefault()) != ToUnspecified(request.SampleDate.Value))
        {
            testResult.SampleDate = ToUnspecified(request.SampleDate.Value);
            isChanged = true;
        }
        if (request.ResultDate != null && ToUnspecified(testResult.ResultDate.GetValueOrDefault()) != ToUnspecified(request.ResultDate.Value))
        {
            testResult.ResultDate = ToUnspecified(request.ResultDate.Value);
            isChanged = true;
        }
        if (request.Status != null && testResult.Status != request.Status.Value)
        {
            testResult.Status = request.Status.Value;
            isChanged = true;
        }
        if (request.ResultData != null && testResult.ResultData != request.ResultData)
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

    /// <summary>
    /// Deletes a test result by OrderDetailId.
    /// </summary>
    /// <param name="request">Delete request with OrderDetailId.</param>
    /// <returns>Delete result (success/failure, message).</returns>

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