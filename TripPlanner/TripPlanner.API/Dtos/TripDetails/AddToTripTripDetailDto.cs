namespace TripPlanner.API.Dtos.TripDetails;

public record AddToTripTripDetailDto
(
    DateTime StartDate,
    Guid TripId,
    Guid Id
);