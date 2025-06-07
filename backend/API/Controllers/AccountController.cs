using Application.DTOs.Account;
using Application.DTOs.Account.Requests;
using Application.DTOs.Account.Responses;
using Application.Helpers;
using Application.Services;
using Domain.Common.Constants;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers;

/// <summary>
///     Handles account-related API endpoints such as retrieving account lists with pagination.
/// </summary>
[ApiController]
[Route("api/accounts")]
public class AccountController(IAccountService accountService) : ControllerBase
{
    /// <summary>
    ///     Retrieves a paginated list of user accounts.
    /// </summary>
    /// <param name="request">The pagination request containing page index and item count per page.</param>
    /// <returns>
    ///     A <see cref="GetAccountByPageResponse" /> containing the list of user accounts.
    /// </returns>
    /// <response code="200">Returns the list of accounts successfully.</response>
    /// <response code="401">Unauthorized. Access token is missing or invalid.</response>
    /// <response code="403">Forbidden. Only users with Admin or Manager roles can access this endpoint.</response>
    [HttpGet]
    [ProducesResponseType(typeof(GetAccountByPageResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [Authorize(Roles = $"{RoleNames.Admin},{RoleNames.Manager}")]
    public async Task<IActionResult> GetAccountsByPage([FromQuery] GetAccountByPageRequest request, [FromQuery] string? search)
    {
        if (request.Page < 0)
        {
            return BadRequest("Page index must be greater than or equal to 0.");
        }
        if (request.Count <= 0)
        {
            return BadRequest("Count must be greater than 0.");
        }
        var result = await accountService.GetAccountsByPageAsync(request.Page, request.Count, search);
        return Ok(result);
    }


    [HttpPost("staff-create")]
    public async Task<IActionResult> CreateStaffAccountAsync([FromBody] StaffAccountCreateRequest request)
    {
        //get access token from header
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //check if access token is null or empty
        if (string.IsNullOrEmpty(accessToken))
            return Unauthorized("Access token is required.");
        //create
        var result = await accountService.CreateStaffAccountAsync(request, accessToken);
        return Ok(result);
    }
    
    [HttpGet("me")]
    [ProducesResponseType(typeof(AccountViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Authorize] // Đảm bảo người dùng đã đăng nhập
    public async Task<IActionResult> GetCurrentUser()
    {
        var token = AuthHelper.GetAccessToken(HttpContext);

        // Trích xuất thông tin tài khoản từ token
        var accountId = JwtHelper.GetAccountIdFromToken(token);

        var account = await accountService.GetAccountByIdAsync(accountId);

        var accountViewModel = new AccountViewModel
        {
            Id = accountId,
            FirstName = account.FirstName ?? string.Empty,
            LastName = account.LastName ?? string.Empty,
            AvatarUrl = account.AvatarUrl,
            DateOfBirth = account.DateOfBirth,
            Email = account.Email,
            Gender = account.Gender,
            RoleName = account.Role.Name,
            IsDeleted = account.IsDeleted
        };

        return Ok(accountViewModel);
    }
}