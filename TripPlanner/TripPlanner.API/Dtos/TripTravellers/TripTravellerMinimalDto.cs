namespace TripPlanner.API.Dtos.TripTravellers;

public record TripTravellerMinimalDto(
    string Id,
    string Email,
    string FullName,
    string Photo
);