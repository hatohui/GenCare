﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services;
public interface IOrderDetailService
{
    Task DeleteOrderDetail(string orderDetailId, string accountId);
}
