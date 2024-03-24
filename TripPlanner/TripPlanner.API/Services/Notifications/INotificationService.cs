using TripPlanner.API.Dtos.Notifications;

namespace TripPlanner.API.Services.Notifications
{
    public interface INotificationService
    {
        Task<IEnumerable<NotificationDto>> GetNotifications(string userId);
    }
}