using System.Text;
using API.ActionFilters;
using Api.Middlewares;
using API.Middlewares;
using Application.DTOs.Auth.Requests;
using Application.Repositories;
using Application.Services;
using Domain.Abstractions;
using DotNetEnv;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.Database;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

Env.Load();
var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// ====== Swagger ======
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "GenCare", Version = "v1" });
    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description = "Nhập token theo dạng: Bearer {your token}",
        }
    );
    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference = new OpenApiReference
                    {
                        Type = ReferenceType.SecurityScheme,
                        Id = "Bearer",
                    },
                },
                Array.Empty<string>()
            },
        }
    );
});

// ====== JWT + Google Authentication ======
var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY") ?? "JWT_KEY is missing";
var jwtIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER") ?? "default_issuer";
var jwtAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE") ?? "default_audience";

var googleClientId =
    Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
    ?? throw new InvalidOperationException("Google Client ID is missing.");
var googleClientSecret =
    Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")
    ?? throw new InvalidOperationException("Google Client Secret is missing.");

builder
    .Services.AddAuthentication(options =>
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        };
    })
    .AddCookie()
    .AddGoogle(options =>
    {
        options.ClientId = googleClientId;
        options.ClientSecret = googleClientSecret;
        options.SaveTokens = true;
        options.ClaimActions.MapJsonKey("picture", "picture", "url");
    });

//================================================= CORS Configuration =================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontendOrigins",
        corsPolicyBuilder =>
        {
            corsPolicyBuilder
                .WithOrigins("http://localhost:3000", "https://www.gencare.site")
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddTransient<IValidator<AccountLoginRequest>, AccountLoginRequestValidator>();

// ====== Application Services ======
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<IApplicationDbContext, GenCareDbContext>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IPurchaseRepository, PurchaseRepository>();
builder.Services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();
builder.Services.AddScoped<IPurchaseService, PurchaseService>();
builder.Services.AddScoped<IServiceRepository, ServiceRepository>();
builder.Services.AddScoped<IServicesService, ServicesService>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IStaffInfoRepository, StaffInfoRepository>();
builder.Services.AddSingleton<IGoogleCredentialService, GoogleCredentialService>();
builder.Services.AddScoped<IMediaRepository, MediaRepository>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();
builder.Services.AddScoped<IScheduleService, ScheduleService>();
builder.Services.AddScoped<IBirthControlRepository, BirthControlRepository>();
builder.Services.AddScoped<IBirthControlService, BirthControlService>();
builder.Services.AddScoped<ISlotRepository, SlotRepository>();

//===========Redis Configuration===========
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration =
        Environment.GetEnvironmentVariable("REDIS_URI")
        ?? throw new InvalidOperationException("Redis connection string is missing.");
});

//===========Database Configuration===========

var env = builder.Environment;

builder.Services.AddDbContext<GenCareDbContext>(options =>
{
    var connectionString =
        (
            env.IsDevelopment()
                ? Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_DEV")
                : Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_PROD")
        ) ?? string.Empty;

    if (string.IsNullOrWhiteSpace(connectionString))
    {
        throw new InvalidOperationException(
            "Missing connection string for the current environment."
        );
    }

    options.UseNpgsql(connectionString);
});

// ====== App Pipeline ======
var app = builder.Build();

// 1. Swagger UI
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 2. Global Exception Middleware
app.UseMiddleware<GlobalExceptionMiddleware>();

// 3. Logging Middleware
app.UseMiddleware<LoggingMiddleware>();

// 4. HTTPS redirect
app.UseHttpsRedirection();

// 5. CORS
app.UseCors("AllowFrontendOrigins");

// 6. Rate Limiting Middleware (nếu bạn có)
app.UseMiddleware<RateLimitMiddleware>();

// 7. Authentication & Authorization
app.UseAuthentication();
app.UseAuthorization();

// 8. Map Controllers
app.MapControllers();

// 9. Run the app
await app.RunAsync();
