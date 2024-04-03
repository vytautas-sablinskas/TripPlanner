using Microsoft.EntityFrameworkCore;
using TripPlanner.API.Database.DataAccess;
using TripPlanner.API.Database.Entities;
using TripPlanner.API.Database.Enums;
using TripPlanner.API.Dtos.TripBudgets;
using TripPlanner.API.Dtos.TripTravellers;

namespace TripPlanner.API.Services.TripBudgets;

public class TripBudgetsService : ITripBudgetsService
{
    private readonly IRepository<Traveller> _travellersRepository;
    private readonly IRepository<AppUser> _appUserRepository;
    private readonly IRepository<TripBudget> _tripBudgetRepository;
    private readonly IRepository<TripBudgetMember> _tripBudgetMembersRepository;

    public TripBudgetsService(IRepository<Traveller> travellerRepository, IRepository<AppUser> appUserRepository, IRepository<TripBudget> tripBudgetRepository, IRepository<TripBudgetMember> tripBudgetMembersRepository)
    {
        _travellersRepository = travellerRepository;
        _appUserRepository = appUserRepository;
        _tripBudgetRepository = tripBudgetRepository;
        _tripBudgetMembersRepository = tripBudgetMembersRepository;

    }

    public IEnumerable<TripTravellerMinimalDto> GetTripTravellers(Guid tripId)
    {
        var travellers = _travellersRepository.FindByCondition(t => t.TripId == tripId)
            .Include(t => t.User);

        var travellerMinimalDtos = travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}"));

        return travellerMinimalDtos;
    }

    public void AddTripBudget(Guid tripId, string userId, AddTripBudgetDto addBudgetDto)
    {
        var user = _appUserRepository.FindByCondition(t => t.Id == userId).FirstOrDefault();
        
        var budget = new TripBudget
        {
            Name = addBudgetDto.Name,
            Description = addBudgetDto.Description,
            Type = addBudgetDto.Type,
            UnlimitedBudget = addBudgetDto.UnlimitedAmount,
            Budget = addBudgetDto.Budget,
            TripId = tripId,
            MainCurrency = addBudgetDto.MainCurrency,
            CreatorId = userId
        };

        var createdBudget = _tripBudgetRepository.Create(budget);

        if (addBudgetDto.Members != null)
        {
            foreach (var member in addBudgetDto.Members)
            {
                var userToAdd = _appUserRepository.FindByCondition(t => t.Email == member.Email)
                    .FirstOrDefault();
                var budgetMember = new TripBudgetMember
                {
                    UserId = userToAdd.Id,
                    TripBudgetId = createdBudget.Id,
                    Amount = member.Amount
                };

                _tripBudgetMembersRepository.Create(budgetMember);
            }
        }
    }
}