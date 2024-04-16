namespace TripPlanner.API.Dtos.Notifications;

public record UpdateNotificationStatus (
  Guid TripId,
  string Email
);