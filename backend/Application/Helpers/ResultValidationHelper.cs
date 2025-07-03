using Application.DTOs.Result.Request;
using Domain.Entities;
using Domain.Exceptions;
using Newtonsoft.Json;

namespace Application.Helpers;

public static class ResultValidationHelper
{
    public static void ValidateDateLogic(DateTime? sampleDate, DateTime? resultDate, UpdateTestResultRequest request)
        {
            if (sampleDate != null && resultDate != null && resultDate < sampleDate)
                throw new AppException(400, "Result date cannot be earlier than sample date.");

            if (request.Status == true && (sampleDate == null || resultDate == null || request.ResultData == null))
                throw new AppException(400, "To set status to true, SampleDate, ResultDate, and ResultData must be provided.");
        }

        public static bool UpdateOrderDate(UpdateTestResultRequest request, Result testResult)
        {
            if (request.OrderDate != null && ToUnspecified(testResult.OrderDate) != ToUnspecified(request.OrderDate.Value))
            {
                testResult.OrderDate = ToUnspecified(request.OrderDate.Value);
                return true;
            }
            return false;
        }

        public static bool UpdateSampleDate(DateTime? sampleDate, Result testResult)
        {
            if (sampleDate != null && (!testResult.SampleDate.HasValue || ToUnspecified(testResult.SampleDate.Value) != ToUnspecified(sampleDate.Value)))
            {
                testResult.SampleDate = ToUnspecified(sampleDate.Value);
                return true;
            }
            return false;
        }

        public static bool UpdateResultDate(DateTime? resultDate, Result testResult)
        {
            if (resultDate != null && (!testResult.ResultDate.HasValue || ToUnspecified(testResult.ResultDate.Value) != ToUnspecified(resultDate.Value)))
            {
                testResult.ResultDate = ToUnspecified(resultDate.Value);
                return true;
            }
            return false;
        }

        public static bool UpdateResultData(UpdateTestResultRequest request, Result testResult)
        {
            if (request.ResultData != null)
            {
                var newJson = JsonConvert.SerializeObject(request.ResultData);
                if (testResult.ResultData != newJson)
                {
                    testResult.ResultData = newJson;
                    return true;
                }
            }
            return false;
        }

        public static bool UpdateStatus(UpdateTestResultRequest request, Result testResult)
        {
            if (request.Status != null && testResult.Status != request.Status.Value)
            {
                testResult.Status = request.Status.Value;
                return true;
            }
            return false;
        }

        private static DateTime ToUnspecified(DateTime dt)
        {
            return DateTime.SpecifyKind(dt, DateTimeKind.Unspecified);
        }
    }
