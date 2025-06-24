using System.Security.Cryptography;
using System.Text;
using Application.DTOs.Payment;
using Application.DTOs.Payment.Momo;
using Application.Repositories;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;

namespace Infrastructure.Services;
public class MomoService(IOptions<MomoConfig> momoConfig,
    HttpClient httpClient,
    IServiceRepository serviceRepository,
    IPurchaseRepository purchaseRepository,
    IPaymentHistoryService paymentHistoryService) : IMomoService
{

    public async Task<MomoPaymentResponse> CreatePaymentAsync(string purchaseId)
    {
        //get purchase
        var purchase = await purchaseRepository.GetById(Guid.Parse(purchaseId));
        if (purchase == null)
        {
            throw new ArgumentException("Purchase not found");
        }
        //calculate total amount
        decimal amount = 0;
        foreach (var orderDetail in purchase.OrderDetails)
        {
            var service = await serviceRepository.SearchServiceByIdAsync(orderDetail.ServiceId);
            if (service != null) amount += service.Price;
        }
        var orderInfo = $"Payment for purchase {purchase.Id.ToString("D")}";
        var returnUrl = momoConfig.Value.ReturnUrl;
        var notifyUrl = momoConfig.Value.NotifyUrl;
        //var amount = request.Amount;
        //var orderId = request.OrderId;
        var requestId = Guid.NewGuid().ToString();
        var extraData = string.Empty;

        var rawSignature =
            $"accessKey={momoConfig.Value.AccessKey}" +
            $"&amount={amount.ToString("F0")}" +
            $"&extraData={extraData}" +
            $"&ipnUrl={notifyUrl}" +
            $"&orderId={purchaseId}" +
            $"&orderInfo={orderInfo}" +
            $"&partnerCode={momoConfig.Value.PartnerCode}" +
            $"&redirectUrl={returnUrl}" +
            $"&requestId={requestId}" +
            $"&requestType={momoConfig.Value.RequestType}";


        var signature = ComputeHmacSha256(rawSignature, momoConfig.Value.SecretKey);

        var requestData = new
        {
            partnerCode = momoConfig.Value.PartnerCode,
            requestId = requestId!,
            amount = Convert.ToInt64(amount), // Convert to string with no decimal places
            orderId = purchaseId,
            orderInfo = orderInfo!,
            redirectUrl = returnUrl!,
            ipnUrl = notifyUrl!,
            requestType = momoConfig.Value.RequestType,
            extraData = extraData!,
            lang = "vi",
            signature = signature!
        };

        //var requestData = new MomoPaymentRequest
        //{
        //    PartnerCode = momoConfig.Value.PartnerCode,
        //    RequestId = requestId,
        //    Amount = Convert.ToInt64(amount), //lose decimal places
        //    OrderId = purchaseId,
        //    OrderInfo = orderInfo,
        //    RedirectUrl = returnUrl,
        //    IpnUrl = notifyUrl,
        //    RequestType = momoConfig.Value.RequestType,
        //    ExtraData = extraData,
        //    Lang = "vi",
        //    Signature = signature
        //};

        var content = new StringContent(JsonConvert.SerializeObject(requestData), Encoding.UTF8, "application/json");


        var response = await httpClient.PostAsync(momoConfig.Value.Endpoint, content);

        var responseContent = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"Momo API call failed: {response.StatusCode} - {responseContent}");
        }
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


        // Tạo raw signature để kiểm tra
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

        if (signature == checkSignature)
        {
            //xử lý db
            PaymentHistoryModel model = new() 
            {
                PurchaseId = orderId.ToString(),
                TransactionId = transId.ToString(),
                Amount = Convert.ToDecimal(amount)
            };

            await paymentHistoryService.CreatePaymentHistoryAsync(model);
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
