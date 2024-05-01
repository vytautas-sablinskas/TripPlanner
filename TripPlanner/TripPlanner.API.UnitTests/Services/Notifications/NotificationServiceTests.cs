using Moq;
using System.Linq.Expressions;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Services.Notifications;

namespace TripPlanner.API.UnitTests.Services.Notifications;

public class NotificationServiceTests
{
    private readonly Mock<IRepository<Notification>> _notificationRepositoryMock;
    private readonly NotificationService _notificationService;

    public NotificationServiceTests()
    {
        _notificationRepositoryMock = new Mock<IRepository<Notification>>();
        _notificationService = new NotificationService(_notificationRepositoryMock.Object);
    }

    [Fact]
    public async Task ReadUserNotifications_ShouldMarkNotificationsAsRead()
    {
        var userId = "user1";
        var notifications = new List<Notification>
            {
                new Notification { UserId = userId, Status = NotificationStatus.Unread },
                new Notification { UserId = userId, Status = NotificationStatus.Unread },
                new Notification { UserId = userId, Status = NotificationStatus.Unread }
            };
        _notificationRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<Notification, bool>>>()))
            .ReturnsAsync(notifications);

        await _notificationService.ReadUserNotifications(userId);

        _notificationRepositoryMock.Verify(repo => repo.Update(It.IsAny<Notification>()), Times.Exactly(notifications.Count));
        Assert.All(notifications, n => Assert.Equal(NotificationStatus.Read, n.Status));
    }

    [Fact]
    public async Task GetNotifications_ShouldReturnUserNotifications()
    {
        var userId = "user1";
        var notifications = new List<Notification>
            {
                new Notification { UserId = userId, Message = "Notification 1", Status = NotificationStatus.Unread },
                new Notification { UserId = userId, Message = "Notification 2", Status = NotificationStatus.Read },
                new Notification { UserId = userId, Message = "Notification 3", Status = NotificationStatus.Unread }
            };
        _notificationRepositoryMock.Setup(repo => repo.GetListByConditionAsync(It.IsAny<Expression<Func<Notification, bool>>>()))
            .ReturnsAsync(notifications);

        var result = await _notificationService.GetNotifications(userId);

        Assert.Equal(notifications.Count, result.Count());
        Assert.Equal("Notification 1", result.First().Message);
        Assert.Equal("Notification 2", result.Skip(1).First().Message);
        Assert.Equal("Notification 3", result.Skip(2).First().Message);
    }
}