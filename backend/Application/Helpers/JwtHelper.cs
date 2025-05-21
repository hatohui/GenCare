using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Domain.Entities;
using Microsoft.IdentityModel.Tokens;

namespace Application.Helpers;

public static class JwtHelper
{
    public static string GenerateAccessToken(User user)
    {
        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var key = Environment.GetEnvironmentVariable("JWT_KEY")
            ?? throw new InvalidOperationException("Missing JWT_KEY");

        var issuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "default_issuer";
        var audience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "default_audience";

        var expires = DateTime.UtcNow.AddMinutes(
            int.TryParse(Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_MINUTES"), out var minutes)
                ? minutes : 60
        );

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
        var creds = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public static string GenerateRefreshToken()
    {
        return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
    }

    public static bool ValidateToken(string token)
    {
        try
        {
            var key = Environment.GetEnvironmentVariable("JWT_KEY");
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
            var tokenHandler = new JwtSecurityTokenHandler();

            var validationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),
                ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
                IssuerSigningKey = securityKey
            };

            tokenHandler.ValidateToken(token, validationParameters, out var validatedToken);
            return true;
        }
        catch
        {
            return false;
        }
    }
}