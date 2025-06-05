using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth.Requests;
public record class ForgotPasswordRequest
{
    public string? Email { get; set; }
}
