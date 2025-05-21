using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Application.DTOs.Auth.Request;
using Application.Helpers;
using Application.Services.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
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

    [HttpPost("google-login")]
    public IActionResult GoogleLogin()
    {
        var properties = new AuthenticationProperties
        {
            RedirectUri = Url.Action("GoogleCallback")
        };
        return Challenge(properties, GoogleDefaults.AuthenticationScheme);
    }

    [HttpGet("google-callback")]
    public async Task<IActionResult> GoogleCallbackAsync()
    {
        var result = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        if (!result.Succeeded || result.Principal == null)
            return Unauthorized(new { error = "Google authentication failed" });

        var email = result.Principal.FindFirstValue(ClaimTypes.Email);
        var name = result.Principal.FindFirstValue(ClaimTypes.Name);

        var accessToken = JwtHelper.GenerateAccessToken(new User());

        return Ok(new
        {
            accessToken,
            email,
            name
        });
    }

    [HttpGet("test-exception")]
    public IActionResult ThrowTest()
    {
        throw new Exception("This is a test error");
    }
}