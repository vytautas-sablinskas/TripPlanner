namespace TripPlanner.API.Dtos.Trips;

public record TripsDto(
    IEnumerable<TripDto> Trips,
    int TotalTripCount
);