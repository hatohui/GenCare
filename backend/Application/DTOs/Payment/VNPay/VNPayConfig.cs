using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Payment.VNPay;
public class VNPayConfig
{
    public string Vnp_TmnCode { get; set; } = null!;
    public string Vnp_HashSecret { get; set; } = null!;
    public string Vnp_Url { get; set; } = null!;
    public string Vnp_ReturnUrl { get; set; } = null!;
}
