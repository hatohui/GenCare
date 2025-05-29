using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs.Auth.Responses;
public class UserRegisterResponse
{
    public string RefreshToken { get; set; } = null!;
    public string AccessToken { get; set; } = null!;
}
