using System.Net.Mail;
using System.Web;

namespace TripPlanner.API.Services.Email;

public class EmailService : IEmailService
{
    private readonly ISmtpClientWrapper _smtpClientWrapper;

    public EmailService(ISmtpClientWrapper smptClientWrapper)
    {
        _smtpClientWrapper = smptClientWrapper;
    }

    public async Task SendEmailAsync(MailMessage message, string emailToSendTo)
    {
        if (message == null)
            return;

        message.To.Add(emailToSendTo);

        await _smtpClientWrapper.SendMailAsync(message);
    }
}