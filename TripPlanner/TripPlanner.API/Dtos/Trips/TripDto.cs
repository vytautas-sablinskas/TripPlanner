namespace TripPlanner.API.Dtos.Trips;

public record TripDto(
    Guid Id,

    string Title,

    string Description,

    string DestinationCountry,

    string PhotoUri,

    DateTime StartDate,

    DateTime EndDate
);