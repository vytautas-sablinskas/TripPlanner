using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.Trips;
using TripPlanner.API.Services.TripTravellers;

namespace TripPlanner.API.Dtos.TripDetails;

public record TripDetailsDto (
    IEnumerable<TripDetailMinimalDto> TripDetails,
    TripDto TripInformation,
    IEnumerable<TripBudgetMinimalDto> budgets,
    TripPermissions TripPermissions
);