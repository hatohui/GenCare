﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Domain.Entities;

namespace Application.Repositories;
public interface IStaffInfoRepository
{
    Task AddStaffInfoAsync(StaffInfo staffInfo); 
}
