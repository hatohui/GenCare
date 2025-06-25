using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Payment.Momo;
public class MomoPaymentRequest
{
    public string PartnerCode { get; set; } = null!;
    //requestId
    public string RequestId { get; set; } = null!;
    //amount
    public long Amount { get; set; }
    //orderId
    public string OrderId { get; set; } = null!;
    //orderInfo
    public string OrderInfo { get; set; } = null!;
    //redirectUrl
    public string RedirectUrl { get; set; } = null!;
    //ipnUrl
    public string IpnUrl { get; set; } = null!;
    //requestType
    public string RequestType { get; set; } = null!;
    //extraData
    public string ExtraData { get; set; } = null!;
    //lang
    public string Lang { get; set; } = "vi"; // Default to Vietnamese
    //signature
    public string Signature { get; set; } = null!;
}
