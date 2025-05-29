using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;


namespace Application.Helpers
{
    public static class JwtHelper
    {
        private static readonly string JwtKey;
        private static readonly string JwtIssuer;
        private static readonly string JwtAudience;

        static JwtHelper()
        {
            // Load file .env (giả sử file .env nằm ở thư mục gốc của project)


            // Đọc các biến môi trường từ file .env
            JwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ??
                     throw new ArgumentNullException("JWT_KEY environment variable is not set in .env file");
            JwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ??
                        throw new ArgumentNullException("JWT_ISSUER environment variable is not set in .env file");
            JwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ??
                          throw new ArgumentNullException("JWT_AUDIENCE environment variable is not set in .env file");
        }

        /// <summary>
        /// Generate an Access Token for a user.
        /// </summary>
        /// <param name="accountId">The unique identifier of the account (UUID from the database).</param>
        /// <param name="email">The email of the user.</param>
        /// <param name="role">The role of the user (from the role table).</param>
        /// <param name="expiresInMinutes">Access token expiration time in minutes (default is 60 minutes).</param>
        /// <returns>A tuple containing the access token and its expiration time.</returns>
        public static (string AccessToken, DateTime AccessTokenExpiration) GenerateAccessToken(Guid accountId,
            string email, string role, int expiresInMinutes = 60)
        {
            var accessTokenExpiration = DateTime.UtcNow.AddMinutes(expiresInMinutes);
            var accessToken = GenerateToken(accountId, email, role, expiresInMinutes, "access");
            return (accessToken, accessTokenExpiration);
        }

        /// <summary>
        /// Generate a Refresh Token for a user.
        /// </summary>
        /// <param name="accountId">The unique identifier of the account (UUID from the database).</param>
        /// <param name="expiresInDays">Refresh token expiration time in days (default is 7 days).</param>
        /// <returns>A tuple containing the refresh token and its expiration time.</returns>
        public static (string RefreshToken, DateTime RefreshTokenExpiration) GenerateRefreshToken(Guid accountId,
            int expiresInDays = 7)
        {
            var refreshTokenExpiration = DateTime.UtcNow.AddDays(expiresInDays);
            var refreshTokenClaims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,
                    accountId.ToString("D")), // Chuyển Guid thành string định dạng chuẩn
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("type", "refresh") // Đánh dấu đây là refresh token
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
        private static string GenerateToken(Guid accountId, string email, string role, int expiresInMinutes,
            string tokenType)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub,
                    accountId.ToString("D")), // Chuyển Guid thành string định dạng chuẩn
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim("type", tokenType) // Đánh dấu loại token
            };
            var token = new JwtSecurityToken(
                issuer: JwtIssuer,
                audience: JwtAudience,
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
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
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };
            return tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
        }

        /// <summary>
        /// Extract the account ID from a JWT token as a Guid.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The account ID as a Guid if token is valid; otherwise, throws an exception.</returns>
        public static Guid GetAccountIdFromToken(string token)
        {
            var principal = ValidateToken(token);
            var accountIdString = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
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
            return principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;
        }

        /// <summary>
        /// Extract the role from a JWT token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The role if token is valid; otherwise, throws an exception.</returns>
        public static string GetRoleFromToken(string token)
        {
            var principal = ValidateToken(token);
            return principal.FindFirst(ClaimTypes.Role)?.Value;
        }

        /// <summary>
        /// Extract the token type (access or refresh) from a JWT token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The token type if token is valid; otherwise, throws an exception.</returns>
        public static string GetTokenTypeFromToken(string token)
        {
            var principal = ValidateToken(token);
            return principal.FindFirst("type")?.Value;
        }

        /// <summary>
        /// Generate a new Access Token using a valid Refresh Token.
        /// </summary>
        /// <param name="refreshToken">The refresh token to validate and use for generating a new access token.</param>
/// <param name="accessTokenExpiresInMinutes">Access token expiration time in minutes (default is 60 minutes).</param>
        /// <returns>New access token and its expiration time as a tuple if refresh token is valid; otherwise, throws an exception.</returns>
        public static (string AccessToken, DateTime AccessTokenExpiration) GenerateNewAccessTokenFromRefreshToken(string refreshToken, int accessTokenExpiresInMinutes = 60)
        {
            var principal = ValidateToken(refreshToken);
            var tokenType = principal.FindFirst("type")?.Value;

            if (tokenType != "refresh")
            {
                throw new ArgumentException("Provided token is not a refresh token.");
            }

            var accountIdString = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            if (!Guid.TryParse(accountIdString, out Guid accountId))
            {
                throw new ArgumentException("Invalid account ID format in token.");
            }

            var email = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value ?? string.Empty;
            var role = principal.FindFirst(ClaimTypes.Role)?.Value ?? "User";
            var accessTokenExpiration = DateTime.UtcNow.AddMinutes(accessTokenExpiresInMinutes);

            var newAccessToken = GenerateToken(accountId, email, role, accessTokenExpiresInMinutes, "access");

            return (newAccessToken, accessTokenExpiration);
        }
    }
}