using Application.Helpers;
using Domain.Entities;
using Xunit;

namespace Test.Helpers;
public class JwtHelperTests
{
    public static string JwtKey => Environment.GetEnvironmentVariable("JWT_KEY")!;
    public static string JwtIssuer => Environment.GetEnvironmentVariable("JWT_ISSUER")!;
    public static string JwtAudience => Environment.GetEnvironmentVariable("JWT_AUDIENCE")!;
    static JwtHelperTests()
    {
        Environment.SetEnvironmentVariable("JWT_KEY", "THIS_IS_A_SECURE_32BYTE_KEY_EXAMPLE!!");
        Environment.SetEnvironmentVariable("JWT_ISSUER", "testissuer");
        Environment.SetEnvironmentVariable("JWT_AUDIENCE", "testaudience");
    }

    [Fact]
    public void GenerateAndValidateAccessToken_ShouldSucceed_AndExtractClaims()
    {
        // Arrange
        var user = new Account
        {
            Id = Guid.NewGuid(),
            Email = "user@email.com",
            Role = new Role { Name = "Admin" }
        };

        // Act
        var (token, expiration) = JwtHelper.GenerateAccessToken(user);
        Assert.False(string.IsNullOrEmpty(token));
        Assert.True(expiration > DateTime.Now);

        // Validate token
        var principal = JwtHelper.ValidateToken(token);

        // Assert claims
        var accountIdClaim = principal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
                           ?? principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        Assert.Equal(user.Id.ToString("D"), accountIdClaim);

        Assert.Equal("Admin", principal.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value);

        // Test extract functions
        Assert.Equal(user.Id, JwtHelper.GetAccountIdFromToken(token));
        Assert.Equal("Admin", JwtHelper.GetRoleFromToken(token));
        // Email claim không có trong GenerateToken => sẽ trả về string.Empty
        Assert.Equal(string.Empty, JwtHelper.GetEmailFromToken(token));
    }

    [Fact]
    public void GenerateAndValidateRefreshToken_ShouldSucceed()
    {
        // Arrange
        Guid accountId = Guid.NewGuid();
        // Act
        var (refreshToken, exp) = JwtHelper.GenerateRefreshToken(accountId);
        Assert.False(string.IsNullOrEmpty(refreshToken));
        Assert.True(exp > DateTime.Now);

        // Validate token
        var principal = JwtHelper.ValidateToken(refreshToken);
        // Sửa dòng này:
        var sub = principal.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
               ?? principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        Assert.Equal(accountId.ToString("D"), sub);

        Assert.Equal("refresh", principal.FindFirst("type")?.Value);
        // Test extract token type
        Assert.Equal("refresh", JwtHelper.GetTokenTypeFromToken(refreshToken));
    }

    [Fact]
    public void GeneratePasswordResetToken_AndValidate_ShouldSucceed()
    {
        // Arrange
        Guid userId = Guid.NewGuid();
        var token = JwtHelper.GeneratePasswordResetToken(userId, 10);
        Assert.False(string.IsNullOrEmpty(token));

        // Act & Assert
        // Note: ValidatePasswordResetToken expects the claim "purpose" and "sub" as NameIdentifier; logic in helper có thể không bao h trả về true nếu claim NameIdentifier không được thêm ở GeneratePasswordResetToken.
        // Có thể phải sửa helper để thêm claim NameIdentifier cho password_reset token.
        var result = JwtHelper.ValidatePasswordResetToken(token, out Guid extractedUserId);

        Assert.True(result);
        Assert.Equal(userId, extractedUserId);
    }

    [Fact]
    public void GetTokenRemainingTime_ShouldReturn_CorrectTime()
    {
        // Arrange
        var user = new Account
        {
            Id = Guid.NewGuid(),
            Email = "user@email.com",
            Role = new Role { Name = "User" }
        };
        var (token, exp) = JwtHelper.GenerateAccessToken(user, 1); // expires in 1 minute

        // Act
        var remaining = JwtHelper.GetTokenRemainingTime(token);

        // Assert
        Assert.True(remaining.HasValue);
        Assert.InRange(remaining.Value.TotalSeconds, 0, 60);
    }

    [Fact]
    public void ValidateToken_InvalidToken_ShouldThrowException()
    {
        Assert.ThrowsAny<Exception>(() =>
        {
            JwtHelper.ValidateToken("invalid.token.value");
        });
    }
}
