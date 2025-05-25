using API.Extensions;
using DotNetEnv;

Env.Load();
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerDocumentation();
builder.Services.AddJwtAuthentication();
builder.Services.AddGoogleOAuth2();
builder.Services.AddApplicationServices();

var app = builder.Build();

// 1. Swagger - để dev có thể test API trước mọi xử lý khác
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "GenCare v1");
    c.RoutePrefix = "swagger";
});

// 2. Global Exception - log và xử lý exception sớm nhất có thể
app.UseGlobalExceptionHandler();

// 3. Logging request/response - ghi log toàn hệ thống
app.UseLogging();

// 4. HTTPS redirection
app.UseHttpsRedirection();

// 5. Rate limiting - ngăn spam ngay từ đầu
app.UseRateLimit();

// 6. Authentication + Authorization
app.UseAuthentication();
app.UseAuthorization();

// 7. Map routes
app.MapControllers();

await app.RunAsync();
