using Application.Helpers;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Primitives;
using Xunit;

namespace Test.Helpers;
public class AuthHelperTests
{
    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenHttpContextIsNull()
    {
        // Case 1: HttpContext là null
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(null));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenHeaderMissing()
    {
        // Case 2: Không có header Authorization
        var context = new DefaultHttpContext();
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenHeaderIsEmpty()
    {
        // Case 3: Header Authorization là chuỗi rỗng
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "";
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenHeaderIsBasic()
    {
        // Case 4: Header Authorization = "Basic xyz"
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Basic xyz";
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenHeaderIsJWT()
    {
        // Case 5: Header Authorization = "JWT xyz"
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "JWT xyz";
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnToken_WhenHeaderIsBearer()
    {
        // Case 6: Header Authorization = "Bearer actualtoken"
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Bearer actualtoken";
        Assert.Equal("actualtoken", AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnTrimmedToken_WhenHeaderHasSpaces()
    {
        // Case 7: Header Authorization = "Bearer   actualtoken   "
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Bearer   actualtoken   ";
        Assert.Equal("actualtoken", AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenOnlyBearer()
    {
        // Case 8: Header Authorization = "Bearer "
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Bearer ";
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenBearerIsLowercase()
    {
        // Case 9: Header Authorization = "bearer actualtoken"
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "bearer actualtoken";
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenBearerIsUppercase()
    {
        // Case 10: Header Authorization = "BEARER actualtoken"
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "BEARER actualtoken";
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnToken_WhenMultipleSpacesAfterBearer()
    {
        // Case 11: Header Authorization = "Bearer      actualtoken"
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Bearer      actualtoken";
        Assert.Equal("actualtoken", AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnFirstToken_WhenMultipleHeaderValues()
    {
        // Case 12: Header Authorization = ["Bearer token1", "Bearer token2"]
        var context = new DefaultHttpContext();
        context.Request.Headers.Add("Authorization", new StringValues(new[] { "Bearer token1", "Bearer token2" }));
        Assert.Equal("token1", AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnTokenWithSpecialCharacters()
    {
        // Case 13: Header Authorization = "Bearer t0k3n-with-$peci@l_characters"
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Bearer t0k3n-with-$peci@l_characters";
        Assert.Equal("t0k3n-with-$peci@l_characters", AuthHelper.GetAccessToken(context));
    }

    [Fact]
    public void GetAccessToken_ShouldReturnEmptyString_WhenOnlySpacesAfterBearer()
    {
        // Case 14: Header Authorization = "Bearer   "
        var context = new DefaultHttpContext();
        context.Request.Headers.Authorization = "Bearer   ";
        Assert.Equal(string.Empty, AuthHelper.GetAccessToken(context));
    }
}
