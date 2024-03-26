using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.User;

namespace TripPlanner.API.Services.User;

public class UserService : IUserService
{
    private readonly IRepository<Notification> _notificationRepository;

    public UserService(IRepository<Notification> notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public UserInformationDto GetUserInformation(string userId)
    {
        var hasUnreadNotifications = _notificationRepository.FindByCondition(n => n.UserId == userId)
            .Any(n => n.Status == NotificationStatus.Unread);

        return new UserInformationDto
        {
            HasUnreadNotifications = hasUnreadNotifications,
        };
    }
}