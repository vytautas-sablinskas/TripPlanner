using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripBudgets
{
    public interface ITripBudgetsService
    {
        IEnumerable<TripTravellerMinimalDto> GetTripTravellers(Guid tripId);

        Task<IEnumerable<TripBudgetDto>> GetTripBudgets(Guid tripId, string userId);

        Task<TripBudgetMainViewDto> GetTripBudgetById(Guid budgetId, string userId);

        Task<EditBudgetCurrentInfoDto> GetEditBudgetCurrentInfo(Guid tripId, Guid budgetId);

        Task DeleteTripBudget(Guid budgetId);

        Task AddTripBudget(Guid tripId, string userId, AddTripBudgetDto addBudgetDto);

        Task EditTripBudget(Guid budgetId, EditBudgetDto dto);
    }
}