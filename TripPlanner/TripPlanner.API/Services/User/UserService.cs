using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.User;

namespace TripPlanner.API.Services.User;

public class UserService : IUserService
{
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IRepository<AppUser> _appUserRepository;

    public UserService(IRepository<Notification> notificationRepository, IRepository<AppUser> appUserRepository)
    {
        _notificationRepository = notificationRepository;
        _appUserRepository = appUserRepository;
    }

    public async Task<UserInformationDto> GetUserInformation(string userId)
    {
        var hasUnreadNotifications = _notificationRepository.FindByCondition(n => n.UserId == userId)
            .Any(n => n.Status == NotificationStatus.Unread);
        var user = await _appUserRepository.GetFirstOrDefaultAsync(u => u.Id == userId);

        return new UserInformationDto
        {
            HasUnreadNotifications = hasUnreadNotifications,
            Photo = user.PhotoUri,
        };
    }
}