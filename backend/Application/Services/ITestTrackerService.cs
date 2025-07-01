using Application.DTOs.Purchase;
using Application.DTOs.TestTracker.Request;
using Application.DTOs.TestTracker.Response;

namespace Application.Services;

public interface ITestTrackerService
{
    Task<ViewTestResultResponse?> ViewResultAsync(Guid orderDetailId,string accessToken);

    Task<UpdateTestResultResponse> UpdateResultAsync(UpdateTestResultRequest request);

    Task<DeleteTestResultResponse> DeleteResultAsync(DeleteTestResultRequest request);
    Task<List<BookedServiceModel>> GetBookedServiceModelAsync();
    Task<List<ViewTestResultResponse>> ViewAllResultForStaffAsync();
}