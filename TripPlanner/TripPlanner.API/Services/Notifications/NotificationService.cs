﻿using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Dtos.Notifications;

namespace TripPlanner.API.Services.Notifications;

public class NotificationService : INotificationService
{
    private readonly IRepository<Notification> _notificationRepository;

    public NotificationService(IRepository<Notification> notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<IEnumerable<NotificationDto>> GetNotifications(string userId)
    {
        var notifications = await _notificationRepository.FindByCondition(n => n.UserId == userId)
            .ToListAsync();

        return notifications.Select(t => new NotificationDto
        {
            Id = t.Id,
            Message = t.Message,
            Status = t.Status,
            Title = t.Title,
        });
    }
}