using Application.DTOs.TestTracker.Request;
using Application.DTOs.TestTracker.Response;

namespace Application.Services;

public interface ITestTrackerService
{
    Task<ViewTestResultResponse?> ViewTestResultAsync(Guid orderDetailId);

    Task<UpdateTestResultResponse> UpdateTestResultAsync(UpdateTestResultRequest request);

    Task<DeleteTestResultResponse> DeleteTestTrackerAsync(DeleteTestResultRequest request);
}