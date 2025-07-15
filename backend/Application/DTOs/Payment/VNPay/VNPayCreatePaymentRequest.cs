using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Payment.VNPay;
public class VNPayCreatePaymentRequest
{
    public string Vnp_Version { get; set; } = "2.1.0";
    public string Vnp_Command { get; set; } = "pay";
    public string Vnp_TmnCode { get; set; } = null!;
    public decimal Vnp_Amount { get; set; }
    public DateTime Vnp_CreateDate { get; set; } = DateTime.Now;
    public string Vnp_CurrCode { get; set; } = "VND";
    public string Vnp_IpAddr { get; set; } = null!;
    public string Vnp_Locate { get; set; } = "vn";
    public string Vnp_OrderInfo { get; set; } = null!;
    public string Vnp_ReturnUrl { get; set; } = null!;
    public DateTime Vnp_ExpireDate { get; set; } = DateTime.Now.AddMinutes(15);
    public string Vnp_TxnRef { get; set; } = null!;
    public string Vnp_SecureHash { get; set; } = null!;
}
