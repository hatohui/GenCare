using Application.DTOs.Account.Requests;
using Application.DTOs.Account.Responses;
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
    public async Task<IActionResult> GetAccountsByPage([FromQuery] GetAccountByPageRequest request)
    {
        if (request.Page < 0)
        {
            return BadRequest("Page index must be greater than or equal to 0.");
        }
        if (request.Count <= 0)
        {
            return BadRequest("Count must be greater than 0.");
        }
        var result = await accountService.GetAccountsByPageAsync(request.Page, request.Count);
        return Ok(result);
    }
}