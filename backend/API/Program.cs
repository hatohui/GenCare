using System.Text;
using Api.Middlewares;
using API.ActionFilters;
using API.Middlewares;
using Application.DTOs.Auth.Requests;
using Application.DTOs.Payment.Momo;
using Application.DTOs.Payment.VNPay;
using Application.Helpers;
using Application.Repositories;
using Application.Services;
using Domain.Abstractions;
using DotNetEnv;
using FluentValidation;
using FluentValidation.AspNetCore;
using Hangfire;
using Hangfire.PostgreSql;
using Infrastructure.Database;
using Infrastructure.HUbs;
using Infrastructure.Repositories;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

Env.Load();
var builder = WebApplication.CreateBuilder(args);
IronPdf.License.LicenseKey = "IRONSUITE.PHAMANHKIET.DEV.GMAIL.COM.25060-1546486873-K4GYA-5EXQUJLP3C3I-VVXLZL6EEY5U-OYAH4ZZOS7A3-VO2D3XJEKYTQ-DIBGIHQBCRLF-6Y5UGFIJBS2Q-CBETNL-THR7RQFESBOQEA-DEPLOYMENT.TRIAL-XYEJVN.TRIAL.EXPIRES.15.AUG.2025";
//=============connect momo api===================== //
builder.Services.Configure<MomoConfig>(options =>
{
    options.PartnerCode =
        Environment.GetEnvironmentVariable("MOMO_PARTNER_CODE")
        ?? throw new InvalidOperationException("Missing Momo Partner Code");
    options.AccessKey =
        Environment.GetEnvironmentVariable("MOMO_ACCESS_KEY")
        ?? throw new InvalidOperationException("Missing Momo Access Key");
    options.SecretKey =
        Environment.GetEnvironmentVariable("MOMO_SECRET_KEY")
        ?? throw new InvalidOperationException("Missing Momo Secret Key");
    options.Endpoint =
        Environment.GetEnvironmentVariable("MOMO_ENDPOINT")
        ?? throw new InvalidOperationException("Missing Momo Endpoint");
    options.ReturnUrl =
        Environment.GetEnvironmentVariable("MOMO_RETURN_URL")
        ?? throw new InvalidOperationException("Missing Momo Return URL");
    options.NotifyUrl =
        Environment.GetEnvironmentVariable("MOMO_NOTIFY_URL")
        ?? throw new InvalidOperationException("Missing Momo Notify URL");
    options.RequestType =
        Environment.GetEnvironmentVariable("MOMO_REQUEST_TYPE")
        ?? throw new InvalidOperationException("Missing Momo Request Type");
});
builder.Services.AddHttpClient();
builder.Services.AddScoped<IMomoService, MomoService>();

//===================config vnpay
builder.Services.Configure<VNPayConfig>(options =>
{
    options.Vnp_TmnCode = Environment.GetEnvironmentVariable("VNP_TMNCODE")
        ?? throw new InvalidOperationException("Missing VNPay Tmn Code");
    options.Vnp_HashSecret = Environment.GetEnvironmentVariable("VNP_HASHSECRET")
        ?? throw new InvalidOperationException("Missing VNPay Hash Secret");
    options.Vnp_Url = Environment.GetEnvironmentVariable("VNP_URL")
        ?? throw new InvalidOperationException("Missing VNPay Url");
    options.Vnp_ReturnUrl = Environment.GetEnvironmentVariable("VNP_RETURN_URL")
        ?? throw new InvalidOperationException("Missing VNPay Return URL");
});

// Add services
builder.Services.AddControllers();
builder.Services.AddSignalR();
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
        // Configure the OnMessageReceived event to extract the JWT token from the query string,
        // which is necessary for WebSocket connections (e.g., SignalR) that cannot send Authorization headers.
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var accessToken = context.Request.Query["access_token"];
                var path = context.HttpContext.Request.Path;
                // Allow JWT token to be sent via query string for SignalR connections
                if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/hubs/chat"))
                {
                    context.Token = accessToken;
                }

                return Task.CompletedTask;
            },
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
                .WithOrigins(
                    "http://localhost:3000",
                    "https://www.gencare.site",
                    "http://127.0.0.1:5500"
                )
                .AllowCredentials()
                .AllowAnyHeader()
                .AllowAnyMethod();
        }
    );
});
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddTransient<IValidator<AccountLoginRequest>, AccountLoginRequestValidator>();

// ====== Application Services ======
builder.Services.AddHangfireServer();

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
builder.Services.AddScoped<IMediaService, MediaService>();
builder.Services.AddTransient<IEmailService, EmailService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IScheduleRepository, ScheduleRepository>();
builder.Services.AddScoped<IScheduleService, ScheduleService>();
builder.Services.AddScoped<IBirthControlRepository, BirthControlRepository>();
builder.Services.AddScoped<IBirthControlService, BirthControlService>();
builder.Services.AddScoped<IResultService, ResultService>();
builder.Services.AddScoped<IResultRepository, ResultRepository>();
builder.Services.AddScoped<ISlotRepository, SlotRepository>();
builder.Services.AddScoped<IAppointmentService, AppointmentService>();
builder.Services.AddScoped<IAppointmentRepository, AppointmentRepository>();
builder.Services.AddScoped<IConversationRepository, ConversationRepository>();
builder.Services.AddScoped<IConversationService, ConversationService>();
builder.Services.AddScoped<IMessageService, MessageService>();
builder.Services.AddScoped<IMessageRepository, MessageRepository>();
builder.Services.AddScoped<ISlotService, SlotService>();
builder.Services.AddScoped<ISlotRepository, SlotRepository>();
builder.Services.AddScoped<ITagService, TagService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<IFeedbackRepository, FeedbackRepository>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
builder.Services.AddScoped<ITagRepository, TagRepository>();
builder.Services.AddScoped<IBlogTagRepository, BlogTagRepository>();
builder.Services.AddScoped<IBlogRepository, BlogRepository>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<IBlogService, BlogService>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<IMomoService, MomoService>();
builder.Services.AddScoped<IPaymentHistoryRepository, PaymentHistoryRepository>();
builder.Services.AddScoped<IPaymentHistoryService, PaymentHistoryService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IManualPaymentService, ManualPaymentService>();
builder.Services.AddScoped<IOrderDetailService, OrderDetailService>();
builder.Services.AddSignalR();
builder.Services.AddScoped<IZoomService, ZoomService>();
builder.Services.AddScoped<IStatisticService, StatisticService>();
builder.Services.AddScoped<IRoleService, RoleService>();
builder.Services.AddScoped<IVNPayService, VNPayService>();
builder.Services.AddScoped<IOrderDetailPdfService, OrderDetailPdfService>();
builder.Services.AddScoped<IReminderRepository, ReminderRepository>();
builder.Services.AddScoped<IReminderService, ReminderService>();



//===========Redis Configuration===========
builder.Services.AddStackExchangeRedisCache(options =>
{
    var uri =
        Environment.GetEnvironmentVariable("REDIS_URI")
        ?? throw new InvalidOperationException("Missing REDIS_URI");
    options.Configuration = RedisConnectionHelper.FromUri(uri);
});

//===========Database Configuration===========

var env = builder.Environment;
var connectionString =
    (
        env.IsDevelopment()
            ? Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_DEV")
            : Environment.GetEnvironmentVariable("DB_CONNECTION_STRING_PROD")
    )
    ?? throw new InvalidOperationException(
        "Missing connection string for the current environment."
    );
;

builder.Services.AddDbContext<GenCareDbContext>(options =>
{
    options.UseNpgsql(connectionString);
});

builder.Services.AddHangfire(config =>
    config.UsePostgreSqlStorage(opt =>
    {
        opt.UseNpgsqlConnection(connectionString);
    })
);

// ====== App Pipeline ======
var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHangfireDashboard(
    "/hangfire",
    new DashboardOptions { Authorization = [new AllowAllDashboardAuthorizationFilter()] }
);

// Schedule recurring jobs
RecurringJob.AddOrUpdate<IRefreshTokenService>(
    "cleanup-revoked-refresh-tokens",
    service => service.CleanupRevokedTokensAsync(),
    Cron.Daily
);

RecurringJob.AddOrUpdate<IReminderService>(
    "reminder-unpaid-purchases",
    service => service.SendUnpaidPurchaseRemindersAsync(),
    Cron.Daily
);


app.UseMiddleware<GlobalExceptionMiddleware>();
app.UseMiddleware<LoggingMiddleware>();
app.UseMiddleware<RateLimitMiddleware>();

app.UseHttpsRedirection();
app.UseCors("AllowFrontendOrigins");
app.UseAuthentication();
app.UseMiddleware<TokenBlacklistMiddleware>();
app.UseAuthorization();

app.MapControllers();
app.MapHub<ChatHub>("/hubs/chat");

await app.RunAsync(); //test
