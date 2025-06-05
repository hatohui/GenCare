using Application.DTOs.Auth.Requests;
using Application.Services;
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
    public async Task<IActionResult> LoginAsync([FromBody] AccountLoginRequest request)
    {
        var result = await accountService.LoginAsync(request);
        if (result is null)
        {
            return BadRequest("Invalid credentials.");
        }
        return Ok(result);
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
    public Task<IActionResult> RefreshTokenAsync([FromBody] RefreshTokenRequest dto)
    {
        throw new NotImplementedException("Token refresh is not implemented yet.");
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
        return Ok(payload);
    }

    /// <summary>
    ///     Logs out the current user by revoking their refresh token.
    /// </summary>
    /// <param name="dto">The refresh token to revoke.</param>
    /// <returns>Returns 204 if successful.</returns>
    /// <response code="204">Token revoked successfully.</response>
    /// <response code="400">Invalid or missing token.</response>
    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> LogoutAsync([FromBody] RevokeTokenRequest dto)
    {
        if (string.IsNullOrWhiteSpace(dto.RefreshToken))
        {
            return BadRequest("Refresh token is required.");
        }

        var success = await accountService.RevokeRefreshTokenAsync(dto.RefreshToken);
        if (!success)
        {
            return BadRequest("Failed to revoke token or token not found.");
        }

        return NoContent(); // 204
    }

    /// <summary>
    ///     Test endpoint to throw an exception for testing error handling.
    /// </summary>
    /// <returns>Throws a test exception.</returns>
    /// <response code="500">Throws a test error.</response>
    [HttpGet("test-exception")]
    public IActionResult ThrowTest()
    {
        throw new Exception("This is a test error");
    }


    /// <summary>
    /// Initiates the forgot password process by sending a reset password link to the user's email.
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
    /// Resets the user's password using a reset token and new password.
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