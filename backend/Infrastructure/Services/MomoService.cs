using System.Security.Cryptography;
using System.Text;
using Application.DTOs.Payment;
using Application.DTOs.Payment.Momo;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Infrastructure.Services;
public class MomoService(IOptions<MomoConfig> momoConfig,
    HttpClient httpClient,
    IServiceRepository serviceRepository,
    IPurchaseRepository purchaseRepository,
    IPaymentHistoryService paymentHistoryService,
    IResultService resultService) : IMomoService
{

    public async Task<MomoPaymentResponse> CreatePaymentAsync(string purchaseId)
    {
        //get purchase
        var purchase = await purchaseRepository.GetById(Guid.Parse(purchaseId));
        if (purchase == null)
        {
            throw new AppException(404, "Purchase not found");
        }
        //calculate total amount
        var paymentHis = await paymentHistoryService.GetPaymentHistoryById(purchase.Id);
        //calculate total amount
        if (paymentHis == null)
        {
            throw new AppException(404, $"Payment history of {purchase.Id} not found");
        }
        decimal amount = paymentHis.Amount;
        int amountTmp = (int)amount;

        //tạo mới 1 mã payid để gửi cho vnpay và lưu mã đó cho payment_history
        Guid payId = Guid.NewGuid();
        string strPayId = payId.ToString("D");
        paymentHis.PayId = payId;
        await paymentHistoryService.UpdatePaymentHistoryAsync(paymentHis);

        var orderInfo = $"Payment for purchase {purchase.Id.ToString("D")}";
        var returnUrl = momoConfig.Value.ReturnUrl;
        var notifyUrl = momoConfig.Value.NotifyUrl;
        //var amount = request.Amount;
        //var orderId = request.OrderId;
        var requestId = Guid.NewGuid().ToString();
        var extraData = string.Empty;

        // Tạo raw signature để kiểm tra, các data trong
        // đây được quy định theo doc của MoMo
        var rawSignature =
            $"accessKey={momoConfig.Value.AccessKey}" +
            $"&amount={amount.ToString("F0")}" +
            $"&extraData={extraData}" +
            $"&ipnUrl={notifyUrl}" +
            $"&orderId={strPayId}" +
            $"&orderInfo={orderInfo}" +
            $"&partnerCode={momoConfig.Value.PartnerCode}" +
            $"&redirectUrl={returnUrl}" +
            $"&requestId={requestId}" +
            $"&requestType={momoConfig.Value.RequestType}";


        var signature = ComputeHmacSha256(rawSignature, momoConfig.Value.SecretKey);

        //tạo 1 object chứa dữ liệu cần gửi đi
        var requestData = new
        {
            partnerCode = momoConfig.Value.PartnerCode,
            requestId = requestId!,
            amount = amountTmp.ToString(), // Convert to string with no decimal places
            orderId = strPayId,
            orderInfo = orderInfo!,
            redirectUrl = returnUrl!,
            ipnUrl = notifyUrl!,
            requestType = momoConfig.Value.RequestType,
            extraData = extraData!,
            lang = "vi",
            signature = signature!
        };

        //tạo 1 body cho http request
        var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");

        //gửi http post request đến endpoint của MOMO API
        var response = await httpClient.PostAsync(momoConfig.Value.Endpoint, content);

        //đọc toàn bộ nội dung phản hồi trả về từ MOMO API(dạng chuỗi)x
        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Momo API call failed: {response.StatusCode} - {responseContent}");
        }
        //chuyển nội dung json trả về từ MOMO API sang đối tượng MomoPaymentResponse
        return JsonConvert.DeserializeObject<MomoPaymentResponse>(responseContent) ?? throw new Exception("Momo payment response is null");
    }

    public async Task<string> ProcessPaymentCallback(MomoIpnRequest request)
    {
        string response = "";

        var partnerCode = request.PartnerCode;
        var orderId = request.OrderId;
        var requestId = request.RequestId;
        var amount = request.Amount;
        var orderInfo = request.OrderInfo;
        var orderType = request.OrderType;
        var transId = request.TransId;
        var resultCode = request.ResultCode;
        var message = request.Message;
        var payType = request.PayType;
        var responseTime = request.ResponseTime;
        var extraData = request.ExtraData;
        var signature = request.Signature;


        // Tạo raw signature để kiểm tra, các data trong
        // đây được quy định theo doc của MoMo
        var rawSignature =
            $"accessKey={momoConfig.Value.AccessKey}" +
            $"&amount={amount}" +
            $"&extraData={extraData}" +
            $"&message={message}" +
            $"&orderId={orderId}" +
            $"&orderInfo={orderInfo}" +
            $"&orderType={orderType}" +
            $"&partnerCode={partnerCode}" +
            $"&payType={payType}" +
            $"&requestId={requestId}" +
            $"&responseTime={responseTime}" +
            $"&resultCode={resultCode}" +
            $"&transId={transId}";


        var checkSignature = ComputeHmacSha256(rawSignature, momoConfig.Value.SecretKey);

        if (signature == checkSignature && resultCode == 0)
        {
            Guid payIdTmp = Guid.Parse(orderId);
            var paymentHistory = await paymentHistoryService.GetPaymentHistoryByPayId(payIdTmp);
            //xử lý db
            if (paymentHistory == null)
            {
                throw new AppException(404, $"Payment history with PayId {orderId} not found");
            }
            paymentHistory.TransactionId = transId.ToString();
            paymentHistory.Status = PaymentStatus.Paid;
            paymentHistory.PaymentMethod = PaymentMethod.Momo;
            //
            //await paymentHistoryService.CreatePaymentHistoryAsync(model);

            await paymentHistoryService.UpdatePaymentHistoryAsync(paymentHistory);
            //create test result for all order details
            //get purchase by id
            var purchase = await purchaseRepository.GetById(paymentHistory.PurchaseId);
            var orderDetails = purchase?.OrderDetails;
            if (orderDetails != null)
            {
                foreach (var orderDetail in orderDetails)
                {
                    Result result = new()
                    {
                        OrderDetail = orderDetail,
                        OrderDate = DateTime.Now,
                        UpdatedAt = DateTime.Now,
                    };
                    await resultService.AddResult(result);
                }
            }

            response = "Payment processed successfully";
        }
        else
        {
            response = "Invalid signature";
        }
        return response;
    }

    private string ComputeHmacSha256(string data, string secretKey)
    {
        var keyBytes = Encoding.UTF8.GetBytes(secretKey);
        var messageBytes = Encoding.UTF8.GetBytes(data);

        byte[] hashBytes;

        using (var hmac = new HMACSHA256(keyBytes))
        {
            hashBytes = hmac.ComputeHash(messageBytes);
        }

        var hashString = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();

        return hashString;
    }
}
