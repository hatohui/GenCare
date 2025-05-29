using System.Text;
using API.Middlewares;
using Application.Repositories;
using Application.Services;
using Domain.Abstractions;
using DotNetEnv;
using Infrastructure.Data.Context;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Web.Middlewares;

Env.Load();
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ====== Swagger ======
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "GenCare", Version = "v1" });
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Nhập token theo dạng: Bearer {your token}"
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// ====== JWT Authentication ======
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "JWT_KEY is missing";
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "default_issuer";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "default_audience";

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// ====== Google OAuth ======
var googleClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
                     ?? throw new InvalidOperationException("Google Client ID is missing.");
var googleClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")
                         ?? throw new InvalidOperationException("Google Client Secret is missing.");

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = GoogleDefaults.AuthenticationScheme;
    options.DefaultSignInScheme = CookieAuthenticationDefaults.AuthenticationScheme;
})
.AddCookie()
.AddGoogle(options =>
{
    options.ClientId = googleClientId;
    options.ClientSecret = googleClientSecret;
    options.SaveTokens = true;
    options.ClaimActions.MapJsonKey("picture", "picture", "url");
});

// ====== Application Services ======
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IApplicationDbContext, GenCareDbContext>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();  
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
var env = builder.Environment;

builder.Services.AddDbContext<GenCareDbContext>(options =>
{
    string connectionString = env.IsDevelopment()
        ? Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_DEV")
        : Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_PROD");

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException("Missing connection string for the current environment.");
    }

    options.UseNpgsql(connectionString);
});

// Thêm các service khác nếu có

var app = builder.Build();

// ====== Middleware Pipeline ======

// 1. Swagger - để dev có thể test API trước mọi xử lý khác
app.UseSwagger();
app.UseSwaggerUI();

// 2. Global Exception - log và xử lý exception sớm nhất có thể
app.UseMiddleware<GlobalExceptionMiddleware>();

// 3. Logging request/response - ghi log toàn hệ thống
app.UseMiddleware<LoggingMiddleware>();

// 4. HTTPS redirection
app.UseHttpsRedirection();

// 5. Rate limiting - ngăn spam ngay từ đầu
app.UseMiddleware<RateLimitMiddleware>();

// 6. Authentication + Authorization
app.UseAuthentication();
app.UseAuthorization();

// 7. Map routes
app.MapControllers();

await app.RunAsync();