using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Payment.VNPay;
public class VNPayIpnRequest
{
    public string vnp_TmnCode { get; set; } = null!;
    public decimal vnp_Amount { get; set; }
    public string vnp_BankCode { get; set; } = null!;
    public string? vnp_BankTranNo { get; set; }
    public string? vnp_CardType { get; set; }
    public string? vnp_PayDate { get; set; }
    public string vnp_OrderInfo { get; set; } = null!;
    public string vnp_TransactionNo { get; set; } = null!;
    public string vnp_ResponseCode { get; set; } = null!;
    public string vnp_TransactionStatus { get; set; } = null!;
    public string vnp_TxnRef { get; set; } = null!;
    public string vnp_SecureHash { get; set; } = null!;
}
