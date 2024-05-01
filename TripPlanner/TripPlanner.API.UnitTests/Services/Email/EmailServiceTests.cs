using Moq;
using System.Net.Mail;
using TripPlanner.API.Services.Email;
using TripPlanner.API.Wrappers;

namespace TripPlanner.API.UnitTests.Services.Email;

public class EmailServiceTests
{
    private readonly Mock<ISmtpClientWrapper> _smtpClientWrapper;
    private readonly EmailService _service;

    public EmailServiceTests()
    {
        _smtpClientWrapper = new Mock<ISmtpClientWrapper>();
        _service = new EmailService(_smtpClientWrapper.Object);
    }

    [Fact]
    public async Task SendEmailAsync_ValidMessage_ShouldCallSmtpClientSendMethod()
    {
        await _service.SendEmailAsync(new MailMessage(), "email@gmail.com");

        _smtpClientWrapper.Verify(v => v.SendMailAsync(It.IsAny<MailMessage>()), Times.Once);
    }
}