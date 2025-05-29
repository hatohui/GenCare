using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace Application.Helpers
{
    public static class JwtHelper
    {
        private static readonly string JwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? throw new ArgumentNullException("JWT_KEY environment variable is not set");
        private static readonly string JwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? throw new ArgumentNullException("JWT_ISSUER environment variable is not set");
        private static readonly string JwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? throw new ArgumentNullException("JWT_AUDIENCE environment variable is not set");

        /// <summary>
        /// Generate a JWT token for a user with the provided claims.
        /// </summary>
        /// <param name="accountId">The unique identifier of the account (UUID from the database).</param>
        /// <param name="email">The email of the user.</param>
        /// <param name="role">The role of the user (from the role table).</param>
        /// <param name="expiresInMinutes">Token expiration time in minutes (default is 60 minutes).</param>
        /// <returns>JWT token as a string.</returns>
        public static string GenerateToken(string accountId, string email, string role, int expiresInMinutes = 60)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JwtKey));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, accountId),
                new Claim(JwtRegisteredClaimNames.Email, email),
                new Claim(ClaimTypes.Role, role),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
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
                IssuerSigningKey = new SymmetricSecurityKey(key)
            };

            return tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
        }

        /// <summary>
        /// Extract the account ID from a JWT token.
        /// </summary>
        /// <param name="token">The JWT token.</param>
        /// <returns>The account ID (UUID) if token is valid; otherwise, throws an exception.</returns>
        public static string GetAccountIdFromToken(string token)
        {
            var principal = ValidateToken(token);
            return principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
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
    }
}