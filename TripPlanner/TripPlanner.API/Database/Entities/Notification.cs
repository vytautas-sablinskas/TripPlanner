using TripPlanner.API.Database.Enums;

namespace TripPlanner.API.Database.Entities;

public class Notification
{
    public Guid Id { get; set; }

    public string? Title { get; set; }

    public string? Message { get; set; }

    public string? Email { get; set; }

    public virtual AppUser? User { get; set; }

    public string? UserId { get; set; }

    public NotificationStatus Status { get; set; }

    public Guid? TripId { get; set; }
}