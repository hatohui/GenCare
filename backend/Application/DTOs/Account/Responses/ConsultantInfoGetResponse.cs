﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Account.Responses;
public class ConsultantInfoGetResponse
{
    public int TotalCount { get; set; }
    public List<ConsultantInfoModel> Consultants { get; set; } = null!;
}
