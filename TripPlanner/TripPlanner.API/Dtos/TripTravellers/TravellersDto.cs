using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Dtos.TripTravellers;

public record TravellersDto (
    IEnumerable<TravellerDto> Travellers,
    TripPermissions RequesterPermissions
);