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

namespace API.Controllers
{
    /// <summary>
    /// Handles authentication-related actions like registration, login, profile retrieval, and token refresh.
    /// </summary>
    /// <remarks>
    /// Initializes a new instance of the <see cref="AuthController"/> class.
    /// </remarks>
    /// <param name="authService">The authentication service.</param>
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        /// <summary>
        /// Registers a new user in the system.
        /// </summary>
        /// <param name="dto">The user registration details.</param>
        /// <returns>An action result containing the user ID and a success message.</returns>
        /// <response code="200">User registered successfully.</response>
        /// <response code="400">Bad request if the user data is invalid.</response>
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

        /// <summary>
        /// Logs in a user and generates a JWT access token.
        /// </summary>
        /// <param name="request">The login credentials (email and password).</param>
        /// <returns>The JWT access token and related information.</returns>
        /// <response code="200">Successfully logged in and token generated.</response>
        /// <response code="400">Invalid credentials.</response>
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] UserLoginRequest request)
        {
            var result = await authService.LoginAsync(request).ConfigureAwait(false);
            return Ok(result);
        }

        /// <summary>
        /// Refreshes the JWT access token using a valid refresh token.
        /// </summary>
        /// <param name="dto">The refresh token request containing the valid refresh token.</param>
        /// <returns>The new JWT access token and refresh token.</returns>
        /// <response code="200">Successfully refreshed the token.</response>
        /// <response code="400">Invalid refresh token.</response>
        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest dto)
        {
            var result = await authService.RefreshTokenAsync(dto).ConfigureAwait(false);
            return Ok(result);
        }

        /// <summary>
        /// Retrieves the profile of the logged-in user.
        /// </summary>
        /// <returns>The profile information of the authenticated user.</returns>
        /// <response code="200">Successfully retrieved the user's profile.</response>
        /// <response code="401">Unauthorized if the user is not authenticated.</response>
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

        /// <summary>
        /// Initiates the Google login process by redirecting to Google's OAuth 2.0 authorization endpoint.
        /// </summary>
        /// <returns>
        /// Returns an IActionResult that challenges the user with the Google authentication scheme.
        /// The user will be redirected to Google for login, and after successful authentication,
        /// they will be redirected back to the GoogleCallback endpoint.
        /// </returns>
        [HttpPost("google-login")]
        public IActionResult GoogleLogin()
        {
            var properties = new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleCallback")
            };
            return Challenge(properties, GoogleDefaults.AuthenticationScheme);
        }

        /// <summary>
        /// Handles the callback from Google after a successful OAuth 2.0 authentication.
        /// It retrieves the user's authentication information from the cookie and generates an access token.
        /// </summary>
        /// <returns>
        /// Returns an OkObjectResult containing the access token, user's email, and name if authentication is successful.
        /// If the authentication fails, it returns an Unauthorized status with an error message.
        /// </returns>
        /// <exception cref="UnauthorizedAccessException">
        /// Thrown if the authentication fails or the user's principal is not found.
        /// </exception>
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

        /// <summary>
        /// Test endpoint to throw an exception for testing error handling.
        /// </summary>
        /// <returns>Throws a test exception.</returns>
        /// <response code="500">Throws a test error.</response>
        [HttpGet("test-exception")]
        public IActionResult ThrowTest()
        {
            throw new Exception("This is a test error");
        }
    }
}