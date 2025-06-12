using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth.Responses;
public class ForgotPasswordResponse
{
    public string CallbackUrl { get; set; } = null!;
}
