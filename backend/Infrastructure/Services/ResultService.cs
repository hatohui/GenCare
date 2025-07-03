using Application.DTOs.Purchase;
using Application.DTOs.Result;
using Application.DTOs.Result.Request;
using Application.DTOs.Result.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Newtonsoft.Json;

namespace Infrastructure.Services;

public class ResultService(IResultRepository resultRepository, 
                                IPurchaseRepository purchaseRepository, 
                                IPaymentHistoryRepository paymentHistoryRepository,
                                IOrderDetailRepository orderDetailRepository,
                                IServiceRepository serviceRepository
                                ) : IResultService
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
    /// <param name="accessToken"></param>
    /// <returns>Test result information or throws if not found.</returns>
    public async Task<ViewTestResultResponse?> ViewResultAsync(Guid orderDetailId, string accessToken)
    {
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        var role = JwtHelper.GetRoleFromToken(accessToken);

        //get order detail by id
        var orderDetail = await orderDetailRepository.GetByIdAsync(orderDetailId);
        if (orderDetail == null)
            throw new AppException(404, "Order detail not found.");

        //get purchase by order detail
        var purchase = await purchaseRepository.GetById(orderDetail.PurchaseId);
        if (purchase == null)
            throw new AppException(404, "Purchase not found.");
        // Check if the purchase is paid, check only for member
        if (role == RoleNames.Member)
        {
            if (purchase.AccountId != accountId)
            {
                throw new AppException(403, "You are not authorized to view this test result. This record belongs to another member.");
            }
            //if purchase is not paid and not found payment record, throw exception
            var payment = await paymentHistoryRepository.GetById(purchase.Id);
            if (payment == null)
                throw new AppException(402, "No payment record found.");

            if (payment.Status.Trim() != PaymentStatus.Paid.Trim())
                throw new AppException(402, "Payment is not completed.");
        }

        
        var testResult = await resultRepository.ViewResultAsync(orderDetailId) ??
                         throw new InvalidOperationException("Test result not found.");
        // If the test result is null, create a new one with default values
        if (testResult == null!)
        {
            // If the user is not Staff or Admin, throw an exception
            if (role != RoleNames.Staff && role != RoleNames.Admin)
            {
                throw new AppException(404, "Test result not found.");
            }

            testResult = new Result
            {
                OrderDetailId = orderDetailId,
                OrderDate = ToUnspecified(DateTime.Now),
                SampleDate = null,
                ResultDate = null,
                Status = false, // Default status
                ResultData = null,
                UpdatedAt = ToUnspecified(DateTime.Now)
            };

            await resultRepository.AddAsync(testResult);
        }
        return new ViewTestResultResponse
        {
            OrderDetailId = orderDetailId,
            OrderDate = testResult!.OrderDate,
            SampleDate = testResult.SampleDate,
            ResultDate = testResult.ResultDate,
            Status = testResult.Status,
            ResultData = string.IsNullOrWhiteSpace(testResult.ResultData)
                ? null
                : JsonConvert.DeserializeObject<Dictionary<string, TestItemResult>>(testResult.ResultData),
            UpdatedAt = testResult.UpdatedAt
        };
    }

    /// <summary>
    /// Updates a test result based on the provided information.
    /// Only updates fields that are supplied (non-null), following PATCH semantics.
    /// </summary>
    /// <param name="request">The update request containing the fields to be updated.</param>
    /// <param name="orderDetailId">The ID of the order detail associated with the test result.</param>
    /// <returns>
    /// An <see cref="UpdateTestResultResponse"/> object indicating whether the update was successful
    /// and providing a message about the operation.
    /// </returns>
    /// <exception cref="InvalidOperationException">Thrown if the test result is not found.</exception>
    /// <exception cref="AppException">Thrown if the result date is earlier than the sample date.</exception>
   public async Task<UpdateTestResultResponse> UpdateResultAsync(UpdateTestResultRequest request, Guid orderDetailId)
{
    var testResult = await resultRepository.ViewResultAsync(orderDetailId)
                     ?? throw new InvalidOperationException("Test result not found.");

    bool isChanged = false;

    var sampleDate = request.SampleDate?.ToLocalTime();
    var resultDate = request.ResultDate?.ToLocalTime();

    if (sampleDate != null && resultDate != null && resultDate < sampleDate)
        throw new AppException(400, "Result date cannot be earlier than sample date.");

    // OrderDate
    if (request.OrderDate != null && ToUnspecified(testResult.OrderDate) != ToUnspecified(request.OrderDate.Value))
    {
        testResult.OrderDate = ToUnspecified(request.OrderDate.Value);
        isChanged = true;
    }

    // SampleDate
    if (request.SampleDate != null)
    {
        if (!testResult.SampleDate.HasValue || ToUnspecified(testResult.SampleDate.Value) != ToUnspecified(sampleDate.Value))
        {
            testResult.SampleDate = ToUnspecified(sampleDate.Value);
            isChanged = true;
        }
    }

    // ResultDate
    if (request.ResultDate != null)
    {
        if (!testResult.ResultDate.HasValue || ToUnspecified(testResult.ResultDate.Value) != ToUnspecified(resultDate.Value))
        {
            testResult.ResultDate = ToUnspecified(resultDate.Value);
            isChanged = true;
        }
    }

    // ResultData
    if (request.ResultData != null)
    {
        var newResultDataJson = JsonConvert.SerializeObject(request.ResultData);
        if (testResult.ResultData != newResultDataJson)
        {
            testResult.ResultData = newResultDataJson;
            isChanged = true;
        }
    }

    // Xử lý Status
    if (request.Status != null)
    {
        if (request.Status == true)
        {
            // Muốn set TRUE thì bắt buộc phải đủ 3 trường
            if (sampleDate == null || resultDate == null || request.ResultData == null)
                throw new AppException(400, "To set status to true, SampleDate, ResultDate, and ResultData must be provided.");
        }

        if (testResult.Status != request.Status.Value)
        {
            testResult.Status = request.Status.Value;
            isChanged = true;
        }
    }

    // Final update
    if (isChanged)
    {
        testResult.UpdatedAt = ToUnspecified(DateTime.UtcNow);
        await resultRepository.UpdateResultAsync(testResult);
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

    public async Task<DeleteTestResultResponse> DeleteResultAsync(DeleteTestResultRequest request)
    {
        if (!await resultRepository.CheckResultExistsAsync(request.OrderDetailId))
            throw new InvalidOperationException("Test tracker not found.");

        var deleted = await resultRepository.DeleteResultAsync(request.OrderDetailId);
        return new DeleteTestResultResponse
        {
            Success = deleted,
            Message = deleted ? "Deleted successfully." : "Failed to delete test result."
        };
    }

    public async Task<List<BookedServiceModel>> GetBookedServiceModelAsync(int page, int count, string? orderDetailId)
    {
        var purchases = await purchaseRepository.GetAllPurchasesAsync();
        var paidPurchaseIds = await paymentHistoryRepository.GetPaidPurchaseIdsAsync(purchases);

        var result = new List<BookedServiceModel>();

        foreach (var purchase in purchases)
        {
            if (!paidPurchaseIds.Contains(purchase.Id))
                continue;

            foreach (var od in purchase.OrderDetails)
            {
                if (!string.IsNullOrWhiteSpace(orderDetailId) &&
                    !od.Id.ToString().Contains(orderDetailId, StringComparison.OrdinalIgnoreCase))
                    continue;

                var service = await serviceRepository.SearchServiceByIdAsync(od.ServiceId);
                var statusResult = await resultRepository.ViewResultAsync(od.Id);
                if (service == null) continue;

                result.Add(new BookedServiceModel
                {
                    Status = statusResult?.Status ?? false, 
                    OrderDetailId = od.Id,
                    ServiceName = service.Name,
                    FirstName = od.FirstName,
                    LastName = od.LastName,
                    PhoneNumber = od.Phone,
                    DateOfBirth = od.DateOfBirth.ToDateTime(TimeOnly.MinValue),
                    Gender = od.Gender,
                    CreatedAt = purchase.CreatedAt
                });
            }
        }

        return result
            .OrderByDescending(x => x.CreatedAt)
            .Skip((page - 1) * count)
            .Take(count)
            .ToList();
    }

    public async Task<List<ViewTestResultResponse>> ViewAllResultForStaffAsync()
    {
        var testResults = await resultRepository.ViewResultListAsync();
        var responseList = new List<ViewTestResultResponse>();

        foreach (var testResult in testResults)
        {
            if (string.IsNullOrWhiteSpace(testResult.ResultData) || 
                !testResult.ResultData.TrimStart().StartsWith("{"))
            {
                continue; 
            }

            var parsedResultData = JsonConvert.DeserializeObject<Dictionary<string, TestItemResult>>(testResult.ResultData!);

            responseList.Add(new ViewTestResultResponse
            {
                OrderDetailId = testResult.OrderDetailId,
                OrderDate = testResult.OrderDate,
                SampleDate = testResult.SampleDate,
                ResultDate = testResult.ResultDate,
                Status = testResult.Status,
                ResultData = parsedResultData,
                UpdatedAt = testResult.UpdatedAt
            });
        }

        return responseList;
    }

    public async Task AddResult(Result result)
    {
        await resultRepository.AddAsync(result);
    }
}