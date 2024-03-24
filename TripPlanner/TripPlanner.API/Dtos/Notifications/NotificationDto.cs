using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Dtos.Notifications;

public class NotificationDto
{
    public Guid Id { get; set; }

    public string? Title { get; set; }

    public string? Message { get; set; }

    public NotificationStatus Status { get; set; }
}