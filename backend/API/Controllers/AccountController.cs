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

    /// <summary>
    ///     Deletes a user account by ID.
    /// </summary>
    /// <param name="id">The ID of the account to delete.</param>
    /// <returns>
    ///     No content if successful.
    /// </returns>
    /// <response code="204">Account successfully deleted.</response>
    /// <response code="401">Unauthorized. Access token is missing or invalid.</response>
    /// <response code="403">Forbidden. Only users with Admin role can access this endpoint.</response>
    /// <response code="404">Not found. Account with the specified ID does not exist.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteAccountController(Guid id)
    {
        var tokenHeader = HttpContext.Request.Headers["Authorization"].FirstOrDefault();
        var accessToken = tokenHeader != null && tokenHeader.StartsWith("Bearer ")
            ? tokenHeader.Substring(7)
            : string.Empty;
        var result = await accountService.DeleteAccountAsync(new DeleteAccountRequest { Id = id }, accessToken);
        if (result == null) throw new ApplicationException("Delete account failed.");
        return Ok(result);
      
        
    }
}