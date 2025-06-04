using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Application.Helpers
{
    public static class JwtHelper
    {
        public static readonly string JwtKey = Environment.GetEnvironmentVariable("JWT_KEY")!;
        public static readonly string JwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER")!;
        public static readonly string JwtAudience = Environment.GetEnvironmentVariable(
            "JWT_AUDIENCE"
        )!;

        /// <summary>
        /// Generate an Access Token for a user.
        /// </summary>
        /// <param name="accountId">The unique identifier of the account (UUID from the database).</param>
        /// <param name="email">The email of the user.</param>
        /// <param name="role">The role of the user (from the role table).</param>
        /// <param name="expiresInMinutes">Access token expiration time in minutes (default is 60 minutes).</param>
        /// <returns>A tuple containing the access token and its expiration time.</returns>
        public static (string AccessToken, DateTime AccessTokenExpiration) GenerateAccessToken(
            Account user,
            int expiresInMinutes = 60
        )
        {
            var accessTokenExpiration = DateTime.Now.AddMinutes(expiresInMinutes);
            var accessToken = GenerateToken(user, expiresInMinutes, "access");
            return (accessToken, accessTokenExpiration);
        }

        /// <summary>
        /// Generate a Refresh Token for a user.
        /// </summary>
        /// <param name="accountId">The unique identifier of the account (UUID from the database).</param>
        /// <param name="expiresInDays">Refresh token expiration time in days (default is 7 days).</param>
        /// <returns>A tuple containing the refresh token and its expiration time.</returns>
        public static (string RefreshToken, DateTime RefreshTokenExpiration) GenerateRefreshToken(
            Guid accountId,
            int expiresInDays = 7
        )
        {
            var refreshTokenExpiration = DateTime.Now.AddDays(expiresInDays);
            var refreshTokenClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, accountId.ToString("D")), // Chuyển Guid thành string định dạng chuẩn
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("type", "refresh"), // Đánh dấu đây là refresh token
            };

            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var refreshToken = new JwtSecurityToken(
                issuer: JwtIssuer,
                audience: JwtAudience,
                claims: refreshTokenClaims,
                expires: refreshTokenExpiration,
                signingCredentials: credentials
            );

            var refreshTokenString = new JwtSecurityTokenHandler().WriteToken(refreshToken);
            return (refreshTokenString, refreshTokenExpiration);
        }

        /// <summary>
        /// Generate a single JWT token (used for Access Token or Refresh Token based on type).
        /// </summary>
        /// <param name="accountId">The unique identifier of the account (UUID from the database).</param>
        /// <param name="email">The email of the user.</param>
        /// <param name="role">The role of the user.</param>
        /// <param name="expiresInMinutes">Token expiration time in minutes.</param>
        /// <param name="tokenType">Type of token: "access" or "refresh".</param>
        /// <returns>JWT token as a string.</returns>
        ///Todo: Update the doc above
        private static string GenerateToken(
            Account user,
            int expiresInMinutes = 60,
            string tokenType = "access"
        )
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString("D")), // Chuyển Guid thành string định dạng chuẩn
                //.ToString("D"): định dạng Guid thành chuỗi chuẩn (dashed format)
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role?.Name ?? ""),
                new Claim(ClaimTypes.GivenName, user.FirstName ?? ""),
                new Claim(ClaimTypes.Surname, user.LastName ?? ""),
                new Claim(ClaimTypes.DateOfBirth, user.DateOfBirth?.ToString() ?? ""),
                new Claim(ClaimTypes.Gender, user.Gender ? "Male" : "Female"),
                new Claim(ClaimTypes.Uri, user.AvatarUrl ?? ""),
                new Claim(ClaimTypes.MobilePhone, user.Phone ?? ""),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("type", tokenType), // Đánh dấu loại token
            };
            var token = new JwtSecurityToken(
                issuer: JwtIssuer,
                audience: JwtAudience,
                claims: claims,
                expires: DateTime.Now.AddMinutes(expiresInMinutes),
                signingCredentials: credentials
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Validate a JWT token and return the claims principal if valid.
        /// </summary>
        /// <param name="token">The JWT token to validate.</param>
        /// <returns>ClaimsPrincipal if token is valid; otherwise, throws an exception.</returns>
        public static ClaimsPrincipal ValidateToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(JwtKey);
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = JwtIssuer,
                ValidAudience = JwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(key),
            };
            return tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
        }

        /// <summary>
        /// Extract the account ID from a JWT token as a Guid.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The account ID as a Guid if token is valid; otherwise, throws an exception.</returns>
      
        public static Guid GetAccountIdFromToken1(string token)
        {
            var principal = ValidateToken(token);
            // Thử lấy từ nhiều loại claim phổ biến
            var possibleClaimTypes = new[]
            {
        JwtRegisteredClaimNames.Sub,
        "sub",
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    };

            string accountIdString = null;
            foreach (var type in possibleClaimTypes)
            {
                accountIdString = principal.FindFirst(type)?.Value;
                if (!string.IsNullOrEmpty(accountIdString)) break;
            }

            if (Guid.TryParse(accountIdString, out Guid accountId))
            {
                return accountId;
            }
            throw new ArgumentException("Invalid account ID format in token.");
        }


        /// <summary>
        /// Extract the email from a JWT token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The email if token is valid; otherwise, throws an exception.</returns>
        public static string GetEmailFromToken(string token)
        {
            var principal = ValidateToken(token);
            return principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value ?? string.Empty;
        }

        /// <summary>
        /// Extract the role from a JWT token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The role if token is valid; otherwise, throws an exception.</returns>
        public static string GetRoleFromToken(string token)
        {
            var principal = ValidateToken(token);
            return principal.FindFirst(ClaimTypes.Role)?.Value ?? string.Empty;
        }

        /// <summary>
        /// Extract the token type (access or refresh) from a JWT token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The token type if token is valid; otherwise, throws an exception.</returns>
        public static string GetTokenTypeFromToken(string token)
        {
            var principal = ValidateToken(token);
            return principal.FindFirst("type")?.Value ?? string.Empty;
        }

        /// <summary>
        /// Generate a new Access Token using a valid Refresh Token.
        /// </summary>
        /// <param name="refreshToken">The refresh token to validate and use for generating a new access token.</param>
        /// <param name="accessTokenExpiresInMinutes">Access token expiration time in minutes (default is 60 minutes).</param>
        /// <returns>New access token and its expiration time as a tuple if refresh token is valid; otherwise, throws an exception.</returns>
        // public static (
        //     string AccessToken,
        //     DateTime AccessTokenExpiration
        // ) GenerateNewAccessTokenFromRefreshToken(
        //     string refreshToken,
        //     int accessTokenExpiresInMinutes = 60
        // )
        // {
        //     var principal = ValidateToken(refreshToken);
        //     var tokenType = principal.FindFirst("type")?.Value;

        //     // Fix for CRR0050: Use string.Compare() instead of '!=' operator
        //     if (!string.Equals(tokenType, "refresh", StringComparison.Ordinal))
        //     {
        //         throw new ArgumentException("Provided token is not a refresh token.");
        //     }

        //     var accountIdString = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        //     if (!Guid.TryParse(accountIdString, out Guid accountId))
        //     {
        //         throw new ArgumentException("Invalid account ID format in token.");
        //     }

        //     var user = AccountService.GetAccountById(accountId); // You need to implement this

        //     if (user == null)
        //     {
        //         throw new ArgumentException("User not found.");
        //     }

        //     var accessTokenExpiration = DateTime.UtcNow.AddMinutes(accessTokenExpiresInMinutes);
        //     var newAccessToken = GenerateToken(user, accessTokenExpiresInMinutes, "access");

        //     return (newAccessToken, accessTokenExpiration);
        // }

        // Todo: Figure out a way to fetch the account with Id string so that we can verify the user exist for the new access Token


        /// <summary>
        /// generate the reset password token
        /// </summary>
        /// <param name="userId">the user Id for resetting password</param>
        /// <param name="expiresInMinutes">expire time(minutes) for token</param>
        /// <returns>the reset password token</returns>
        public static string GeneratePasswordResetToken(Guid userId, int expiresInMinutes = 5)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            // Set token expiration time
            var expiration = DateTime.Now.AddMinutes(expiresInMinutes); 

            // Create JWT token with claims
            var claims = new[] 
            {   
            new Claim(JwtRegisteredClaimNames.Sub, userId.ToString("D")),
            new Claim("purpose", "password_reset")
        };

            var token = new JwtSecurityToken(
                issuer: JwtIssuer, 
                audience: JwtAudience,
                claims: claims,
                expires: expiration, 
                signingCredentials: credentials 
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        /// <summary>
        /// Validate a password reset token and extract the user ID.
        /// </summary>
        /// <param name="token">reset password token</param>
        /// <param name="userId">the extracted user Id</param>
        /// <returns>true if reset password token is valid and false if otherwise</returns>
        public static bool ValidatePasswordResetToken(string token, out Guid userId)
        {
            userId = Guid.Empty;
            var tokenHandler = new JwtSecurityTokenHandler();
       
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true, 
                ValidateAudience = true,
                ValidateLifetime = true, 
                ValidateIssuerSigningKey = true,
                ValidIssuer = JwtIssuer, 
                ValidAudience = JwtAudience, 
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey))
            };

            // Validate token
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out SecurityToken validatedToken);

            // Check if token is for password reset
            var purposeClaim = principal.FindFirst("purpose")?.Value;
            if (purposeClaim != "password_reset")
            {
                return false;
            }

            // Get the user ID from the token
            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim != null && Guid.TryParse(userIdClaim, out userId))
            {
                return true;
            }
            return false;
        }
    }
}
