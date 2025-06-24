using System.Net;
using Application.DTOs.Account;
using Application.DTOs.Account.Requests;
using Application.DTOs.Account.Responses;
using Application.DTOs.Auth.Requests;
using Application.DTOs.Auth.Responses;
using Application.DTOs.Role;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Common.Constants;
using Domain.Entities;
using Domain.Exceptions;
using Google.Apis.Auth;
using Microsoft.Extensions.Caching.Distributed;

namespace Infrastructure.Services;

public class AccountService
(
    IAccountRepository accountRepo,
    IRefreshTokenRepository refTokenRepo,
    IRoleRepository roleRepo,
    IEmailService emailService,
    IDepartmentRepository departmentRepo,
    IStaffInfoRepository staffInfoRepo,
    IDistributedCache distributedCache
) : IAccountService
{
    public async Task<AccountRegisterResponse> RegisterAsync(AccountRegisterRequest request)
    {
        //check if user already exists
        var existingUser = await accountRepo.GetByEmailAsync(request.Email);
        if (existingUser is not null)
        {
            throw new Exception("User already exists");
        }

        var role =
            await roleRepo.GetRoleByNameAsync("Member")
            ?? throw new Exception("Role 'Member' not found");

        //create new user account
        var user = new Account
        {
            Gender = request.Gender,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            PasswordHash = PasswordHasher.Hash(request.Password),
            DateOfBirth = request.DateOfBirth,
            Phone = request.PhoneNumber,
            RoleId = role.Id,
            Role = role
        };
        //add user to database
        await accountRepo.AddAsync(user);

        //create refresh token
        var (refToken, refExpiration) = JwtHelper.GenerateRefreshToken(user.Id);

        var rf = new RefreshToken
        {
            AccountId = user.Id,
            Token = refToken,
            ExpiresAt = refExpiration
        };
        //add refresh token to database
        await refTokenRepo.AddAsync(rf);

        var (accToken, accExpiration) = JwtHelper.GenerateAccessToken(user);

        return new AccountRegisterResponse
        {
            RefreshToken = rf.Token,
            AccessToken = accToken,
            AccessTokenExpiration = accExpiration
        };
    }

    public async Task<ForgotPasswordResponse> ForgotPasswordAsync(ForgotPasswordRequest request)
    {
        //find user by email
        var user = await accountRepo.GetByEmailAsync(request.Email!);
        if (user is null)
        {
            throw new Exception("User not found");
        }

        //generate reset password token
        var resetPwdToken = JwtHelper.GeneratePasswordResetToken(user.Id);

        //create reset password URL
        var encodedToken = WebUtility.UrlEncode(resetPwdToken);
        var encodedEmail = WebUtility.UrlEncode(request.Email);
        var callbackUrl = $"{Environment.GetEnvironmentVariable("AppUrl")}/reset-password?email={encodedEmail}&token={encodedToken}";

        var msg = $"Link to reset your password: {callbackUrl}";
        //send email with reset password link
        await emailService.SendEmailAsync(
            request.Email!,
            "Reset Password",
            msg
        );
        //return reponse
        return new ForgotPasswordResponse
        {
            CallbackUrl = callbackUrl
        };
    }

    public async Task<ResetPasswordResponse> ResetPasswordAsync(ResetPasswordRequest request)
    {
        Guid userId;
        //check if token is valid
        var isValid = JwtHelper.ValidatePasswordResetToken(request.ResetPasswordToken!, out userId);
        if (!isValid)
        {
            throw new Exception("Invalid reset password token");
        }
        //get user by email
        var user = accountRepo.GetByEmailAsync(request.Email!) ?? throw new Exception("email in reset passsword token is invalid");
        //check userId of token and email in request
        if (!Equals(userId, user.Result!.Id))
        {
            throw new Exception("User ID in reset password token does not match email");
        }
        //update user password
        user.Result!.PasswordHash = PasswordHasher.Hash(request.NewPassword!);
        await accountRepo.UpdateAccount(user.Result);
        return new ResetPasswordResponse
        {
            msg = "Password reset successfully. You can now login with your new password."
        };
    }

    public async Task<bool> RevokeRefreshTokenAsync(string refreshToken)
    {
        var token = await refTokenRepo.GetByTokenAsync(refreshToken);
        if (token is null || token.IsRevoked)
        {
            return false;
        }

        token.IsRevoked = true;
        token.LastUsedAt = DateTime.Now;

        await refTokenRepo.UpdateAsync(token);
        return true;
    }

    public async Task<(string AccessToken, string RefreshToken)> LoginAsync(AccountLoginRequest req)
    {
        var user = await accountRepo
                       .GetAccountByEmailPasswordAsync(req.Email, req.Password)
                   ?? throw new InvalidCredentialsException();
        if (user.IsDeleted) throw new AppException(401, "Account is deleted");
        var (accessToken, _) = JwtHelper.GenerateAccessToken(user);
        var (refreshToken, _) = JwtHelper.GenerateRefreshToken(user.Id);

        await refTokenRepo.AddAsync(new RefreshToken
        {
            AccountId = user.Id,
            Token = refreshToken,
            ExpiresAt = DateTime.Now.AddDays(7)
        });

        return (accessToken, refreshToken);
    }

    public async Task<(string AccessToken, string RefreshToken)> RefreshAccessTokenAsync(string oldRefresh)
    {
        // 1) Xác thực chữ ký / hạn dùng
        var principal = JwtHelper.ValidateToken(oldRefresh); // nếu lỗi -> JwtHelper tự throw

        // 2) Phải là refresh token
        if (!string.Equals(principal.FindFirst("type")?.Value, "refresh", StringComparison.Ordinal))
        {
            throw new AppException(401, "Token is not a refresh token");
        }

        // 3) Tra DB
        var stored = await refTokenRepo.GetByTokenAsync(oldRefresh);
        if (stored is null || stored.IsRevoked || stored.ExpiresAt < DateTime.Now)
        {
            throw new AppException(401, "Refresh token expired or revoked");
        }

        // 4) Lấy user
        var user = await accountRepo.GetAccountByIdAsync(stored.AccountId)
                   ?? throw new AppException(404, "User not found");

        // 5) Phát hành token mới (dùng DateTime.Now)
        var (newAccess, _) = JwtHelper.GenerateAccessToken(user);
        var (newRefresh, newRefreshExp) = JwtHelper.GenerateRefreshToken(user.Id);

        // 6) Revoke token cũ & lưu token mới
        stored.IsRevoked = true;
        await refTokenRepo.UpdateAsync(stored);

        await refTokenRepo.AddAsync(new RefreshToken
        {
            AccountId = user.Id,
            Token = newRefresh,
            ExpiresAt = newRefreshExp
        });

        return (newAccess, newRefresh);
    }

    public async Task<(string AccessToken, string RefreshToken)> LoginWithGoogleAsync(GoogleJsonWebSignature.Payload payload)
    {
        var user = await accountRepo.GetByEmailAsync(payload.Email);
        if (user is null)
        {
            var role = await roleRepo.GetRoleByNameAsync("Member")
                       ?? throw new Exception("Role 'Member' not found");

            user = new Account
            {
                Email = payload.Email,
                FirstName = payload.GivenName ?? string.Empty,
                LastName = payload.FamilyName ?? string.Empty,
                AvatarUrl = payload.Picture ?? string.Empty,
                PasswordHash = null!,
                RoleId = role.Id,
                Role = role,
                Gender = true,
                IsDeleted = false
            };

            await accountRepo.AddAsync(user);
        }
        if (user.IsDeleted) throw new AppException(401, "Account is deleted");
        var (accessToken, accessExpiration) = JwtHelper.GenerateAccessToken(user);
        var (refreshToken, refreshExpiration) = JwtHelper.GenerateRefreshToken(user.Id);
        RefreshToken rf = new()
        {
            AccountId = user.Id,
            Token = refreshToken,
            ExpiresAt = refreshExpiration
        };
        await refTokenRepo.AddAsync(rf);

        return (accessToken, refreshToken);
    }

    public async Task<GetAccountByPageResponse> GetAccountsByPageAsync(GetAccountByPageRequest request)
    {
        // Correct paging logic: (Page - 1) * Count
        var skip = (request.Page - 1) * request.Count;

        // Now passing the correct skip value and other filters to the repository
        var accounts = await accountRepo.GetAccountsByPageAsync(skip, request.Count, request.Search, request.Role, request.Active);
        var totalCount = await accountRepo.GetTotalAccountCountAsync(request.Search, request.Role, request.Active);

        return new GetAccountByPageResponse
        {
            Accounts = accounts.ConvertAll(a => new AccountViewModel
            {
                Id = a.Id,
                Role = new RoleViewModel
                {
                    Name = a.Role.Name,
                    Description = a.Role.Description
                },
                Email = a.Email,
                FirstName = a.FirstName ?? string.Empty,
                LastName = a.LastName ?? string.Empty,
                Gender = a.Gender,
                DateOfBirth = a.DateOfBirth,
                AvatarUrl = a.AvatarUrl,
                IsDeleted = a.IsDeleted
            }),
            TotalCount = totalCount
        };
    }

    public async Task<AccountViewModel?> GetAccountByIdAsync(Guid accountId)
    {
        var account = await accountRepo.GetAccountByIdAsync(accountId);
        if (account == null)
            throw new AppException(404, "Account not found");
        AccountViewModel rs = new()
        {
            Id = account.Id,
            Email = account.Email,
            FirstName = account.FirstName ?? string.Empty,
            LastName = account.LastName ?? string.Empty,
            Gender = account.Gender,
            DateOfBirth = account.DateOfBirth,
            AvatarUrl = account.AvatarUrl,
            IsDeleted = account.IsDeleted,
            Role = new RoleViewModel
            {
                Name = account.Role.Name,
                Description = account.Role.Description
            }
        };
        return rs;
    }

    public async Task<DeleteAccountResponse> DeleteAccountAsync(DeleteAccountRequest request, string accessToken)
    {
        var role = JwtHelper.GetRoleFromToken(accessToken);
        var accountId = JwtHelper.GetAccountIdFromToken(accessToken);
        if (role != RoleNames.Admin) throw new AppException(403, "UNAUTHORIZED");
        if (request.Id == Guid.Empty) throw new AppException(400, "Guid cannot be empty.");
        var account = await accountRepo.DeleteAccountByAccountId(request.Id);
        if (account == null) throw new AppException(401, "Account not found,delete failed.");

        return new DeleteAccountResponse()
        {
            Id = account.Id,
            Email = account.Email,
            IsDeleted = account.IsDeleted,
            DeletedBy = accountId.ToString(),
        };
    }

    public async Task<StaffAccountCreateResponse> CreateStaffAccountAsync(StaffAccountCreateRequest request, string accessToken)
    {
        //check if the user has permission to create staff accounts
        var role = JwtHelper.GetRoleFromAccessToken(accessToken);
        if (role == null)
            throw new AppException(401, "Invalid access token. Role not found.");
        if (role.ToLower() != RoleNames.Admin.ToLower())
            throw new AppException(401, "Invalid account to create staff account.");
        //get account id in access token
        var id = JwtHelper.GetAccountIdFromToken(accessToken);
        // Check if the account already exists by email

        //check in cache
        var cacheKey = $"account:{request.AccountRequest!.Email.ToLower()}"; // using email as cache key
        var cachedAccount = await distributedCache.GetStringAsync(cacheKey);
        if (!string.IsNullOrEmpty(cachedAccount))
        {
            // If found in cache, deserialize and return
            // convert string to Account object
            var existingAccount = Newtonsoft.Json.JsonConvert.DeserializeObject<Account>(cachedAccount);

            if (existingAccount != null)
                throw new AppException(409, "Account with this email already exists.");
        }
        //check in database
        var existingStaff = await accountRepo.GetByEmailAsync(request.AccountRequest!.Email);
        if (existingStaff != null)
        {
            // store the account in cache in 10 minutes
            // convert Account to string
            var accountJson = Newtonsoft.Json.JsonConvert.SerializeObject(existingStaff);
            // set cache with 10 minutes expiration
            var cacheOptions = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            };
            // set cache
            await distributedCache.SetStringAsync(cacheKey, accountJson, cacheOptions);

            throw new AppException(409, "Account with this email already exists.");
        }

        // Create the account
        Account newAcc = new()
        {
            Email = request.AccountRequest.Email,
            FirstName = request.AccountRequest.FirstName,
            LastName = request.AccountRequest.LastName,
            Gender = request.AccountRequest.Gender,
            Phone = request.AccountRequest.PhoneNumber,
            AvatarUrl = request.AccountRequest.AvatarUrl,
            DateOfBirth = request.AccountRequest.DateOfBirth,
            PasswordHash = PasswordHasher.Hash(request.AccountRequest.Password),
            //RoleId = Guid.Parse(request.AccountRequest.RoleId),
            Role = await roleRepo.GetRoleByIdAsync(Guid.Parse(request.AccountRequest.RoleId))
                   ?? throw new Exception("Role not found"),
            CreatedBy = id,
        };
        // add account to the database
        await accountRepo.AddAsync(newAcc);

        //check if staff info in request exists

        StaffInfo staffInfo = new()
        {
            Degree = request.StaffInfoRequest.Degree,
            YearOfExperience = request.StaffInfoRequest.YearOfExperience,
            Biography = request.StaffInfoRequest.Biography ?? string.Empty,
            Department = await departmentRepo.GetDepartmentByIdAsync(Guid.Parse(request.StaffInfoRequest.DepartmentId)) ?? throw new Exception("Department not found"),
            Account = newAcc,
        };
        //add staff info to database
        await staffInfoRepo.AddStaffInfoAsync(staffInfo);
        //add staff info to corresponding account
        newAcc.StaffInfo = staffInfo;

        // store the new account in cache in 10 minutes
        await distributedCache.SetStringAsync(
            cacheKey,
            Newtonsoft.Json.JsonConvert.SerializeObject(newAcc),
            new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10)
            }
        );

        return new StaffAccountCreateResponse()
        {
            Id = newAcc.Id.ToString("D"),
            Role = newAcc.Role.Name,
            Email = newAcc.Email,
            FirstName = newAcc.FirstName,
            LastName = newAcc.LastName,
            Gender = newAcc.Gender,
            PhoneNumber = newAcc.Phone,
            DateOfBirth = newAcc.DateOfBirth ?? default,
            AvatarUrl = newAcc.AvatarUrl,
            Degree = newAcc.StaffInfo.Degree,
            YearOfExperience = newAcc.StaffInfo.YearOfExperience,
            Biography = newAcc.StaffInfo.Biography,
            DepartmentName = newAcc.StaffInfo.Department.Name
        };
    }

    public async Task UpdateAccountAsync(UpdateAccountRequest request, string accessToken, string paramId)
    {
        var role = JwtHelper.GetRoleFromAccessToken(accessToken)
            ?? throw new AppException(400, "Role is not found in access token");
        var accessId = JwtHelper.GetAccountIdFromToken(accessToken);
        var targetId = Guid.Parse(paramId);

        var account = await accountRepo.GetAccountByIdAsync(targetId)
            ?? throw new AppException(404, "Account not found");

        var isSelfUpdate = accessId == targetId;
        var isAdmin = string.Equals(role, RoleNames.Admin, StringComparison.OrdinalIgnoreCase);
        var isManager = string.Equals(role, RoleNames.Manager, StringComparison.OrdinalIgnoreCase);

        var canManagerUpdateTarget = isManager &&
            (account.Role.Name.Equals(RoleNames.Staff, StringComparison.OrdinalIgnoreCase) ||
             account.Role.Name.Equals(RoleNames.Consultant, StringComparison.OrdinalIgnoreCase));

        if (isSelfUpdate || isAdmin || canManagerUpdateTarget)
        {
            UpdateAccountFields(account, request);
            account.UpdatedAt = DateTime.Now;
            account.UpdatedBy = accessId;
            await accountRepo.UpdateAccount(account);
        }
        else
        {
            throw new AppException(403, "You do not have permission to update this account.");
        }
    }

    private void UpdateAccountFields(Account a, UpdateAccountRequest request)
    {
        a.FirstName = request.Account.FirstName ?? a.FirstName;
        a.LastName = request.Account.LastName ?? a.LastName;
        a.Phone = request.Account.PhoneNumber ?? a.Phone;
        a.Gender = request.Account.Gender ?? a.Gender;
        a.DateOfBirth = request.Account.DateOfBirth ?? a.DateOfBirth;
        a.AvatarUrl = request.Account.AvatarUrl ?? a.AvatarUrl;
        a.IsDeleted = request.Account.IsDeleted ?? a.IsDeleted;

        if (request.StaffInfo != null && a.StaffInfo != null)
        {
            if (!string.IsNullOrEmpty(request.StaffInfo.DepartmentId))
            {
                a.StaffInfo.DepartmentId = Guid.Parse(request.StaffInfo.DepartmentId);
            }
            a.StaffInfo.Degree = request.StaffInfo.Degree ?? a.StaffInfo.Degree;
            a.StaffInfo.YearOfExperience = request.StaffInfo.YearOfExperience ?? a.StaffInfo.YearOfExperience;
            a.StaffInfo.Biography = request.StaffInfo.Biography ?? a.StaffInfo.Biography;
        }
    }

    public async Task<ProfileViewModel> GetProfileAsync(Guid accountId)
    {
        // Get account details
        var account = await accountRepo.GetAccountByIdAsync(accountId);
        if (account == null)
        {
            throw new Exception("Account not found.");
        }

        // Get role information
        var role = await roleRepo.GetRoleByIdAsync(account.RoleId);
        if (role == null)
        {
            throw new Exception("Role not found.");
        }

        // Get staff info (if exists)
        var staffInfo = await staffInfoRepo.GetStaffInfoByAccountIdAsync(accountId);

        // Prepare profile response
        var profile = new ProfileViewModel
        {
            Id = account.Id,
            Email = account.Email,
            FirstName = account.FirstName ?? string.Empty,
            LastName = account.LastName ?? string.Empty,
            Gender = account.Gender,
            DateOfBirth = account.DateOfBirth,
            AvatarUrl = account.AvatarUrl,
            IsDeleted = account.IsDeleted,
            Role = new RoleViewModel
            {
                Name = role.Name,
                Description = role.Description
            },
            Degree = staffInfo?.Degree,
            YearOfExperience = staffInfo?.YearOfExperience,
            Biography = staffInfo?.Biography
        };

        return profile;
    }
}