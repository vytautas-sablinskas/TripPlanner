using System.Net.Mail;

namespace TripPlanner.API.Wrappers;

public interface ISmtpClientWrapper
{
    Task SendMailAsync(MailMessage message);
}