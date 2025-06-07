using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.Services;
using Domain.Exceptions;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
///     Handles authentication-related actions like registration, login, profile retrieval, and token refresh.
/// </summary>
/// <remarks>
///     Initializes a new instance of the <see cref="AuthController" /> class.
/// </remarks>
/// <param name="accountService">The authentication service.</param>
[ApiController]
[Route("api/auth")]
public class AuthController
(
    IAccountService accountService,
    IGoogleCredentialService googleCredentialService
) : ControllerBase
{
    /// <summary>
    /// Registers a new user in the system.
    /// </summary>
    /// <param name="request">The user registration details.</param>
    /// <returns>An action result containing refresh token, access token and access token expiration.</returns>
    /// <response code="200">User registered successfully.</response>
    /// <response code="400">Bad request if the user data is invalid.</response>
    [HttpPost("register")]
    public async Task<IActionResult> RegisterAsync([FromBody] AccountRegisterRequest request)
    {
        var response = await accountService.RegisterAsync(request);
        return Ok(response);
    }

    /// <summary>
    ///     Logs in a user and generates a JWT access token.
    /// </summary>
    /// <param name="request">The login credentials (email and password).</param>
    /// <returns>The JWT access token and related information.</returns>
    /// <response code="200">Successfully logged in and token generated.</response>
    /// <response code="400">Invalid credentials.</response>
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> LoginAsync([FromBody] AccountLoginRequest request)
    {
        var (accessToken, refreshToken) = await accountService.LoginAsync(request);

        Response.Cookies.Append(
            "refreshToken",
            refreshToken,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.Now.AddDays(7),
                Path = "/"
            });

        return Ok(new AccountLoginResponse(accessToken));
    }

    /// <summary>
    ///     Refreshes the JWT access token using a valid refresh token.
    /// </summary>
    /// <param name="dto">The refresh token request containing the valid refresh token.</param>
    /// <returns>The new JWT access token and refresh token.</returns>
    /// <response code="200">Successfully refreshed the token.</response>
    /// <response code="400">Invalid refresh token.</response>
    [AllowAnonymous]
    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshTokenAsync()
    {
        if (!Request.Cookies.TryGetValue("refreshToken", out var oldRefresh))
        {
            throw new AppException(401, "Missing refresh token cookie");
        }

        var (accessToken, newRefresh) = await accountService.RefreshAccessTokenAsync(oldRefresh);

        Response.Cookies.Append(
            "refreshToken",
            newRefresh,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = true,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.Now.AddDays(7),
                Path = "/"
            });

        return Ok(new { accessToken });
    }

    /// <summary>
    ///     Retrieves the profile of the logged-in user.
    /// </summary>
    /// <returns>The profile information of the authenticated user.</returns>
    /// <response code="200">Successfully retrieved the user's profile.</response>
    /// <response code="401">Unauthorized if the user is not authenticated.</response>
    [Authorize]
    [HttpGet("profile")]
    [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
    public IActionResult GetProfile()
    {
        throw new NotImplementedException("Profile retrieval is not implemented yet.");
    }

    /// <summary>
    ///     Initiates the Google login process by redirecting to Google's OAuth 2.0 authorization endpoint.
    /// </summary>
    /// <returns>
    ///     Returns an IActionResult that challenges the user with the Google authentication scheme.
    ///     The user will be redirected to Google for login, and after successful authentication,
    ///     they will be redirected back to the GoogleCallback endpoint.
    /// </returns>
    [HttpPost("google")]
    public async Task<IActionResult> GoogleLoginAsync([FromBody] GoogleLoginRequest request)
    {
        var clientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID");
        if (string.IsNullOrEmpty(clientId))
        {
            return BadRequest("Google Client ID is not configured.");
        }

        var payload = await googleCredentialService.VerifyGoogleCredentialAsync(clientId, request.Credential);

        var (accessToken, refreshToken) = await accountService.LoginWithGoogleAsync(payload);

        Response.Cookies.Append(
                    "refreshToken",
                    refreshToken,
                    new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true,
                        SameSite = SameSiteMode.Lax,
                        Expires = DateTimeOffset.Now.AddDays(7),
                        Path = "/"
                    });

        return Ok(new AccountLoginResponse(accessToken));
    }

    [Authorize]
    [HttpPost("logout")]

    public async Task<IActionResult> LogoutAsync()
    {
        var refreshToken = Request.Cookies["refreshToken"];
        if (string.IsNullOrWhiteSpace(refreshToken))
        {
            return BadRequest("Refresh token is required.");
        }

        var success = await accountService.RevokeRefreshTokenAsync(refreshToken);
        if (!success)
        {
            return BadRequest("Failed to revoke token or token not found.");
        }

        Response.Cookies.Delete("refreshToken");
        return NoContent();
    }

    /// <summary>
    ///     Initiates the forgot password process by sending a reset password link to the user's email.
    /// </summary>
    /// <param name="request">forgot password request</param>
    /// <returns>response containing forgot password URL</returns>
    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPasswordSync([FromBody] ForgotPasswordRequest request)
    {
        var response = await accountService.ForgotPasswordAsync(request);
        return Ok(response);
    }

    /// <summary>
    ///     Resets the user's password using a reset token and new password.
    /// </summary>
    /// <param name="request">reset password request</param>
    /// <returns>message of resetting password successfully</returns>
    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPasswordAsync([FromBody] ResetPasswordRequest request)
    {
        var response = await accountService.ResetPasswordAsync(request);
        return Ok(response);
    }

}
