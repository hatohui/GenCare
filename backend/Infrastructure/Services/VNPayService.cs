
using Application.DTOs.Payment;
using Application.DTOs.Payment.VNPay;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Services;
public class VNPayService(IOptions<VNPayConfig> VNPayConfig, 
                        IPurchaseRepository purchaseRepository,
                        IServiceRepository serviceRepository,
                        IPaymentHistoryService paymentHistoryService,
                        IResultService resultService) : IVNPayService
{
    public async Task<string> CreatePaymentUrl(string purchaseId, string ipAddress)
    {
        //get purchase
        var purchase = await purchaseRepository.GetById(Guid.Parse(purchaseId));
        if (purchase == null)
        {
            throw new AppException(404, "Purchase not found");
        }
        //calculate total amount
        decimal amount = 0;
        foreach (var orderDetail in purchase.OrderDetails)
        {
            var service = await serviceRepository.SearchServiceByIdAsync(orderDetail.ServiceId);
            if (service != null) amount += service.Price;
        }

        //vnpay config
        var vnp_TmnCode = VNPayConfig.Value.Vnp_TmnCode;
        var vnp_HashSecret = VNPayConfig.Value.Vnp_HashSecret;
        var vnp_Url = VNPayConfig.Value.Vnp_Url;
        var vnp_ReturnUrl = VNPayConfig.Value.Vnp_ReturnUrl;

        //build url for vnpay
        VnPayLibrary vnpay = new VnPayLibrary();
        vnpay.AddRequestData("vnp_Version", VnPayLibrary.VERSION);
        vnpay.AddRequestData("vnp_Command", "pay");
        vnpay.AddRequestData("vnp_TmnCode", vnp_TmnCode);
        vnpay.AddRequestData("vnp_Amount", (amount * 100).ToString()); //Số tiền thanh toán. Số tiền không 
        //mang các ký tự phân tách thập phân, phần nghìn, ký tự tiền tệ. Để gửi số tiền thanh toán là 100,000 VND
        //(một trăm nghìn VNĐ) thì merchant cần nhân thêm 100 lần(khử phần thập phân), sau đó gửi sang VNPAY
        //là: 10000000
        vnpay.AddRequestData("vnp_CreateDate", DateTime.Now.ToString("yyyyMMddHHmmss"));
        vnpay.AddRequestData("vnp_CurrCode", "VND");
        vnpay.AddRequestData("vnp_IpAddr", ipAddress);
        vnpay.AddRequestData("vnp_Locale", "vn");
        vnpay.AddRequestData("vnp_OrderInfo", "Thanh toan don hang:" + purchaseId);
        vnpay.AddRequestData("vnp_OrderType", "other"); //default value: other
        vnpay.AddRequestData("vnp_ReturnUrl", vnp_ReturnUrl);

        //tạo mới 1 mã payid để gửi cho vnpay và lưu mã đó cho payment_history
        Guid tmp = new();
        vnpay.AddRequestData("vnp_TxnRef", purchaseId); // Mã tham chiếu của giao dịch tại hệ 
        //thống của merchant.Mã này là duy nhất dùng để phân biệt các đơn hàng gửi sang VNPAY.Không được
        //        trùng lặp trong ngày
        vnpay.AddRequestData("vnp_ExpireDate", DateTime.Now.AddMinutes(15).ToString("yyyyMMddHHmmss"));
        string paymentUrl = vnpay.CreateRequestUrl(vnp_Url, vnp_HashSecret);

        return paymentUrl;
    }

    public async Task IpnAction(IQueryCollection vnpayData)
    { 
        string returnContent = string.Empty;
        if (vnpayData.Count <= 0)
        {
            returnContent = "Input are required";
            throw new AppException(400, returnContent);
        }
        VnPayLibrary vnpay = new VnPayLibrary();
        foreach (var key in vnpayData.Keys)
        {
            //get all querystring data
            if (!string.IsNullOrEmpty(key) && key.StartsWith("vnp_"))
            {
                vnpay.AddResponseData(key, vnpayData[key]);
            }
        }
        //Lay danh sach tham so tra ve tu VNPAY
        //vnp_TxnRef: Ma don hang merchant gui VNPAY tai command=pay    
        //vnp_TransactionNo: Ma GD tai he thong VNPAY
        //vnp_ResponseCode:Response code from VNPAY: 00: Thanh cong, Khac 00: Xem tai lieu
        //vnp_SecureHash: HmacSHA512 cua du lieu tra ve
        string purchaseId = vnpay.GetResponseData("vnp_TxnRef");
        decimal amount = 0;
        if (!decimal.TryParse(vnpay.GetResponseData("vnp_Amount"), out amount))
        {
            throw new AppException(400, "Invalid amount format");
        }
        string transactionId = vnpay.GetResponseData("vnp_TransactionNo");
        string responseCode = vnpay.GetResponseData("vnp_ResponseCode");
        string transactionStatus = vnpay.GetResponseData("vnp_TransactionStatus");
        string vnp_SecureHash = vnpay.GetResponseData("vnp_SecureHash");
        bool checkSignature = vnpay.ValidateSignature(vnp_SecureHash, VNPayConfig.Value.Vnp_HashSecret);
        if (checkSignature)
        {
            //xử lý db
            PaymentHistoryModel model = new()
            {
                PurchaseId = purchaseId,
                TransactionId = transactionId,
                Amount = amount,
                PaymentMethod = PaymentMethod.VNPay
            };

            await paymentHistoryService.CreatePaymentHistoryAsync(model);
            //create test result for all order details
            //get purchase by id
            var purchase = await purchaseRepository.GetById(Guid.Parse(purchaseId));
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

        }
        else
        {
            returnContent = "Invalid signature";
            throw new AppException(400, returnContent);
        }
    }
}
