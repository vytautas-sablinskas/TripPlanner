using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.Notifications;

namespace TripPlanner.API.Services.Notifications;

public class NotificationService : INotificationService
{
    private readonly IRepository<Notification> _notificationRepository;

    public NotificationService(IRepository<Notification> notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task ReadUserNotifications(string userId)
    {
        var notifications = await _notificationRepository.GetListByConditionAsync(n => n.UserId == userId);

        foreach (var notification in notifications)
        {
            notification.Status = NotificationStatus.Read;
            await _notificationRepository.Update(notification);
        }
    }

    public async Task<IEnumerable<NotificationDto>> GetNotifications(string userId)
    {
        var notifications = await _notificationRepository.GetListByConditionAsync(n => n.UserId == userId);

        return notifications.Select(t => new NotificationDto
        {
            Id = t.Id,
            Message = t.Message,
            Status = t.Status,
            Title = t.Title,
        });
    }
}