﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Blog.Request;
public class BlogUpdateRequest
{
    public string? Title { get; set; }
    public string? Content { get; set; }
    public string? Author { get; set; }
}
