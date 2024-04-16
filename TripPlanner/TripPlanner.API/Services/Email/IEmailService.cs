using System.Net.Mail;

namespace TripPlanner.API.Services.Email;

public interface IEmailService
{
    Task SendEmailAsync(MailMessage message, string emailToSendTo);
}