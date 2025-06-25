using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Payment.Momo;
public class MomoIpnRequest
{
    //partnerCode
    public string PartnerCode { get; set; } = null!;
    //orderId
    public string OrderId { get; set; } = null!;
    //requestId
    public string RequestId { get; set; } = null!;
    //amount
    public long Amount { get; set; }
    //orderInfo
    public string OrderInfo { get; set; } = null!;
    //orderType
    public string OrderType { get; set; } = null!;
    //transId
    public long TransId { get; set; }
    //resultCode
    public int ResultCode { get; set; }
    //message
    public string Message { get; set; } = null!;
    //payType
    public string PayType { get; set; } = null!;
    //responseTime
    public long ResponseTime { get; set; }
    //extraData
    public string ExtraData { get; set; } = null!;
    //signature
    public string Signature { get; set; } = null!;
}
