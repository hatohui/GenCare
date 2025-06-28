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
    public async Task<IActionResult> GetAccountsByPageAsync(
        [FromQuery] GetAccountByPageRequest request
    )
    {
        var response = await accountService.GetAccountsByPageAsync(request);
        return Ok(response);
    }

    /// <summary>
    ///     Creates a new staff account.
    /// </summary>
    /// <param name="request">The staff account creation request.</param>
    /// <returns>
    ///     The created staff account information.
    /// </returns>
    /// <response code="201">Staff account created successfully.</response>
    /// <response code="401">Unauthorized. Access token is missing or invalid.</response>
    /// <response code="400">Bad request. Invalid input data.</response>
    [HttpPost]
    public async Task<IActionResult> CreateStaffAccountAsync(
        [FromBody] StaffAccountCreateRequest request
    )
    {
        //get access token from header
        var accessToken = AuthHelper.GetAccessToken(HttpContext);
        //check if access token is null or empty
        if (string.IsNullOrEmpty(accessToken))
            return Unauthorized("Access token is required.");
        //create
        var result = await accountService.CreateStaffAccountAsync(request, accessToken);
        return Created($"api/accounts/{result.Id}", result);
        //IActionResult: Ok, BadRequest, Unauthorized, NotFound, etc.
    }

    [HttpGet("me")]
    [ProducesResponseType(typeof(ProfileViewModel), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [Authorize]
    public async Task<IActionResult> GetCurrentUser()
    {
        var token = AuthHelper.GetAccessToken(HttpContext);
        var accountId = JwtHelper.GetAccountIdFromToken(token);
        var profile = await accountService.GetProfileAsync(accountId);

        return Ok(profile);
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

        var accessToken =
            tokenHeader != null && tokenHeader.StartsWith("Bearer ")
                ? tokenHeader.Substring(7)
                : string.Empty;

        var result = await accountService.DeleteAccountAsync(
            new DeleteAccountRequest { Id = id },
            accessToken
        );

        if (result == null)
            throw new ApplicationException("Delete account failed.");

        return Ok(result);
    }

    /// <summary>
    ///     Updates an existing user account.
    /// </summary>
    /// <param name="request">The update account request containing updated information.</param>
    /// <param name="id">The ID of the account to update.</param>
    /// <returns>
    ///     An <see cref="IActionResult"/> indicating the result of the update operation.
    /// </returns>
    /// <response code="200">Account updated successfully.</response>
    /// <response code="401">Unauthorized. Access token is missing or invalid.</response>
    /// <response code="400">Bad request. Invalid input data.</response>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> UpdateAccount(
        [FromBody] UpdateAccountRequest request,
        [FromRoute] string id
    )
    {
        string accessToken = AuthHelper.GetAccessToken(HttpContext);
        await accountService.UpdateAccountAsync(request, accessToken, id);
        return Ok();
    }

    /// <summary>
    ///     Retrieves a user account by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the account to retrieve.</param>
    /// <returns>
    ///     An <see cref="IActionResult"/> containing the account details if found.
    /// </returns>
    /// <response code="200">Returns the account details successfully.</response>
    /// <response code="400">Bad request. Invalid input data.</response>
    /// <response code="401">Unauthorized. Access token is missing or invalid.</response>
    /// <response code="403">Forbidden. Only authorized users can access this endpoint.</response>
    /// <response code="404">Not found. Account with the specified ID does not exist.</response>

    [HttpGet("{id}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize(Roles = $"{RoleNames.Admin}")]
    public async Task<IActionResult> GetAccountById([FromRoute] string id)
    {
        if (string.IsNullOrEmpty(id))
            return BadRequest("Account ID is required.");
        var result = await accountService.GetAccountByIdAsync(Guid.Parse(id));

        if (result == null)
            return NotFound();

        return Ok(result);
    }

    [HttpGet("consultants")]
    public async Task<IActionResult> GetAllConsultantInfo(
        [FromQuery] int page,
        [FromQuery] int count,
        [FromQuery] string? search)
    {
        var response = await accountService.GetConsultantProfile(page, count, search);
        return Ok(response);
    }
}