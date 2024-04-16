using System.Net.Mail;

namespace TripPlanner.API.Services.Email;

public interface ISmtpClientWrapper
{
    Task SendMailAsync(MailMessage message);
}