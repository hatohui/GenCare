using Application.DTOs.Purchase;
using Application.DTOs.TestTracker.Request;
using Application.DTOs.TestTracker.Response;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;

namespace Infrastructure.Services;

public class TestTrackerService(ITestTrackerRepository testTrackerRepository,
                                IPurchaseRepository purchaseRepository,
                                IPaymentHistoryRepository paymentHistoryRepository,
                                IOrderDetailRepository orderDetailRepository,
                                IServiceRepository serviceRepository
                                ) : ITestTrackerService
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

        //get order detail by id
        var orderDetail = await orderDetailRepository.GetByIdAsync(orderDetailId);
        if (orderDetail == null)
            throw new AppException(404, "Order detail not found.");

        //get purchase by order detail
        var purchase = await purchaseRepository.GetById(orderDetail.PurchaseId);
        if (purchase == null)
            throw new AppException(404, "Purchase not found.");

        //check if the account is authorized to view this test result
        if (purchase.AccountId != accountId)
            throw new AppException(403, "You are not authorized to view this test result.");
        //get payment history by purchase,
        //check if payment is completed
        var payment = await paymentHistoryRepository.GetById(purchase.Id);
        if (payment == null)
            throw new AppException(402, "No payment record found.");
        if (payment.Status.Trim() != PaymentStatus.Paid.Trim())
            throw new AppException(402, "Payment is not completed.");

        var testResult = await testTrackerRepository.ViewResultAsync(orderDetailId) ??
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
    public async Task<UpdateTestResultResponse> UpdateResultAsync(UpdateTestResultRequest request)
    {
        if (!Guid.TryParse(request.OrderDetailId, out Guid orderDetailId))
            throw new AppException(400, "Invalid AccountId format.");
        var testResult = await testTrackerRepository.ViewResultAsync(orderDetailId)
                         ?? throw new InvalidOperationException("Test result not found.");

        bool isChanged = false;

        var sampleDate = request.SampleDate?.ToLocalTime();
        var resultDate = request.ResultDate?.ToLocalTime();
        if (sampleDate != null && resultDate != null && resultDate < sampleDate)
            throw new AppException(400, "Result date cannot be earlier than sample date.");

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
            await testTrackerRepository.UpdateResultAsync(testResult);
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
        if (!await testTrackerRepository.CheckResultExistsAsync(request.OrderDetailId))
            throw new InvalidOperationException("Test tracker not found.");

        var deleted = await testTrackerRepository.DeleteResultAsync(request.OrderDetailId);
        return new DeleteTestResultResponse
        {
            Success = deleted,
            Message = deleted ? "Deleted successfully." : "Failed to delete test result."
        };
    }

    public async Task<List<BookedServiceModel>> GetBookedServiceModelAsync()
    {
        var purchases = await purchaseRepository.GetAllPurchasesAsync(); // lấy tất cả purchases (bao gồm OrderDetails)
        var result = new List<BookedServiceModel>();

        foreach (var purchase in purchases)
        {
            foreach (var od in purchase.OrderDetails)
            {
                var service = await serviceRepository.SearchServiceByIdAsync(od.ServiceId);
                if (service == null) continue;

                result.Add(new BookedServiceModel
                {
                    OrderDetailId = od.Id,
                    ServiceName = service.Name,
                    FirstName = od.FirstName,
                    LastName = od.LastName,
                    PhoneNumber = od.Phone,
                    DateOfBirth = od.DateOfBirth.ToDateTime(TimeOnly.MinValue),
                    Gender = od.Gender,
                    CreatedAt = purchase.CreatedAt,
                });
            }
        }

        return result;
    }

    public async Task AddResult(Result result)
    {
        await testTrackerRepository.AddAsync(result);
    }
}