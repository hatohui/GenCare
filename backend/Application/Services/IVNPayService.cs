﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Application.Services;
public interface IVNPayService
{
    Task<string> CreatePaymentUrl(string purchaseId, string ipAddress);
    Task IpnAction(IQueryCollection vnpayData);
}
