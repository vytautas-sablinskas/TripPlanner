using AutoMapper;
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
    private readonly IMapper _mapper;

    public TripBudgetsService(IRepository<Traveller> travellerRepository, IRepository<AppUser> appUserRepository, IRepository<TripBudget> tripBudgetRepository, IRepository<TripBudgetMember> tripBudgetMembersRepository, IMapper mapper)
    {
        _travellersRepository = travellerRepository;
        _appUserRepository = appUserRepository;
        _tripBudgetRepository = tripBudgetRepository;
        _tripBudgetMembersRepository = tripBudgetMembersRepository;
        _mapper = mapper;
    }

    public IEnumerable<TripTravellerMinimalDto> GetTripTravellers(Guid tripId)
    {
        var travellers = _travellersRepository.FindByCondition(t => t.TripId == tripId)
            .Include(t => t.User);

        var travellerMinimalDtos = travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}"));

        return travellerMinimalDtos;
    }

    public async Task<EditBudgetCurrentInfoDto> GetEditBudgetCurrentInfo(Guid tripId, Guid budgetId)
    {
        var travellers = _travellersRepository.FindByCondition(t => t.TripId == tripId)
            .Include(t => t.User);

        var travellerMinimalDtos = await travellers.Select(t => new TripTravellerMinimalDto(t.User.Id, t.User.Email, $"{t.User.Name} {t.User.Surname}"))
            .ToListAsync();

        var budget = _tripBudgetRepository.FindByCondition(t => t.Id == budgetId)
            .Include(b => b.BudgetMembers)
            .ThenInclude(b => b.User)
            .FirstOrDefault();


        IEnumerable<TripBudgetMemberDto> budgetMembersDto = new List<TripBudgetMemberDto>();
        if (budget?.BudgetMembers?.Count > 0)
        {
            budgetMembersDto = budget.BudgetMembers.Select(b => new TripBudgetMemberDto(b.User.Email, b.Amount));
        }

        var dto = new EditBudgetCurrentInfoDto
        {
            Name = budget.Name,
            Description = budget.Description,
            MainCurrency = budget.MainCurrency,
            UnlimitedBudget = budget.UnlimitedBudget ?? false,
            Type = budget.Type,
            Amount = budget.Budget,
            BudgetMembers = budgetMembersDto,
            TripTravellers = travellerMinimalDtos,
        };

        return dto;
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

    public async Task<IEnumerable<TripBudgetDto>> GetTripBudgets(Guid tripId, string userId)
    {
        var budgets = await _tripBudgetRepository.FindByCondition(t => t.TripId == tripId && (t.CreatorId == userId || t.BudgetMembers != null && t.BudgetMembers.Any(m => m.UserId == userId)))
            .ToListAsync();

        if (budgets == null)
        {
            return new List<TripBudgetDto>();
        }

        budgets = budgets.Select((budget) =>
        {
            var member = _tripBudgetMembersRepository.FindByCondition(t => t.TripBudgetId == budget.Id && t.UserId == userId)
                .FirstOrDefault();

            if (budget.Type == BudgetTypes.IndividualWithFixedAmount && budget.CreatorId != userId)
            {
                budget.Budget = member.Amount;
            }

            return budget;
        }).ToList();

        var budgetDtos = _mapper.Map<IEnumerable<TripBudgetDto>>(budgets);
        budgetDtos = budgetDtos.Select((budget) =>
        {
            var rnd = new Random();
            // TODO: remake spent amount to whatever it's after expenses.
            budget.SpentAmount = rnd.Next(0, (int)budget.Amount);

            return budget;
        }).ToList();

        return budgetDtos;
    }

    public async Task DeleteTripBudget(Guid budgetId)
    {
        var budget = _tripBudgetRepository.FindByCondition(b => b.Id == budgetId)
            .FirstOrDefault();
        if (budget == null)
        {
            return;
        }

        await _tripBudgetRepository.Delete(budget);
    }
}