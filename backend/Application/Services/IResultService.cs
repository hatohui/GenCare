using Application.DTOs.Purchase;
using Application.DTOs.Result.Request;
using Application.DTOs.Result.Response;
using Domain.Entities;

namespace Application.Services;

public interface IResultService
{
    Task<ViewTestResultResponse?> ViewResultAsync(Guid orderDetailId,string accessToken);

    Task<UpdateTestResultResponse> UpdateResultAsync(UpdateTestResultRequest request, Guid orderDetailId);

    Task<DeleteTestResultResponse> DeleteResultAsync(DeleteTestResultRequest request);
    Task<BookedServiceForTestResponse> GetBookedServiceModelAsync(int page, int count, string? orderDetailId);
    Task<List<ViewTestResultResponse>> ViewAllResultForStaffAsync();
    Task AddResult(Result result);
}