using System.IdentityModel.Tokens.Jwt;
using Application.DTOs.Auth.Request;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] UserRegisterRequest dto)
    {
        var userId = await authService.RegisterAsync(dto).ConfigureAwait(false);
        return Ok(new
        {
            message = "User registered successfully",
            userId
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] UserLoginRequest request)
    {
        var result = await authService.LoginAsync(request).ConfigureAwait(false);
        return Ok(result);
    }

    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest dto)
    {
        var result = await authService.RefreshTokenAsync(dto).ConfigureAwait(false);
        return Ok(result);
    }

    [Authorize]
    [HttpGet("profile")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public IActionResult GetProfile()
    {
        var userId = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        return Ok(new
        {
            message = "Access token valid.",
            userId
        });
    }

    [HttpGet("test-exception")]
    public IActionResult ThrowTest()
    {
        throw new Exception("This is a test error");
    }
}