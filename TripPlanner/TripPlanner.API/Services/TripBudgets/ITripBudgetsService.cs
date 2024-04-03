using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripBudgets
{
    public interface ITripBudgetsService
    {
        IEnumerable<TripTravellerMinimalDto> GetTripTravellers(Guid tripId);

        void AddTripBudget(Guid tripId, string userId, AddTripBudgetDto addBudgetDto);
    }
}