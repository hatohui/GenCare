using System.Net;
using System.Net.Mail;
using Application.Services;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class EmailService(IConfiguration configuration) : IEmailService
{
    public async Task SendEmailAsync(string email, string subject, string message)
    {
        using var client = new SmtpClient();
        var credential = new NetworkCredential
        //store Gmail account and password in environment variables for security
        {
            UserName = Environment.GetEnvironmentVariable("GMAIL_ACCOUNT"),
            Password = Environment.GetEnvironmentVariable("GMAIL_PASSWORD_APP")
        };

        client.Credentials = credential;
        client.Host = configuration["Email:Smtp:Host"];
        client.Port = int.Parse(configuration["Email:Smtp:Port"]);
        client.EnableSsl = bool.Parse(configuration["Email:Smtp:EnableSsl"]);

        using var emailMessage = new MailMessage
        {
            To = { new MailAddress(email) },
            From = new MailAddress(Environment.GetEnvironmentVariable("GMAIL_FROM")),
            Subject = subject,
            Body = message,
            IsBodyHtml = true
        };

        await client.SendMailAsync(emailMessage);
    }
}